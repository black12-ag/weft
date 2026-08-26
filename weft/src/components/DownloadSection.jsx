import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Apple, Terminal, Copy, Check, Github } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function DownloadSection() {
  const [copied, setCopied] = useState('')
  // Show the current release version, fetched live so it's always up to date
  // (the download link itself always points at /releases/latest/download/Weft.dmg).
  const [version, setVersion] = useState('')
  useEffect(() => {
    fetch('https://api.github.com/repos/black12-ag/weft/releases/latest')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && d.tag_name && setVersion(d.tag_name))
      .catch(() => {})
  }, [])

  const handleCopy = (text, key = 'mac') => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.8 }
    })
  }

  return (
    <section id="download" className="py-24 bg-white border-b border-gray-100 overflow-hidden">
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
              Get Weft Terminal
            </h2>
          </div>
          <a
            href="https://github.com/black12-ag/weft/releases"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 hover:text-black font-medium group"
          >
            <span>Check all release notes & source code on GitHub Releases</span>
            <Github className="w-4 h-4" />
          </a>
        </motion.div>

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Mac (Live) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 font-bold text-black text-lg">
              <Apple className="w-5 h-5 fill-current" />
              <span>macOS</span>
              <span className="ml-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full px-2 py-0.5">Live</span>
              {version && <span className="text-[11px] font-mono text-gray-500">{version}</span>}
            </div>

            {/* macOS Box */}
            <motion.a
              href="https://github.com/black12-ag/weft/releases/latest/download/Weft.dmg"
              whileHover={{ y: -2 }}
              onClick={triggerConfetti}
              className="block border border-gray-300 rounded-xl p-4 bg-gray-50 space-y-1 hover:border-black transition-all cursor-pointer shadow-xs"
            >
              <div className="font-bold text-sm text-black">macOS (Universal / Apple Silicon & Intel)</div>
              <div className="text-xs text-gray-500">Download installer (.dmg){version ? ` · ${version}` : ''} — always the latest release</div>
            </motion.a>

            {/* Command Box */}
            <div className="border border-gray-200 rounded-xl p-3.5 flex items-center justify-between text-xs font-mono bg-white hover:border-gray-300 transition-colors">
              <span className="text-gray-800 truncate mr-2">$ curl -fsSL https://raw.githubusercontent.com/black12-ag/weft/master/install-mac.sh | bash</span>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleCopy('curl -fsSL https://raw.githubusercontent.com/black12-ag/weft/master/install-mac.sh | bash')}
                className="text-gray-400 hover:text-black shrink-0 cursor-pointer"
                title="Copy command"
              >
                {copied === 'mac' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </motion.button>
            </div>
          </motion.div>

          {/* Column 2: Linux (Coming Soon) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 font-bold text-black text-lg">
              <Terminal className="w-5 h-5" />
              <span>Linux</span>
              <span className="ml-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700 bg-amber-100 border border-amber-200 rounded-full px-2 py-0.5">Coming soon</span>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-1 opacity-70">
              <div className="font-bold text-sm text-black">Prebuilt packages — coming soon</div>
              <div className="text-xs text-gray-500">.deb, .rpm, .tar.zst & AppImage will land on GitHub Releases</div>
            </div>

            <div className="text-xs font-semibold text-gray-700">Or build it now — one command:</div>
            <div className="border border-gray-200 rounded-xl p-3.5 flex items-center justify-between text-xs font-mono bg-white hover:border-gray-300 transition-colors">
              <span className="text-gray-800 truncate mr-2">$ curl -fsSL https://raw.githubusercontent.com/black12-ag/weft/master/install-linux.sh | bash</span>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleCopy('curl -fsSL https://raw.githubusercontent.com/black12-ag/weft/master/install-linux.sh | bash', 'linux')}
                className="text-gray-400 hover:text-black shrink-0 cursor-pointer"
                title="Copy command"
              >
                {copied === 'linux' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </motion.button>
            </div>
          </motion.div>

          {/* Column 3: Windows (Coming Soon) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 font-bold text-black text-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 5.557L10.364 4.5v6.98H3V5.557zm0 6.943h7.364v6.98L3 18.443V12.5zm8.455-8.138L21 3v8.48h-9.545V4.362zM21 12.5V21l-9.545-1.362v-7.138H21z"/>
              </svg>
              <span>Windows</span>
              <span className="ml-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700 bg-amber-100 border border-amber-200 rounded-full px-2 py-0.5">Coming soon</span>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-1 opacity-70">
              <div className="font-bold text-sm text-black">Prebuilt installer — coming soon</div>
              <div className="text-xs text-gray-500">.exe for x64 & ARM64 will land on GitHub Releases</div>
            </div>

            <div className="text-xs font-semibold text-gray-700">Or build it now — one command (PowerShell):</div>
            <div className="border border-gray-200 rounded-xl p-3.5 flex items-center justify-between text-xs font-mono bg-white hover:border-gray-300 transition-colors">
              <span className="text-gray-800 truncate mr-2">&gt; irm https://raw.githubusercontent.com/black12-ag/weft/master/install-windows.ps1 | iex</span>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleCopy('irm https://raw.githubusercontent.com/black12-ag/weft/master/install-windows.ps1 | iex', 'win')}
                className="text-gray-400 hover:text-black shrink-0 cursor-pointer"
                title="Copy command"
              >
                {copied === 'win' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </motion.button>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
