import { existsSync, readFileSync } from "node:fs";
import { loadEnvFile } from "node:process";
import type { ExpoConfig } from "expo/config";
import app from "../app.json";
import { configureApp, releaseIssues } from "../app.config";
for (const file of [".env", ".env.local"])
  if (existsSync(file)) loadEnvFile(file);
const strict =
  process.argv.includes("--release") || process.argv.includes("--submit");
const local = process.argv.includes("--local");
if (local && process.argv.includes("--submit"))
  throw Error(
    "Do not combine --local with --submit. Upload local archives with Xcode; --submit validates the EAS submission profile.",
  );
const config = configureApp(app.expo as ExpoConfig, {
  ...process.env,
  EAS_BUILD_PROFILE: undefined,
});
const issues = releaseIssues(config, { requireEasProject: !local });
if (process.argv.includes("--submit")) {
  const eas = JSON.parse(readFileSync("eas.json", "utf8"));
  if (!/^\d+$/.test(eas.submit?.production?.ios?.ascAppId ?? ""))
    issues.push(
      "Set submit.production.ios.ascAppId in eas.json to your numeric App Store Connect app ID.",
    );
}
console.log(
  "Off Script iOS: native React Native / Expo; guest play; on-device SQLite; no app-managed cloud sync.",
);
if (issues.length) {
  console.log("Owner configuration still needed:");
  for (const issue of issues) console.log(`- ${issue}`);
  if (strict) process.exitCode = 1;
} else
  console.log(
    "Build metadata checks passed. Signing, a native compile and physical-device testing are still required.",
  );
console.log(
  "Read START_HERE_IOS.md. This command checks configuration; it does not certify App Store approval.",
);
