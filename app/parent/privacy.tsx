import React from "react";

import { InfoScreen } from "@/components/InfoScreen";

export default function PrivacyScreen() {
  return (
    <InfoScreen
      title="Privacy Policy"
      emoji="🔒"
      intro="Placeholder privacy policy — replace with your finalized policy before publishing. Animal Friends is built to collect as little as possible."
      sections={[
        {
          heading: "No account required",
          text: "The app can be used fully without creating an account or signing in.",
        },
        {
          heading: "What we store",
          text:
            "Progress (stars, learned animals, achievements) and settings (music, sound, volume) are stored only on this device using local storage. Nothing is uploaded to a server.",
        },
        {
          heading: "No sensitive permissions",
          text: "Animal Friends never requests camera, microphone, contacts, or location access.",
        },
        {
          heading: "No third-party advertising or tracking",
          text:
            "This version of the app contains no advertising and no analytics or tracking SDKs. If a future version adds optional features for parents, they will be kept completely separate from gameplay and will comply with applicable children's privacy laws (such as COPPA).",
        },
        {
          heading: "Children's privacy",
          text:
            "This app is designed for children and does not knowingly collect personal information from children. Contact the developer with any questions about this policy.",
        },
      ]}
    />
  );
}
