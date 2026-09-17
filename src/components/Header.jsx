import React from 'react'
import { FaTv, FaDesktop, FaCircle, FaSun, FaMoon } from 'react-icons/fa6'

export default function Header({ displays, isLive, setIsLive, broadcastToPresentation, themeMode, effectiveTheme, setThemeMode }) {
  const toggleLiveStatus = () => {
    const nextLive = !isLive
    setIsLive(nextLive)
    broadcastToPresentation({ isLive: nextLive })
  }

  const currentTheme = effectiveTheme || themeMode
  const isLight = currentTheme === 'light'

  const handleCycleTheme = () => {
    if (themeMode === 'dark') setThemeMode('light')
    else if (themeMode === 'light') setThemeMode('system')
    else setThemeMode('dark')
  }

  return (
    <header
      className={`h-11 border-b px-4 flex items-center justify-between text-xs transition-colors duration-200 ${
        isLight
          ? 'bg-[#FFFFFF] border-[#E5E7EB]'
          : 'bg-[#151619] border-[#2A2C31]'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`font-semibold tracking-wide ${
            isLight ? 'text-[#111827]' : 'text-[#EDEDEE]'
          }`}
        >
          Sunday Service Order — Sep 17
        </span>
        <span className={isLight ? 'text-[#D1D5DB]' : 'text-[#6B6C73]'}>|</span>
        <div className={`flex items-center gap-1.5 text-[11px] ${isLight ? 'text-[#4B5563]' : 'text-[#9B9CA3]'}`}>
          {displays.length > 1 ? (
            <>
              <FaTv className="text-[#6FCF97]" />
              <span className="text-[#6FCF97] font-medium">
                Projector Connected ({displays.length} Displays)
              </span>
            </>
          ) : (
            <>
              <FaDesktop className={isLight ? 'text-[#4B5563]' : 'text-[#9B9CA3]'} />
              <span>Single Display Mode</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Quick Dark / Light / System Theme Toggle */}
        <button
          onClick={handleCycleTheme}
          title={`Theme Mode: ${themeMode === 'system' ? 'System Preference' : themeMode === 'dark' ? 'Dark Obsidian' : 'Light Clean'} (Click to cycle)`}
          className="p-1.5 bg-[#24262B] hover:bg-[#2A2C31] border border-[#2A2C31] text-[#D4A94A] rounded text-xs transition cursor-pointer flex items-center justify-center gap-1"
        >
          {themeMode === 'system' ? (
            <FaDesktop className="text-xs" />
          ) : themeMode === 'dark' ? (
            <FaSun className="text-xs" />
          ) : (
            <FaMoon className="text-xs" />
          )}
        </button>

        <button
          onClick={toggleLiveStatus}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-semibold uppercase tracking-wider transition ${
            isLive
              ? 'bg-[#E5484D] text-white shadow-[0_0_12px_rgba(229,72,77,0.4)] animate-pulse'
              : 'bg-[#24262B] text-[#9B9CA3] hover:text-[#EDEDEE] border border-[#2A2C31]'
          }`}
        >
          <FaCircle className="text-[7px]" />
          {isLive ? 'LIVE ON-AIR' : 'STANDBY'}
        </button>
      </div>
    </header>
  )
}
