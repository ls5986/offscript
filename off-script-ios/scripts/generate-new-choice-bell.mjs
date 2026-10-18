import { writeFileSync } from "node:fs";
import { Buffer } from "node:buffer";

// Original deterministic synthesis; no third-party recording or copyrighted sample.
const sampleRate = 44100;
const frames = Math.round(sampleRate * 0.8);
const bytes = Buffer.alloc(44 + frames * 2);
bytes.write("RIFF", 0);
bytes.writeUInt32LE(bytes.length - 8, 4);
bytes.write("WAVEfmt ", 8);
bytes.writeUInt32LE(16, 16);
bytes.writeUInt16LE(1, 20);
bytes.writeUInt16LE(1, 22);
bytes.writeUInt32LE(sampleRate, 24);
bytes.writeUInt32LE(sampleRate * 2, 28);
bytes.writeUInt16LE(2, 32);
bytes.writeUInt16LE(16, 34);
bytes.write("data", 36);
bytes.writeUInt32LE(frames * 2, 40);
for (let i = 0; i < frames; i++) {
  const t = i / sampleRate;
  const attack = Math.min(1, t / 0.003);
  const end = Math.min(1, (0.8 - t) / 0.03);
  const tone =
    Math.sin(2 * Math.PI * 880 * t) * Math.exp(-5 * t) +
    0.45 * Math.sin(2 * Math.PI * 1320 * t) * Math.exp(-7 * t) +
    0.22 * Math.sin(2 * Math.PI * 2112 * t) * Math.exp(-10 * t);
  bytes.writeInt16LE(Math.round(tone * attack * end * 0.5 * 32767), 44 + i * 2);
}
writeFileSync(new URL("../assets/new-choice-bell.wav", import.meta.url), bytes);
