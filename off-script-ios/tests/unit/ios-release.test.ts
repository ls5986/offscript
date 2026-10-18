import { expect, test } from "vitest";
import type { ExpoConfig } from "expo/config";
import app from "../../app.json";
import { configureApp, isPublicHttps, releaseIssues } from "../../app.config";
import { publicReleaseLinks } from "../../src/config/release";
const base = app.expo as ExpoConfig;
const valid = {
  OFFSCRIPT_IOS_BUNDLE_ID: "org.offscript.validation",
  OFFSCRIPT_EAS_PROJECT_ID: "10000000-0000-4000-8000-000000000000",
  OFFSCRIPT_PRIVACY_URL: "https://offscript.validation.org/privacy",
  OFFSCRIPT_SUPPORT_URL: "https://offscript.validation.org/support",
};
test("the bell config enables playback without microphone or background audio permissions", () => {
  const config = configureApp(base, {});
  expect(config.plugins).toContainEqual([
    "expo-audio",
    {
      microphonePermission: false,
      recordAudioAndroid: false,
      enableBackgroundRecording: false,
      enableBackgroundPlayback: false,
    },
  ]);
});
test("native generation registers Expo's scene lifecycle without enabling multiple windows", () => {
  const config = configureApp(base, {});
  expect(config.plugins).toContain("./plugins/with-scene-lifecycle.cjs");
  expect(config.ios?.infoPlist?.UIApplicationSceneManifest).toEqual({
    UIApplicationSupportsMultipleScenes: false,
    UISceneConfigurations: {
      UIWindowSceneSessionRoleApplication: [
        {
          UISceneConfigurationName: "Default Configuration",
          UISceneDelegateClassName: "EXExpoAppSceneDelegate",
        },
      ],
    },
  });
});
test("development stays runnable without inventing identities; production refuses missing owner metadata", () => {
  const config = configureApp(base, {});
  expect(config.ios?.bundleIdentifier).toBeUndefined();
  expect(config.extra?.eas?.projectId).toBeUndefined();
  expect(releaseIssues(config)).toHaveLength(4);
  expect(() => configureApp(base, { EAS_BUILD_PROFILE: "production" })).toThrow(
    /release configuration/,
  );
  expect(config.ios?.usesAppleSignIn).toBe(false);
  expect(config.ios?.infoPlist?.NSMicrophoneUsageDescription).toBeUndefined();
});
test("owner metadata resolves without secrets and leaves SDK required-reason manifest entries intact", () => {
  const sdkApi = {
    NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryUserDefaults",
    NSPrivacyAccessedAPITypeReasons: ["CA92.1"],
  };
  const config = configureApp(
    {
      ...base,
      ios: {
        ...base.ios,
        privacyManifests: { NSPrivacyAccessedAPITypes: [sdkApi] },
      },
    },
    { ...valid, EAS_BUILD_PROFILE: "production" },
  );
  expect(releaseIssues(config)).toEqual([]);
  expect(config.ios?.privacyManifests?.NSPrivacyAccessedAPITypes).toEqual([
    sdkApi,
  ]);
  expect(config.ios?.privacyManifests?.NSPrivacyTracking).toBe(false);
  expect(config.extra?.release.accountMode).toBe("none");
  expect(config.extra?.release.storageMode).toBe("local");
  expect(publicReleaseLinks(config.extra)).toEqual({
    privacyURL: valid.OFFSCRIPT_PRIVACY_URL,
    supportURL: valid.OFFSCRIPT_SUPPORT_URL,
  });
});
test("placeholder identities and non-public policy pages are rejected before release", () => {
  expect(
    releaseIssues(
      configureApp(base, {
        ...valid,
        OFFSCRIPT_IOS_BUNDLE_ID: "com.example.app",
        OFFSCRIPT_PRIVACY_URL: "http://localhost/privacy",
      }),
    ),
  ).toHaveLength(2);
  for (const value of [
    "https://example.com/privacy",
    "https://127.0.0.1/privacy",
    "javascript:alert(1)",
    "https://user:password@offscript.validation.org",
  ])
    expect(isPublicHttps(value)).toBe(false);
  expect(
    publicReleaseLinks({
      release: {
        privacyURL: "javascript:alert(1)",
        supportURL: "http://localhost",
      },
    }),
  ).toEqual({ privacyURL: null, supportURL: null });
});
