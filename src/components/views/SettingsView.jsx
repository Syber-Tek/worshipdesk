import React, { useState, useEffect } from "react";
import {
  Setting,
  Category,
  Video,
  Document,
  InfoSquare,
  Activity,
  TickSquare,
} from "react-iconly";
import {
  FaSliders,
  FaPalette,
  FaDesktop,
  FaTv,
  FaBookOpen,
  FaDatabase,
  FaLanguage,
  FaKeyboard,
  FaFloppyDisk,
  FaCircleInfo,
  FaSun,
  FaMoon,
  FaBolt,
  FaGear,
} from "react-icons/fa6";

export default function SettingsView({
  settingsSection,
  setSettingsSection,
  appInfo,
  dbStatus,
  displays,
  setDisplays,
  selectedTranslation,
  setSelectedTranslation,
  themeMode,
  effectiveTheme,
  setThemeMode,
  biblesList,
  refreshBibles,
  outputTheme,
  setOutputTheme,
  outputBgImage,
  setOutputBgImage,
  showVerseQuotes = true,
  setShowVerseQuotes,
  appNamePosition = 'top-left',
  setAppNamePosition,
  customHeaderTitle = 'Church Presenter',
  setCustomHeaderTitle,
}) {
  const [bibleStats, setBibleStats] = useState([]);
  const [libraryNotice, setLibraryNotice] = useState("");

  useEffect(() => {
    if (settingsSection === "bible" && window.api && window.api.getBibleStats) {
      window.api.getBibleStats().then((stats) => {
        setBibleStats(Array.isArray(stats) ? stats : []);
      });
    }
  }, [settingsSection]);

  const refreshLibrary = async () => {
    setLibraryNotice("");
    if (window.api && window.api.getBibleStats) {
      const stats = await window.api.getBibleStats();
      setBibleStats(Array.isArray(stats) ? stats : []);
    }
    if (refreshBibles) refreshBibles();
  };
  const settingsMenu = [
    { id: "general", label: "General", icon: Setting },
    { id: "appearance", label: "Appearance", icon: Category },
    { id: "display", label: "Display & Projector", icon: Video },
    { id: "presentation", label: "Presentation", icon: Video },
    { id: "bible", label: "Bible & Scripture", icon: Document },
    { id: "content", label: "Content & Storage", icon: Document },
    { id: "languages", label: "Languages", icon: Category },
    { id: "shortcuts", label: "Keyboard Shortcuts", icon: TickSquare },
    { id: "backup", label: "Backup & Export", icon: Activity },
    { id: "about", label: "About App", icon: InfoSquare },
  ];
  const activeEffectiveTheme = effectiveTheme || themeMode || 'dark';
  const isLight = activeEffectiveTheme === "light";
  const cardClass = isLight
    ? "bg-[#F9FAFB] border-[#E5E7EB] text-[#111827]"
    : "bg-[#1C1D21] border-[#2A2C31] text-[#EDEDEE]";
  const selectClass = isLight
    ? "bg-[#E5E7EB] border-[#D1D5DB] text-[#111827]"
    : "bg-[#24262B] border-[#2A2C31] text-[#EDEDEE]";
  const textTitle = isLight ? "text-[#111827]" : "text-[#EDEDEE]";
  const textSub = isLight ? "text-[#4B5563]" : "text-[#9B9CA3]";
  const borderDivider = isLight ? "border-[#E5E7EB]" : "border-[#2A2C31]";

  return (
    <div className="flex h-full gap-4 max-w-5xl mx-auto">
      {/* Settings Sub-Sidebar Navigation */}
      <div
        className={`w-52 border rounded-lg p-2 shrink-0 space-y-1 self-start transition-colors duration-200 ${
          isLight
            ? "bg-[#FFFFFF] border-[#E5E7EB]"
            : "bg-[#151619] border-[#2A2C31]"
        }`}
      >
        <div
          className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider border-b mb-1 ${
            isLight
              ? "text-[#6B7280] border-[#E5E7EB]"
              : "text-[#6B6C73] border-[#2A2C31]"
          }`}
        >
          Settings Menu
        </div>
        {settingsMenu.map((item) => {
          const Icon = item.icon;
          const isActive = settingsSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSettingsSection(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition cursor-pointer ${
                isActive
                  ? isLight
                    ? "bg-[#E5E7EB] text-[#D4A94A] border border-[#D4A94A]/30"
                    : "bg-[#24262B] text-[#D4A94A] border border-[#D4A94A]/30"
                  : isLight
                    ? "text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]"
                    : "text-[#9B9CA3] hover:text-[#EDEDEE] hover:bg-[#1C1D21]"
              }`}
            >
              <Icon set={isActive ? "bold" : "light"} primaryColor="currentColor" size="small" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Settings Content Area */}
      <div
        className={`flex-1 border rounded-lg p-6 overflow-y-auto space-y-6 transition-colors duration-200 ${
          isLight
            ? "bg-[#FFFFFF] border-[#E5E7EB]"
            : "bg-[#151619] border-[#2A2C31]"
        }`}
      >
        {/* 1. GENERAL */}
        {settingsSection === "general" && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-[#D4A94A] flex items-center gap-2">
                <FaSliders /> General System Preferences
              </h3>
              <p className={`text-xs mt-1 ${textSub}`}>
                Configure core application startup behaviors and automated
                workflows.
              </p>
            </div>

            <div className={`space-y-4 pt-2 border-t ${borderDivider}`}>
              <div
                className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}
              >
                <div>
                  <div className={`font-semibold text-xs ${textTitle}`}>
                    Application Name
                  </div>
                  <div className={`text-[11px] ${textSub}`}>
                    Church Presenter Ghana Edition
                  </div>
                </div>
                <span
                  className={`text-xs font-mono ${isLight ? "text-[#9CA3AF]" : "text-[#6B6C73]"}`}
                >
                  v1.0.0
                </span>
              </div>

              <div
                className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}
              >
                <div>
                  <div className={`font-semibold text-xs ${textTitle}`}>
                    Default Startup Screen
                  </div>
                  <div className={`text-[11px] ${textSub}`}>
                    Choose view on launch
                  </div>
                </div>
                <select
                  className={`text-xs rounded px-2.5 py-1 outline-none border ${selectClass}`}
                >
                  <option value="plan">Sunday Service Planner</option>
                  <option value="bible">Bible Scripture Lookup</option>
                  <option value="songs">Songs & Hymns Library</option>
                </select>
              </div>

              <div
                className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}
              >
                <div>
                  <div className={`font-semibold text-xs ${textTitle}`}>
                    Auto-save Service Playlist
                  </div>
                  <div className={`text-[11px] ${textSub}`}>
                    Automatically save playlist changes
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="accent-[#D4A94A] w-4 h-4 cursor-pointer"
                />
              </div>

              <div
                className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}
              >
                <div>
                  <div className={`font-semibold text-xs ${textTitle}`}>
                    Launch on System Startup
                  </div>
                  <div className={`text-[11px] ${textSub}`}>
                    Start app automatically when PC boots
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="accent-[#D4A94A] w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. APPEARANCE */}
        {settingsSection === "appearance" && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-[#D4A94A] flex items-center gap-2">
                <FaPalette /> Visual Appearance & Design Tokens
              </h3>
              <p className={`text-xs mt-1 ${textSub}`}>
                Cluely design language palette, theme modes, interface density,
                and text sizing settings.
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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#D4A94A]">
                      <rect width="20" height="14" x="2" y="3" rx="2"/>
                      <path d="M12 17v4M8 21h8"/>
                    </svg>
                    <div className="text-left">
                      <div className="font-bold text-xs">System Preference</div>
                      <div className="text-[10px] opacity-70">
                        Auto OS Theme
                      </div>
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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#D4A94A]">
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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#D4A94A]">
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
                    className={`flex items-center gap-2.5 p-2 rounded border ${isLight ? "bg-[#FFFFFF] border-[#D1D5DB]" : "bg-[#0B0C0E] border-[#2A2C31]"}`}
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
                    className={`flex items-center gap-2.5 p-2 rounded border ${isLight ? "bg-[#FFFFFF] border-[#D1D5DB]" : "bg-[#151619] border-[#2A2C31]"}`}
                  >
                    <span className="w-4 h-4 rounded bg-[#151619] border border-white/20" />
                    <div>
                      <div className={`font-mono text-[10px] ${textTitle}`}>
                        #151619
                      </div>
                      <div className={`text-[10px] ${textSub}`}>
                        Panel Surface
                      </div>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-2.5 p-2 rounded border ${isLight ? "bg-[#FFFFFF] border-[#D1D5DB]" : "bg-[#1C1D21] border-[#2A2C31]"}`}
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
                    className={`flex items-center gap-2.5 p-2 rounded border ${isLight ? "bg-[#FFFFFF] border-[#D1D5DB]" : "bg-[#1C1D21] border-[#2A2C31]"}`}
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
                  className={`text-xs rounded px-2.5 py-1 outline-none border ${selectClass}`}
                >
                  <option value="normal">Standard (13px)</option>
                  <option value="compact">Compact (12px)</option>
                  <option value="large">Large (14px)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 3. DISPLAY & PROJECTOR */}
        {settingsSection === "display" && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-[#D4A94A] flex items-center gap-2">
                <FaDesktop /> Multi-Monitor & Projector Displays
              </h3>
              <p className={`text-xs mt-1 ${textSub}`}>
                Control display assignment, projector resolution, and screen
                identification.
              </p>
            </div>

            <div className={`space-y-4 pt-2 border-t ${borderDivider}`}>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border space-y-2 ${cardClass}`}>
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs font-bold flex items-center gap-1.5 ${textTitle}`}
                    >
                      <FaDesktop className="text-[#D4A94A]" /> Control Display
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded text-[#6FCF97] ${isLight ? "bg-[#E5E7EB]" : "bg-[#24262B]"}`}
                    >
                      Active Main
                    </span>
                  </div>
                  <p className={`text-[11px] ${textSub}`}>
                    Operator Console Window (Primary Monitor)
                  </p>
                  <div className={`text-xs font-mono pt-1 ${textTitle}`}>
                    {displays.length > 0
                      ? `${displays[0].bounds.width} x ${displays[0].bounds.height} (Scale: ${displays[0].scaleFactor}x)`
                      : "1920 x 1080 (Scale: 1x)"}
                  </div>
                </div>

                <div className={`p-4 rounded-lg border space-y-2 ${cardClass}`}>
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs font-bold flex items-center gap-1.5 ${textTitle}`}
                    >
                      <FaTv className="text-[#E5484D]" /> Presentation Display
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        displays.length > 1
                          ? "bg-[#6FCF97]/20 text-[#6FCF97]"
                          : isLight
                            ? "bg-[#E5E7EB] text-[#6B7280]"
                            : "bg-[#24262B] text-[#9B9CA3]"
                      }`}
                    >
                      {displays.length > 1
                        ? "Connected"
                        : "Single Monitor Mode"}
                    </span>
                  </div>
                  <p className={`text-[11px] ${textSub}`}>
                    Church Projector / Secondary Screen
                  </p>
                  <div className={`text-xs font-mono pt-1 ${textTitle}`}>
                    {displays.length > 1
                      ? `${displays[1].bounds.width} x ${displays[1].bounds.height} (Display #${displays[1].id})`
                      : "Target: Secondary Bounds / Multi-Window"}
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border space-y-3 ${cardClass}`}>
                <div className="flex justify-between items-center">
                  <span className={`font-semibold text-xs ${textTitle}`}>
                    Detected System Displays ({displays.length || 1})
                  </span>
                  <button
                    onClick={() => {
                      if (window.api && window.api.getDisplays) {
                        window.api.getDisplays().then(setDisplays);
                      }
                    }}
                    className={`px-2.5 py-1 border text-[11px] font-medium text-[#D4A94A] rounded transition ${selectClass}`}
                  >
                    Refresh Displays
                  </button>
                </div>

                <div className="space-y-2">
                  {(displays.length > 0
                    ? displays
                    : [
                        {
                          id: "disp-1",
                          bounds: { width: 1920, height: 1080 },
                          scaleFactor: 1,
                          isPrimary: true,
                        },
                      ]
                  ).map((d, i) => (
                    <div
                      key={d.id || i}
                      className={`p-3 border rounded flex items-center justify-between text-xs ${
                        isLight
                          ? "bg-[#FFFFFF] border-[#E5E7EB]"
                          : "bg-[#151619] border-[#2A2C31]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center font-bold font-mono text-[11px] text-[#D4A94A] ${
                            isLight ? "bg-[#E5E7EB]" : "bg-[#24262B]"
                          }`}
                        >
                          #{i + 1}
                        </div>
                        <div>
                          <div className={`font-semibold ${textTitle}`}>
                            Monitor {i + 1} — {d.bounds.width}x{d.bounds.height}
                          </div>
                          <div className={`text-[10px] font-mono ${textSub}`}>
                            X: {d.bounds.x || 0}, Y: {d.bounds.y || 0} | Scale:{" "}
                            {d.scaleFactor || 1}x
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          isLight
                            ? "bg-[#E5E7EB] text-[#4B5563]"
                            : "bg-[#24262B] text-[#9B9CA3]"
                        }`}
                      >
                        {i === 0 ? "Primary Display" : "Extended Display"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}
              >
                <div>
                  <div className={`font-semibold text-xs ${textTitle}`}>
                    Presentation Fullscreen Mode
                  </div>
                  <div className={`text-[11px] ${textSub}`}>
                    Auto-fullscreen presentation output on secondary display
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="accent-[#D4A94A] w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. PRESENTATION */}
        {settingsSection === "presentation" && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-[#D4A94A] flex items-center gap-2">
                <FaTv /> Presentation Output & Slide Themes
              </h3>
              <p className={`text-xs mt-1 ${textSub}`}>
                Configure Projector typography, background theme (Dark, Light, or Custom Image), and presentation overlays.
              </p>
            </div>

            <div className={`space-y-4 pt-2 border-t ${borderDivider}`}>
              {/* Output Theme Selection */}
              <div className={`p-4 rounded border ${cardClass} space-y-3`}>
                <div>
                  <div className={`font-semibold text-xs ${textTitle}`}>
                    Output Display Background Theme
                  </div>
                  <div className={`text-[11px] ${textSub}`}>
                    Choose the visual theme for your live projector/presenter screen
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setOutputTheme && setOutputTheme('dark')}
                    className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition cursor-pointer ${
                      outputTheme === 'dark'
                        ? 'border-[#D4A94A] bg-[#D4A94A]/10 text-[#D4A94A]'
                        : isLight
                        ? 'border-[#E5E7EB] bg-[#F9FAFB] text-[#4B5563] hover:border-[#D1D5DB]'
                        : 'border-[#26282E] bg-[#141518] text-[#9B9CA3] hover:border-[#2A2C31]'
                    }`}
                  >
                    <div className="w-full h-10 rounded bg-[#0B0C0E] border border-[#2A2C31] flex items-center justify-center text-[10px] text-white font-semibold">
                      DARK MODE
                    </div>
                    <span className="text-xs font-bold">Dark Obsidian</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOutputTheme && setOutputTheme('light')}
                    className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition cursor-pointer ${
                      outputTheme === 'light'
                        ? 'border-[#D4A94A] bg-[#D4A94A]/10 text-[#D4A94A]'
                        : isLight
                        ? 'border-[#E5E7EB] bg-[#F9FAFB] text-[#4B5563] hover:border-[#D1D5DB]'
                        : 'border-[#26282E] bg-[#141518] text-[#9B9CA3] hover:border-[#2A2C31]'
                    }`}
                  >
                    <div className="w-full h-10 rounded bg-[#FFFFFF] border border-[#E5E7EB] flex items-center justify-center text-[10px] text-[#111827] font-semibold">
                      LIGHT MODE
                    </div>
                    <span className="text-xs font-bold">Pure White</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOutputTheme && setOutputTheme('image')}
                    className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition cursor-pointer ${
                      outputTheme === 'image'
                        ? 'border-[#D4A94A] bg-[#D4A94A]/10 text-[#D4A94A]'
                        : isLight
                        ? 'border-[#E5E7EB] bg-[#F9FAFB] text-[#4B5563] hover:border-[#D1D5DB]'
                        : 'border-[#26282E] bg-[#141518] text-[#9B9CA3] hover:border-[#2A2C31]'
                    }`}
                  >
                    <div className="w-full h-10 rounded bg-gradient-to-r from-blue-900 to-indigo-900 border border-blue-700 flex items-center justify-center text-[10px] text-white font-semibold">
                      IMAGE WALLPAPER
                    </div>
                    <span className="text-xs font-bold">Custom Image</span>
                  </button>
                </div>
              </div>

              {/* Background Image Configuration (When Theme is Image or always editable) */}
              <div className={`p-4 rounded border ${cardClass} space-y-3`}>
                <div>
                  <div className={`font-semibold text-xs ${textTitle}`}>
                    Background Wallpaper Image
                  </div>
                  <div className={`text-[11px] ${textSub}`}>
                    Provide an image URL or choose a worship preset wallpaper
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste image URL (https://...)"
                      value={outputBgImage || ''}
                      onChange={(e) => setOutputBgImage && setOutputBgImage(e.target.value)}
                      className={`flex-1 text-xs rounded px-3 py-1.5 outline-none border ${selectClass}`}
                    />
                    <label className="px-3 py-1.5 bg-[#D4A94A] hover:bg-[#D4A94A]/90 text-[#0B0C0E] font-bold rounded text-xs cursor-pointer flex items-center">
                      Browse File
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (evt) => {
                              if (evt.target?.result && setOutputBgImage) {
                                setOutputBgImage(evt.target.result)
                              }
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Wallpaper Presets */}
                  <div className="pt-2">
                    <div className={`text-[10px] uppercase font-bold tracking-wider mb-2 ${textSub}`}>
                      Recommended Worship Presets:
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (setOutputBgImage) setOutputBgImage('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1600&auto=format&fit=crop')
                          if (setOutputTheme) setOutputTheme('image')
                        }}
                        className="h-12 rounded border border-white/20 bg-cover bg-center overflow-hidden flex items-end p-1 transition hover:opacity-90"
                        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1600&auto=format&fit=crop')` }}
                      >
                        <span className="text-[9px] font-bold text-white bg-black/60 px-1 rounded">Dark Horizon</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (setOutputBgImage) setOutputBgImage('https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1600&auto=format&fit=crop')
                          if (setOutputTheme) setOutputTheme('image')
                        }}
                        className="h-12 rounded border border-white/20 bg-cover bg-center overflow-hidden flex items-end p-1 transition hover:opacity-90"
                        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1600&auto=format&fit=crop')` }}
                      >
                        <span className="text-[9px] font-bold text-white bg-black/60 px-1 rounded">Worship Light</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (setOutputBgImage) setOutputBgImage('https://images.unsplash.com/photo-1509021436468-d72a45025144?q=80&w=1600&auto=format&fit=crop')
                          if (setOutputTheme) setOutputTheme('image')
                        }}
                        className="h-12 rounded border border-white/20 bg-cover bg-center overflow-hidden flex items-end p-1 transition hover:opacity-90"
                        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1509021436468-d72a45025144?q=80&w=1600&auto=format&fit=crop')` }}
                      >
                        <span className="text-[9px] font-bold text-white bg-black/60 px-1 rounded">Starry Night</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (setOutputBgImage) setOutputBgImage('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1600&auto=format&fit=crop')
                          if (setOutputTheme) setOutputTheme('image')
                        }}
                        className="h-12 rounded border border-white/20 bg-cover bg-center overflow-hidden flex items-end p-1 transition hover:opacity-90"
                        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1600&auto=format&fit=crop')` }}
                      >
                        <span className="text-[9px] font-bold text-white bg-black/60 px-1 rounded">Nature Fog</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* App Name Display & Branding Position Settings */}
              <div className={`p-4 rounded border ${cardClass} space-y-3`}>
                <div>
                  <div className={`font-semibold text-xs ${textTitle}`}>
                    App Name & Branding Position on Projector
                  </div>
                  <div className={`text-[11px] ${textSub}`}>
                    Configure where and how the app title is displayed on the live presentation window
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[11px] font-semibold mb-1 ${textTitle}`}>
                      Branding Display Location
                    </label>
                    <select
                      value={appNamePosition || 'top-left'}
                      onChange={(e) => setAppNamePosition && setAppNamePosition(e.target.value)}
                      className={`w-full text-xs rounded px-2.5 py-1.5 outline-none border ${selectClass}`}
                    >
                      <option value="top-left">Top Header Left (Default)</option>
                      <option value="top-right">Top Header Right</option>
                      <option value="bottom-left">Bottom Footer Left</option>
                      <option value="bottom-right">Bottom Footer Right</option>
                      <option value="hidden">Hidden (Do Not Display App Name)</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-[11px] font-semibold mb-1 ${textTitle}`}>
                      Header Branding Text
                    </label>
                    <input
                      type="text"
                      placeholder="Church Presenter"
                      value={customHeaderTitle ?? 'Church Presenter'}
                      onChange={(e) => setCustomHeaderTitle && setCustomHeaderTitle(e.target.value)}
                      className={`w-full text-xs rounded px-2.5 py-1.5 outline-none border ${selectClass}`}
                    />
                  </div>
                </div>
              </div>

              {/* Projector Mini Preview */}
              <div className={`p-4 rounded border ${cardClass} space-y-2`}>
                <div className={`font-semibold text-xs ${textTitle}`}>
                  Live Projector Output Preview
                </div>
                <div className="w-full aspect-video rounded-lg overflow-hidden border border-[#2A2C31] relative flex flex-col justify-between p-4 shadow-inner">
                  {outputTheme === 'image' ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url("${outputBgImage || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1600&auto=format&fit=crop'}")` }}
                    >
                      <div className="absolute inset-0 bg-black/60" />
                    </div>
                  ) : null}

                  <div
                    className={`relative z-10 h-full flex flex-col justify-between ${
                      outputTheme === 'light'
                        ? 'bg-[#FFFFFF] text-[#111827]'
                        : outputTheme === 'dark'
                        ? 'bg-[#0B0C0E] text-[#EDEDEE]'
                        : ''
                    } ${outputTheme !== 'image' ? '-m-4 p-4' : ''}`}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-[#D4A94A] uppercase border-b border-current/20 pb-2">
                      <span>{appNamePosition === 'top-left' ? customHeaderTitle : 'Bible Verse'}</span>
                      <span>{appNamePosition === 'top-left' ? 'Bible Verse' : appNamePosition === 'top-right' ? customHeaderTitle : ''}</span>
                    </div>

                    {/* Content */}
                    <div className="my-auto text-center px-4">
                      <p className={`text-xs font-bold leading-relaxed ${outputTheme === 'image' ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : ''}`}>
                        {showVerseQuotes ? '"For God so loved the world, that he gave his only begotten Son..."' : 'For God so loved the world, that he gave his only begotten Son...'}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-current/20 text-[10px] font-bold text-[#D4A94A] uppercase">
                      <div className="w-1/4 text-left">
                        {appNamePosition === 'bottom-left' ? customHeaderTitle : ''}
                      </div>
                      <div className="w-1/2 text-center">
                        — JOHN 3:16 (KJV) —
                      </div>
                      <div className="w-1/4 text-right">
                        {appNamePosition === 'bottom-right' ? customHeaderTitle : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}>
                <div>
                  <div className={`font-semibold text-xs ${textTitle}`}>
                    Slide Margin Padding
                  </div>
                  <div className={`text-[11px] ${textSub}`}>
                    Safe viewport distance for projector projection
                  </div>
                </div>
                <select
                  className={`text-xs rounded px-2.5 py-1 outline-none border ${selectClass}`}
                >
                  <option value="4rem">Standard (4rem / 64px)</option>
                  <option value="2rem">Compact (2rem / 32px)</option>
                  <option value="6rem">Wide Safe Zone (6rem / 96px)</option>
                </select>
              </div>

              <div className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}>
                <div>
                  <div className={`font-semibold text-xs ${textTitle}`}>
                    Attribution Line Position
                  </div>
                  <div className={`text-[11px] ${textSub}`}>
                    Scripture & hymn reference text alignment
                  </div>
                </div>
                <select
                  className={`text-xs rounded px-2.5 py-1 outline-none border ${selectClass}`}
                >
                  <option value="bottom">Bottom Centered</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="top">Top Header Line</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 5. BIBLE */}
        {settingsSection === "bible" && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-[#D4A94A] flex items-center gap-2">
                <FaBookOpen /> Bible & Scripture Preferences
              </h3>
              <p className={`text-xs mt-1 ${textSub}`}>
                Default translations, text formatting, and offline scripture databases.
              </p>
            </div>

            <div className={`space-y-4 pt-2 border-t ${borderDivider}`}>
              <div
                className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}
              >
                <div>
                  <div className={`font-semibold text-xs ${textTitle}`}>
                    Default Bible Translation
                  </div>
                  <div className={`text-[11px] ${textSub}`}>
                    Default version loaded on app launch
                  </div>
                </div>
                <select
                  value={selectedTranslation}
                  onChange={(e) => setSelectedTranslation(e.target.value)}
                  className={`text-xs rounded px-2.5 py-1 outline-none border ${selectClass}`}
                >
                  {(biblesList && biblesList.length > 0 ? biblesList : [
                    { code: "NIV", name: "New International Version (NIV)" },
                    { code: "NKJV", name: "New King James Version (NKJV)" },
                    { code: "KJV", name: "King James Version (KJV)" },
                    { code: "TWI", name: "Twerɛ Kronkron (Twi Bible - BSG)" },
                  ]).map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Import Bible SQL File */}
              <div
                className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}
              >
                <div>
                  <div className={`font-semibold text-xs ${textTitle}`}>
                    Import Bible SQL File (.sql)
                  </div>
                  <div className={`text-[11px] ${textSub}`}>
                    Import NKJV.sql, NIV.sql, or KJV.sql database dumps
                  </div>
                </div>
                <button
                  onClick={async () => {
                    if (window.api && window.api.importBibleSql) {
                      const res = await window.api.importBibleSql();
                      if (res && res.success) {
                        alert(`Successfully imported ${res.fileName} into SQLite!`);
                      } else if (res && res.message && res.message !== 'Cancelled') {
                        alert(`Import error: ${res.message}`);
                      }
                    }
                  }}
                  className="px-3 py-1.5 bg-[#D4A94A] hover:bg-[#D4A94A]/90 text-[#0B0C0E] font-bold rounded text-xs transition shadow cursor-pointer"
                >
                  Select SQL File
                </button>
              </div>

              {/* Import Bible XML File */}
              <div
                className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}
              >
                <div>
                  <div className={`font-semibold text-xs ${textTitle}`}>
                    Import Bible XML File (.xml)
                  </div>
                  <div className={`text-[11px] ${textSub}`}>
                    Add a Twi/structured Bible from a .xml file (Zefania/OSIS
                    format supported)
                  </div>
                </div>
                <button
                  onClick={async () => {
                    if (window.api && window.api.importBibleXml) {
                      const res = await window.api.importBibleXml();
                      if (res && res.success && res.results) {
                        const ok = res.results.filter((r) => r.success);
                        const fail = res.results.filter((r) => !r.success && r.message && r.message !== "Cancelled");
                        if (ok.length > 0) {
                          setLibraryNotice(`${ok.length} file(s) imported successfully.`);
                        } else if (fail.length > 0) {
                          setLibraryNotice(`Import error: ${fail[0].message}`);
                        }
                        await refreshLibrary();
                      } else if (res && res.message && res.message !== "Cancelled") {
                        setLibraryNotice(`Import error: ${res.message}`);
                      }
                    }
                  }}
                  className="px-3 py-1.5 bg-[#D4A94A] hover:bg-[#D4A94A]/90 text-[#0B0C0E] font-bold rounded text-xs transition shadow cursor-pointer"
                >
                  Select XML File
                </button>
              </div>

              {/* Auto-Scan Folder Info */}
              <div className={`p-4 rounded border space-y-2 ${cardClass}`}>
                <div className="font-semibold text-xs text-[#D4A94A] flex items-center gap-1.5">
                  📁 Auto-Scan Bibles Folder Info
                </div>
                <p className={`text-[11px] leading-relaxed ${textSub}`}>
                  Drop <code className="font-mono text-[#D4A94A] bg-black/20 px-1 py-0.5 rounded">NKJV.sql</code>, <code className="font-mono text-[#D4A94A] bg-black/20 px-1 py-0.5 rounded">NIV.sql</code>, or <code className="font-mono text-[#D4A94A] bg-black/20 px-1 py-0.5 rounded">KJV.sql</code> into <code className="font-mono text-[#D4A94A] bg-black/20 px-1 py-0.5 rounded">bibles/</code>, or any Bible <code className="font-mono text-[#D4A94A] bg-black/20 px-1 py-0.5 rounded">.xml</code> file into <code className="font-mono text-[#D4A94A] bg-black/20 px-1 py-0.5 rounded">bibles/xml/</code>. The app auto-scans and imports them on startup — the bundled English (NIV/NKJV/KJV) and Twi (Twerɛ Kronkron) XML Bibles already live in <code className="font-mono text-[#D4A94A] bg-black/20 px-1 py-0.5 rounded">bibles/xml/</code>.
                </p>
              </div>

              {/* Installed Bible Library */}
              <div className={`p-4 rounded border space-y-3 ${cardClass}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-xs text-[#D4A94A] flex items-center gap-1.5">
                      <FaDatabase /> Installed Bible Library
                    </div>
                    <p className={`text-[11px] mt-0.5 ${textSub}`}>
                      Translations available to the Navigator and search.
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      if (window.api && window.api.rescanBibles) {
                        const res = await window.api.rescanBibles();
                        setLibraryNotice(res && res.success ? "Re-scan complete." : `Re-scan error: ${res && res.error}`);
                        await refreshLibrary();
                      }
                    }}
                    className="px-2.5 py-1.5 rounded text-[11px] font-semibold border transition cursor-pointer bg-transparent hover:bg-[#D4A94A]/10 text-[#D4A94A] border-[#D4A94A]/40"
                  >
                    Re-scan Bibles Folder
                  </button>
                </div>

                {libraryNotice && (
                  <p className="text-[11px] text-[#6FCF97]">{libraryNotice}</p>
                )}

                <div className="space-y-2">
                  {bibleStats.length === 0 && (
                    <p className={`text-[11px] ${textSub}`}>
                      No imported Bibles found yet.
                    </p>
                  )}
                  {bibleStats.map((b) => {
                    const isProtected =
                      ["NIV", "NKJV", "KJV", "TWI"].indexOf(String(b.code || "").toUpperCase()) !== -1;
                    const isActive = selectedTranslation === b.code;
                    return (
                      <div
                        key={b.id}
                        className={`flex items-center justify-between gap-3 p-3 rounded border ${isActive ? "border-[#D4A94A] bg-[#D4A94A]/5" : ""} ${cardClass}`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold text-xs truncate ${textTitle}`}>
                              {b.name}
                            </span>
                            {isActive && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#D4A94A] text-[#0B0C0E] font-bold">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div className={`text-[11px] mt-0.5 ${textSub}`}>
                            {b.code} · {b.language} · {b.bookCount} books · {b.verseCount.toLocaleString()} verses
                            {b.sourceFile ? ` · ${b.sourceFile}` : ""}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {!isActive && (
                            <button
                              onClick={() => setSelectedTranslation(b.code)}
                              className="px-2.5 py-1.5 rounded text-[11px] font-semibold border transition cursor-pointer bg-transparent hover:bg-[#D4A94A]/10 text-[#D4A94A] border-[#D4A94A]/40"
                            >
                              Set as Active
                            </button>
                          )}
                          {!isProtected && (
                            <button
                              onClick={async () => {
                                if (window.api && window.api.removeBible) {
                                  const res = await window.api.removeBible(b.id);
                                  if (res && res.success) {
                                    setLibraryNotice(`${b.code} removed.`);
                                    await refreshLibrary();
                                    if (selectedTranslation === b.code && biblesList && biblesList.length > 0) {
                                      setSelectedTranslation(biblesList[0].code);
                                    }
                                  } else {
                                    setLibraryNotice(`Delete error: ${res && res.error}`);
                                  }
                                }
                              }}
                              className="px-2.5 py-1.5 rounded text-[11px] font-semibold border transition cursor-pointer bg-transparent hover:bg-[#E5484D] hover:text-white text-[#E5484D] border-[#E5484D]/40"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}
              >
                <div>
                  <div className={`font-semibold text-xs ${textTitle}`}>
                    Verse Quotation Marks
                  </div>
                  <div className={`text-[11px] ${textSub}`}>
                    Enclose projected verse in quotes
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showVerseQuotes}
                  onChange={(e) => setShowVerseQuotes && setShowVerseQuotes(e.target.checked)}
                  className="accent-[#D4A94A] w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* 6. CONTENT & STORAGE */}
        {settingsSection === "content" && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-[#D4A94A] flex items-center gap-2">
                <FaDatabase /> Local Storage & Data Imports
              </h3>
              <p className={`text-xs mt-1 ${textSub}`}>
                SQLite database status, WAL mode logs, and native batch JSON
                importers.
              </p>
            </div>

            <div className={`space-y-4 pt-2 border-t ${borderDivider}`}>
              <div className={`p-4 rounded border space-y-2 ${cardClass}`}>
                <div className="flex justify-between items-center">
                  <span className={`font-semibold text-xs ${textTitle}`}>
                    SQLite Database Connection
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#6FCF97]/20 text-[#6FCF97]">
                    Connected (WAL Mode)
                  </span>
                </div>
                <div
                  className={`text-xs font-mono break-all p-2.5 rounded border ${
                    isLight
                      ? "bg-[#FFFFFF] border-[#E5E7EB] text-[#4B5563]"
                      : "bg-[#151619] border-[#2A2C31] text-[#9B9CA3]"
                  }`}
                >
                  {dbStatus
                    ? dbStatus.dbPath
                    : "%APPDATA%/church-presenter/church.db"}
                </div>
              </div>

              <div
                className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}
              >
                <div>
                  <div className={`font-semibold text-xs ${textTitle}`}>
                    Import Songs & Hymns Batch
                  </div>
                  <div className={`text-[11px] ${textSub}`}>
                    Select JSON song collection to import into SQLite
                  </div>
                </div>
                <button
                  onClick={async () => {
                    if (window.api && window.api.importSongsDialog) {
                      const res = await window.api.importSongsDialog();
                      if (res && res.success) {
                        alert(
                          `Successfully imported ${res.count} hymns!`,
                        );
                      }
                    }
                  }}
                  className="px-3 py-1.5 bg-[#D4A94A] hover:bg-[#D4A94A]/90 text-[#0B0C0E] font-bold rounded text-xs transition shadow cursor-pointer"
                >
                  Select JSON File
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 7. LANGUAGES */}
        {settingsSection === "languages" && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-[#D4A94A] flex items-center gap-2">
                <FaLanguage /> Languages & Translations
              </h3>
              <p className={`text-xs mt-1 ${textSub}`}>
                Interface locale and Ghanaian local language scripture support.
              </p>
            </div>

            <div className={`space-y-4 pt-2 border-t ${borderDivider}`}>
              <div
                className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}
              >
                <div>
                  <div className={`font-semibold text-xs ${textTitle}`}>
                    Primary Interface Language
                  </div>
                  <div className={`text-[11px] ${textSub}`}>
                    Control window locale
                  </div>
                </div>
                <select
                  className={`text-xs rounded px-2.5 py-1 outline-none border ${selectClass}`}
                >
                  <option value="en-GH">English (Ghana)</option>
                  <option value="twi">Twi / Asante</option>
                  <option value="fante">Fante</option>
                  <option value="ga">Ga</option>
                  <option value="ewe">Ewe</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 8. KEYBOARD SHORTCUTS */}
        {settingsSection === "shortcuts" && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-[#D4A94A] flex items-center gap-2">
                <FaKeyboard /> Operator Keyboard Shortcuts
              </h3>
              <p className={`text-xs mt-1 ${textSub}`}>
                Quick hotkeys for fast live presentation transport.
              </p>
            </div>

            <div className={`pt-2 border-t ${borderDivider}`}>
              <div className={`rounded border overflow-hidden ${cardClass}`}>
                <table className="w-full text-left text-xs">
                  <thead
                    className={`text-[#D4A94A] text-[11px] uppercase tracking-wider ${isLight ? "bg-[#E5E7EB]" : "bg-[#24262B]"}`}
                  >
                    <tr>
                      <th className="p-3">Action</th>
                      <th className="p-3">Shortcut Key</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${isLight ? "divide-[#E5E7EB] text-[#111827]" : "divide-[#2A2C31] text-[#EDEDEE]"}`}
                  >
                    <tr>
                      <td className="p-3 font-semibold">Next Verse / Stanza</td>
                      <td className="p-3">
                        <kbd
                          className={`px-2 py-1 rounded border font-mono text-[11px] ${isLight ? "bg-[#FFFFFF] border-[#D1D5DB]" : "bg-[#151619] border-[#3A3B40]"}`}
                        >
                          Down Arrow
                        </kbd>{" "}
                        /{" "}
                        <kbd
                          className={`px-2 py-1 rounded border font-mono text-[11px] ${isLight ? "bg-[#FFFFFF] border-[#D1D5DB]" : "bg-[#151619] border-[#3A3B40]"}`}
                        >
                          Right Arrow
                        </kbd>
                      </td>
                      <td className={`p-3 ${textSub}`}>
                        Advance to next slide item
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">
                        Previous Verse / Stanza
                      </td>
                      <td className="p-3">
                        <kbd
                          className={`px-2 py-1 rounded border font-mono text-[11px] ${isLight ? "bg-[#FFFFFF] border-[#D1D5DB]" : "bg-[#151619] border-[#3A3B40]"}`}
                        >
                          Up Arrow
                        </kbd>{" "}
                        /{" "}
                        <kbd
                          className={`px-2 py-1 rounded border font-mono text-[11px] ${isLight ? "bg-[#FFFFFF] border-[#D1D5DB]" : "bg-[#151619] border-[#3A3B40]"}`}
                        >
                          Left Arrow
                        </kbd>
                      </td>
                      <td className={`p-3 ${textSub}`}>
                        Return to previous slide item
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Present Live</td>
                      <td className="p-3">
                        <kbd
                          className={`px-2 py-1 rounded border font-mono text-[11px] ${isLight ? "bg-[#FFFFFF] border-[#D1D5DB]" : "bg-[#151619] border-[#3A3B40]"}`}
                        >
                          P
                        </kbd>{" "}
                        or{" "}
                        <kbd
                          className={`px-2 py-1 rounded border font-mono text-[11px] ${isLight ? "bg-[#FFFFFF] border-[#D1D5DB]" : "bg-[#151619] border-[#3A3B40]"}`}
                        >
                          Enter
                        </kbd>
                      </td>
                      <td className={`p-3 ${textSub}`}>
                        Send staged slide to projector
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Toggle Black Screen</td>
                      <td className="p-3">
                        <kbd
                          className={`px-2 py-1 rounded border font-mono text-[11px] ${isLight ? "bg-[#FFFFFF] border-[#D1D5DB]" : "bg-[#151619] border-[#3A3B40]"}`}
                        >
                          B
                        </kbd>
                      </td>
                      <td className={`p-3 ${textSub}`}>
                        Instantly blackout projector output
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Toggle Clear Text</td>
                      <td className="p-3">
                        <kbd
                          className={`px-2 py-1 rounded border font-mono text-[11px] ${isLight ? "bg-[#FFFFFF] border-[#D1D5DB]" : "bg-[#151619] border-[#3A3B40]"}`}
                        >
                          C
                        </kbd>
                      </td>
                      <td className={`p-3 ${textSub}`}>
                        Clear text while holding background
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 9. BACKUP & EXPORT */}
        {settingsSection === "backup" && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-[#D4A94A] flex items-center gap-2">
                <FaFloppyDisk /> Backup & Data Export
              </h3>
              <p className={`text-xs mt-1 ${textSub}`}>
                Export service playlists, backup offline SQLite databases, and
                restore content.
              </p>
            </div>

            <div className={`space-y-4 pt-2 border-t ${borderDivider}`}>
              <div
                className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}
              >
                <div>
                  <div className={`font-semibold text-xs ${textTitle}`}>
                    Backup Local Database
                  </div>
                  <div className={`text-[11px] ${textSub}`}>
                    Save a copy of church.db to disk
                  </div>
                </div>
                <button
                  className={`px-3 py-1.5 border text-xs font-semibold rounded transition ${selectClass}`}
                >
                  Export Database Backup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 10. ABOUT */}
        {settingsSection === "about" && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-[#D4A94A] flex items-center gap-2">
                <FaCircleInfo /> About Church Presenter
              </h3>
              <p className={`text-xs mt-1 ${textSub}`}>
                System information, desktop versioning, and offline-first
                licensing details.
              </p>
            </div>

            <div className={`space-y-4 pt-2 border-t ${borderDivider}`}>
              <div className={`p-5 rounded-lg border space-y-3 ${cardClass}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#D4A94A]/10 border border-[#D4A94A]/30 flex items-center justify-center text-[#D4A94A] font-bold text-sm">
                    CP
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm ${textTitle}`}>
                      Church Presenter
                    </h4>
                    <p className={`text-xs ${textSub}`}>
                      Offline-First Church Presentation Software
                    </p>
                  </div>
                </div>

                {appInfo && (
                  <div
                    className={`grid grid-cols-2 gap-2 text-xs font-mono p-3 rounded border ${
                      isLight
                        ? "bg-[#FFFFFF] border-[#E5E7EB]"
                        : "bg-[#151619] border-[#2A2C31]"
                    }`}
                  >
                    <div>
                      <span
                        className={
                          isLight ? "text-[#6B7280]" : "text-[#6B6C73]"
                        }
                      >
                        OS Platform:
                      </span>{" "}
                      <span className={textTitle}>{appInfo.platform}</span>
                    </div>
                    <div>
                      <span
                        className={
                          isLight ? "text-[#6B7280]" : "text-[#6B6C73]"
                        }
                      >
                        Architecture:
                      </span>{" "}
                      <span className={textTitle}>{appInfo.arch}</span>
                    </div>
                    <div>
                      <span
                        className={
                          isLight ? "text-[#6B7280]" : "text-[#6B6C73]"
                        }
                      >
                        Engine:
                      </span>{" "}
                      <span className={textTitle}>Electron + React 19</span>
                    </div>
                    <div>
                      <span
                        className={
                          isLight ? "text-[#6B7280]" : "text-[#6B6C73]"
                        }
                      >
                        Database:
                      </span>{" "}
                      <span className="text-[#6FCF97]">SQLite3 WAL</span>
                    </div>
                  </div>
                )}

                <p className={`text-[11px] leading-relaxed ${textSub}`}>
                  Designed for churches in Ghana to deliver seamless scripture
                  projections, hymns display, and multi-monitor OBS/vMix live
                  streaming support without requiring active internet
                  connectivity.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
