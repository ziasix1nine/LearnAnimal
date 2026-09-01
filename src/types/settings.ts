export interface SettingsState {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  /** 0–1, applied to both music and sound effects. */
  volume: number;
}

export const INITIAL_SETTINGS: SettingsState = {
  musicEnabled: true,
  sfxEnabled: true,
  volume: 0.8,
};
