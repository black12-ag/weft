use std::collections::HashMap;
use std::sync::Arc;

use futures_util::StreamExt;
use warp_core::features::FeatureFlag;
use warp_multi_agent_api as api;

use super::convert_to::convert_input;
use super::{ConvertToAPITypeError, RequestParams, ResponseStream};
use crate::ai::agent::redaction;
use crate::server::server_api::{AIApiError, ServerApi};
use crate::terminal::model::session::SessionType;

pub async fn generate_multi_agent_output(
    server_api: Arc<ServerApi>,
    mut params: RequestParams,
    cancellation_rx: futures::channel::oneshot::Receiver<()>,
) -> Result<ResponseStream, ConvertToAPITypeError> {
    // Local CLI agents (claude/codex/gemini/agy) never touch the Warp server: we
    // shell out to the user's installed binary and synthesize the minimal
    // ResponseEvent stream (Init -> AddMessagesToTask -> Finished) ourselves so
    // the answer renders in the normal agent-mode chat.
    if params.model.as_str().starts_with("local-cli:") {
        return run_local_cli_stream(params).await;
    }

    let supported_tools = params
        .supported_tools_override
        .take()
        .unwrap_or_else(|| get_supported_tools(&params));
    let supported_cli_agent_tools = get_supported_cli_agent_tools(&params);
    let mut logging_metadata = HashMap::new();
    if let Some(metadata) = params.metadata {
        logging_metadata.insert(
            "is_autodetected_user_query".to_owned(),
            prost_types::Value {
                kind: Some(prost_types::value::Kind::BoolValue(
                    metadata.is_autodetected_user_query,
                )),
            },
        );
        logging_metadata.insert(
            "entrypoint".to_owned(),
            prost_types::Value {
                kind: Some(prost_types::value::Kind::StringValue(
                    metadata.entrypoint.entrypoint(),
                )),
            },
        );
        logging_metadata.insert(
            "is_auto_resume_after_error".to_owned(),
            prost_types::Value {
                kind: Some(prost_types::value::Kind::BoolValue(
                    metadata.is_auto_resume_after_error,
                )),
            },
        );
    }

    if params.should_redact_secrets {
        redaction::redact_inputs(&mut params.input);
    }

    let api_keys = api_keys_with_warp_credit_fallback_setting(
        params.api_keys,
        params.allow_use_of_warp_credits,
    );

    let request = api::Request {
        task_context: Some(api::request::TaskContext {
            tasks: params.tasks,
        }),
        input: Some(convert_input(params.input)?),
        settings: Some(api::request::Settings {
            model_config: Some(api::request::settings::ModelConfig {
                base: params.model.into(),
                cli_agent: params.cli_agent_model.into(),
                computer_use_agent: params.computer_use_model.into(),
                base_model_context_window_limit: params.context_window_limit.unwrap_or(0),
                ..Default::default()
            }),
            rules_enabled: params.is_memory_enabled,
            warp_drive_context_enabled: params.warp_drive_context_enabled,
            web_context_retrieval_enabled: true,
            supports_parallel_tool_calls: true,
            use_anthropic_text_editor_tools: false,
            planning_enabled: params.planning_enabled,
            supports_create_files: true,
            supported_tools: supported_tools.into_iter().map(Into::into).collect(),
            supports_long_running_commands: true,
            should_preserve_file_content_in_history: true,
            supports_todos_ui: true,
            supports_linked_code_blocks: FeatureFlag::LinkedCodeBlocks.is_enabled(),
            supports_started_child_task_message: true,
            supports_suggest_prompt: true,
            supports_read_image_files: FeatureFlag::ReadImageFiles.is_enabled(),
            supports_reasoning_message: true,
            api_keys,
            autonomy_level: params.autonomy_level.into(),
            isolation_level: params.isolation_level.into(),
            web_search_enabled: params.web_search_enabled,
            supported_cli_agent_tools: supported_cli_agent_tools
                .into_iter()
                .map(Into::into)
                .collect(),
            supports_v4a_file_diffs: FeatureFlag::V4AFileDiffs.is_enabled(),
            supports_summarization_via_message_replacement:
                FeatureFlag::SummarizationViaMessageReplacement.is_enabled(),
            supports_bundled_skills: FeatureFlag::BundledSkills.is_enabled(),
            supports_research_agent: params.research_agent_enabled,
            supports_orchestration_v2: supports_orchestration_v2(params.orchestration_enabled),
            supports_orchestration_runners: params.orchestration_enabled
                && FeatureFlag::CloudAgentRunners.is_enabled(),
            supports_background_computer_use: FeatureFlag::BackgroundComputerUse.is_enabled()
                && computer_use::background_supported(),
            custom_model_providers: params.custom_model_providers,
            custom_model_routers: params.custom_model_routers,
        }),
        metadata: Some(api::request::Metadata {
            logging: logging_metadata,
            conversation_id: params
                .conversation_token
                .as_ref()
                .map(|token| token.as_str().to_string())
                .unwrap_or_default(),
            ambient_agent_task_id: params
                .ambient_agent_task_id
                .map(|id| id.to_string())
                .unwrap_or_default(),
            forked_from_conversation_id: if params.conversation_token.is_none() {
                // We only include this param on our initial request to the server
                // (when the forked conversation has not been assigned a new id yet).
                params
                    .forked_from_conversation_token
                    .map(|token| token.as_str().to_string())
                    .unwrap_or_default()
            } else {
                String::new()
            },
            parent_agent_id: params.parent_agent_id.unwrap_or_default(),
            agent_name: params.agent_name.unwrap_or_default(),
        }),
        existing_suggestions: params
            .existing_suggestions
            .map(|suggestions| suggestions.into()),
        mcp_context: params.mcp_context.map(Into::into),
    };

    let response_stream =
        warp_multi_agent_client::generate_multi_agent_output(server_api.as_ref(), &request).await;
    match response_stream {
        Ok(stream) => {
            let output_stream = stream
                .then(|result| async {
                    match result {
                        Ok(event) => Ok(event),
                        Err(error) => Err(convert_multi_agent_client_error(error).await),
                    }
                })
                .take_until(cancellation_rx);
            Ok(Box::pin(output_stream))
        }
        Err(e) => {
            let (tx, rx) = async_channel::unbounded();
            let _ = tx
                .send(Err(convert_multi_agent_client_error(e).await))
                .await;
            Ok(Box::pin(rx))
        }
    }
}

