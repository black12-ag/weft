import React from 'react'
import { motion } from 'framer-motion'
import { 
  ShieldCheck, 
  Terminal, 
  Sliders, 
  Zap, 
  Server, 
  Gauge, 
  Brain, 
  Sparkles,
  CheckCircle2,
  Lock,
  Cpu
} from 'lucide-react'

export default function FeatureBento() {
  const features = [
    {
      icon: ShieldCheck,
      number: '01',
      title: 'No login, ever',
      badge: 'Zero Auth',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      description: 'Runs directly on your local CLI subscriptions. No Weft account, no API keys, and no calls to any server.'
    },
    {
      icon: Terminal,
      number: '02',
      title: 'All your CLIs, one chat',
      badge: 'Multi-Provider',
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400',
      description: 'Claude Code, Codex, Gemini (+ OpenCode, Cursor, Ollama, Copilot). Connect each from Settings with one click; already-logged-in CLIs auto-connect.'
    },
    {
      icon: Sliders,
      number: '03',
      title: 'Every model + reasoning level',
      badge: 'Granular Control',
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
      description: 'Pick any model and its thinking budget (low → max) on the fly to balance lightning iteration with deep mathematical reasoning.'
    },
    {
      icon: Sparkles,
      number: '04',
      title: 'See everything it does',
      badge: 'Full Transparency',
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
      description: 'Its thinking plus every file it reads, edits, writes, and every command it runs — folded into one collapsible “Thought & worked” dropdown. The answer stays clean; click the chevron to see it all.'
    },
    {
      icon: Server,
      number: '05',
      title: 'MCP servers & tools',
      badge: 'Tool Ecosystem',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
      description: 'Leverage your local CLIs’ Model Context Protocol (MCP) tools and toggle individual servers on or off directly inside Settings.'
    },
    {
      icon: Gauge,
      number: '06',
      title: 'Usage & rate limits',
      badge: 'Live Telemetry',
      color: 'from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-400',
      description: 'See cost per 1M tokens, tokens consumed per chat, and each CLI’s live subscription limits (5-hour / weekly / monthly) in the model picker.'
    },
    {
      icon: Brain,
      number: '07',
      title: 'Remembers your project',
      badge: 'Persistent Memory',
      color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400',
      description: 'Opens straight into the folder you’re in and recalls earlier sessions automatically — through your CLI’s own memory (claude-mem, CLAUDE.md) — so context carries over without re-explaining.'
    },
    {
      icon: Zap,
      number: '08',
      title: 'Warm sessions, fast replies',
      badge: 'Native Rust',
      color: 'from-amber-400/20 to-yellow-500/10 border-amber-400/30 text-amber-300',
      description: 'Built on Warp’s GPU-accelerated Rust engine. Each chat keeps your CLI loaded in a warm session — the first message warms up, every message after is fast.'
    }
  ]

  return (
    <section id="features" className="py-24 bg-[#0A0D14] text-white border-b border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>Built for Modern Developers</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Real features. Zero compromise.
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            Everything you need to run autonomous AI agents in your everyday terminal workflow — powered by the CLI tools you already trust.
          </p>
        </div>

        {/* 8 Features Bento Grid (2x4 or 4x2 responsive) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className={`p-6 rounded-2xl bg-[#111622] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between relative overflow-hidden group`}
              >
                {/* Subtle gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${feat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-gray-500">{feat.number}</span>
                  </div>

                  <div className="text-[11px] font-mono text-cyan-400 mb-1">{feat.badge}</div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">{feat.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{feat.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
