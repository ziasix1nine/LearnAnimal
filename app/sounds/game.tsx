import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";

import { BigButton } from "@/components/BigButton";
import { ConfettiBurst } from "@/components/ConfettiBurst";
import { FeedbackBanner } from "@/components/FeedbackBanner";
import { PressableScale } from "@/components/PressableScale";
import { QuizChoiceCard, type ChoiceState } from "@/components/QuizChoiceCard";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenHeader } from "@/components/ScreenHeader";
import { StarRating } from "@/components/StarRating";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { useProgress } from "@/context/ProgressContext";
import { ANIMALS } from "@/data/animals";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { audioService } from "@/services/audioService";
import { sampleUnique, shuffle } from "@/utils/random";
import type { Animal } from "@/types/animal";

const ROUND_COUNT = 6;

function buildChoices(target: Animal): Animal[] {
  const distractors = sampleUnique(
    ANIMALS.filter((a) => a.id !== target.id),
    2,
  );
  return shuffle([target, ...distractors]);
}

export default function SoundsGameScreen() {
  const { addStars, recordCorrectAnswer, recordGamePlayed, recordSoundGameCompleted } = useProgress();
  const reducedMotion = useReducedMotion();

  const rounds = useMemo(() => sampleUnique(ANIMALS, ROUND_COUNT), []);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<"playing" | "correct" | "finished">("playing");
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [confettiKey, setConfettiKey] = useState(0);

  const target = rounds[roundIndex];
  const choices = useMemo(() => (target ? buildChoices(target) : []), [target]);

  const speakerBounce = useSharedValue(0);

  useEffect(() => {
    if (!target) return;
    setWrongIds([]);
    setStatus("playing");
    const timer = setTimeout(() => void audioService.playAnimalSound(target), 500);
    if (!reducedMotion) {
      speakerBounce.value = withRepeat(withSequence(withTiming(-8, { duration: 400 }), withTiming(0, { duration: 400 })), -1, true);
    }
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIndex]);

  const speakerStyle = useAnimatedStyle(() => ({ transform: [{ translateY: speakerBounce.value }] }));

  if (!target) return null;

  const handleChoicePress = (animal: Animal) => {
    if (status === "correct") return;
    if (animal.id === target.id) {
      setStatus("correct");
      setScore((s) => s + 1);
      setConfettiKey((k) => k + 1);
      void audioService.playSfx("correct");
      addStars(1);
      recordCorrectAnswer();
      setTimeout(() => audioService.speak("Great job!"), 150);
      setTimeout(() => {
        if (roundIndex + 1 >= ROUND_COUNT) {
          recordGamePlayed();
          recordSoundGameCompleted();
          setStatus("finished");
        } else {
          setRoundIndex((r) => r + 1);
        }
      }, 1500);
    } else {
      void audioService.playSfx("tryAgain");
      setTimeout(() => audioService.speak("Try again!"), 100);
      setWrongIds((ids) => [...ids, animal.id]);
    }
  };

  const getState = (animal: Animal): ChoiceState => {
    if (status === "correct" && animal.id === target.id) return "correct";
    if (wrongIds.includes(animal.id)) return "wrong";
    if (status === "correct") return "disabled";
    return "idle";
  };

  if (status === "finished") {
    return (
      <ScreenContainer>
        <ScreenHeader title="Animal Sounds" emoji="🎵" onBack={() => router.replace("/")} />
        <View style={styles.finishedBody}>
          <ConfettiBurst triggerKey={confettiKey} />
          <Text style={styles.finishedHeading}>Great Job!</Text>
          <StarRating count={score} total={ROUND_COUNT} size={40} />
          <Text style={styles.finishedSub}>You're an Animal Expert!</Text>
          <BigButton
            label="Play Again"
            emoji="🔁"
            size="large"
            color={colors.blue}
            onPress={() => {
              setRoundIndex(0);
              setScore(0);
              setWrongIds([]);
              setStatus("playing");
            }}
            style={styles.playAgainButton}
          />
          <BigButton
            label="Home"
            emoji="🏠"
            color={colors.white}
            textColor={colors.text}
            onPress={() => router.replace("/")}
            style={styles.playAgainButton}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Animal Sounds" emoji="🎵" rightSlot={<Text style={styles.progressText}>{roundIndex + 1}/{ROUND_COUNT}</Text>} />

      <View style={styles.body}>
        <ConfettiBurst triggerKey={confettiKey} />

        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={`Play sound again`}
          onPress={() => void audioService.playAnimalSound(target)}
          style={styles.soundStage}
        >
          <Animated.Text style={[styles.speakerEmoji, speakerStyle]}>🔊</Animated.Text>
          <Text style={styles.soundWord}>{target.sound}</Text>
        </PressableScale>

        <Text style={styles.question}>Who makes this sound?</Text>

        <FeedbackBanner visible={status === "correct"} message="Great job! ⭐" tone="success" />

        <View style={styles.choices}>
          {choices.map((animal) => (
            <QuizChoiceCard key={animal.id} animal={animal} state={getState(animal)} onPress={() => handleChoicePress(animal)} />
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  progressText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textMuted,
  },
  body: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: layout.spacing.md,
    paddingTop: layout.spacing.sm,
  },
  soundStage: {
    backgroundColor: colors.white,
    borderRadius: layout.radiusLarge,
    paddingVertical: layout.spacing.lg,
    paddingHorizontal: layout.spacing.xl,
    alignItems: "center",
    marginBottom: layout.spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  speakerEmoji: {
    fontSize: 56,
  },
  soundWord: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.text,
    marginTop: layout.spacing.xs,
  },
  question: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    marginBottom: layout.spacing.md,
    textAlign: "center",
  },
  choices: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: layout.spacing.md,
  },
  finishedBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: layout.spacing.xl,
  },
  finishedHeading: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.text,
    marginBottom: layout.spacing.md,
  },
  finishedSub: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textMuted,
    marginTop: layout.spacing.md,
    marginBottom: layout.spacing.xl,
  },
  playAgainButton: {
    minWidth: 220,
    marginBottom: layout.spacing.sm,
  },
});
