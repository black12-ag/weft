# Weft — one terminal, all your CLI subscriptions

> In weaving, the *weft* is the thread that crosses the *warp*. A fork of [Warp's open-source terminal](https://github.com/warpdotdev/warp) that weaves Claude Code, OpenAI Codex, and Google Gemini into one chat.

Its AI chat runs on **your own local CLI agents** using the subscriptions you already pay for.

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

## Credits — what's Warp, what's Weft

**Weft stands on Warp's work, and credits it fully.** The entire terminal is [Warp](https://github.com/warpdotdev/warp)'s open source: the terminal engine, the whole UI and UX, the blocks/rendering, the agent chat surface, the settings system, the model-picker components, and the client/agent backend. None of that is ours — Warp built it, and it's excellent.

**What Weft changes is one layer: where the AI comes from.** Warp's AI chat talks to Warp's cloud (account + credits). Weft rewires that layer so the same chat runs on **your own local CLI agents** — the subscriptions you already pay for — with **no account, no login, no API keys, and no calls to any server.** Concretely, Weft adds/modifies:

- **Local-CLI execution** — the agent chat runs `claude` / `codex` / `gemini` locally instead of Warp's servers (`app/src/ai/agent/api/impl.rs`).
- **All models + thinking levels, no server** — every model each CLI offers, with per-model reasoning/effort (`app/src/ai/llms.rs`).
- **Live streaming** of the answer and the model's thinking, with an auto-collapsing "thought" block and token counts.
- **One shared conversation across providers** — switch Claude↔Codex↔Gemini mid-chat and it continues where you left off.
- **A persistent brain** — every exchange saved as markdown (Obsidian vault or `~/.warposs/brain/`) and recalled across sessions.
- **Fast mode** — skips each CLI's heavy MCP/plugin/skill scan for terminal-speed replies (`tools on` loads them when needed).
- **Connect-a-CLI settings** — Settings → Third party CLI agents shows install/login status and a Connect/Disconnect button per CLI.
- **No-login build** — sign-in prompts and credit banners removed (the `skip_login` feature and related gates).

This project is **actively updated** — expect frequent changes as the CLI integration, memory, and settings evolve.

## License

Weft is a fork of Warp's open-source terminal and keeps Warp's licensing in full — see [`LICENSE-MIT`](LICENSE-MIT) and [`LICENSE-AGPL`](LICENSE-AGPL). All original terminal/UI/UX/backend code is © Warp (Denver Technologies, Inc.). Weft's modifications (the local-CLI AI layer described above) are released under the same terms. If you distribute Weft or a build of it, you must keep these licenses and this attribution.
