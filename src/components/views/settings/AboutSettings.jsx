import React from "react";
import { FaCircleInfo } from "react-icons/fa6";

export default function AboutSettings({
  cardClass,
  textTitle,
  textSub,
  borderDivider,
}) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h3 className="text-sm font-bold text-[#D4A94A] flex items-center gap-2">
          <FaCircleInfo /> About App
        </h3>
        <p className={`text-xs mt-1 ${textSub}`}>
          WorshipDesk — offline-first church presentation, version info, and release notes.
        </p>
      </div>

      <div className={`space-y-4 pt-2 border-t ${borderDivider}`}>
        <div className={`p-4 rounded border ${cardClass} space-y-3`}>
          <div className="flex items-center gap-3">
            <span className="bg-[#0D3822] text-[#34D399] border border-[#10B981]/30 rounded-full px-3 py-1 font-semibold text-xs">
              WorshipDesk v1.0.0
            </span>
            <span className={`text-xs ${textSub}`}>September 18, 2026</span>
          </div>

          <div className="space-y-3">
            <h2 className={`text-sm font-bold ${textTitle}`}>
              Welcome to WorshipDesk 1.0
            </h2>
            <p className={`text-xs ${textSub} leading-relaxed max-w-2xl`}>
              WorshipDesk 1.0 is an offline-first church presentation app, built
              with a focus on reliability, speed, and a smoother overall
              experience. From launching scriptures to projecting hymns,
              everything should feel more snappy and refined across the board.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <h2 className={`text-sm font-bold ${textTitle}`}>
              A few standout improvements
            </h2>

            <ul
              className={`space-y-3 text-xs ${textSub} list-disc list-inside leading-relaxed pl-1 max-w-2xl`}
            >
              <li>
                <span className={`font-semibold ${textTitle}`}>
                  Scripture lookup is quicker to respond
                </span>
                , with indexed local SQLite database search across NIV, KJV,
                NKJV, and Twi translations.
              </li>
              <li>
                <span className={`font-semibold ${textTitle}`}>
                  In longer services, WorshipDesk does a better job maintaining
                  context
                </span>
                , rendering Methodist and Presbyterian hymnals with zero lag.
              </li>
              <li>
                <span className={`font-semibold ${textTitle}`}>
                  Multi-monitor projector output has been significantly
                  improved
                </span>
                . Dual-window IPC canvas rendering delivers smooth projections for
                secondary displays, TVs, and OBS/vMix live streams.
              </li>
              <li>
                <span className={`font-semibold ${textTitle}`}>
                  100% Offline Resilience
                </span>
                . All scriptures, hymnals, fonts, and logic run locally on
                Windows without requiring active internet connectivity.
              </li>
            </ul>
          </div>

          <div className="pt-4 text-center border-t border-current/10">
            <p className={`text-xs ${textSub}`}>
              © 2026 WorshipDesk. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
