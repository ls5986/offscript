import { useLocalSearchParams } from "expo-router";
import PartySetup from "../src/screens/PartySetup";
import Start from "../src/screens/Start";
export default function StartRoute() {
  const p = useLocalSearchParams<{
    mode?: string;
    activity?: string;
    intent?: string;
  }>();
  return !p.activity &&
    p.intent !== "practice" &&
    (!p.mode || p.mode === "surprise" || p.mode === "party_night") ? (
    <PartySetup />
  ) : (
    <Start />
  );
}