/// Runs a `local-cli:<agent>:<model>` request by invoking the user's locally
/// installed CLI agent and streaming back a synthetic multi-agent response.
///
/// The child process runs on a dedicated `std::thread` with a hard timeout so
/// the async UI never blocks; results are piped back over an `async_channel`
/// receiver that already satisfies `ResponseStream`. Spawn failures, non-zero
/// exits and timeouts are rendered as the agent's text so the user always sees
/// a message in the conversation.
async fn run_local_cli_stream(
    params: RequestParams,
) -> Result<ResponseStream, ConvertToAPITypeError> {
    let (tx, rx) = async_channel::unbounded::<Result<api::ResponseEvent, Arc<AIApiError>>>();

    let model_spec = params.model.as_str().to_string();

    // Build the FULL conversation transcript from the task messages and feed it in
    // the prompt, so ANY CLI agent (claude/codex/gemini) has the complete memory.
    // This is what lets the user switch models mid-chat and keep context, without
    // relying on each CLI's own per-agent session store (which breaks on switch
    // with "session not found" / "already in use").
    let new_query = params
        .input
        .iter()
        .rev()
        .find_map(|input| input.user_query())
        .unwrap_or_default();
    let mut transcript = String::new();
    for task in &params.tasks {
        for msg in &task.messages {
            match &msg.message {
                Some(api::message::Message::UserQuery(uq)) => {
                    let q = uq.query.trim();
                    if !q.is_empty() {
                        transcript.push_str("User: ");
                        transcript.push_str(q);
                        transcript.push_str("\n\n");
                    }
                }
                Some(api::message::Message::AgentOutput(ao)) => {
                    let t = ao.text.trim();
                    // Skip our own status lines (token usage, tools/memory
                    // confirmations) — replaying them as "Assistant:" turns
                    // pollutes every future prompt.
                    let is_status = t.starts_with("🔢")
                        || t.starts_with("🛠️")
                        || t.starts_with("⚡")
                        || t.starts_with("🧠");
                    if !t.is_empty() && !is_status {
                        transcript.push_str("Assistant: ");
                        transcript.push_str(t);
                        transcript.push_str("\n\n");
                    }
                }
                _ => {}
            }
        }
    }
    // Ensure the current question is the final user turn.
    let final_user = format!("User: {}", new_query.trim());
    if !new_query.trim().is_empty() && !transcript.contains(&final_user) {
        transcript.push_str(&final_user);
        transcript.push_str("\n\n");
    }
    // Bound the replayed history so long chats stay fast: keep the most recent
    // ~30k chars (the Obsidian brain carries older context via read_memory).
    const TRANSCRIPT_MAX_CHARS: usize = 30_000;
    if transcript.chars().count() > TRANSCRIPT_MAX_CHARS {
        let chars: Vec<char> = transcript.chars().collect();
        let tail: String = chars[chars.len() - TRANSCRIPT_MAX_CHARS..].iter().collect();
        // Start at the next full turn boundary so we don't begin mid-sentence.
        transcript = match tail.find("\n\nUser: ").or_else(|| tail.find("\n\nAssistant: ")) {
            Some(pos) => format!("(Earlier conversation trimmed.)\n{}", &tail[pos + 2..]),
            None => tail,
        };
    }
    let prompt = if transcript.trim().is_empty() {
        new_query.clone()
    } else {
        format!("{transcript}Assistant:")
    };

    let conversation_id = params
        .conversation_token
        .as_ref()
        .map(|token| token.as_str().to_string())
        .filter(|token| !token.is_empty())
        .unwrap_or_else(|| uuid::Uuid::new_v4().to_string());
    // Task handling: on the FIRST turn the conversation has an un-upgraded
    // optimistic root task and `params.tasks` is empty, so we mint a task id and
    // upgrade the root via CreateTask. On FOLLOW-UP turns the task already exists
    // (with server data) in `params.tasks`; upgrading it again fails with
    // UnexpectedUpgrade, so we reuse its id and skip CreateTask.
    let existing_task_id = params
        .tasks
        .first()
        .map(|task| task.id.clone())
        .filter(|id| !id.is_empty());
    let need_create_task = existing_task_id.is_none();
    let task_id = existing_task_id.unwrap_or_else(|| uuid::Uuid::new_v4().to_string());

    // The user's current shell directory, so agentic CLIs (codex) read/run in
    // the right project instead of some default location.
    let cwd: Option<String> = params.session_context.current_working_directory().clone();

    // Chat commands: `tools on|off` (fast vs full-MCP) and `memory on|off|clear`.
    let tools_toggle = parse_tools_command(&new_query);
    let memory_cmd = parse_memory_command(&new_query);
    let user_question = new_query.clone();

    // Prepend this project's saved memory so every model recalls past sessions
    // (real questions only, not the toggle commands themselves).
    let prompt = if tools_toggle.is_none() && memory_cmd.is_none() {
        let mem = read_memory(cwd.as_deref());
        if mem.is_empty() {
            prompt
        } else {
            format!("{mem}{prompt}")
        }
    } else {
        prompt
    };

    std::thread::spawn(move || {
        // Parse `local-cli:<agent>:<model>[:<effort>]`. The optional 4th
        // segment is the reasoning/thinking level (e.g. codex "high").
        let mut parts = model_spec.splitn(4, ':');
        let _scheme = parts.next();
        let agent = parts.next().unwrap_or("").to_string();
        let model = parts.next().unwrap_or("").to_string();
        let effort = parts.next().filter(|s| !s.is_empty()).map(|s| s.to_string());

        let request_id = uuid::Uuid::new_v4().to_string();

        // 1) Init — mandatory first event.
        let _ = tx.send_blocking(Ok(api::ResponseEvent {
            r#type: Some(api::response_event::Type::Init(
                api::response_event::StreamInit {
                    request_id: request_id.clone(),
                    conversation_id,
                    ..Default::default()
                },
            )),
        }));

        // 2) CreateTask — ONLY on the first turn, to upgrade the conversation's
        //    optimistic root task to our task_id (no parent_id => root-upgrade
        //    branch). On follow-ups the task already exists (with server data) and
        //    re-upgrading it fails with UnexpectedUpgrade, so we skip it.
        if need_create_task {
            let _ = tx.send_blocking(Ok(api::ResponseEvent {
                r#type: Some(api::response_event::Type::ClientActions(
                    api::response_event::ClientActions {
                        actions: vec![api::ClientAction {
                            action: Some(api::client_action::Action::CreateTask(
                                api::client_action::CreateTask {
                                    task: Some(api::Task {
                                        id: task_id.clone(),
                                        ..Default::default()
                                    }),
                                },
                            )),
                        }],
                    },
                )),
            }));
        }

        // Emit (upsert) a message by id. Re-emitting the same id UPDATES the
        // message in place (Task::upsert_message), so we grow ONE Thinking block
        // and ONE answer block live instead of many chopped-up pieces.
        let emit_message = |id: String, msg: api::message::Message| {
            let message = api::Message {
                id,
                task_id: task_id.clone(),
                request_id: request_id.clone(),
                message: Some(msg),
                ..Default::default()
            };
            let _ = tx.send_blocking(Ok(api::ResponseEvent {
                r#type: Some(api::response_event::Type::ClientActions(
                    api::response_event::ClientActions {
                        actions: vec![api::ClientAction {
                            action: Some(api::client_action::Action::AddMessagesToTask(
                                api::client_action::AddMessagesToTask {
                                    task_id: task_id.clone(),
                                    messages: vec![message],
                                },
                            )),
                        }],
                    },
                )),
            }));
        };
        let fresh_id = || uuid::Uuid::new_v4().to_string();
        let mut final_answer = String::new();

        // 3) Run the CLI and emit its output. Claude and Codex stream JSON, so we
        //    surface live thinking + tool steps as a collapsible Thinking block
        //    above the answer; other CLIs return plain text in a single message.
        if let Some(cmd) = memory_cmd {
            let text = match cmd {
                MemoryCommand::On => {
                    set_memory_enabled(true);
                    "🧠 Memory ON — each session is saved to your Obsidian vault (a `WarpOss/` folder) and this project's past sessions are recalled automatically. `memory off` to stop · `memory clear` to wipe this project.".to_string()
                }
                MemoryCommand::Off => {
                    set_memory_enabled(false);
                    "🧠 Memory OFF — nothing is saved or recalled. Say `memory on` to re-enable.".to_string()
                }
                MemoryCommand::Clear => {
                    clear_memory(cwd.as_deref());
                    "🧠 Memory cleared for this project.".to_string()
                }
            };
            emit_message(
                fresh_id(),
                api::message::Message::AgentOutput(api::message::AgentOutput { text }),
            );
        } else if let Some(on) = tools_toggle {
            // A `tools on|off` command: flip the mode and confirm, no CLI call.
            set_tools_enabled(on);
            let text = if on {
                "🛠️ Tools mode ON — the CLIs now use your full personal config (all your MCP servers + skills from ~/.codex, ~/.claude). More power, slower startup. Say `tools off` to go fast again.".to_string()
            } else {
                "⚡ Fast mode ON — no MCP loading; quick answers with built-in tools (read files, run commands). Say `tools on` to load your MCP servers + skills.".to_string()
            };
            emit_message(
                fresh_id(),
                api::message::Message::AgentOutput(api::message::AgentOutput { text }),
            );
        } else if prompt.trim().is_empty() {
            emit_message(
                fresh_id(),
                api::message::Message::AgentOutput(api::message::AgentOutput {
                    text: "No prompt was provided to the local CLI agent.".to_string(),
                }),
            );
        } else if agent == "claude" {
            let reasoning_id = fresh_id();
            let output_id = fresh_id();
            let mut reasoning_acc = String::new();
            let mut output_acc = String::new();
            let mut produced_output = false;
            let started = std::time::Instant::now();
            let last_emit = std::cell::Cell::new(std::time::Instant::now());
            run_claude_streaming(
                &model,
                effort.as_deref(),
                &prompt,
                std::time::Duration::from_secs(300),
                |block| {
                    accumulate_block(
                        block,
                        &emit_message,
                        &fresh_id,
                        &reasoning_id,
                        &output_id,
                        &mut reasoning_acc,
                        &mut output_acc,
                        &mut produced_output,
                        &last_emit,
                    )
                },
            );
            // Flush the final answer (the last throttled tokens) as one upsert.
            if produced_output {
                emit_message(
                    output_id.clone(),
                    api::message::Message::AgentOutput(api::message::AgentOutput {
                        text: output_acc.clone(),
                    }),
                );
            }
            finish_reasoning(&emit_message, &reasoning_id, &reasoning_acc, started);
            final_answer = output_acc;
            if !produced_output {
                let (bin, args) =
                    build_local_cli_invocation(&agent, &model, effort.as_deref(), &prompt);
                let mut cmd = std::process::Command::new(&bin);
                cmd.args(&args);
                let text = run_local_cli_with_timeout(cmd, std::time::Duration::from_secs(180));
                final_answer = text.clone();
                emit_message(
                    fresh_id(),
                    api::message::Message::AgentOutput(api::message::AgentOutput { text }),
                );
            }
        } else if agent == "codex" {
            // Codex runs agentically: it can read files / run commands in the
            // user's project and streams each step, which we surface live.
            let reasoning_id = fresh_id();
            let output_id = fresh_id();
            let mut reasoning_acc = String::new();
            let mut output_acc = String::new();
            let mut produced_output = false;
            let started = std::time::Instant::now();
            let last_emit = std::cell::Cell::new(std::time::Instant::now());
            run_codex_streaming(
                &model,
                effort.as_deref(),
                &prompt,
                cwd.as_deref(),
                std::time::Duration::from_secs(300),
                |block| {
                    accumulate_block(
                        block,
                        &emit_message,
                        &fresh_id,
                        &reasoning_id,
                        &output_id,
                        &mut reasoning_acc,
                        &mut output_acc,
                        &mut produced_output,
                        &last_emit,
                    )
                },
            );
            // Flush the final answer (the last throttled tokens) as one upsert.
            if produced_output {
                emit_message(
                    output_id.clone(),
                    api::message::Message::AgentOutput(api::message::AgentOutput {
                        text: output_acc.clone(),
                    }),
                );
            }
            finish_reasoning(&emit_message, &reasoning_id, &reasoning_acc, started);
            final_answer = output_acc;
            if !produced_output {
                let (bin, args) =
                    build_local_cli_invocation(&agent, &model, effort.as_deref(), &prompt);
                let mut cmd = std::process::Command::new(&bin);
                cmd.args(&args);
                if let Some(codex_home) = prepare_codex_home() {
                    cmd.env("CODEX_HOME", codex_home);
                }
                if let Some(dir) = cwd
                    .as_deref()
                    .filter(|d| !d.is_empty() && std::path::Path::new(d).is_dir())
                {
                    cmd.current_dir(dir);
                }
                let text = run_local_cli_with_timeout(cmd, std::time::Duration::from_secs(180));
                final_answer = text.clone();
                emit_message(
                    fresh_id(),
                    api::message::Message::AgentOutput(api::message::AgentOutput { text }),
                );
            }
        } else {
            let (bin, args) =
                build_local_cli_invocation(&agent, &model, effort.as_deref(), &prompt);
            let mut cmd = std::process::Command::new(&bin);
            cmd.args(&args);
            let text = run_local_cli_with_timeout(cmd, std::time::Duration::from_secs(180));
            final_answer = text.clone();
            emit_message(
                fresh_id(),
                api::message::Message::AgentOutput(api::message::AgentOutput { text }),
            );
        }

        // Persist this exchange to the project's brain (Obsidian) so every model
        // recalls it next time. Skipped for commands / empty answers.
        append_memory(
            cwd.as_deref(),
            &agent,
            &model,
            &user_question,
            &final_answer,
        );

        // 3) Finished(Done) — mandatory; a missing Finished triggers
        //    UnexpectedEof recovery on the consumer side.
        let _ = tx.send_blocking(Ok(api::ResponseEvent {
            r#type: Some(api::response_event::Type::Finished(
                api::response_event::StreamFinished {
                    reason: Some(api::response_event::stream_finished::Reason::Done(
                        api::response_event::stream_finished::Done {},
                    )),
                    ..Default::default()
                },
            )),
        }));
        // Dropping `tx` here ends the stream.
    });

    Ok(Box::pin(rx))
}

