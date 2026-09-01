import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AnimalIllustration } from "@/components/AnimalIllustration";
import { BigButton } from "@/components/BigButton";
import { ConfettiBurst } from "@/components/ConfettiBurst";
import { PressableScale } from "@/components/PressableScale";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenHeader } from "@/components/ScreenHeader";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { useProgress } from "@/context/ProgressContext";
import { ANIMALS, getAnimalById } from "@/data/animals";
import { audioService } from "@/services/audioService";

export default function AnimalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { markAnimalLearned, addStars } = useProgress();
  const [bumpKey, setBumpKey] = useState(0);
  const [confettiKey, setConfettiKey] = useState(0);
  const learnedRef = useRef<string | null>(null);

  const animal = getAnimalById(id ?? "") ?? ANIMALS[0];
  const index = ANIMALS.findIndex((a) => a.id === animal.id);
  const prevAnimal = ANIMALS[(index - 1 + ANIMALS.length) % ANIMALS.length];
  const nextAnimal = ANIMALS[(index + 1) % ANIMALS.length];

  useEffect(() => {
    if (learnedRef.current === animal.id) return;
    learnedRef.current = animal.id;

    audioService.speakName(animal);
    const soundTimer = setTimeout(() => {
      void audioService.playAnimalSound(animal);
    }, 900);

    const wasNew = markAnimalLearned(animal.id);
    if (wasNew) addStars(1);

    return () => clearTimeout(soundTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animal.id]);

  const handleHearAgain = () => {
    setBumpKey((k) => k + 1);
    setConfettiKey((k) => k + 1);
    audioService.speakName(animal);
    setTimeout(() => void audioService.playAnimalSound(animal), 700);
  };

  return (
    <ScreenContainer backgroundColor={animal.color}>
      <ScreenHeader title={animal.name} onBack={() => router.push("/learn")} />

      <View style={styles.body}>
        <View style={styles.stageWrap}>
          <ConfettiBurst triggerKey={confettiKey} />
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={`Hear ${animal.name} say ${animal.sound}`}
            onPress={handleHearAgain}
          >
            <AnimalIllustration animal={animal} size={220} idleBounce bumpKey={bumpKey} />
          </PressableScale>
        </View>

        <Text style={styles.name}>{animal.name}</Text>
        <View style={styles.soundPill}>
          <Text style={styles.soundText}>🔊 {animal.sound}</Text>
        </View>
        <Text style={styles.fact}>{animal.fact}</Text>

        <BigButton
          label="Hear Again"
          emoji="🔊"
          color={colors.white}
          textColor={colors.text}
          size="small"
          onPress={handleHearAgain}
          style={styles.hearButton}
        />
      </View>

      <View style={styles.navRow}>
        <BigButton
          label="Back"
          emoji="⬅️"
          subLabel={prevAnimal.name}
          color={colors.white}
          textColor={colors.text}
          onPress={() => router.replace(`/learn/${prevAnimal.id}`)}
          style={styles.navButton}
        />
        <BigButton
          label="Next"
          emoji="➡️"
          subLabel={nextAnimal.name}
          color={colors.primary}
          onPress={() => router.replace(`/learn/${nextAnimal.id}`)}
          style={styles.navButton}
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
    paddingHorizontal: layout.spacing.lg,
  },
  stageWrap: {
    marginBottom: layout.spacing.md,
  },
  name: {
    fontSize: 36,
    fontWeight: "900",
    color: colors.text,
  },
  soundPill: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: layout.spacing.md,
    marginTop: layout.spacing.sm,
  },
  soundText: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  fact: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
    marginTop: layout.spacing.md,
    maxWidth: 320,
  },
  hearButton: {
    marginTop: layout.spacing.lg,
    minWidth: 180,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: layout.spacing.md,
    paddingBottom: layout.spacing.lg,
    gap: layout.spacing.sm,
  },
  navButton: {
    flex: 1,
  },
});
