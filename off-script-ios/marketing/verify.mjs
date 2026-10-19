import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = dirname(fileURLToPath(import.meta.url));
const afterHours = process.argv.includes("--after-hours");
const output = resolve(root, afterHours ? "exports/after-hours" : "exports");
const manifest = JSON.parse(await readFile(resolve(output, "manifest.json"), "utf8"));
assert.equal(manifest.screenshots.length, afterHours ? 0 : 12);
if (afterHours) assert.equal(manifest.audience, "18+");
assert.equal(manifest.videos.length, 2, "Both tutorial aspect ratios must be rendered.");
const result = { checkedAt: new Date().toISOString(), screenshots: [], videos: [] };

for (const shot of manifest.screenshots) {
  const bytes = await readFile(resolve(output, shot.file));
  assert.equal(bytes.subarray(1, 4).toString(), "PNG");
  const size = [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
  assert.deepEqual(size, shot.size, shot.file);
  assert.equal(bytes[24], 8, `${shot.file}: expected 8-bit color.`);
  assert.equal(bytes[25], 2, `${shot.file}: expected opaque RGB, not an alpha channel.`);
  result.screenshots.push({ file: shot.file, size, color: "8-bit opaque RGB", sha256: createHash("sha256").update(bytes).digest("hex") });
}
assert.ok(process.env.FFMPEG, "Set FFMPEG to verify complete MP4 decoding.");
for (const video of manifest.videos) {
  const decoded = spawnSync(process.env.FFMPEG, [
    "-hide_banner", "-xerror", "-i", resolve(output, video.file),
    "-map", "0:v:0", "-f", "null", "-", "-progress", "pipe:1",
  ], { encoding: "utf8", maxBuffer: 2 * 1024 * 1024 });
  if (decoded.error) throw decoded.error;
  assert.equal(decoded.status, 0, decoded.stderr);
  const last = decoded.stdout.trim().split("progress=").at(-2);
  assert.ok(last, "Missing decoding progress.");
  const fields = Object.fromEntries([...last.matchAll(/^(\w+)=(.+)$/gm)].map((match) => [match[1], match[2].trim()]));
  assert.equal(Number(fields.frame), 900, video.file);
  assert.equal(Number(fields.out_time_us), 30_000_000, `${video.file}: must decode to exactly 30 seconds.`);
  assert.match(decoded.stderr, /Video: h264/);
  assert.match(decoded.stderr, /yuv420p/);
  assert.match(decoded.stderr, /yuv420p\(tv, bt709/);
  assert.ok(decoded.stderr.includes(`${video.size[0]}x${video.size[1]}`), "Incorrect encoded dimensions.");
  assert.match(decoded.stderr, /30 fps/);
  assert.doesNotMatch(decoded.stderr, /Audio:/);
  result.videos.push({ file: video.file, size: video.size, codec: "H.264 / yuv420p", fps: 30, decodedFrames: Number(fields.frame), decodedSeconds: Number(fields.out_time_us) / 1e6, sha256: createHash("sha256").update(await readFile(resolve(output, video.file))).digest("hex") });
}
await writeFile(resolve(output, "verification.json"), `${JSON.stringify(result, null, 2)}\n`);
console.log(`Verified ${result.screenshots.length} opaque RGB screenshots and ${result.videos.length} fully decoded, exactly 30-second videos.`);
