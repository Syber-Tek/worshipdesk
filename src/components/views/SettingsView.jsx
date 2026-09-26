import React from "react";
import {
  FaSliders,
  FaPalette,
  FaDesktop,
  FaTv,
  FaBookBible,
  FaDatabase,
  FaLanguage,
  FaKeyboard,
  FaFloppyDisk,
  FaCircleInfo,
  FaMusic,
} from "react-icons/fa6";
import { getThemeClasses } from "../../lib/themeTokens";

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
  outputBgVideo,
  setOutputBgVideo,
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
  isFullscreenActive = true,
  setFullscreenActive,
}) {
  const settingsMenu = [
    { id: "general", label: "General", icon: FaSliders },
    { id: "appearance", label: "Appearance", icon: FaPalette },
    { id: "display", label: "Display & Projector", icon: FaDesktop },
    { id: "presentation", label: "Presentation", icon: FaTv },
    { id: "bible", label: "Bible & Scripture", icon: FaBookBible },
    { id: "songs", label: "Songs & Hymns", icon: FaMusic },
    { id: "content", label: "Content & Storage", icon: FaDatabase },
    { id: "languages", label: "Languages", icon: FaLanguage },
    { id: "shortcuts", label: "Keybinds", icon: FaKeyboard },
    { id: "backup", label: "Backup & Export", icon: FaFloppyDisk },
    { id: "about", label: "About & Updates", icon: FaCircleInfo },
  ];

  const activeEffectiveTheme = effectiveTheme || themeMode || "dark";
  const themeTokens = getThemeClasses(activeEffectiveTheme);
  const isLight = themeTokens.isLight;

  const commonProps = {
    ...themeTokens,
  };

  const panelRef = React.useRef(null);

  // Every section is its own page, so opening one should start at the top
  // instead of inheriting wherever the previous section was scrolled to.
  React.useEffect(() => {
    if (panelRef.current) panelRef.current.scrollTop = 0;
  }, [settingsSection]);

  return (
    <div className="@container flex h-full max-w-5xl mx-auto flex-col gap-4">
      {/* Settings Sub-Navigation.
          A responsive grid of tiles across the top, so the content panel below
          keeps the full width of this column. Below the container threshold
          there is no room for a grid, so it becomes a single scrolling chip row.
          The rails either side of this view already take ~320px, which is why
          the switch is driven by this container's width and not the window's. */}
      <nav
        aria-label="Settings sections"
        className={`flex w-full shrink-0 gap-1.5 overflow-x-auto pb-1 @3xl:grid @3xl:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] @3xl:overflow-x-visible @3xl:pb-2 rounded-lg border p-2 transition-colors duration-200 ${
          isLight
            ? "bg-[#FFFFFF] border-[#E5E7EB]"
            : "bg-[#151619] border-[#2A2C31]"
        }`}
      >
        <div
          className={`w-full px-3 py-2 text-[10px] font-bold uppercase tracking-wider border-b mb-1 @3xl:col-span-full ${
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
              type="button"
              key={item.id}
              onClick={() => setSettingsSection(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded border px-3 py-2 text-xs font-medium transition cursor-pointer ${
                isActive
                  ? isLight
                    ? "bg-[#E5E7EB] text-accent border-accent/30"
                    : "bg-[#24262B] text-accent border-accent/30"
                  : isLight
                    ? "text-[#4B5563] border-transparent hover:text-[#111827] hover:bg-[#F3F4F6]"
                    : "text-[#9B9CA3] border-transparent hover:text-text-primary hover:bg-[#1C1D21]"
              }`}
            >
              <Icon className="shrink-0" size="14" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Settings Content Area */}
      <div
        ref={panelRef}
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
            isFullscreenActive={isFullscreenActive}
            setFullscreenActive={setFullscreenActive}
            {...commonProps}
          />
        )}

        {settingsSection === "presentation" && (
          <PresentationSettings
            outputTheme={outputTheme}
            setOutputTheme={setOutputTheme}
            outputBgImage={outputBgImage}
            setOutputBgImage={setOutputBgImage}
            outputBgVideo={outputBgVideo}
            setOutputBgVideo={setOutputBgVideo}
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
