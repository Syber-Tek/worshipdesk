import React from 'react'
import { Video, Category, Activity } from 'react-iconly'

export default function Header({ displays, isLive, setIsLive, broadcastToPresentation, themeMode, effectiveTheme, setThemeMode }) {
  const toggleLiveStatus = () => {
    const nextLive = !isLive
    setIsLive(nextLive)
    broadcastToPresentation({ isLive: nextLive })
  }

  const currentTheme = effectiveTheme || themeMode
  const isLight = currentTheme === 'light'

  const handleCycleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <header
      className={`h-11 border-b px-4 flex items-center justify-between text-xs transition-colors duration-200 ${
        isLight
          ? 'bg-[#FFFFFF] border-[#E5E7EB]'
          : 'bg-[#141518] border-[#26282E]'
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
              <Video set="bold" primaryColor="#6FCF97" size="small" />
              <span className="text-[#6FCF97] font-medium">
                Projector Connected ({displays.length} Displays)
              </span>
            </>
          ) : (
            <>
              <Category set="light" primaryColor="currentColor" size="small" />
              <span>Single Display Mode</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Quick Dark / Light Theme Toggle */}
        <button
          onClick={handleCycleTheme}
          title={`Theme Mode: ${themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'} (Click to toggle)`}
          className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
            isLight
              ? 'bg-[#F3F4F6] border-[#E5E7EB] text-[#4B5563] hover:text-[#111827]'
              : 'bg-[#24262B] border-[#2A2C31] text-[#D4A94A] hover:bg-[#2A2C31]'
          }`}
        >
          {themeMode === 'light' ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <span>Light</span>
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              <span>Dark</span>
            </>
          )}
        </button>

        <button
          onClick={toggleLiveStatus}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-semibold uppercase tracking-wider transition cursor-pointer ${
            isLive
              ? 'bg-[#E5484D] text-white shadow-[0_0_12px_rgba(229,72,77,0.4)] animate-pulse'
              : 'bg-[#24262B] text-[#9B9CA3] hover:text-[#EDEDEE] border border-[#2A2C31]'
          }`}
        >
          <Activity set="bold" primaryColor="currentColor" size="small" />
          {isLive ? 'LIVE ON-AIR' : 'STANDBY'}
        </button>
      </div>
    </header>
  )
}
