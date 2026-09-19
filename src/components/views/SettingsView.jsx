import React from "react";
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
  FaMusic,
} from "react-icons/fa6";

import GeneralSettings from "./settings/GeneralSettings";
import AppearanceSettings from "./settings/AppearanceSettings";
import DisplaySettings from "./settings/DisplaySettings";
import PresentationSettings from "./settings/PresentationSettings";
import BibleSettings from "./settings/BibleSettings";
import SongsSettings from "./settings/SongsSettings";
import ContentSettings from "./settings/ContentSettings";
import LanguageSettings from "./settings/LanguageSettings";
import ShortcutsSettings from "./settings/ShortcutsSettings";
import BackupSettings from "./settings/BackupSettings";
import AboutSettings from "./settings/AboutSettings";

export default function SettingsView({
  settingsSection,
  setSettingsSection,
  startupTab = "home",
  setStartupTab,
  appInfo,
  dbStatus,
  displays,
  setDisplays,
  projectionDisplays = [],
  setProjectionDisplays,
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
  appNamePosition = "top-left",
  setAppNamePosition,
  customHeaderTitle = "WorshipDesk",
  uiScale = "normal",
  setUiScale,
  slideMargin = "4rem",
  setSlideMargin,
  attributionPosition = "bottom",
  setAttributionPosition,
  outputFontSize = "normal",
  setOutputFontSize,
  setCustomHeaderTitle,
  defaultHymnCategory = "All",
  setDefaultHymnCategory,
  showHymnNumbers = true,
  setShowHymnNumbers,
  hymnTextScale = "normal",
  setHymnTextScale,
}) {
  const settingsMenu = [
    { id: "general", label: "General", icon: FaSliders },
    { id: "appearance", label: "Appearance", icon: FaPalette },
    { id: "display", label: "Display & Projector", icon: FaDesktop },
    { id: "presentation", label: "Presentation", icon: FaTv },
    { id: "bible", label: "Bible & Scripture", icon: FaBookOpen },
    { id: "songs", label: "Songs & Hymns", icon: FaMusic },
    { id: "content", label: "Content & Storage", icon: FaDatabase },
    { id: "languages", label: "Languages", icon: FaLanguage },
    { id: "shortcuts", label: "Keybinds", icon: FaKeyboard },
    { id: "backup", label: "Backup & Export", icon: FaFloppyDisk },
    { id: "about", label: "About App", icon: FaCircleInfo },
  ];

  const activeEffectiveTheme = effectiveTheme || themeMode || "dark";
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

  const commonProps = {
    cardClass,
    selectClass,
    textTitle,
    textSub,
    borderDivider,
    isLight,
  };

  return (
    <div className="flex flex-col xl:flex-row h-full gap-4 max-w-5xl mx-auto">
      {/* Settings Sub-Sidebar Navigation */}
      <div
        className={`w-full xl:w-64 border rounded-lg p-2 flex flex-wrap items-start gap-1 xl:flex-col xl:space-y-0 shrink-0 self-start transition-colors duration-200 ${
          isLight
            ? "bg-[#FFFFFF] border-[#E5E7EB]"
            : "bg-[#151619] border-[#2A2C31]"
        }`}
      >
        <div
          className={`w-full px-3 py-2 text-[10px] font-bold uppercase tracking-wider border-b mb-1 ${
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
              className={`flex-1 min-w-40 xl:w-full xl:flex-none flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition cursor-pointer ${
                isActive
                  ? isLight
                    ? "bg-[#E5E7EB] text-accent border border-accent/30"
                    : "bg-[#24262B] text-accent border border-accent/30"
                  : isLight
                    ? "text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]"
                    : "text-[#9B9CA3] hover:text-text-primary hover:bg-[#1C1D21]"
              }`}
            >
              <Icon className="shrink-0" size="14" />
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
        {settingsSection === "general" && (
          <GeneralSettings
            startupTab={startupTab}
            setStartupTab={setStartupTab}
            {...commonProps}
          />
        )}

        {settingsSection === "appearance" && (
          <AppearanceSettings
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            uiScale={uiScale}
            setUiScale={setUiScale}
            {...commonProps}
          />
        )}

        {settingsSection === "display" && (
          <DisplaySettings
            displays={displays}
            setDisplays={setDisplays}
            projectionDisplays={projectionDisplays}
            setProjectionDisplays={setProjectionDisplays}
            {...commonProps}
          />
        )}

        {settingsSection === "presentation" && (
          <PresentationSettings
            outputTheme={outputTheme}
            setOutputTheme={setOutputTheme}
            outputBgImage={outputBgImage}
            setOutputBgImage={setOutputBgImage}
            appNamePosition={appNamePosition}
            setAppNamePosition={setAppNamePosition}
            customHeaderTitle={customHeaderTitle}
            setCustomHeaderTitle={setCustomHeaderTitle}
            slideMargin={slideMargin}
            setSlideMargin={setSlideMargin}
            attributionPosition={attributionPosition}
            setAttributionPosition={setAttributionPosition}
            outputFontSize={outputFontSize}
            setOutputFontSize={setOutputFontSize}
            showVerseQuotes={showVerseQuotes}
            {...commonProps}
          />
        )}

        {settingsSection === "bible" && (
          <BibleSettings
            selectedTranslation={selectedTranslation}
            setSelectedTranslation={setSelectedTranslation}
            biblesList={biblesList}
            refreshBibles={refreshBibles}
            showVerseQuotes={showVerseQuotes}
            setShowVerseQuotes={setShowVerseQuotes}
            {...commonProps}
          />
        )}

        {settingsSection === "songs" && (
          <SongsSettings
            defaultHymnCategory={defaultHymnCategory}
            setDefaultHymnCategory={setDefaultHymnCategory}
            showHymnNumbers={showHymnNumbers}
            setShowHymnNumbers={setShowHymnNumbers}
            hymnTextScale={hymnTextScale}
            setHymnTextScale={setHymnTextScale}
            {...commonProps}
          />
        )}

        {settingsSection === "content" && (
          <ContentSettings dbStatus={dbStatus} {...commonProps} />
        )}

        {settingsSection === "languages" && (
          <LanguageSettings {...commonProps} />
        )}

        {settingsSection === "shortcuts" && (
          <ShortcutsSettings {...commonProps} />
        )}

        {settingsSection === "backup" && <BackupSettings {...commonProps} />}

        {settingsSection === "about" && <AboutSettings {...commonProps} />}
      </div>
    </div>
  );
}
