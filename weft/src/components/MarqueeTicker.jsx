import React from 'react'

export default function MarqueeTicker() {
  const items = [
    'No login',
    'Your own subscriptions',
    'Every model + reasoning level',
    'Live streaming thinking',
    'MCP tools',
    'Usage & limits',
    'Shared memory',
    'Fast',
    'Open source',
    'No API keys needed',
    'Zero telemetry / 0 server calls',
    'Obsidian-compatible memory',
  ]

  return (
    <div className="w-full bg-black text-white py-3.5 overflow-hidden border-y border-neutral-800">
      <div className="flex select-none gap-8 animate-marquee whitespace-nowrap text-xs font-semibold tracking-widest uppercase font-mono">
        {/* Render twice for continuous loop */}
        {items.concat(items).map((item, idx) => (
          <div key={idx} className="flex items-center gap-8">
            <span className="text-gray-200 hover:text-white transition-colors">{item}</span>
            <span className="text-neutral-600">✦</span>
          </div>
        ))}
      </div>
    </div>
  )
}
