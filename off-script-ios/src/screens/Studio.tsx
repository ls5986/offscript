import { Feedback } from "../components/Feedback";
import { ComposedPrompt } from "../components/ComposedPrompt";
import { PromptSwipe, PromptSwipeControl } from "../components/PromptSwipe";
import {
  appendPromptNavigation,
  currentPromptNavigation,
  stepPromptNavigation,
  studioPromptContext,
} from "../domain/prompt-navigation";
import {
  composeScene,
  legacyIngredientCategories,
  refreshComposition,
  upgradeSnapshotIngredients,
} from "../domain/composer";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Share, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  Counter,
  Dialog,
  Eyebrow,
  Field,
  Icon,
  IconButton,
  Page,
  Row,
  Toggle,
  Txt,
  useTheme,
} from "../design/ui";
import {
  categories,
  Category,
  categoryLabels,
  relationships,
  sourceRelationships,
} from "../domain/content";
import { Player, PromptSnapshot } from "../domain/contracts";
import {
  generatePrompt,
  promptText,
  relationshipCompatible,
  resolvePromptPlayerId,
} from "../domain/prompts";
import { seededRng } from "../domain/random";
import { relationshipRoleText } from "../domain/roles";
import { useApp, uuid } from "../providers/AppProvider";
import {
  contentLevelLabels,
  studioContentLevel,
  studioSnapshotAllowed,
} from "../domain/library";
import type { PartyLevel } from "../domain/party-contracts";
const presets: [string, Category[]][] = [
  ["Who / What / Where", ["relationship", "action", "location"]],
  ["Relationship Only", ["relationship"]],
  ["Emotion + Action", ["emotion", "action"]],
  ["Blank Canvas", []],
];
export function PromptCards({
  snapshot,
  large = false,
  controls,
  onLock,
  onReroll,
  players,
  performerIds,
}: {
  snapshot: PromptSnapshot;
  players?: Player[];
  performerIds?: string[];
  large?: boolean;
  controls?: boolean;
  onLock?: (c: Category) => void;
  onReroll?: (c: Category) => void;
}) {
  const t = useTheme();
  return (
    <View
      style={{
        flexDirection: large ? "column" : "row",
        flexWrap: "wrap",
        gap: 16,
      }}
    >
      {Object.entries(snapshot.entries).map(([key, v]) => (
        <Card
          key={key}
          style={{
            flexBasis: large ? "auto" : 280,
            flexGrow: 1,
            padding: large ? 24 : 20,
            backgroundColor:
              key === "relationship"
                ? t.lilac
                : key === "location"
                  ? t.blue
                  : t.card,
          }}
        >
          <Row style={{ justifyContent: "space-between" }}>
            <Eyebrow>
              {legacyIngredientCategories(snapshot).includes(key as Category)
                ? `Saved original · ${categoryLabels[key as Category]}`
                : categoryLabels[key as Category]}
            </Eyebrow>
            {controls && (
              <PromptSwipeControl>
                <Row style={{ gap: 0 }}>
                  <IconButton
                    name={v.locked ? "lock" : "unlock"}
                    active={v.locked}
                    label={`${v.locked ? "Unlock" : "Lock"} ${categoryLabels[key as Category]}`}
                    onPress={() => onLock?.(key as Category)}
                  />
                  <IconButton
                    name="refresh"
                    label={`Reroll ${categoryLabels[key as Category]}`}
                    onPress={() => {
                      if (!v.locked) onReroll?.(key as Category);
                    }}
                    disabled={v.locked}
                  />
                </Row>
              </PromptSwipeControl>
            )}
          </Row>
          <Txt serif size={large ? 38 : 25}>
            {v.text}
          </Txt>
          {key === "relationship" && snapshot.relationship && (
            <View style={{ gap: 5, paddingTop: 6 }}>
              {snapshot.relationship.assignments.map((r, i) => {
                const playerId = resolvePromptPlayerId(
                  r.playerId,
                  i,
                  players ?? [],
                  performerIds,
                );
                return (
                  <Txt key={i} size={large ? 19 : 14} muted>
                    {players?.find((person) => person.id === playerId)
                      ?.displayName ?? `Player ${i + 1}`}{" "}
                    · {r.roleText}
                  </Txt>
                );
              })}
            </View>
          )}
        </Card>
      ))}
    </View>
  );
}
export default function Studio() {
  const { data, update, ready } = useApp();
  const { studio } = data;
  const composeResult =
    studio.composeResult ?? studio.result?.compositionEnabled ?? true;
  const locationOnly =
    studio.categories.length === 1 && studio.categories[0] === "location";
  const legacyCategories = studio.result
    ? legacyIngredientCategories(studio.result)
    : [];
  const legacyLocked = legacyCategories.some(
    (c) => studio.result?.entries[c].locked,
  );
  const router = useRouter();
  const t = useTheme();
  const [large, setLarge] = useState(false);
  const [toast, setToast] = useState("");
  const [warning, setWarning] = useState("");
  const [label, setLabel] = useState("My scene recipe");
  const [presetOpen, setPresetOpen] = useState(false);
  const initial = useRef(false);
  const [customize, setCustomize] = useState(false);
  const [adult, setAdult] = useState(false);
  const contentLevel = studioContentLevel(
    studio.contentLevel,
    data.preferences,
  );
  const browsing = useRef(false);
  const [promptBusy, setPromptBusy] = useState(false);
  const navigation = studio.result
    ? currentPromptNavigation(
        studio.result,
        studio.promptNavigation,
        studioPromptContext(studio, data.preferences.classroomDefault),
      )
    : undefined;
  const canPrevious = !!navigation && navigation.index > 0;
  const canForward =
    !!navigation && navigation.index < navigation.snapshots.length - 1;
  const generate = useCallback(
    async (
      only?: Category,
      selected?: Category[],
      flavor?: "playful" | "grounded",
    ) => {
      if (browsing.current) return;
      browsing.current = true;
      setPromptBusy(true);
      try {
        await update((d) => {
          const cats = selected ?? d.studio.categories;
          const compositionEnabled =
            d.studio.composeResult ??
            d.studio.result?.compositionEnabled ??
            true;
          const { snapshot, usage } = generatePrompt(
            {
              categories: cats,
              count: d.studio.playerCount,
              flavor: flavor ?? d.studio.flavor,
              contentLevel: studioContentLevel(
                d.studio.contentLevel,
                d.preferences,
              ),
              style: d.studio.generationStyle,
              previous: d.studio.result,
              only,
              usage: d.usage,
              compositionEnabled,
            },
            seededRng(Date.now() >>> 0),
          );
          snapshot.jokeTopic = null;
          const entry = {
            id: uuid(),
            createdAt: new Date().toISOString(),
            label: "Recent inspiration",
            snapshot,
            playerCount: d.studio.playerCount,
          };
          return {
            ...d,
            studio: {
              ...d.studio,
              flavor: flavor ?? d.studio.flavor,
              categories: cats,
              composeResult: compositionEnabled,
              result: snapshot,
              promptNavigation: appendPromptNavigation(
                selected || flavor ? null : d.studio.result,
                selected || flavor ? undefined : d.studio.promptNavigation,
                studioPromptContext(
                  {
                    ...d.studio,
                    categories: cats,
                    flavor: flavor ?? d.studio.flavor,
                    composeResult: compositionEnabled,
                  },
                  d.preferences.classroomDefault,
                ),
                snapshot,
              ),
            },
            usage,
            promptHistory: [entry, ...d.promptHistory].slice(0, 30),
          };
        });
        setToast("");
      } catch (error) {
        setToast(
          error instanceof Error
            ? error.message
            : "Could not generate this prompt.",
        );
      } finally {
        browsing.current = false;
        setPromptBusy(false);
      }
    },
    [update],
  );
  const browse = async (direction: -1 | 1) => {
    if (browsing.current) return;
    browsing.current = true;
    setPromptBusy(true);
    try {
      await update((d) => {
        if (!d.studio.result)
          throw Error("Generate a prompt before browsing history.");
        const current = currentPromptNavigation(
          d.studio.result,
          d.studio.promptNavigation,
          studioPromptContext(d.studio, d.preferences.classroomDefault),
        );
        const next = stepPromptNavigation(current, direction);
        const result = next.snapshots[next.index];
        if (!studioSnapshotAllowed(result, d.preferences))
          throw Error(
            "This previous prompt is hidden by your content settings.",
          );
        return {
          ...d,
          studio: {
            ...d.studio,
            result: structuredClone(result),
            promptNavigation: next,
          },
        };
      });
      setToast("");
    } catch (error) {
      setToast(
        error instanceof Error ? error.message : "Could not open this prompt.",
      );
    } finally {
      browsing.current = false;
      setPromptBusy(false);
    }
  };
  const nextPrompt = () => (canForward ? void browse(1) : void generate());
  useEffect(() => {
    if (!ready || initial.current) return;
    initial.current = true;
    if (!studio.result)
      queueMicrotask(() => {
        void generate();
      });
  }, [ready, studio.result, generate]);
  const toggle = async (c: Category) => {
    await update((d) => {
      const active = d.studio.categories.includes(c);
      const cats = active
        ? d.studio.categories.filter((x) => x !== c)
        : [...d.studio.categories, c];
      const result = structuredClone(d.studio.result);
      const compositionEnabled =
        d.studio.composeResult ?? result?.compositionEnabled ?? true;
      if (result) {
        result.jokeTopic = null;
        result.compositionEnabled = compositionEnabled;
      }
      if (active && result) {
        delete result.entries[c];
        if (c === "relationship") result.relationship = null;
        return {
          ...d,
          studio: {
            ...d.studio,
            categories: cats,
            composeResult: compositionEnabled,
            promptNavigation: undefined,
            result: result ? refreshComposition(result) : result,
          },
        };
      }
      const { snapshot, usage } = generatePrompt(
        {
          categories: cats,
          count: d.studio.playerCount,
          style: d.studio.generationStyle,
          previous: result,
          flavor: d.studio.flavor,
          contentLevel: studioContentLevel(
            d.studio.contentLevel,
            d.preferences,
          ),
          only: c,
          usage: d.usage,
          compositionEnabled,
        },
        seededRng(Date.now() >>> 0),
      );
      return {
        ...d,
        studio: {
          ...d.studio,
          categories: cats,
          composeResult: compositionEnabled,
          promptNavigation: undefined,
          result: snapshot,
        },
        usage,
      };
    });
  };
  const lock = async (c: Category) => {
    await update((d) => {
      const result = structuredClone(d.studio.result);
      if (result?.entries[c])
        result.entries[c].locked = !result.entries[c].locked;
      return {
        ...d,
        studio: {
          ...d.studio,
          promptNavigation: undefined,
          result: result ? refreshComposition(result) : result,
        },
      };
    });
  };
  const count = async (n: number) => {
    if (
      studio.result?.entries.relationship?.locked &&
      studio.result.relationship?.assignments.length !== n
    ) {
      setWarning(
        "Unlock Relationship before changing the performer count. Its saved role assignments will stay intact until you do.",
      );
      return;
    }
    await update((d) => {
      let result = structuredClone(d.studio.result);
      if (result?.relationship) {
        if (!relationshipCompatible(result, n)) {
          delete result.entries.relationship;
          result.relationship = null;
        } else {
          const template = [...relationships, ...sourceRelationships].find(
            (r) => r.id === result?.relationship?.templateId,
          )!;
          result.relationship.assignments = Array.from(
            { length: n },
            (_, i) => ({
              playerId: `Player ${i + 1}`,
              roleText: relationshipRoleText(template, i),
            }),
          );
        }
      }
      return {
        ...d,
        studio: {
          ...d.studio,
          playerCount: n,
          promptNavigation: undefined,
          result: result ? refreshComposition(result) : result,
        },
      };
    });
    setWarning("");
    if (
      studio.categories.includes("relationship") &&
      !relationshipCompatible(studio.result, n)
    )
      await generate("relationship");
  };
  const setComposition = async (enabled: boolean) => {
    await update((d) => {
      const result = structuredClone(d.studio.result);
      if (result) result.compositionEnabled = enabled;
      return {
        ...d,
        studio: {
          ...d.studio,
          composeResult: enabled,
          promptNavigation: undefined,
          result: result ? refreshComposition(result) : result,
        },
      };
    });
  };
  const save = async () => {
    if (!studio.result) return;
    await update((d) => ({
      ...d,
      savedPrompts: [
        {
          id: uuid(),
          createdAt: new Date().toISOString(),
          label: "A scene worth keeping",
          snapshot: refreshComposition(structuredClone(d.studio.result!)),
          playerCount: d.studio.playerCount,
        },
        ...d.savedPrompts,
      ],
    }));
    setToast("Saved exactly as you see it.");
  };
  const changeContentLevel = async (
    level: PartyLevel,
    confirmAdults = false,
  ) => {
    try {
      await update((d) => ({
        ...d,
        preferences: confirmAdults
          ? {
              ...d.preferences,
              matureOptIn: true,
              matureConfirmedAt: new Date().toISOString(),
            }
          : d.preferences,
        studio: {
          ...d.studio,
          contentLevel: level,
          promptNavigation: undefined,
        },
      }));
      setAdult(false);
      await generate();
    } catch (error) {
      setToast(
        error instanceof Error
          ? error.message
          : "Could not change the content level.",
      );
    }
  };
  const copy = async () => {
    if (!studio.result) return;
    const text =
      promptText(studio.result) || "An open scene. Start with an offer.";
    try {
      if (Platform.OS === "web" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setToast("Copied. Go make something.");
      } else await Share.share({ message: text });
    } catch {
      setToast(
        "Sharing is unavailable here. Your cards are still saved locally.",
      );
    }
  };
  if (studio.result && !studioSnapshotAllowed(studio.result, data.preferences))
    return (
      <Page narrow>
        <Txt serif size={32}>
          Prompt Studio
        </Txt>
        <Card>
          <Txt>
            {data.preferences.classroomDefault
              ? "This saved prompt is hidden while Classroom clean is on."
              : "This saved prompt is hidden while adult comedy is off."}
          </Txt>
          <Button
            onPress={() => {
              void update((d) => ({
                ...d,
                studio: {
                  ...d.studio,
                  result: null,
                  promptNavigation: undefined,
                },
              })).then(() => generate());
            }}
          >
            Generate clean ingredients
          </Button>
          <Txt muted size={14}>
            Your saved original stays unchanged.
          </Txt>
        </Card>
      </Page>
    );
  return (
    <Page
      compact
      presentation={large}
      dock={
        <Row
          style={{
            width: "100%",
            maxWidth: 1160,
            alignSelf: "center",
            flexWrap: "nowrap",
            gap: 8,
          }}
        >
          <Button
            style={{ flex: 1, paddingHorizontal: 10 }}
            disabled={promptBusy}
            onPress={nextPrompt}
          >
            {canForward ? "Next prompt" : "Generate Again"}
          </Button>
          {!large && (
            <Button
              kind="secondary"
              style={{ flex: 1, paddingHorizontal: 10 }}
              onPress={() => setCustomize(true)}
            >
              Customize
            </Button>
          )}
        </Row>
      }
    >
      <Row style={{ justifyContent: "space-between" }}>
        <Txt serif size={large ? 32 : 26} style={{ flexShrink: 1 }}>
          Prompt Studio
        </Txt>
        <IconButton
          name={large ? "close" : "expand"}
          label={large ? "Exit display" : "Large Display"}
          onPress={() => setLarge(!large)}
        />
      </Row>
      {!large && (
        <>
          <Txt muted size={15}>
            {locationOnly
              ? "One place. You make the scene."
              : "A starting point, not a script. Lock what you love."}
          </Txt>
          {studio.categories.includes("relationship") && (
            <Chip icon="people" onPress={() => setCustomize(true)}>
              {studio.playerCount} roles in this prompt
            </Chip>
          )}
        </>
      )}
      {legacyCategories.length > 0 && (
        <Card style={{ backgroundColor: t.blue }}>
          <Eyebrow>SAVED ORIGINAL</Eyebrow>
          <Txt size={15}>
            These saved words come from an earlier content pack. Your original
            text and locks stay exact.
          </Txt>
          <Txt size={14} muted>
            {legacyLocked
              ? "Unlock the saved originals before updating their ingredients."
              : "Update this editable copy to the current suggestions. Your saved original stays unchanged."}
          </Txt>
          <Button
            kind="secondary"
            disabled={legacyLocked}
            onPress={() =>
              void update((d) => ({
                ...d,
                studio: {
                  ...d.studio,
                  promptNavigation: undefined,
                  result: d.studio.result
                    ? upgradeSnapshotIngredients(d.studio.result)
                    : null,
                },
              }))
            }
          >
            Update ingredients
          </Button>
        </Card>
      )}
      <PromptSwipe
        disabled={promptBusy || customize || presetOpen || !studio.result}
        onPrevious={canPrevious ? () => void browse(-1) : undefined}
        onNext={nextPrompt}
      >
        {studio.result?.jokeTopic ? (
          <Card style={{ backgroundColor: t.lilac }}>
            <Eyebrow>SAVED WORD</Eyebrow>
            <Txt serif size={38}>
              {studio.result.jokeTopic.word}
            </Txt>
            <Txt muted size={14}>
              Choose ingredients or Generate Again for a new scene.
            </Txt>
          </Card>
        ) : studio.categories.length === 0 ? (
          <Card
            style={{
              minHeight: 180,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon name="theater" size={28} />
            <Txt serif size={30}>
              The stage is yours.
            </Txt>
            <Txt muted>No prompts. Make a simple offer.</Txt>
          </Card>
        ) : (
          studio.result && (
            <>
              <ComposedPrompt snapshot={studio.result} large={large} />
              {composeScene(studio.result) && (
                <Eyebrow>YOUR INGREDIENTS</Eyebrow>
              )}
              <PromptCards
                snapshot={studio.result}
                large={large}
                controls
                onLock={(c) => void lock(c)}
                onReroll={(c) => void generate(c)}
              />
            </>
          )
        )}
      </PromptSwipe>
      {studio.result && (
        <Row style={{ gap: 8 }}>
          <Button
            small
            kind="ghost"
            disabled={!canPrevious || promptBusy}
            onPress={() => void browse(-1)}
          >
            Previous prompt
          </Button>
          <Txt muted size={12}>
            Swipe left for next · right for previous
          </Txt>
        </Row>
      )}
      {!!toast && (
        <Txt
          accessibilityLiveRegion="polite"
          size={14}
          style={{ color: t.accentInk }}
        >
          {toast}
        </Txt>
      )}
      <Row>
        <Button
          icon="play"
          onPress={() =>
            router.push({
              pathname: "/start",
              params: {
                mode: "scene_lab",
                activity: "S1",
                studio: "1",
                intent: studio.flavor === "playful" ? "riff" : "practice",
              },
            })
          }
        >
          Act out this prompt
        </Button>
        <Button kind="secondary" icon="bookmark" onPress={() => void save()}>
          Save prompt
        </Button>
        <Button kind="ghost" icon="copy" onPress={() => void copy()}>
          Copy / Share
        </Button>
        {!large && (
          <Button
            kind="ghost"
            icon="grid"
            onPress={() => router.push("/library")}
          >
            Prompt & recipe library
          </Button>
        )}
      </Row>
      {studio.result && (
        <Feedback
          activityId="studio"
          roundId="studio"
          snapshot={studio.result}
        />
      )}
      {!large && (
        <Txt muted size={14}>
          {locationOnly
            ? "One simple place. Add more only if you want."
            : `${studio.categories.length} ${studio.categories.length === 1 ? "ingredient" : "ingredients"} · ${
                studio.flavor === "playful"
                  ? "One playful twist to get you talking."
                  : "Grounded scenes with room to discover something."
              }`}
        </Txt>
      )}
      <Dialog
        visible={customize}
        onClose={() => setCustomize(false)}
        title="Your scene recipe"
      >
        <Txt size={13} muted>
          Unlocked ingredients use {contentLevelLabels[contentLevel]}. Saved and
          locked words keep their original content rating; Classroom clean can
          hide them.
        </Txt>
        <Row>
          {(["clean", "spicy", "18_plus"] as const).map((level) => (
            <Chip
              key={level}
              selected={contentLevel === level}
              disabled={data.preferences.classroomDefault && level !== "clean"}
              onPress={() =>
                level === "18_plus" && !data.preferences.matureOptIn
                  ? setAdult(true)
                  : void changeContentLevel(level)
              }
            >
              {contentLevelLabels[level]}
            </Chip>
          ))}
        </Row>
        <Txt size={14} muted>
          Start with a place. Add other ingredients only if you want them.
          Toggling one keeps the rest intact.
        </Txt>
        <Row>
          {categories.map((c) => (
            <Chip
              key={c}
              selected={studio.categories.includes(c)}
              icon={studio.categories.includes(c) ? "check" : "plus"}
              onPress={() => void toggle(c)}
            >
              {categoryLabels[c]}
            </Chip>
          ))}
        </Row>
        <Toggle
          label="Combine into a scene"
          sub="Optional: show a scene suggestion alongside your ingredients."
          value={composeResult}
          onChange={(enabled) => void setComposition(enabled)}
        />
        {!locationOnly && (
          <Row>
            <Chip
              selected={studio.flavor === "playful"}
              onPress={() => void generate(undefined, undefined, "playful")}
            >
              Playful
            </Chip>
            <Chip
              selected={studio.flavor === "grounded"}
              onPress={() => void generate(undefined, undefined, "grounded")}
            >
              Grounded
            </Chip>
          </Row>
        )}
        <Row>
          <Chip
            selected={
              studio.categories.length === 1 &&
              studio.categories[0] === "relationship"
            }
            onPress={() => void generate(undefined, ["relationship"])}
          >
            Relationship only
          </Chip>
          <Chip
            selected={locationOnly}
            onPress={() => void generate(undefined, ["location"])}
          >
            Location only
          </Chip>
        </Row>
        {studio.categories.length > 1 && (
          <>
            <Eyebrow>HOW TO MIX</Eyebrow>
            <Row>
              <Chip
                selected={studio.generationStyle === "coherent"}
                onPress={() =>
                  void update((d) => ({
                    ...d,
                    studio: {
                      ...d.studio,
                      generationStyle: "coherent",
                      promptNavigation: undefined,
                    },
                  }))
                }
              >
                Connected ideas
              </Chip>
              <Chip
                selected={studio.generationStyle === "independent"}
                onPress={() =>
                  void update((d) => ({
                    ...d,
                    studio: {
                      ...d.studio,
                      generationStyle: "independent",
                      promptNavigation: undefined,
                    },
                  }))
                }
              >
                Mix freely
              </Chip>
            </Row>
            <Txt size={14} muted>
              Connected ideas prioritizes curated matches and shared settings.
              Mix freely permits unexpected combinations. Only your selected
              ingredients appear; locks always come first.
            </Txt>
          </>
        )}
        <Txt weight="bold">Roles in this prompt</Txt>
        <Txt size={14} muted>
          For relationship suggestions, not the number of people you need.
          Writing on your own is welcome.
        </Txt>
        <Counter count={studio.playerCount} onChange={(n) => void count(n)} />
        {!!warning && <Txt style={{ color: t.accentInk }}>{warning}</Txt>}
        <Eyebrow>TEACHER PRESETS</Eyebrow>
        <Row>
          {presets.map(([name, cats]) => (
            <Chip
              key={name}
              onPress={() => {
                void generate(undefined, cats);
              }}
            >
              {name}
            </Chip>
          ))}
          <Chip
            icon="plus"
            onPress={() => {
              setCustomize(false);
              setPresetOpen(true);
            }}
          >
            Save my preset
          </Chip>
        </Row>
        {data.presets.length > 0 && (
          <Row>
            {data.presets.map((p) => (
              <Chip
                key={p.id}
                onPress={() =>
                  void update((d) => ({
                    ...d,
                    studio: { ...p.state, promptNavigation: undefined },
                  }))
                }
              >
                {p.label}
              </Chip>
            ))}
          </Row>
        )}
        <Button onPress={() => setCustomize(false)}>Done</Button>
      </Dialog>
      <Dialog
        visible={adult}
        onClose={() => setAdult(false)}
        title="Adult comedy, by choice"
      >
        <Txt>
          Suggestive, fictional comedy for consenting adults. No touching,
          undressing or personal disclosures. Skip any prompt.
        </Txt>
        <Button onPress={() => void changeContentLevel("18_plus", true)}>
          Everyone is 18+ and agrees
        </Button>
        <Button kind="secondary" onPress={() => setAdult(false)}>
          Keep it clean
        </Button>
      </Dialog>
      <Dialog
        visible={presetOpen}
        onClose={() => setPresetOpen(false)}
        title="Save your recipe"
      >
        <Field label="Preset name" value={label} onChangeText={setLabel} />
        <Button
          onPress={() => {
            void update((d) => ({
              ...d,
              presets: [
                ...d.presets,
                {
                  id: uuid(),
                  label: label.trim() || "My scene recipe",
                  state: structuredClone(d.studio),
                },
              ],
            }));
            setPresetOpen(false);
          }}
        >
          Save preset
        </Button>
      </Dialog>
    </Page>
  );
}
