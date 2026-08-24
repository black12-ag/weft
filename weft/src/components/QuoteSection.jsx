import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Cpu, Terminal } from 'lucide-react'

export default function QuoteSection() {
  return (
    <section className="py-20 bg-white text-black border-b border-gray-100 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/80 shadow-xs"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider mb-6">
            <span>Philosophy</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-black leading-tight mb-4">
            "Your models. Your subscriptions. <br className="hidden sm:inline" />
            Your machine."
          </h2>

          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            Weft believes AI terminal workflows should belong completely to the developer. No proxy markups, no locked cloud tiers, and no forced logins.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-gray-600">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>0% Cloud Markup</span>
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-blue-600" />
              <span>Direct CLI Execution</span>
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-600" />
              <span>Native Rust GPU Core</span>
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
