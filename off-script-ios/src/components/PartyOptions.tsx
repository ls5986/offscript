import { View } from "react-native";
import { Chip, Disclosure, Eyebrow, Row, Toggle, Txt } from "../design/ui";
import type {
  PartyOptions as Options,
  PartyLevel,
} from "../domain/party-contracts";
export const levelLabel = (level: PartyLevel) =>
  level === "18_plus" ? "18+" : level === "spicy" ? "Spicy" : "Clean";
export function PartyOptionsFields({
  value,
  onChange,
  classroom,
}: {
  value: Options;
  onChange: (v: Options) => void;
  classroom: boolean;
}) {
  const change = (v: Partial<Options>) => onChange({ ...value, ...v });
  return (
    <View style={{ gap: 12 }}>
      <Eyebrow>THE MATERIAL</Eyebrow>
      <Row>
        {(["clean", "spicy", "18_plus"] as const).map((level) => (
          <Chip
            key={level}
            selected={value.level === level}
            onPress={() => {
              if (!classroom || level === "clean")
                change({ level, adultsConfirmedAt: null });
            }}
          >
            {levelLabel(level)}
          </Chip>
        ))}
      </Row>
      <Txt muted size={14}>
        {classroom
          ? "Classroom clean is on. All cards stay Clean; change this in Settings."
          : value.level === "clean"
            ? "Everyday absurdity. Suitable for mixed groups."
            : value.level === "spicy"
              ? "Dating disasters, flirting, and cheeky innuendo. Pass freely."
              : "Suggestive adult comedy, including Sex With Me Is Like. No dares or personal disclosures."}
      </Txt>
      {value.level !== "clean" && (
        <Txt muted size={13}>
          Games with a matching version use that material first. Word-based
          games can keep ordinary nouns; the format supplies the joke.
        </Txt>
      )}
      {value.level === "18_plus" && !classroom && (
        <Toggle
          label="Everyone is 18+ and wants adult cards"
          sub="Confirm for this group. Anyone can pass or return to Clean."
          value={!!value.adultsConfirmedAt}
          onChange={(confirmed) =>
            change({
              adultsConfirmedAt: confirmed ? new Date().toISOString() : null,
            })
          }
        />
      )}
      <Toggle
        label="Shuffle included games"
        sub="Off: stay with your game for another prompt. On: choose a different included game for each new round."
        value={value.rotation === "shuffle"}
        onChange={(shuffle) =>
          change({ rotation: shuffle ? "shuffle" : "stay" })
        }
      />
      <Toggle
        label="Allow scene games"
        sub="Turn off for untimed quick games. No scene is added to your selected games automatically."
        value={value.includeScenes}
        onChange={(includeScenes) => change({ includeScenes })}
      />
      <Toggle
        label="Team turns"
        sub="Teams alternate on joke and open-mic cards. No scoring required."
        value={value.teams}
        onChange={(teams) => change({ teams })}
      />
      <Disclosure title="Pacing, movement & cues">
        <Eyebrow>PACING</Eyebrow>
        <Row>
          {(["quick", "balanced", "relaxed"] as const).map((pacing) => (
            <Chip
              key={pacing}
              selected={value.pacing === pacing}
              onPress={() => change({ pacing })}
            >
              {pacing === "quick"
                ? "Quick laughs"
                : pacing === "balanced"
                  ? "A little of everything"
                  : "Room for scenes"}
            </Chip>
          ))}
        </Row>
        <Toggle
          label="Include movement games"
          sub="Off by default. No contact required."
          value={value.movement}
          onChange={(movement) => change({ movement })}
        />
        <Toggle
          label="Automatic visual cues"
          sub="Let the app call changes during a scene. Turn off to call them yourself with the cue buttons."
          value={value.automaticCues}
          onChange={(automaticCues) => change({ automaticCues })}
        />
        <Toggle
          label="Speak cues aloud"
          sub="Reads automatic or button-triggered cues aloud. Your device may silence speech; visual cues stay available."
          value={value.sound}
          onChange={(sound) => change({ sound })}
        />
      </Disclosure>
    </View>
  );
}
