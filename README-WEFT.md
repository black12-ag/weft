# Weft — one terminal, all your CLI subscriptions

> A fork of [Warp's open-source terminal](https://github.com/warpdotdev/warp). In weaving, the *weft* is the thread that crosses the *warp* — here it weaves Claude Code, OpenAI Codex, and Google Gemini into one chat.

A fork of [Warp's open-source terminal](https://github.com/warpdotdev/warp) whose AI chat runs on **your own local CLI agents** — Claude Code, OpenAI Codex, and Google Gemini — using the subscriptions you already pay for.

**No Warp account. No sign-in. No API keys. No Warp servers. Ever.**

## What you get

- **One chat, every model** — pick any Claude / Codex (GPT) / Gemini model from the model button, switch mid-conversation, and the new model continues exactly where the last one stopped. Cross-provider memory is built in.
- **Thinking levels** — every model exposes its reasoning range (low → max / minimal → xhigh). Pick the speed↔depth trade-off per model from the composer's model popup.
- **Live streaming** — answers and the model's thinking type out live; the thinking auto-collapses into a "Thought for Xs" dropdown when the answer lands. Token usage is shown after each reply.
- **Agentic Codex** — Codex can read files and run commands in your current project (read-only sandbox) and shows each step live.
- **Fast** — Claude ~4s, Codex ~6s for a short reply. Fast mode skips each CLI's heavy MCP/plugin/skill loading; type `tools on` in the chat to load your full personal MCP + skills config when you need it (`tools off` to go back).
- **A brain** — every exchange is saved as markdown (to your Obsidian vault's `Weft/` folder if you have one, else `~/.weft/brain/`), one note per project, and recalled automatically in later sessions. All models share it. `memory on` / `memory off` / `memory clear`.
- **Connect a CLI from Settings** — Settings → Agents → Third party CLI agents shows each CLI (installed? signed in?) with a **Connect** button that runs the provider's own login (`claude auth login`, `codex login`, `gemini`). Credentials go straight to the provider; this app never sees them.

## Install (download)

1. Download `Weft.dmg` from the Releases tab.
2. Open it, drag **Weft** to Applications.
3. First launch: right-click the app → **Open** (it's ad-hoc signed, so macOS asks once). Or run:
   ```
   xattr -dr com.apple.quarantine /Applications/Weft.app
   ```
4. Install / sign in to at least one CLI (each uses its own subscription):
   - Claude Code: `npm i -g @anthropic-ai/claude-code` then `claude auth login`
   - Codex: `npm i -g @openai/codex` then `codex login`
   - Gemini: `npm i -g @google/gemini-cli` then run `gemini` once
5. Open Weft → type `/agent` (or use the chat) → pick a model from the model button → go.

## Build from source

Requirements: macOS, Xcode (with the Metal toolchain), Rust (rustup — the repo pins the toolchain), protoc.

```
git clone <this repo>
cd warp
./install.sh
```

The script builds the release app, packages `Weft.dmg`, and installs to `/Applications`. See `install.sh` for the individual steps.

## Customize it

It's all source — the local-CLI integration lives mainly in:

- `app/src/ai/agent/api/impl.rs` — runs the CLIs, streams thinking/answers, transcript memory, the Obsidian brain, `tools`/`memory` chat commands.
- `app/src/ai/llms.rs` — which models each CLI exposes (add your own here).
- `app/src/settings_view/cli_agents_page.rs` — the Connected CLIs settings section.

Add another CLI by extending `build_local_cli_invocation` (how to call it) and `local_cli_llm_choices` (which models to list).

## License

Same licenses as upstream Warp OSS (see `LICENSE-MIT` / `LICENSE-AGPL`). This fork's changes are offered under the same terms.
