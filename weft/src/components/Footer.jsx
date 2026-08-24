import React from 'react'

export default function Footer() {
  const columns = {
    product: [
      { name: 'Download', href: '#download' },
      { name: 'Features', href: '#features' },
      { name: 'Provider Integrations', href: '#platform' },
      { name: 'Changelog ↗', href: 'https://github.com/black12-ag/weft/releases' },
      { name: 'Releases ↗', href: 'https://github.com/black12-ag/weft/releases/latest' },
    ],
    opensource: [
      { name: 'GitHub Repository ↗', href: 'https://github.com/black12-ag/weft' },
      { name: 'Issues & Bugs ↗', href: 'https://github.com/black12-ag/weft/issues' },
      { name: 'FAQ ↗', href: 'https://github.com/black12-ag/weft/blob/master/FAQ.md' },
      { name: 'Security Policy ↗', href: 'https://github.com/black12-ag/weft/blob/master/SECURITY.md' },
      { name: 'Warp Upstream ↗', href: 'https://github.com/warpdotdev/warp' },
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
        <div className="flex items-center gap-2.5 mb-10">
          <img src="/weft-icon.jpg" alt="Weft" className="w-7 h-7 rounded-md shadow-xs" />
          <span className="font-bold text-lg text-black font-sans tracking-tight">weft</span>
        </div>

        {/* 3 Honest Columns Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          
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
              Open Source
            </div>
            <ul className="space-y-2.5">
              {columns.opensource.map(link => (
                <li key={link.name}>
                  <a href={link.href} target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
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
                  <a href={link.href} target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Attribution & Credit to Warp */}
        <div className="pt-8 border-t border-gray-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-600">
          <div className="flex flex-wrap items-center gap-3">
            <span>Weft is an open-source fork of Warp's terminal — credit to <a href="https://github.com/warpdotdev/warp" target="_blank" rel="noreferrer" className="underline hover:text-black">warpdotdev/warp</a>.</span>
            <span>•</span>
            <span>Free & Open Source</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-gray-800 font-medium">100% Local & Private</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
