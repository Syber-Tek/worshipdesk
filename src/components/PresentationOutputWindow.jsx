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

  // Black Screen Mode
  if (slideData.isBlack || !slideData.isLive) {
    return <div className="h-screen w-screen bg-black flex items-center justify-center select-none" />
  }

  const theme = slideData.outputTheme || 'dark'
  const isLight = theme === 'light'
  const isImage = theme === 'image'
  const bgImg = slideData.outputBgImage || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1600&auto=format&fit=crop'
  
  const showQuotes = slideData.showVerseQuotes !== false
  const displayContent = showQuotes ? `"${slideData.content}"` : slideData.content

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
            <span>Church Presenter</span>
            <span>{slideData.isBlank ? '' : slideData.type}</span>
          </div>

          {/* Main Centered Text Block */}
          {!slideData.isBlank && (
            <div className="my-auto max-w-5xl mx-auto text-center px-8">
              <p className="text-3xl md:text-5xl font-bold leading-relaxed tracking-wide text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                {displayContent}
              </p>
            </div>
          )}

          {/* Reference / Attribution Line Below */}
          {!slideData.isBlank && slideData.title && (
            <div className="text-center pt-6 border-t border-white/20">
              <h2 className="text-xl md:text-2xl font-bold text-[#D4A94A] tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                — {slideData.title} —
              </h2>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (isLight) {
    return (
      <div className="h-screen w-screen bg-[#FFFFFF] text-[#111827] flex flex-col justify-between p-16 select-none overflow-hidden font-sans">
        {/* Top Header Label */}
        <div className="flex justify-between items-center text-sm font-semibold tracking-widest text-[#B4821E] uppercase border-b border-[#E5E7EB] pb-4">
          <span>Church Presenter</span>
          <span>{slideData.isBlank ? '' : slideData.type}</span>
        </div>

        {/* Main Centered Text Block */}
        {!slideData.isBlank && (
          <div className="my-auto max-w-5xl mx-auto text-center px-8">
            <p className="text-3xl md:text-5xl font-bold leading-relaxed tracking-wide text-[#111827]">
              {displayContent}
            </p>
          </div>
        )}

        {/* Reference / Attribution Line Below */}
        {!slideData.isBlank && slideData.title && (
          <div className="text-center pt-6 border-t border-[#E5E7EB]">
            <h2 className="text-xl md:text-2xl font-bold text-[#B4821E] tracking-wider uppercase">
              — {slideData.title} —
            </h2>
          </div>
        )}
      </div>
    )
  }

  // Dark Theme (Default)
  return (
    <div className="h-screen w-screen bg-[#0B0C0E] text-[#EDEDEE] flex flex-col justify-between p-16 select-none overflow-hidden font-sans">
      {/* Top Header Label */}
      <div className="flex justify-between items-center text-sm font-semibold tracking-widest text-[#D4A94A] uppercase border-b border-[#2A2C31]/40 pb-4">
        <span>Church Presenter</span>
        <span>{slideData.isBlank ? '' : slideData.type}</span>
      </div>

      {/* Main Centered Text Block */}
      {!slideData.isBlank && (
        <div className="my-auto max-w-5xl mx-auto text-center px-8">
          <p className="text-3xl md:text-5xl font-bold leading-relaxed tracking-wide text-[#EDEDEE]">
            {displayContent}
          </p>
        </div>
      )}

      {/* Reference / Attribution Line Below */}
      {!slideData.isBlank && slideData.title && (
        <div className="text-center pt-6 border-t border-[#2A2C31]/40">
          <h2 className="text-xl md:text-2xl font-bold text-[#D4A94A] tracking-wider uppercase">
            — {slideData.title} —
          </h2>
        </div>
      )}
    </div>
  )
}