/// A parsed chunk of streamed CLI output. `*Delta` variants are incremental
/// token chunks (appended raw, for live typing); the plain variants are complete
/// segments (joined with a blank line).
enum CliBlock {
    Reasoning(String),
    ReasoningDelta(String),
    Output(String),
    OutputDelta(String),
    Usage(String),
}

/// Folds a streamed `CliBlock` into the growing Thinking block (`reasoning_id`)
/// and answer block (`output_id`), re-emitting each via upsert so they render as
/// ONE continuous block rather than many chopped-up pieces. Usage lines get a
/// fresh id (their own small trailing message).
#[allow(clippy::too_many_arguments)]
fn accumulate_block(
    block: CliBlock,
    emit_message: &impl Fn(String, api::message::Message),
    fresh_id: &impl Fn() -> String,
    reasoning_id: &str,
    output_id: &str,
    reasoning_acc: &mut String,
    output_acc: &mut String,
    produced_output: &mut bool,
    last_emit: &std::cell::Cell<std::time::Instant>,
) {
    // Live token deltas arrive hundreds of times a second. We ALWAYS accumulate,
    // but only push an updated block to the UI at most every ~80ms (a stable id
    // means each push upserts the same block). This keeps the render smooth and,
    // crucially, avoids flooding the shared-session/remote-control replay with a
    // per-token event storm. `finish_reasoning` + the post-stream flush send the
    // final complete text, so nothing is lost.
    // Reserved for a future live-typing mode once the shared-session/remote-control
    // replay dedupes upserts by id.
    let _ = (reasoning_id, output_id, last_emit);
    match block {
        CliBlock::Reasoning(s) => {
            if !reasoning_acc.is_empty() {
                reasoning_acc.push_str("\n\n");
            }
            reasoning_acc.push_str(&s);
        }
        CliBlock::ReasoningDelta(s) => {
            reasoning_acc.push_str(&s);
        }
        CliBlock::Output(s) => {
            *produced_output = true;
            if !output_acc.is_empty() {
                output_acc.push_str("\n\n");
            }
            output_acc.push_str(&s);
        }
        CliBlock::OutputDelta(s) => {
            *produced_output = true;
            output_acc.push_str(&s);
        }
        CliBlock::Usage(s) => {
            emit_message(
                fresh_id(),
                api::message::Message::AgentOutput(api::message::AgentOutput { text: s }),
            );
        }
    }
}

/// Marks the accumulated Thinking block finished (sets `finished_duration`), so
/// the UI auto-collapses it to "Thought for Xs" with the dropdown still there.
fn finish_reasoning(
    emit_message: &impl Fn(String, api::message::Message),
    reasoning_id: &str,
    reasoning_acc: &str,
    started: std::time::Instant,
) {
    if !reasoning_acc.is_empty() {
        emit_message(
            reasoning_id.to_string(),
            api::message::Message::AgentReasoning(api::message::AgentReasoning {
                reasoning: reasoning_acc.to_string(),
                finished_duration: Some(prost_types::Duration {
                    seconds: started.elapsed().as_secs() as i64,
                    nanos: 0,
                }),
            }),
        );
    }
}

/// Compact token count: 23284 -> "23.3k", 340 -> "340".
fn fmt_tokens(n: u64) -> String {
    if n >= 1000 {
        format!("{:.1}k", n as f64 / 1000.0)
    } else {
        n.to_string()
    }
}

