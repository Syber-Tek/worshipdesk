import React from "react";
import {
  FaKeyboard,
  FaPlay,
  FaSliders,
  FaForward,
  FaBackward,
  FaTv,
  FaEyeSlash,
  FaEraser,
  FaListOl,
  FaMagnifyingGlass,
  FaGear,
  FaBolt,
} from "react-icons/fa6";

export default function ShortcutsSettings({
  cardClass,
  textTitle,
  textSub,
  borderDivider,
  isLight,
}) {
  const transportShortcuts = [
    {
      id: "next",
      icon: FaForward,
      label: "Next Verse / Stanza",
      description: "Advance to the next scripture verse or hymnal stanza",
      keys: [["↓"], ["→"], ["PageDown"]],
    },
    {
      id: "prev",
      icon: FaBackward,
      label: "Previous Verse / Stanza",
      description: "Return to the previous scripture verse or stanza",
      keys: [["↑"], ["←"], ["PageUp"]],
    },
    {
      id: "present",
      icon: FaPlay,
      label: "Present Staged Slide Live",
      description:
        "Broadcast the currently staged slide immediately to projector",
      keys: [["P"], ["Enter"]],
    },
    {
      id: "blackout",
      icon: FaEyeSlash,
      label: "Toggle Blackout Screen",
      description: "Instantly obscure projector output with a black screen",
      keys: [["B"]],
    },
    {
      id: "clear",
      icon: FaEraser,
      label: "Toggle Clear Overlay Text",
      description:
        "Hide slide text content while maintaining active background theme",
      keys: [["C"]],
    },
    {
      id: "search",
      icon: FaMagnifyingGlass,
      label: "Focus Search Input Bar",
      description:
        "Jump keyboard focus directly to scripture or song search input",
      keys: [["Ctrl", "F"], ["/"]],
    },
  ];

  const navigationShortcuts = [
    {
      id: "nav-1",
      icon: FaGear,
      label: "Switch to Dashboard Home",
      description: "Navigate to service station overview & metric cards",
      keys: [["1"]],
    },
    {
      id: "nav-2",
      icon: FaListOl,
      label: "Switch to Service Planner",
      description: "Open the reorderable service playlist schedule",
      keys: [["2"]],
    },
    {
      id: "nav-3",
      icon: FaKeyboard,
      label: "Switch to Bible Scripture",
      description: "Open scripture lookup & multi-translation reader",
      keys: [["3"]],
    },
    {
      id: "nav-4",
      icon: FaTv,
      label: "Switch to Songs & Hymns",
      description: "Open Presbyterian & Methodist hymnal library",
      keys: [["4"]],
    },
    {
      id: "nav-5",
      icon: FaSliders,
      label: "Switch to App Settings",
      description: "Open display, presentation, and system configuration",
      keys: [["5"]],
    },
  ];

  return (
    <div className="space-y-5">
      {/* Standardized Header */}
      <div>
        <h3 className="text-sm font-bold text-accent flex items-center gap-2">
          <FaKeyboard /> Keyboard Shortcuts
        </h3>
        <p className={`text-xs mt-1 ${textSub}`}>
          Operator keyboard controls for live presentation, navigation,
          blackout, and quick actions.
        </p>
      </div>

      <div className={`space-y-6 pt-2 border-t ${borderDivider}`}>
        {/* Section 1: Presentation & Transport Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-2">
              <FaPlay /> Live Transport & Presentation Controls
            </h4>
            <span className={`text-[10px] ${textSub}`}>
              {transportShortcuts.length} shortcuts
            </span>
          </div>

          <div className="space-y-2">
            {transportShortcuts.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-lg border flex items-center justify-between gap-4 transition duration-150 ${cardClass}`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 text-xs ${
                        isLight
                          ? "bg-[#F3F4F6] border-[#E5E7EB] text-[#4B5563]"
                          : "bg-[#151619] border-[#2A2C31] text-accent"
                      }`}
                    >
                      <Icon />
                    </div>
                    <div className="min-w-0">
                      <div
                        className={`font-semibold text-xs truncate ${textTitle}`}
                      >
                        {item.label}
                      </div>
                      <div className={`text-[11px] truncate ${textSub}`}>
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.keys.map((group, gIdx) => (
                      <React.Fragment key={gIdx}>
                        {gIdx > 0 && (
                          <span className={`text-xs font-medium ${textSub}`}>
                            or
                          </span>
                        )}
                        <div className="flex items-center gap-1">
                          {group.map((k, kIdx) => (
                            <kbd
                              key={kIdx}
                              className={`px-2.5 py-1 rounded border font-mono text-xs font-bold shadow-xs transition ${
                                isLight
                                  ? "bg-[#FFFFFF] border-[#D1D5DB] text-[#111827]"
                                  : "bg-[#24262B] border-[#3A3B40] text-text-primary"
                              }`}
                            >
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Quick View Navigation */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-2">
              <FaSliders /> Quick View Navigation (Hotkeys 1-5)
            </h4>
            <span className={`text-[10px] ${textSub}`}>
              {navigationShortcuts.length} shortcuts
            </span>
          </div>

          <div className="space-y-2">
            {navigationShortcuts.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-lg border flex items-center justify-between gap-4 transition duration-150 ${cardClass}`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 text-xs ${
                        isLight
                          ? "bg-[#F3F4F6] border-[#E5E7EB] text-[#4B5563]"
                          : "bg-[#151619] border-[#2A2C31] text-accent"
                      }`}
                    >
                      <Icon />
                    </div>
                    <div className="min-w-0">
                      <div
                        className={`font-semibold text-xs truncate ${textTitle}`}
                      >
                        {item.label}
                      </div>
                      <div className={`text-[11px] truncate ${textSub}`}>
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <kbd
                      className={`px-3 py-1 rounded border font-mono text-xs font-extrabold shadow-xs ${
                        isLight
                          ? "bg-[#FFFFFF] border-[#D1D5DB] text-[#111827]"
                          : "bg-[#24262B] border-[#3A3B40] text-accent"
                      }`}
                    >
                      {item.keys[0][0]}
                    </kbd>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
