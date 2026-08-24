import React from 'react'

export default function AnnouncementBar() {
  return (
    <aside aria-label="Announcement" className="bg-black text-white text-[13px] py-2.5 px-4 text-center font-normal tracking-tight">
      <span>
        Weft is free & open source —{' '}
      </span>
      <a 
        href="https://github.com/black12-ag/weft" 
        target="_blank" 
        rel="noreferrer"
        className="underline hover:text-gray-300 font-medium ml-1 inline-flex items-center gap-1"
      >
        <span>⭐ star it on GitHub</span>
      </a>
    </aside>
  )
}
