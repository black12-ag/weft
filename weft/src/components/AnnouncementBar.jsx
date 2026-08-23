import React from 'react'

export default function AnnouncementBar() {
  return (
    <aside aria-label="Announcement" className="bg-black text-white text-[13px] py-2.5 px-4 text-center font-normal tracking-tight">
      <span>
        Introducing Weft Factories: open, flexible infrastructure for building your own cloud software factory.{' '}
      </span>
      <a href="#factories" className="underline hover:text-gray-300 font-medium ml-1">
        Learn More
      </a>
    </aside>
  )
}
