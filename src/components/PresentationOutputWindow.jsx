import React, { useEffect, useState } from 'react'

export default function PresentationOutputWindow() {
  const [slideData, setSlideData] = useState({
    title: 'John 3:16 (KJV)',
    content: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
    type: 'Bible Verse',
    isLive: false,
    isBlank: false,
    isBlack: false,
    theme: 'dark' // dark | navy | gold
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

  // Clear Text (Blank) Mode
  if (slideData.isBlank) {
    return <div className="h-screen w-screen bg-[#0B0C0E] flex items-center justify-center select-none" />
  }

  return (
    <div className="h-screen w-screen bg-[#0B0C0E] text-[#EDEDEE] flex flex-col justify-between p-16 select-none overflow-hidden font-sans">
      {/* Top Header Label */}
      <div className="flex justify-between items-center text-sm font-semibold tracking-widest text-[#D4A94A] uppercase border-b border-[#2A2C31]/40 pb-4">
        <span>Church Presenter</span>
        <span>{slideData.type}</span>
      </div>

      {/* Main Centered Text Block (Large text 36px+ with safe margins) */}
      <div className="my-auto max-w-5xl mx-auto text-center px-8">
        <p className="text-3xl md:text-5xl font-bold leading-relaxed tracking-wide text-[#EDEDEE]">
          "{slideData.content}"
        </p>
      </div>

      {/* Reference / Attribution Line Below */}
      <div className="text-center pt-6 border-t border-[#2A2C31]/40">
        <h2 className="text-xl md:text-2xl font-bold text-[#D4A94A] tracking-wider uppercase">
          — {slideData.title} —
        </h2>
      </div>
    </div>
  )
}
