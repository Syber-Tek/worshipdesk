import React from "react";
import { FaDatabase } from "react-icons/fa6";

export default function ContentSettings({
  dbStatus,
  cardClass,
  selectClass,
  textTitle,
  textSub,
  borderDivider,
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-bold text-[#D4A94A] flex items-center gap-2">
          <FaDatabase /> Local Storage & Data Imports
        </h3>
        <p className={`text-xs mt-1 ${textSub}`}>
          SQLite database status, WAL mode logs, and native batch JSON importers.
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
            className={`text-xs font-mono break-all p-2.5 rounded border ${cardClass}`}
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
                  alert(`Successfully imported ${res.count} hymns!`);
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
  );
}
