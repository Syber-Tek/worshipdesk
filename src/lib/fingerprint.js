// A cheap fingerprint of every library source file, used to decide whether the
// expensive re-import has to run again. Not a content hash - editing a file in
// place without changing its size would be missed, which for "drop a Bible file
// in the folder" is not a case worth paying for.
//
// includeMtime must be false for anything read from inside the app.asar.
// Electron reports the archive's own mtime for every entry in an asar, and the
// archive is rewritten by every app update, so including it made each update
// invalidate both libraries and re-parse all~2,400 hymns on the next launch for
// content that had not changed at all. The bundled copy cannot be edited in
// place either, so its name and size are enough to spot a version that ships
// new or replaced Bible files. The user's own folder keeps its mtime, so a
// newly dropped file is still picked up.
//
// Plain JS with no electron import so test/fingerprint.test.mjs can use it.

import fs from "node:fs";
import path from "node:path";

export function fingerprintFiles(roots, extensions, includeMtime = true) {
  const parts = [];
  const walk = (dir) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!extensions.some((ext) => entry.name.toLowerCase().endsWith(ext))) continue;
      try {
        const stat = fs.statSync(full);
        const stamp = includeMtime ? `:${Math.floor(stat.mtimeMs)}` : "";
        parts.push(`${entry.name}:${stat.size}${stamp}`);
      } catch {
        parts.push(`${entry.name}:missing`);
      }
    }
  };
  for (const root of roots) walk(root);
  return parts.join("|");
}