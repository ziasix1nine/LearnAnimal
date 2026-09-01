import React, { useEffect, useMemo } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { colors } from "@/constants/colors";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const PIECES = ["🎉", "⭐", "🎊", "✨"];
const PIECE_COUNT = 16;

interface ConfettiBurstProps {
  /** Increment this number each time you want a fresh burst to play. */
  triggerKey: number;
}

/** A short, joyful celebration burst. Renders nothing when Reduce Motion is on. */
export function ConfettiBurst({ triggerKey }: ConfettiBurstProps) {
  const reducedMotion = useReducedMotion();
  const { width } = useWindowDimensions();

  const pieces = useMemo(
    () =>
      Array.from({ length: PIECE_COUNT }, (_, i) => ({
        id: i,
        emoji: PIECES[i % PIECES.length],
        startX: Math.random() * width,
        drift: (Math.random() - 0.5) * 120,
        delay: Math.random() * 150,
        rotate: Math.random() * 360,
      })),
    [width],
  );

  if (reducedMotion || triggerKey === 0) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((p) => (
        <ConfettiPiece key={`${triggerKey}-${p.id}`} {...p} />
      ))}
    </View>
  );
}

function ConfettiPiece({
  emoji,
  startX,
  drift,
  delay,
  rotate,
}: {
  emoji: string;
  startX: number;
  drift: number;
  delay: number;
  rotate: number;
}) {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withTiming(560, { duration: 1400 + delay });
    translateX.value = withTiming(drift, { duration: 1400 + delay });
    rotation.value = withTiming(rotate, { duration: 1400 + delay });
    opacity.value = withTiming(0, { duration: 1400 + delay });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: translateX.value }, { rotate: `${rotation.value}deg` }],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[styles.piece, { left: startX, color: colors.primary }, animatedStyle]}>
      {emoji}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  piece: {
    position: "absolute",
    top: 0,
    fontSize: 24,
  },
});
