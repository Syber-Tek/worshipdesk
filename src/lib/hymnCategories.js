// The hymnal categories the Songs tab filters by.
//
// A category is matched by exact string in three places: the Settings dropdown,
// the Songs tab filter, and the `category` column the importer writes from the
// subfolder names in the bundled hymns/ folder. A value that matches no hymn
// does not report an error - it just shows an empty Songs tab, which is why this
// went unnoticed for so long.
//
// These lists drifted once already: Settings offered "Presby Hymns (Twi)" while
// the database holds "Presby Hymns -Twi", so every selectable value missed and
// the tab came up empty no matter what was chosen. The strings below must stay
// identical to the folder names in hymns/, and test/hymnCategories.test.mjs
// fails if they are not.
//
// Plain JS with no electron import so the test can require it.

export const ALL_HYMN_CATEGORIES = "All";

// Sorted to match the order the folders are listed in, Presby before Methodist.
export const FALLBACK_HYMN_CATEGORIES = [
  "Presby Hymns -Twi",
  "Presby Hymns -Eng",
  "Methodist Hymns -Twi",
  "Methodist Hymns -Eng",
  "Presby Liturgy -Twi",
  "Presby Liturgy -Eng",
  "Methodist Liturgy -Twi",
  "Methodist Liturgy -Eng",
];

// Always leads with "All" so the tab keeps an unfiltered option. Falls back to
// the list above if the database cannot be read, which is the case during the
// first launch while the library is still being imported.
export async function loadHymnCategories(api = globalThis.window?.api) {
  try {
    const cats = await api?.getHymnCategories?.();
    if (Array.isArray(cats) && cats.length > 0) {
      return [ALL_HYMN_CATEGORIES, ...cats.filter((c) => c !== ALL_HYMN_CATEGORIES)];
    }
  } catch (err) {
    console.warn("Could not read hymnal categories, using the built-in list:", err);
  }
  return [ALL_HYMN_CATEGORIES, ...FALLBACK_HYMN_CATEGORIES];
}

// A value stored by an older build, or a category whose hymns were since removed,
// filters to nothing at all. Fall back to "All" so the tab is never blank.
export function resolveHymnCategory(value, categories) {
  return categories.includes(value) ? value : ALL_HYMN_CATEGORIES;
}