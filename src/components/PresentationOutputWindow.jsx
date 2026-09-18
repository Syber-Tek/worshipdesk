import React, { useEffect, useState } from 'react'

export default function PresentationOutputWindow() {
  const [slideData, setSlideData] = useState({
    title: 'John 3:16 (KJV)',
    content: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
    type: 'Bible Verse',
    isLive: false,
    isBlank: false,
    isBlack: false,
    outputTheme: 'dark', // 'dark' | 'light' | 'image'
    outputBgImage: '',
    showVerseQuotes: true
  })

  useEffect(() => {
    if (window.api && window.api.onPresentationUpdate) {
      const unsubscribe = window.api.onPresentationUpdate((data) => {
        setSlideData((prev) => ({ ...prev, ...data }))
      })
      return unsubscribe
    }
  }, [])

  // Arrow keys / space on the projector window move through the verse deck.
  useEffect(() => {
    const onKey = (e) => {
      if (!window.api || !window.api.sendDeckNav) return
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault()
        window.api.sendDeckNav('next')
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        window.api.sendDeckNav('prev')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Explicit Black Screen Override Mode
  if (slideData.isBlack) {
    return <div className="h-screen w-screen bg-black flex items-center justify-center select-none" />
  }

  // Standby Display Mode (When not live on air)
  if (!slideData.isLive) {
    return (
      <div className="h-screen w-screen bg-[#0B0C0E] text-[#EDEDEE] flex flex-col items-center justify-center select-none font-sans p-8 border-4 border-[#26282E]">
        <div className="flex flex-col items-center gap-3 opacity-70">
          <div className="w-12 h-12 rounded-xl bg-[#D4A94A]/10 border border-[#D4A94A]/40 flex items-center justify-center text-[#D4A94A] font-bold text-sm shadow">
            CP
          </div>
          <h2 className="text-xl font-bold tracking-widest text-[#EDEDEE] uppercase">
            Church Presenter
          </h2>
          <div className="px-3 py-1 rounded bg-[#24262B] border border-[#2A2C31] text-[11px] font-semibold text-[#D4A94A] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4A94A] animate-pulse" />
            PROJECTOR DISPLAY READY — STANDBY MODE
          </div>
          <p className="text-xs text-[#9B9CA3] max-w-md text-center mt-1 leading-relaxed">
            Click <span className="text-[#D4A94A] font-bold">"Present"</span> or toggle <span className="text-[#E5484D] font-bold">"LIVE ON-AIR"</span> in the main control window to project scriptures and hymns.
          </p>
        </div>
      </div>
    )
  }

  const theme = slideData.outputTheme || 'dark'
  const isLight = theme === 'light'
  const isImage = theme === 'image'
  const bgImg = slideData.outputBgImage || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1600&auto=format&fit=crop'
  
  const isHymn = slideData.type === 'Hymn'
  // Quotes only make sense around scripture verses, never around hymns/sermons.
  const showQuotes = slideData.type !== 'Hymn' && slideData.showVerseQuotes !== false
  const content = slideData.content ?? ''
  const displayContent = showQuotes ? `"${content}"` : content
  const bodyClasses = isHymn
    ? 'whitespace-pre-line text-2xl md:text-4xl font-normal leading-normal tracking-normal'
    : 'whitespace-pre-line text-3xl md:text-5xl font-bold leading-relaxed tracking-wide'

  const deckChip =
    slideData.deckTotal > 0 ? (
      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-current/10 opacity-90">
        {slideData.deckPosition} / {slideData.deckTotal}
      </span>
    ) : null
  const brandText = slideData.customHeaderTitle || 'Church Presenter'
  const appNamePos = slideData.appNamePosition || 'top-left'

  const slideTypeNode = slideData.isBlank ? null : (
    <span className="flex items-center gap-2">
      {slideData.type}
      {deckChip}
    </span>
  )

  let headerLeft = null
  let headerRight = null

  if (appNamePos === 'top-left') {
    headerLeft = <span>{brandText}</span>
    headerRight = slideTypeNode
  } else if (appNamePos === 'top-right') {
    headerLeft = slideTypeNode
    headerRight = <span>{brandText}</span>
  } else {
    headerLeft = slideTypeNode
    headerRight = null
  }

  const footerLeft = appNamePos === 'bottom-left' ? <span className="text-xs font-semibold tracking-wider uppercase">{brandText}</span> : null
  const footerRight = appNamePos === 'bottom-right' ? <span className="text-xs font-semibold tracking-wider uppercase">{brandText}</span> : null

  if (isImage) {
    return (
      <div
        className="h-screen w-screen relative flex flex-col justify-between p-16 select-none overflow-hidden font-sans bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${bgImg}")` }}
      >
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Top Header Label */}
          <div className="flex justify-between items-center text-sm font-semibold tracking-widest text-[#D4A94A] uppercase border-b border-white/20 pb-4 drop-shadow">
            <div>{headerLeft}</div>
            <div>{headerRight}</div>
          </div>

          {/* Main Centered Text Block */}
          {!slideData.isBlank && (
            <div className="my-auto max-w-5xl mx-auto text-center px-8">
              <p className={`${bodyClasses} text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]`}>
                {displayContent}
              </p>
            </div>
          )}

          {/* Reference / Attribution Line Below & Footer App Name */}
          <div className="flex items-center justify-between pt-6 border-t border-white/20 text-[#D4A94A]">
            <div className="w-1/4 text-left drop-shadow">{footerLeft}</div>
            <div className="w-1/2 text-center">
              {!slideData.isBlank && slideData.title && (
                <h2 className="text-xl md:text-2xl font-bold tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  — {slideData.title} —
                </h2>
              )}
            </div>
            <div className="w-1/4 text-right drop-shadow">{footerRight}</div>
          </div>
        </div>
      </div>
    )
  }

  if (isLight) {
    return (
      <div className="h-screen w-screen bg-[#FFFFFF] text-[#111827] flex flex-col justify-between p-16 select-none overflow-hidden font-sans">
        {/* Top Header Label */}
        <div className="flex justify-between items-center text-sm font-semibold tracking-widest text-[#B4821E] uppercase border-b border-[#E5E7EB] pb-4">
          <div>{headerLeft}</div>
          <div>{headerRight}</div>
        </div>

        {/* Main Centered Text Block */}
        {!slideData.isBlank && (
          <div className="my-auto max-w-5xl mx-auto text-center px-8">
            <p className={`${bodyClasses} text-[#111827]`}>
              {displayContent}
            </p>
          </div>
        )}

        {/* Reference / Attribution Line Below & Footer App Name */}
        <div className="flex items-center justify-between pt-6 border-t border-[#E5E7EB] text-[#B4821E]">
          <div className="w-1/4 text-left">{footerLeft}</div>
          <div className="w-1/2 text-center">
            {!slideData.isBlank && slideData.title && (
              <h2 className="text-xl md:text-2xl font-bold tracking-wider uppercase">
                — {slideData.title} —
              </h2>
            )}
          </div>
          <div className="w-1/4 text-right">{footerRight}</div>
        </div>
      </div>
    )
  }

  // Dark Theme (Default)
  return (
    <div className="h-screen w-screen bg-[#0B0C0E] text-[#EDEDEE] flex flex-col justify-between p-16 select-none overflow-hidden font-sans">
      {/* Top Header Label */}
      <div className="flex justify-between items-center text-sm font-semibold tracking-widest text-[#D4A94A] uppercase border-b border-[#2A2C31]/40 pb-4">
        <div>{headerLeft}</div>
        <div>{headerRight}</div>
      </div>

      {/* Main Centered Text Block */}
      {!slideData.isBlank && (
        <div className="my-auto max-w-5xl mx-auto text-center px-8">
          <p className={`${bodyClasses} text-[#EDEDEE]`}>
            {displayContent}
          </p>
        </div>
      )}

      {/* Reference / Attribution Line Below & Footer App Name */}
      <div className="flex items-center justify-between pt-6 border-t border-[#2A2C31]/40 text-[#D4A94A]">
        <div className="w-1/4 text-left">{footerLeft}</div>
        <div className="w-1/2 text-center">
          {!slideData.isBlank && slideData.title && (
            <h2 className="text-xl md:text-2xl font-bold tracking-wider uppercase">
              — {slideData.title} —
            </h2>
          )}
        </div>
        <div className="w-1/4 text-right">{footerRight}</div>
      </div>
    </div>
  )
}
