import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Terminal, Cpu, Sparkles, Sliders } from 'lucide-react'
import WeftLogo from './WeftLogo'

export default function PlatformSection() {
  const [activeProvider, setActiveProvider] = useState('claude')

  const providers = {
    claude: {
      title: 'Claude Code',
      tag: 'Anthropic CLI',
      badge: 'Auto-detected',
      description: 'Connects directly to your local `claude` CLI. Supports Claude 3.7 Sonnet with extended thinking budgets up to 32k tokens.',
      terminalHeader: 'claude-3-7-sonnet // reasoning: high',
      taskName: 'Refactor async event dispatcher with lock-free channel',
      thought: 'Inspecting event loop in app/src/terminal/input.rs. Replacing mutex with crossbeam channel.',
      filesChanged: 'app/src/terminal/input.rs (+42 -12)',
    },
    codex: {
      title: 'OpenAI Codex',
      tag: 'OpenAI CLI',
      badge: 'Auto-detected',
      description: 'Runs on your local `codex` CLI session. Leverage GPT-4.5 with fast code generation and autonomous test verification.',
      terminalHeader: 'gpt-4.5-preview // thinking: max',
      taskName: 'Generate comprehensive integration tests for PTY pipeline',
      thought: 'Compiling cargo nextest suite. Running 18 integration tests with simulated terminal input.',
      filesChanged: 'crates/integration/tests/pty_test.rs (+89 -0)',
    },
    gemini: {
      title: 'Google Gemini',
      tag: 'Google CLI',
      badge: 'Auto-detected',
      description: 'Integrates with Google Cloud / Gemini CLI. Experience massive context windows with fast streaming responses.',
      terminalHeader: 'gemini-2.0-flash-thinking // fast',
      taskName: 'Index repository symbols and generate architecture overview',
      thought: 'Scanning 60+ Cargo workspace crates. Building symbol map and cross-crate dependency graph.',
      filesChanged: 'docs/architecture_overview.md (+112 -4)',
    },
  }

  const current = providers[activeProvider]

  return (
    <section id="platform" className="py-24 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-4">
            <img src="/weft-icon.jpg" alt="Weft" className="w-5 h-5 rounded" />
            <span className="font-bold text-sm tracking-tight text-black">weft</span>
            <span className="text-gray-400 text-xs">/</span>
            <span className="text-xs text-gray-600 font-medium">Provider Integrations</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-black tracking-tight mb-4">
            One interface. <br />
            Every local CLI model.
          </h2>
          <p className="text-gray-600 text-base max-w-xl">
            Switch between providers in the same conversation without losing context or re-entering API credentials.
          </p>
        </motion.div>

        {/* 2-Column Interactive Provider Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: 3 Providers */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* 1. Claude */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setActiveProvider('claude')}
              className={`p-6 rounded-2xl border transition-all cursor-pointer relative ${
                activeProvider === 'claude'
                  ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                  : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
            >
              {activeProvider === 'claude' && (
                <div className="absolute left-0 top-6 bottom-6 w-1 bg-amber-500 rounded-r" />
              )}
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-black flex items-center gap-2">
                  <span>Claude Code</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-medium">Claude 3.7</span>
                </h3>
                <span className="text-xs text-gray-500 font-mono">Anthropic</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Extended reasoning traces, automated file edits, and deep architectural comprehension.
              </p>
            </motion.div>

            {/* 2. Codex */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setActiveProvider('codex')}
              className={`p-6 rounded-2xl border transition-all cursor-pointer relative ${
                activeProvider === 'codex'
                  ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                  : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
            >
              {activeProvider === 'codex' && (
                <div className="absolute left-0 top-6 bottom-6 w-1 bg-emerald-500 rounded-r" />
              )}
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-black flex items-center gap-2">
                  <span>OpenAI Codex</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-medium">GPT-4.5</span>
                </h3>
                <span className="text-xs text-gray-500 font-mono">OpenAI</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Fast code synthesis, autonomous test generation, and seamless local command execution.
              </p>
            </motion.div>

            {/* 3. Gemini */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setActiveProvider('gemini')}
              className={`p-6 rounded-2xl border transition-all cursor-pointer relative ${
                activeProvider === 'gemini'
                  ? 'bg-blue-50/60 border-blue-300 shadow-xs'
                  : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
            >
              {activeProvider === 'gemini' && (
                <div className="absolute left-0 top-6 bottom-6 w-1 bg-blue-500 rounded-r" />
              )}
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-black flex items-center gap-2">
                  <span>Google Gemini</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-medium">Gemini 2.0</span>
                </h3>
                <span className="text-xs text-gray-500 font-mono">Google</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Large context indexing, multi-file synthesis, and low-latency thinking streams.
              </p>
            </motion.div>

          </div>

          {/* Right Column: Dark Terminal Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 bg-[#13171F] rounded-2xl border border-gray-800 p-5 sm:p-6 text-white font-mono text-xs shadow-2xl overflow-hidden"
          >
            
            {/* Titlebar */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 text-gray-400 text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="ml-2 text-gray-300 flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  <span>{current.terminalHeader}</span>
                </span>
              </div>
              <span className="text-emerald-400 font-semibold text-[10px]">● {current.badge}</span>
            </div>

            {/* Terminal Body with Tab Transition */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeProvider}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="py-4 space-y-4"
              >
                <div className="text-gray-200 font-bold text-sm font-sans">
                  Task: {current.taskName}
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[11px] text-cyan-300 flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse mt-1 shrink-0" />
                  <p className="leading-relaxed font-sans">{current.thought}</p>
                </div>

                <div className="flex items-center gap-2 text-gray-300 text-xs bg-white/5 p-2.5 rounded-lg border border-white/5 font-mono">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Modified: {current.filesChanged}</span>
                </div>

                <div className="bg-[#1C212D] border border-gray-700/60 rounded-xl p-3.5 space-y-2 text-xs font-mono text-gray-300">
                  <div className="text-gray-400 text-[10px] uppercase tracking-wider">
                    Context State: Shared Memory
                  </div>
                  <div className="text-[11px] text-gray-400">
                    ✓ AST Index cached in <span className="text-purple-300">~/.weft/brain/</span><br />
                    ✓ Zero server roundtrips<br />
                    ✓ Next turn ready
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

          </motion.div>

        </div>

      </div>
    </section>
  )
}
