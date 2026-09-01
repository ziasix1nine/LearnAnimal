import { router } from "expo-router";
import React from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenHeader } from "@/components/ScreenHeader";
import { NavRow, ToggleRow } from "@/components/SettingsRow";
import { VolumeDots } from "@/components/VolumeDots";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { useProgress } from "@/context/ProgressContext";
import { useSettings } from "@/context/SettingsContext";

export default function ParentSettingsScreen() {
  const { settings, setMusicEnabled, setSfxEnabled, setVolume } = useSettings();
  const { resetProgress } = useProgress();

  const handleResetProgress = () => {
    Alert.alert(
      "Reset Progress?",
      "This will erase all stars, learned animals, and achievements. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: resetProgress },
      ],
    );
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Parent Settings" emoji="⚙️" onBack={() => router.replace("/")} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Audio</Text>
        <ToggleRow icon="🎵" label="Music" description="Soft background music" value={settings.musicEnabled} onValueChange={setMusicEnabled} />
        <ToggleRow icon="🔔" label="Sound Effects" description="Taps, cheers, and chimes" value={settings.sfxEnabled} onValueChange={setSfxEnabled} />
        <View style={styles.volumeRow}>
          <Text style={styles.volumeLabel}>Volume</Text>
          <VolumeDots value={settings.volume} onChange={setVolume} />
        </View>

        <Text style={styles.sectionTitle}>Data</Text>
        <NavRow icon="🗑️" label="Reset Progress" description="Erase all saved progress" onPress={handleResetProgress} />

        <Text style={styles.sectionTitle}>Information</Text>
        <NavRow icon="ℹ️" label="About" onPress={() => router.push("/parent/about")} />
        <NavRow icon="🔒" label="Privacy Policy" onPress={() => router.push("/parent/privacy")} />
        <NavRow icon="📄" label="Terms of Use" onPress={() => router.push("/parent/terms")} />

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>For Parents</Text>
          <Text style={styles.infoText}>
            Animal Friends is designed for young children. There's no chat, no social features,
            no ads directed at kids, and no account is required. Progress is stored only on this
            device. The app never requests camera, microphone, or location access.
          </Text>
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textMuted,
    textTransform: "uppercase",
    marginTop: layout.spacing.md,
    marginBottom: layout.spacing.sm,
  },
  volumeRow: {
    backgroundColor: colors.white,
    borderRadius: layout.radiusMedium,
    padding: layout.spacing.md,
    marginBottom: layout.spacing.sm,
  },
  volumeLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: layout.radiusMedium,
    padding: layout.spacing.md,
    marginTop: layout.spacing.sm,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  infoText: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
});
