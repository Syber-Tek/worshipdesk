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

// Steps a stored value by `delta` and clamps at both ends, so the keyboard
// shortcut and the slider can never disagree about where the ends are.
export const stepScale = (value, delta, options = FONT_SCALES) =>
  options[
    Math.min(options.length - 1, Math.max(0, scaleToIndex(value, options) + delta))
  ];