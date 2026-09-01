import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PressableScale } from "@/components/PressableScale";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { audioService } from "@/services/audioService";

interface ScreenHeaderProps {
  title: string;
  emoji?: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
}

/** Large, consistent back button + title used on every non-home screen. */
export function ScreenHeader({ title, emoji, onBack, rightSlot }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.row, { paddingTop: insets.top + layout.spacing.sm }]}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={styles.backButton}
        onPress={() => {
          void audioService.playSfx("tap");
          if (onBack) onBack();
          else if (router.canGoBack()) router.back();
          else router.replace("/");
        }}
      >
        <Text style={styles.backIcon}>←</Text>
      </PressableScale>
      <View style={styles.titleWrap}>
        <Text style={styles.title} numberOfLines={1}>
          {emoji ? `${emoji} ` : ""}
          {title}
        </Text>
      </View>
      <View style={styles.rightSlot}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: layout.spacing.md,
    paddingBottom: layout.spacing.sm,
  },
  backButton: {
    width: layout.minTouchTarget * 0.75,
    height: layout.minTouchTarget * 0.75,
    borderRadius: (layout.minTouchTarget * 0.75) / 2,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  backIcon: {
    fontSize: 30,
    color: colors.text,
    fontWeight: "800",
  },
  titleWrap: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  rightSlot: {
    width: layout.minTouchTarget * 0.75,
    alignItems: "flex-end",
  },
});
