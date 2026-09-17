import React from 'react'
import {
  FaCircle,
  FaBackwardStep,
  FaForwardStep,
  FaEraser,
  FaBan,
  FaPlay,
  FaStop
} from 'react-icons/fa6'

export default function CurrentNextRail({
  currentSlide,
  nextSlide,
  isLive,
  isBlack,
  isBlank,
  selectedVerseIndex,
  filteredVersesLength,
  handleTransportPrev,
  handleTransportNext,
  handleToggleClear,
  handleToggleBlack,
  handleTransportPresent,
  handleTransportStop,
  themeMode
}) {
  const isLight = themeMode === 'light'

  return (
    <aside
      className={`w-[230px] border-l flex flex-col justify-between p-3 select-none z-10 text-xs shrink-0 transition-colors duration-200 ${
        isLight
          ? 'bg-[#FFFFFF] border-[#E5E7EB]'
          : 'bg-[#151619] border-[#2A2C31]'
      }`}
    >
      <div className="space-y-4">
        {/* CURRENT LIVE CARD */}
        <div
          className={`p-3 rounded-lg border transition ${
            isLive
              ? 'bg-[#E5484D]/10 border-[#E5484D] shadow-[0_0_12px_rgba(229,72,77,0.2)]'
              : isLight
              ? 'bg-[#F3F4F6] border-[#E5E7EB] text-[#4B5563]'
              : 'bg-[#1C1D21] border-[#2A2C31] text-[#9B9CA3]'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span
              className={`text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 ${
                isLive ? 'text-[#E5484D]' : isLight ? 'text-[#6B7280]' : 'text-[#6B6C73]'
              }`}
            >
              <FaCircle className={`text-[6px] ${isLive ? 'animate-pulse' : ''}`} />
              {isLive ? 'Current Live' : 'Live Output (Off)'}
            </span>
            <span className={`text-[10px] ${isLight ? 'text-[#6B7280]' : 'text-[#6B6C73]'}`}>{currentSlide.type}</span>
          </div>

          {isBlack ? (
            <div className="bg-[#0B0C0E] text-[#6B6C73] p-2 rounded text-center font-mono text-[10px]">
              [ BLACK SCREEN ]
            </div>
          ) : isBlank ? (
            <div className="bg-[#0B0C0E] text-[#6B6C73] p-2 rounded text-center font-mono text-[10px]">
              [ CLEAR TEXT ]
            </div>
          ) : (
            <>
              <h4 className={`font-semibold text-xs mb-1 ${isLight ? 'text-[#111827]' : 'text-[#EDEDEE]'}`}>
                {currentSlide.title}
              </h4>
              <p className={`text-[11px] line-clamp-3 leading-relaxed ${isLight ? 'text-[#4B5563]' : 'text-[#9B9CA3]'}`}>
                "{currentSlide.content}"
              </p>
            </>
          )}
        </div>

        {/* NEXT QUEUED CARD */}
        <div className={`p-3 rounded-lg border ${
          isLight ? 'bg-[#F3F4F6] border-[#E5E7EB]' : 'bg-[#1C1D21] border-[#2A2C31]'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#D4A94A] flex items-center gap-1.5">
              <FaCircle className="text-[6px] text-[#D4A94A]" /> Next Queued
            </span>
            <span className={`text-[10px] ${isLight ? 'text-[#6B7280]' : 'text-[#6B6C73]'}`}>{nextSlide.type}</span>
          </div>
          <h4 className={`font-semibold text-xs mb-1 ${isLight ? 'text-[#111827]' : 'text-[#EDEDEE]'}`}>{nextSlide.title}</h4>
          <p className={`text-[11px] line-clamp-3 leading-relaxed ${isLight ? 'text-[#4B5563]' : 'text-[#9B9CA3]'}`}>
            "{nextSlide.content}"
          </p>
        </div>
      </div>

      {/* TRANSPORT CONTROLS BAR */}
      <div className={`pt-3 border-t space-y-2 ${isLight ? 'border-[#E5E7EB]' : 'border-[#2A2C31]'}`}>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={handleTransportPrev}
            disabled={selectedVerseIndex <= 0}
            className={`py-1.5 border rounded text-[11px] font-medium flex items-center justify-center gap-1 transition ${
              isLight
                ? 'bg-[#E5E7EB] hover:bg-[#D1D5DB] border-[#D1D5DB] text-[#111827] disabled:opacity-40'
                : 'bg-[#24262B] hover:bg-[#2A2C31] border-[#2A2C31] text-[#EDEDEE] disabled:opacity-40'
            }`}
          >
            <FaBackwardStep className="text-[10px]" /> Prev
          </button>
          <button
            onClick={handleTransportNext}
            disabled={selectedVerseIndex >= filteredVersesLength - 1}
            className={`py-1.5 border rounded text-[11px] font-medium flex items-center justify-center gap-1 transition ${
              isLight
                ? 'bg-[#E5E7EB] hover:bg-[#D1D5DB] border-[#D1D5DB] text-[#111827] disabled:opacity-40'
                : 'bg-[#24262B] hover:bg-[#2A2C31] border-[#2A2C31] text-[#EDEDEE] disabled:opacity-40'
            }`}
          >
            Next <FaForwardStep className="text-[10px]" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={handleToggleClear}
            className={`py-1.5 border rounded text-[11px] font-medium flex items-center justify-center gap-1 transition ${
              isBlank
                ? 'bg-[#D4A94A]/20 border-[#D4A94A] text-[#D4A94A]'
                : isLight
                ? 'bg-[#E5E7EB] hover:bg-[#D1D5DB] border-[#D1D5DB] text-[#111827]'
                : 'bg-[#24262B] hover:bg-[#2A2C31] border-[#2A2C31] text-[#EDEDEE]'
            }`}
          >
            <FaEraser className="text-[10px]" /> Clear
          </button>
          <button
            onClick={handleToggleBlack}
            className={`py-1.5 border rounded text-[11px] font-medium flex items-center justify-center gap-1 transition ${
              isBlack
                ? 'bg-[#E5484D]/20 border-[#E5484D] text-[#E5484D]'
                : isLight
                ? 'bg-[#E5E7EB] hover:bg-[#D1D5DB] border-[#D1D5DB] text-[#111827]'
                : 'bg-[#24262B] hover:bg-[#2A2C31] border-[#2A2C31] text-[#EDEDEE]'
            }`}
          >
            <FaBan className="text-[10px]" /> Black
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={handleTransportPresent}
            className="py-2 bg-[#D4A94A] hover:bg-[#D4A94A]/90 text-[#0B0C0E] font-bold rounded text-[11px] flex items-center justify-center gap-1 shadow transition"
          >
            <FaPlay className="text-[9px]" /> Present
          </button>
          <button
            onClick={handleTransportStop}
            disabled={!isLive}
            className={`py-2 border font-semibold rounded text-[11px] flex items-center justify-center gap-1 transition ${
              isLight
                ? 'bg-[#E5E7EB] hover:bg-[#D1D5DB] border-[#D1D5DB] text-[#E5484D] disabled:opacity-40'
                : 'bg-[#24262B] hover:bg-[#2A2C31] border-[#2A2C31] text-[#E5484D] disabled:opacity-40'
            }`}
          >
            <FaStop className="text-[9px]" /> Stop
          </button>
        </div>
      </div>
    </aside>
  )
}
