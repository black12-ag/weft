# Contributing to Weft

Weft is a community fork of [Warp's open-source terminal](https://github.com/warpdotdev/warp). Warp built the terminal, UI/UX, and backend; Weft changes only the AI layer so the chat runs on your **local CLI subscriptions** (Claude Code, Codex, Gemini) with no account, no login, and no servers.

Contributions are welcome.

## Where Weft's code lives

Almost all of Weft's changes are in a few files:

- `app/src/ai/agent/api/impl.rs` — runs the local CLIs, streams thinking/answers, transcript memory, the Obsidian brain, and the `tools` / `memory` chat commands.
- `app/src/ai/llms.rs` — the model list each CLI exposes, with per-model reasoning levels.
- `app/src/settings_view/cli_agents_page.rs` — the "Connected CLIs" settings section (status + Connect/Disconnect).
- Plus a handful of `skip_login`-gated changes that remove sign-in prompts and credit banners.

Everything else is upstream Warp.

## Build & run

macOS, Xcode (with the Metal toolchain), Rust (rustup — the repo pins the toolchain), and protoc.

```
./install.sh
```

This builds the release app, packages `Weft.dmg`, and installs `Weft.app` to `/Applications`. For a faster debug build while developing:

```
cargo build --bin warp-oss --features gui,skip_login,agent_mode,agent_harness,profiles_design_revamp
```

## Adding a new CLI

1. In `build_local_cli_invocation` (impl.rs), add how to invoke the CLI (binary + args).
2. In `local_cli_llm_choices` (llms.rs), add the models it should expose.
3. Optionally add a row to `CLI_CONNECTIONS` (cli_agents_page.rs) for install/login status + Connect.

Each CLI hides its heavy startup (MCP/plugins/skills) behind a different flag — see how `prepare_codex_home` (Codex) and the `--setting-sources ""` path (Claude) keep things fast, and add the equivalent "fast recipe" for your CLI.

## Pull requests

- Keep changes scoped to the AI/CLI layer where possible; avoid touching upstream terminal internals unless necessary (it keeps merges from upstream Warp clean).
- Include a note on what you tested manually.
- By contributing, you agree your changes are released under the same licenses as the project (`LICENSE-MIT` / `LICENSE-AGPL`).

## Upstream

For issues in the terminal itself (rendering, blocks, settings framework, etc.) that aren't specific to Weft's CLI layer, the upstream [warpdotdev/warp](https://github.com/warpdotdev/warp) project is the source of truth.
