import React, { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";

interface FeedbackBannerProps {
  visible: boolean;
  message: string;
  tone: "success" | "encourage";
}

/** "Great job!" / "Try again!" banner shared by both quiz games. */
export function FeedbackBanner({ visible, message, tone }: FeedbackBannerProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = visible ? withSpring(1, { damping: 12, stiffness: 200 }) : withTiming(0, { duration: 200 });
  }, [visible, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 16 }, { scale: 0.9 + progress.value * 0.1 }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.banner, { backgroundColor: tone === "success" ? colors.success : colors.encourage }, animatedStyle]}
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignSelf: "center",
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.lg,
    borderRadius: 24,
    marginBottom: layout.spacing.md,
  },
  text: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "800",
  },
});
