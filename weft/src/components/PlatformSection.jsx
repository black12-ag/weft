import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import WeftLogo from './WeftLogo'

export default function PlatformSection() {
  const [activeTab, setActiveTab] = useState('terminal')

  return (
    <section id="platform" className="py-24 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-4">
            <WeftLogo className="w-4 h-4 text-black" />
            <span className="font-bold text-sm tracking-tight text-black">weft</span>
            <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500 ml-4 font-medium">
              <span>Products</span>
              <span>Solutions</span>
              <span>Resources</span>
              <span>Enterprise</span>
              <span>Pricing</span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-black tracking-tight mb-4">
            One platform for <br />
            Agentic Development
          </h2>
          <p className="text-gray-600 text-base max-w-xl">
            Every layer of the agentic stack, from your local terminal to fleets of cloud agents — built to work together.
          </p>
        </motion.div>

        {/* 2-Column Interactive Platform Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: 3 Layer Selectors */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* 1. Factories */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setActiveTab('factories')}
              className={`p-6 rounded-2xl border transition-all cursor-pointer relative ${
                activeTab === 'factories'
                  ? 'bg-gray-50 border-gray-400 shadow-sm'
                  : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
            >
              {activeTab === 'factories' && (
                <div className="absolute left-0 top-6 bottom-6 w-1 bg-black rounded-r" />
              )}
              <div className="flex items-center gap-2 mb-1">
                <WeftLogo className="w-4 h-4 text-blue-600" variant="accent" />
                <h3 className="text-lg font-bold text-black">Factories</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                A software factory that automates and orchestrates software development across your whole SDLC.
              </p>
              <a href="#factories" className="text-xs font-semibold text-black hover:underline">
                Learn more →
              </a>
            </motion.div>

            {/* 2. Terminal (Active) */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setActiveTab('terminal')}
              className={`p-6 rounded-2xl border transition-all cursor-pointer relative ${
                activeTab === 'terminal'
                  ? 'bg-gray-50 border-gray-400 shadow-sm'
                  : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
            >
              {activeTab === 'terminal' && (
                <div className="absolute left-0 top-6 bottom-6 w-1 bg-black rounded-r" />
              )}
              <div className="flex items-center gap-2 mb-1">
                <WeftLogo className="w-4 h-4 text-emerald-600" variant="default" />
                <h3 className="text-lg font-bold text-black">Terminal</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                An open-source terminal built for AI-assisted software development, with agents alongside your shell.
              </p>
              <a href="#download" className="text-xs font-semibold text-black hover:underline">
                Explore Terminal →
              </a>
            </motion.div>

            {/* 3. Agent CLI */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setActiveTab('cli')}
              className={`p-6 rounded-2xl border transition-all cursor-pointer relative ${
                activeTab === 'cli'
                  ? 'bg-gray-50 border-gray-400 shadow-sm'
                  : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
            >
              {activeTab === 'cli' && (
                <div className="absolute left-0 top-6 bottom-6 w-1 bg-black rounded-r" />
              )}
              <div className="flex items-center gap-2 mb-1">
                <WeftLogo className="w-4 h-4 text-purple-600" variant="accent" />
                <h3 className="text-lg font-bold text-black">Agent CLI</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                A powerful coding agent that works in any terminal — pipe it, script it, and run it wherever you work.
              </p>
              <a href="#download" className="text-xs font-semibold text-black hover:underline">
                Try the Agent CLI →
              </a>
            </motion.div>

          </div>

          {/* Right Column: Dark Terminal Mockup with animated content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 bg-[#13171F] rounded-2xl border border-gray-800 p-4 sm:p-6 text-white font-mono text-xs shadow-2xl overflow-hidden"
          >
            
            {/* Titlebar */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 text-gray-400 text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="ml-2 text-gray-300 flex items-center gap-1.5">
                  <WeftLogo className="w-3 h-3 text-cyan-400" />
                  <span>TOC for terminal</span>
                </span>
              </div>
              <span className="text-gray-400">+ Add Popularity Indicator to Weft Drive Objects</span>
            </div>

            {/* Terminal Body with Tab Transition */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="py-4 space-y-4"
              >
                
                <div className="text-gray-200 font-bold text-sm font-sans">
                  {activeTab === 'factories' ? 'Factory Run #491: Automated PR review pipeline' : activeTab === 'cli' ? 'Weft CLI Session: Pipe git diff to agent' : 'Task 4: Update API route to calculate popularity scores'}
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-xs bg-white/5 p-2 rounded-lg">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Calculate popularity scores in API route</span>
                  <span className="text-[10px] text-gray-500 ml-auto">+8 -1</span>
                </div>

                {/* Thought dropdowns */}
                <div className="space-y-1.5 text-xs text-gray-400">
                  <div className="p-2 rounded bg-black/40 text-[11px] flex items-center justify-between hover:bg-black/60 transition-colors cursor-pointer">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      Thought for 1 second ›
                    </span>
                    <span className="text-gray-600">4/9</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 text-[11px] flex items-center justify-between hover:bg-black/60 transition-colors cursor-pointer">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      Thought for 6 seconds ›
                    </span>
                    <span className="text-gray-600">5/9</span>
                  </div>
                </div>

                {/* Task Checklist Drawer */}
                <div className="bg-[#1C212D] border border-gray-700/60 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="text-gray-300 font-semibold text-[11px] uppercase tracking-wider font-sans">
                    Tasks 4/9
                  </div>
                  
                  <div className="space-y-1.5 text-gray-300 text-[11px]">
                    <div className="flex items-center gap-2 text-gray-400 line-through">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Create popularity utility functions</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 line-through">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Update ObjectData type with popularity score</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 line-through">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Update SortOrder type</span>
                    </div>
                    <div className="flex items-center gap-2 text-cyan-300 font-medium bg-cyan-500/10 p-1 rounded">
                      <span className="w-3 h-3 rounded-full border border-cyan-400 flex items-center justify-center text-[8px] animate-pulse">●</span>
                      <span>Update API route to calculate popularity scores</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 pl-5">
                      <span>Add popularity indicator to ObjectCard</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 pl-5">
                      <span>Add popularity sort option to SearchBar</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 pl-5">
                      <span>Implement popularity sorting logic</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 pl-5">
                      <span>Update FilterBadges to show popularity filter</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 pl-5">
                      <span>Test popularity calculation and display</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

          </motion.div>

        </div>

      </div>
    </section>
  )
}
