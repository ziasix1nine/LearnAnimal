import React from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { PressableScale } from "@/components/PressableScale";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { audioService } from "@/services/audioService";

interface BigButtonProps {
  label: string;
  emoji?: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  subLabel?: string;
  size?: "large" | "medium" | "small";
  disabled?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  playTapSound?: boolean;
}

export function BigButton({
  label,
  emoji,
  onPress,
  color = colors.primary,
  textColor = colors.white,
  subLabel,
  size = "medium",
  disabled,
  accessibilityHint,
  style,
  playTapSound = true,
}: BigButtonProps) {
  const sizeStyle = sizeStyles[size];

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      disabled={disabled}
      onPress={() => {
        if (playTapSound) void audioService.playSfx("tap");
        onPress();
      }}
      style={[
        styles.base,
        sizeStyle.container,
        { backgroundColor: color, opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      <View style={styles.content}>
        {emoji ? <Text style={sizeStyle.emoji}>{emoji}</Text> : null}
        <Text style={[sizeStyle.label, { color: textColor }]} numberOfLines={2}>
          {label}
        </Text>
        {subLabel ? (
          <Text style={[sizeStyle.subLabel, { color: textColor }]} numberOfLines={1}>
            {subLabel}
          </Text>
        ) : null}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: layout.radiusLarge,
    minHeight: layout.minTouchTarget,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: layout.spacing.sm,
  },
});

const sizeStyles = {
  large: StyleSheet.create({
    container: { paddingVertical: layout.spacing.lg, paddingHorizontal: layout.spacing.lg },
    emoji: { fontSize: 56, marginBottom: 6 },
    label: { fontSize: 24, fontWeight: "800" },
    subLabel: { fontSize: 15, fontWeight: "600", marginTop: 2, opacity: 0.9 },
  }),
  medium: StyleSheet.create({
    container: { paddingVertical: layout.spacing.md, paddingHorizontal: layout.spacing.md },
    emoji: { fontSize: 40, marginBottom: 4 },
    label: { fontSize: 19, fontWeight: "800" },
    subLabel: { fontSize: 13, fontWeight: "600", marginTop: 2, opacity: 0.9 },
  }),
  small: StyleSheet.create({
    container: { paddingVertical: layout.spacing.sm, paddingHorizontal: layout.spacing.md },
    emoji: { fontSize: 28, marginBottom: 2 },
    label: { fontSize: 16, fontWeight: "700" },
    subLabel: { fontSize: 12, fontWeight: "600", marginTop: 1, opacity: 0.9 },
  }),
};
