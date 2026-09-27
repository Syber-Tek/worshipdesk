import React from "react";
import { FaDatabase, FaFloppyDisk } from "react-icons/fa6";
import { toast } from "sonner";

export default function ContentSettings({
  dbStatus,
  cardClass,
  selectClass,
  textTitle,
  textSub,
  borderDivider,
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-bold text-accent flex items-center gap-2">
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
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-success/20 text-success">
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
              className="px-3 py-1.5 bg-accent hover:bg-accent/90 text-bg font-bold rounded text-xs transition shadow cursor-pointer"
            >
              Select JSON File
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-bold text-accent flex items-center gap-2">
            <FaFloppyDisk /> Backup & Data Export
          </h3>
          <p className={`text-xs mt-1 ${textSub}`}>
            Export service playlists, back up the offline SQLite database, and
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
              onClick={async () => {
                if (window.api && window.api.backupDatabase) {
                  try {
                    const res = await window.api.backupDatabase();
                    if (res && res.success) {
                      toast.success(`Backup saved to ${res.message}`);
                    } else if (
                      res &&
                      res.message &&
                      res.message !== "Cancelled"
                    ) {
                      toast.error(`Backup failed: ${res.message}`);
                    }
                  } catch {
                    toast.error("Backup failed");
                  }
                }
              }}
              className="px-3 py-1.5 border text-xs font-semibold rounded transition cursor-pointer bg-transparent hover:bg-accent/10 text-accent border-accent/40"
            >
              Export Database Backup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
