import React, { useEffect, useState } from "react";
import { FaClock, FaCircle, FaForward } from "react-icons/fa6";

export default function StageDisplayWindow() {
  const [slideData, setSlideData] = useState({});
  const [currentTime, setCurrentTime] = useState("");

  // Live Digital Clock (HH:MM:SS AM/PM)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen to IPC presentation broadcast updates
  useEffect(() => {
    if (window.api && window.api.onPresentationUpdate) {
      const unsubscribe = window.api.onPresentationUpdate((data) => {
        setSlideData((prev) => ({ ...prev, ...data }));
      });
      return unsubscribe;
    }
  }, []);

  // Keyboard Navigation (Arrow Keys on Stage Screen)
  useEffect(() => {
    const onKey = (e) => {
      if (!window.api || !window.api.sendDeckNav) return;
      if (
        ["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"].includes(e.key)
      ) {
        e.preventDefault();
        window.api.sendDeckNav("next");
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        window.api.sendDeckNav("prev");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Explicit Black Screen Mode
  if (slideData.isBlack) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center select-none" />
    );
  }

  const isLive = slideData.isLive && !slideData.isBlank;

  return (
    <div className="h-screen w-screen bg-[#0C0D0E] text-white flex flex-col justify-between p-6 sm:p-8 select-none font-sans overflow-hidden">
      {/* Top Bar: Live Badge, Window Title & Live Clock */}
      <div className="flex items-center justify-between border-b border-[#252830] pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 border ${
              isLive
                ? "bg-[#163828] text-[#34D399] border-[#059669]"
                : "bg-[#27272A] text-[#A1A1AA] border-[#3F3F46]"
            }`}
          >
            <FaCircle
              className={`text-[8px] ${
                isLive ? "text-[#34D399] animate-pulse" : "text-[#71717A]"
              }`}
            />
            {isLive ? "LIVE ON-AIR" : "STANDBY MODE"}
          </div>
          <span className="text-xs font-bold tracking-widest text-[#71717A] uppercase hidden sm:inline">
            Stage Display / Confidence Monitor
          </span>
        </div>

        {/* Live Clock Display */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#18191C] border border-[#27272A] font-mono text-sm sm:text-base font-bold text-[#F4F4F5]">
          <FaClock className="text-accent text-xs" />
          <span>{currentTime}</span>
        </div>
      </div>

      {/* Main Center Area: Current Projected Text */}
      <div className="flex-1 flex flex-col justify-center py-6 space-y-4 max-w-7xl mx-auto w-full">
        {isLive && (slideData.title || slideData.hymnLabel) && (
          <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded bg-[#1C1E24] border border-[#2D313E] text-xs sm:text-sm font-bold uppercase tracking-wider text-accent">
            {slideData.hymnLabel
              ? `${slideData.hymnLabel} — `
              : ""}
            {slideData.title}
          </div>
        )}

        {isLive && slideData.content ? (
          <div className="space-y-4">
            <div className="text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-snug tracking-tight text-white whitespace-pre-wrap drop-shadow-sm">
              {slideData.content}
            </div>
            {slideData.secondaryText && (
              <div className="text-xl sm:text-3xl font-semibold italic text-accent pt-3 border-t border-[#252830]">
                {slideData.secondaryText}
                {slideData.secondaryTranslation && (
                  <span className="block text-xs font-mono font-bold uppercase not-italic tracking-wider text-[#A1A1AA] mt-1">
                    — {slideData.secondaryTranslation} —
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 space-y-3 opacity-60">
            <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-[#A1A1AA]">
              Stage Monitor Ready
            </h3>
            <p className="text-xs sm:text-sm text-[#71717A]">
              Waiting for live slide projection from control window...
            </p>
          </div>
        )}
      </div>

      {/* Bottom Area: Next Slide Preview Container */}
      <div className="rounded-xl border border-[#3A311D] bg-[#16130D] p-4 sm:p-5 flex flex-col gap-1.5 shadow-lg">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-accent">
          <FaForward className="text-xs" />
          <span>Upcoming Next Slide</span>
          {slideData.deckTotal > 0 && (
            <span className="text-[#A1A1AA] ml-auto font-mono text-[10px]">
              Slide {Math.min(slideData.deckPosition + 1, slideData.deckTotal)} / {slideData.deckTotal}
            </span>
          )}
        </div>

        {isLive && slideData.nextSlideContent ? (
          <div className="flex flex-col gap-1">
            {slideData.nextSlideTitle && (
              <span className="text-xs font-bold text-[#E4E4E7]">
                {slideData.nextSlideTitle}
              </span>
            )}
            <p className="text-xs sm:text-sm font-medium text-[#A1A1AA] line-clamp-2 leading-relaxed">
              {slideData.nextSlideContent}
            </p>
          </div>
        ) : (
          <p className="text-xs italic text-[#71717A]">
            {isLive ? "End of current deck / No next slide" : "No upcoming slide"}
          </p>
        )}
      </div>
    </div>
  );
}
