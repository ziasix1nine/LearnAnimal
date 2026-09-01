import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenHeader } from "@/components/ScreenHeader";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";

interface Section {
  heading: string;
  text: string;
}

interface InfoScreenProps {
  title: string;
  emoji: string;
  intro?: string;
  sections: Section[];
}

/** Shared layout for the parent-facing About / Privacy / Terms screens. */
export function InfoScreen({ title, emoji, intro, sections }: InfoScreenProps) {
  return (
    <ScreenContainer>
      <ScreenHeader title={title} emoji={emoji} onBack={() => router.replace("/parent/settings")} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {intro ? <Text style={styles.intro}>{intro}</Text> : null}
        {sections.map((section) => (
          <React.Fragment key={section.heading}>
            <Text style={styles.heading}>{section.heading}</Text>
            <Text style={styles.text}>{section.text}</Text>
          </React.Fragment>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: layout.spacing.md,
    paddingBottom: layout.spacing.xl,
  },
  intro: {
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: layout.spacing.md,
    lineHeight: 21,
  },
  heading: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
    marginTop: layout.spacing.md,
    marginBottom: layout.spacing.xs,
  },
  text: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
});
