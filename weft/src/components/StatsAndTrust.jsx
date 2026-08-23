import React from 'react'
import { motion } from 'framer-motion'

export default function StatsAndTrust() {
  const stats = [
    { value: '718K', label: 'active developers' },
    { value: '51%', label: 'of the Fortune 500' },
    { value: '179K', label: 'agents running daily' }
  ]

  const logos = [
    'ANTHROP\\C',
    'OpenAI',
    'docker',
    'Google',
    'Stanford',
    'phantom',
    'Rectangle',
    'GitHub',
    'amazon',
    'asana',
    'NVIDIA',
    'Retool',
    'vmware',
    'ramp',
    'DOORDASH',
  ]

  return (
    <section className="py-20 bg-[#F4F0FF] text-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 3 Main Numbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              <div className="text-5xl sm:text-6xl font-bold tracking-tight text-black font-sans">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-700 mt-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trusted By Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight mb-2">
            Trusted by leading <br className="hidden sm:inline" />
            engineering teams
          </h2>
          <p className="text-sm text-gray-600">
            Over 800,000 engineers at leading engineering teams use Weft
          </p>
        </motion.div>

        {/* Logos Grid with smooth hover animations */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-3 sm:grid-cols-5 gap-8 sm:gap-12 items-center text-gray-600 font-semibold text-lg sm:text-xl"
        >
          {logos.map((name, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.08, color: '#000000' }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="flex items-center justify-start text-gray-500 hover:text-black transition-colors font-sans tracking-tight cursor-default"
            >
              <span>{name}</span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
