import React, { useState, useEffect } from 'react'
import { 
  Terminal, 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  Cpu, 
  Zap, 
  Brain, 
  Check, 
  Play, 
  RotateCcw, 
  FileCode, 
  Command, 
  ShieldCheck, 
  Circle,
  Clock,
  ArrowRight
} from 'lucide-react'

export default function TerminalSimulator() {
  const [selectedModel, setSelectedModel] = useState('claude')
  const [thinkingExpanded, setThinkingExpanded] = useState(true)
  const [fastMode, setFastMode] = useState(true)
  const [thinkingLevel, setThinkingLevel] = useState('high')
  const [isTyping, setIsTyping] = useState(false)
  const [activeStep, setActiveStep] = useState(3)

  const models = [
    {
      id: 'claude',
      name: 'Claude 3.7 Sonnet',
      provider: 'Anthropic CLI',
      color: 'from-amber-500 to-orange-500',
      badge: 'Thinking Stream',
      speed: '~3.8s',
      thoughtTime: '3.4s',
      thoughtTokens: '1,140 tokens',
      thoughtContent: [
        "1. Analyzing warpui/src/terminal_model.rs to inspect lock contention.",
        "2. Found uncoalesced view invalidation during high-throughput stdout streaming.",
        "3. Designing zero-copy ring buffer with atomic dirty flag.",
        "4. Preparing unified diff and verifying AGPL/MIT compatibility."
      ],
      userPrompt: "Investigate why terminal scroll fps dips during cargo nextest run and optimize it.",
      responseHeading: "Root cause found: Lock contention in TerminalModel view updates",
      codeSnippet: `// crates/warpui_core/src/terminal_model.rs
pub fn update_viewport_buffered(&mut self, lines: &[Line]) {
    // Atomic dirty flag prevents redundant GPU layout passes
    if !self.dirty.swap(true, Ordering::Relaxed) {
        self.render_queue.push_back(lines.to_vec());
    }
}`,
      metrics: { tokens: '412 tps', latency: '420ms TTFT', cost: '$0.00 (CLI Sub)' }
    },
    {
      id: 'codex',
      name: 'Codex (GPT-5)',
      provider: 'OpenAI CLI',
      color: 'from-emerald-500 to-teal-500',
      badge: 'Agentic Sandbox',
      speed: '~5.2s',
      thoughtTime: '4.8s',
      thoughtTokens: '1,890 tokens',
      thoughtContent: [
        "1. Context inherited from Claude session: analyzing terminal_model.rs buffer changes.",
        "2. Validating thread safety across macOS Metal rendering loop.",
        "3. Executing local sandboxed test: cargo test -p warpui_core --lib.",
        "4. All 148 unit tests passing with 0 race conditions detected."
      ],
      userPrompt: "Switching from Claude: Now run the test suite and verify thread safety in the sandbox.",
      responseHeading: "Agentic Sandbox: Running test suite & verifying invariants",
      codeSnippet: `$ cargo test -p warpui_core --lib
   Compiling warpui_core v0.1.0 (/Users/munir/Documents/warp/crates/warpui_core)
    Finished test [unoptimized + debuginfo] target(s) in 1.42s
     Running unittests src/lib.rs
test terminal::tests::test_atomic_viewport_buffer ... ok
test terminal::tests::test_high_throughput_burst ... ok
test terminal::tests::test_memory_retention_limits ... ok

test result: ok. 148 passed; 0 failed; 0 ignored`,
      metrics: { tokens: '380 tps', latency: '650ms TTFT', cost: '$0.00 (CLI Sub)' }
    },
    {
      id: 'gemini',
      name: 'Gemini 2.5 Pro',
      provider: 'Google CLI',
      color: 'from-blue-500 to-cyan-500',
      badge: '1M Context',
      speed: '~3.2s',
      thoughtTime: '2.9s',
      thoughtTokens: '920 tokens',
      thoughtContent: [
        "1. Ingesting full Obsidian brain memory note: ~/Vault/Weft/warp.md.",
        "2. Synthesizing performance benchmarks against native GPU Metal pipeline.",
        "3. Generating final commit summary with semantic change annotations."
      ],
      userPrompt: "Summarize today's terminal optimization session and save to our Obsidian brain.",
      responseHeading: "Obsidian Brain Synced: ~/Vault/Weft/warp_optimizations.md",
      codeSnippet: `## Session Summary: Terminal Viewport Lock Refactor
- **Impact**: Boosted sustained frame rate from 42 FPS to a rock-solid 120 FPS.
- **Changed Files**: \`crates/warpui_core/src/terminal_model.rs\` (+18, -4)
- **Verified**: 148 automated tests passed via Codex sandbox.
- **Model Trace**: Claude 3.7 Sonnet (Architecture) → Codex (Execution) → Gemini (Synthesis)`,
      metrics: { tokens: '520 tps', latency: '280ms TTFT', cost: '$0.00 (CLI Sub)' }
    }
  ]

  const current = models.find(m => m.id === selectedModel)

  const handleModelChange = (id) => {
    setSelectedModel(id)
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 400)
  }

  return (
    <section id="terminal-demo" className="py-12 md:py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            See the multi-model loop in action
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            Click between Claude, Codex, and Gemini below. Watch how context, thinking traces, and the Obsidian brain persist across providers.
          </p>
        </div>

        {/* Outer Terminal Container with Glow */}
        <div className="relative rounded-3xl bg-gradient-to-b from-white/15 via-white/5 to-white/0 p-[1px] shadow-2xl shadow-cyan-500/10">
          
          {/* Main Terminal Window */}
          <div className="bg-[#0D111A] rounded-[23px] overflow-hidden border border-white/10">
            
            {/* Top Window Bar */}
            <div className="bg-[#121622] px-4 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
              
              {/* Traffic lights & tabs */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                </div>
                <div className="h-4 w-px bg-white/10 mx-1" />
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-200 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>weft ~/warp (main)</span>
                </div>
              </div>

              {/* Status toggles inside window header */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs font-mono">
                
                {/* Fast / Tool Mode toggle */}
                <button
                  onClick={() => setFastMode(!fastMode)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                    fastMode 
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' 
                      : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                  }`}
                  title="Toggle Fast Mode vs Tool/MCP Mode"
                >
                  {fastMode ? <Zap className="w-3 h-3 text-cyan-400" /> : <Sparkles className="w-3 h-3 text-indigo-400" />}
                  <span>{fastMode ? '⚡ Fast (~4s)' : '🛠 Tools (MCP on)'}</span>
                </button>

                {/* Obsidian Brain indicator */}
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300">
                  <Brain className="w-3 h-3 text-purple-400" />
                  <span>Brain: Synced</span>
                </div>

                {/* Direct CLI auth */}
                <div className="hidden md:flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Local CLI Auth</span>
                </div>
              </div>
            </div>

            {/* Model Selector Bar */}
            <div className="bg-[#0F1420] px-4 py-2.5 border-b border-white/5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider mr-1 hidden sm:inline">Active Model:</span>
                {models.map((model) => {
                  const isSelected = selectedModel === model.id
                  return (
                    <button
                      key={model.id}
                      onClick={() => handleModelChange(model.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-white text-black shadow-md font-semibold scale-105'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        model.id === 'claude' ? 'bg-amber-500' : model.id === 'codex' ? 'bg-emerald-500' : 'bg-cyan-500'
                      }`} />
                      <span>{model.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* Thinking Level Pills */}
              <div className="flex items-center gap-1 text-[11px] font-mono text-gray-400">
                <span className="hidden lg:inline mr-1">Thinking Budget:</span>
                {['low', 'med', 'high', 'max'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setThinkingLevel(lvl)}
                    className={`px-2 py-0.5 rounded capitalize ${
                      thinkingLevel === lvl ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30' : 'hover:text-gray-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Interactive Chat Body */}
            <div className="p-4 sm:p-6 space-y-5 font-mono text-xs sm:text-sm">
              
              {/* User Prompt Bubble */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  YOU
                </div>
                <div className="flex-1 bg-white/[0.04] border border-white/10 rounded-2xl p-3.5 text-gray-200">
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1 font-sans">
                    <span>Prompt to {current.name}</span>
                    <span className="text-gray-400">Just now</span>
                  </div>
                  <p className="font-mono text-gray-100">{current.userPrompt}</p>
                </div>
              </div>

              {/* Model Thinking Collapsible Section */}
              <div className="ml-10 rounded-2xl bg-[#090C12] border border-white/10 overflow-hidden">
                <button
                  onClick={() => setThinkingExpanded(!thinkingExpanded)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-gray-400 hover:text-gray-200 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span className="font-semibold text-gray-200">
                      Thought for {current.thoughtTime}
                    </span>
                    <span className="text-[11px] text-gray-400 font-normal">
                      ({current.thoughtTokens} at {thinkingLevel} depth)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <span>{thinkingExpanded ? 'Collapse trace' : 'View reasoning'}</span>
                    {thinkingExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {thinkingExpanded && (
                  <div className="px-4 py-3 text-xs text-gray-400 border-t border-white/5 space-y-1.5 bg-black/30 font-mono">
                    {current.thoughtContent.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-gray-300">
                        <span className="text-cyan-400">›</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Model Output Bubble */}
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${current.color} text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-lg`}>
                  AI
                </div>
                <div className="flex-1 bg-[#121724] border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-400 border-b border-white/5 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{current.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-cyan-300">
                        {current.provider}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-gray-400">
                      <span>Speed: <strong className="text-emerald-400">{current.speed}</strong></span>
                      <span className="hidden sm:inline">Cost: <strong className="text-white">{current.metrics.cost}</strong></span>
                    </div>
                  </div>

                  <p className="text-gray-200 font-sans font-medium text-sm">
                    {current.responseHeading}
                  </p>

                  {/* Code / Command Block */}
                  <div className="relative rounded-xl bg-[#090C12] border border-white/10 p-3 overflow-x-auto">
                    <pre className="text-xs text-cyan-300 font-mono leading-relaxed">
                      <code>{current.codeSnippet}</code>
                    </pre>
                  </div>

                  {/* Execution footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-gray-400">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Saved to Obsidian Brain note (<code className="text-purple-300">Weft/warp.md</code>)</span>
                    </div>
                    <div className="text-gray-400 font-mono">
                      {current.metrics.tokens} · {current.metrics.latency}
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive prompt trigger buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400 font-sans">Try another test case:</span>
                {models.map(m => (
                  <button
                    key={m.id}
                    onClick={() => handleModelChange(m.id)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      selectedModel === m.id 
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-medium' 
                        : 'bg-white/5 text-gray-400 hover:text-white border-white/5 hover:bg-white/10'
                    }`}
                  >
                    Switch to {m.name} →
                  </button>
                ))}
              </div>

            </div>

            {/* Terminal Input Bar */}
            <div className="bg-[#121622] px-4 py-3 border-t border-white/10 flex items-center gap-3">
              <div className="text-cyan-400 font-mono font-bold">$</div>
              <input
                type="text"
                readOnly
                value="Switching models maintains memory. Type 'tools on' or 'memory clear'..."
                className="bg-transparent text-xs sm:text-sm text-gray-400 font-mono focus:outline-none flex-1"
              />
              <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/10 hidden sm:inline">
                Press Enter ↵
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
