import { View } from "react-native";
import { Button, Row, Toggle, Txt } from "../design/ui";
import {
  normalizePartyOptions,
  partyDeckError,
  partyDeckRecipes,
} from "../domain/party";
import type { PartyOptions } from "../domain/party-contracts";
import {
  partyDefaultActivityIds,
  partyActivities,
} from "../domain/party-recipes";
import { partyInstruction } from "../domain/playbooks";

export function PartyGamePicker({
  value,
  onChange,
  playerCount,
  classroom,
}: {
  value: PartyOptions;
  onChange: (value: PartyOptions) => void;
  playerCount: number;
  classroom: boolean;
}) {
  const options = normalizePartyOptions(value, classroom);
  const games = partyActivities.filter(
    (game) => game.contentRating === "clean" || options.level === "18_plus",
  );
  const selected =
    options.selectedActivityIds ?? partyDefaultActivityIds(options.level);
  const available = new Set(
    partyDeckRecipes(
      {
        ...options,
        selectedActivityIds: games.map((game) => game.id),
      },
      playerCount,
    ).map((recipe) => recipe.activityId),
  );
  const count = new Set(
    partyDeckRecipes(options, playerCount).map((recipe) => recipe.activityId),
  ).size;
  const problem = partyDeckError(options, playerCount);
  return (
    <View style={{ gap: 10 }}>
      <Txt size={14} muted>
        Include only games you want. Your choices stay on this device for future
        parties. Unavailable games stay selected but cannot be dealt with the
        current settings.
      </Txt>
      <Row>
        <Button
          small
          kind="secondary"
          onPress={() =>
            onChange({
              ...value,
              selectedActivityIds: games.map((game) => game.id),
            })
          }
        >
          Select all games
        </Button>
        <Button
          small
          kind="secondary"
          onPress={() =>
            onChange({
              ...value,
              selectedActivityIds: [],
            })
          }
        >
          Clear selection
        </Button>
        <Button
          small
          kind="ghost"
          onPress={() =>
            onChange({
              ...value,
              selectedActivityIds: null,
            })
          }
        >
          Use default mix
        </Button>
      </Row>
      <Txt size={14} accessibilityLiveRegion="polite">
        {count} available {count === 1 ? "game" : "games"} selected
      </Txt>
      {!!problem && (
        <Txt size={14} accessibilityLiveRegion="polite">
          {problem}
        </Txt>
      )}
      {games.map((game) => (
        <Toggle
          key={game.id}
          label={`Include ${game.title}`}
          sub={`${partyInstruction(game)}${available.has(game.id) ? "" : " Not available for this group or current party settings."}`}
          value={selected.includes(game.id)}
          onChange={(include) =>
            onChange({
              ...value,
              selectedActivityIds: include
                ? [...selected, game.id]
                : selected.filter((id) => id !== game.id),
            })
          }
        />
      ))}
    </View>
  );
}
