import React from 'react'
import { Home, Document, Voice2, TickSquare, Setting, Activity } from 'react-iconly'

export default function IconRail({ activeTab, setActiveTab, themeMode }) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'bible', icon: Document, label: 'Bible' },
    { id: 'songs', icon: Voice2, label: 'Songs' },
    { id: 'plan', icon: TickSquare, label: 'Plan' },
    { id: 'settings', icon: Setting, label: 'Settings' }
  ]

  const isLight = themeMode === 'light'

  return (
    <aside
      className={`w-13 border-r flex flex-col items-center justify-between py-3 z-20 transition-colors duration-200 ${
        isLight
          ? 'bg-[#FFFFFF] border-[#E5E7EB]'
          : 'bg-[#121316] border-[#26282E]'
      }`}
    >
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="w-8 h-8 rounded-lg bg-[#D4A94A]/10 border border-[#D4A94A]/30 flex items-center justify-center text-[#D4A94A] font-bold text-xs">
          CP
        </div>

        <nav className="flex flex-col items-center gap-1 w-full mt-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                className={`relative w-full h-11 flex items-center justify-center text-sm transition-colors ${
                  isActive
                    ? 'text-[#D4A94A]'
                    : isLight
                    ? 'text-[#6B7280] hover:text-[#111827]'
                    : 'text-[#9B9CA3] hover:text-[#EDEDEE]'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-0.75 bg-[#D4A94A] rounded-r-full" />
                )}
                <Icon set={isActive ? 'bold' : 'light'} primaryColor="currentColor" size="medium" />
              </button>
            )
          })}
        </nav>
      </div>

      <div title="Offline-First Mode Active" className="text-[#6FCF97] p-2 flex items-center justify-center">
        <Activity set="bold" primaryColor="currentColor" size="small" />
      </div>
    </aside>
  )
}
