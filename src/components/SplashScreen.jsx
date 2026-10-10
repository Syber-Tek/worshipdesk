import React, { useState, useEffect } from "react";
import appIconDark from "../assets/app-icon-dark.png";
import appIconLight from "../assets/app-icon-light.png";

export default function SplashScreen({ onFinished, themeMode = "dark" }) {
  const isLight = themeMode === "light";
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState(
    "Initializing local database...",
  );
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Simulated realistic desktop app startup stages:
    // Stage 1: SQLite local database check
    // Stage 2: Content libraries & hymnals check
    // Stage 3: Display detection & IPC channels
    // Stage 4: Ready
    const step1 = setTimeout(() => {
      setProgress(35);
      setStatusMessage("Loading hymnal & scripture libraries...");
    }, 300);

    const step2 = setTimeout(() => {
      setProgress(70);
      setStatusMessage("Detecting secondary displays & IPC channels...");
    }, 700);

    const step3 = setTimeout(() => {
      setProgress(100);
      setStatusMessage("Preparing your workspace...");
    }, 1100);

    const finishTimer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        if (onFinished) onFinished();
      }, 400); // 400ms smooth fade transition into main workspace
    }, 1500);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(finishTimer);
    };
  }, [onFinished]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 select-none transition-opacity duration-400 ease-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      } ${isLight ? "bg-[#F3F4F6]" : "bg-[#0B0C0E]"}`}
    >
      {/* Empty Top Spacer for Vertical Balance */}
      <div className="h-6" />

      {/* Centered Desktop Composition */}
      <div className="flex flex-col items-center justify-center max-w-sm w-full space-y-6 text-center">
        {/* WD App Icon Emblem */}
        <div className="w-20 h-20  overflow-hidden flex items-center justify-center p-0.5">
          <img
            src={isLight ? appIconDark : appIconLight}
            alt="WordDesk Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Product Wordmark */}
        <div className="space-y-1">
          <h1
            className={`text-2xl font-extrabold tracking-tight ${
              isLight ? "text-[#111827]" : "text-[#EDEDEE]"
            }`}
          >
            WordDesk
          </h1>
          <p
            className={`text-xs font-medium ${
              isLight ? "text-[#4B5563]" : "text-[#9CA0AC]"
            }`}
          >
            {statusMessage}
          </p>
        </div>

        {/* Minimal Gold Progress Line Loading Indicator */}
        <div className="w-48 h-0.75 bg-black/30 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-accent transition-all duration-300 ease-out rounded-full shadow-[0_0_8px_rgba(212,169,74,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Subtle Bottom Micro-Details */}
      <div className="text-center">
        <span
          className={`text-[11px] font-medium tracking-wide ${
            isLight ? "text-[#9CA3AF]" : "text-[#696C75]"
          }`}
        >
          Offline-first worship presentation
        </span>
      </div>
    </div>
  );
}
