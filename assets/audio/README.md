# Audio assets

## `sfx/` and `music/`

Small synthesized placeholder sounds (button taps, correct/try-again chimes,
star twinkle, achievement fanfare, and a soft background loop). They're
generated tones, not recordings, so there's no licensing concern — replace
any of them by dropping in a same-named file and keeping the format (short,
mono, normalized, quiet relative to the animal-sound clips).

## `animals/` — real animal sound recordings go here

This app ships **without** recorded animal vocalizations (no copyrighted
audio is bundled). Instead, `src/services/audioService.ts` speaks each
animal's sound word (e.g. "Moo!") with text-to-speech as a clearly-labeled
placeholder, and automatically prefers a bundled recording when one exists.

To add a real, properly licensed or original recording for an animal:

1. Add a compressed, short (1–3s) clip named `<animal-id>.mp3` (or `.m4a`)
   to this folder, e.g. `assets/audio/animals/cow.mp3`. Animal ids are
   defined in `src/data/animals.ts`.
2. Register it in the `ANIMAL_SOUND_FILES` map at the top of
   `src/services/audioService.ts` by uncommenting/adding a line like:
   ```ts
   cow: require("../../assets/audio/animals/cow.mp3"),
   ```
   (Metro requires a static `require()` per asset — this map is the single
   place that lists them.)
3. That's it — `playAnimalSound(animal)` automatically uses the bundled
   file instead of the text-to-speech fallback once it's registered.

Keep clips short, normalized to a similar loudness, and free of background
noise so they stay clear and recognizable for toddlers.
