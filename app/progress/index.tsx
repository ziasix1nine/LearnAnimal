import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ProgressBar } from "@/components/ProgressBar";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenHeader } from "@/components/ScreenHeader";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { useProgress } from "@/context/ProgressContext";
import { ACHIEVEMENTS } from "@/data/achievements";
import { ANIMALS } from "@/data/animals";

export default function ProgressScreen() {
  const { progress } = useProgress();
  const animalsLearnedCount = progress.animalsLearned.length;
  const totalAnimals = ANIMALS.length;

  return (
    <ScreenContainer>
      <ScreenHeader title="My Progress" emoji="⭐" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Animals Learned</Text>
          <Text style={styles.cardValue}>
            {animalsLearnedCount} / {totalAnimals}
          </Text>
          <ProgressBar progress={animalsLearnedCount / totalAnimals} color={colors.primary} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Stars Earned</Text>
          <Text style={styles.starValue}>⭐ {progress.totalStars}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Games Played</Text>
          <Text style={styles.cardValue}>{progress.gamesPlayed}</Text>
        </View>

        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementGrid}>
          {ACHIEVEMENTS.map((achievement) => {
            const unlocked = progress.achievementsUnlocked.includes(achievement.id);
            return (
              <View key={achievement.id} style={styles.achievementCard}>
                <View
                  style={[
                    styles.achievementBadge,
                    { backgroundColor: unlocked ? colors.yellow : "#00000010" },
                  ]}
                >
                  <Text style={styles.achievementEmoji}>{unlocked ? achievement.emoji : "🔒"}</Text>
                </View>
                <Text style={[styles.achievementTitle, !unlocked && styles.achievementTitleLocked]} numberOfLines={2}>
                  {achievement.title}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: layout.spacing.md,
    paddingBottom: layout.spacing.xl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: layout.radiusLarge,
    padding: layout.spacing.md,
    marginBottom: layout.spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textMuted,
    marginBottom: layout.spacing.xs,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  starValue: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    marginVertical: layout.spacing.sm,
  },
  achievementGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  achievementCard: {
    width: "31%",
    alignItems: "center",
    marginBottom: layout.spacing.md,
  },
  achievementBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: layout.spacing.xs,
  },
  achievementEmoji: {
    fontSize: 32,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  achievementTitleLocked: {
    color: colors.textMuted,
  },
});
