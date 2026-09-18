import React from "react";
import { FaPalette } from "react-icons/fa6";

export default function AppearanceSettings({
  themeMode,
  setThemeMode,
  uiScale = "normal",
  setUiScale,
  cardClass,
  selectClass,
  textTitle,
  textSub,
  borderDivider,
  isLight,
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-bold text-[#D4A94A] flex items-center gap-2">
          <FaPalette /> Visual Appearance & Design Tokens
        </h3>
        <p className={`text-xs mt-1 ${textSub}`}>
          Cluely design language palette, theme modes, interface density, and
          text sizing settings.
        </p>
      </div>

      <div className={`space-y-4 pt-2 border-t ${borderDivider}`}>
        {/* Theme Mode Toggle Card */}
        <div className={`p-4 rounded border space-y-3 ${cardClass}`}>
          <div className={`font-semibold text-xs ${textTitle}`}>
            Control Window Theme Mode
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <button
              onClick={() => setThemeMode && setThemeMode("system")}
              className={`p-3 rounded border flex items-center gap-3 transition cursor-pointer ${
                themeMode === "system"
                  ? "bg-[#24262B] border-[#D4A94A] text-[#D4A94A] shadow font-semibold"
                  : isLight
                    ? "bg-[#E5E7EB] border-[#D1D5DB] text-[#4B5563] hover:text-[#111827]"
                    : "bg-[#151619] border-[#2A2C31] text-[#9B9CA3] hover:text-[#EDEDEE]"
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-[#D4A94A]"
              >
                <rect width="20" height="14" x="2" y="3" rx="2" />
                <path d="M12 17v4M8 21h8" />
              </svg>
              <div className="text-left">
                <div className="font-bold text-xs">System Preference</div>
                <div className="text-[10px] opacity-70">Auto OS Theme</div>
              </div>
            </button>

            <button
              onClick={() => setThemeMode && setThemeMode("dark")}
              className={`p-3 rounded border flex items-center gap-3 transition cursor-pointer ${
                themeMode === "dark"
                  ? "bg-[#24262B] border-[#D4A94A] text-[#D4A94A] shadow font-semibold"
                  : isLight
                    ? "bg-[#E5E7EB] border-[#D1D5DB] text-[#4B5563] hover:text-[#111827]"
                    : "bg-[#151619] border-[#2A2C31] text-[#9B9CA3] hover:text-[#EDEDEE]"
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-[#D4A94A]"
              >
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
              <div className="text-left">
                <div className="font-bold text-xs">Dark Obsidian</div>
                <div className="text-[10px] opacity-70">
                  #0B0C0E Deep Canvas
                </div>
              </div>
            </button>

            <button
              onClick={() => setThemeMode && setThemeMode("light")}
              className={`p-3 rounded border flex items-center gap-3 transition cursor-pointer ${
                themeMode === "light"
                  ? isLight
                    ? "bg-[#FFFFFF] border-[#D4A94A] text-[#D4A94A] shadow font-semibold"
                    : "bg-[#24262B] border-[#D4A94A] text-[#D4A94A] shadow font-semibold"
                  : isLight
                    ? "bg-[#E5E7EB] border-[#D1D5DB] text-[#4B5563] hover:text-[#111827]"
                    : "bg-[#151619] border-[#2A2C31] text-[#9B9CA3] hover:text-[#EDEDEE]"
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-[#D4A94A]"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <div className="text-left">
                <div className="font-bold text-xs">Light Clean</div>
                <div className="text-[10px] opacity-70">
                  #F4F5F7 Daylight Canvas
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className={`p-4 rounded border space-y-3 ${cardClass}`}>
          <div className={`font-semibold text-xs ${textTitle}`}>
            Color System Tokens
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div
              className={`flex items-center gap-2.5 p-2 rounded border ${
                isLight
                  ? "bg-[#FFFFFF] border-[#D1D5DB]"
                  : "bg-[#0B0C0E] border-[#2A2C31]"
              }`}
            >
              <span className="w-4 h-4 rounded bg-[#0B0C0E] border border-white/20" />
              <div>
                <div className={`font-mono text-[10px] ${textTitle}`}>
                  #0B0C0E
                </div>
                <div className={`text-[10px] ${textSub}`}>
                  Canvas Background
                </div>
              </div>
            </div>
            <div
              className={`flex items-center gap-2.5 p-2 rounded border ${
                isLight
                  ? "bg-[#FFFFFF] border-[#D1D5DB]"
                  : "bg-[#151619] border-[#2A2C31]"
              }`}
            >
              <span className="w-4 h-4 rounded bg-[#151619] border border-white/20" />
              <div>
                <div className={`font-mono text-[10px] ${textTitle}`}>
                  #151619
                </div>
                <div className={`text-[10px] ${textSub}`}>Panel Surface</div>
              </div>
            </div>
            <div
              className={`flex items-center gap-2.5 p-2 rounded border ${
                isLight
                  ? "bg-[#FFFFFF] border-[#D1D5DB]"
                  : "bg-[#1C1D21] border-[#2A2C31]"
              }`}
            >
              <span className="w-4 h-4 rounded bg-[#D4A94A]" />
              <div>
                <div className="font-mono text-[10px] text-[#D4A94A] font-bold">
                  #D4A94A
                </div>
                <div className={`text-[10px] ${textSub}`}>
                  Primary Gold Accent
                </div>
              </div>
            </div>
            <div
              className={`flex items-center gap-2.5 p-2 rounded border ${
                isLight
                  ? "bg-[#FFFFFF] border-[#D1D5DB]"
                  : "bg-[#1C1D21] border-[#2A2C31]"
              }`}
            >
              <span className="w-4 h-4 rounded bg-[#E5484D]" />
              <div>
                <div className="font-mono text-[10px] text-[#E5484D] font-bold">
                  #E5484D
                </div>
                <div className={`text-[10px] ${textSub}`}>
                  Live / On-Air Red
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}
        >
          <div>
            <div className={`font-semibold text-xs ${textTitle}`}>
              Control UI Scale
            </div>
            <div className={`text-[11px] ${textSub}`}>
              Adjust font sizing density
            </div>
          </div>
          <select
            value={uiScale || "normal"}
            onChange={(e) => setUiScale && setUiScale(e.target.value)}
            className={`text-xs rounded px-2.5 py-1 outline-none border ${selectClass}`}
          >
            <option value="compact">Compact (12px)</option>
            <option value="normal">Standard (13px)</option>
            <option value="large">Large (14px)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
