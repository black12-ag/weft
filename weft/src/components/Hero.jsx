import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MoreHorizontal, Check } from 'lucide-react'
import WeftLogo from './WeftLogo'

export default function Hero() {
  const [approved, setApproved] = useState(false)

  return (
    <section className="pt-16 pb-12 sm:pt-20 sm:pb-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Header Content */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mb-10"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-bold text-black tracking-[-0.03em] leading-[1.06] mb-6">
            The open platform for <br />
            automating development
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 font-normal max-w-2xl leading-relaxed mb-8">
            Infrastructure to build, measure, and interact with agents across your SDLC — so you ship more and spend less.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold tracking-wider uppercase">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="#factories"
              className="bg-black text-white px-5 py-3 rounded-md hover:bg-neutral-800 transition-colors shadow-sm inline-block"
            >
              Build your factory
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.03, x: 2 }}
              whileTap={{ scale: 0.97 }}
              href="#download"
              className="text-black hover:text-gray-600 px-3 py-3 font-semibold transition-colors flex items-center gap-1.5"
            >
              Download Weft Terminal
            </motion.a>
          </div>
        </motion.div>

        {/* Hero Visual Mockup with Sunset Aurora Background */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-8 rounded-3xl p-4 sm:p-8 overflow-hidden bg-gradient-to-br from-[#FFD3B6]/60 via-[#E4A5FF]/40 to-[#A0C4FF]/50 border border-gray-200/80 shadow-2xl"
        >
          
          {/* Main Dashboard Container */}
          <div className="relative max-w-5xl mx-auto bg-white/95 rounded-2xl border border-black/10 shadow-xl overflow-hidden backdrop-blur-md transition-transform duration-500 hover:shadow-2xl">
            
            {/* Top Window Bar */}
            <div className="bg-gray-100/90 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <div className="ml-4 flex items-center gap-3 text-xs font-medium text-gray-700">
                  <span className="text-gray-400">Benchmarks</span>
                  <span className="font-semibold text-black bg-white px-2.5 py-0.5 rounded shadow-xs border border-gray-200 flex items-center gap-1.5">
                    <WeftLogo className="w-3.5 h-3.5 text-black" />
                    <span>Weft Factory</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-gray-500 font-mono">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> compute</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> platform</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> inference</span>
              </div>
            </div>

            {/* Main Window Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 text-xs">
              
              {/* Left Column: Cost & Quality Metrics */}
              <div className="lg:col-span-4 p-5 space-y-5 bg-white">
                <div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl sm:text-3xl font-bold text-black tracking-tight font-mono">
                      $26.25 <span className="text-sm font-semibold text-emerald-600 font-sans">-28%</span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono">may 20</span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium mt-0.5">Cost per PR</div>
                  <div className="text-[10px] text-gray-400 font-mono mt-1">
                    compute $10.40 · platform $7.33 · inference $8.52
                  </div>
                </div>

                {/* Animated Chart Line */}
                <div className="h-16 w-full bg-gradient-to-r from-blue-50/50 via-indigo-50/50 to-purple-50/50 rounded-lg p-2 border border-gray-100 flex items-end overflow-hidden">
                  <svg viewBox="0 0 200 40" className="w-full h-full text-indigo-500">
                    <motion.path 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.8, ease: "easeOut" }}
                      d="M0 35 Q 50 25, 100 15 T 200 8" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                    />
                    <path d="M0 35 Q 50 25, 100 15 T 200 8 L 200 40 L 0 40 Z" fill="rgba(99, 102, 241, 0.12)" />
                  </svg>
                </div>

                {/* 4 Score Metric Cards */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <motion.div whileHover={{ y: -2 }} className="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 transition-shadow hover:shadow-xs">
                    <div className="text-[11px] font-medium text-gray-600">Code quality</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">PASS</span>
                      <span className="font-bold text-black font-mono">82%</span>
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ y: -2 }} className="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 transition-shadow hover:shadow-xs">
                    <div className="text-[11px] font-medium text-gray-600">Review pass rate</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">PASS</span>
                      <span className="font-bold text-black font-mono">78%</span>
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ y: -2 }} className="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 transition-shadow hover:shadow-xs">
                    <div className="text-[11px] font-medium text-gray-600">CI pass rate</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">PASS</span>
                      <span className="font-bold text-black font-mono">84%</span>
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ y: -2 }} className="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 transition-shadow hover:shadow-xs">
                    <div className="text-[11px] font-medium text-gray-600">Instruction adherence</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">PASS</span>
                      <span className="font-bold text-black font-mono">77%</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Middle Column: Activity Board */}
              <div className="lg:col-span-4 p-5 space-y-3 bg-gray-50/30">
                <div className="flex items-center justify-between font-semibold text-gray-800 text-xs">
                  <span>Activity</span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-2 font-sans">
                  <div className="p-2 rounded-md bg-white border border-gray-200 text-[11px] flex items-center justify-between hover:border-gray-300 transition-colors">
                    <span className="font-medium text-gray-800">Triage</span>
                    <span className="px-1.5 py-0.2 rounded bg-gray-100 font-mono text-gray-600 font-semibold">3</span>
                  </div>

                  <motion.div 
                    animate={{ scale: [1, 1.01, 1] }} 
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-200 text-[11px] space-y-1.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between font-semibold text-indigo-900">
                      <span>Planning</span>
                      <span className="px-1.5 py-0.2 rounded bg-indigo-100 font-mono text-indigo-700">2</span>
                    </div>
                    <div className="p-2 rounded bg-white border border-indigo-100 shadow-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono text-gray-500">WRP-1172</span>
                        <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">Needs attention</span>
                      </div>
                      <p className="font-medium text-gray-800 leading-tight">Weekly recursive improvement automation</p>
                    </div>
                  </motion.div>

                  <div className="p-2 rounded-md bg-white border border-gray-200 text-[11px] flex items-center justify-between hover:border-gray-300 transition-colors">
                    <span className="font-medium text-gray-800">Building</span>
                    <span className="px-1.5 py-0.2 rounded bg-gray-100 font-mono text-gray-600 font-semibold">3</span>
                  </div>

                  <div className="p-2 rounded-md bg-white border border-gray-200 text-[11px] flex items-center justify-between hover:border-gray-300 transition-colors">
                    <span className="font-medium text-gray-800">Reviewing</span>
                    <span className="px-1.5 py-0.2 rounded bg-gray-100 font-mono text-gray-600 font-semibold">2</span>
                  </div>

                  <div className="p-2 rounded-md bg-white border border-gray-200 text-[11px] flex items-center justify-between hover:border-gray-300 transition-colors">
                    <span className="font-medium text-gray-800">Shipped</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-mono font-semibold">4</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Implementation Plan */}
              <div className="lg:col-span-4 p-5 space-y-4 bg-white flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div>
                      <div className="text-[10px] font-mono text-gray-400">WRP-1172</div>
                      <div className="text-xs font-bold text-black">Implementation plan</div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">may 20</span>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-gray-700 mb-1">Summary</div>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      Cost per PR is already trending down and every scorer is passing. Profiling shows headroom to make the factory cheaper and sharper still.
                    </p>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-gray-700 mb-1">Proposed changes</div>
                    <ol className="text-[11px] text-gray-600 space-y-2 list-decimal list-inside leading-tight">
                      <li><strong className="text-black">Profile the pipeline</strong> — Trace agent runs to find stages burning tokens.</li>
                      <li><strong className="text-black">Upgrade shared instructions</strong> — Rewrite factory-wide instructions & skills.</li>
                      <li><strong className="text-black">Trim wasted work</strong> — Cache repeated context and drop redundant tool calls.</li>
                    </ol>
                  </div>
                </div>

                {/* Reject / Approve Buttons */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                  <button 
                    onClick={() => setApproved(false)}
                    className="px-3 py-1.5 rounded text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Reject
                  </button>
                  <motion.button 
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setApproved(!approved)}
                    className={`px-4 py-1.5 rounded text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 ${
                      approved ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {approved ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{approved ? 'Approved' : 'Approve'}</span>
                  </motion.button>
                </div>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
