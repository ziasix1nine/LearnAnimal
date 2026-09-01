import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { PressableScale } from "@/components/PressableScale";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";

interface VolumeDotsProps {
  value: number; // 0–1
  onChange: (value: number) => void;
  steps?: number;
}

/** A simple 5-step volume control (avoids pulling in a native slider dependency). */
export function VolumeDots({ value, onChange, steps = 5 }: VolumeDotsProps) {
  const activeSteps = Math.round(value * steps);

  return (
    <View style={styles.row}>
      <Text style={styles.icon}>🔈</Text>
      {Array.from({ length: steps }, (_, i) => (
        <PressableScale
          key={i}
          accessibilityRole="button"
          accessibilityLabel={`Volume level ${i + 1} of ${steps}`}
          haptics={false}
          onPress={() => onChange((i + 1) / steps)}
          style={[styles.dot, { backgroundColor: i < activeSteps ? colors.primary : "#00000018" }]}
        />
      ))}
      <Text style={styles.icon}>🔊</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: layout.spacing.xs,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  icon: {
    fontSize: 16,
    marginHorizontal: 2,
  },
});
