# Audio assets

## `sfx/` and `music/`

Small synthesized placeholder sounds (button taps, correct/try-again chimes,
star twinkle, achievement fanfare, and a soft background loop). They're
generated tones, not recordings, so there's no licensing concern — replace
any of them by dropping in a same-named file and keeping the format (short,
mono, normalized, quiet relative to the animal-sound clips).

## `animals/` — animal sounds

Every animal ships with a real (not text-to-speech) sound effect —
`dog.wav`, `cat.wav`, `cow.wav`, etc. These are **synthesized**, not
recordings: short original waveforms generated in code to approximate
each animal's bark/meow/moo/etc., not samples of TTS speaking the word,
and not licensed third-party recordings. That means zero licensing risk,
but they're a synthesized approximation rather than a real recording —
recognizable, but not studio-quality.

To replace one with a genuine, properly licensed or original recording:

1. Add a compressed, short (1–3s) clip named `<animal-id>.mp3` (or
   `.m4a`) to this folder, e.g. `assets/audio/animals/cow.mp3`, replacing
   or sitting alongside the existing `.wav`. Animal ids are defined in
   `src/data/animals.ts`.
2. Update its line in the `ANIMAL_SOUND_FILES` map at the top of
   `src/services/audioService.ts`:
   ```ts
   cow: require("../../assets/audio/animals/cow.mp3"),
   ```
   (Metro requires a static `require()` per asset — this map is the
   single place that lists them.)
3. That's it — `playAnimalSound(animal)` picks up the new file
   automatically. Any animal *not* listed in that map falls back to
   speaking the sound word via text-to-speech.

Keep clips short, normalized to a similar loudness, and free of
background noise so they stay clear and recognizable for toddlers.

Free sources for real, properly licensed sound effects if you want to
upgrade beyond the synthesized placeholders: Pixabay Sound Effects
(pixabay.com/sound-effects — free license, no attribution required),
Freesound.org (filter by CC0), and Mixkit Free Sound Effects.
