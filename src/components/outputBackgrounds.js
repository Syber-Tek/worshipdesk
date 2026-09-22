import darkHorizon from "../assets/backgrounds/dark-horizon.jpg";
import worshipLight from "../assets/backgrounds/worship-light.jpg";
import starryNight from "../assets/backgrounds/starry-night.jpg";
import natureFog from "../assets/backgrounds/nature-fog.jpg";

import goldenParticlesVideo from "../assets/backgrounds/golden-particles.mp4";
import blueFluidVideo from "../assets/backgrounds/blue-fluid.mp4";
import auroraLightsVideo from "../assets/backgrounds/aurora-lights.mp4";
import cinematicCloudsVideo from "../assets/backgrounds/cinematic-clouds.mp4";

export const OUTPUT_BACKGROUNDS = {
  "dark-horizon": { label: "Dark Horizon", url: darkHorizon },
  "worship-light": { label: "Worship Light", url: worshipLight },
  "starry-night": { label: "Starry Night", url: starryNight },
  "nature-fog": { label: "Nature Fog", url: natureFog },
};

export const OUTPUT_VIDEOS = {
  "golden-particles": {
    label: "Golden Particles",
    url: goldenParticlesVideo,
  },
  "blue-fluid": {
    label: "Blue Fluid",
    url: blueFluidVideo,
  },
  "aurora-lights": {
    label: "Aurora Lights",
    url: auroraLightsVideo,
  },
  "cinematic-clouds": {
    label: "Cinematic Clouds",
    url: cinematicCloudsVideo,
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
  if (!value) return goldenParticlesVideo;
  if (OUTPUT_VIDEOS[value]) return OUTPUT_VIDEOS[value].url;
  return value; // custom video URL, data: URI, or file path
}