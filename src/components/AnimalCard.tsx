import React from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { PressableScale } from "@/components/PressableScale";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { audioService } from "@/services/audioService";
import type { Animal } from "@/types/animal";

interface AnimalCardProps {
  animal: Animal;
  onPress?: () => void;
  size?: number;
  showName?: boolean;
  locked?: boolean;
  style?: StyleProp<ViewStyle>;
  playTapSound?: boolean;
}

export function AnimalCard({
  animal,
  onPress,
  size = 150,
  showName = true,
  locked = false,
  style,
  playTapSound = true,
}: AnimalCardProps) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={locked ? `${animal.name}, locked` : animal.name}
      disabled={!onPress}
      onPress={() => {
        if (playTapSound) void audioService.playSfx("tap");
        onPress?.();
      }}
      style={[styles.card, { width: size, backgroundColor: colors.surface }, style]}
    >
      <View style={[styles.circle, { backgroundColor: animal.color, width: size * 0.68, height: size * 0.68, borderRadius: (size * 0.68) / 2 }]}>
        <Text style={{ fontSize: size * 0.36 }}>{animal.emoji}</Text>
        {locked ? (
          <View style={styles.lockBadge}>
            <Text style={styles.lockEmoji}>🔒</Text>
          </View>
        ) : null}
      </View>
      {showName ? (
        <Text style={styles.name} numberOfLines={1}>
          {animal.name}
        </Text>
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: layout.radiusLarge,
    paddingVertical: layout.spacing.md,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    marginTop: layout.spacing.sm,
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  lockBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 4,
  },
  lockEmoji: {
    fontSize: 16,
  },
});
