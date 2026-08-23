import React, { useState } from 'react'
import { Terminal, Cpu, ShieldCheck, Sparkles, Brain, ArrowRight, CheckCircle2, Copy, Check } from 'lucide-react'

export default function FeatureDeepDive() {
  const [activeTab, setActiveTab] = useState('terminal')
  const [copied, setCopied] = useState(false)

  const tabs = [
    {
      id: 'terminal',
      title: 'Weft Terminal',
      tag: 'Native Rust & GPU',
      desc: 'An open-source terminal built for AI-assisted software development, with multi-model agents alongside your shell.',
      features: [
        'GPU-accelerated text rendering with zero input lag',
        'Built-in model switcher (Claude, Codex, Gemini)',
        'Collapsible reasoning traces with token consumption metrics',
        'Native macOS, Linux, and Windows support'
      ],
      cmd: 'brew install --cask weft',
      code: `// Weft UI: Model selector with thinking stream
let agent = AgentSession::builder()
    .with_model(Model::Claude37Sonnet)
    .with_thinking(ThinkingBudget::Tokens(4096))
    .with_brain(ObsidianVault::auto_detect())
    .build();

agent.stream_to_terminal(&mut ctx);`
    },
    {
      id: 'agent',
      title: 'Agent CLI & Tools',
      tag: 'Zero Proxy Servers',
      desc: 'Directly executes provider CLIs on your machine without intermediate proxy servers or credential risks.',
      features: [
        'Direct login via claude auth login, codex login, and gemini',
        'Agentic sandboxed file reading and automated command execution',
        'Fast mode for ~4s replies or tools on for full MCP servers',
        'Pipe stdin/stdout directly into multi-model chat'
      ],
      cmd: 'weft agent "Analyze git diff and generate PR description"',
      code: `$ weft agent --model codex "Verify all unit tests in sandbox"
[Weft] Spawning sandboxed Codex subprocess (PID 84920)...
[Weft] Reading 12 modified files in crates/warpui_core...
[Weft] Running: cargo test --workspace --no-fail-fast
✓ All 348 workspace tests passed in 4.1s.`
    },
    {
      id: 'brain',
      title: 'Local Brain & Memory',
      tag: 'Obsidian Native',
      desc: 'Never lose project context again. Every conversation automatically syncs to your personal Obsidian vault as markdown.',
      features: [
        'Automatic note creation in ~/Vault/Weft/<project>.md',
        'Cross-model memory: switch from Claude to Codex seamlessly',
        'Zero cloud lock-in: plain readable GitHub Flavored Markdown',
        'Instant toggle via memory on / memory off / memory clear'
      ],
      cmd: 'weft memory --status',
      code: `---
project: warp
updated: 2026-08-23T20:12:00Z
models_used: [claude-3.7-sonnet, codex-gpt5, gemini-2.5]
---
# Weft Memory: GPU Viewport Optimization
- Resolved mutex contention in TerminalModel
- Refactored render queue to atomic ring buffer
- Verified 100% thread safety across Metal render loop`
    }
  ]

  const current = tabs.find(t => t.id === activeTab)

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="architecture" className="py-20 md:py-32 bg-[#090C13] border-t border-white/5 relative overflow-hidden">
      
      {/* Background illumination */}
      <div className="absolute bottom-0 left-1/3 w-[600px] h-[300px] bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>Architecture & Experience</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Use Weft everywhere you code
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mt-4">
            Weft is designed from the ground up for speed, privacy, and full autonomy over your developer workflow.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#131724] border border-white/10 max-w-full overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-black font-semibold shadow-lg shadow-black/40 scale-[1.02]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.title}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  activeTab === tab.id ? 'bg-black/10 text-black font-bold' : 'bg-white/5 text-cyan-400'
                }`}>
                  {tab.tag}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Tab Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl bg-[#111622]/90 border border-white/10 p-6 sm:p-10 shadow-2xl">
          
          {/* Left Column: Description & Feature List */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 font-semibold">
                {current.tag}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                {current.title}
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {current.desc}
              </p>
            </div>

            {/* Bullet list */}
            <div className="space-y-3 pt-2">
              {current.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Terminal Command Runner Box */}
            <div className="pt-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#090C12] border border-white/10 text-xs font-mono">
                <div className="flex items-center gap-2 text-gray-300 truncate mr-2">
                  <span className="text-cyan-400">$</span>
                  <span className="truncate">{current.cmd}</span>
                </div>
                <button
                  onClick={() => handleCopy(current.cmd)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors shrink-0"
                  title="Copy command"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Code / Simulation Box */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#090C12] border border-white/10 overflow-hidden shadow-xl">
              <div className="bg-[#131722] px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="text-xs font-mono text-gray-400 ml-2">weft-core // {current.id}</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400">active</span>
              </div>
              <div className="p-4 sm:p-6 overflow-x-auto">
                <pre className="text-xs sm:text-sm font-mono text-gray-200 leading-relaxed">
                  <code>{current.code}</code>
                </pre>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
