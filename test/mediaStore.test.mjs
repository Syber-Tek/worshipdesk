// Self-check for media store path handling.
//   node test/mediaStore.test.mjs
// Two failure modes this guards: a stored name that escapes the media folder
// (untrusted, it comes back from the renderer) and a name collision that
// overwrites a media file the church still needs.

import assert from 'node:assert/strict';
import { safeStoredName, safeBaseName, uniqueStoredName, storedNameFor, toFileUrl } from '../src/lib/mediaStore.js';

// Traversal and absolute paths are rejected outright.
assert.equal(safeStoredName('../../etc/passwd'), null);
assert.equal(safeStoredName('..\\..\\windows\\system32'), null);
assert.equal(safeStoredName('dir/file.png'), null);
assert.equal(safeStoredName('dir\\file.png'), null);
assert.equal(safeStoredName('C:\\absolute.png'), null);
assert.equal(safeStoredName('..'), null);
assert.equal(safeStoredName('.'), null);
assert.equal(safeStoredName(''), null);
assert.equal(safeStoredName('   '), null);
assert.equal(safeStoredName(null), null);
assert.equal(safeStoredName(42), null);
assert.equal(safeStoredName('a\0b.png'), null, 'null byte is a truncation trick');
assert.equal(safeStoredName('bad:name?.png'), null, 'Windows-reserved characters');
assert.equal(safeStoredName('sermon.png'), 'sermon.png', 'a normal name passes');
assert.equal(safeStoredName('  sermon.png  '), 'sermon.png', 'trimmed');

// Base names keep the readable characters and drop the rest.
assert.equal(safeBaseName('Sermon Note 1.png'), 'Sermon Note 1');
assert.equal(safeBaseName('a/b\\c:d*e?f.png'), 'abcdef');
assert.equal(safeBaseName(''), 'media', 'never empty, or the file is just ".mp4"');
assert.equal(safeBaseName('***.png'), 'media');

// Collisions get a numeric suffix rather than overwriting.
const none = () => false;
assert.equal(uniqueStoredName('a', '.png', none), 'a.png');
assert.equal(uniqueStoredName('a', 'png', none), 'a.png', 'extension may omit the dot');
const takenA = new Set(['a.png']);
assert.equal(uniqueStoredName('a', '.png', (n) => takenA.has(n)), 'a-1.png');
const takenTwo = new Set(['a.png', 'a-1.png']);
assert.equal(uniqueStoredName('a', '.png', (n) => takenTwo.has(n)), 'a-2.png');

assert.equal(storedNameFor('Sermon 1.png', none), 'Sermon 1.png');
assert.equal(storedNameFor('a/b/Sermon.mp4', none), 'Sermon.mp4', 'directories are not part of the name');
assert.equal(storedNameFor('clip.MP4', none), 'clip.mp4', 'extension is lowercased by extOf');
assert.equal(storedNameFor('noext', none), 'noext');

// A name built from a path can never reintroduce a separator.
const derived = storedNameFor('../../../escape.png', none);
assert.equal(safeStoredName(derived), derived, 'derived name is still a safe filename');
assert.ok(!derived.includes('/') && !derived.includes('..'), 'no traversal survives');

// file:// URLs.
assert.equal(toFileUrl('C:\\Users\\K\\media\\a.png', '\\'), 'file:///C:/Users/K/media/a.png');
assert.equal(toFileUrl('/home/k/media/a.png', '/'), 'file:///home/k/media/a.png');
assert.ok(toFileUrl('C:\\x\\a.png', '\\').startsWith('file:///C:/'), 'Windows drive keeps its slash');

console.log('mediaStore: all assertions passed');