/// Parses one line of Claude's `--output-format stream-json` output, pushing any
/// thinking/text content blocks (and the final token usage) onto the channel.
/// Non-JSON or unrelated lines (system/rate-limit events) are ignored.
fn parse_claude_line(line: &str, btx: &std::sync::mpsc::Sender<CliBlock>) {
    let value: serde_json::Value = match serde_json::from_str(line.trim()) {
        Ok(v) => v,
        Err(_) => return,
    };
    // Final `result` event carries token usage + duration.
    if value.get("type").and_then(|t| t.as_str()) == Some("result") {
        let get = |k: &str| {
            value
                .get("usage")
                .and_then(|u| u.get(k))
                .and_then(|v| v.as_u64())
                .unwrap_or(0)
        };
        let dur_ms = value
            .get("duration_ms")
            .and_then(|v| v.as_u64())
            .unwrap_or(0);
        let line = format!(
            "🔢 {} in · {} out · {} cached · {:.1}s",
            fmt_tokens(get("input_tokens")),
            fmt_tokens(get("output_tokens")),
            fmt_tokens(get("cache_read_input_tokens")),
            dur_ms as f64 / 1000.0,
        );
        let _ = btx.send(CliBlock::Usage(line));
        return;
    }
    // With `--include-partial-messages`, claude streams token-by-token via
    // `stream_event` → `content_block_delta`. We emit those live as *Delta chunks
    // (and ignore the final complete `assistant` block, which would duplicate them).
    if value.get("type").and_then(|t| t.as_str()) == Some("stream_event") {
        let Some(delta) = value.pointer("/event/delta") else {
            return;
        };
        match delta.get("type").and_then(|t| t.as_str()) {
            Some("thinking_delta") => {
                if let Some(s) = delta.get("thinking").and_then(|x| x.as_str())
                    && !s.is_empty()
                {
                    let _ = btx.send(CliBlock::ReasoningDelta(s.to_string()));
                }
            }
            Some("text_delta") => {
                if let Some(s) = delta.get("text").and_then(|x| x.as_str())
                    && !s.is_empty()
                {
                    let _ = btx.send(CliBlock::OutputDelta(s.to_string()));
                }
            }
            _ => {}
        }
    }
}

/// Generic streaming runner: spawns `cmd`, reads its stdout line-by-line on a
/// reader thread that parses each line into `CliBlock`s via `parse`, and emits
/// them to `on_block` live while enforcing a hard timeout (kills the child).
fn run_cli_streaming(
    mut cmd: std::process::Command,
    timeout: std::time::Duration,
    parse: fn(&str, &std::sync::mpsc::Sender<CliBlock>),
    mut on_block: impl FnMut(CliBlock),
) {
    use std::io::BufRead;

    cmd.stdin(std::process::Stdio::null())
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::null());
    let mut child = match cmd.spawn() {
        Ok(child) => child,
        Err(_) => return,
    };
    let Some(stdout) = child.stdout.take() else {
        return;
    };

    // Reader thread: parse each JSONL line into CliBlocks and push them over a
    // channel so the main thread can emit them (and enforce the timeout) live.
    let (btx, brx) = std::sync::mpsc::channel::<CliBlock>();
    let reader = std::thread::spawn(move || {
        let mut rdr = std::io::BufReader::new(stdout);
        let mut line = String::new();
        loop {
            line.clear();
            match rdr.read_line(&mut line) {
                Ok(0) | Err(_) => break,
                Ok(_) => parse(&line, &btx),
            }
        }
    });

    let start = std::time::Instant::now();
    loop {
        while let Ok(block) = brx.try_recv() {
            on_block(block);
        }
        match child.try_wait() {
            Ok(Some(_)) => break,
            Ok(None) => {
                if start.elapsed() >= timeout {
                    let _ = child.kill();
                    let _ = child.wait();
                    break;
                }
                std::thread::sleep(std::time::Duration::from_millis(30));
            }
            Err(_) => break,
        }
    }
    let _ = reader.join();
    while let Ok(block) = brx.try_recv() {
        on_block(block);
    }
}

/// Runs the Claude CLI in streaming-JSON mode so we can surface its live thinking.
fn run_claude_streaming(
    model: &str,
    effort: Option<&str>,
    prompt: &str,
    timeout: std::time::Duration,
    on_block: impl FnMut(CliBlock),
) {
    let mut args = vec![
        "-p".to_string(),
        prompt.to_string(),
        "--model".to_string(),
        model.to_string(),
        "--output-format".to_string(),
        "stream-json".to_string(),
        "--verbose".to_string(),
        // Stream token-by-token so the answer + thinking type out live.
        "--include-partial-messages".to_string(),
    ];
    if let Some(eff) = effort {
        args.push("--effort".to_string());
        args.push(eff.to_string());
    }
    // Fast mode: skip loading the user's plugins/skills/hooks/settings/MCP —
    // claude otherwise scans multi-GB `~/.claude/plugins` + `skills` on every
    // call (~11s → ~3s). Keychain auth is preserved. In tools mode, load the
    // full config so all the user's skills/MCP are available.
    if !tools_enabled() {
        args.push("--setting-sources".to_string());
        args.push(String::new());
        args.push("--strict-mcp-config".to_string());
        args.push("--mcp-config".to_string());
        // Only the servers you left enabled in Settings (default: all). MCP tools
        // work, but the multi-GB plugins/skills scan is still skipped.
        args.push(selected_claude_mcp_config());
    }
    let mut cmd = std::process::Command::new(resolve_local_cli_binary("claude"));
    cmd.args(&args);
    run_cli_streaming(cmd, timeout, parse_claude_line, on_block);
}

/// Parses one line of Codex's `exec --json` output into CliBlocks: reasoning,
/// tool activity (shell commands it ran, shown as a step), the answer, and the
/// final token usage. Non-fatal warnings from the user's global setup are hidden.
fn parse_codex_line(line: &str, btx: &std::sync::mpsc::Sender<CliBlock>) {
    let value: serde_json::Value = match serde_json::from_str(line.trim()) {
        Ok(v) => v,
        Err(_) => return,
    };
    match value.get("type").and_then(|t| t.as_str()) {
        Some("item.completed") => {
            let Some(item) = value.get("item") else {
                return;
            };
            match item.get("type").and_then(|t| t.as_str()) {
                Some("reasoning") => {
                    if let Some(s) = item.get("text").and_then(|x| x.as_str())
                        && !s.trim().is_empty()
                    {
                        let _ = btx.send(CliBlock::Reasoning(s.to_string()));
                    }
                }
                Some("agent_message") => {
                    if let Some(s) = item.get("text").and_then(|x| x.as_str())
                        && !s.trim().is_empty()
                    {
                        let _ = btx.send(CliBlock::Output(s.to_string()));
                    }
                }
                Some("command_execution") => {
                    let cmd = item
                        .get("command")
                        .and_then(|x| x.as_str())
                        .unwrap_or("")
                        .trim();
                    let out = item
                        .get("aggregated_output")
                        .and_then(|x| x.as_str())
                        .unwrap_or("")
                        .trim();
                    let mut text = format!("⚙️ Ran `{cmd}`");
                    if !out.is_empty() {
                        let preview: String = out.chars().take(600).collect();
                        text.push('\n');
                        text.push_str(&preview);
                        if out.chars().count() > 600 {
                            text.push_str("\n…");
                        }
                    }
                    let _ = btx.send(CliBlock::Reasoning(text));
                }
                Some("error") => {
                    if let Some(m) = item.get("message").and_then(|x| x.as_str())
                        && !m.contains("skills context budget")
                        && !m.contains("Under-development")
                    {
                        let _ = btx.send(CliBlock::Reasoning(format!("⚠️ {}", m.trim())));
                    }
                }
                _ => {}
            }
        }
        Some("turn.completed") => {
            let get = |k: &str| {
                value
                    .get("usage")
                    .and_then(|u| u.get(k))
                    .and_then(|x| x.as_u64())
                    .unwrap_or(0)
            };
            let line = format!(
                "🔢 {} in · {} out · {} cached",
                fmt_tokens(get("input_tokens")),
                fmt_tokens(get("output_tokens")),
                fmt_tokens(get("cached_input_tokens")),
            );
            let _ = btx.send(CliBlock::Usage(line));
        }
        Some("turn.failed") => {
            let m = value
                .pointer("/error/message")
                .and_then(|x| x.as_str())
                .unwrap_or("codex turn failed");
            let _ = btx.send(CliBlock::Output(format!("Codex error: {}", m.trim())));
        }
        _ => {}
    }
}

