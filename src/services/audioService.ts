import { createAudioPlayer, setAudioModeAsync, type AudioPlayer, type AudioSource } from "expo-audio";
import * as Speech from "expo-speech";

import type { Animal } from "@/types/animal";

/**
 * Synthesized (not recorded) animal sound effects — original, license-free
 * audio generated offline, not text-to-speech. See assets/audio/README.md
 * for how to swap any of these for real recordings later: drop a file at
 * assets/audio/animals/<id>.mp3 and update its line here. Until an id is
 * registered, playAnimalSound() falls back to speaking the sound word.
 */
const ANIMAL_SOUND_FILES: Partial<Record<string, AudioSource>> = {
  dog: require("../../assets/audio/animals/dog.wav") as AudioSource,
  cat: require("../../assets/audio/animals/cat.wav") as AudioSource,
  cow: require("../../assets/audio/animals/cow.wav") as AudioSource,
  pig: require("../../assets/audio/animals/pig.wav") as AudioSource,
  horse: require("../../assets/audio/animals/horse.wav") as AudioSource,
  sheep: require("../../assets/audio/animals/sheep.wav") as AudioSource,
  lion: require("../../assets/audio/animals/lion.wav") as AudioSource,
  elephant: require("../../assets/audio/animals/elephant.wav") as AudioSource,
  monkey: require("../../assets/audio/animals/monkey.wav") as AudioSource,
  duck: require("../../assets/audio/animals/duck.wav") as AudioSource,
  chicken: require("../../assets/audio/animals/chicken.wav") as AudioSource,
  frog: require("../../assets/audio/animals/frog.wav") as AudioSource,
  bear: require("../../assets/audio/animals/bear.wav") as AudioSource,
  tiger: require("../../assets/audio/animals/tiger.wav") as AudioSource,
  giraffe: require("../../assets/audio/animals/giraffe.wav") as AudioSource,
  zebra: require("../../assets/audio/animals/zebra.wav") as AudioSource,
  penguin: require("../../assets/audio/animals/penguin.wav") as AudioSource,
  dolphin: require("../../assets/audio/animals/dolphin.wav") as AudioSource,
  rabbit: require("../../assets/audio/animals/rabbit.wav") as AudioSource,
  turtle: require("../../assets/audio/animals/turtle.wav") as AudioSource,
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
const animalPlayers = new Map<string, AudioPlayer>();
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

function getSfxPlayer(name: SfxName): { player: AudioPlayer; isNew: boolean } {
  let player = sfxPlayers.get(name);
  const isNew = !player;
  if (!player) {
    player = createAudioPlayer(SFX_SOURCES[name]);
    sfxPlayers.set(name, player);
  }
  return { player, isNew };
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
      const { player, isNew } = getSfxPlayer(name);
      player.volume = settings.volume;
      if (!isNew) {
        try {
          await player.seekTo(0);
        } catch {
          // ignore — playback below still proceeds
        }
      }
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
        let player = animalPlayers.get(animal.id);
        const isNewPlayer = !player;
        if (!player) {
          player = createAudioPlayer(bundled);
          animalPlayers.set(animal.id, player);
        }
        player.volume = settings.volume;
        // A freshly created player is already at position 0 and may not be
        // finished loading yet, so seeking it can throw — only re-seek a
        // player we know has already played before, and don't let a seek
        // failure block playback.
        if (!isNewPlayer) {
          try {
            await player.seekTo(0);
          } catch {
            // ignore — playback below still proceeds
          }
        }
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
