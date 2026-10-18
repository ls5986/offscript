import { useRouter } from "expo-router";
import { Button, Page, Title } from "../src/design/ui";
import { Platform } from "react-native";
import { playHomePath } from "../src/config/navigation";
export default function Missing() {
  const r = useRouter();
  return (
    <Page>
      <Title eyebrow="A LITTLE OFF SCRIPT" title="Let's find your way back." />
      <Button onPress={() => r.replace(playHomePath(Platform.OS))}>
        Go home
      </Button>
    </Page>
  );
}
