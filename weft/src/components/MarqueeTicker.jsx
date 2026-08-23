import React from 'react'

export default function MarqueeTicker() {
  const items = [
    'CHOOSE ANY HARNESS',
    'SELF-HOST OR WEFT-HOST',
    'CONNECT ANY TOOL',
    'OWN YOUR DATA',
    'ANY INFERENCE PROVIDER',
    'ANY MODEL',
    'CHOOSE ANY HARNESS',
    'SELF-HOST OR WEFT-HOST',
    'CONNECT ANY TOOL',
    'OWN YOUR DATA',
    'ANY INFERENCE PROVIDER',
    'ANY MODEL',
  ]

  return (
    <div className="border-y border-gray-200 py-3.5 bg-white overflow-hidden text-xs font-mono tracking-wider text-gray-500 uppercase">
      <div className="flex animate-marquee whitespace-nowrap gap-12">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-12">
            <span className="hover:text-black transition-colors">{item}</span>
            <span className="text-gray-300">●</span>
          </div>
        ))}
      </div>
    </div>
  )
}
