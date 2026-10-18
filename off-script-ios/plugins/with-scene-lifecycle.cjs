const { withAppDelegate } = require("expo/config-plugins");

function sceneAppDelegate(source) {
  const legacyClass = "class AppDelegate: ExpoAppDelegate {";
  const sceneClass =
    "class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {";
  const legacyStartup =
    /#if os\(iOS\) \|\| os\(tvOS\)\s+window = UIWindow\(frame: UIScreen\.main\.bounds\)\s+factory\.startReactNative\(\s+withModuleName: "main",\s+in: window,\s+launchOptions: launchOptions\)\s+#endif/;
  const sceneMarker =
    "// ExpoAppSceneDelegate creates the window and starts React Native.";
  if (!source.includes(legacyClass) && !source.includes(sceneClass))
    throw new Error(
      "Off Script scene lifecycle: unsupported AppDelegate class.",
    );
  if (!legacyStartup.test(source) && !source.includes(sceneMarker))
    throw new Error(
      "Off Script scene lifecycle: unsupported React Native startup.",
    );
  return source
    .replace(legacyClass, sceneClass)
    .replace(legacyStartup, sceneMarker);
}

module.exports = function withSceneLifecycle(config) {
  return withAppDelegate(config, (mod) => {
    if (mod.modResults.language !== "swift")
      throw new Error(
        "Off Script scene lifecycle requires the Expo Swift AppDelegate.",
      );
    mod.modResults.contents = sceneAppDelegate(mod.modResults.contents);
    return mod;
  });
};
module.exports.sceneAppDelegate = sceneAppDelegate;
