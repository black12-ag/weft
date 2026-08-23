import React from 'react'
import { motion } from 'framer-motion'

export default function FactorySection() {
  return (
    <section id="factories" className="py-24 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Factory Preview Graphic */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 bg-[#F8FAFC] border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="grid grid-cols-2 gap-4">
              
              {/* Activity Board Mockup */}
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-2 text-xs">
                <div className="font-semibold text-gray-800 pb-1 border-b border-gray-100 flex justify-between">
                  <span>Activity</span>
                  <span className="text-gray-400">● Live</span>
                </div>
                <div className="space-y-1.5 font-sans">
                  <div className="p-2 rounded bg-gray-50 flex items-center justify-between text-[11px]">
                    <span className="text-gray-700">Triage</span>
                    <span className="font-bold text-gray-900">2</span>
                  </div>
                  <motion.div 
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ repeat: Infinity, duration: 3.5 }}
                    className="p-2 rounded bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-[11px]"
                  >
                    <span className="text-indigo-900 font-medium">Planning</span>
                    <span className="font-bold text-indigo-700">2</span>
                  </motion.div>
                  <div className="p-2 rounded bg-gray-50 flex items-center justify-between text-[11px]">
                    <span className="text-gray-700">Building</span>
                    <span className="font-bold text-gray-900">3</span>
                  </div>
                  <div className="p-2 rounded bg-gray-50 flex items-center justify-between text-[11px]">
                    <span className="text-gray-700">Reviewing</span>
                    <span className="font-bold text-gray-900">2</span>
                  </div>
                  <div className="p-2 rounded bg-emerald-50 text-emerald-800 flex items-center justify-between text-[11px]">
                    <span className="font-medium">Shipped</span>
                    <span className="font-bold">4</span>
                  </div>
                </div>
              </div>

              {/* Cost & Quality charts */}
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-1">
                  <div className="text-[11px] text-gray-500 font-medium">Cost per PR</div>
                  <div className="text-xl font-bold text-black font-mono">$57.55</div>
                  <div className="text-[10px] text-gray-400 font-mono">$38,387.92 • 667 PRs</div>
                  
                  <div className="h-10 w-full pt-1">
                    <svg viewBox="0 0 100 25" className="w-full h-full text-indigo-500">
                      <motion.path 
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5 }}
                        d="M0 22 Q 25 18, 50 12 T 100 4" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                      />
                      <path d="M0 22 Q 25 18, 50 12 T 100 4 L 100 25 L 0 25 Z" fill="rgba(99, 102, 241, 0.1)" />
                    </svg>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-1">
                  <div className="text-[11px] text-gray-500 font-medium">Code Quality</div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">PASS</span>
                    <span className="text-lg font-bold text-black font-mono">93%</span>
                  </div>
                  <div className="h-6 w-full pt-1">
                    <svg viewBox="0 0 100 15" className="w-full h-full text-emerald-500">
                      <motion.path 
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.3 }}
                        d="M0 12 L 30 8 L 60 10 L 100 2" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                      />
                    </svg>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Right Column: Copy & CTA */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 font-sans">
              Introducing Weft Factories
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-bold text-black tracking-tight leading-tight">
              Open infrastructure <br />
              for cloud <br />
              software factories
            </h2>

            <p className="text-base text-gray-600 leading-relaxed max-w-lg">
              Run fleets of coding agents across your SDLC defined as code, on any model or harness, with humans at the checkpoints you choose.
            </p>

            <div className="pt-2">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#factories"
                className="inline-block bg-black text-white px-5 py-3 rounded-md text-xs font-semibold tracking-wider uppercase hover:bg-neutral-800 transition-colors shadow-sm"
              >
                Build your factory
              </motion.a>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
