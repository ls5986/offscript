import { isValidElement } from "react";
import { beforeEach, expect, test, vi } from "vitest";
import type { ReactElement } from "react";
import type { ViewStyle } from "react-native";

const device = vi.hoisted(() => ({ scheme: "dark" as "light" | "dark" }));
vi.mock("react-native", () => ({
  useColorScheme: () => device.scheme,
  Platform: { OS: "ios" },
  Text: "Text",
  TextInput: "TextInput",
  View: "View",
  Pressable: "Pressable",
  Modal: "Modal",
  ScrollView: "ScrollView",
}));
vi.mock("expo-router", () => ({}));
vi.mock("react-native-safe-area-context", () => ({}));
vi.mock("../../src/design/brand", () => ({
  BrandGlyph: "BrandGlyph",
  BrandLockup: "BrandLockup",
}));
vi.mock("../../src/providers/AppProvider", () => ({
  useApp: () => ({ data: { preferences: { useLargeText: false } } }),
}));

for (const icon of [
  "arrow-left",
  "arrow-right",
  "bookmark",
  "check",
  "circle-check-big",
  "chevron-down",
  "chevron-right",
  "clock",
  "copy",
  "expand",
  "eye",
  "eye-off",
  "flag",
  "grid-2x2",
  "hand",
  "heart",
  "house",
  "lightbulb",
  "lock",
  "mic",
  "minus",
  "party-popper",
  "pause",
  "play",
  "plus",
  "refresh-cw",
  "rotate-ccw",
  "search",
  "settings",
  "shuffle",
  "skip-forward",
  "star",
  "theater",
  "trash",
  "lock-open",
  "users",
  "volume-2",
  "volume-x",
  "x",
])
  vi.doMock(`lucide-react-native/icons/${icon}`, () => ({ default: "Icon" }));
const { Eyebrow, Field, Toggle, Txt, useTheme } =
  await import("../../src/design/ui");

function flatten(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) return Object.assign({}, ...style.map(flatten));
  return style && typeof style === "object"
    ? Object.fromEntries(Object.entries(style))
    : {};
}

function contrast(first: string, second: string): number {
  const luminance = (hex: string) => {
    const rgb = [1, 3, 5].map((offset) => {
      const channel = parseInt(hex.slice(offset, offset + 2), 16) / 255;
      return channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  const values = [luminance(first), luminance(second)].sort((a, b) => a - b);
  return (values[1] + 0.05) / (values[0] + 0.05);
}

function eyebrowColor(color?: string) {
  const label = Eyebrow({ children: "LOCATION", color });
  const nativeText = Txt(label.props);
  return flatten(nativeText.props.style).color;
}

beforeEach(() => {
  device.scheme = "dark";
});

test.each(["light", "dark"] as const)(
  "%s native labels retain an explicit readable color instead of an undefined override",
  (scheme) => {
    device.scheme = scheme;
    const color = eyebrowColor();
    expect(typeof color).toBe("string");
    expect(color).toBe(useTheme().ink);
    if (typeof color !== "string")
      throw new Error("Missing native label color.");
    for (const background of [
      useTheme().bg,
      useTheme().card,
      useTheme().blue,
      useTheme().lilac,
      useTheme().sage,
    ])
      expect(contrast(color, background)).toBeGreaterThanOrEqual(4.5);
  },
);

test("fixed dark cue cards retain their explicit accent label color", () => {
  expect(eyebrowColor("#F4A18E")).toBe("#F4A18E");
  expect(contrast("#F4A18E", "#172B49")).toBeGreaterThanOrEqual(4.5);
});

test.each(["light", "dark"] as const)(
  "%s body, helper and accent text meet normal-text contrast on all content surfaces",
  (scheme) => {
    device.scheme = scheme;
    const t = useTheme();
    for (const foreground of [t.ink, t.muted, t.accentInk])
      for (const background of [t.bg, t.card, t.lilac, t.blue, t.sage])
        expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5);
  },
);

test.each(["light", "dark"] as const)(
  "%s text input boundaries remain distinguishable from their fill and surrounding page",
  (scheme) => {
    device.scheme = scheme;
    const field = Field({
      label: "Player name",
      value: "",
      onChangeText: () => {},
    });
    const style = flatten(field.props.style);
    for (const background of [useTheme().card, useTheme().bg])
      expect(
        contrast(String(style.borderColor), background),
      ).toBeGreaterThanOrEqual(3);
  },
);

test.each(["light", "dark"] as const)(
  "%s unchecked switches keep the thumb visible against their track",
  (scheme) => {
    device.scheme = scheme;
    const toggle = Toggle({
      label: "Spoken cues",
      value: false,
      onChange: () => {},
    });
    const track: ReactElement<{
      style: ViewStyle;
      children: ReactElement<{ style: ViewStyle }>;
    }> = toggle.props.children[1];
    expect(isValidElement(track)).toBe(true);
    expect(
      contrast(
        String(track.props.children.props.style.backgroundColor),
        String(track.props.style.backgroundColor),
      ),
    ).toBeGreaterThanOrEqual(3);
  },
);