/// Runs the Codex CLI agentically (`exec --json`, read-only sandbox) in the
/// user's working directory so it can read files / run commands, streaming each
/// step live. Uses the MCP-free clean home for fast startup.
fn run_codex_streaming(
    model: &str,
    effort: Option<&str>,
    prompt: &str,
    cwd: Option<&str>,
    timeout: std::time::Duration,
    on_block: impl FnMut(CliBlock),
) {
    let eff = effort.unwrap_or("low");
    let args = vec![
        "exec".to_string(),
        "--json".to_string(),
        "--skip-git-repo-check".to_string(),
        "-s".to_string(),
        "read-only".to_string(),
        "-m".to_string(),
        model.to_string(),
        "-c".to_string(),
        format!("model_reasoning_effort={eff}"),
        prompt.to_string(),
    ];
    let mut cmd = std::process::Command::new(resolve_local_cli_binary("codex"));
    cmd.args(&args);
    if let Some(home) = prepare_codex_home() {
        cmd.env("CODEX_HOME", home);
    }
    if let Some(dir) = cwd.filter(|d| !d.is_empty() && std::path::Path::new(d).is_dir()) {
        cmd.current_dir(dir);
    }
    run_cli_streaming(cmd, timeout, parse_codex_line, on_block);
}

/// Path of the "tools mode" flag file. When it exists, the CLIs run with their
/// full personal config (all MCP servers + skills). When absent (default), they
/// run in a fast, MCP-free mode. Toggled from the chat with `tools on|off`.
fn tools_flag_path() -> Option<std::path::PathBuf> {
    let home = std::env::var("HOME").ok()?;
    Some(std::path::PathBuf::from(home).join(".warposs/tools_on"))
}

/// True when the user has enabled full tools mode (MCP + skills) via `tools on`.
fn tools_enabled() -> bool {
    tools_flag_path().map(|p| p.exists()).unwrap_or(false)
}

/// Turns tools mode on/off by creating/removing the flag file.
fn set_tools_enabled(on: bool) {
    let Some(path) = tools_flag_path() else {
        return;
    };
    if on {
        if let Some(dir) = path.parent() {
            let _ = std::fs::create_dir_all(dir);
        }
        let _ = std::fs::write(&path, b"1");
    } else {
        let _ = std::fs::remove_file(&path);
    }
}

/// Parses a `tools on` / `tools off` chat command (case-insensitive). Returns
/// Some(true/false) when the message is a toggle, else None.
fn parse_tools_command(query: &str) -> Option<bool> {
    match query.trim().to_lowercase().as_str() {
        "tools on" | "/tools on" | "enable tools" | "tools" => Some(true),
        "tools off" | "/tools off" | "disable tools" | "fast" | "fast mode" => Some(false),
        _ => None,
    }
}

// ------------------------- MCP servers (Step 1) -----------------------------
// Each CLI (claude/codex/gemini) configures its own MCP servers. Weft lists them
// in Settings with per-server on/off toggles. Default: OFF, so speed is never
// regressed — the fast baseline (no MCP, no scan) is unchanged until you opt in.
// Turning a server ON passes it to the CLI EXPLICITLY, so its tools work while
// the multi-GB plugins/skills scan stays skipped. The slow part is not the scan
// — it is each server booting per call — so the warm MCP host (Step 2) will keep
// enabled servers running and can then flip the default to on-and-fast.

/// The MCP selection file: a JSON array of ENABLED "cli/server" keys. Absent or
/// empty => no MCP servers (the fast baseline, unchanged).
fn mcp_selection_path() -> Option<std::path::PathBuf> {
    let home = std::env::var("HOME").ok()?;
    Some(std::path::PathBuf::from(home).join(".warposs/mcp_enabled.json"))
}

/// The set of enabled "cli/server" keys (default: empty = none on).
fn mcp_enabled_set() -> std::collections::HashSet<String> {
    let mut set = std::collections::HashSet::new();
    if let Some(path) = mcp_selection_path()
        && let Ok(text) = std::fs::read_to_string(&path)
        && let Ok(serde_json::Value::Array(items)) =
            serde_json::from_str::<serde_json::Value>(&text)
    {
        for item in items {
            if let Some(key) = item.as_str() {
                set.insert(key.to_string());
            }
        }
    }
    set
}

/// Whether a CLI's MCP server is enabled. OFF by default — only servers you
/// switched on in Settings are passed to the CLI, so replies stay fast.
pub fn mcp_server_enabled(cli: &str, server: &str) -> bool {
    mcp_enabled_set().contains(&format!("{cli}/{server}"))
}

/// Turns one CLI's MCP server on/off, persisting the choice to the selection file.
pub fn set_mcp_server_enabled(cli: &str, server: &str, on: bool) {
    let Some(path) = mcp_selection_path() else {
        return;
    };
    let mut set = mcp_enabled_set();
    let key = format!("{cli}/{server}");
    if on {
        set.insert(key);
    } else {
        set.remove(&key);
    }
    if let Some(dir) = path.parent() {
        let _ = std::fs::create_dir_all(dir);
    }
    let mut list: Vec<String> = set.into_iter().collect();
    list.sort();
    if let Ok(text) = serde_json::to_string_pretty(&list) {
        let _ = std::fs::write(&path, text);
    }
}

/// The MCP server names a CLI has configured (read from that CLI's own config).
/// Drives the Settings list. `cli` is "claude", "codex" or "gemini".
pub fn discover_mcp_servers(cli: &str) -> Vec<String> {
    let Ok(home) = std::env::var("HOME") else {
        return Vec::new();
    };
    let json_keys = |path: String| -> Vec<String> {
        std::fs::read_to_string(path)
            .ok()
            .and_then(|s| serde_json::from_str::<serde_json::Value>(&s).ok())
            .and_then(|v| {
                v.get("mcpServers")
                    .and_then(|m| m.as_object())
                    .map(|o| o.keys().cloned().collect())
            })
            .unwrap_or_default()
    };
    let mut names = match cli {
        "claude" => json_keys(format!("{home}/.claude.json")),
        "gemini" => json_keys(format!("{home}/.gemini/settings.json")),
        "codex" => std::fs::read_to_string(format!("{home}/.codex/config.toml"))
            .ok()
            .and_then(|s| s.parse::<toml::Value>().ok())
            .and_then(|v| {
                v.get("mcp_servers")
                    .and_then(|m| m.as_table())
                    .map(|t| t.keys().cloned().collect())
            })
            .unwrap_or_default(),
        _ => Vec::new(),
    };
    names.sort();
    names
}

/// Claude's `--mcp-config` value for fast mode: only the ENABLED servers from
/// `~/.claude.json`, so their MCP tools are available without the multi-GB scan.
fn selected_claude_mcp_config() -> String {
    let empty = "{\"mcpServers\":{}}".to_string();
    let Ok(home) = std::env::var("HOME") else {
        return empty;
    };
    let Ok(text) = std::fs::read_to_string(format!("{home}/.claude.json")) else {
        return empty;
    };
    let Ok(value) = serde_json::from_str::<serde_json::Value>(&text) else {
        return empty;
    };
    let Some(servers) = value.get("mcpServers").and_then(|m| m.as_object()) else {
        return empty;
    };
    let mut enabled = serde_json::Map::new();
    for (name, def) in servers {
        if mcp_server_enabled("claude", name) {
            enabled.insert(name.clone(), def.clone());
        }
    }
    serde_json::json!({ "mcpServers": enabled }).to_string()
}

/// The `[mcp_servers.*]` TOML for Codex's clean home: only the ENABLED servers,
/// copied from the user's real `~/.codex/config.toml`. Empty string => none.
fn selected_codex_mcp_toml() -> String {
    let Ok(home) = std::env::var("HOME") else {
        return String::new();
    };
    let Ok(text) = std::fs::read_to_string(format!("{home}/.codex/config.toml")) else {
        return String::new();
    };
    let Ok(toml::Value::Table(root)) = text.parse::<toml::Value>() else {
        return String::new();
    };
    let Some(toml::Value::Table(servers)) = root.get("mcp_servers") else {
        return String::new();
    };
    let mut enabled = toml::value::Table::new();
    for (name, def) in servers {
        if mcp_server_enabled("codex", name) {
            enabled.insert(name.clone(), def.clone());
        }
    }
    if enabled.is_empty() {
        return String::new();
    }
    let mut wrapper = toml::value::Table::new();
    wrapper.insert("mcp_servers".to_string(), toml::Value::Table(enabled));
    toml::to_string_pretty(&toml::Value::Table(wrapper)).unwrap_or_default()
}

