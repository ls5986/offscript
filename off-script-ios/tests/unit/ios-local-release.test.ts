import { spawnSync } from "node:child_process";
import { expect, test } from "vitest";
import type { ExpoConfig } from "expo/config";
import app from "../../app.json";
import { configureApp, releaseIssues } from "../../app.config";

const metadata = {
  OFFSCRIPT_IOS_BUNDLE_ID: "org.offscript.validation",
  OFFSCRIPT_PRIVACY_URL: "https://offscript.validation.org/privacy",
  OFFSCRIPT_SUPPORT_URL: "https://offscript.validation.org/support",
};

test("local Xcode release checks require public owner metadata but not an Expo project", () => {
  const config = configureApp(app.expo as ExpoConfig, metadata);
  expect(releaseIssues(config, { requireEasProject: false })).toEqual([]);
  expect(releaseIssues(config)).toEqual([
    "Set OFFSCRIPT_EAS_PROJECT_ID from your own Expo/EAS project.",
  ]);
});

test("local checks do not bypass missing bundle, privacy, support or valid team requirements", () => {
  const config = configureApp(app.expo as ExpoConfig, {});
  const issues = releaseIssues(config, { requireEasProject: false });
  expect(issues).toHaveLength(3);
  for (const name of [
    "OFFSCRIPT_IOS_BUNDLE_ID",
    "OFFSCRIPT_PRIVACY_URL",
    "OFFSCRIPT_SUPPORT_URL",
  ])
    expect(issues.some((issue) => issue.includes(name))).toBe(true);
  const badTeam = configureApp(app.expo as ExpoConfig, {
    ...metadata,
    OFFSCRIPT_APPLE_TEAM_ID: "invalid",
  });
  expect(
    releaseIssues(badTeam, { requireEasProject: false }).join("\n"),
  ).toContain("OFFSCRIPT_APPLE_TEAM_ID");
});

test("the EAS production profile still refuses a missing Expo project", () => {
  expect(() =>
    configureApp(app.expo as ExpoConfig, {
      ...metadata,
      EAS_BUILD_PROFILE: "production",
    }),
  ).toThrow(/OFFSCRIPT_EAS_PROJECT_ID/);
});

test("the real local CLI accepts complete non-secret local metadata without an EAS project", () => {
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "scripts/check-ios-release.ts", "--release", "--local"],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        ...metadata,
        OFFSCRIPT_EAS_PROJECT_ID: "",
        EAS_BUILD_PROFILE: "",
      },
    },
  );
  expect(result.status, result.stdout + result.stderr).toBe(0);
  expect(result.stdout).toContain("Build metadata checks passed");
});

test("the CLI does not present a local archive as an EAS submission", () => {
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "scripts/check-ios-release.ts", "--local", "--submit"],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        ...metadata,
        OFFSCRIPT_EAS_PROJECT_ID: "",
        EAS_BUILD_PROFILE: "",
      },
    },
  );
  expect(result.status).toBe(1);
  expect(result.stderr).toMatch(/--local.*--submit/);
});
