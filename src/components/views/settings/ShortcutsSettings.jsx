import React from "react";
import { FaKeyboard, FaBolt, FaSliders, FaPalette, FaGear } from "react-icons/fa6";

export default function ShortcutsSettings({
  cardClass,
  textTitle,
  textSub,
  borderDivider,
  isLight,
}) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h3 className="text-sm font-bold text-accent flex items-center gap-2">
          <FaKeyboard /> Keyboard Shortcuts
        </h3>
        <p className={`text-xs mt-1 ${textSub}`}>
          WorshipDesk works with these easy to remember commands during live services.
        </p>
      </div>

      {/* General & Transport */}
      <div className={`space-y-4 pt-2 border-t ${borderDivider}`}>
        <div className={`p-4 rounded border ${cardClass} space-y-3`}>
          <div className={`font-semibold text-xs ${textTitle}`}>
            General & Transport
          </div>
          <div className="grid grid-cols-1 gap-2">
            {[
              {
                label: "Next Verse / Stanza",
                keys: ["↓", "→"],
              },
              {
                label: "Previous Verse / Stanza",
                keys: ["↑", "←"],
              },
              {
                label: "Present Staged Slide",
                keys: ["P", "Enter"],
              },
              {
                label: "Toggle Blackout Screen",
                keys: ["B"],
              },
              {
                label: "Toggle Clear Overlay Text",
                keys: ["C"],
              },
              {
                label: "Focus Scripture Search",
                keys: ["Ctrl", "F"],
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between gap-3 p-3 rounded border ${
                  isLight
                    ? "bg-[#F9FAFB] border-[#E5E7EB]"
                    : "bg-panel border-border"
                }`}
              >
                <span className={`text-xs font-semibold ${textTitle}`}>
                  {item.label}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.keys.map((k, kIdx) => (
                    <kbd
                      key={kIdx}
                      className={`px-2.5 py-1 rounded-md border font-mono text-xs font-semibold ${
                        isLight
                          ? "bg-[#FFFFFF] border-[#D1D5DB] text-[#111827]"
                          : "bg-[#24262B] border-[#2A2C31] text-text-primary"
                      }`}
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-4 rounded border ${cardClass} space-y-3`}>
          <div className={`font-semibold text-xs ${textTitle}`}>
            View Switcher
          </div>
          <div className="grid grid-cols-1 gap-2">
            {[
              { label: "Switch to Dashboard Home", key: "1" },
              { label: "Switch to Service Planner", key: "2" },
              { label: "Switch to Bible Scripture", key: "3" },
              { label: "Switch to Songs & Hymns", key: "4" },
              { label: "Switch to App Settings", key: "5" },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between gap-3 p-3 rounded border ${
                  isLight
                    ? "bg-[#F9FAFB] border-[#E5E7EB]"
                    : "bg-panel border-border"
                }`}
              >
                <span className={`text-xs font-semibold ${textTitle}`}>
                  {item.label}
                </span>
                <kbd
                  className={`px-2.5 py-1 rounded-md border font-mono text-xs font-extrabold ${
                    isLight
                      ? "bg-[#FFFFFF] border-[#D1D5DB] text-[#111827]"
                      : "bg-[#24262B] border-[#2A2C31] text-accent"
                  }`}
                >
                  {item.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
