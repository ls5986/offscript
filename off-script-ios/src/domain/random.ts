export type RNG = () => number;
export function seededRng(seed: number): RNG {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let n = Math.imul(t ^ (t >>> 15), 1 | t);
    n ^= n + Math.imul(n ^ (n >>> 7), 61 | n);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}
export function sample<T>(a: readonly T[], rng: RNG): T {
  if (!a.length) throw Error("No compatible content is available.");
  return a[Math.floor(rng() * a.length)];
}
export function weighted<T>(items: T[], weight: (x: T) => number, rng: RNG): T {
  let n = rng() * items.reduce((s, x) => s + weight(x), 0);
  return items.find((x) => (n -= weight(x)) <= 0) ?? items[items.length - 1];
}
