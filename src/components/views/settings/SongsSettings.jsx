import React, { useState, useEffect } from "react";
import { FaMusic } from "react-icons/fa6";

export default function SongsSettings({
  defaultHymnCategory = "All",
  setDefaultHymnCategory,
  showHymnNumbers = true,
  setShowHymnNumbers,
  hymnTextScale = "normal",
  setHymnTextScale,
  cardClass,
  selectClass,
  textTitle,
  textSub,
  borderDivider,
}) {
  const [hymnsCount, setHymnsCount] = useState(0);

  useEffect(() => {
    if (window.api && window.api.getHymnsCount) {
      window.api.getHymnsCount().then((count) => {
        setHymnsCount(count || 0);
      });
    }
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-bold text-accent flex items-center gap-2">
          <FaMusic /> Songs & Hymn Preferences
        </h3>
        <p className={`text-xs mt-1 ${textSub}`}>
          Default hymnal category, lyric formatting, and offline hymn library
          management.
        </p>
      </div>

      <div className={`space-y-4 pt-2 border-t ${borderDivider}`}>
        {/* Default Hymn Category */}
        <div
          className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}
        >
          <div>
            <div className={`font-semibold text-xs ${textTitle}`}>
              Default Hymnal Category
            </div>
            <div className={`text-[11px] ${textSub}`}>
              Pre-selected category when the Songs & Hymns tab opens
            </div>
          </div>
          <select
            value={defaultHymnCategory || "All"}
            onChange={(e) =>
              setDefaultHymnCategory && setDefaultHymnCategory(e.target.value)
            }
            className={`text-xs rounded px-2.5 py-1 outline-none border ${selectClass}`}
          >
            {[
              "All",
              "Presby Hymns (Twi)",
              "Presby Hymns (Eng)",
              "Methodist Hymns (Twi)",
              "Methodist Hymns (Eng)",
              "Presby Liturgy",
              "Methodist Liturgy",
            ].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Show Hymn Numbers on Output */}
        <div
          className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}
        >
          <div>
            <div className={`font-semibold text-xs ${textTitle}`}>
              Show Hymn Numbers
            </div>
            <div className={`text-[11px] ${textSub}`}>
              Display "PH 12" / "MH 88" labels on projected hymn slides
            </div>
          </div>
          <input
            type="checkbox"
            checked={showHymnNumbers}
            onChange={(e) =>
              setShowHymnNumbers && setShowHymnNumbers(e.target.checked)
            }
            className="accent-accent w-4 h-4 cursor-pointer"
          />
        </div>

        {/* Hymn Lyric Text Scale */}
        <div
          className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}
        >
          <div>
            <div className={`font-semibold text-xs ${textTitle}`}>
              Projector Hymn Text Scale
            </div>
            <div className={`text-[11px] ${textSub}`}>
              Font size for hymn lyrics & stanzas on the live output
            </div>
          </div>
          <select
            value={hymnTextScale || "normal"}
            onChange={(e) =>
              setHymnTextScale && setHymnTextScale(e.target.value)
            }
            className={`text-xs rounded px-2.5 py-1 outline-none border ${selectClass}`}
          >
            <option value="small">Small</option>
            <option value="normal">Standard</option>
            <option value="large">Large</option>
            <option value="xlarge">Extra Large</option>
            <option value="xxlarge">XX-Large</option>
          </select>
        </div>

        {/* Hymn Library / Import */}
        <div className={`p-4 rounded border space-y-3 ${cardClass}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className={`font-semibold text-xs ${textTitle}`}>
                Installed Hymn Library
              </div>
              <div className={`text-[11px] ${textSub}`}>
                Offline Presby/Methodist hymnal content available to the
                playlist & playback
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-accent/20 text-accent font-bold">
              {hymnsCount > 0 ? `${hymnsCount} hymns loaded` : "Loading…"}
            </span>
          </div>

          <div className={`rounded border p-3.5 ${cardClass}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`font-semibold text-xs ${textTitle}`}>
                  Import Hymns JSON Batch
                </div>
                <div className={`text-[11px] ${textSub}`}>
                  Select a church-presenter JSON collection to merge into the
                  offline hymnal library
                </div>
              </div>
              <button
                onClick={async () => {
                  if (window.api && window.api.importSongsDialog) {
                    const res = await window.api.importSongsDialog();
                    if (res && res.success) {
                      alert(`Imported ${res.count} hymns!`);
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
      </div>
    </div>
  );
}
