import { createAudioPlayer, setAudioModeAsync, type AudioPlayer, type AudioSource } from "expo-audio";
import * as Speech from "expo-speech";

import type { Animal } from "@/types/animal";

/**
 * Real recorded animal sounds go here once available — see
 * assets/audio/README.md for the exact steps. Until an id is registered,
 * playAnimalSound() falls back to speaking the animal's sound word.
 */
const ANIMAL_SOUND_FILES: Partial<Record<string, AudioSource>> = {
  // cow: require("../../assets/audio/animals/cow.mp3"),
};

const SFX_SOURCES = {
  tap: require("../../assets/audio/sfx/tap.wav") as AudioSource,
  correct: require("../../assets/audio/sfx/correct.wav") as AudioSource,
  tryAgain: require("../../assets/audio/sfx/try_again.wav") as AudioSource,
  star: require("../../assets/audio/sfx/star.wav") as AudioSource,
  achievement: require("../../assets/audio/sfx/achievement.wav") as AudioSource,
  transition: require("../../assets/audio/sfx/transition.wav") as AudioSource,
};

const MUSIC_SOURCE = require("../../assets/audio/music/gentle_loop.wav") as AudioSource;

type SfxName = keyof typeof SFX_SOURCES;

interface AudioSettingsSnapshot {
  sfxEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
}

let settings: AudioSettingsSnapshot = { sfxEnabled: true, musicEnabled: true, volume: 0.8 };

const sfxPlayers = new Map<SfxName, AudioPlayer>();
let musicPlayer: AudioPlayer | null = null;
let audioModeReady = false;

async function ensureAudioMode() {
  if (audioModeReady) return;
  audioModeReady = true;
  await setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: false,
    interruptionMode: "duckOthers",
  });
}

function getSfxPlayer(name: SfxName): AudioPlayer {
  let player = sfxPlayers.get(name);
  if (!player) {
    player = createAudioPlayer(SFX_SOURCES[name]);
    sfxPlayers.set(name, player);
  }
  return player;
}

export const audioService = {
  /** Call once with the persisted settings, and again whenever they change. */
  updateSettings(next: AudioSettingsSnapshot) {
    const musicWasOff = !settings.musicEnabled;
    settings = next;
    if (musicPlayer) {
      musicPlayer.volume = settings.volume;
    }
    if (settings.musicEnabled && musicWasOff) {
      void this.startBackgroundMusic();
    } else if (!settings.musicEnabled) {
      musicPlayer?.pause();
    }
  },

  async playSfx(name: SfxName) {
    if (!settings.sfxEnabled) return;
    try {
      await ensureAudioMode();
      const player = getSfxPlayer(name);
      player.volume = settings.volume;
      await player.seekTo(0);
      player.play();
    } catch {
      // Non-critical: gameplay continues even if a sound fails to play.
    }
  },

  async startBackgroundMusic() {
    if (!settings.musicEnabled) return;
    try {
      await ensureAudioMode();
      if (!musicPlayer) {
        musicPlayer = createAudioPlayer(MUSIC_SOURCE);
        musicPlayer.loop = true;
      }
      musicPlayer.volume = settings.volume * 0.35;
      musicPlayer.play();
    } catch {
      // Background music is a nice-to-have; failures are silent.
    }
  },

  stopBackgroundMusic() {
    musicPlayer?.pause();
  },

  /** Speaks an animal's name, e.g. "Dog". */
  speakName(animal: Animal) {
    Speech.stop();
    Speech.speak(animal.name, { rate: 0.85, pitch: 1.15 });
  },

  /** Plays a bundled recording if one is registered, otherwise speaks the sound word. */
  async playAnimalSound(animal: Animal) {
    const bundled = ANIMAL_SOUND_FILES[animal.id];
    if (bundled) {
      try {
        await ensureAudioMode();
        const player = createAudioPlayer(bundled);
        player.volume = settings.volume;
        player.play();
        return;
      } catch {
        // fall through to text-to-speech
      }
    }
    Speech.stop();
    Speech.speak(animal.sound, { rate: 0.8, pitch: 1.3 });
  },

  speak(text: string) {
    Speech.stop();
    Speech.speak(text, { rate: 0.9, pitch: 1.1 });
  },

  stopSpeech() {
    Speech.stop();
  },
};

export type { SfxName };
