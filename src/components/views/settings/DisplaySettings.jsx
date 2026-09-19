import React from "react";
import { FaDesktop, FaTv } from "react-icons/fa6";

export default function DisplaySettings({
  displays = [],
  setDisplays,
  projectionDisplays = [],
  setProjectionDisplays,
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
        <h3 className="text-sm font-bold text-accent flex items-center gap-2">
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
                <FaDesktop className="text-accent" /> Control Display
              </span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded text-success ${
                  isLight ? "bg-[#E5E7EB]" : "bg-[#24262B]"
                }`}
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
                <FaTv className="text-live" /> Presentation Display
              </span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  displays.length > 1
                    ? "bg-success/20 text-success"
                    : isLight
                      ? "bg-[#E5E7EB] text-[#6B7280]"
                      : "bg-[#24262B] text-[#9B9CA3]"
                }`}
              >
                {displays.length > 1 ? "Connected" : "Single Monitor Mode"}
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
              className={`px-2.5 py-1 border text-[11px] font-medium text-accent rounded transition ${selectClass}`}
            >
              Refresh Displays
            </button>
          </div>

          <p className={`text-[11px] ${textSub}`}>
            Tick any display (other than the primary control monitor) to project
            live output to it. You can select multiple displays at once.
          </p>

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
            ).map((d, i) => {
              const isSelected = projectionDisplays.includes(Number(d.id));
              const isPrimary = d.isPrimary || i === 0;
              return (
                <button
                  key={d.id || i}
                  type="button"
                  disabled={isPrimary}
                  onClick={() => {
                    if (!setProjectionDisplays || isPrimary) return;
                    const numericId = Number(d.id);
                    setProjectionDisplays((prev) =>
                      isSelected
                        ? (prev || []).filter((id) => id !== numericId)
                        : [...(prev || []), numericId]
                    );
                  }}
                  className={`w-full p-3 border rounded flex items-center justify-between text-xs transition text-left ${
                    isLight
                      ? "bg-[#FFFFFF] border-[#E5E7EB]"
                      : "bg-[#151619] border-[#2A2C31]"
                  } ${
                    isSelected
                      ? isLight
                        ? "ring-2 ring-accent border-accent"
                        : "ring-2 ring-accent border-accent"
                      : ""
                  } ${isPrimary ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center font-bold font-mono text-[11px] ${
                        isSelected
                          ? "bg-accent text-bg"
                          : "text-accent " +
                            (isLight ? "bg-[#E5E7EB]" : "bg-[#24262B]")
                      }`}
                    >
                      {isSelected ? "✓" : `#${i + 1}`}
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
                      isSelected
                        ? "bg-accent/15 text-accent"
                        : isLight
                          ? "bg-[#E5E7EB] text-[#4B5563]"
                          : "bg-[#24262B] text-[#9B9CA3]"
                    }`}
                  >
                    {isPrimary
                      ? "Control Display (Permanent)"
                      : isSelected
                        ? "Projecting Here"
                        : "Tap to Project"}
                  </span>
                </button>
              );
            })}
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
            className="accent-accent w-4 h-4 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
