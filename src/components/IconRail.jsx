import React from 'react'
import {
  FaHouse,
  FaBookOpen,
  FaMusic,
  FaListCheck,
  FaGear,
  FaWifi
} from 'react-icons/fa6'

export default function IconRail({ activeTab, setActiveTab, themeMode }) {
  const navItems = [
    { id: 'home', icon: FaHouse, label: 'Home' },
    { id: 'bible', icon: FaBookOpen, label: 'Bible' },
    { id: 'songs', icon: FaMusic, label: 'Songs' },
    { id: 'plan', icon: FaListCheck, label: 'Plan' },
    { id: 'settings', icon: FaGear, label: 'Settings' }
  ]

  const isLight = themeMode === 'light'

  return (
    <aside
      className={`w-[52px] border-r flex flex-col items-center justify-between py-3 z-20 transition-colors duration-200 ${
        isLight
          ? 'bg-[#FFFFFF] border-[#E5E7EB]'
          : 'bg-[#151619] border-[#2A2C31]'
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
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#D4A94A] rounded-r-full" />
                )}
                <Icon />
              </button>
            )
          })}
        </nav>
      </div>

      <div title="Offline-First Mode Active" className="text-[#6FCF97] text-[11px]">
        <FaWifi />
      </div>
    </aside>
  )
}
