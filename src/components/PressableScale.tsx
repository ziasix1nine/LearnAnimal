import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { useReducedMotion } from "@/hooks/useReducedMotion";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends Omit<PressableProps, "style"> {
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  haptics?: boolean;
  children?: React.ReactNode;
}

/** Shared press-scale feedback used by every tappable in the app. */
export function PressableScale({
  style,
  scaleTo = 0.93,
  haptics = true,
  onPressIn,
  onPressOut,
  children,
  ...rest
}: PressableScaleProps) {
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      style={[style, animatedStyle]}
      onPressIn={(e) => {
        if (!reducedMotion) {
          scale.value = withSpring(scaleTo, { damping: 14, stiffness: 320 });
        }
        if (haptics) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        if (!reducedMotion) {
          scale.value = withSpring(1, { damping: 12, stiffness: 260 });
        }
        onPressOut?.(e);
      }}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}
