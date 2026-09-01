import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/constants/colors";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Animal } from "@/types/animal";

interface AnimalIllustrationProps {
  animal: Animal;
  size?: number;
  /** Gently bounces the illustration to invite interaction. */
  idleBounce?: boolean;
  bumpKey?: number;
}

/**
 * Renders an animal's illustration. Currently draws the large emoji
 * placeholder from the animal data — see assets/images/README.md for how
 * to swap in real artwork per animal without touching call sites.
 */
export function AnimalIllustration({ animal, size = 160, idleBounce = false, bumpKey }: AnimalIllustrationProps) {
  const reducedMotion = useReducedMotion();
  const bounce = useSharedValue(0);
  const bump = useSharedValue(1);

  useEffect(() => {
    if (reducedMotion || !idleBounce) {
      bounce.value = 0;
      return;
    }
    bounce.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 650 }),
        withTiming(0, { duration: 650 }),
      ),
      -1,
      true,
    );
  }, [idleBounce, reducedMotion, bounce]);

  useEffect(() => {
    if (bumpKey === undefined || reducedMotion) return;
    bump.value = withSequence(withTiming(1.18, { duration: 140 }), withTiming(1, { duration: 220 }));
  }, [bumpKey, reducedMotion, bump]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }, { scale: bump.value }],
  }));

  return (
    <View
      style={[styles.wrapper, { width: size, height: size, borderRadius: size / 2, backgroundColor: animal.color }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Animated.Text style={[{ fontSize: size * 0.58 }, animatedStyle]}>{animal.emoji}</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
});
