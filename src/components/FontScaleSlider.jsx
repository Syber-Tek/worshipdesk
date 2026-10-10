import React from "react";
import {
  FONT_SCALES,
  FONT_SCALE_LABELS,
  scaleToIndex,
  indexToScale,
  scaleToContinuous,
  getFontScaleLabel,
} from "../lib/fontScale.js";

// Short ticks under the track, sized so they still fit the 230px control rail.
const TICKS = ["S", "M", "L", "XL", "XXL"];

// One control for every "how big should the text be" setting in the app, so the
// settings pages and the quick rail slider can never drift apart.
export default function FontScaleSlider({
  value,
  onChange,
  id,
  label,
  hint,
  // The projector/hymn scales are the 5-point one; the control UI scale has only
  // three steps, so the caller supplies its own list.
  options = FONT_SCALES,
  labels = FONT_SCALE_LABELS,
  ticks = TICKS,
  showTicks = true,
  continuous = true,
  className = "",
  labelClassName = "",
  hintClassName = "",
  valueClassName = "text-xs",
}) {
  const isContinuous = continuous && options === FONT_SCALES;

  const continuousPos = isContinuous ? scaleToContinuous(value) : null;
  const index = isContinuous ? Math.round(continuousPos) : scaleToIndex(value, options);
  const currentLabel = isContinuous
    ? getFontScaleLabel(value)
    : (labels[value] ?? labels[options[index]]);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`flex items-center justify-between gap-3 font-semibold text-xs ${labelClassName}`}
        >
          <span>{label}</span>
          <span className={`font-bold ${valueClassName}`}>{currentLabel}</span>
        </label>
      )}
      {hint && (
        <div className={`text-[11px] leading-snug ${hintClassName}`}>{hint}</div>
      )}
      <input
        id={id}
        type="range"
        min={0}
        max={options.length - 1}
        step={isContinuous ? 0.02 : 1}
        value={isContinuous ? continuousPos : index}
        aria-label={label ? undefined : "Text size"}
        aria-valuetext={currentLabel}
        onChange={(e) => {
          if (!onChange) return;
          const val = Number(e.target.value);
          if (isContinuous) {
            onChange(Number(val.toFixed(2)));
          } else {
            onChange(indexToScale(val, options));
          }
        }}
        className="w-full accent-accent cursor-pointer"
      />
      {showTicks && (
        <div
          aria-hidden="true"
          className="flex justify-between text-[9px] font-bold uppercase tracking-wide opacity-50 px-0.5"
        >
          {ticks.map((tick, i) => (
            <span
              key={tick}
              className={
                i === index ? "opacity-100 text-accent font-extrabold" : undefined
              }
            >
              {tick}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}