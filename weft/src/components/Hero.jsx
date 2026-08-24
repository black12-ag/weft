import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Github, Check, Terminal, Cpu, ShieldCheck, Zap, ChevronDown, Apple } from 'lucide-react'
import { usePlatform } from '../utils/usePlatform'
import WeftLogo from './WeftLogo'

export default function Hero() {
  const [selectedCLI, setSelectedCLI] = useState('claude')
  const [isThinkingOpen, setIsThinkingOpen] = useState(true)
  const platform = usePlatform()

  const cliConfigs = {
    claude: {
      name: 'Claude Code',
      model: 'claude-3-7-sonnet',
      reasoning: 'Reasoning: High',
      badge: 'Local CLI Active',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      thought: 'Analyzing AST structure in crates/warpui/src/search.rs. Verified workspace fuzzy indexing. Drafting patch.',
    },
    codex: {
      name: 'OpenAI Codex',
      model: 'gpt-4.5-preview',
      reasoning: 'Thinking: Max',
      badge: 'Local CLI Active',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      thought: 'Evaluating command palette query matcher with sub-millisecond lookup latency.',
    },
    gemini: {
      name: 'Google Gemini',
      model: 'gemini-2.0-flash-thinking',
      reasoning: 'Reasoning: Fast',
      badge: 'Local CLI Active',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      thought: 'Applying multi-threaded indexing cache for fuzzy command selection.',
    }
  }

  const current = cliConfigs[selectedCLI]

  const renderPlatformIcon = () => {
    if (platform.icon === 'apple') {
      return <Apple className="w-4 h-4 fill-current" />
    } else if (platform.icon === 'windows') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 5.557L10.364 4.5v6.98H3V5.557zm0 6.943h7.364v6.98L3 18.443V12.5zm8.455-8.138L21 3v8.48h-9.545V4.362zM21 12.5V21l-9.545-1.362v-7.138H21z"/>
        </svg>
      )
    }
    return <Terminal className="w-4 h-4" />
  }

  return (
    <section className="pt-16 pb-12 sm:pt-20 sm:pb-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Header Content */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% Free & Open Source · Runs on your own machine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-bold text-black tracking-[-0.03em] leading-[1.06] mb-6">
            One terminal. <br />
            All your CLI subscriptions.
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 font-normal max-w-2xl leading-relaxed mb-8">
            Weft runs Claude Code, Codex, and Gemini in one chat — using the subscriptions you already pay for. No login. No account. No API keys.
          </p>

          {/* Auto-detected Dynamic Action CTAs */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold tracking-wider uppercase">
              
              {/* Dynamic Auto-Download Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => platform.triggerDirectDownload()}
                className="bg-black text-white px-6 py-3.5 rounded-md hover:bg-neutral-800 transition-colors shadow-sm inline-flex items-center gap-2.5 cursor-pointer"
                title={`Direct download for ${platform.label}`}
              >
                {renderPlatformIcon()}
                <span className="text-left font-bold">{platform.label}</span>
                <Download className="w-3.5 h-3.5 opacity-70 ml-0.5" />
              </motion.button>

              {/* View on GitHub Button */}
              <motion.a
                whileHover={{ scale: 1.03, x: 2 }}
                whileTap={{ scale: 0.97 }}
                href="https://github.com/black12-ag/weft"
                target="_blank"
                rel="noreferrer"
                className="text-black border border-gray-300 hover:border-black px-5 py-3.5 rounded-md font-semibold transition-colors flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span>View on GitHub</span>
              </motion.a>
            </div>

            {/* Architecture / Platform switcher hint */}
            <div className="flex items-center gap-3 text-[11px] text-gray-500 font-sans">
              <span className="text-emerald-600 font-medium font-mono">● Auto-detected {platform.sublabel}</span>
              <span>·</span>
              <a href="#download" className="hover:text-black underline underline-offset-2 transition-colors">
                Looking for another OS or Intel architecture?
              </a>
            </div>
          </div>
        </motion.div>

        {/* Hero Visual Mockup with Sunset Aurora Background */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-4 rounded-3xl p-3 sm:p-6 overflow-hidden bg-gradient-to-br from-[#FFD3B6]/60 via-[#E4A5FF]/40 to-[#A0C4FF]/50 border border-gray-200/80 shadow-2xl"
        >
          
          {/* Main Terminal & AI Chat Container */}
          <div className="relative max-w-5xl mx-auto bg-[#0F141C] rounded-2xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-md">
            
            {/* Top Window Bar */}
            <div className="bg-[#181F2C] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                <div className="ml-4 flex items-center gap-2 font-mono text-[11px] text-gray-400">
                  <img src="/weft-icon.jpg" alt="Weft" className="w-3.5 h-3.5 rounded" />
                  <span>weft-terminal</span>
                  <span className="text-gray-600">/</span>
                  <span className="text-gray-300">local-agent-chat</span>
                </div>
              </div>

              {/* Trust badges in window header */}
              <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono text-gray-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3 h-3" /> No Server Calls
                </span>
                <span className="text-gray-600">•</span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <Zap className="w-3 h-3" /> Local CLI Sessions
                </span>
              </div>
            </div>

            {/* CLI Selector Toolbar */}
            <div className="bg-[#121824] px-4 py-2 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-[11px] font-mono mr-1">Active CLI:</span>
                <button
                  onClick={() => setSelectedCLI('claude')}
                  className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedCLI === 'claude' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                      : 'text-gray-400 hover:text-gray-200 bg-white/5'
                  }`}
                >
                  <span>Claude Code</span>
                  {selectedCLI === 'claude' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </button>
                <button
                  onClick={() => setSelectedCLI('codex')}
                  className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedCLI === 'codex' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'text-gray-400 hover:text-gray-200 bg-white/5'
                  }`}
                >
                  <span>OpenAI Codex</span>
                  {selectedCLI === 'codex' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </button>
                <button
                  onClick={() => setSelectedCLI('gemini')}
                  className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedCLI === 'gemini' 
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' 
                      : 'text-gray-400 hover:text-gray-200 bg-white/5'
                  }`}
                >
                  <span>Google Gemini</span>
                  {selectedCLI === 'gemini' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                </button>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                  {current.model}
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-300">
                  {current.reasoning}
                </span>
              </div>
            </div>

            {/* Terminal Agent Chat Body */}
            <div className="p-5 font-mono text-xs text-gray-200 space-y-4">
              
              {/* User Prompt */}
              <div className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                <div className="w-6 h-6 rounded bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                  YOU
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-gray-400 font-sans">Prompt</div>
                  <p className="text-gray-100 font-sans text-sm">
                    Add fuzzy search indexing to the workspace command palette with sub-millisecond filtering.
                  </p>
                </div>
              </div>

              {/* Agent Response Container */}
              <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-cyan-500/40">
                
                {/* Streaming Thought Header */}
                <div 
                  onClick={() => setIsThinkingOpen(!isThinkingOpen)}
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] cursor-pointer hover:bg-cyan-500/20 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-semibold">Thought for 3.8s</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isThinkingOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Collapsible Thought Details */}
                {isThinkingOpen && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 rounded-lg bg-black/40 border border-white/5 text-[11px] text-gray-400 leading-relaxed font-mono"
                  >
                    {current.thought}
                  </motion.div>
                )}

                {/* Tool Calls Execution */}
                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center gap-2 text-emerald-400 bg-black/30 px-2.5 py-1 rounded border border-white/5">
                    <Check className="w-3.5 h-3.5" />
                    <span>read_file: crates/warpui/src/search.rs</span>
                    <span className="text-[10px] text-gray-500 ml-auto font-mono">124 lines</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 bg-black/30 px-2.5 py-1 rounded border border-white/5">
                    <Check className="w-3.5 h-3.5" />
                    <span>replace_file_content: apply fuzzy score matcher</span>
                    <span className="text-[10px] text-gray-500 ml-auto font-mono">+18 -2</span>
                  </div>
                </div>

                {/* Assistant Output Summary */}
                <div className="bg-[#151C28] p-3.5 rounded-lg border border-white/10 text-xs text-gray-200 font-sans leading-relaxed space-y-2">
                  <p>
                    I've updated the fuzzy search implementation in <code className="px-1.5 py-0.5 rounded bg-black/50 text-cyan-300 font-mono text-[11px]">crates/warpui/src/search.rs</code>. It indexes cached action labels into a prefix trie and executes queries with zero UI hitching.
                  </p>
                  
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 text-[10px] font-mono text-gray-400">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Check className="w-3 h-3" /> Ready to test
                    </span>
                    <span>1,248 tokens · 0.42s · Subscription active</span>
                  </div>
                </div>

              </div>

              {/* Terminal CLI prompt line */}
              <div className="pt-2 flex items-center gap-2 text-gray-400 text-xs">
                <span className="text-emerald-400 font-bold">munir@macbook</span>
                <span className="text-gray-600">:</span>
                <span className="text-cyan-400 font-semibold">~/project</span>
                <span className="text-gray-400">$</span>
                <span className="w-2 h-4 bg-gray-200 animate-pulse inline-block" />
              </div>

            </div>

          </div>
        </motion.div>

      </div>
    </section>
  )
}
