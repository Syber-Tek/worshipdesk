// Font-size scale names and the slider <-> value mapping.
//
// Plain JS, no JSX, so both the React controls and test/fontScale.test.mjs can
// use it. The scale names themselves are persisted in localStorage and are read
// by the size maps in PresentationOutputWindow, so they are part of the app's
// stored data: renaming one silently resets everyone's setting.

export const FONT_SCALES = ["small", "normal", "large", "xlarge", "xxlarge"];

export const FONT_SCALE_LABELS = {
  small: "Small",
  normal: "Standard",
  large: "Large",
  xlarge: "Extra Large",
  xxlarge: "XX-Large",
};

// The control window's own density scale is a shorter, separate list.
export const UI_SCALES = ["compact", "normal", "large"];

export const UI_SCALE_LABELS = {
  compact: "Compact",
  normal: "Standard",
  large: "Large",
};

// Position on the slider for a stored value. Anything unrecognised (a stale or
// hand-edited localStorage entry) lands on Standard rather than off the end.
export const scaleToIndex = (value, options = FONT_SCALES) => {
  const index = options.indexOf(value);
  return index === -1 ? Math.max(0, options.indexOf("normal")) : index;
};

export const indexToScale = (index, options = FONT_SCALES) =>
  options[index] ?? options[Math.max(0, options.indexOf("normal"))];

// Continuous scale position: maps 0 (Small) to 4 (XX-Large) with 1 (Standard).
export const scaleToContinuous = (value) => {
  if (typeof value === "number" && !isNaN(value)) {
    return Math.min(4, Math.max(0, value));
  }
  if (typeof value === "string") {
    const num = parseFloat(value);
    if (!isNaN(num) && String(num) === value.trim()) {
      return Math.min(4, Math.max(0, num));
    }
    const idx = FONT_SCALES.indexOf(value);
    if (idx !== -1) return idx;
  }
  return 1;
};

// Maps continuous slider position [0..4] to a relative font size multiplier.
// 0: Small (0.75x)
// 1: Standard (1.00x)
// 2: Large (1.25x)
// 3: Extra Large (1.50x)
// 4: XX-Large (2.00x)
export const continuousToMultiplier = (pos) => {
  const p = Math.min(4, Math.max(0, Number(pos) || 0));
  if (p <= 1) {
    return 0.75 + p * 0.25;
  } else if (p <= 2) {
    return 1.00 + (p - 1) * 0.25;
  } else if (p <= 3) {
    return 1.25 + (p - 2) * 0.25;
  } else {
    return 1.50 + (p - 3) * 0.50;
  }
};

export const getFontScaleMultiplier = (value) => {
  return continuousToMultiplier(scaleToContinuous(value));
};

export const getFontScaleLabel = (value) => {
  const pos = scaleToContinuous(value);
  const mult = continuousToMultiplier(pos);
  const pct = Math.round(mult * 100);

  if (Math.abs(pos - 0) < 0.03) return `Small (${pct}%)`;
  if (Math.abs(pos - 1) < 0.03) return `Standard (${pct}%)`;
  if (Math.abs(pos - 2) < 0.03) return `Large (${pct}%)`;
  if (Math.abs(pos - 3) < 0.03) return `Extra Large (${pct}%)`;
  if (Math.abs(pos - 4) < 0.03) return `XX-Large (${pct}%)`;

  return `${pct}%`;
};

// Steps a stored value by `delta` and clamps at both ends, so the keyboard
// shortcut and the slider can never disagree about where the ends are.
export const stepScale = (value, delta, options = FONT_SCALES) => {
  if (options === FONT_SCALES) {
    if (typeof value === "number") {
      return Math.min(4, Math.max(0, +(value + delta * 0.2).toFixed(2)));
    }
    if (typeof value === "string" && !options.includes(value)) {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        return Math.min(4, Math.max(0, +(num + delta * 0.2).toFixed(2)));
      }
    }
  }
  return options[
    Math.min(options.length - 1, Math.max(0, scaleToIndex(value, options) + delta))
  ];
};