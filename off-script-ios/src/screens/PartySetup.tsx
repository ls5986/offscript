import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { View } from "react-native";
import { PartyOptionsFields } from "../components/PartyOptions";
import { PartyGamePicker } from "../components/PartyGamePicker";
import {
  Back,
  Button,
  Card,
  Counter,
  Disclosure,
  Field,
  Page,
  Title,
  Txt,
} from "../design/ui";
import { PartyOptionsSchema } from "../domain/party-contracts";
import { normalizePartyOptions, partyDeckError } from "../domain/party";
import { useApp } from "../providers/AppProvider";
function Setup() {
  const router = useRouter();
  const { data, startParty } = useApp();
  const [count, setCount] = useState(data.preferences.lastPlayerCount);
  const [names, setNames] = useState([...data.preferences.lastPlayerNames]);
  const [options, setOptions] = useState(() =>
    PartyOptionsSchema.parse({
      ...data.preferences.lastPartyOptions,
      selectedActivityIds: data.preferences.selectedPartyActivityIds,
    }),
  );
  const deckProblem = partyDeckError(
    normalizePartyOptions(options, data.preferences.classroomDefault),
    count,
  );
  const [busy, setBusy] = useState(false);
  const working = useRef(false);
  const [error, setError] = useState("");
  const begin = async () => {
    if (working.current) return;
    working.current = true;
    setBusy(true);
    setError("");
    try {
      const id = await startParty(
        count,
        Array.from({ length: count }, (_, i) => names[i] ?? ""),
        options,
      );
      router.replace(`/party/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start the party.");
      working.current = false;
      setBusy(false);
    }
  };
  return (
    <Page narrow compact play>
      <Back />
      <Title
        eyebrow="ONE PHONE. EVERYONE PLAYS."
        title="Party Night"
        sub="Set your group. We’ll deal the cards."
      />
      <Card style={{ padding: 22 }}>
        <Txt weight="medium" style={{ textAlign: "center" }}>
          How many people are playing?
        </Txt>
        <Counter count={count} onChange={setCount} />
        <Button
          icon="shuffle"
          after="arrow"
          disabled={
            busy ||
            !!deckProblem ||
            (options.level === "18_plus" && !options.adultsConfirmedAt)
          }
          onPress={() => void begin()}
        >
          {busy ? "Dealing your first card…" : "Deal first card"}
        </Button>
        <Txt size={13} muted style={{ textAlign: "center" }}>
          The reader starts. Everyone tries the same prompt, then chooses
          another. Change games only when you want to.
        </Txt>
        {!!error && <Txt accessibilityLiveRegion="polite">{error}</Txt>}
        {!!deckProblem && (
          <Txt accessibilityLiveRegion="polite">{deckProblem}</Txt>
        )}
      </Card>
      <Disclosure title="Choose games">
        <PartyGamePicker
          value={options}
          onChange={setOptions}
          playerCount={count}
          classroom={data.preferences.classroomDefault}
        />
      </Disclosure>
      <Disclosure title="Add names (optional)">
        <Txt muted size={14}>
          First names or nicknames. Leave blanks for Player 1, Player 2… They
          stay on this device.
        </Txt>
        {Array.from({ length: count }, (_, i) => (
          <Field
            key={i}
            label={`Player ${i + 1} name`}
            placeholder={`Player ${i + 1}`}
            value={names[i] ?? ""}
            onChangeText={(v) =>
              setNames((old) =>
                Array.from({ length: Math.max(count, old.length) }, (_, j) =>
                  i === j ? v.slice(0, 40) : (old[j] ?? ""),
                ),
              )
            }
          />
        ))}
      </Disclosure>
      <Disclosure title="Party preferences">
        <PartyOptionsFields
          value={options}
          onChange={setOptions}
          classroom={data.preferences.classroomDefault}
        />
      </Disclosure>
      <View style={{ paddingBottom: 10 }}>
        <Txt size={13} muted>
          Two people work too. Find individual games and skill practice in
          Explore Games.
        </Txt>
      </View>
    </Page>
  );
}
export default function PartySetup() {
  const { ready } = useApp();
  return ready ? (
    <Setup />
  ) : (
    <Page>
      <Txt>Opening your group…</Txt>
    </Page>
  );
}
