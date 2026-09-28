// Self-check for media classification and slide ordering.
//   node test/mediaKinds.test.mjs
// The bug this guards: a PowerPoint folder export sorted as strings plays
// "slide10" before "slide2", which looks like random media mid-service.

import assert from 'node:assert/strict';
import { mediaKind, isImage, isVideo, isPdf, naturalCompare, defaultFit, extOf } from '../src/lib/mediaKinds.js';

assert.equal(mediaKind('a.jpg'), 'image');
assert.equal(mediaKind('a.JPEG'), 'image');
assert.equal(mediaKind('a.png'), 'image');
assert.equal(mediaKind('a.webp'), 'image');
assert.equal(mediaKind('a.mp4'), 'video');
assert.equal(mediaKind('a.MOV'), 'video');
assert.equal(mediaKind('a.pdf'), 'pdf');
assert.equal(mediaKind('notes.txt'), null, 'unsupported type is rejected');
assert.equal(mediaKind('no-extension'), null);
assert.equal(mediaKind('archive.tar.gz'), null, 'only the last extension counts');
assert.equal(mediaKind('v1.2.mp4'), 'video', 'dotted names still resolve');

assert.ok(isImage('x.png') && !isImage('x.mp4'));
assert.ok(isVideo('x.mp4') && !isVideo('x.pdf'));
assert.ok(isPdf('x.pdf') && !isPdf('x.jpg'));

assert.equal(extOf('a/b/c.MP4'), 'mp4');
assert.equal(extOf('a.b.c'), 'c');

// The ordering guard.
const exported = ['slide1.png', 'slide2.png', 'slide10.png', 'slide3.png'];
assert.deepEqual([...exported].sort(naturalCompare), [
  'slide1.png', 'slide2.png', 'slide3.png', 'slide10.png',
]);
assert.deepEqual(['s10.png', 'S2.png', 's1.png'].sort(naturalCompare), ['s1.png', 'S2.png', 's10.png']);

assert.equal(defaultFit('video'), 'cover', 'video fills the screen');
assert.equal(defaultFit('image'), 'contain', 'images are not cropped');
assert.equal(defaultFit('pdf'), 'contain', 'a 4:3 slide must not be cropped');

console.log('mediaKinds: all assertions passed');
