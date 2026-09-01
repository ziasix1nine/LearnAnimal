import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AchievementToast } from "@/components/AchievementToast";
import { colors } from "@/constants/colors";
import { ProgressProvider } from "@/context/ProgressContext";
import { SettingsProvider, useSettings } from "@/context/SettingsContext";
import { audioService } from "@/services/audioService";

SplashScreen.preventAutoHideAsync().catch(() => {});

function AppShell() {
  const { isLoaded, settings } = useSettings();

  useEffect(() => {
    if (!isLoaded) return;
    SplashScreen.hideAsync().catch(() => {});
    if (settings.musicEnabled) {
      void audioService.startBackgroundMusic();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "fade",
        }}
      />
      <AchievementToast />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SettingsProvider>
          <ProgressProvider>
            <AppShell />
          </ProgressProvider>
        </SettingsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
