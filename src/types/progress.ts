export interface ProgressState {
  /** Animal ids the child has opened/heard in Learn Animals. */
  animalsLearned: string[];
  totalStars: number;
  gamesPlayed: number;
  /** Cumulative correct answers across both quiz games. */
  correctAnswers: number;
  /** Number of times the Animal Sounds quiz was completed end-to-end. */
  soundGamesCompleted: number;
  achievementsUnlocked: string[];
}

export const INITIAL_PROGRESS: ProgressState = {
  animalsLearned: [],
  totalStars: 0,
  gamesPlayed: 0,
  correctAnswers: 0,
  soundGamesCompleted: 0,
  achievementsUnlocked: [],
};

export interface Achievement {
  id: string;
  title: string;
  emoji: string;
  description: string;
  isUnlocked: (progress: ProgressState, totalAnimals: number) => boolean;
}
