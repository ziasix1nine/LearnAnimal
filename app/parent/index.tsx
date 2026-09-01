import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { ParentGate } from "@/components/ParentGate";
import { ScreenContainer } from "@/components/ScreenContainer";

/** Route gate: shows the parent math challenge before revealing settings. */
export default function ParentGateScreen() {
  const [visible, setVisible] = useState(true);

  return (
    <ScreenContainer>
      <View style={styles.fill} />
      <ParentGate
        visible={visible}
        onSuccess={() => {
          setVisible(false);
          router.replace("/parent/settings");
        }}
        onClose={() => {
          setVisible(false);
          router.replace("/");
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
