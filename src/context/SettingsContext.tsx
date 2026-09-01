import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

import { audioService } from "@/services/audioService";
import { storageService } from "@/services/storageService";
import { INITIAL_SETTINGS, type SettingsState } from "@/types/settings";

interface SettingsContextValue {
  settings: SettingsState;
  isLoaded: boolean;
  setMusicEnabled: (enabled: boolean) => void;
  setSfxEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(INITIAL_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    storageService.loadSettings().then((loaded) => {
      if (cancelled) return;
      setSettings(loaded);
      audioService.updateSettings(loaded);
      loadedRef.current = true;
      setIsLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    audioService.updateSettings(settings);
    void storageService.saveSettings(settings);
  }, [settings]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      isLoaded,
      setMusicEnabled: (enabled) => setSettings((s) => ({ ...s, musicEnabled: enabled })),
      setSfxEnabled: (enabled) => setSettings((s) => ({ ...s, sfxEnabled: enabled })),
      setVolume: (volume) => setSettings((s) => ({ ...s, volume })),
    }),
    [settings, isLoaded],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within a SettingsProvider");
  return ctx;
}
