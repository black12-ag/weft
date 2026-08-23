import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Apple, Terminal, ArrowRight, Copy, Check } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function DownloadSection() {
  const [copiedMac, setCopiedMac] = useState(false)
  const [copiedWin, setCopiedWin] = useState(false)

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text)
    if (type === 'mac') {
      setCopiedMac(true)
      setTimeout(() => setCopiedMac(false), 2000)
    } else {
      setCopiedWin(true)
      setTimeout(() => setCopiedWin(false), 2000)
    }
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
            className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 hover:text-black font-medium group"
          >
            <span>Get early access to unreleased and experimental features with Weft Preview</span>
            <motion.div 
              whileHover={{ x: 3 }}
              className="w-6 h-6 rounded bg-black text-white flex items-center justify-center group-hover:bg-neutral-800"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.div>
          </a>
        </motion.div>

        {/* 3 Columns Grid matching screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Mac */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 font-bold text-black text-lg">
              <Apple className="w-5 h-5 fill-current" />
              <span>Mac</span>
            </div>

            {/* macOS Box */}
            <motion.a
              href="https://github.com/black12-ag/weft/releases/latest/download/Weft.dmg"
              whileHover={{ y: -2 }}
              onClick={triggerConfetti}
              className="block border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-1 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer"
            >
              <div className="font-bold text-sm text-black">macOS</div>
              <div className="text-xs text-gray-500">Version 10.14+ · Download .dmg</div>
            </motion.a>

            {/* Command Box */}
            <div className="border border-gray-200 rounded-xl p-3.5 flex items-center justify-between text-xs font-mono bg-white hover:border-gray-300 transition-colors">
              <span className="text-gray-800 truncate mr-2">$ curl -L -o Weft.dmg https://github.com/black12-ag/weft/releases/latest/download/Weft.dmg</span>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleCopy('curl -L -o Weft.dmg https://github.com/black12-ag/weft/releases/latest/download/Weft.dmg', 'mac')}
                className="text-gray-400 hover:text-black shrink-0 cursor-pointer"
              >
                {copiedMac ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </motion.button>
            </div>
          </motion.div>

          {/* Column 2: Linux */}
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

            {/* Top Distro Boxes */}
            <div className="grid grid-cols-2 gap-3 opacity-60 pointer-events-none select-none">
              <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/50 hover:border-gray-300 transition-colors">
                <div className="font-bold text-xs text-black">.deb</div>
                <div className="text-[11px] text-gray-500">Debian, Ubuntu</div>
              </div>
              <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/50 hover:border-gray-300 transition-colors">
                <div className="font-bold text-xs text-black">.rpm</div>
                <div className="text-[11px] text-gray-500">Red Hat, Fedora, SUSE</div>
              </div>
            </div>

            {/* Format Rows */}
            <div className="space-y-2 border border-gray-200 rounded-xl p-3 bg-white text-xs opacity-60 pointer-events-none select-none">
              
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="font-semibold text-gray-800">.deb</span>
                <div className="flex gap-1.5 font-mono text-[11px]">
                  <motion.a whileHover={{ scale: 1.05 }} href="https://github.com/black12-ag/weft/releases/latest" className="px-2 py-0.5 rounded border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium">x64</motion.a>
                  <motion.a whileHover={{ scale: 1.05 }} href="https://github.com/black12-ag/weft/releases/latest" className="px-2 py-0.5 rounded border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium">ARM64</motion.a>
                </div>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="font-semibold text-gray-800">.rpm</span>
                <div className="flex gap-1.5 font-mono text-[11px]">
                  <motion.a whileHover={{ scale: 1.05 }} href="https://github.com/black12-ag/weft/releases/latest" className="px-2 py-0.5 rounded border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium">x64</motion.a>
                  <motion.a whileHover={{ scale: 1.05 }} href="https://github.com/black12-ag/weft/releases/latest" className="px-2 py-0.5 rounded border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium">ARM64</motion.a>
                </div>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <div>
                  <span className="font-semibold text-gray-800">.tar.zst</span>
                  <span className="text-[10px] text-gray-400 ml-2">Arch Linux</span>
                </div>
                <div className="flex gap-1.5 font-mono text-[11px]">
                  <motion.a whileHover={{ scale: 1.05 }} href="https://github.com/black12-ag/weft/releases/latest" className="px-2 py-0.5 rounded border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium">x64</motion.a>
                  <motion.a whileHover={{ scale: 1.05 }} href="https://github.com/black12-ag/weft/releases/latest" className="px-2 py-0.5 rounded border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium">ARM64</motion.a>
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="font-semibold text-gray-800">AppImage</span>
                <div className="flex gap-1.5 font-mono text-[11px]">
                  <motion.a whileHover={{ scale: 1.05 }} href="https://github.com/black12-ag/weft/releases/latest" className="px-2 py-0.5 rounded border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium">x64</motion.a>
                  <motion.a whileHover={{ scale: 1.05 }} href="https://github.com/black12-ag/weft/releases/latest" className="px-2 py-0.5 rounded border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium">ARM64</motion.a>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Column 3: Windows */}
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

            {/* Windows 10/11 Boxes */}
            <div className="grid grid-cols-2 gap-3 opacity-60 pointer-events-none select-none">
              <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/50 hover:border-gray-300 transition-colors">
                <div className="font-bold text-xs text-black">.exe</div>
                <div className="text-[11px] text-gray-500">Windows 11/10 x64</div>
              </div>
              <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/50 hover:border-gray-300 transition-colors">
                <div className="font-bold text-xs text-black">.exe</div>
                <div className="text-[11px] text-gray-500">Windows 11/10 ARM64</div>
              </div>
            </div>

            {/* Winget Box */}
            <div className="border border-gray-200 rounded-xl p-3.5 flex items-center justify-between text-xs font-mono bg-white hover:border-gray-300 transition-colors opacity-60 pointer-events-none select-none">
              <span className="text-gray-800 truncate mr-2">$ winget install Weft.Weft</span>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleCopy('winget install Weft.Weft', 'win')}
                className="text-gray-400 hover:text-black shrink-0 cursor-pointer"
              >
                {copiedWin ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </motion.button>
            </div>

            {/* Direct Exe buttons */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-white text-xs opacity-60 pointer-events-none select-none">
              <span className="font-semibold text-gray-800">.exe</span>
              <div className="flex gap-1.5 font-mono text-[11px]">
                <motion.a whileHover={{ scale: 1.05 }} href="https://github.com/black12-ag/weft/releases/latest" className="px-2 py-0.5 rounded border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium">x64</motion.a>
                <motion.a whileHover={{ scale: 1.05 }} href="https://github.com/black12-ag/weft/releases/latest" className="px-2 py-0.5 rounded border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium">ARM64</motion.a>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
