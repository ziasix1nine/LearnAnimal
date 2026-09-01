import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from "react-native-reanimated";

import { useReducedMotion } from "@/hooks/useReducedMotion";

interface StarRatingProps {
  count: number;
  total?: number;
  size?: number;
  animated?: boolean;
}

export function StarRating({ count, total = 5, size = 32, animated = true }: StarRatingProps) {
  const stars = Array.from({ length: total }, (_, i) => i < count);

  return (
    <View style={styles.row} accessibilityLabel={`${count} out of ${total} stars`}>
      {stars.map((filled, i) => (
        <Star key={i} filled={filled} size={size} delay={i * 90} animated={animated} />
      ))}
    </View>
  );
}

function Star({ filled, size, delay, animated }: { filled: boolean; size: number; delay: number; animated: boolean }) {
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(animated && !reducedMotion && filled ? 0 : 1);

  useEffect(() => {
    if (!animated || reducedMotion || !filled) return;
    scale.value = withDelay(delay, withSpring(1, { damping: 9, stiffness: 180 }));
  }, [animated, reducedMotion, filled, delay, scale]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.Text style={[{ fontSize: size, marginHorizontal: 2 }, filled ? animatedStyle : undefined]}>
      {filled ? "⭐" : "☆"}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
