import { useState } from "react";
import { useRouter } from "expo-router";
import { View } from "react-native";
import {
  Button,
  Card,
  Chip,
  Counter,
  Dialog,
  Disclosure,
  Field,
  Page,
  Row,
  Txt,
  Toggle,
  useTheme,
} from "../design/ui";
import {
  categories,
  categoryLabels,
  prompts,
  type Category,
} from "../domain/content";
import {
  contentLevelLabels,
  librarySnapshot,
  promptRecipes,
} from "../domain/library";
import {
  ingredientCategoryTotals,
  libraryBanks,
  libraryInventory,
  libraryInputCount,
  libraryRecipeCount,
  libraryRecords,
  librarySorts,
  livePromptCount,
  queryLibrary,
  ratingLevel,
  recipeInputGroups,
  type LibraryBank,
  type LibraryLevelFilter,
  type LibraryRecord,
  type LibrarySort,
} from "../domain/library-catalog";
import { useApp } from "../providers/AppProvider";

const PAGE_SIZE = 24;
export default function Library() {
  const { data, update } = useApp();
  const router = useRouter();
  const t = useTheme();
  const [bank, setBank] = useState<LibraryBank | "all">("ingredients");
  const [category, setCategory] = useState<Category | undefined>();
  const [search, setSearch] = useState("");
  const [selectedLevel, setLevel] = useState<LibraryLevelFilter>("all");
  const [count, setCount] = useState<number | undefined>();
  const [sort, setSort] = useState<LibrarySort>("source");
  const [page, setPage] = useState(0);
  const [adult, setAdult] = useState(false);
  const [totals, setTotals] = useState(false);
  const [showRecordDetails, setShowRecordDetails] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [recipeInputs, setRecipeInputs] = useState<
    | {
        keys: string[];
        title: string;
        groupCount: number;
        actors: number;
      }
    | undefined
  >();
  const level = data.preferences.classroomDefault ? "clean" : selectedLevel;
  const rows = queryLibrary({
    bank,
    category,
    search,
    count,
    level,
    sort,
    inputKeys: recipeInputs?.keys,
    preferences: data.preferences,
  });
  const bankLabel =
    bank === "all"
      ? "All content"
      : libraryBanks.find((item) => item.id === bank)!.label;
  const bankTotal =
    recipeInputs?.keys.length ??
    libraryRecords.filter((entry) => bank === "all" || entry.bank === bank)
      .length;
  const lastPage = Math.max(0, Math.ceil(rows.length / PAGE_SIZE) - 1);
  const currentPage = Math.min(page, lastPage);
  const visible = rows.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );
  const inspecting =
    showRecordDetails || (bank !== "ingredients" && bank !== "prompt_recipes");
  const changeBank = (next: LibraryBank | "all", nextCategory?: Category) => {
    setBank(next);
    setCategory(nextCategory);
    setSearch("");
    setCount(undefined);
    setRecipeInputs(undefined);
    setPage(0);
    setTotals(false);
  };
  const use = async (entry: LibraryRecord) => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      if (!entry.rating)
        throw new Error(
          "This record has no verified content rating and cannot be used.",
        );
      const roles = Math.max(
        entry.minPlayers,
        Math.min(entry.maxPlayers, count ?? data.studio.playerCount),
      );
      const contentLevel = ratingLevel(entry.rating);
      await update((d) => {
        const snapshot = librarySnapshot(
          entry.ingredientIds ?? [entry.id],
          roles,
          contentLevel,
          d.preferences,
          entry.bank === "prompt_recipes",
        );
        return {
          ...d,
          studio: {
            ...d.studio,
            playerCount: roles,
            contentLevel,
            categories: Object.keys(snapshot.entries) as Category[],
            flavor: "playful",
            generationStyle: "independent",
            composeResult: entry.bank === "prompt_recipes",
            promptNavigation: undefined,
            result: snapshot,
          },
        };
      });
      router.push("/studio");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not open this library prompt.",
      );
    } finally {
      setBusy(false);
    }
  };
  const confirm = async () => {
    try {
      await update((d) => ({
        ...d,
        preferences: {
          ...d.preferences,
          matureOptIn: true,
          matureConfirmedAt: new Date().toISOString(),
        },
      }));
      setLevel("18_plus");
      setPage(0);
      setAdult(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not save adult consent.",
      );
    }
  };
  const showInputs = (entry: LibraryRecord) => {
    const input = recipeInputGroups(entry.id);
    const banks = new Set(input.groups.map((group) => group.bank));
    changeBank(banks.size === 1 ? input.groups[0].bank : "all");
    setLevel("all");
    setRecipeInputs({
      keys: [
        ...new Set(
          input.groups.flatMap((group) =>
            group.ids.map((id) => `${group.bank}:${id}`),
          ),
        ),
      ],
      title: entry.title,
      groupCount: input.groupCount,
      actors: input.actors,
    });
  };
  return (
    <Page compact>
      <View style={{ gap: 4 }}>
        <Txt serif size={28}>
          Prompt & recipe library
        </Txt>
        <Row style={{ justifyContent: "space-between" }}>
          <Txt size={13} muted>
            {livePromptCount.toLocaleString("en-US")} live inputs ·{" "}
            {libraryRecipeCount} recipes
          </Txt>
          <Button
            small
            kind="ghost"
            label="Catalog totals"
            onPress={() => setTotals(true)}
          >
            Totals
          </Button>
        </Row>
      </View>
      <Row>
        <Chip
          selected={bank === "ingredients"}
          onPress={() => changeBank("ingredients")}
        >
          Prompts
        </Chip>
        <Chip
          selected={bank === "prompt_recipes" || bank === "game_recipes"}
          onPress={() => changeBank("prompt_recipes")}
        >
          Recipes
        </Chip>
        <Chip
          selected={
            bank !== "ingredients" &&
            bank !== "prompt_recipes" &&
            bank !== "game_recipes"
          }
          onPress={() => changeBank("all")}
        >
          All content
        </Chip>
      </Row>
      {(bank === "prompt_recipes" || bank === "game_recipes") && (
        <View style={{ gap: 8 }}>
          <Row>
            <Chip
              selected={bank === "prompt_recipes"}
              onPress={() => changeBank("prompt_recipes")}
            >
              Prompt recipes
            </Chip>
            <Chip
              selected={bank === "game_recipes"}
              onPress={() => changeBank("game_recipes")}
            >
              Game recipes
            </Chip>
          </Row>
          <Txt testID="library-recipe-explanation" size={13} muted>
            {bank === "prompt_recipes"
              ? "Prompt recipes are fixed combinations. Use one to open exactly these ingredients in Studio."
              : "Game recipes show how games draw their prompts. Browse the input pools or open the game."}
          </Txt>
        </View>
      )}
      <Row>
        <Chip
          selected={level === "all"}
          onPress={() => {
            setLevel("all");
            setPage(0);
          }}
        >
          All allowed
        </Chip>
        {(["clean", "spicy", "18_plus"] as const).map((choice) => (
          <Chip
            key={choice}
            selected={level === choice}
            disabled={data.preferences.classroomDefault && choice !== "clean"}
            onPress={() => {
              if (choice === "18_plus" && !data.preferences.matureOptIn)
                setAdult(true);
              else {
                setLevel(choice);
                setPage(0);
              }
            }}
          >
            {contentLevelLabels[choice]}
          </Chip>
        ))}
      </Row>
      {data.preferences.classroomDefault ? (
        <Txt muted size={13}>
          Classroom clean is on. Only Clean records are shown.
        </Txt>
      ) : (
        !data.preferences.matureOptIn && (
          <Txt muted size={12}>
            18+ text stays hidden until you confirm adult comedy.
          </Txt>
        )
      )}
      <Field
        label="Search library"
        placeholder={
          inspecting ? "Search wording, IDs or metadata…" : "Search ideas…"
        }
        value={search}
        onChangeText={(value) => {
          setSearch(value);
          setPage(0);
        }}
      />
      <Disclosure title="Filter library">
        <Txt weight="bold">Category</Txt>
        <Row>
          <Chip
            selected={!category}
            onPress={() => {
              setCategory(undefined);
              setPage(0);
            }}
          >
            All categories
          </Chip>
          {categories.map((item) => (
            <Chip
              key={item}
              selected={category === item}
              onPress={() => {
                setCategory(item);
                setPage(0);
              }}
            >
              {categoryLabels[item]}
            </Chip>
          ))}
        </Row>
        <Txt weight="bold">Sort ideas</Txt>
        <Row>
          {librarySorts.map(([value, label]) => (
            <Chip
              key={value}
              selected={sort === value}
              onPress={() => {
                setSort(value);
                setPage(0);
              }}
            >
              {label}
            </Chip>
          ))}
        </Row>
        <Row>
          <Chip
            selected={count === undefined}
            onPress={() => {
              setCount(undefined);
              setPage(0);
            }}
          >
            Any role count
          </Chip>
          <Chip
            selected={count !== undefined}
            onPress={() => {
              setCount(data.studio.playerCount);
              setPage(0);
            }}
          >
            Filter by roles
          </Chip>
        </Row>
        {count !== undefined && (
          <Counter
            count={count}
            onChange={(value) => {
              setCount(value);
              setPage(0);
            }}
          />
        )}
        <Txt muted size={13}>
          Any role count includes every ensemble. Using an ingredient chooses a
          compatible cast.
        </Txt>
        <Disclosure title="Inspect full catalog">
          <Txt size={13} muted>
            Every content bank, including read-only history. Totals and All
            content remain available without changing your prompts.
          </Txt>
          <Row>
            <Chip selected={bank === "all"} onPress={() => changeBank("all")}>
              Every bank
            </Chip>
            {libraryInventory.map((item) => (
              <Chip
                key={item.id}
                selected={bank === item.id}
                onPress={() => changeBank(item.id)}
              >
                {item.label} ({item.count})
              </Chip>
            ))}
          </Row>
          <Toggle
            label="Show IDs and record details"
            sub="Include the authored metadata on prompt and recipe cards."
            value={showRecordDetails}
            onChange={setShowRecordDetails}
          />
        </Disclosure>
        <Button
          small
          kind="secondary"
          onPress={() => {
            setCategory(undefined);
            setCount(undefined);
            setSearch("");
            setSort("source");
            setLevel("all");
            setShowRecordDetails(false);
            setRecipeInputs(undefined);
            setPage(0);
          }}
        >
          Clear filters
        </Button>
      </Disclosure>
      {!!error && <Txt accessibilityLiveRegion="polite">{error}</Txt>}
      <View style={{ gap: 4 }}>
        <Txt testID="library-bank-label" weight="bold">
          {bankLabel}
        </Txt>
        <Txt
          testID="library-results-count"
          size={14}
          accessibilityLiveRegion="polite"
        >
          {rows.length.toLocaleString("en-US")} of{" "}
          {bankTotal.toLocaleString("en-US")} records ·{" "}
          {level === "all" ? "All allowed levels" : contentLevelLabels[level]}
        </Txt>
        {recipeInputs && (
          <Txt muted size={13}>
            Inputs for {recipeInputs.title} at its minimum group:{" "}
            {recipeInputs.groupCount} players, {recipeInputs.actors} performers.
            Counts are eligible input choices, not a count of every possible
            combination.
          </Txt>
        )}
      </View>
      {!rows.length && (
        <Card>
          <Txt>
            No matching records. Try another bank, category, level or search.
          </Txt>
        </Card>
      )}
      <View
        style={{ borderTopWidth: rows.length ? 1 : 0, borderColor: t.line }}
      >
        {visible.map((entry, index) => {
          const historical = libraryBanks.find(
            (item) => item.id === entry.bank,
          )!.historical;
          const recipe =
            entry.bank === "prompt_recipes"
              ? promptRecipes.find((item) => item.id === entry.id)
              : undefined;
          const inputs =
            entry.bank === "game_recipes"
              ? recipeInputGroups(entry.id)
              : undefined;
          const group = entry.category
            ? categoryLabels[entry.category]
            : libraryBanks.find((item) => item.id === entry.bank)!.label;
          const previous = visible[index - 1];
          return (
            <View
              key={entry.key}
              testID="library-list-row"
              style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderColor: t.line,
                gap: 4,
              }}
            >
              {sort === "category" &&
                (!previous ||
                  group !==
                    (previous.category
                      ? categoryLabels[previous.category]
                      : libraryBanks.find((item) => item.id === previous.bank)!
                          .label)) && (
                  <Txt weight="bold" size={13}>
                    {group}
                  </Txt>
                )}
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                  <Txt weight="medium" size={16} testID="catalog-record-title">
                    {entry.title}
                  </Txt>
                  <Txt size={12} muted>
                    {group} ·{" "}
                    {entry.rating
                      ? contentLevelLabels[ratingLevel(entry.rating)]
                      : "Unclassified"}
                    {recipe
                      ? ` · ${recipe.ingredientIds.length} ingredients`
                      : ""}
                    {inputs ? ` · ${libraryInputCount(entry)} inputs` : ""}
                    {historical ? " · Historical, read-only" : ""}
                  </Txt>
                  {inspecting && (
                    <Txt size={12} muted>
                      {entry.id}
                    </Txt>
                  )}
                </View>
                {entry.bank === "ingredients" ||
                entry.bank === "prompt_recipes" ? (
                  <Button
                    small
                    kind="secondary"
                    style={{ paddingHorizontal: 14, borderRadius: 12 }}
                    label={
                      recipe
                        ? `Use recipe ${entry.title}`
                        : `Use ${entry.title}`
                    }
                    disabled={busy}
                    onPress={() => void use(entry)}
                  >
                    Use
                  </Button>
                ) : inputs && inputs.groups.length > 0 ? (
                  <Button
                    small
                    kind="secondary"
                    style={{ paddingHorizontal: 14, borderRadius: 12 }}
                    label={`View inputs for ${entry.id}`}
                    onPress={() => showInputs(entry)}
                  >
                    Inputs
                  </Button>
                ) : (
                  entry.gameId && (
                    <Button
                      small
                      kind="secondary"
                      style={{ paddingHorizontal: 14, borderRadius: 12 }}
                      onPress={() => router.push(`/games/${entry.gameId}`)}
                    >
                      View game
                    </Button>
                  )
                )}
              </View>
              {(recipe || inputs || entry.description) && (
                <Disclosure
                  title={
                    recipe || inputs ? "Recipe details" : "About this game"
                  }
                >
                  {entry.description && (
                    <Txt muted size={14}>
                      {entry.description}
                    </Txt>
                  )}
                  {recipe?.ingredients.map((ingredient) => (
                    <View key={ingredient.id} style={{ gap: 2 }}>
                      <Txt size={12} weight="bold">
                        {categoryLabels[ingredient.category]}
                      </Txt>
                      <Txt size={15}>{ingredient.text}</Txt>
                    </View>
                  ))}
                  {inputs && (
                    <>
                      <Txt size={13}>
                        Minimum group {inputs.groupCount} · {inputs.actors}{" "}
                        performers
                      </Txt>
                      {inputs.groups.map((input) => (
                        <Txt key={`${input.bank}:${input.label}`} size={14}>
                          {input.label}: {input.ids.length} eligible inputs
                        </Txt>
                      ))}
                      {!inputs.groups.length && (
                        <Txt muted size={13}>
                          This game does not draw from an ingredient bank.
                        </Txt>
                      )}
                      <Button
                        small
                        kind="secondary"
                        onPress={() => router.push(`/games/${entry.gameId}`)}
                      >
                        View game
                      </Button>
                    </>
                  )}
                </Disclosure>
              )}
              {(entry.bank === "goals" || entry.bank === "quirks") && (
                <Txt muted size={13}>
                  Authored role possibilities—not the private assignments in any
                  current game.
                </Txt>
              )}
              {inspecting && (
                <Disclosure title="Record details">
                  <Txt testID="catalog-record-data" size={12} selectable>
                    {JSON.stringify(entry.data, null, 2)}
                  </Txt>
                </Disclosure>
              )}
            </View>
          );
        })}
      </View>
      {rows.length > PAGE_SIZE && (
        <Row>
          <Button
            small
            kind="secondary"
            disabled={currentPage === 0}
            onPress={() => setPage(currentPage - 1)}
          >
            Previous ideas
          </Button>
          <Txt size={13}>
            Page {currentPage + 1} of {lastPage + 1}
          </Txt>
          <Button
            small
            kind="secondary"
            disabled={currentPage >= lastPage}
            onPress={() => setPage(currentPage + 1)}
          >
            More ideas
          </Button>
        </Row>
      )}
      <Dialog
        visible={totals}
        onClose={() => setTotals(false)}
        title="Full content inventory"
      >
        <Txt serif size={25}>
          {livePromptCount.toLocaleString("en-US")} live prompt inputs
        </Txt>
        <Txt size={14}>
          {prompts.length.toLocaleString("en-US")} ingredients, plus separate
          advice problems, joke topics, secret goals and guest quirks.
          Relationship templates and historical copies are not counted again as
          new prompts.
        </Txt>
        <Txt weight="bold">
          {libraryRecipeCount} recipes: 14 prompt combinations + 43 game
          variants
        </Txt>
        {libraryInventory.map((item) => (
          <Button
            key={item.id}
            small
            kind="secondary"
            label={`Browse ${item.label} (${item.count})`}
            onPress={() => changeBank(item.id)}
          >
            {item.label} ({item.count.toLocaleString("en-US")})
            {item.historical ? " · history" : ""}
          </Button>
        ))}
        <Txt weight="bold">Current ingredient categories</Txt>
        <Row>
          {ingredientCategoryTotals.map((item) => (
            <Chip
              key={item.category}
              onPress={() => changeBank("ingredients", item.category)}
            >
              {categoryLabels[item.category]} ({item.count})
            </Chip>
          ))}
        </Row>
        <Txt muted size={13}>
          Totals include locked adult records; displayed text still follows
          consent and Classroom clean. Historical records are for inspection,
          not fresh generation.
        </Txt>
      </Dialog>
      <Dialog
        visible={adult}
        onClose={() => setAdult(false)}
        title="Adult comedy, by choice"
      >
        <Txt>
          Suggestive, fictional prompts for consenting adults. No touching,
          undressing or personal disclosures. Skip any idea.
        </Txt>
        <Button onPress={() => void confirm()}>
          Everyone is 18+ and agrees
        </Button>
        <Button kind="secondary" onPress={() => setAdult(false)}>
          Keep it clean
        </Button>
      </Dialog>
    </Page>
  );
}
