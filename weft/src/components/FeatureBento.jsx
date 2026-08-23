import React from 'react'
import { 
  Cpu, 
  Sparkles, 
  Brain, 
  Zap, 
  ShieldCheck, 
  Terminal, 
  Sliders, 
  Lock, 
  RefreshCw, 
  ArrowRight,
  FileText
} from 'lucide-react'

export default function FeatureBento() {
  return (
    <section id="features" className="py-20 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engineered for Power Users</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Every layer of the agentic stack, <br className="hidden sm:inline" />
            <span className="gradient-text-accent">built into your shell.</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mt-4 leading-relaxed">
            Weft replaces bloated web wrappers with a native Rust GPU terminal that directly orchestrates your local AI CLI subscriptions.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Multi-Model Switching (Large 2-column card) */}
          <div className="md:col-span-2 rounded-3xl bg-[#121622]/80 border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden group hover:border-cyan-500/30 transition-all">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[100px] pointer-events-none" />
            
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                One chat, every model. Switch mid-stream.
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Start a refactor in <strong>Claude 3.7</strong>, hand off test execution to <strong>Codex</strong>, and synthesize documentation in <strong>Gemini</strong>. The new model picks up exactly where the last one stopped with seamless cross-provider context memory.
              </p>
            </div>

            {/* Visual interactive preview */}
            <div className="mt-8 rounded-2xl bg-[#090C12] border border-white/10 p-4 font-mono text-xs space-y-2.5">
              <div className="flex items-center justify-between text-gray-400 border-b border-white/5 pb-2">
                <span className="text-cyan-400">Context Persistence Pipeline</span>
                <span className="text-emerald-400 font-sans text-[11px]">● Active Transcript Memory</span>
              </div>
              <div className="flex items-center gap-2 text-amber-300">
                <span>Claude:</span>
                <span className="text-gray-300">"Wrote the memory allocator refactor in src/alloc.rs"</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-300 pl-4 border-l-2 border-cyan-500/40">
                <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                <span className="text-xs text-gray-400 font-sans">Switched model → Handing full context to Codex</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300">
                <span>Codex:</span>
                <span className="text-gray-300">"Running cargo test --package allocator. All 42 tests passed."</span>
              </div>
            </div>
          </div>

          {/* Card 2: Thinking Controls (1-column card) */}
          <div className="rounded-3xl bg-[#121622]/80 border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden group hover:border-indigo-500/30 transition-all">
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-indigo-500/10 blur-[80px] pointer-events-none" />
            
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Granular Thinking Levels
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Choose the speed ↔ depth trade-off on demand. Pick from low to max reasoning budgets per model with live collapsible thought streaming.
              </p>
            </div>

            <div className="mt-6 p-3.5 rounded-2xl bg-[#090C12] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <span>Reasoning Depth</span>
                <span className="text-indigo-400 font-semibold">Max (32k Tokens)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 w-4/5 rounded-full" />
              </div>
              <div className="text-[11px] text-gray-400 font-mono flex justify-between">
                <span>Fast</span>
                <span>Balanced</span>
                <span className="text-cyan-300">Deep Math/Refactor</span>
              </div>
            </div>
          </div>

          {/* Card 3: Obsidian Brain (1-column card) */}
          <div className="rounded-3xl bg-[#121622]/80 border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/30 transition-all">
            <div className="absolute top-0 right-0 w-60 h-60 bg-purple-500/10 blur-[80px] pointer-events-none" />
            
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Obsidian Brain Memory
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Every conversation is saved as clean Markdown into your Obsidian vault's <code className="text-purple-300">Weft/</code> folder or <code className="text-purple-300">~/.weft/brain/</code>, auto-recalled in future sessions.
              </p>
            </div>

            <div className="mt-6 p-3.5 rounded-2xl bg-[#090C12] border border-white/10 text-xs font-mono text-gray-300 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-400">
                <FileText className="w-3.5 h-3.5" />
                <span>~/Vault/Weft/repo-notes.md</span>
              </div>
              <p className="text-gray-400 text-[11px]">
                "Project uses tokio async runtime and diesel sqlite migrations..."
              </p>
            </div>
          </div>

          {/* Card 4: Fast Mode vs Tools (Large 2-column card) */}
          <div className="md:col-span-2 rounded-3xl bg-[#121622]/80 border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none" />
            
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Fast Mode & Full MCP Tooling on Demand
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
                By default, Fast Mode skips heavy MCP/skill loading to deliver instant ~4s replies. Need external database queries or custom agent tools? Just type <code className="px-1.5 py-0.5 rounded bg-white/10 text-emerald-300 font-mono">tools on</code> right inside the terminal.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#090C12] border border-white/10">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-1">
                  <Zap className="w-4 h-4" />
                  <span>Fast Mode (Default)</span>
                </div>
                <p className="text-xs text-gray-400">
                  ~3.8s Claude / ~5.2s Codex. Zero MCP overhead for pure coding speed.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#090C12] border border-white/10">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
                  <Terminal className="w-4 h-4" />
                  <span>Tools Mode (<code className="text-xs">tools on</code>)</span>
                </div>
                <p className="text-xs text-gray-400">
                  Loads your full personal MCP servers, SQLite tools, and skill workflows.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
