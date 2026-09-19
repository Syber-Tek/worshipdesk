import React from "react";
import { FaFloppyDisk } from "react-icons/fa6";
import { toast } from "sonner";

export default function BackupSettings({
  cardClass,
  textTitle,
  textSub,
  borderDivider,
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-bold text-accent flex items-center gap-2">
          <FaFloppyDisk /> Backup & Data Export
        </h3>
        <p className={`text-xs mt-1 ${textSub}`}>
          Export service playlists, backup offline SQLite databases, and restore
          content.
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
  );
}
