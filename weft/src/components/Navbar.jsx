import React, { useState } from 'react'
import { Github, Menu, X } from 'lucide-react'
import WeftLogo from './WeftLogo'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-3.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left: Brand Logo & Links */}
        <div className="flex items-center gap-8">
          <a href="#" className="flex items-center gap-2 group">
            <div className="text-black group-hover:scale-105 transition-transform">
              <WeftLogo className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-black font-sans">weft</span>
          </a>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-6 text-[14px] text-gray-700 font-normal">
            <a href="#products" className="hover:text-black transition-colors">Products</a>
            <a href="#solutions" className="hover:text-black transition-colors">Solutions</a>
            <a href="#resources" className="hover:text-black transition-colors">Resources</a>
            <a href="#enterprise" className="hover:text-black transition-colors">Enterprise</a>
            <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
          </nav>
        </div>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-5 text-[13px]">
          {/* GitHub Star Count */}
          <a
            href="https://github.com/black12-ag/weft"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-gray-800 hover:text-black font-medium"
          >
            <Github className="w-4 h-4" />
            <span>64k</span>
          </a>

          <a
            href="#demo"
            className="text-gray-900 hover:text-black font-medium uppercase text-xs tracking-wider"
          >
            Book a demo
          </a>

          <a
            href="#download"
            className="bg-black text-white px-4 py-2 rounded-md font-semibold uppercase text-xs tracking-wider hover:bg-neutral-800 transition-colors shadow-sm"
          >
            Get Started
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href="#download"
            className="bg-black text-white px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider"
          >
            Get Started
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-gray-700 hover:text-black"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3 text-sm font-medium">
          <a href="#products" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-gray-800">Products</a>
          <a href="#solutions" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-gray-800">Solutions</a>
          <a href="#resources" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-gray-800">Resources</a>
          <a href="#enterprise" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-gray-800">Enterprise</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-gray-800">Pricing</a>
          <a href="https://github.com/black12-ag/weft" target="_blank" rel="noreferrer" className="flex items-center gap-2 py-1 text-gray-800">
            <Github className="w-4 h-4" />
            <span>GitHub (64k Stars)</span>
          </a>
        </div>
      )}
    </header>
  )
}
