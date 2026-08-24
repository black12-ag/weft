import React from 'react'
import AnnouncementBar from './components/AnnouncementBar'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MarqueeTicker from './components/MarqueeTicker'
import FeatureBento from './components/FeatureBento'
import StatsAndTrust from './components/StatsAndTrust'
import PlatformSection from './components/PlatformSection'
import QuoteSection from './components/QuoteSection'
import UseEverywhere from './components/UseEverywhere'
import DownloadSection from './components/DownloadSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-black selection:text-white">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <MarqueeTicker />
        <FeatureBento />
        <StatsAndTrust />
        <PlatformSection />
        <QuoteSection />
        <UseEverywhere />
        <DownloadSection />
      </main>
      <Footer />
    </div>
  )
}
