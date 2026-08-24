import React from 'react'

export default function WeftLogo({ className = "w-5 h-5", variant = "default", useImage = false }) {
  if (useImage) {
    return (
      <img
        src="/weft-icon.jpg"
        alt="Weft"
        className={`${className} rounded-md object-cover`}
      />
    )
  }

  if (variant === "white") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M3 6 L7 18 L12 8 L17 18 L21 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M5 12 Q 8 10, 12 12 T 19 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
      </svg>
    )
  }

  if (variant === "accent") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="weftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <path d="M3 6 L7 18 L12 8 L17 18 L21 6" stroke="url(#weftGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M5 12 Q 8 10, 12 12 T 19 12" stroke="url(#weftGrad)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
      </svg>
    )
  }

  // Default: woven W mark using currentColor
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6 L7 18 L12 8 L17 18 L21 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M5 12 Q 8 10, 12 12 T 19 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
    </svg>
  )
}
