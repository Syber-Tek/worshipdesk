// Self-check for the hymnal category list.
//   node test/hymnCategories.test.mjs
//
// The failure this guards: the Settings dropdown, the Songs tab filter and the
// `category` column the importer writes all match categories by exact string.
// Settings once shipped its own hardcoded list using "Presby Hymns (Twi)" while
// the database holds "Presby Hymns -Twi", so every value it stored matched no
// hymn and the Songs tab came up empty. Nothing errored, which is why it survived.
//
// The importer derives categories from the subfolder names in the bundled
// hymns/ folder, so that folder is the source of truth and this asserts the
// fallback list still matches it exactly.

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ALL_HYMN_CATEGORIES,
  FALLBACK_HYMN_CATEGORIES,
  loadHymnCategories,
  resolveHymnCategory,
} from '../src/lib/hymnCategories.js';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundledHymns = path.join(repoRoot, 'hymns');

// The bundled folders are what the importer writes into the database, so a
// mismatch here is a category that can never be selected.
const folderNames = fs
  .readdirSync(bundledHymns, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();

assert.ok(folderNames.length > 0, 'bundled hymns/ folder is missing or empty');

for (const name of folderNames) {
  assert.ok(
    FALLBACK_HYMN_CATEGORIES.includes(name),
    `bundled category "${name}" is missing from FALLBACK_HYMN_CATEGORIES - the Settings dropdown would not offer it`,
  );
}

// "All" is the unfiltered option and is never a real category, so it must not be
// in the fallback list the importer has to match.
assert.ok(!FALLBACK_HYMN_CATEGORIES.includes(ALL_HYMN_CATEGORIES));
assert.equal(
  new Set(FALLBACK_HYMN_CATEGORIES).size,
  FALLBACK_HYMN_CATEGORIES.length,
  'FALLBACK_HYMN_CATEGORIES has a duplicate, which would render twice in the dropdown',
);

// A stored value naming no real category falls back to All rather than an empty
// list. This is the migration path for anyone who saved a value under the old,
// wrong strings.
const withFallback = [ALL_HYMN_CATEGORIES, ...FALLBACK_HYMN_CATEGORIES];
for (const stale of ['Presby Hymns (Twi)', 'Methodist Hymns (Eng)', 'Presby Liturgy', '', undefined, null]) {
  assert.equal(
    resolveHymnCategory(stale, withFallback),
    ALL_HYMN_CATEGORIES,
    `expected ${JSON.stringify(stale)} to fall back to All`,
  );
}
assert.equal(resolveHymnCategory('Presby Hymns -Twi', withFallback), 'Presby Hymns -Twi');
assert.equal(resolveHymnCategory(ALL_HYMN_CATEGORIES, withFallback), ALL_HYMN_CATEGORIES);

// The database is the source of truth when it can be read. A duplicate "All"
// from the main process must not appear twice in the dropdown.
const fromDb = await loadHymnCategories({
  getHymnCategories: async () => [ALL_HYMN_CATEGORIES, 'Presby Hymns -Twi'],
});
assert.deepEqual(fromDb, [ALL_HYMN_CATEGORIES, 'Presby Hymns -Twi']);

// ...and an empty, missing, failing or absent API falls back to the built-in
// list rather than leaving the dropdown with no options at all.
const expected = [ALL_HYMN_CATEGORIES, ...FALLBACK_HYMN_CATEGORIES];
assert.deepEqual(await loadHymnCategories({ getHymnCategories: async () => [] }), expected);
assert.deepEqual(await loadHymnCategories({}), expected);
assert.deepEqual(
  await loadHymnCategories({
    getHymnCategories: async () => {
      throw new Error('database still importing');
    },
  }),
  expected,
);

console.log('hymnCategories: all assertions passed');