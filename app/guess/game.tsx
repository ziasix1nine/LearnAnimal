import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ConfettiBurst } from "@/components/ConfettiBurst";
import { FeedbackBanner } from "@/components/FeedbackBanner";
import { QuizChoiceCard, type ChoiceState } from "@/components/QuizChoiceCard";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenHeader } from "@/components/ScreenHeader";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { useProgress } from "@/context/ProgressContext";
import { ANIMALS } from "@/data/animals";
import { audioService } from "@/services/audioService";
import { sampleUnique, shuffle } from "@/utils/random";
import type { Animal } from "@/types/animal";

const ROUND_COUNT = 5;

function buildChoices(target: Animal): Animal[] {
  const distractors = sampleUnique(
    ANIMALS.filter((a) => a.id !== target.id),
    2,
  );
  return shuffle([target, ...distractors]);
}

export default function GuessGameScreen() {
  const { addStars, recordCorrectAnswer, recordGamePlayed } = useProgress();

  const rounds = useMemo(() => sampleUnique(ANIMALS, ROUND_COUNT), []);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<"playing" | "correct">("playing");
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [confettiKey, setConfettiKey] = useState(0);

  const target = rounds[roundIndex];
  const choices = useMemo(() => (target ? buildChoices(target) : []), [target]);

  useEffect(() => {
    if (!target) return;
    setWrongIds([]);
    setStatus("playing");
    const timer = setTimeout(() => audioService.speak(`Where is the ${target.name}?`), 400);
    return () => clearTimeout(timer);
  }, [roundIndex, target]);

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
          router.replace(`/guess/results?score=${score + 1}&total=${ROUND_COUNT}`);
        } else {
          setRoundIndex((r) => r + 1);
        }
      }, 1400);
    } else {
      void audioService.playSfx("tryAgain");
      setTimeout(() => audioService.speak(`Try again! Listen for ${target.sound}`), 100);
      setWrongIds((ids) => [...ids, animal.id]);
    }
  };

  const getState = (animal: Animal): ChoiceState => {
    if (status === "correct" && animal.id === target.id) return "correct";
    if (wrongIds.includes(animal.id)) return "wrong";
    if (status === "correct") return "disabled";
    return "idle";
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Guess the Animal"
        emoji="🎯"
        rightSlot={<Text style={styles.progressText}>{roundIndex + 1}/{ROUND_COUNT}</Text>}
      />

      <View style={styles.body}>
        <ConfettiBurst triggerKey={confettiKey} />

        <Text style={styles.question}>Where is the {target.name.toUpperCase()}?</Text>

        {wrongIds.length > 0 && status === "playing" ? (
          <Text style={styles.hint}>Hint: it says "{target.sound}"</Text>
        ) : null}

        <FeedbackBanner visible={status === "correct"} message="Great job! ⭐" tone="success" />

        <View style={styles.choices}>
          {choices.map((animal) => (
            <QuizChoiceCard key={animal.id} animal={animal} state={getState(animal)} onPress={() => handleChoicePress(animal)} size={150} />
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
    justifyContent: "center",
    paddingHorizontal: layout.spacing.md,
  },
  question: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
    marginBottom: layout.spacing.sm,
    textAlign: "center",
  },
  hint: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.encourage,
    marginBottom: layout.spacing.sm,
  },
  choices: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: layout.spacing.md,
    marginTop: layout.spacing.md,
  },
});
