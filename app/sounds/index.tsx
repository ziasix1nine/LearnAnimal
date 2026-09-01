import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { BigButton } from "@/components/BigButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenHeader } from "@/components/ScreenHeader";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";

export default function SoundsIntroScreen() {
  return (
    <ScreenContainer>
      <ScreenHeader title="Animal Sounds" emoji="🎵" />
      <View style={styles.body}>
        <Text style={styles.emoji}>🔊🐄🐶🐱</Text>
        <Text style={styles.heading}>Who makes this sound?</Text>
        <Text style={styles.instructions}>
          Listen to the sound, then tap the animal that makes it!
        </Text>
        <BigButton
          label="Start"
          emoji="▶️"
          size="large"
          color={colors.blue}
          onPress={() => router.push("/sounds/game")}
          style={styles.startButton}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: layout.spacing.xl,
  },
  emoji: {
    fontSize: 48,
    marginBottom: layout.spacing.md,
  },
  heading: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
  },
  instructions: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textMuted,
    textAlign: "center",
    marginTop: layout.spacing.sm,
    marginBottom: layout.spacing.xl,
  },
  startButton: {
    minWidth: 220,
  },
});
