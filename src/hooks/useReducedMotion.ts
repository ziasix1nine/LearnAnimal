import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/** Tracks the system "Reduce Motion" accessibility setting. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled?.().then((value) => {
      if (mounted) setReduced(value);
    });
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", (value) => {
      setReduced(value);
    });
    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, []);

  return reduced;
}