// ------------------------- Memory ("brain") ---------------------------------
// Past sessions are saved as markdown notes in the user's Obsidian vault (a
// `WarpOss/` folder), one file per project, so EVERY model shares one
// persistent, human-readable memory. Toggled with `memory on|off|clear`.

/// The brain folder: the user's Obsidian vault `WarpOss/` subfolder if the vault
/// exists, otherwise a standalone markdown folder Obsidian can also open.
fn brain_dir() -> Option<std::path::PathBuf> {
    let home = std::env::var("HOME").ok()?;
    let vault = std::path::PathBuf::from(&home).join("Documents/Second Brain");
    if vault.is_dir() {
        Some(vault.join("WarpOss"))
    } else {
        Some(std::path::PathBuf::from(&home).join(".warposs/brain"))
    }
}

/// A filesystem-safe project key derived from the working directory's name.
fn project_key(cwd: Option<&str>) -> String {
    let raw = cwd
        .and_then(|c| std::path::Path::new(c).file_name())
        .map(|f| f.to_string_lossy().to_string())
        .unwrap_or_default();
    let key: String = raw
        .chars()
        .map(|c| {
            if c.is_alphanumeric() || c == '-' || c == '_' || c == '.' {
                c
            } else {
                '-'
            }
        })
        .collect();
    let key = key.trim_matches('-').to_string();
    if key.is_empty() {
        "general".to_string()
    } else {
        key
    }
}

fn project_brain_file(cwd: Option<&str>) -> Option<std::path::PathBuf> {
    Some(brain_dir()?.join(format!("{}.md", project_key(cwd))))
}

fn memory_off_flag() -> Option<std::path::PathBuf> {
    let home = std::env::var("HOME").ok()?;
    Some(std::path::PathBuf::from(home).join(".warposs/memory_off"))
}

/// Memory is on by default; the flag file's presence disables it.
fn memory_enabled() -> bool {
    memory_off_flag().map(|p| !p.exists()).unwrap_or(true)
}

fn set_memory_enabled(on: bool) {
    let Some(flag) = memory_off_flag() else {
        return;
    };
    if on {
        let _ = std::fs::remove_file(&flag);
    } else {
        if let Some(dir) = flag.parent() {
            let _ = std::fs::create_dir_all(dir);
        }
        let _ = std::fs::write(&flag, b"1");
    }
}

fn clear_memory(cwd: Option<&str>) {
    if let Some(file) = project_brain_file(cwd) {
        let _ = std::fs::remove_file(&file);
    }
}

/// This project's saved memory as a prompt-ready section (tail-bounded), or
/// empty when disabled / none exists.
fn read_memory(cwd: Option<&str>) -> String {
    if !memory_enabled() {
        return String::new();
    }
    let Some(file) = project_brain_file(cwd) else {
        return String::new();
    };
    let content = std::fs::read_to_string(&file).unwrap_or_default();
    let content = content.trim();
    if content.is_empty() {
        return String::new();
    }
    // Keep only the most recent ~6000 chars so long histories stay fast.
    let chars: Vec<char> = content.chars().collect();
    let start = chars.len().saturating_sub(6000);
    let tail: String = chars[start..].iter().collect();
    format!(
        "# Memory from earlier sessions in this project\n\
         (Notes you saved previously — use them as context.)\n\n{tail}\n\n\
         # Current conversation\n\n"
    )
}

/// Appends a Q/A exchange to this project's brain note (markdown).
fn append_memory(cwd: Option<&str>, agent: &str, model: &str, query: &str, answer: &str) {
    if !memory_enabled() {
        return;
    }
    let query = query.trim();
    let answer = answer.trim();
    if query.is_empty() || answer.is_empty() {
        return;
    }
    let Some(file) = project_brain_file(cwd) else {
        return;
    };
    if let Some(dir) = file.parent() {
        let _ = std::fs::create_dir_all(dir);
    }
    let stamp = chrono::Local::now().format("%Y-%m-%d %H:%M");
    let mut body = String::new();
    if !file.exists() {
        body.push_str(&format!("# WarpOss memory — {}\n\n", project_key(cwd)));
    }
    body.push_str(&format!(
        "## {stamp} · {agent}/{model}\n**Q:** {query}\n\n**A:** {answer}\n\n"
    ));
    use std::io::Write;
    if let Ok(mut f) = std::fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(&file)
    {
        let _ = f.write_all(body.as_bytes());
    }
}

enum MemoryCommand {
    On,
    Off,
    Clear,
}

fn parse_memory_command(query: &str) -> Option<MemoryCommand> {
    match query.trim().to_lowercase().as_str() {
        "memory on" | "/memory on" | "brain on" => Some(MemoryCommand::On),
        "memory off" | "/memory off" | "brain off" => Some(MemoryCommand::Off),
        "memory clear" | "/memory clear" | "brain clear" => Some(MemoryCommand::Clear),
        _ => None,
    }
}

/// Prepares a minimal `CODEX_HOME` that keeps the user's login but skips their
/// MCP servers. The user's real `~/.codex/config.toml` often defines many MCP
/// servers (brave-search, meta-ads, neon, tradingview, aws, …); codex spawns ALL
/// of them on every `exec`, which added 10-20s of startup to even a "hi". We
/// point codex at a clean home whose `config.toml` has no MCP servers and whose
/// `auth.json` is symlinked to the real one (so token refreshes still work).
/// Returns the clean home path, or None to fall back to the default home
/// (which happens in tools mode, so codex loads the user's real MCP + skills).
fn prepare_codex_home() -> Option<String> {
    // Tools mode: use the user's full ~/.codex so all their MCP + skills load.
    if tools_enabled() {
        return None;
    }
    let home = std::env::var("HOME").ok()?;
    let real_auth = std::path::PathBuf::from(&home).join(".codex/auth.json");
    if !real_auth.exists() {
        return None;
    }
    let clean = std::path::PathBuf::from(&home).join(".warposs/codex-home");
    std::fs::create_dir_all(&clean).ok()?;
    // Only the MCP servers you enabled in Settings (default: all). With none
    // enabled, codex starts no MCP servers and stays fastest.
    let mut config =
        String::from("# WarpOss: codex home with only the MCP servers enabled in Settings.\n");
    let servers_toml = selected_codex_mcp_toml();
    if !servers_toml.is_empty() {
        config.push('\n');
        config.push_str(&servers_toml);
    }
    let _ = std::fs::write(clean.join("config.toml"), config);
    let link = clean.join("auth.json");
    // Symlink the real auth so codex reads/refreshes the user's actual login.
    if std::fs::symlink_metadata(&link).is_err() {
        #[cfg(unix)]
        let _ = std::os::unix::fs::symlink(&real_auth, &link);
    }
    Some(clean.to_string_lossy().to_string())
}

