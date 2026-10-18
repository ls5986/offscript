import { Card, Eyebrow, Txt, useTheme } from "../design/ui";
import { composeScene, remainingIngredientLabels } from "../domain/composer";
import type { PromptSnapshot } from "../domain/contracts";

export function ComposedPrompt({
  snapshot,
  large = false,
}: {
  snapshot: PromptSnapshot;
  large?: boolean;
}) {
  const t = useTheme();
  const scene = composeScene(snapshot);
  if (!scene) return null;
  return (
    <Card
      style={{ backgroundColor: t.lilac, gap: 12, padding: large ? 32 : 24 }}
    >
      <Eyebrow>
        {scene.remainingCategories.length
          ? "STARTING PREMISE"
          : "SCENE SUGGESTION"}
      </Eyebrow>
      <Txt
        testID="composed-scene"
        accessibilityLiveRegion="polite"
        serif
        size={large ? 46 : 30}
        style={{ lineHeight: large ? 58 : 40 }}
      >
        {scene.text}
      </Txt>
      {scene.remainingCategories.length > 0 && (
        <Txt size={14} muted>
          Also selected below: {remainingIngredientLabels(scene)}.
        </Txt>
      )}
    </Card>
  );
}
