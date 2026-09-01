import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors } from "@/constants/colors";

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
}

/** Consistent full-bleed background for every screen (safe-area handled per-header). */
export function ScreenContainer({ children, style, backgroundColor = colors.background }: ScreenContainerProps) {
  return <View style={[styles.container, { backgroundColor }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
