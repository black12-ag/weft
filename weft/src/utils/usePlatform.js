import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'

export function usePlatform() {
  const [platform, setPlatform] = useState({
    os: 'mac-arm',
    label: 'Download for macOS (Apple Silicon)',
    sublabel: 'M1 / M2 / M3 / M4 · .dmg',
    url: 'https://github.com/black12-ag/weft/releases/latest/download/Weft.dmg',
    filename: 'Weft.dmg',
    icon: 'apple',
    isLive: true,
  })

  useEffect(() => {
    async function detect() {
      const ua = navigator.userAgent || ''
      const navPlatform = navigator.platform || ''
      
      let isMac = /Mac/i.test(navPlatform) || /Macintosh/i.test(ua)
      let isWindows = /Win/i.test(navPlatform) || /Windows/i.test(ua)
      let isLinux = /Linux/i.test(navPlatform) || /Linux/i.test(ua)

      if (isMac) {
        let isArm = true
        if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
          try {
            const hints = await navigator.userAgentData.getHighEntropyValues(['architecture', 'bitness'])
            if (hints.architecture === 'x86') {
              isArm = false
            }
          } catch (e) {
            // fallback to Apple Silicon default
          }
        }

        if (isArm) {
          setPlatform({
            os: 'mac-arm',
            label: 'Download for macOS (Apple Silicon)',
            sublabel: 'M1 / M2 / M3 / M4 · .dmg',
            url: 'https://github.com/black12-ag/weft/releases/latest/download/Weft.dmg',
            filename: 'Weft.dmg',
            icon: 'apple',
            isLive: true,
          })
        } else {
          setPlatform({
            os: 'mac-intel',
            label: 'Download for macOS (Intel)',
            sublabel: 'Intel x64 · .dmg',
            url: 'https://github.com/black12-ag/weft/releases/latest/download/Weft.dmg',
            filename: 'Weft.dmg',
            icon: 'apple',
            isLive: true,
          })
        }
      } else if (isWindows) {
        setPlatform({
          os: 'windows',
          label: 'Download for Windows',
          sublabel: 'Windows 11/10 · Coming soon',
          url: '#download',
          filename: 'Weft-Setup.exe',
          icon: 'windows',
          isLive: false,
        })
      } else if (isLinux) {
        setPlatform({
          os: 'linux',
          label: 'Download for Linux',
          sublabel: '.deb / .rpm / .tar.zst · Coming soon',
          url: '#download',
          filename: 'weft.deb',
          icon: 'linux',
          isLive: false,
        })
      }
    }

    detect()
  }, [])

  const triggerDirectDownload = (overrideUrl, overrideFilename) => {
    const targetUrl = overrideUrl || platform.url
    const targetFilename = overrideFilename || platform.filename

    // Trigger instant confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.75 },
        colors: ['#3B82F6', '#06B6D4', '#8B5CF6', '#10B981']
      })
    } catch (e) {}

    // Direct browser download trigger
    if (targetUrl && targetUrl.startsWith('http')) {
      const link = document.createElement('a')
      link.href = targetUrl
      link.setAttribute('download', targetFilename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (targetUrl && targetUrl.startsWith('#')) {
      const targetElement = document.querySelector(targetUrl)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return {
    ...platform,
    triggerDirectDownload,
  }
}
