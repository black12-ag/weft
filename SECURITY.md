# Security Policy

Weft is a fork of [Warp's open-source terminal](https://github.com/warpdotdev/warp) that runs your **local CLI agents** instead of any hosted service.

## Security model

- **No accounts, no servers, no API keys held by Weft.** Weft never signs you in and never sends your prompts or data to a Weft/Warp server. The AI chat shells out to the CLIs you already have installed (`claude`, `codex`, `gemini`), which use *their own* provider logins.
- **Credentials stay with the provider.** Weft never sees, stores, or transmits your CLI credentials. Sign-in/out happens through each CLI's own flow (e.g. `codex login`), which stores tokens in that CLI's own location (keychain / `~/.codex` / `~/.gemini`).
- **Local execution.** In agentic mode, Codex runs in your project directory under a read-only sandbox. It reads files and runs read-only commands; it does not modify files.
- **Memory is local.** Conversation memory is written as plain markdown to your Obsidian vault or `~/.warposs/brain/`. It never leaves your machine.

## Reporting a vulnerability

If you find a security issue in **Weft's changes** (the CLI/AI layer), please report it privately — do **not** open a public issue that could expose it before a fix:

- Open a private **GitHub Security Advisory** on this repository: [black12-ag/weft → Security → Advisories](https://github.com/black12-ag/weft/security/advisories/new).

For vulnerabilities in the underlying terminal (upstream Warp code), please follow [Warp's security policy](https://github.com/warpdotdev/warp/security).
