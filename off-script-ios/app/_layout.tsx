import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { appFonts } from "../src/design/fonts";
import { BrandLockup } from "../src/design/brand";
import { AppProvider } from "../src/providers/AppProvider";
export { ErrorBoundary } from "expo-router";
export default function Layout() {
  const [loaded, error] = useFonts(appFonts);
  React.useEffect(() => {
    if (
      Platform.OS !== "web" ||
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    )
      return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    // Give the first screen and its fonts the connection before offline downloads.
    const schedule = () => {
      timer = setTimeout(() => {
        if (!cancelled)
          navigator.serviceWorker.register("/sw.js").catch((error) => {
            console.warn("Off Script offline caching is unavailable.", error);
          });
      }, 2000);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener("load", schedule);
    };
  }, []);
  if (Platform.OS !== "web" && !loaded && !error)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F8F6F1",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BrandLockup size={42} />
      </View>
    );
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "none",
            contentStyle: { backgroundColor: "#F8F6F1" },
          }}
        />
      </AppProvider>
    </SafeAreaProvider>
  );
}
