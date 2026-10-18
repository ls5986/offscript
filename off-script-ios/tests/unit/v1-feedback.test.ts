import { expect, test } from "vitest";
import { feedbackMessage } from "../../src/domain/feedback";
import { emptyPrompt } from "../../src/domain/prompts";
import type { AppData } from "../../src/storage/model";

const entry = (): AppData["feedback"][number] => ({
  id: "private-feedback-uuid",
  activityId: "S4",
  roundId: "private-round-uuid",
  issue: "unclear",
  rating: "too_hard",
  createdAt: "2026-10-17T20:00:00.000Z",
  snapshot: {
    ...emptyPrompt(),
    entries: {
      relationship: {
        id: "prompt_relationship_005",
        text: "PRIVATE SAVED WORDS",
        locked: true,
      },
    },
    relationship: {
      templateId: "rel_005",
      premise: "PRIVATE PREMISE",
      assignments: [
        { playerId: "private-player-uuid", roleText: "PRIVATE ROLE" },
      ],
    },
  },
});

test("shared feedback contains task identifiers but never auto-includes saved words, roles or identities", () => {
  const report = feedbackMessage(entry(), "1.3.0");
  expect(JSON.parse(report)).toMatchObject({
    app: "Off Script",
    appVersion: "1.3.0",
    activity: "S4",
    issue: "unclear",
    ingredientIds: ["prompt_relationship_005"],
  });
  expect(report).not.toMatch(
    /PRIVATE|private-|roundId|playerId|assignments|locked/,
  );
});

test("unrecognized activity values are not copied verbatim from imported feedback", () => {
  const report = feedbackMessage(
    { ...entry(), activityId: "Alice PRIVATE ROLE" },
    "1.3.0",
  );
  expect(report).not.toMatch(/Alice|PRIVATE/);
  expect(JSON.parse(report).activity).toBe("unknown");
});

test("voluntary notes survive while old ratings remain shareable without extra fields", () => {
  expect(
    JSON.parse(
      feedbackMessage(
        { ...entry(), note: "  The instructions were unclear.  " },
        "1.3.0",
      ),
    ).note,
  ).toBe("The instructions were unclear.");
  const legacy = entry();
  delete legacy.issue;
  delete legacy.snapshot;
  expect(JSON.parse(feedbackMessage(legacy, "1.3.0"))).toEqual({
    app: "Off Script",
    appVersion: "1.3.0",
    activity: "S4",
    issue: "too_hard",
  });
});
