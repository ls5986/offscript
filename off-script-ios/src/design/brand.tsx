import { View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import wordmark from "./wordmark.json";
// Two offset speech cards: shared conversation, with one thought going off script.
export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      accessibilityLabel="Off Script"
    >
      <Rect x="1" y="1" width="38" height="38" rx="11" fill="#F29B87" />
      <Path
        d="M11 10h18a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H19l-7 6v-6h-1a3 3 0 0 1-3-3V13a3 3 0 0 1 3-3Z"
        fill="#172B49"
      />
      <Path
        d="M14 16h11M14 21h7"
        stroke="#F8F6F1"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <Path d="m29 7 4 4-5 5-4-4Z" fill="#F8F6F1" />
    </Svg>
  );
}

// Outlined lettering keeps the identity stable before fonts load, including offline.
export function BrandLockup({
  size = 30,
  color = "#172B49",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <View
      accessible
      accessibilityLabel="Off Script"
      style={{ flexDirection: "row", alignItems: "center", gap: 9 }}
    >
      <BrandMark size={size} />
      <Svg
        width={(wordmark.width * size) / 40}
        height={(wordmark.height * size) / 40}
        viewBox={`0 0 ${wordmark.width} ${wordmark.height}`}
      >
        {wordmark.paths.map((path, i) => (
          <Path key={i} d={path.d} transform={path.transform} fill={color} />
        ))}
      </Svg>
    </View>
  );
}
export type BrandGlyphKind =
  "studio" | "wordplay" | "scene" | "practice" | "group" | "movement";
// Shared offset-card silhouette; the center explains each kind of play.
export function BrandGlyph({
  kind,
  size = 20,
  color = "#172B49",
}: {
  kind: BrandGlyphKind;
  size?: number;
  color?: string;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M7 3h11a3 3 0 0 1 3 3v11M4 6h11a3 3 0 0 1 3 3v11H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
      {kind === "studio" && <Path d="M6 11h8M6 15h5" />}
      {kind === "wordplay" && (
        <Path d="M6 16 9 10l3 6M7 14h4M14 12h.01M14 16h.01" />
      )}
      {kind === "scene" && <Path d="M7 10h6v5h-3l-3 2v-7Z" />}
      {kind === "practice" && <Path d="M13 12a4 4 0 1 0 0 4M13 9v3h-3" />}
      {kind === "group" && (
        <>
          <Circle cx="8" cy="11" r="1.4" />
          <Circle cx="13" cy="11" r="1.4" />
          <Path d="M5 17v-1a3 3 0 0 1 6 0v1M12 14a3 3 0 0 1 4 2v1" />
        </>
      )}
      {kind === "movement" && <Path d="m7 10 5 2-5 3 6 2" />}
    </Svg>
  );
}
