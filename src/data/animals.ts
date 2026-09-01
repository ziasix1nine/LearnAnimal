import type { Animal } from "@/types/animal";

/**
 * The full animal roster. Each entry drives every screen in the app —
 * nothing about an individual animal is hard-coded into a screen.
 *
 * Illustrations are large emoji placeholders (bright, license-free, and
 * legible at any size) — see assets/images/README.md for how to swap in
 * real artwork per animal later without touching this file's shape.
 *
 * The first 10 animals form the "free" tier referenced in the README's
 * monetization architecture; `isPremium` is unused (everything is
 * unlocked) until that feature ships.
 */
export const ANIMALS: Animal[] = [
  {
    id: "dog",
    name: "Dog",
    sound: "Woof!",
    emoji: "🐶",
    category: "Pets",
    fact: "Dogs are friendly and love to play.",
    color: "#FFE3C2",
  },
  {
    id: "cat",
    name: "Cat",
    sound: "Meow!",
    emoji: "🐱",
    category: "Pets",
    fact: "Cats purr when they feel happy.",
    color: "#FFE0EC",
  },
  {
    id: "cow",
    name: "Cow",
    sound: "Moo!",
    emoji: "🐮",
    category: "Farm",
    fact: "Cows live on farms and give us milk.",
    color: "#E8F0FF",
  },
  {
    id: "pig",
    name: "Pig",
    sound: "Oink!",
    emoji: "🐷",
    category: "Farm",
    fact: "Pigs love to roll in the mud.",
    color: "#FFE1E6",
  },
  {
    id: "horse",
    name: "Horse",
    sound: "Neigh!",
    emoji: "🐴",
    category: "Farm",
    fact: "Horses can run very, very fast.",
    color: "#F1E6FF",
  },
  {
    id: "sheep",
    name: "Sheep",
    sound: "Baa!",
    emoji: "🐑",
    category: "Farm",
    fact: "Sheep grow soft, fluffy wool.",
    color: "#EAF6FF",
  },
  {
    id: "lion",
    name: "Lion",
    sound: "Roar!",
    emoji: "🦁",
    category: "Jungle",
    fact: "The lion is called the king of the jungle.",
    color: "#FFECC2",
  },
  {
    id: "elephant",
    name: "Elephant",
    sound: "Toot!",
    emoji: "🐘",
    category: "Jungle",
    fact: "Elephants have big ears and long trunks.",
    color: "#E7EEFB",
  },
  {
    id: "monkey",
    name: "Monkey",
    sound: "Ooh ooh!",
    emoji: "🐵",
    category: "Jungle",
    fact: "Monkeys love to swing from tree to tree.",
    color: "#F3E7D9",
  },
  {
    id: "duck",
    name: "Duck",
    sound: "Quack!",
    emoji: "🦆",
    category: "Farm",
    fact: "Ducks love to swim in the pond.",
    color: "#E2F7EE",
  },
  {
    id: "chicken",
    name: "Chicken",
    sound: "Cluck!",
    emoji: "🐔",
    category: "Farm",
    fact: "Chickens lay eggs every day.",
    color: "#FFF3C4",
  },
  {
    id: "frog",
    name: "Frog",
    sound: "Ribbit!",
    emoji: "🐸",
    category: "Ocean",
    fact: "Frogs are great jumpers and swimmers.",
    color: "#E1F7E1",
  },
  {
    id: "bear",
    name: "Bear",
    sound: "Grr!",
    emoji: "🐻",
    category: "Jungle",
    fact: "Bears sleep all winter long.",
    color: "#EFE2D2",
  },
  {
    id: "tiger",
    name: "Tiger",
    sound: "Roar!",
    emoji: "🐯",
    category: "Jungle",
    fact: "Tigers have beautiful orange and black stripes.",
    color: "#FFE7CF",
  },
  {
    id: "giraffe",
    name: "Giraffe",
    sound: "Hmm!",
    emoji: "🦒",
    category: "Jungle",
    fact: "Giraffes have very long necks.",
    color: "#FBF0D9",
  },
  {
    id: "zebra",
    name: "Zebra",
    sound: "Bray!",
    emoji: "🦓",
    category: "Jungle",
    fact: "Every zebra has its own pattern of stripes.",
    color: "#EDEFF2",
  },
  {
    id: "penguin",
    name: "Penguin",
    sound: "Honk!",
    emoji: "🐧",
    category: "Ocean",
    fact: "Penguins can't fly, but they are great swimmers.",
    color: "#E6F1FF",
  },
  {
    id: "dolphin",
    name: "Dolphin",
    sound: "Eee eee!",
    emoji: "🐬",
    category: "Ocean",
    fact: "Dolphins are very smart and playful.",
    color: "#DFF3FF",
  },
  {
    id: "rabbit",
    name: "Rabbit",
    sound: "Thump!",
    emoji: "🐰",
    category: "Pets",
    fact: "Rabbits have long ears and love to hop.",
    color: "#FCE6F1",
  },
  {
    id: "turtle",
    name: "Turtle",
    sound: "Hiss!",
    emoji: "🐢",
    category: "Ocean",
    fact: "Turtles carry their cozy home on their back.",
    color: "#E4F5E9",
  },
];

export const FREE_ANIMAL_IDS = new Set(ANIMALS.slice(0, 10).map((a) => a.id));

export const ANIMAL_CATEGORIES: Animal["category"][] = ["Farm", "Jungle", "Ocean", "Pets"];

export function getAnimalById(id: string): Animal | undefined {
  return ANIMALS.find((a) => a.id === id);
}

export function getAnimalsByCategory(category: Animal["category"]): Animal[] {
  return ANIMALS.filter((a) => a.category === category);
}
