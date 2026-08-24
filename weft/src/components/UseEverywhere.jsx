import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Apple, Terminal, Shield, Sparkles } from 'lucide-react'
import WeftLogo from './WeftLogo'

export default function UseEverywhere() {
  const [copied, setCopied] = useState(false)
  const installCmd = "git clone https://github.com/black12-ag/weft && cd weft && ./install.sh"

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-24 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <h2 className="text-3xl sm:text-5xl font-bold text-black tracking-tight">
              An open terminal for your everyday workflow
            </h2>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm max-w-md">
            Weft brings your local CLI subscriptions right into a high-performance terminal. Free, open source, and completely private.
          </p>
        </motion.div>

        {/* 2-Column Focus Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Weft Terminal Desktop App */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="rounded-3xl p-8 flex flex-col justify-between text-white overflow-hidden relative shadow-xl min-h-[440px] bg-gradient-to-br from-[#121824] to-[#0A0D14] border border-white/10"
          >
            {/* Top Mockup */}
            <div className="bg-[#080B10] rounded-2xl p-4 text-gray-300 border border-white/10 shadow-lg font-mono text-xs space-y-2 mb-6">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-gray-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-gray-300 font-sans font-medium">Weft Terminal</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">● Local Ready</span>
              </div>
              <div className="text-cyan-300">$ weft --version</div>
              <div className="text-gray-400 text-[11px] leading-relaxed">
                weft 0.1.0 (forked from Warp core)<br />
                active providers: <span className="text-amber-300">claude</span>, <span className="text-emerald-300">codex</span>, <span className="text-blue-300">gemini</span>
              </div>
            </div>

            {/* Bottom Content */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2 text-white">
                  <Terminal className="w-6 h-6 text-cyan-400" />
                  <span>Weft Terminal</span>
                </h3>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  An open-source terminal built for AI-assisted software development, with your CLI agents running directly alongside your shell.
                </p>
              </div>

              <div>
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href="#download"
                  className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors shadow-sm"
                >
                  <span>Download for macOS</span>
                  <Apple className="w-3.5 h-3.5 fill-current" />
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Clone & Build from Source */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="rounded-3xl p-8 flex flex-col justify-between text-white overflow-hidden relative shadow-xl min-h-[440px] bg-gradient-to-br from-[#1E1B4B] via-[#0F172A] to-[#0A0D14] border border-indigo-500/20"
          >
            {/* Top Mockup */}
            <div className="bg-[#080B10] rounded-2xl p-4 text-gray-300 border border-white/10 shadow-lg font-mono text-xs space-y-2 mb-6">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-gray-400">
                <span className="text-purple-300 font-sans font-medium flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span>Open Source Build</span>
                </span>
                <span className="text-[10px] text-gray-500">cargo + rust</span>
              </div>
              <div className="text-emerald-400 text-[11px]">$ cargo build --release --bin warp</div>
              <div className="text-gray-400 text-[10px] leading-relaxed">
                Compiling warp_core v0.1.0...<br />
                Finished release [optimized] target in 14.8s
              </div>
            </div>

            {/* Bottom Content */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2 text-white">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  <span>Build from Source</span>
                </h3>
                <p className="text-xs text-indigo-100 mt-2 leading-relaxed">
                  Clone the repository, inspect the Rust source code, and run it locally with a single script.
                </p>
              </div>

              <div>
                <div className="bg-black/80 border border-white/20 rounded-xl p-3 flex items-center justify-between text-[11px] font-mono">
                  <span className="truncate mr-2 text-gray-200">{installCmd}</span>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCopy} 
                    className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white shrink-0 cursor-pointer transition-colors"
                    title="Copy command"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </motion.button>
                </div>
                <div className="text-[10px] text-gray-400 mt-2 font-mono">
                  macOS (Apple Silicon / Intel) · Linux & Windows support in progress
                </div>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
