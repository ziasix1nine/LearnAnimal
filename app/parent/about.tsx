import React from "react";

import { InfoScreen } from "@/components/InfoScreen";

export default function AboutScreen() {
  return (
    <InfoScreen
      title="About"
      emoji="ℹ️"
      intro="Animal Friends is a simple, offline learning game that helps young children (ages 2–5) learn animal names, animal sounds, and basic animal recognition."
      sections={[
        {
          heading: "How to play",
          text:
            "From the home screen, children can explore Learn Animals to meet each animal, play Animal Sounds to match sounds to animals, or try Guess the Animal to find the animal by name. Every screen uses large buttons and spoken feedback, so a child can play independently.",
        },
        {
          heading: "Version",
          text: "1.0.0",
        },
        {
          heading: "Contact",
          text: "Questions or feedback about the app can be sent to the developer listed on the app store page.",
        },
      ]}
    />
  );
}
