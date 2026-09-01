# Animal Friends 🐾

A polished, offline-first animal-learning game for toddlers (ages 2–5), built with **Expo**, **React Native**, **TypeScript**, and **Expo Router**.

Children see an animal, hear its name and sound, and play two simple games
(Animal Sounds, Guess the Animal) to reinforce recognition — all with large
touch targets, gentle animations, and spoken feedback, and no account,
ads, chat, or sensitive permissions.

## Tech stack

- Expo SDK 57 + React Native 0.86 + TypeScript (strict)
- Expo Router (file-based navigation, `app/`)
- `expo-audio` for sound effects/music, `expo-speech` for text-to-speech
- `@react-native-async-storage/async-storage` for local progress/settings
- `react-native-reanimated` for animations (Reduce Motion aware)
- No backend — everything ships in the app bundle and works offline

## Project structure

```
app/                  Expo Router screens (file-based routes)
  _layout.tsx          Root providers + stack
  index.tsx             Home screen
  learn/                 Learn Animals (list + animal detail)
  sounds/                Animal Sounds game
  guess/                  Guess the Animal game (+ results)
  progress/               My Progress screen
  parent/                  Parent gate, settings, about/privacy/terms
src/
  types/                Shared TypeScript types (Animal, Progress, Settings)
  data/                  Animal roster + achievement definitions
  services/              audioService (TTS + SFX/music), storageService (AsyncStorage)
  context/                SettingsContext, ProgressContext (React Context + AsyncStorage)
  components/            Reusable UI (BigButton, AnimalCard, StarRating, ConfettiBurst, …)
  hooks/                  useReducedMotion
  constants/              colors, layout (shared design tokens)
  utils/                  random/shuffle helpers
assets/
  images/                App icon/splash placeholders + animal-art instructions
  audio/                  Generated SFX/music + animal-sound placeholder instructions
```

Business logic (data, storage, audio) is kept out of screens — every
screen renders from `src/data/animals.ts`, so adding animals or games
later doesn't mean rewriting screens.

## Getting started

**Requirements:** Node.js 20+, npm. For native builds: Xcode (iOS) and/or
Android Studio (Android), or use EAS Build (no local native toolchain
needed).

```bash
npm install
npx expo start
```

This project uses `legacy-peer-deps=true` (see `.npmrc`) because
`expo-router`'s own web tooling pulls in a peer-dependency graph that
`npm`'s strict resolver otherwise rejects — this is safe and Expo's
recommended workaround.

Press `i` for iOS Simulator, `a` for Android Emulator, or scan the QR
code with Expo Go on a physical device. `npm run web` runs the web
target.

### Type-checking

```bash
npx tsc --noEmit
```

## Adding a new animal

All animal content lives in one place: `src/data/animals.ts`. Add an
entry to the `ANIMALS` array:

```ts
{
  id: "koala",              // stable, unique, lowercase
  name: "Koala",
  sound: "Grr!",             // spoken onomatopoeia (see assets/audio/README.md to add a real recording)
  emoji: "🐨",                // placeholder illustration — see assets/images/README.md to swap in art
  category: "Jungle",        // "Farm" | "Jungle" | "Ocean" | "Pets"
  fact: "Koalas sleep most of the day.",
  color: "#EDE3D8",           // soft card/background color
}
```

That's it — the animal automatically appears in Learn Animals, and both
quiz games (they draw distractors from the full roster).

## Replacing animal images

Illustrations are currently large emoji (bright, crisp, license-free).
To use real artwork instead, see the step-by-step guide in
`assets/images/README.md` — it's a one-file change
(`src/components/AnimalIllustration.tsx`) plus one field per animal.

## Replacing animal sounds

The app ships without recorded animal vocalizations to avoid any
licensing concerns — it speaks each animal's sound word via
text-to-speech instead, clearly marked as a placeholder in
`src/services/audioService.ts`. To add real, properly licensed
recordings, follow `assets/audio/README.md` (drop an mp3 in
`assets/audio/animals/`, register it in one map, done).

The button/chime/music sounds in `assets/audio/sfx` and
`assets/audio/music` are small synthesized placeholder tones (not
recordings), generated offline — replace any of them by dropping in a
same-named file.

## Monetization architecture (not yet enabled)

`src/data/animals.ts` marks the first 10 animals as the "free" tier via
`FREE_ANIMAL_IDS`, and `Animal.isPremium` is reserved for the rest. Every
animal is unlocked in this v1 build — no payment processing is
implemented yet, per the product plan. When that ships, gate access to
premium animals/games behind a purchase flow that reads this same flag
rather than duplicating animal data.

## Production builds (EAS)

Install the EAS CLI and log in once:

```bash
npm install -g eas-cli
eas login
```

Update `app.json`'s `ios.bundleIdentifier` / `android.package` and
`eas.json` if you want your own identifiers, then:

```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

`eas.json` also has a `preview` profile (installable Android APK, no
store submission) for quick device testing.

### Publishing

```bash
# App Store (requires an Apple Developer account + App Store Connect app record)
eas submit --platform ios --profile production

# Google Play (requires a Play Console app record + service account key)
eas submit --platform android --profile production
```

Before submitting: replace the placeholder icon/splash art (see
`assets/images/README.md`), replace the placeholder Privacy Policy and
Terms text in `app/parent/privacy.tsx` and `app/parent/terms.tsx` with
your finalized copy, and update `app.json`'s bundle identifiers, version,
and build numbers per your store listing.

## Child safety & privacy

- No account, chat, social features, or user-generated content
- No camera, microphone, or location permissions (explicitly disabled —
  see the `expo-audio` plugin config in `app.json`)
- No ads or third-party analytics/tracking in this build
- Progress and settings are stored only on-device (AsyncStorage); nothing
  is uploaded anywhere
- The Parent Area (gear icon on the home screen) is gated behind a
  simple math question so young children can't wander into settings,
  and destructive actions (Reset Progress) require an additional confirm

## Accessibility

- Every touch target meets or exceeds 88×88pt
- `useReducedMotion` (src/hooks) disables bounce/confetti/shake
  animations when the system Reduce Motion setting is on
- Every animal name and sound is also spoken aloud (not color/shape-only)
- Buttons carry `accessibilityRole`/`accessibilityLabel` for screen readers
