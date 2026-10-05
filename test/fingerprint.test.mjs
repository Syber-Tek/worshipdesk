// Self-check for the library fingerprint.
//   node test/fingerprint.test.mjs
//
// The failure this guards: an app update rewrites app.asar, Electron reports the
// archive's mtime for every file inside it, and a fingerprint that included that
// mtime made every update look like "all 10 Bibles and ~2,400 hymns changed".
// The cost was a full re-import on the first launch after each update -11s
// measured, and far worse on the old church laptops this app has to survive.
// The user's own drop-in folder must keep its mtime, or a newly added .sng
// would never be picked up.

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fingerprintFiles } from '../src/lib/fingerprint.js';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wd-fingerprint-'));
const file = path.join(dir, 'EnglishKJBible.xml');
fs.writeFileSync(file, 'not really a bible');

const EXTS = ['.sql', '.xml'];

// The bundled case: same name, same size, brand new mtime (a fresh app.asar).
// Name + size only, so an update that ships identical content is a no-op.
const bundledBefore = fingerprintFiles([dir], EXTS, false);
fs.utimesSync(file, new Date(2030, 0, 1), new Date(2030, 0, 1));
const bundledAfter = fingerprintFiles([dir], EXTS, false);
assert.equal(
  bundledAfter,
  bundledBefore,
  'bundled fingerprint must ignore mtime, or every app update re-imports everything'
);

// The user's folder must still notice a touched file, so a dropped-in hymn or a
// replaced Bible is picked up on the next launch.
const touch = (when) => fs.utimesSync(file, when, when);
touch(new Date(2031, 0, 1));
const userBefore = fingerprintFiles([dir], EXTS, true);
touch(new Date(2032, 0, 1));
assert.notEqual(
  fingerprintFiles([dir], EXTS, true),
  userBefore,
  'user fingerprint must include mtime, or new drop-in files are never imported'
);

// Size still matters in the bundled case: a version that ships a different
// Bible file does have to re-import.
fs.writeFileSync(file, 'a different, longer bible');
assert.notEqual(fingerprintFiles([dir], EXTS, false), bundledBefore);

// Other extensions and missing files are ignored / reported, not silently equal.
fs.writeFileSync(path.join(dir, 'notes.txt'), 'ignore me');
assert.equal(fingerprintFiles([dir], EXTS, false), fingerprintFiles([dir], EXTS, false));
assert.ok(!fingerprintFiles([dir], EXTS, false).includes('notes.txt'));
assert.equal(fingerprintFiles([path.join(dir, 'gone')], EXTS, false), '');

fs.rmSync(dir, { recursive: true, force: true });

console.log('fingerprint: all assertions passed');