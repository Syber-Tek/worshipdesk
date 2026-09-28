// Pure helpers for the media store. Kept separate from main.js because that file
// imports Electron and cannot be exercised by a plain node test, and because the
// two things guarded here are destructive if they get it wrong: a bad name could
// overwrite an existing sermon video, and a stored name containing a path
// separator could escape the media folder.

import { extOf } from "./mediaKinds.js";

/**
 * Reject anything that is not a plain filename. A stored name comes back from the
 * renderer, so it is untrusted input: a name like "../../secrets" or "a\\b" must
 * never be joined onto the media folder.
 */
export function safeStoredName(name) {
  if (typeof name !== "string") return null;
  const trimmed = name.trim();
  if (!trimmed || trimmed === "." || trimmed === "..") return null;
  if (/[\\/]/.test(trimmed)) return null;
  if (trimmed.includes("\0")) return null;
  // Reserved on Windows, which is the main target.
  if (/[<>:"|?*]/.test(trimmed)) return null;
  return trimmed;
}

/**
 * Reduce anything to a readable base name with no extension and no characters
 * that need escaping. Accepts a full path or a full filename, so callers cannot
 * get this wrong by forgetting to strip the extension.
 */
export function safeBaseName(name) {
  const raw = String(name || "");
  const ext = extOf(raw);
  const withoutExt = ext ? raw.slice(0, -(ext.length + 1)) : raw;
  const cleaned = withoutExt.replace(/[^a-zA-Z0-9\-_ ]/g, "").trim();
  return cleaned || "media";
}

/**
 * Pick a name that is not already taken. `exists` is injected so this is testable
 * without touching the filesystem.
 */
export function uniqueStoredName(base, ext, exists) {
  const suffixExt = ext.startsWith(".") ? ext : ext ? `.${ext}` : "";
  let candidate = `${base}${suffixExt}`;
  let suffix = 1;
  while (exists(candidate)) {
    candidate = `${base}-${suffix++}${suffixExt}`;
  }
  return candidate;
}

/** Build the stored name for a source file path. */
export function storedNameFor(sourcePath, exists) {
  const leaf = String(sourcePath || "").split(/[\\/]/).pop() || "";
  return uniqueStoredName(safeBaseName(leaf), extOf(leaf), exists);
}

/**
 * file:// URL for an absolute path. Windows needs a leading slash before the
 * drive letter and forward slashes throughout; POSIX paths are already correct.
 */
export function toFileUrl(fullPath, sep = "/") {
  const forward = String(fullPath).split(sep).join("/");
  return forward.startsWith("/") ? `file://${forward}` : `file:///${forward}`;
}
