import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import { ACHIEVEMENTS } from "@/data/achievements";
import { ANIMALS } from "@/data/animals";
import { storageService } from "@/services/storageService";
import { INITIAL_PROGRESS, type Achievement, type ProgressState } from "@/types/progress";

interface ProgressContextValue {
  progress: ProgressState;
  isLoaded: boolean;
  /** Returns true if this was a newly-learned animal (first time). */
  markAnimalLearned: (animalId: string) => boolean;
  addStars: (count: number) => void;
  recordGamePlayed: () => void;
  recordCorrectAnswer: () => void;
  recordSoundGameCompleted: () => void;
  resetProgress: () => void;
  /** Achievements unlocked as of the most recent update, newest last. */
  recentlyUnlocked: Achievement[];
  clearRecentlyUnlocked: () => void;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(INITIAL_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<Achievement[]>([]);
  const loadedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    storageService.loadProgress().then((loaded) => {
      if (cancelled) return;
      setProgress(loaded);
      loadedRef.current = true;
      setIsLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const applyUpdate = useCallback((updater: (prev: ProgressState) => ProgressState) => {
    setProgress((prev) => {
      const next = updater(prev);
      const prevUnlocked = new Set(prev.achievementsUnlocked);
      const newlyUnlocked = ACHIEVEMENTS.filter(
        (a) => !prevUnlocked.has(a.id) && a.isUnlocked(next, ANIMALS.length),
      );
      const merged: ProgressState = newlyUnlocked.length
        ? { ...next, achievementsUnlocked: [...next.achievementsUnlocked, ...newlyUnlocked.map((a) => a.id)] }
        : next;
      if (newlyUnlocked.length) {
        setRecentlyUnlocked((r) => [...r, ...newlyUnlocked]);
      }
      if (loadedRef.current) {
        void storageService.saveProgress(merged);
      }
      return merged;
    });
  }, []);

  const markAnimalLearned = useCallback(
    (animalId: string) => {
      let wasNew = false;
      applyUpdate((prev) => {
        if (prev.animalsLearned.includes(animalId)) return prev;
        wasNew = true;
        return { ...prev, animalsLearned: [...prev.animalsLearned, animalId] };
      });
      return wasNew;
    },
    [applyUpdate],
  );

  const addStars = useCallback(
    (count: number) => applyUpdate((prev) => ({ ...prev, totalStars: prev.totalStars + count })),
    [applyUpdate],
  );

  const recordGamePlayed = useCallback(
    () => applyUpdate((prev) => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 })),
    [applyUpdate],
  );

  const recordCorrectAnswer = useCallback(
    () => applyUpdate((prev) => ({ ...prev, correctAnswers: prev.correctAnswers + 1 })),
    [applyUpdate],
  );

  const recordSoundGameCompleted = useCallback(
    () => applyUpdate((prev) => ({ ...prev, soundGamesCompleted: prev.soundGamesCompleted + 1 })),
    [applyUpdate],
  );

  const resetProgress = useCallback(() => {
    setProgress(INITIAL_PROGRESS);
    setRecentlyUnlocked([]);
    void storageService.resetProgress();
  }, []);

  const clearRecentlyUnlocked = useCallback(() => setRecentlyUnlocked([]), []);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        isLoaded,
        markAnimalLearned,
        addStars,
        recordGamePlayed,
        recordCorrectAnswer,
        recordSoundGameCompleted,
        resetProgress,
        recentlyUnlocked,
        clearRecentlyUnlocked,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within a ProgressProvider");
  return ctx;
}
