import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import { Platform } from "react-native";

export async function ringNewChoiceBell(): Promise<void> {
  // Keep web playback inside the caller's user gesture.
  if (Platform.OS !== "web")
    await setAudioModeAsync({
      allowsRecording: false,
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: "mixWithOthers",
    });
  const player = createAudioPlayer(
    require("../../assets/new-choice-bell.wav"),
    { updateInterval: 100 },
  );
  return new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timeout);
      subscription.remove();
      player.remove();
    };
    const subscription = player.addListener(
      "playbackStatusUpdate",
      (status) => {
        if (status.error) {
          cleanup();
          reject(new Error(status.error));
        } else if (status.didJustFinish) {
          cleanup();
          resolve();
        }
      },
    );
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Bell playback did not complete."));
    }, 5000);
    try {
      player.play();
    } catch (error) {
      cleanup();
      reject(error);
    }
  });
}
