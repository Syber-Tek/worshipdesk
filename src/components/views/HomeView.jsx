import React, { useState } from 'react'
import {
  Document,
  Voice2,
  TickSquare,
  Setting,
  Video,
  Search,
  Send,
  Show,
  Plus,
  Activity,
  InfoSquare,
  ChevronRight
} from 'react-iconly'

export default function HomeView({
  setActiveTab,
  playlist,
  biblesList,
  displays,
  isLive,
  currentSlide,
  nextSlide,
  handlePresentNow,
  handleStageNext,
  themeMode
}) {
  const isLight = themeMode === 'light'
  const [quickQuery, setQuickQuery] = useState('')

  const cardClass = isLight
    ? 'bg-[#FFFFFF] border-[#E5E7EB] text-[#111827] shadow-sm'
    : 'bg-[#151619] border-[#26282E] text-[#EDEDEE]'

  const innerCardClass = isLight
    ? 'bg-[#F9FAFB] border-[#E5E7EB]'
    : 'bg-[#1B1C20] border-[#26282E]'

  const labelClass = isLight ? 'text-[#6B7280]' : 'text-[#9CA0AC]'
  const headingClass = isLight ? 'text-[#111827]' : 'text-[#EDEDEE]'

  const activePlaylistItem = playlist.find((item) => item.status === 'live')
  const nextPlaylistItem = playlist.find((item) => item.status === 'next')

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-6">
      {/* Top Banner: Service Dashboard Overview */}
      <div className={`p-5 rounded-xl border flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 transition-colors duration-200 ${cardClass}`}>
        <div className="space-y-1 w-full xl:w-auto">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#D4A94A]/15 text-[#D4A94A] border border-[#D4A94A]/30">
              Media Station Active
            </span>
            <span className={`text-xs ${labelClass}`}>
              Sunday Morning Worship Service
            </span>
          </div>
          <h1 className={`text-xl font-bold tracking-tight ${headingClass}`}>
            Church Presenter Dashboard
          </h1>
          <p className={`text-xs ${labelClass}`}>
            Offline worship presentation engine with multi-translation Twi & English Bibles and Presby/Methodist Hymns.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full xl:w-auto">
          <button
            onClick={() => setActiveTab('plan')}
            className="px-3.5 py-2 bg-[#D4A94A] hover:bg-[#E2B757] text-[#0B0C0E] font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
          >
            <TickSquare set="bold" primaryColor="#0B0C0E" size="small" />
            <span>Launch Playlist</span>
          </button>
          <button
            onClick={() => setActiveTab('bible')}
            className={`px-3.5 py-2 border rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
              isLight
                ? 'bg-[#F3F4F6] hover:bg-[#E5E7EB] border-[#E5E7EB] text-[#111827]'
                : 'bg-[#22242A] hover:bg-[#292B32] border-[#26282E] text-[#EDEDEE]'
            }`}
          >
            <Document set="light" primaryColor="currentColor" size="small" />
            <span>Bible Lookup</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid (Matching reference visual density & surface layering) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Playlist Items */}
        <div className={`p-4 rounded-xl border space-y-3 ${cardClass}`}>
          <div className="flex justify-between items-center">
            <span className={`text-xs font-semibold ${labelClass}`}>Service Order</span>
            <TickSquare set="bold" primaryColor="#D4A94A" size="small" />
          </div>
          <div>
            <div className={`text-2xl font-extrabold tracking-tight ${headingClass}`}>
              {playlist.length} <span className="text-xs font-normal opacity-70">Items</span>
            </div>
            <p className={`text-[11px] mt-0.5 ${labelClass}`}>
              {activePlaylistItem ? `Live: ${activePlaylistItem.title}` : 'No item live'}
            </p>
          </div>
          <div className="pt-2 border-t border-[#26282E] flex justify-between items-center text-[10px]">
            <span className="text-[#6FCF97] font-medium flex items-center gap-1">
              <Activity set="bold" primaryColor="#6FCF97" size="small" /> Ready for Live
            </span>
            <button onClick={() => setActiveTab('plan')} className="text-[#D4A94A] hover:underline flex items-center gap-0.5">
              View Plan <ChevronRight set="light" primaryColor="#D4A94A" size="small" />
            </button>
          </div>
        </div>

        {/* Card 2: Bible Translations */}
        <div className={`p-4 rounded-xl border space-y-3 ${cardClass}`}>
          <div className="flex justify-between items-center">
            <span className={`text-xs font-semibold ${labelClass}`}>Bible Engine</span>
            <Document set="bold" primaryColor="#6FCF97" size="small" />
          </div>
          <div>
            <div className={`text-2xl font-extrabold tracking-tight ${headingClass}`}>
              {biblesList.length || 8} <span className="text-xs font-normal opacity-70">Translations</span>
            </div>
            <p className={`text-[11px] mt-0.5 ${labelClass}`}>
              5 Twi XML versions + KJV, NIV, NKJV
            </p>
          </div>
          <div className="pt-2 border-t border-[#26282E] flex justify-between items-center text-[10px]">
            <span className={labelClass}>Offline SQLite DB</span>
            <button onClick={() => setActiveTab('bible')} className="text-[#D4A94A] hover:underline flex items-center gap-0.5">
              Open Reader <ChevronRight set="light" primaryColor="#D4A94A" size="small" />
            </button>
          </div>
        </div>

        {/* Card 3: Hymnal Library */}
        <div className={`p-4 rounded-xl border space-y-3 ${cardClass}`}>
          <div className="flex justify-between items-center">
            <span className={`text-xs font-semibold ${labelClass}`}>Hymn Library</span>
            <Voice2 set="bold" primaryColor="#D4A94A" size="small" />
          </div>
          <div>
            <div className={`text-2xl font-extrabold tracking-tight ${headingClass}`}>
              855+ <span className="text-xs font-normal opacity-70">Hymns</span>
            </div>
            <p className={`text-[11px] mt-0.5 ${labelClass}`}>
              Presby & Methodist (Twi & Eng)
            </p>
          </div>
          <div className="pt-2 border-t border-[#26282E] flex justify-between items-center text-[10px]">
            <span className={labelClass}>.sng Importer Ready</span>
            <button onClick={() => setActiveTab('songs')} className="text-[#D4A94A] hover:underline flex items-center gap-0.5">
              Search Songs <ChevronRight set="light" primaryColor="#D4A94A" size="small" />
            </button>
          </div>
        </div>

        {/* Card 4: Displays & Hardware */}
        <div className={`p-4 rounded-xl border space-y-3 ${cardClass}`}>
          <div className="flex justify-between items-center">
            <span className={`text-xs font-semibold ${labelClass}`}>Displays</span>
            <Video set="bold" primaryColor={displays.length > 1 ? '#6FCF97' : '#D4A94A'} size="small" />
          </div>
          <div>
            <div className={`text-2xl font-extrabold tracking-tight ${headingClass}`}>
              {displays.length} <span className="text-xs font-normal opacity-70">{displays.length > 1 ? 'Monitors' : 'Monitor'}</span>
            </div>
            <p className={`text-[11px] mt-0.5 ${labelClass}`}>
              {displays.length > 1 ? 'Dual Display Mode Active' : 'Single Monitor Desktop'}
            </p>
          </div>
          <div className="pt-2 border-t border-[#26282E] flex justify-between items-center text-[10px]">
            <span className={displays.length > 1 ? 'text-[#6FCF97] font-medium' : labelClass}>
              {displays.length > 1 ? 'Projector Synced' : 'Control Window'}
            </span>
            <button onClick={() => setActiveTab('settings')} className="text-[#D4A94A] hover:underline flex items-center gap-0.5">
              Display Config <ChevronRight set="light" primaryColor="#D4A94A" size="small" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout: 2 Columns (Live Controls + Recent Service Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Span): Live Station & Quick Jump */}
        <div className="lg:col-span-2 space-y-5">
          {/* Quick Scripture Jump Bar */}
          <div className={`p-4 rounded-xl border space-y-3 ${cardClass}`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider text-[#D4A94A]`}>
              Quick Scripture & Hymn Jump
            </h3>
            <div className="relative flex items-center">
              <div className="absolute left-3 pointer-events-none">
                <Search set="light" primaryColor={isLight ? '#6B7280' : '#696C75'} size="small" />
              </div>
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && quickQuery.trim()) {
                    setActiveTab('bible')
                  }
                }}
                placeholder="Type passage or song (e.g. John 3:16, Psalm 23, PH 120)... Press Enter to jump"
                className={`w-full border rounded-lg pl-9 pr-24 py-2.5 text-xs outline-none transition ${
                  isLight
                    ? 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] focus:border-[#D4A94A]'
                    : 'bg-[#1B1C20] border-[#26282E] text-[#EDEDEE] focus:border-[#D4A94A]'
                }`}
              />
              <button
                onClick={() => {
                  if (quickQuery.trim()) setActiveTab('bible')
                }}
                className="absolute right-1.5 px-3 py-1.5 bg-[#D4A94A] text-[#0B0C0E] font-bold text-xs rounded transition hover:bg-[#E2B757] cursor-pointer"
              >
                Go ➔
              </button>
            </div>
          </div>

          {/* Service Playlist Quick Preview */}
          <div className={`p-5 rounded-xl border space-y-4 ${cardClass}`}>
            <div className="flex justify-between items-center border-b pb-3 border-[#26282E]">
              <div>
                <h3 className={`text-sm font-bold ${headingClass}`}>Current Service Playlist</h3>
                <p className={`text-[11px] ${labelClass}`}>Quick view of prepared order of worship</p>
              </div>
              <button
                onClick={() => setActiveTab('plan')}
                className="text-xs text-[#D4A94A] hover:underline font-semibold"
              >
                Manage Full Order ➔
              </button>
            </div>

            {playlist.length === 0 ? (
              <div className={`p-6 rounded-lg border text-center space-y-2 ${innerCardClass}`}>
                <InfoSquare set="light" primaryColor={isLight ? '#9CA0AC' : '#696C75'} size="medium" />
                <p className={`text-xs font-medium ${headingClass}`}>No items in playlist</p>
                <p className={`text-[11px] ${labelClass}`}>Add verses, hymns, or sermon slides to construct your worship service.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {playlist.slice(0, 4).map((item, index) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${
                      item.status === 'live'
                        ? 'bg-[#E5484D]/10 border-[#E5484D]'
                        : item.status === 'next'
                        ? isLight
                          ? 'bg-[#F3F4F6] border-[#D4A94A]'
                          : 'bg-[#1B1C20] border-[#D4A94A]/40'
                        : innerCardClass
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="font-mono text-[10px] text-[#D4A94A] font-bold">#{index + 1}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-xs font-bold truncate ${headingClass}`}>{item.title}</h4>
                          <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border ${
                            isLight ? 'bg-[#E5E7EB] text-[#4B5563] border-[#D1D5DB]' : 'bg-[#22242A] text-[#9CA0AC] border-[#26282E]'
                          }`}>
                            {item.type}
                          </span>
                        </div>
                        <p className={`text-[11px] truncate mt-0.5 ${labelClass}`}>{item.content}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStageNext && handleStageNext(item)}
                        title="Stage as Next"
                        className="p-1.5 border border-[#26282E] rounded hover:border-[#D4A94A] text-[#D4A94A] transition cursor-pointer"
                      >
                        <Show set="bold" primaryColor="#D4A94A" size="small" />
                      </button>
                      <button
                        onClick={() => handlePresentNow && handlePresentNow(item)}
                        title="Present Live"
                        className="p-1.5 bg-[#D4A94A] text-[#0B0C0E] rounded font-bold hover:bg-[#E2B757] transition shadow cursor-pointer"
                      >
                        <Send set="bold" primaryColor="#0B0C0E" size="small" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Span): Live Status Monitor & Quick Shortcuts */}
        <div className="space-y-5">
          {/* Live Monitor Widget */}
          <div className={`p-4 rounded-xl border space-y-3.5 ${cardClass}`}>
            <div className="flex justify-between items-center border-b pb-2.5 border-[#26282E]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5484D] flex items-center gap-1">
                <Activity set="bold" primaryColor="#E5484D" size="small" /> Live Projector Status
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                isLive ? 'bg-[#E5484D] text-white animate-pulse' : 'bg-[#22242A] text-[#696C75]'
              }`}>
                {isLive ? 'BROADCASTING' : 'STANDBY'}
              </span>
            </div>

            <div className={`p-3 rounded-lg border min-h-22.5 flex flex-col justify-center ${innerCardClass}`}>
              {currentSlide ? (
                <div>
                  <h4 className={`text-xs font-bold ${headingClass}`}>{currentSlide.title || currentSlide.ref}</h4>
                  <p className={`text-[11px] line-clamp-3 leading-relaxed mt-1 ${labelClass}`}>
                    "{currentSlide.content || currentSlide.text}"
                  </p>
                </div>
              ) : (
                <p className={`text-xs italic text-center ${labelClass}`}>No slide active on screen</p>
              )}
            </div>

            <div className="pt-1 flex gap-2">
              <button
                onClick={() => setActiveTab('bible')}
                className="flex-1 py-2 bg-[#22242A] hover:bg-[#292B32] border border-[#26282E] text-[#EDEDEE] font-semibold text-xs rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Document set="light" primaryColor="currentColor" size="small" />
                <span>Scripture</span>
              </button>
              <button
                onClick={() => setActiveTab('songs')}
                className="flex-1 py-2 bg-[#22242A] hover:bg-[#292B32] border border-[#26282E] text-[#EDEDEE] font-semibold text-xs rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Voice2 set="light" primaryColor="currentColor" size="small" />
                <span>Hymns</span>
              </button>
            </div>
          </div>

          {/* Quick Features & System Info */}
          <div className={`p-4 rounded-xl border space-y-3 ${cardClass}`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider text-[#D4A94A]`}>
              Ghana Church Features
            </h3>
            <div className="space-y-2 text-xs">
              <div className={`p-2.5 rounded-lg border flex items-center justify-between ${innerCardClass}`}>
                <span className={headingClass}>Twerɛ Kronkron (Twi Bibles)</span>
                <span className="text-[10px] font-bold text-[#6FCF97] bg-[#6FCF97]/15 px-1.5 py-0.5 rounded">5 XMLs</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center justify-between ${innerCardClass}`}>
                <span className={headingClass}>Presby & Methodist Hymnal</span>
                <span className="text-[10px] font-bold text-[#D4A94A] bg-[#D4A94A]/15 px-1.5 py-0.5 rounded">855 .sng</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center justify-between ${innerCardClass}`}>
                <span className={headingClass}>Offline SQLite Database</span>
                <span className="text-[10px] font-bold text-[#6FCF97] bg-[#6FCF97]/15 px-1.5 py-0.5 rounded">WAL Mode</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
