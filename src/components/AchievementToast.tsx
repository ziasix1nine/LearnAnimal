import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { useProgress } from "@/context/ProgressContext";
import { audioService } from "@/services/audioService";
import type { Achievement } from "@/types/progress";

/** Shows a brief, friendly toast whenever a new achievement unlocks. */
export function AchievementToast() {
  const { recentlyUnlocked, clearRecentlyUnlocked } = useProgress();
  const insets = useSafeAreaInsets();
  const [queue, setQueue] = useState<Achievement[]>([]);
  const [current, setCurrent] = useState<Achievement | null>(null);
  const translateY = useSharedValue(120);

  useEffect(() => {
    if (recentlyUnlocked.length === 0) return;
    setQueue((q) => [...q, ...recentlyUnlocked]);
    clearRecentlyUnlocked();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentlyUnlocked]);

  useEffect(() => {
    if (current || queue.length === 0) return;
    const [next, ...rest] = queue;
    setCurrent(next);
    setQueue(rest);
    void audioService.playSfx("achievement");
    translateY.value = withSpring(0, { damping: 14, stiffness: 160 });
    const timer = setTimeout(() => {
      translateY.value = withTiming(120, { duration: 300 });
      setTimeout(() => setCurrent(null), 320);
    }, 2600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, current]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  if (!current) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.toast, { bottom: insets.bottom + layout.spacing.lg }, animatedStyle]}
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.emoji}>{current.emoji}</Text>
      <View>
        <Text style={styles.title}>Achievement Unlocked!</Text>
        <Text style={styles.name}>{current.title}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    left: layout.spacing.md,
    right: layout.spacing.md,
    backgroundColor: colors.white,
    borderRadius: layout.radiusMedium,
    padding: layout.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  emoji: {
    fontSize: 36,
    marginRight: layout.spacing.sm,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMuted,
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
});
