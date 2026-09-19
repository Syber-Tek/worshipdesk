import React, { useState, useEffect } from "react";
import { FaBookOpen, FaDatabase } from "react-icons/fa6";

export default function BibleSettings({
  selectedTranslation,
  setSelectedTranslation,
  biblesList,
  refreshBibles,
  showVerseQuotes = true,
  setShowVerseQuotes,
  cardClass,
  selectClass,
  textTitle,
  textSub,
  borderDivider,
}) {
  const [bibleStats, setBibleStats] = useState([]);
  const [libraryNotice, setLibraryNotice] = useState("");

  useEffect(() => {
    if (window.api && window.api.getBibleStats) {
      window.api.getBibleStats().then((stats) => {
        setBibleStats(Array.isArray(stats) ? stats : []);
      });
    }
  }, []);

  const refreshLibrary = async () => {
    setLibraryNotice("");
    if (window.api && window.api.getBibleStats) {
      const stats = await window.api.getBibleStats();
      setBibleStats(Array.isArray(stats) ? stats : []);
    }
    if (refreshBibles) refreshBibles();
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-bold text-accent flex items-center gap-2">
          <FaBookOpen /> Bible & Scripture Preferences
        </h3>
        <p className={`text-xs mt-1 ${textSub}`}>
          Default translations, text formatting, and offline scripture
          databases.
        </p>
      </div>

      <div className={`space-y-4 pt-2 border-t ${borderDivider}`}>
        <div
          className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}
        >
          <div>
            <div className={`font-semibold text-xs ${textTitle}`}>
              Default Bible Translation
            </div>
            <div className={`text-[11px] ${textSub}`}>
              Default version loaded on app launch
            </div>
          </div>
          <select
            value={selectedTranslation}
            onChange={(e) =>
              setSelectedTranslation && setSelectedTranslation(e.target.value)
            }
            className={`text-xs rounded px-2.5 py-1 outline-none border ${selectClass}`}
          >
            {(biblesList && biblesList.length > 0
              ? biblesList
              : [
                  { code: "NIV", name: "New International Version (NIV)" },
                  { code: "NKJV", name: "New King James Version (NKJV)" },
                  { code: "KJV", name: "King James Version (KJV)" },
                  { code: "TWI", name: "Twerɛ Kronkron (Twi Bible - BSG)" },
                ]
            ).map((b) => (
              <option key={b.code} value={b.code}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Import Bible SQL File */}
        <div
          className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}
        >
          <div>
            <div className={`font-semibold text-xs ${textTitle}`}>
              Import Bible SQL File (.sql)
            </div>
            <div className={`text-[11px] ${textSub}`}>
              Import NKJV.sql, NIV.sql, or KJV.sql database dumps
            </div>
          </div>
          <button
            onClick={async () => {
              if (window.api && window.api.importBibleSql) {
                const res = await window.api.importBibleSql();
                if (res && res.success) {
                  alert(`Successfully imported ${res.fileName} into SQLite!`);
                } else if (res && res.message && res.message !== "Cancelled") {
                  alert(`Import error: ${res.message}`);
                }
              }
            }}
            className="px-3 py-1.5 bg-accent hover:bg-accent/90 text-bg font-bold rounded text-xs transition shadow cursor-pointer"
          >
            Select SQL File
          </button>
        </div>

        {/* Import Bible XML File */}
        <div
          className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}
        >
          <div>
            <div className={`font-semibold text-xs ${textTitle}`}>
              Import Bible XML File (.xml)
            </div>
            <div className={`text-[11px] ${textSub}`}>
              Add a Twi/structured Bible from a .xml file (Zefania/OSIS format
              supported)
            </div>
          </div>
          <button
            onClick={async () => {
              if (window.api && window.api.importBibleXml) {
                const res = await window.api.importBibleXml();
                if (res && res.success && res.results) {
                  const ok = res.results.filter((r) => r.success);
                  const fail = res.results.filter(
                    (r) => !r.success && r.message && r.message !== "Cancelled",
                  );
                  if (ok.length > 0) {
                    setLibraryNotice(
                      `${ok.length} file(s) imported successfully.`,
                    );
                  } else if (fail.length > 0) {
                    setLibraryNotice(`Import error: ${fail[0].message}`);
                  }
                  await refreshLibrary();
                } else if (res && res.message && res.message !== "Cancelled") {
                  setLibraryNotice(`Import error: ${res.message}`);
                }
              }
            }}
            className="px-3 py-1.5 bg-accent hover:bg-accent/90 text-bg font-bold rounded text-xs transition shadow cursor-pointer"
          >
            Select XML File
          </button>
        </div>

        {/* Auto-Scan Folder Info */}
        <div className={`p-4 rounded border space-y-2 ${cardClass}`}>
          <div className="font-semibold text-xs text-accent flex items-center gap-1.5">
            📁 Auto-Scan Bibles Folder Info
          </div>
          <p className={`text-[11px] leading-relaxed ${textSub}`}>
            Drop{" "}
            <code className="font-mono text-accent bg-black/20 px-1 py-0.5 rounded">
              NKJV.sql
            </code>
            ,{" "}
            <code className="font-mono text-accent bg-black/20 px-1 py-0.5 rounded">
              NIV.sql
            </code>
            , or{" "}
            <code className="font-mono text-accent bg-black/20 px-1 py-0.5 rounded">
              KJV.sql
            </code>{" "}
            into{" "}
            <code className="font-mono text-accent bg-black/20 px-1 py-0.5 rounded">
              bibles/
            </code>
            , or any Bible{" "}
            <code className="font-mono text-accent bg-black/20 px-1 py-0.5 rounded">
              .xml
            </code>{" "}
            file into{" "}
            <code className="font-mono text-accent bg-black/20 px-1 py-0.5 rounded">
              bibles/xml/
            </code>
            . The app auto-scans and imports them on startup — the bundled
            English (NIV/NKJV/KJV) and Twi (Twerɛ Kronkron) XML Bibles already
            live in{" "}
            <code className="font-mono text-accent bg-black/20 px-1 py-0.5 rounded">
              bibles/xml/
            </code>
            .
          </p>
        </div>

        {/* Installed Bible Library */}
        <div className={`p-4 rounded border space-y-3 ${cardClass}`}>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-xs text-accent flex items-center gap-1.5">
                <FaDatabase /> Installed Bible Library
              </div>
              <p className={`text-[11px] mt-0.5 ${textSub}`}>
                Translations available to the Navigator and search.
              </p>
            </div>
            <button
              onClick={async () => {
                if (window.api && window.api.rescanBibles) {
                  const res = await window.api.rescanBibles();
                  setLibraryNotice(
                    res && res.success
                      ? "Re-scan complete."
                      : `Re-scan error: ${res && res.error}`,
                  );
                  await refreshLibrary();
                }
              }}
              className="px-2.5 py-1.5 rounded text-[11px] font-semibold border transition cursor-pointer bg-transparent hover:bg-accent/10 text-accent border-accent/40"
            >
              Re-scan Bibles Folder
            </button>
          </div>

          {libraryNotice && (
            <p className="text-[11px] text-success">{libraryNotice}</p>
          )}

          <div className="space-y-2">
            {bibleStats.length === 0 && (
              <p className={`text-[11px] ${textSub}`}>
                No imported Bibles found yet.
              </p>
            )}
            {bibleStats.map((b) => {
              const isProtected =
                ["NIV", "NKJV", "KJV", "TWI"].indexOf(
                  String(b.code || "").toUpperCase(),
                ) !== -1;
              const isActive = selectedTranslation === b.code;
              return (
                <div
                  key={b.id}
                  className={`flex items-center justify-between gap-3 p-3 rounded border ${
                    isActive ? "border-accent bg-accent/5" : ""
                  } ${cardClass}`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold text-xs truncate ${textTitle}`}
                      >
                        {b.name}
                      </span>
                      {isActive && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-bg font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div className={`text-[11px] mt-0.5 ${textSub}`}>
                      {b.code} · {b.language} · {b.bookCount} books ·{" "}
                      {b.verseCount ? b.verseCount.toLocaleString() : 0} verses
                      {b.sourceFile ? ` · ${b.sourceFile}` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!isActive && (
                      <button
                        onClick={() =>
                          setSelectedTranslation &&
                          setSelectedTranslation(b.code)
                        }
                        className="px-2.5 py-1.5 rounded text-[11px] font-semibold border transition cursor-pointer bg-transparent hover:bg-accent/10 text-accent border-accent/40"
                      >
                        Set as Active
                      </button>
                    )}
                    {!isProtected && (
                      <button
                        onClick={async () => {
                          if (window.api && window.api.removeBible) {
                            const res = await window.api.removeBible(b.id);
                            if (res && res.success) {
                              setLibraryNotice(`${b.code} removed.`);
                              await refreshLibrary();
                              if (
                                selectedTranslation === b.code &&
                                biblesList &&
                                biblesList.length > 0
                              ) {
                                setSelectedTranslation(biblesList[0].code);
                              }
                            } else {
                              setLibraryNotice(
                                `Delete error: ${res && res.error}`,
                              );
                            }
                          }
                        }}
                        className="px-2.5 py-1.5 rounded text-[11px] font-semibold border transition cursor-pointer bg-transparent hover:bg-live hover:text-white text-live border-live/40"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}
        >
          <div>
            <div className={`font-semibold text-xs ${textTitle}`}>
              Verse Quotation Marks
            </div>
            <div className={`text-[11px] ${textSub}`}>
              Enclose projected verse in quotes
            </div>
          </div>
          <input
            type="checkbox"
            checked={showVerseQuotes}
            onChange={(e) =>
              setShowVerseQuotes && setShowVerseQuotes(e.target.checked)
            }
            className="accent-accent w-4 h-4 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
