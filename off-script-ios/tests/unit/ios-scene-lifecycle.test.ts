import { createRequire } from "node:module";
import { expect, test } from "vitest";

const require = createRequire(import.meta.url);
const {
  sceneAppDelegate,
}: {
  sceneAppDelegate: (source: string) => string;
} = require("../../plugins/with-scene-lifecycle.cjs");

const legacy = `import Expo
class AppDelegate: ExpoAppDelegate {
  var window: UIWindow?
  var reactNativeFactory: RCTReactNativeFactory?
  func launch() {
    reactNativeFactory = factory
#if os(iOS) || os(tvOS)
    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: launchOptions)
#endif
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}`;

test("scene generation exposes the existing factory and removes the duplicate legacy window startup", () => {
  const result = sceneAppDelegate(legacy);
  expect(result).toContain(
    "class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {",
  );
  expect(result).not.toContain("window = UIWindow");
  expect(result).not.toContain("factory.startReactNative(");
  expect(result).toContain("reactNativeFactory = factory");
  expect(result).toContain(
    "return super.application(application, didFinishLaunchingWithOptions: launchOptions)",
  );
});

test("repeated prebuilds do not duplicate scene conformance or startup", () => {
  const first = sceneAppDelegate(legacy);
  expect(sceneAppDelegate(first)).toBe(first);
});

test("an unsupported native template fails explicitly instead of shipping a partial scene migration", () => {
  expect(() => sceneAppDelegate("class DifferentAppDelegate {}")).toThrow(
    /unsupported AppDelegate class/,
  );
  expect(() =>
    sceneAppDelegate(legacy.replace("UIScreen.main.bounds", "newWindowBounds")),
  ).toThrow(/unsupported React Native startup/);
});
