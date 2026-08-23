import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Apple } from 'lucide-react'
import WeftLogo from './WeftLogo'

export default function UseEverywhere() {
  const [copied, setCopied] = useState(false)
  const curlCmd = "$ git clone https://github.com/black12-ag/weft && cd weft && ./install.sh"

  const handleCopy = () => {
    navigator.clipboard.writeText("git clone https://github.com/black12-ag/weft && cd weft && ./install.sh")
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
              Use Weft everywhere
            </h2>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm max-w-md">
            Weft is an open agentic development platform that was built to work wherever and however you work.
          </p>
        </motion.div>

        {/* 3 Colored Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Factories (Vibrant Blue) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="rounded-2xl p-6 flex flex-col justify-between text-white overflow-hidden relative shadow-lg min-h-[460px] bg-gradient-to-br from-blue-600 to-indigo-700"
          >
            {/* Top Mockup Illustration */}
            <div className="bg-white/95 rounded-xl p-3 text-black shadow-md space-y-2 text-[10px] mb-6">
              <div className="flex items-center justify-between text-gray-500 pb-1 border-b border-gray-100 font-mono">
                <span className="flex items-center gap-1 font-semibold text-black">
                  <WeftLogo className="w-3 h-3 text-blue-600" />
                  <span>Weft Factory</span>
                </span>
                <span className="text-blue-600 font-semibold">$26.25 / PR</span>
              </div>
              <div className="h-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded p-1.5 flex items-end">
                <svg viewBox="0 0 100 30" className="w-full h-full text-blue-600">
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5 }}
                    d="M0 25 Q 30 18, 60 10 T 100 4" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                  />
                  <path d="M0 25 Q 30 18, 60 10 T 100 4 L 100 30 L 0 30 Z" fill="rgba(37, 99, 235, 0.15)" />
                </svg>
              </div>
              <div className="flex justify-between text-[9px] text-gray-600 font-mono">
                <span>PASS 82%</span>
                <span>PASS 84%</span>
                <span>PASS 77%</span>
              </div>
            </div>

            {/* Bottom Content */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <WeftLogo className="w-4 h-4 text-white" variant="white" />
                  <span>Factories</span>
                </h3>
                <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                  A software factory that automates and orchestrates software development.
                </p>
              </div>

              <div>
                <a
                  href="#factories"
                  className="inline-block text-xs font-semibold text-white hover:underline underline-offset-4"
                >
                  Request access
                </a>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Terminal (Dark Teal/Slate) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="rounded-2xl p-6 flex flex-col justify-between text-white overflow-hidden relative shadow-lg min-h-[460px] bg-gradient-to-br from-[#1A3636] to-[#0F172A]"
          >
            {/* Top Mockup Illustration */}
            <div className="bg-[#0B0F17] rounded-xl p-3 text-gray-300 border border-white/10 shadow-md font-mono text-[10px] space-y-2 mb-6">
              <div className="flex items-center gap-1.5 pb-1 border-b border-white/10 text-gray-500">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="ml-2 text-gray-400 flex items-center gap-1">
                  <WeftLogo className="w-2.5 h-2.5 text-emerald-400" />
                  <span>weft-terminal</span>
                </span>
              </div>
              <div className="text-emerald-400">$ cargo test --lib</div>
              <div className="text-gray-400 leading-tight">
                running 148 tests...<br />
                test result: <span className="text-emerald-400">ok</span>. 148 passed
              </div>
            </div>

            {/* Bottom Content */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <WeftLogo className="w-4 h-4 text-emerald-400" />
                  <span>Terminal</span>
                </h3>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  An open source terminal built for AI-assisted software development.
                </p>
              </div>

              <div>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#download"
                  className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  <span>Download</span>
                  <Apple className="w-3.5 h-3.5 fill-current" />
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Agent CLI (Vibrant Purple) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="rounded-2xl p-6 flex flex-col justify-between text-white overflow-hidden relative shadow-lg min-h-[460px] bg-gradient-to-br from-purple-600 to-fuchsia-700"
          >
            {/* Top Mockup Illustration */}
            <div className="bg-[#0B0F17] rounded-xl p-3 text-gray-300 border border-white/10 shadow-md font-mono text-[10px] space-y-2 mb-6">
              <div className="flex items-center gap-1.5 pb-1 border-b border-white/10 text-gray-500">
                <span className="text-purple-300 font-bold flex items-center gap-1">
                  <WeftLogo className="w-3 h-3 text-purple-300" variant="white" />
                  <span>weft agent cli</span>
                </span>
              </div>
              <pre className="text-cyan-300 text-[9px] leading-tight font-mono">
{`   __      __        __ _   
   \\ \\    / /__  ___/ /| |_ 
    \\ \\/\\/ // -_)/ _  / |  _|
     \\_/\\_/ \\___/\\_,_/   \\__|`}
              </pre>
              <div className="text-gray-400 text-[9px]">
                Ready: claude, codex, gemini
              </div>
            </div>

            {/* Bottom Content */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <WeftLogo className="w-4 h-4 text-purple-200" variant="white" />
                  <span>Agent CLI</span>
                </h3>
                <p className="text-xs text-purple-100 mt-1 leading-relaxed">
                  A powerful coding agent that works in any terminal.
                </p>
              </div>

              <div>
                <div className="bg-black/60 border border-white/20 rounded-lg p-2.5 flex items-center justify-between text-[11px] font-mono">
                  <span className="truncate mr-2">{curlCmd}</span>
                  <motion.button 
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCopy} 
                    className="text-gray-300 hover:text-white shrink-0 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </motion.button>
                </div>
                <div className="text-[11px] text-purple-200 mt-2 font-medium">
                  Mac | Linux | Windows
                </div>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
