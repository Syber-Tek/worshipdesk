// Shared media classification. The main process uses it to decide what to accept
// and how to store a file; the renderer uses it to pick a default fit and to
// decide which element to render. Kept dependency-free so it is testable on its
// own, and so the two sides can never disagree about what counts as a video.

export const IMAGE_EXT = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp']);
export const VIDEO_EXT = new Set(['mp4', 'webm', 'mov', 'm4v']);
export const PDF_EXT = new Set(['pdf']);

export function extOf(name) {
  const idx = String(name || '').lastIndexOf('.');
  return idx === -1 ? '' : String(name).slice(idx + 1).toLowerCase();
}

/** 'image' | 'video' | 'pdf' | null */
export function mediaKind(name) {
  const ext = extOf(name);
  if (IMAGE_EXT.has(ext)) return 'image';
  if (VIDEO_EXT.has(ext)) return 'video';
  if (PDF_EXT.has(ext)) return 'pdf';
  return null;
}

export const isImage = (name) => mediaKind(name) === 'image';
export const isVideo = (name) => mediaKind(name) === 'video';
export const isPdf = (name) => mediaKind(name) === 'pdf';

// Slides arrive as "slide1.png", "slide2.png", "slide10.png" from a PowerPoint
// export. Plain string sort puts slide10 before slide2, so the service would play
// them out of order. Natural sort keeps the numeric part numeric.
export function naturalCompare(a, b) {
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

// A video wants to fill the screen; images and PDFs want to be seen whole, so a
// 4:3 sermon slide is letterboxed rather than cropped.
export function defaultFit(kind) {
  return kind === 'video' ? 'cover' : 'contain';
}
