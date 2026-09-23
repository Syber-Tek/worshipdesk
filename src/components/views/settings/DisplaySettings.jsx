import React from "react";
import { toast } from "sonner";
import { FaDesktop, FaTv } from "react-icons/fa6";

export default function DisplaySettings({
  displays = [],
  setDisplays,
  projectionDisplays = [],
  setProjectionDisplays,
  isFullscreenActive = true,
  setFullscreenActive,
  cardClass,
  selectClass,
  textTitle,
  textSub,
  borderDivider,
  isLight,
}) {
  const [isStageActive, setIsStageActive] = React.useState(false);

  React.useEffect(() => {
    if (window.api && window.api.getStageWindowStatus) {
      window.api.getStageWindowStatus().then((res) => {
        setIsStageActive(Boolean(res && res.active));
      });
    }
    if (window.api && window.api.onStageStatusChanged) {
      const unsub = window.api.onStageStatusChanged((active) => {
        setIsStageActive(Boolean(active));
      });
      return () => {
        if (typeof unsub === "function") unsub();
      };
    }
  }, []);

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
                  window.api.getDisplays().then((d) => {
                    if (setDisplays) setDisplays(d);
                    toast.success("Refreshed system displays list");
                  });
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
                    const nextSelected = !isSelected;
                    setProjectionDisplays((prev) =>
                      isSelected
                        ? (prev || []).filter((id) => id !== numericId)
                        : [...(prev || []), numericId],
                    );
                    toast.info(
                      nextSelected
                        ? `Display #${d.id} assigned for presentation`
                        : `Display #${d.id} removed from presentation`,
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
            checked={Boolean(isFullscreenActive)}
            onChange={async (e) => {
              const next = e.target.checked;
              if (setFullscreenActive) setFullscreenActive(next);
              if (window.api && window.api.setPresentationFullscreen) {
                const res = await window.api.setPresentationFullscreen(next);
                if (res && res.windows > 0) {
                  toast.success(
                    next
                      ? "Fullscreen on for projection windows"
                      : "Fullscreen off",
                  );
                } else if (res && res.error) {
                  if (setFullscreenActive) setFullscreenActive(!next);
                  toast.error(`Fullscreen error: ${res.error}`);
                } else {
                  toast.success(
                    next
                      ? "Fullscreen mode enabled"
                      : "Fullscreen mode disabled",
                  );
                }
              } else {
                toast.success(
                  next ? "Fullscreen mode enabled" : "Fullscreen mode disabled",
                );
              }
            }}
            className="accent-accent w-4 h-4 cursor-pointer"
          />
        </div>

        {/* Dedicated Stage Display / Confidence Monitor Card */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border ${cardClass}`}
        >
          <div>
            <div
              className={`font-bold text-xs flex items-center gap-1.5 ${textTitle}`}
            >
              <FaTv className="text-accent" /> Stage Display / Confidence
              Monitor Output
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ml-1.5 ${
                  isStageActive
                    ? "bg-amber-500/20 text-[#D4A94A] border border-amber-500/30 font-bold"
                    : isLight
                      ? "bg-[#E5E7EB] text-[#6B7280]"
                      : "bg-[#24262B] text-[#9B9CA3]"
                }`}
              >
                {isStageActive ? "Active ON" : "Inactive OFF"}
              </span>
            </div>
            <div className={`text-[11px] mt-0.5 ${textSub}`}>
              Opens a dedicated output window for singers, choir, and pastors on
              stage with a Live Clock and Next Slide Preview.
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              if (window.api && window.api.toggleStageWindow) {
                const res = await window.api.toggleStageWindow();
                if (res && res.active !== undefined) {
                  setIsStageActive(res.active);
                  if (res.active) {
                    toast.success("Stage Display Turned ON");
                  } else {
                    toast.info("Stage Display Turned OFF");
                  }
                }
              } else {
                window.open("?window=stage", "_blank", "width=1024,height=600");
                toast.info("Opened Stage Display window preview");
              }
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition cursor-pointer shrink-0 self-start sm:self-auto border ${
              isStageActive
                ? "bg-amber-500/20 text-[#D4A94A] border-amber-500/50 hover:bg-amber-500/30"
                : "bg-[#24262B] border-[#2A2C31] text-accent hover:bg-[#2A2C31]"
            }`}
          >
            {isStageActive ? "Turn OFF Stage Display" : "Turn ON Stage Display"}
          </button>
        </div>
      </div>
    </div>
  );
}
