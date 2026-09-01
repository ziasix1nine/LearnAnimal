import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { BigButton } from "@/components/BigButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenHeader } from "@/components/ScreenHeader";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";

export default function GuessIntroScreen() {
  return (
    <ScreenContainer>
      <ScreenHeader title="Guess the Animal" emoji="🎯" />
      <View style={styles.body}>
        <Text style={styles.emoji}>🐮 🐱 🐰</Text>
        <Text style={styles.heading}>Where is the animal?</Text>
        <Text style={styles.instructions}>
          I'll say an animal name — tap the one you see!
        </Text>
        <BigButton
          label="Start"
          emoji="▶️"
          size="large"
          color={colors.secondary}
          onPress={() => router.push("/guess/game")}
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