/// Maps an agent name + model + prompt to a concrete binary and its arguments.
/// Memory is carried in the prompt (full transcript), so the CLIs run statelessly
/// and the user can freely switch models mid-conversation.
fn build_local_cli_invocation(
    agent: &str,
    model: &str,
    effort: Option<&str>,
    prompt: &str,
) -> (String, Vec<String>) {
    match agent {
        "claude" => {
            // Claude CLI supports `--effort <low|medium|high|xhigh|max>`; pass the
            // picked thinking level when present (omitted => claude's own default).
            let mut args = vec![
                "-p".to_string(),
                prompt.to_string(),
                "--model".to_string(),
                model.to_string(),
            ];
            if let Some(eff) = effort {
                args.push("--effort".to_string());
                args.push(eff.to_string());
            }
            // Fast mode (see run_claude_streaming): skip the multi-GB plugin/skill
            // scan unless the user turned tools on.
            if !tools_enabled() {
                args.push("--setting-sources".to_string());
                args.push(String::new());
                args.push("--strict-mcp-config".to_string());
                args.push("--mcp-config".to_string());
                args.push("{\"mcpServers\":{}}".to_string());
            }
            (resolve_local_cli_binary("claude"), args)
        }
        "codex" => {
            // Pass the chosen model explicitly (without `-m` codex silently uses
            // its config default, so model selection appeared to do nothing).
            // Default the reasoning effort to "low" for terminal-fast replies;
            // higher levels are opt-in via the picker (they trade speed for depth).
            let eff = effort.unwrap_or("low");
            (
                resolve_local_cli_binary("codex"),
                vec![
                    "exec".to_string(),
                    "--skip-git-repo-check".to_string(),
                    "-s".to_string(),
                    "read-only".to_string(),
                    "-m".to_string(),
                    model.to_string(),
                    "-c".to_string(),
                    format!("model_reasoning_effort={eff}"),
                    prompt.to_string(),
                ],
            )
        }
        // NOTE: for gemini/agy, `--print`/`--prompt` takes the prompt as its
        // VALUE, so `--model` must come first and the prompt must be the value
        // right after `--print` — otherwise `--print` eats `--model` as the
        // prompt (exit 2: "--print took --model as its prompt").
        "gemini" => {
            let gemini = resolve_local_cli_binary("gemini");
            if std::path::Path::new(&gemini).is_absolute() {
                (
                    gemini,
                    vec![
                        "--model".to_string(),
                        model.to_string(),
                        "--prompt".to_string(),
                        prompt.to_string(),
                    ],
                )
            } else {
                (
                    resolve_local_cli_binary("agy"),
                    vec![
                        "--model".to_string(),
                        model.to_string(),
                        "--print".to_string(),
                        prompt.to_string(),
                    ],
                )
            }
        }
        "agy" => (
            resolve_local_cli_binary("agy"),
            vec![
                "--model".to_string(),
                model.to_string(),
                "--print".to_string(),
                prompt.to_string(),
            ],
        ),
        // ---- Additional auto-detected CLIs (see cli_recipe_models in llms.rs) ----
        // OpenCode: `opencode run "<prompt>"` (optional `-m <model>`).
        "opencode" => {
            let mut args = vec!["run".to_string(), prompt.to_string()];
            if model != "default" && !model.is_empty() {
                args.push("-m".to_string());
                args.push(model.to_string());
            }
            (resolve_local_cli_binary("opencode"), args)
        }
        // Cursor CLI (binary `cursor-agent`): claude-like `-p ... --model ...`.
        "cursor" => {
            let mut args = vec![
                "-p".to_string(),
                prompt.to_string(),
                "--output-format".to_string(),
                "text".to_string(),
            ];
            if model != "default" && !model.is_empty() {
                args.push("--model".to_string());
                args.push(model.to_string());
            }
            (resolve_local_cli_binary("cursor-agent"), args)
        }
        // Ollama (local): `ollama run <model> "<prompt>"`.
        "ollama" => (
            resolve_local_cli_binary("ollama"),
            vec!["run".to_string(), model.to_string(), prompt.to_string()],
        ),
        // GitHub Copilot CLI: `copilot -p "<prompt>" --allow-all-tools`.
        "copilot" => (
            resolve_local_cli_binary("copilot"),
            vec![
                "-p".to_string(),
                prompt.to_string(),
                "--allow-all-tools".to_string(),
            ],
        ),
        // Fallback for a CLI defined in ~/.weft/clis.toml (or unknown): pass the
        // prompt via the recipe's prompt flag if any, else positionally.
        other => build_extra_cli_invocation(other, model, prompt),
    }
}

/// A user-extensible CLI "recipe" — the built-in extras plus anything the user
/// adds in `~/.weft/clis.toml`. Drives both the model list (llms.rs) and the
/// invocation here.
#[derive(Clone)]
pub struct WeftCliRecipe {
    pub key: String,
    pub label: String,
    pub binary: String,
    /// Optional subcommand (e.g. "run").
    pub subcommand: Option<String>,
    /// Prompt flag (e.g. "-p"); None => prompt is positional.
    pub prompt_flag: Option<String>,
    /// Model flag (e.g. "--model"); None => model not passed.
    pub model_flag: Option<String>,
    /// Extra fixed args appended after the prompt.
    pub extra_args: Vec<String>,
    pub login_command: Option<String>,
}

/// Reads `~/.weft/clis.toml` and returns user-defined CLI recipes. Format:
/// ```toml
/// [[cli]]
/// key = "mycli"
/// label = "My CLI"
/// binary = "mycli"
/// prompt_flag = "-p"      # optional; omit for positional prompt
/// model_flag = "--model"  # optional
/// subcommand = "chat"     # optional
/// login_command = "mycli login"   # optional
/// ```
pub fn weft_user_cli_recipes() -> Vec<WeftCliRecipe> {
    let home = match std::env::var("HOME") {
        Ok(h) => h,
        Err(_) => return Vec::new(),
    };
    let path = std::path::PathBuf::from(home).join(".weft/clis.toml");
    let text = match std::fs::read_to_string(&path) {
        Ok(t) => t,
        Err(_) => return Vec::new(),
    };
    let value: toml::Value = match text.parse() {
        Ok(v) => v,
        Err(_) => return Vec::new(),
    };
    let Some(arr) = value.get("cli").and_then(|c| c.as_array()) else {
        return Vec::new();
    };
    let s = |t: &toml::Value, k: &str| t.get(k).and_then(|v| v.as_str()).map(|s| s.to_string());
    arr.iter()
        .filter_map(|t| {
            Some(WeftCliRecipe {
                key: s(t, "key")?,
                label: s(t, "label").unwrap_or_else(|| s(t, "key").unwrap_or_default()),
                binary: s(t, "binary")?,
                subcommand: s(t, "subcommand"),
                prompt_flag: s(t, "prompt_flag"),
                model_flag: s(t, "model_flag"),
                extra_args: t
                    .get("extra_args")
                    .and_then(|v| v.as_array())
                    .map(|a| a.iter().filter_map(|x| x.as_str().map(String::from)).collect())
                    .unwrap_or_default(),
                login_command: s(t, "login_command"),
            })
        })
        .collect()
}

/// Builds args for a CLI defined by a `~/.weft/clis.toml` recipe.
fn build_extra_cli_invocation(agent: &str, model: &str, prompt: &str) -> (String, Vec<String>) {
    if let Some(r) = weft_user_cli_recipes().into_iter().find(|r| r.key == agent) {
        let mut args = Vec::new();
        if let Some(sub) = &r.subcommand {
            args.push(sub.clone());
        }
        if let Some(mf) = &r.model_flag {
            if model != "default" && !model.is_empty() {
                args.push(mf.clone());
                args.push(model.to_string());
            }
        }
        match &r.prompt_flag {
            Some(pf) => {
                args.push(pf.clone());
                args.push(prompt.to_string());
            }
            None => args.push(prompt.to_string()),
        }
        args.extend(r.extra_args.clone());
        return (resolve_local_cli_binary(&r.binary), args);
    }
    (resolve_local_cli_binary(agent), vec![prompt.to_string()])
}

/// Resolves a CLI binary against the common local install dirs, returning an
/// absolute path when found or the bare name (to fall back to `PATH`) otherwise.
fn resolve_local_cli_binary(name: &str) -> String {
    let mut dirs: Vec<std::path::PathBuf> = Vec::new();
    if let Ok(home) = std::env::var("HOME") {
        dirs.push(std::path::PathBuf::from(&home).join(".local/bin"));
        dirs.push(std::path::PathBuf::from(&home).join(".homebrew/bin"));
        dirs.push(std::path::PathBuf::from(&home).join(".opencode/bin"));
        dirs.push(std::path::PathBuf::from(&home).join(".bun/bin"));
        dirs.push(std::path::PathBuf::from(&home).join("bin"));
    }
    dirs.push(std::path::PathBuf::from("/opt/homebrew/bin"));
    dirs.push(std::path::PathBuf::from("/usr/local/bin"));
    for dir in dirs {
        let candidate = dir.join(name);
        if candidate.is_file() {
            return candidate.to_string_lossy().into_owned();
        }
    }
    name.to_string()
}

