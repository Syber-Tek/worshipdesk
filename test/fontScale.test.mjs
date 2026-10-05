// Self-check for the font scale mapping.
//   node test/fontScale.test.mjs
//
// The failure this guards: the settings sliders, the quick rail slider and the
// Ctrl+[ / Ctrl+] shortcut all step the same stored value, and
// PresentationOutputWindow has a size table keyed by those names. If the mapping
// or the clamping drifts, the operator drags the slider and the projector goes
// the wrong way, or a stale stored value silently renders as undefined.

import assert from 'node:assert/strict';
import {
  FONT_SCALES,
  FONT_SCALE_LABELS,
  UI_SCALES,
  scaleToIndex,
  indexToScale,
  stepScale,
} from '../src/lib/fontScale.js';

// The names are persisted in localStorage and hard-coded in the projector size
// table, so they are stored data: renaming one resets everyone's setting.
assert.deepEqual(FONT_SCALES, ['small', 'normal', 'large', 'xlarge', 'xxlarge']);

// Every persisted name maps to a real slider position and back.
for (const [i, name] of FONT_SCALES.entries()) {
  assert.equal(scaleToIndex(name), i);
  assert.equal(indexToScale(i), name);
}

// Every position has a label, so the slider never shows a blank current value.
for (const name of FONT_SCALES) {
  assert.ok(FONT_SCALE_LABELS[name], `missing label for ${name}`);
}

// An unknown or missing stored value lands on Standard, never off the end.
for (const bad of ['enormous', '', undefined, null, 0, 'LARGE']) {
  assert.equal(scaleToIndex(bad), 1, `expected ${String(bad)} to fall back to normal`);
  assert.equal(indexToScale(scaleToIndex(bad)), 'normal');
}

// Out-of-range positions fall back too, rather than returning undefined.
assert.equal(indexToScale(-1), 'normal');
assert.equal(indexToScale(FONT_SCALES.length), 'normal');
assert.equal(indexToScale(99), 'normal');

// Stepping walks the list one notch at a time.
assert.equal(stepScale('small', 1), 'normal');
assert.equal(stepScale('normal', 1), 'large');
assert.equal(stepScale('normal', -1), 'small');
assert.equal(stepScale('large', 1), 'xlarge');
assert.equal(stepScale('xlarge', -1), 'large');
assert.equal(stepScale('small', 3), 'xlarge');

// ...and clamps at both ends, so holding the shortcut key is harmless.
assert.equal(stepScale('small', -1), 'small');
assert.equal(stepScale('small', -99), 'small');
assert.equal(stepScale('xxlarge', 1), 'xxlarge');
assert.equal(stepScale('xxlarge', 99), 'xxlarge');

// Stepping from a bad value starts from Standard and can reach either end.
assert.equal(stepScale('garbage', 1), 'large');
assert.equal(stepScale('garbage', -1), 'small');

// The control UI scale is a shorter, separate list, so passing it explicitly
// must not leak the 5-point defaults into it.
assert.deepEqual(UI_SCALES, ['compact', 'normal', 'large']);
assert.equal(scaleToIndex('compact', UI_SCALES), 0);
assert.equal(indexToScale(0, UI_SCALES), 'compact');
assert.equal(stepScale('compact', -1, UI_SCALES), 'compact');
assert.equal(stepScale('large', 1, UI_SCALES), 'large');
assert.equal(stepScale('normal', 1, UI_SCALES), 'large');

console.log('fontScale: all assertions passed');