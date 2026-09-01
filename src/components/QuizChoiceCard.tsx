import React, { useEffect } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

import { AnimalCard } from "@/components/AnimalCard";
import { colors } from "@/constants/colors";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Animal } from "@/types/animal";

export type ChoiceState = "idle" | "correct" | "wrong" | "disabled";

interface QuizChoiceCardProps {
  animal: Animal;
  state: ChoiceState;
  onPress: () => void;
  size?: number;
}

/** An animal choice button used by both quiz games, with shared correct/wrong feedback. */
export function QuizChoiceCard({ animal, state, onPress, size = 140 }: QuizChoiceCardProps) {
  const reducedMotion = useReducedMotion();
  const shake = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (reducedMotion) return;
    if (state === "wrong") {
      shake.value = withSequence(
        withTiming(-8, { duration: 55 }),
        withTiming(8, { duration: 55 }),
        withTiming(-6, { duration: 55 }),
        withTiming(0, { duration: 55 }),
      );
    }
    if (state === "correct") {
      scale.value = withSequence(withTiming(1.12, { duration: 180 }), withTiming(1, { duration: 220 }));
    }
  }, [state, reducedMotion, shake, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }, { scale: scale.value }],
  }));

  const borderColor = state === "correct" ? colors.success : state === "wrong" ? colors.encourage : "transparent";

  return (
    <Animated.View style={animatedStyle}>
      <AnimalCard
        animal={animal}
        size={size}
        onPress={state === "disabled" ? undefined : onPress}
        playTapSound={false}
        style={{ borderWidth: 4, borderColor, opacity: state === "disabled" ? 0.55 : 1 }}
      />
    </Animated.View>
  );
}
