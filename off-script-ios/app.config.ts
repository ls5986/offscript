import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import type { ConfigContext, ExpoConfig } from "expo/config";
export type ReleaseEnvironment = Record<string, string | undefined>;
export function isPublicHttps(value: string | undefined): boolean {
  if (!value) return false;
  try {
    const u = new URL(value);
    return (
      u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      !/(^|\.)(localhost|example\.(com|org|net))$|\.(invalid|test|localhost)$/.test(
        u.hostname,
      ) &&
      !/^(127\.|0\.|10\.|192\.168\.|\[?::1\]?)/.test(u.hostname)
    );
  } catch {
    return false;
  }
}
/** Public build metadata only. Apple keys, signing material and auth tokens never belong here. */
export function configureApp(
  config: ExpoConfig,
  env: ReleaseEnvironment,
): ExpoConfig {
  const bundle = env.OFFSCRIPT_IOS_BUNDLE_ID || config.ios?.bundleIdentifier;
  const project = env.OFFSCRIPT_EAS_PROJECT_ID || config.extra?.eas?.projectId;
  const privacy =
    env.OFFSCRIPT_PRIVACY_URL || config.extra?.release?.privacyURL;
  const support =
    env.OFFSCRIPT_SUPPORT_URL || config.extra?.release?.supportURL;
  const team = env.OFFSCRIPT_APPLE_TEAM_ID || config.ios?.appleTeamId;
  const result: ExpoConfig = {
    ...config,
    plugins: [
      ...(config.plugins ?? []).filter(
        (plugin) =>
          (typeof plugin === "string" ? plugin : plugin[0]) !== "expo-audio",
      ),
      "./plugins/with-scene-lifecycle.cjs",
      [
        "expo-audio",
        {
          microphonePermission: false,
          recordAudioAndroid: false,
          enableBackgroundRecording: false,
          enableBackgroundPlayback: false,
        },
      ],
    ],
    ios: {
      ...config.ios,
      ...(bundle ? { bundleIdentifier: bundle } : {}),
      ...(team ? { appleTeamId: team } : {}),
      supportsTablet: true,
      usesAppleSignIn: false,
      infoPlist: {
        ...config.ios?.infoPlist,
        // Current app uses OS-provided cryptography only. Reassess if custom encryption is introduced.
        ITSAppUsesNonExemptEncryption: false,
        UIFileSharingEnabled: false,
        LSSupportsOpeningDocumentsInPlace: false,
        UIApplicationSceneManifest: {
          UIApplicationSupportsMultipleScenes: false,
          UISceneConfigurations: {
            UIWindowSceneSessionRoleApplication: [
              {
                UISceneConfigurationName: "Default Configuration",
                UISceneDelegateClassName: "EXExpoAppSceneDelegate",
              },
            ],
          },
        },
      },
      privacyManifests: {
        ...config.ios?.privacyManifests,
        NSPrivacyTracking: false,
        NSPrivacyTrackingDomains: [],
        NSPrivacyCollectedDataTypes: [],
        // SDK required-reason API manifests are aggregated by the native build; do not erase them.
      },
    },
    extra: {
      ...config.extra,
      ...(project ? { eas: { ...config.extra?.eas, projectId: project } } : {}),
      release: {
        privacyURL: privacy || null,
        supportURL: support || null,
        accountMode: "none",
        storageMode: "local",
      },
    },
  };
  if (env.EAS_BUILD_PROFILE === "production") {
    const issues = releaseIssues(result);
    if (issues.length)
      throw new Error(
        `Off Script release configuration is incomplete:\n${issues.join("\n")}`,
      );
  }
  return result;
}
export function releaseIssues(
  config: ExpoConfig,
  { requireEasProject = true } = {},
): string[] {
  const issues: string[] = [];
  const bundle = config.ios?.bundleIdentifier;
  if (
    !bundle ||
    !/^[A-Za-z][A-Za-z0-9-]*(\.[A-Za-z0-9-]+){2,}$/.test(bundle) ||
    /(^|\.)(example|yourcompany|placeholder)(\.|$)/i.test(bundle)
  )
    issues.push(
      "Set OFFSCRIPT_IOS_BUNDLE_ID to your registered, owner-selected bundle ID.",
    );
  if (
    requireEasProject &&
    !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(
      config.extra?.eas?.projectId ?? "",
    )
  )
    issues.push("Set OFFSCRIPT_EAS_PROJECT_ID from your own Expo/EAS project.");
  if (!isPublicHttps(config.extra?.release?.privacyURL))
    issues.push(
      "Set OFFSCRIPT_PRIVACY_URL to your approved public HTTPS privacy policy.",
    );
  if (!isPublicHttps(config.extra?.release?.supportURL))
    issues.push("Set OFFSCRIPT_SUPPORT_URL to your public HTTPS support page.");
  const team = config.ios?.appleTeamId;
  if (team && !/^[A-Z0-9]{10}$/.test(team))
    issues.push(
      "OFFSCRIPT_APPLE_TEAM_ID must be your 10-character Apple team ID, or remain unset for selection in Xcode/EAS.",
    );
  return issues;
}
export default ({ config }: ConfigContext): ExpoConfig => {
  for (const file of [".env", ".env.local"])
    if (existsSync(file)) loadEnvFile(file);
  return configureApp(
    {
      ...config,
      name: config.name ?? "Off Script",
      slug: config.slug ?? "off-script",
    },
    process.env,
  );
};
