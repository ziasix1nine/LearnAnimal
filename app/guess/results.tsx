import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { BigButton } from "@/components/BigButton";
import { ConfettiBurst } from "@/components/ConfettiBurst";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenHeader } from "@/components/ScreenHeader";
import { StarRating } from "@/components/StarRating";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { audioService } from "@/services/audioService";

export default function GuessResultsScreen() {
  const { score, total } = useLocalSearchParams<{ score: string; total: string }>();
  const scoreNum = Number(score ?? 0);
  const totalNum = Number(total ?? 5);
  const [confettiKey, setConfettiKey] = useState(0);

  useEffect(() => {
    setConfettiKey((k) => k + 1);
    const timer = setTimeout(() => audioService.speak("Great job! You're an animal expert!"), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenContainer>
      <ScreenHeader title="Results" emoji="🎯" onBack={() => router.replace("/")} />
      <View style={styles.body}>
        <ConfettiBurst triggerKey={confettiKey} />
        <Text style={styles.heading}>Great Job!</Text>
        <StarRating count={scoreNum} total={totalNum} size={44} />
        <Text style={styles.sub}>You're an Animal Expert!</Text>

        <BigButton
          label="Play Again"
          emoji="🔁"
          size="large"
          color={colors.secondary}
          onPress={() => router.replace("/guess/game")}
          style={styles.button}
        />
        <BigButton
          label="Home"
          emoji="🏠"
          color={colors.white}
          textColor={colors.text}
          onPress={() => router.replace("/")}
          style={styles.button}
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
  heading: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.text,
    marginBottom: layout.spacing.md,
  },
  sub: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textMuted,
    marginTop: layout.spacing.md,
    marginBottom: layout.spacing.xl,
  },
  button: {
    minWidth: 220,
    marginBottom: layout.spacing.sm,
  },
});
