import React from "react";

import { InfoScreen } from "@/components/InfoScreen";

export default function TermsScreen() {
  return (
    <InfoScreen
      title="Terms of Use"
      emoji="📄"
      intro="Placeholder terms of use — replace with your finalized terms before publishing."
      sections={[
        {
          heading: "Use of the app",
          text: "Animal Friends is provided for personal, non-commercial, educational and entertainment use.",
        },
        {
          heading: "Content",
          text:
            "Animal illustrations, sounds, and facts are provided as-is for educational purposes and may be updated between app versions.",
        },
        {
          heading: "No warranty",
          text: "The app is provided \"as is\" without warranties of any kind, to the extent permitted by law.",
        },
        {
          heading: "Changes",
          text: "These terms may be updated from time to time; continued use of the app after an update constitutes acceptance of the revised terms.",
        },
      ]}
    />
  );
}
