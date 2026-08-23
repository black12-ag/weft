import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function QuoteSection() {
  const [activeIdx, setActiveIdx] = useState(0)

  const quotes = [
    {
      text: "“Things that would normally take me 10 minutes instead take just a few seconds to do with Weft.”",
      author: "Marco Casalaina, VP Products, Core AI and AI Futurist at Microsoft"
    },
    {
      text: "“Weft weaves all our team’s local CLI agents together with zero friction and zero remote proxy latency.”",
      author: "Principal Systems Engineer, Cloud Infrastructure"
    },
    {
      text: "“Having a native GPU-accelerated terminal that directly understands Claude, Codex, and Gemini is transformative.”",
      author: "Lead AI Architect, Developer Platforms"
    }
  ]

  const next = () => setActiveIdx((activeIdx + 1) % quotes.length)
  const prev = () => setActiveIdx((activeIdx - 1 + quotes.length) % quotes.length)

  return (
    <section className="py-24 sm:py-32 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Right Arrows with hover animations */}
        <div className="flex justify-end gap-2 mb-10">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={prev}
            className="w-10 h-10 rounded-md bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Previous quote"
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={next}
            className="w-10 h-10 rounded-md bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Next quote"
          >
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Large Quote with smooth text transitions */}
        <div className="min-h-[160px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.blockquote 
              key={activeIdx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="text-3xl sm:text-5xl font-bold text-black tracking-tight leading-[1.15] mb-12"
            >
              {quotes[activeIdx].text}
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* Attribution & Counter */}
        <div className="flex items-center justify-between text-xs text-gray-600 font-medium pt-4 border-t border-gray-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {quotes[activeIdx].author}
            </motion.div>
          </AnimatePresence>
          <div className="font-mono text-gray-400">{activeIdx + 1} / {quotes.length}</div>
        </div>

      </div>
    </section>
  )
}
