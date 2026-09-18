import React from "react";
import { FaSliders } from "react-icons/fa6";

export default function GeneralSettings({
  startupTab = "home",
  setStartupTab,
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
          <FaSliders /> General System Preferences
        </h3>
        <p className={`text-xs mt-1 ${textSub}`}>
          Configure core application startup behaviors and automated workflows.
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
            className={`text-xs font-mono ${
              isLight ? "text-[#9CA3AF]" : "text-[#6B6C73]"
            }`}
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
            <div className={`text-[11px] ${textSub}`}>Choose view on launch</div>
          </div>
          <select
            className={`text-xs rounded px-2.5 py-1 outline-none border ${selectClass}`}
            value={startupTab || "home"}
            onChange={(e) => setStartupTab && setStartupTab(e.target.value)}
          >
            <option value="home">Dashboard Home (Default)</option>
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
  );
}
