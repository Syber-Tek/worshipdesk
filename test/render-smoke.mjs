// Render smoke check for the views touched by the hymnal-category fix.
//   node test/render-smoke.cjs
//
// The failure this guards: these views read state in a useEffect dependency
// array. A dependency array is evaluated during render, so referencing state that
// is declared further down the function throws
//   ReferenceError: Cannot access 'categories' before initialization
// which unmounts the page. `npm run build` does not catch it and neither do the
// pure-function tests - only actually rendering the component does.
//
// The categories themselves are loaded in an effect, and effects do not run under
// renderToString, so this asserts the component RENDERS for every value it can be
// handed - not that the category options are in the markup. The strings those
// options come from are checked in test/hymnCategories.test.mjs.

import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import * as esbuild from 'esbuild';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Real category strings, as the importer writes them from the bundled folders.
const DB_CATEGORIES = [
  'Presby Hymns -Twi',
  'Presby Hymns -Eng',
  'Methodist Hymns -Twi',
  'Methodist Hymns -Eng',
  'Presby Liturgy -Twi',
  'Presby Liturgy -Eng',
  'Methodist Liturgy -Twi',
  'Methodist Liturgy -Eng',
];

// The preload bridge, as the app exposes it. Effects never run here, but the
// components read window.api while rendering, so it has to exist.
globalThis.window = {
  api: {
    getHymnCategories: async () => DB_CATEGORIES,
    getHymnsCount: async () => 2400,
    searchHymns: async () => [],
    getHymnLyrics: async () => ({}),
  },
};

const React = require('react');
const { renderToString } = require('react-dom/server');

// Bundles one view. React must stay external or the component gets its own copy
// and react-dom/server's dispatcher is never seen by the hooks inside it.
const loadView = async (file) => {
  const built = await esbuild.build({
    entryPoints: [path.join(repoRoot, file)],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    write: false,
    logLevel: 'silent',
    external: ['react', 'react-dom', 'react-dom/server', 'react/jsx-runtime'],
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  const module = { exports: {} };
  const source = built.outputFiles[0].text;
  new Function('module', 'exports', 'require', source)(module, module.exports, require);
  return module.exports.default;
};

const STUB_PROPS = {
  cardClass: 'card',
  selectClass: 'sel',
  textTitle: 'tt',
  textSub: 'ts',
  borderDivider: 'bd',
  handleStageNext: () => {},
  handlePresentNow: () => {},
  handleAddToPlaylist: () => {},
  setDefaultHymnCategory: () => {},
  setShowHymnNumbers: () => {},
  setHymnTextScale: () => {},
  setUiScale: () => {},
};

const renderOk = (View, props, label) => {
  const html = renderToString(React.createElement(View, props));
  assert.ok(html.length > 0, `${label} rendered nothing`);
  return html;
};

const SongsView = await loadView('src/components/views/SongsView.jsx');
const SongsSettings = await loadView('src/components/views/settings/SongsSettings.jsx');

// No default set at all.
renderOk(SongsView, { ...STUB_PROPS }, 'SongsView with no default');

// A real category.
renderOk(
  SongsView,
  { ...STUB_PROPS, defaultHymnCategory: 'Presby Hymns -Twi' },
  'SongsView with a real category',
);

// The value the old broken Settings dropdown used to store. It matches no hymn,
// so it has to fall back rather than filter the list to nothing.
renderOk(
  SongsView,
  { ...STUB_PROPS, defaultHymnCategory: 'Presby Hymns (Twi)' },
  'SongsView with a stale category',
);

// Categories arrive from the database, so they are not known during render. The
// dropdown must still hold the unfiltered option rather than being empty.
const settings = renderOk(
  SongsSettings,
  { ...STUB_PROPS, defaultHymnCategory: 'Methodist Hymns -Eng' },
  'SongsSettings',
);
assert.ok(settings.includes('All'), 'SongsSettings dropdown rendered with no options');

console.log('render-smoke: all assertions passed');