/// Runs `cmd` to completion with a hard timeout, draining stdout/stderr on
/// dedicated threads so the child can never deadlock on a full pipe. Always
/// returns a user-visible string.
fn run_local_cli_with_timeout(
    mut cmd: std::process::Command,
    timeout: std::time::Duration,
) -> String {
    use std::io::Read;

    cmd.stdin(std::process::Stdio::null())
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped());

    let mut child = match cmd.spawn() {
        Ok(child) => child,
        Err(err) => return format!("Local CLI agent failed to start: {err}"),
    };

    let stdout = child.stdout.take();
    let stderr = child.stderr.take();
    let stdout_handle = std::thread::spawn(move || {
        let mut buf = String::new();
        if let Some(mut stream) = stdout {
            let _ = stream.read_to_string(&mut buf);
        }
        buf
    });
    let stderr_handle = std::thread::spawn(move || {
        let mut buf = String::new();
        if let Some(mut stream) = stderr {
            let _ = stream.read_to_string(&mut buf);
        }
        buf
    });

    let start = std::time::Instant::now();
    let status = loop {
        match child.try_wait() {
            Ok(Some(status)) => break Some(status),
            Ok(None) => {
                if start.elapsed() >= timeout {
                    let _ = child.kill();
                    let _ = child.wait();
                    break None;
                }
                std::thread::sleep(std::time::Duration::from_millis(50));
            }
            Err(_) => break None,
        }
    };

    let stdout_text = stdout_handle.join().unwrap_or_default();
    let stderr_text = stderr_handle.join().unwrap_or_default();

    match status {
        None => {
            let mut msg = format!("Local CLI agent timed out after {}s.", timeout.as_secs());
            let err = stderr_text.trim();
            if !err.is_empty() {
                msg.push('\n');
                msg.push_str(err);
            }
            msg
        }
        Some(status) if status.success() => {
            let out = stdout_text.trim();
            if !out.is_empty() {
                out.to_string()
            } else {
                let err = stderr_text.trim();
                if err.is_empty() {
                    "Local CLI agent produced no output.".to_string()
                } else {
                    err.to_string()
                }
            }
        }
        Some(status) => {
            let mut msg = format!("Local CLI agent exited with {status}.");
            let combined = format!("{}\n{}", stdout_text.trim(), stderr_text.trim());
            let combined = combined.trim();
            if !combined.is_empty() {
                msg.push('\n');
                msg.push_str(combined);
            }
            msg
        }
    }
}

async fn convert_multi_agent_client_error(
    error: warp_multi_agent_client::Error,
) -> Arc<AIApiError> {
    let error = match error {
        warp_multi_agent_client::Error::Authentication(error)
        | warp_multi_agent_client::Error::AmbientHeaders(error) => AIApiError::Other(error),
        warp_multi_agent_client::Error::Base64Decode(error) => {
            AIApiError::Other(anyhow::Error::from(error))
        }
        warp_multi_agent_client::Error::ProtobufDecode(error) => {
            AIApiError::Other(anyhow::Error::from(error))
        }
        warp_multi_agent_client::Error::EventSource(error) => {
            AIApiError::from_stream_error("GenerateMultiAgentOutput", *error).await
        }
    };
    Arc::new(error)
}

fn api_keys_with_warp_credit_fallback_setting(
    api_keys: Option<api::request::settings::ApiKeys>,
    allow_use_of_warp_credits: bool,
) -> Option<api::request::settings::ApiKeys> {
    match api_keys {
        Some(mut api_keys) => {
            api_keys.allow_use_of_warp_credits = allow_use_of_warp_credits;
            Some(api_keys)
        }
        None if allow_use_of_warp_credits => Some(api::request::settings::ApiKeys {
            allow_use_of_warp_credits: true,
            ..Default::default()
        }),
        None => None,
    }
}

fn supports_orchestration_v2(orchestration_enabled: bool) -> bool {
    orchestration_enabled
}

fn get_supported_tools(params: &RequestParams) -> Vec<api::ToolType> {
    let mut supported_tools = vec![
        api::ToolType::Grep,
        api::ToolType::FileGlob,
        api::ToolType::FileGlobV2,
        api::ToolType::ReadMcpResource,
        api::ToolType::CallMcpTool,
        api::ToolType::InitProject,
        api::ToolType::OpenCodeReview,
        api::ToolType::RunShellCommand,
        api::ToolType::SuggestNewConversation,
        api::ToolType::Subagent,
        api::ToolType::WriteToLongRunningShellCommand,
        api::ToolType::ReadShellCommandOutput,
        api::ToolType::ReadDocuments,
        api::ToolType::CreateDocuments,
        api::ToolType::EditDocuments,
        api::ToolType::SuggestPrompt,
    ];

    if FeatureFlag::ConversationsAsContext.is_enabled() {
        supported_tools.push(api::ToolType::FetchConversation);
    }

    match params.session_context.session_type() {
        None | Some(SessionType::Local) => {
            supported_tools.extend(&[
                api::ToolType::ReadFiles,
                api::ToolType::ApplyFileDiffs,
                api::ToolType::SearchCodebase,
            ]);

            if FeatureFlag::ArtifactCommand.is_enabled() {
                supported_tools.push(api::ToolType::UploadFileArtifact);
            }
        }
        Some(SessionType::WarpifiedRemote { host_id: Some(_) }) => {
            // Remote session with a known host — enable tools that route
            // through RemoteServerClient. The host_id is only populated
            // after a successful connection handshake, so its presence is a
            // sufficient proxy for client availability.
            supported_tools.extend(&[api::ToolType::ReadFiles, api::ToolType::ApplyFileDiffs]);
            if FeatureFlag::RemoteCodebaseIndexing.is_enabled() {
                supported_tools.push(api::ToolType::SearchCodebase);
            }
        }
        Some(SessionType::WarpifiedRemote { host_id: None }) => {
            // Feature flag off or not yet connected — no remote tools.
        }
    }

    if FeatureFlag::AgentModeComputerUse.is_enabled() && params.computer_use_enabled {
        supported_tools.extend(&[api::ToolType::UseComputer]);
        supported_tools.extend(&[api::ToolType::RequestComputerUse]);

        if FeatureFlag::VideoRecording.is_enabled() {
            supported_tools.extend(&[api::ToolType::StartRecording, api::ToolType::StopRecording]);
        }
    }

    supported_tools.push(api::ToolType::InsertReviewComments);

    if FeatureFlag::ListSkills.is_enabled() {
        supported_tools.push(api::ToolType::ReadSkill);
    }

    if params.orchestration_enabled {
        supported_tools.extend([api::ToolType::RunAgents, api::ToolType::SendMessageToAgent]);
        // Declare client-handled wait_for_events so the server doesn't
        // fall back to the legacy server-handled form.
        supported_tools.push(api::ToolType::WaitForEvents);
    }

    if FeatureFlag::AskUserQuestion.is_enabled() && params.ask_user_question_enabled {
        supported_tools.push(api::ToolType::AskUserQuestion);
    }

    supported_tools
}

fn get_supported_cli_agent_tools(params: &RequestParams) -> Vec<api::ToolType> {
    let mut supported_cli_agent_tools = vec![
        api::ToolType::WriteToLongRunningShellCommand,
        api::ToolType::ReadShellCommandOutput,
        api::ToolType::Grep,
        api::ToolType::FileGlob,
        api::ToolType::FileGlobV2,
    ];

    if FeatureFlag::TransferControlTool.is_enabled() {
        supported_cli_agent_tools.push(api::ToolType::TransferShellCommandControlToUser);
    }

    match params.session_context.session_type() {
        None | Some(SessionType::Local) => {
            supported_cli_agent_tools
                .extend(&[api::ToolType::ReadFiles, api::ToolType::SearchCodebase]);
        }
        Some(SessionType::WarpifiedRemote { host_id: Some(_) }) => {
            supported_cli_agent_tools.push(api::ToolType::ReadFiles);
            if FeatureFlag::RemoteCodebaseIndexing.is_enabled() {
                supported_cli_agent_tools.push(api::ToolType::SearchCodebase);
            }
        }
        Some(SessionType::WarpifiedRemote { host_id: None }) => {}
    }

    supported_cli_agent_tools
}

#[cfg(test)]
#[path = "impl_tests.rs"]
mod tests;
