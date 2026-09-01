import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

import { PressableScale } from "@/components/PressableScale";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";

interface BaseProps {
  icon: string;
  label: string;
  description?: string;
}

export function ToggleRow({
  icon,
  label,
  description,
  value,
  onValueChange,
}: BaseProps & { value: boolean; onValueChange: (v: boolean) => void }) {
  return (
    <View style={styles.row}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.textWrap}>
        <Text style={styles.label}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#00000022", true: colors.secondary }}
        accessibilityLabel={label}
      />
    </View>
  );
}

export function NavRow({ icon, label, description, onPress }: BaseProps & { onPress: () => void }) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.row}
      haptics={false}
    >
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.textWrap}>
        <Text style={styles.label}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      <Text style={styles.chevron}>›</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: layout.radiusMedium,
    padding: layout.spacing.md,
    marginBottom: layout.spacing.sm,
  },
  icon: {
    fontSize: 26,
    marginRight: layout.spacing.sm,
  },
  textWrap: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  description: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: colors.textMuted,
  },
});
