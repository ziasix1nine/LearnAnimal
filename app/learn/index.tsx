import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { AnimalCard } from "@/components/AnimalCard";
import { PressableScale } from "@/components/PressableScale";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ANIMALS, ANIMAL_CATEGORIES } from "@/data/animals";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { audioService } from "@/services/audioService";
import type { AnimalCategory } from "@/types/animal";

const FILTERS: Array<AnimalCategory | "All"> = ["All", ...ANIMAL_CATEGORIES];

export default function LearnListScreen() {
  const [filter, setFilter] = useState<AnimalCategory | "All">("All");
  const { width } = useWindowDimensions();
  const isTablet = width >= 700;
  const numColumns = isTablet ? 4 : 2;

  const data = useMemo(
    () => (filter === "All" ? ANIMALS : ANIMALS.filter((a) => a.category === filter)),
    [filter],
  );

  return (
    <ScreenContainer>
      <ScreenHeader title="Learn Animals" emoji="🐶" />

      <View style={styles.filterRow}>
        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel={`${item} animals`}
              onPress={() => {
                void audioService.playSfx("tap");
                setFilter(item);
              }}
              style={[styles.chip, filter === item && styles.chipActive]}
            >
              <Text style={[styles.chipText, filter === item && styles.chipTextActive]}>{item}</Text>
            </PressableScale>
          )}
        />
      </View>

      <FlatList
        key={numColumns}
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => (
          <AnimalCard
            animal={item}
            size={isTablet ? 170 : 150}
            onPress={() => router.push(`/learn/${item.id}`)}
          />
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    marginBottom: layout.spacing.sm,
  },
  filterList: {
    paddingHorizontal: layout.spacing.md,
    gap: layout.spacing.xs,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: layout.spacing.md,
    borderRadius: 20,
    backgroundColor: colors.white,
    marginRight: layout.spacing.xs,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontWeight: "700",
    color: colors.text,
  },
  chipTextActive: {
    color: colors.white,
  },
  grid: {
    paddingHorizontal: layout.spacing.md,
    paddingBottom: layout.spacing.xl,
  },
  gridRow: {
    justifyContent: "space-between",
    marginBottom: layout.spacing.md,
  },
});
