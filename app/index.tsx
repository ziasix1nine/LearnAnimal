import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BigButton } from "@/components/BigButton";
import { PressableScale } from "@/components/PressableScale";
import { ScreenContainer } from "@/components/ScreenContainer";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { audioService } from "@/services/audioService";

const MENU_ITEMS = [
  { emoji: "🐶", label: "Learn Animals", color: colors.primary, route: "/learn" as const },
  { emoji: "🎵", label: "Animal Sounds", color: colors.blue, route: "/sounds" as const },
  { emoji: "🎯", label: "Guess the Animal", color: colors.secondary, route: "/guess" as const },
  { emoji: "⭐", label: "My Progress", color: colors.purple, route: "/progress" as const },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= 700;
  const columns = isTablet ? 4 : 2;
  const gap = layout.spacing.md;
  const horizontalPadding = layout.spacing.lg;
  const cardWidth = (width - horizontalPadding * 2 - gap * (columns - 1)) / columns;

  return (
    <ScreenContainer>
      <View style={[styles.settingsButtonWrap, { top: insets.top + layout.spacing.sm }]}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Parent Settings"
          style={styles.settingsButton}
          onPress={() => {
            void audioService.playSfx("tap");
            router.push("/parent");
          }}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </PressableScale>
      </View>

      <View style={[styles.header, { paddingTop: insets.top + layout.spacing.xl }]}>
        <Text style={styles.title}>🐾 Animal Friends</Text>
        <Text style={styles.subtitle}>Learn Animals & Their Sounds</Text>
      </View>

      <View style={[styles.grid, { paddingHorizontal: horizontalPadding, gap }]}>
        {MENU_ITEMS.map((item) => (
          <BigButton
            key={item.route}
            label={item.label}
            emoji={item.emoji}
            color={item.color}
            size="large"
            style={{ width: cardWidth, minHeight: cardWidth }}
            onPress={() => router.push(item.route)}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: layout.spacing.lg,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.text,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textMuted,
    marginTop: layout.spacing.xs,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  settingsButtonWrap: {
    position: "absolute",
    right: layout.spacing.md,
    zIndex: 10,
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  settingsIcon: {
    fontSize: 22,
  },
});
