export type AnimalCategory = "Farm" | "Jungle" | "Ocean" | "Pets";

export interface Animal {
  /** Stable identifier, used as storage key and asset lookup key. */
  id: string;
  /** Display + spoken name, e.g. "Cow". */
  name: string;
  /** Onomatopoeia spoken/shown for the animal's sound, e.g. "Moo!". */
  sound: string;
  /** Placeholder illustration. Swap for real artwork — see assets/images/README.md. */
  emoji: string;
  category: AnimalCategory;
  /** One short, toddler-friendly sentence. */
  fact: string;
  /** Soft background color for cards/stage featuring this animal. */
  color: string;
  /** Reserved for the free/premium split described in the README. Unused (unlocked) in v1. */
  isPremium?: boolean;
}
