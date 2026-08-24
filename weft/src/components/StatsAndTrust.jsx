import React from 'react'
import { motion } from 'framer-motion'
import { Github, Code2, ShieldCheck, Terminal } from 'lucide-react'

export default function StatsAndTrust() {
  const trustSignals = [
    {
      icon: Code2,
      title: '100% Open Source',
      description: 'Fully open-source codebase. Inspect every line, compile from source, and run without restrictions.',
    },
    {
      icon: ShieldCheck,
      title: 'Zero Cloud Relay',
      description: 'Your chats stay on your machine. Weft connects directly to your installed local CLI tools with no proxy.',
    },
    {
      icon: Terminal,
      title: 'Built on Warp Core',
      description: "Forked from Warp's world-class GPU-accelerated terminal engine with modern WarpUI architecture.",
    },
  ]

  return (
    <section className="py-20 bg-[#F0EBF8] text-black overflow-hidden border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black mb-3">
            Honest, transparent developer tools
          </h2>
          <p className="text-sm text-gray-700">
            No cloud telemetry, no subscription lock-in, and no hidden server dependencies.
          </p>
        </div>

        {/* 3 Trust Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {trustSignals.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-purple-100 shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-black mb-2">{item.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* GitHub Community Banner */}
        <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shrink-0">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-black">Star and contribute on GitHub</div>
              <div className="text-xs text-gray-600">Explore releases, documentation, and the full Rust codebase.</div>
            </div>
          </div>

          <a
            href="https://github.com/black12-ag/weft"
            target="_blank"
            rel="noreferrer"
            className="bg-black text-white hover:bg-neutral-800 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2 shrink-0 shadow-xs"
          >
            <Github className="w-4 h-4" />
            <span>black12-ag/weft</span>
          </a>
        </div>

      </div>
    </section>
  )
}
