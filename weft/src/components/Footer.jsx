import React from 'react'
import WeftLogo from './WeftLogo'

export default function Footer() {
  const columns = {
    product: [
      { name: 'Download', href: '#download' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Enterprise', href: '#enterprise' },
      { name: 'Changelog', href: 'https://github.com/black12-ag/weft/releases' },
      { name: 'Docs', href: 'https://github.com/black12-ag/weft#readme' },
      { name: 'Open Source â', href: 'https://github.com/black12-ag/weft' },
      { name: 'Status', href: '#status' },
    ],
    resources: [
      { name: 'Blog', href: '#blog' },
      { name: 'FAQ', href: 'https://github.com/black12-ag/weft/blob/master/FAQ.md' },
      { name: 'Community', href: '#community' },
      { name: 'Support', href: '#support' },
      { name: 'Do Things with Weft', href: '#do-things' },
      { name: 'Terminus', href: '#terminus' },
    ],
    company: [
      { name: 'About', href: '#about' },
      { name: 'How We Work', href: '#how-we-work' },
      { name: 'Careers', href: '#careers' },
      { name: 'Press', href: '#press' },
      { name: 'Contact', href: '#contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Security', href: 'https://github.com/black12-ag/weft/blob/master/SECURITY.md' },
      { name: 'Cookie Notice', href: '#cookies' },
      { name: 'Data Processing Addendum', href: '#dpa' },
      { name: 'Enterprise License', href: '#license' },
    ],
    connect: [
      { name: 'GitHub ↗', href: 'https://github.com/black12-ag/weft' },
      { name: 'Portfolio ↗', href: 'https://portfolio.ethio-viral.com' },
      { name: 'WhatsApp ↗', href: 'https://wa.me/251907806267' },
      { name: 'Telegram ↗', href: 'https://t.me/muay011' },
      { name: 'LinkedIn ↗', href: 'https://www.linkedin.com/in/munir-m-3a23353a1' },
    ]
  }

  return (
    <footer className="bg-[#ECECEE] text-gray-700 pt-16 pb-12 text-xs border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Bar */}
        <div className="flex items-center gap-2 mb-10">
          <img src="/weft-icon.jpg" alt="Weft" className="w-7 h-7 rounded-md" />
          <span className="font-bold text-lg text-black font-sans tracking-tight">weft</span>
        </div>

        {/* 5 Columns Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-16">
          
          <div>
            <div className="font-bold text-black uppercase tracking-wider text-[11px] mb-4">
              Product
            </div>
            <ul className="space-y-2.5">
              {columns.product.map(link => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-black transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-bold text-black uppercase tracking-wider text-[11px] mb-4">
              Resources
            </div>
            <ul className="space-y-2.5">
              {columns.resources.map(link => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-black transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-bold text-black uppercase tracking-wider text-[11px] mb-4">
              Company
            </div>
            <ul className="space-y-2.5">
              {columns.company.map(link => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-black transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-bold text-black uppercase tracking-wider text-[11px] mb-4">
              Legal
            </div>
            <ul className="space-y-2.5">
              {columns.legal.map(link => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-black transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-bold text-black uppercase tracking-wider text-[11px] mb-4">
              Connect
            </div>
            <ul className="space-y-2.5">
              {columns.connect.map(link => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-black transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Status & Copyright */}
        <div className="pt-8 border-t border-gray-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <div className="flex items-center gap-4">
            <span>All Rights Reserved Â© 2026</span>
            <span>Â·</span>
            <span>SOC 2 Certified</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-gray-700">All Systems Operational</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
