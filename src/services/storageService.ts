import AsyncStorage from "@react-native-async-storage/async-storage";

import { INITIAL_PROGRESS, type ProgressState } from "@/types/progress";
import { INITIAL_SETTINGS, type SettingsState } from "@/types/settings";

const KEYS = {
  progress: "@animal-friends/progress",
  settings: "@animal-friends/settings",
} as const;

async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as Partial<T>) };
  } catch {
    return fallback;
  }
}

async function writeJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local progress storage is best-effort for a toddler app — if it fails,
    // gameplay continues uninterrupted with in-memory state for the session.
  }
}

export const storageService = {
  loadProgress: () => readJSON<ProgressState>(KEYS.progress, INITIAL_PROGRESS),
  saveProgress: (progress: ProgressState) => writeJSON(KEYS.progress, progress),
  loadSettings: () => readJSON<SettingsState>(KEYS.settings, INITIAL_SETTINGS),
  saveSettings: (settings: SettingsState) => writeJSON(KEYS.settings, settings),
  resetProgress: () => writeJSON(KEYS.progress, INITIAL_PROGRESS),
};
