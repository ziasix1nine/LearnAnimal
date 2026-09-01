# Image assets

## App icon / splash placeholders

`icon.png`, `adaptive-icon.png`, `favicon.png`, and `splash.png` are a
simple generated placeholder mark (a friendly bear face) so the app is
fully installable and store-ready out of the box. Replace them with real
production artwork at the same filenames and dimensions before shipping:

| File                | Size (px) | Notes                                   |
| ------------------- | --------- | ---------------------------------------- |
| `icon.png`           | 1024×1024 | Square, opaque background, iOS/web icon |
| `adaptive-icon.png`  | 1024×1024 | Transparent background, Android foreground layer |
| `favicon.png`        | 196×196   | Web tab icon |
| `splash.png`         | 1284×2778 | Centered mark, transparent-safe margins |

## Animal illustrations

Animal illustrations are currently large emoji (`Animal.emoji` in
`src/data/animals.ts`) — bright, crisp at any size, and free of licensing
concerns, which is why they're used as the placeholder art everywhere an
animal is shown (cards, the Learn stage, the games).

To replace an animal's emoji with real illustration artwork:

1. Add an image file to `assets/images/animals/<animal-id>.png` (a square,
   transparent-background PNG works best, ~1000×1000px).
2. In `src/data/animals.ts`, add an `image` field to that animal's entry,
   e.g. `image: require("../../assets/images/animals/cow.png")`.
3. Update `src/components/AnimalIllustration.tsx` to render the `image`
   (via `expo-image`/`Image`) when present, falling back to `emoji`
   otherwise — the component already isolates this in one place so no
   screen needs to change.

This keeps every screen driven by the same `Animal` data shape described
in `src/types/animal.ts`, so adding artwork for more animals never
requires touching a screen file.
