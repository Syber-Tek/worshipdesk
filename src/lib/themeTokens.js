/**
 * WorshipDesk Centralized Theme Color Token System
 * Guarantees 100% unified light/dark mode styling across all views & sub-components.
 */

export function getThemeClasses(themeMode = "dark") {
  const isLight = themeMode === "light";

  return {
    isLight,
    // Container card background and border
    cardClass: isLight
      ? "bg-[#FFFFFF] border-[#E5E7EB] text-[#111827]"
      : "bg-[#1C1D21] border-[#2A2C31] text-[#EDEDEE]",
    // Input and Select dropdown styling
    selectClass: isLight
      ? "bg-[#E5E7EB] border-[#D1D5DB] text-[#111827]"
      : "bg-[#24262B] border-[#2A2C31] text-[#EDEDEE]",
    // Primary title text
    textTitle: isLight ? "text-[#111827]" : "text-[#EDEDEE]",
    // Secondary description / subtitle text
    textSub: isLight ? "text-[#4B5563]" : "text-[#9CA0AC]",
    // Muted / metadata text
    textMuted: isLight ? "text-[#9CA3AF]" : "text-[#6B6C73]",
    // Section divider border
    borderDivider: isLight ? "border-[#E5E7EB]" : "border-[#2A2C31]",
    // Main panel background
    panelBg: isLight ? "bg-[#FFFFFF]" : "bg-[#141518]",
    // Canvas background
    canvasBg: isLight ? "bg-[#F3F4F6]" : "bg-[#0B0C0E]",
  };
}
