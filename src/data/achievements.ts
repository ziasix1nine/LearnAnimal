import type { Achievement } from "@/types/progress";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_animal",
    title: "First Animal",
    emoji: "🌟",
    description: "Learn your very first animal.",
    isUnlocked: (p) => p.animalsLearned.length >= 1,
  },
  {
    id: "five_animals",
    title: "5 Animals Learned",
    emoji: "🌟",
    description: "Learn 5 different animals.",
    isUnlocked: (p) => p.animalsLearned.length >= 5,
  },
  {
    id: "animal_explorer",
    title: "Animal Explorer",
    emoji: "🌟",
    description: "Learn every animal in the app.",
    isUnlocked: (p, total) => p.animalsLearned.length >= total,
  },
  {
    id: "sound_expert",
    title: "Sound Expert",
    emoji: "🌟",
    description: "Finish the Animal Sounds game.",
    isUnlocked: (p) => p.soundGamesCompleted >= 1,
  },
  {
    id: "ten_correct",
    title: "10 Correct Answers",
    emoji: "🌟",
    description: "Get 10 correct answers in games.",
    isUnlocked: (p) => p.correctAnswers >= 10,
  },
];
