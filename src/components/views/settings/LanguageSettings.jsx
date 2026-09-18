import React from "react";
import { FaLanguage } from "react-icons/fa6";

export default function LanguageSettings({
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
          <FaLanguage /> Languages & Translations
        </h3>
        <p className={`text-xs mt-1 ${textSub}`}>
          Interface locale and Ghanaian local language scripture support.
        </p>
      </div>

      <div className={`space-y-4 pt-2 border-t ${borderDivider}`}>
        <div
          className={`flex items-center justify-between p-3.5 rounded border ${cardClass}`}
        >
          <div>
            <div className={`font-semibold text-xs ${textTitle}`}>
              Primary Interface Language
            </div>
            <div className={`text-[11px] ${textSub}`}>
              Control window locale
            </div>
          </div>
          <select
            className={`text-xs rounded px-2.5 py-1 outline-none border ${selectClass}`}
          >
            <option value="en-GH">English (Ghana)</option>
            <option value="twi">Twi / Asante</option>
            <option value="fante">Fante</option>
            <option value="ga">Ga</option>
            <option value="ewe">Ewe</option>
          </select>
        </div>
      </div>
    </div>
  );
}
