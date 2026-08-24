import React, { useState } from 'react'
import { Github, Menu, X, Download } from 'lucide-react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-3.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left: Brand Logo & Links */}
        <div className="flex items-center gap-8">
          <a href="#" className="flex items-center gap-2.5 group">
            <img src="/weft-icon.jpg" alt="Weft" className="w-7 h-7 rounded-md group-hover:scale-105 transition-transform shadow-xs" />
            <span className="font-bold text-xl tracking-tight text-black font-sans">weft</span>
          </a>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-6 text-[14px] text-gray-700 font-medium">
            <a href="#features" className="hover:text-black transition-colors">Features</a>
            <a href="#download" className="hover:text-black transition-colors">Download</a>
            <a 
              href="https://github.com/black12-ag/weft" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-black transition-colors"
            >
              GitHub
            </a>
            <a 
              href="https://github.com/black12-ag/weft/blob/master/FAQ.md" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-black transition-colors"
            >
              FAQ
            </a>
          </nav>
        </div>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-4 text-[13px]">
          {/* GitHub Star Count */}
          <a
            href="https://github.com/black12-ag/weft"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 text-gray-800 hover:text-black hover:border-gray-300 font-medium transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>

          <a
            href="#download"
            className="bg-black text-white px-4 py-2 rounded-md font-semibold text-xs tracking-wider uppercase hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href="#download"
            className="bg-black text-white px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider"
          >
            Download
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-gray-700 hover:text-black"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3 text-sm font-medium">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-gray-800">Features</a>
          <a href="#download" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-gray-800">Download</a>
          <a 
            href="https://github.com/black12-ag/weft" 
            target="_blank" 
            rel="noreferrer" 
            onClick={() => setMobileMenuOpen(false)} 
            className="flex items-center gap-2 py-1 text-gray-800"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <a 
            href="https://github.com/black12-ag/weft/blob/master/FAQ.md" 
            target="_blank" 
            rel="noreferrer" 
            onClick={() => setMobileMenuOpen(false)} 
            className="block py-1 text-gray-800"
          >
            FAQ
          </a>
        </div>
      )}
    </header>
  )
}
