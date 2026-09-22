import darkHorizon from "../assets/backgrounds/dark-horizon.jpg";
import worshipLight from "../assets/backgrounds/worship-light.jpg";
import starryNight from "../assets/backgrounds/starry-night.jpg";
import natureFog from "../assets/backgrounds/nature-fog.jpg";

export const OUTPUT_BACKGROUNDS = {
  "dark-horizon": { label: "Dark Horizon", url: darkHorizon },
  "worship-light": { label: "Worship Light", url: worshipLight },
  "starry-night": { label: "Starry Night", url: starryNight },
  "nature-fog": { label: "Nature Fog", url: natureFog },
};

export const OUTPUT_VIDEOS = {
  "golden-particles": {
    label: "Golden Particles",
    url: "https://assets.mixkit.co/videos/preview/mixkit-abstract-golden-particles-in-motion-41551-large.mp4",
  },
  "blue-fluid": {
    label: "Blue Fluid",
    url: "https://assets.mixkit.co/videos/preview/mixkit-abstract-blue-and-purple-ink-in-water-43399-large.mp4",
  },
  "aurora-lights": {
    label: "Aurora Lights",
    url: "https://assets.mixkit.co/videos/preview/mixkit-green-and-blue-lights-in-the-night-sky-41554-large.mp4",
  },
  "cinematic-clouds": {
    label: "Cinematic Clouds",
    url: "https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4",
  },
};

const LEGACY_KEYS = {
  "photo-1438232992991-995b7058bbb3": "dark-horizon",
  "photo-1519817650390-64a93db51149": "worship-light",
  "photo-1509021436468-d72a45025144": "starry-night",
  "photo-1470071459604-3b5ec3a7fe05": "nature-fog",
};

export function resolveBackground(value) {
  if (!value) return darkHorizon;
  if (typeof value === "string") {
    for (const [marker, key] of Object.entries(LEGACY_KEYS)) {
      if (value.includes(marker)) return OUTPUT_BACKGROUNDS[key].url;
    }
  }
  if (OUTPUT_BACKGROUNDS[value]) return OUTPUT_BACKGROUNDS[value].url;
  return value; // custom http(s) URL or data: URI
}

export function resolveVideo(value) {
  if (!value) return OUTPUT_VIDEOS["golden-particles"].url;
  if (OUTPUT_VIDEOS[value]) return OUTPUT_VIDEOS[value].url;
  return value; // custom video URL, data: URI, or file path
}