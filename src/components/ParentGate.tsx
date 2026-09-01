import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BigButton } from "@/components/BigButton";
import { PressableScale } from "@/components/PressableScale";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { shuffle } from "@/utils/random";

interface ParentGateProps {
  visible: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

function makeChallenge() {
  const a = 2 + Math.floor(Math.random() * 6);
  const b = 2 + Math.floor(Math.random() * 6);
  const correct = a + b;
  const distractors = new Set<number>();
  while (distractors.size < 2) {
    const d = correct + (Math.floor(Math.random() * 5) - 2 || 1);
    if (d !== correct && d > 0) distractors.add(d);
  }
  const options = shuffle([correct, ...Array.from(distractors)]);
  return { a, b, correct, options };
}

/** A simple adult-only math check gating the Parent Area from toddler taps. */
export function ParentGate({ visible, onSuccess, onClose }: ParentGateProps) {
  const insets = useSafeAreaInsets();
  const [challenge, setChallenge] = useState(makeChallenge);
  const [wrongTap, setWrongTap] = useState(false);

  useEffect(() => {
    if (visible) {
      setChallenge(makeChallenge());
      setWrongTap(false);
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { marginTop: insets.top + layout.spacing.lg }]}>
          <PressableScale accessibilityLabel="Close" style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeIcon}>✕</Text>
          </PressableScale>
          <Text style={styles.heading}>Grown-ups Only</Text>
          <Text style={styles.instructions}>Solve this to open Parent Settings:</Text>
          <Text style={styles.question}>
            {challenge.a} + {challenge.b} = ?
          </Text>
          <View style={styles.options}>
            {challenge.options.map((option) => (
              <BigButton
                key={option}
                label={String(option)}
                size="small"
                color={colors.blue}
                onPress={() => {
                  if (option === challenge.correct) onSuccess();
                  else {
                    setWrongTap(true);
                    setChallenge(makeChallenge());
                  }
                }}
                style={styles.optionButton}
              />
            ))}
          </View>
          {wrongTap ? <Text style={styles.hint}>Not quite — try the new problem.</Text> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "#00000066",
    alignItems: "center",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: layout.radiusLarge,
    padding: layout.spacing.lg,
    width: "86%",
    maxWidth: 380,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: layout.spacing.sm,
    right: layout.spacing.sm,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    fontSize: 18,
    color: colors.text,
    fontWeight: "700",
  },
  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    marginTop: layout.spacing.sm,
  },
  instructions: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: layout.spacing.xs,
    textAlign: "center",
  },
  question: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.text,
    marginVertical: layout.spacing.md,
  },
  options: {
    flexDirection: "row",
    gap: layout.spacing.sm,
  },
  optionButton: {
    minWidth: 72,
  },
  hint: {
    marginTop: layout.spacing.sm,
    color: colors.encourage,
    fontWeight: "600",
  },
});
