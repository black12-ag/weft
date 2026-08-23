import React from 'react'

export default function WeftLogo({ className = "w-5 h-5", variant = "default" }) {
  if (variant === "white") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="9" height="9" rx="2" fill="white" />
        <rect x="13" y="2" width="9" height="9" rx="2" fill="white" fillOpacity="0.4" />
        <rect x="2" y="13" width="9" height="9" rx="2" fill="white" fillOpacity="0.4" />
        <rect x="13" y="13" width="9" height="9" rx="2" fill="white" />
      </svg>
    )
  }

  if (variant === "accent") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="9" height="9" rx="2.5" fill="#3B82F6" />
        <rect x="13" y="2" width="9" height="9" rx="2.5" fill="#6366F1" />
        <rect x="2" y="13" width="9" height="9" rx="2.5" fill="#06B6D4" />
        <rect x="13" y="13" width="9" height="9" rx="2.5" fill="#8B5CF6" />
      </svg>
    )
  }

  // Default solid black / theme colored
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="9" height="9" rx="2" fill="currentColor" />
      <rect x="13" y="2" width="9" height="9" rx="2" fill="currentColor" fillOpacity="0.5" />
      <rect x="2" y="13" width="9" height="9" rx="2" fill="currentColor" fillOpacity="0.5" />
      <rect x="13" y="13" width="9" height="9" rx="2" fill="currentColor" />
    </svg>
  )
}
