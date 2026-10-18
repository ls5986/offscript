import { usePathname, useRouter } from "expo-router";
import ArrowLeft from "lucide-react-native/icons/arrow-left";
import ArrowRight from "lucide-react-native/icons/arrow-right";
import Bookmark from "lucide-react-native/icons/bookmark";
import Check from "lucide-react-native/icons/check";
import CheckCircle from "lucide-react-native/icons/circle-check-big";
import ChevronDown from "lucide-react-native/icons/chevron-down";
import ChevronRight from "lucide-react-native/icons/chevron-right";
import Clock from "lucide-react-native/icons/clock";
import Copy from "lucide-react-native/icons/copy";
import Expand from "lucide-react-native/icons/expand";
import Eye from "lucide-react-native/icons/eye";
import EyeOff from "lucide-react-native/icons/eye-off";
import Flag from "lucide-react-native/icons/flag";
import Grid2X2 from "lucide-react-native/icons/grid-2x2";
import Hand from "lucide-react-native/icons/hand";
import Heart from "lucide-react-native/icons/heart";
import Home from "lucide-react-native/icons/house";
import Lightbulb from "lucide-react-native/icons/lightbulb";
import Lock from "lucide-react-native/icons/lock";
import Mic from "lucide-react-native/icons/mic";
import Minus from "lucide-react-native/icons/minus";
import PartyPopper from "lucide-react-native/icons/party-popper";
import Pause from "lucide-react-native/icons/pause";
import Play from "lucide-react-native/icons/play";
import Plus from "lucide-react-native/icons/plus";
import RefreshCw from "lucide-react-native/icons/refresh-cw";
import RotateCcw from "lucide-react-native/icons/rotate-ccw";
import Search from "lucide-react-native/icons/search";
import Settings from "lucide-react-native/icons/settings";
import Shuffle from "lucide-react-native/icons/shuffle";
import SkipForward from "lucide-react-native/icons/skip-forward";
import Star from "lucide-react-native/icons/star";
import Theater from "lucide-react-native/icons/theater";
import Trash2 from "lucide-react-native/icons/trash";
import Unlock from "lucide-react-native/icons/lock-open";
import Users from "lucide-react-native/icons/users";
import Volume2 from "lucide-react-native/icons/volume-2";
import VolumeX from "lucide-react-native/icons/volume-x";
import X from "lucide-react-native/icons/x";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  Text,
  TextInput,
  TextStyle,
  useColorScheme,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../providers/AppProvider";
import { BrandGlyph, BrandGlyphKind, BrandLockup } from "./brand";
import { playHomePath } from "../config/navigation";
const icons = {
  arrow: ArrowRight,
  back: ArrowLeft,
  shuffle: Shuffle,
  people: Users,
  mic: Mic,
  theater: Theater,
  heart: Heart,
  settings: Settings,
  home: Home,
  grid: Grid2X2,
  plus: Plus,
  minus: Minus,
  check: Check,
  close: X,
  lock: Lock,
  unlock: Unlock,
  refresh: RefreshCw,
  play: Play,
  pause: Pause,
  skip: SkipForward,
  sound: Volume2,
  mute: VolumeX,
  bookmark: Bookmark,
  search: Search,
  clock: Clock,
  down: ChevronDown,
  right: ChevronRight,
  party: PartyPopper,
  expand: Expand,
  copy: Copy,
  flag: Flag,
  eye: Eye,
  hide: EyeOff,
  replay: RotateCcw,
  bulb: Lightbulb,
  hand: Hand,
  star: Star,
  done: CheckCircle,
  trash: Trash2,
};
export type IconName = keyof typeof icons | BrandGlyphKind;
export const palette = {
  navy: "#172B49",
  ink: "#202B3E",
  cream: "#F8F6F1",
  muted: "#555F70",
  line: "#E3E1DC",
  coral: "#E97560",
  lilac: "#EAE5F4",
  blue: "#E4ECF3",
  sage: "#E7EDE2",
};
export function useTheme() {
  const dark = useColorScheme() === "dark";
  return {
    ...palette,
    dark,
    accentInk: dark ? "#F4A18E" : "#AA4234",
    bg: dark ? "#101C2C" : palette.cream,
    ink: dark ? "#F5F1E9" : palette.ink,
    navy: dark ? "#E2EAF5" : palette.navy,
    card: dark ? "#1C2A3E" : "#FFFDF9",
    muted: dark ? "#ABB3C2" : palette.muted,
    line: dark ? "#344156" : palette.line,
    controlLine: dark ? "#7C8BA3" : "#7C8593",
    lilac: dark ? "#332E49" : palette.lilac,
    blue: dark ? "#25384A" : palette.blue,
    sage: dark ? "#293E34" : palette.sage,
  };
}
export function Icon({
  name,
  size = 20,
  color,
  ...props
}: { name: IconName; size?: number; color?: string } & React.ComponentProps<
  typeof ArrowRight
>) {
  const t = useTheme();
  if (!(name in icons))
    return (
      <BrandGlyph
        kind={name as BrandGlyphKind}
        size={size}
        color={color ?? t.ink}
      />
    );
  const C = icons[name as keyof typeof icons];
  return <C size={size} strokeWidth={1.7} color={color ?? t.ink} {...props} />;
}
export function Txt({
  children,
  size = 16,
  muted = false,
  serif = false,
  weight = "normal",
  style,
  numberOfLines,
  ...rest
}: {
  children: React.ReactNode;
  size?: number;
  muted?: boolean;
  serif?: boolean;
  weight?: "normal" | "bold" | "medium";
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
} & React.ComponentProps<typeof Text>) {
  const t = useTheme();
  const { data } = useApp();
  const readableSize = Math.max(size, 12);
  const family = serif
    ? "Fraunces"
    : weight === "bold"
      ? "DMSansBold"
      : weight === "medium"
        ? "DMSansMedium"
        : "DMSans";
  return (
    <Text
      {...rest}
      numberOfLines={numberOfLines}
      style={[
        {
          fontFamily:
            Platform.OS === "web"
              ? `${family}, ${serif ? "Georgia, serif" : "system-ui, -apple-system, sans-serif"}`
              : family,
          fontSize: readableSize * (data.preferences.useLargeText ? 1.18 : 1),
          lineHeight:
            readableSize * 1.43 * (data.preferences.useLargeText ? 1.18 : 1),
          color: muted ? t.muted : t.ink,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
export function Eyebrow({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  const t = useTheme();
  return (
    <Txt
      size={11}
      weight="bold"
      style={{
        letterSpacing: 1.1,
        textTransform: "uppercase",
        color: color ?? t.ink,
      }}
    >
      {children}
    </Txt>
  );
}
export function Button({
  children,
  onPress,
  icon,
  after,
  kind = "primary",
  small = false,
  disabled = false,
  style,
  label,
  testID,
}: {
  children: React.ReactNode;
  onPress: () => void;
  icon?: IconName;
  after?: IconName;
  kind?: "primary" | "secondary" | "ghost" | "coral";
  small?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  label?: string;
  testID?: string;
}) {
  const t = useTheme();
  const primary = kind === "primary";
  const text = primary
    ? t.dark
      ? palette.navy
      : "#fff"
    : kind === "coral"
      ? palette.navy
      : t.ink;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={
        label ?? (typeof children === "string" ? children : undefined)
      }
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          minHeight: small ? 44 : 54,
          minWidth: 44,
          borderRadius: 100,
          paddingHorizontal: small ? 18 : 25,
          paddingVertical: small ? 10 : 13,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          backgroundColor: primary
            ? t.navy
            : kind === "coral"
              ? t.coral
              : kind === "secondary"
                ? t.card
                : "transparent",
          borderWidth: kind === "secondary" ? 1 : 0,
          borderColor: t.controlLine,
          opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
        style,
      ]}
    >
      {icon && <Icon name={icon} size={small ? 17 : 20} color={text} />}
      <Txt
        weight="bold"
        size={small ? 13 : 16}
        style={{
          flexShrink: 1,
          minWidth: 0,
          textAlign: "center",
          color: text,
        }}
      >
        {children}
      </Txt>
      {after && <Icon name={after} size={18} color={text} />}
    </Pressable>
  );
}
export function IconButton({
  name,
  label,
  onPress,
  active = false,
  disabled = false,
}: {
  name: IconName;
  label: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled}
      accessibilityState={{ disabled }}
      style={({ pressed }) => ({
        width: 44,
        height: 44,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: active ? t.lilac : "transparent",
        opacity: disabled ? 0.35 : pressed ? 0.5 : 1,
      })}
    >
      <Icon name={name} color={active ? t.accentInk : t.ink} />
    </Pressable>
  );
}
export function Row({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  return (
    <View
      style={[
        {
          borderWidth: 1,
          borderColor: t.line,
          backgroundColor: t.card,
          borderRadius: 24,
          padding: 26,
          gap: 16,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
export function Chip({
  children,
  selected = false,
  onPress,
  icon,
  disabled = false,
}: {
  children: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onPress: () => void;
  icon?: IconName;
}) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      aria-pressed={selected}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 44,
        minWidth: 44,
        maxWidth: "100%",
        paddingHorizontal: 17,
        paddingVertical: 11,
        borderRadius: 50,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderWidth: 1,
        borderColor: selected ? t.navy : t.controlLine,
        backgroundColor: selected ? t.navy : t.card,
        opacity: disabled ? 0.45 : pressed ? 0.6 : 1,
      })}
    >
      {icon && <Icon name={icon} size={15} color={selected ? t.bg : t.ink} />}
      <Txt
        weight="medium"
        size={13}
        style={{
          flexShrink: 1,
          minWidth: 0,
          color: selected ? t.bg : t.ink,
        }}
      >
        {children}
      </Txt>
    </Pressable>
  );
}
export function Field({
  value,
  onChangeText,
  placeholder,
  label,
  multiline = false,
}: {
  value: string;
  onChangeText: (s: string) => void;
  placeholder?: string;
  label: string;
  multiline?: boolean;
}) {
  const t = useTheme();
  return (
    <TextInput
      accessibilityLabel={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={t.muted}
      multiline={multiline}
      style={{
        fontFamily:
          Platform.OS === "web" ? "DMSans, system-ui, sans-serif" : "DMSans",
        fontSize: 16,
        color: t.ink,
        backgroundColor: t.card,
        borderWidth: 1,
        borderColor: t.controlLine,
        borderRadius: 16,
        minHeight: 52,
        paddingHorizontal: 18,
        paddingVertical: 14,
      }}
    />
  );
}
export function Counter({
  count,
  onChange,
  min = 2,
  max = 12,
}: {
  count: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <Row style={{ justifyContent: "center", gap: 26 }}>
      <Button
        kind="secondary"
        icon="minus"
        label="Fewer players"
        small
        disabled={count <= min}
        onPress={() => onChange(count - 1)}
      >
        {""}
      </Button>
      <Txt size={52} serif accessibilityLiveRegion="polite">
        {count}
      </Txt>
      <Button
        kind="secondary"
        icon="plus"
        label="More players"
        small
        disabled={count >= max}
        onPress={() => onChange(count + 1)}
      >
        {""}
      </Button>
    </Row>
  );
}
export function Toggle({
  label,
  sub,
  value,
  onChange,
}: {
  label: string;
  sub?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      aria-checked={value}
      onPress={() => onChange(!value)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        minHeight: 64,
        paddingVertical: 10,
      }}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <Txt weight="medium">{label}</Txt>
        {sub && (
          <Txt size={13} muted>
            {sub}
          </Txt>
        )}
      </View>
      <View
        style={{
          width: 46,
          height: 28,
          borderRadius: 20,
          backgroundColor: value ? t.navy : t.controlLine,
          padding: 4,
          alignItems: value ? "flex-end" : "flex-start",
        }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            backgroundColor: value ? t.bg : t.card,
            borderRadius: 12,
          }}
        />
      </View>
    </Pressable>
  );
}
export function Disclosure({
  title,
  children,
  initial = false,
}: {
  title: string;
  children: React.ReactNode;
  initial?: boolean;
}) {
  const [open, setOpen] = useState(initial);
  const t = useTheme();
  return (
    <View
      style={{ borderTopWidth: 1, borderColor: t.line, paddingVertical: 12 }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        aria-expanded={open}
        onPress={() => setOpen(!open)}
        style={{
          minHeight: 44,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <Txt weight="bold" style={{ flex: 1 }}>
          {title}
        </Txt>
        <Icon name={open ? "minus" : "plus"} size={18} />
      </Pressable>
      {open && <View style={{ gap: 14, paddingVertical: 12 }}>{children}</View>}
    </View>
  );
}
export function Dialog({
  visible,
  onClose,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const t = useTheme();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#101C2CAA",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <View
          accessibilityViewIsModal
          role="dialog"
          aria-modal={true}
          accessibilityLabel={title}
          style={{
            backgroundColor: t.bg,
            borderRadius: 26,
            padding: 26,
            width: "100%",
            maxWidth: 500,
            gap: 20,
            maxHeight: "88%",
          }}
        >
          <Row style={{ justifyContent: "space-between" }}>
            <Txt serif size={27}>
              {title}
            </Txt>
            <IconButton name="close" label="Close dialog" onPress={onClose} />
          </Row>
          <ScrollView
            key={title}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ gap: 18, paddingBottom: 4 }}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
export function Page({
  children,
  narrow = false,
  presentation = false,
  play = false,
  dock,
  compact = false,
}: {
  children: React.ReactNode;
  narrow?: boolean;
  presentation?: boolean;
  play?: boolean;
  dock?: React.ReactNode;
  compact?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const mobile = width < 720;
  const t = useTheme();
  const router = useRouter();
  const path = usePathname();
  const home = playHomePath(Platform.OS);
  const { ready, error, clearError, reset } = useApp();
  const [resetOpen, setResetOpen] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);
  const links = [
    { path: home, text: "Play", icon: "home" as const },
    { path: "/studio", text: "Prompt Studio", icon: "studio" as const },
    { path: "/games", text: "Explore Games", icon: "grid" as const },
    { path: "/saved", text: "Saved", icon: "bookmark" as const },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      {!presentation && !play && (
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: t.line,
            paddingHorizontal: mobile ? 20 : 40,
            paddingTop: Platform.OS === "ios" ? 52 : 0,
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: 1160,
              alignSelf: "center",
              height: mobile ? 64 : 82,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Off Script home"
              onPress={() => router.push(home)}
              style={{ minHeight: 44, minWidth: 44, justifyContent: "center" }}
            >
              <BrandLockup size={mobile ? 32 : 36} color={t.ink} />
            </Pressable>
            {!mobile && (
              <Row style={{ gap: 30 }}>
                {links.map((l) => (
                  <Pressable
                    key={l.path}
                    accessibilityRole="link"
                    aria-current={path === l.path ? "page" : undefined}
                    onPress={() => router.push(l.path as "/")}
                    style={{ paddingVertical: 14, minWidth: 44, minHeight: 44 }}
                  >
                    <Txt
                      size={13}
                      weight={path === l.path ? "bold" : "normal"}
                      muted={path !== l.path}
                    >
                      {l.text}
                    </Txt>
                  </Pressable>
                ))}
              </Row>
            )}
            <Row style={{ gap: 3 }}>
              <IconButton
                name="settings"
                label="Settings"
                active={path === "/settings"}
                onPress={() => router.push("/settings")}
              />
            </Row>
          </View>
        </View>
      )}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: mobile ? 20 : 40,
          paddingBottom: dock ? 24 : mobile ? 105 : 30,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            width: "100%",
            maxWidth: narrow ? 740 : 1160,
            alignSelf: "center",
            paddingTop: play
              ? Math.max(insets.top, 16)
              : compact
                ? 20
                : mobile
                  ? 26
                  : 40,
            gap: compact ? 18 : 24,
            flex: 1,
          }}
        >
          {!!error && (
            <Card style={{ backgroundColor: t.lilac }}>
              <Txt weight="bold">A local save needs attention</Txt>
              <Txt size={14}>{error}</Txt>
              {ready ? (
                <Button kind="secondary" small onPress={clearError}>
                  Dismiss
                </Button>
              ) : (
                <Button kind="secondary" onPress={() => setResetOpen(true)}>
                  Clear all local data
                </Button>
              )}
            </Card>
          )}
          {ready ? (
            children
          ) : error ? (
            <Txt>
              Normal play is paused until local storage is ready. Clear local
              data only if you want a fresh start.
            </Txt>
          ) : (
            <Txt>Opening your local game box…</Txt>
          )}
        </View>
        {!presentation && !play && !mobile && (
          <Row
            style={{
              maxWidth: 1160,
              width: "100%",
              alignSelf: "center",
              justifyContent: "space-between",
              borderTopWidth: 1,
              borderColor: t.line,
              paddingTop: 25,
              marginTop: 55,
            }}
          >
            <Txt muted size={12}>
              Less scrolling. More laughing.
            </Txt>
            <Row style={{ gap: 8 }}>
              <View
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 3,
                  backgroundColor: t.muted,
                }}
              />
              <Txt muted size={11}>
                Offline friendly · No account needed
              </Txt>
            </Row>
          </Row>
        )}
      </ScrollView>
      {ready && dock && (
        <View
          style={{
            backgroundColor: t.bg,
            borderTopWidth: 1,
            borderColor: t.line,
            paddingHorizontal: mobile ? 16 : 32,
            paddingTop: 12,
            paddingBottom:
              mobile && !play && !presentation
                ? 90
                : Platform.OS === "ios"
                  ? 26
                  : 14,
          }}
        >
          {dock}
        </View>
      )}
      <Dialog
        visible={resetOpen}
        onClose={() => {
          if (!resetBusy) setResetOpen(false);
        }}
        title="Clear all local data?"
      >
        <Txt>
          This removes all sessions, names, scores, favorites, prompts, presets,
          and preferences. Bundled games stay available.
        </Txt>
        <Button
          disabled={resetBusy}
          onPress={() => {
            setResetBusy(true);
            void reset()
              .then(
                () => setResetOpen(false),
                () => setResetOpen(false),
              )
              .finally(() => setResetBusy(false));
          }}
        >
          Delete all local data
        </Button>
        <Button
          kind="secondary"
          disabled={resetBusy}
          onPress={() => setResetOpen(false)}
        >
          Keep my data
        </Button>
      </Dialog>
      {mobile && !presentation && !play && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: t.bg,
            borderTopWidth: 1,
            borderColor: t.line,
            paddingBottom: Platform.OS === "ios" ? 24 : 12,
            paddingTop: 10,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {links.map((l) => (
            <Pressable
              key={l.path}
              accessibilityRole="link"
              aria-current={path === l.path ? "page" : undefined}
              onPress={() => router.push(l.path as "/")}
              style={{
                minWidth: 65,
                minHeight: 45,
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <Icon
                name={l.icon}
                size={20}
                color={path === l.path ? t.accentInk : t.muted}
              />
              <Txt size={10} weight={path === l.path ? "bold" : "normal"}>
                {l.text === "Explore Games"
                  ? "Games"
                  : l.text === "Prompt Studio"
                    ? "Studio"
                    : l.text === "Saved"
                      ? "Saved"
                      : "Play"}
              </Txt>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
export function Back({
  text = "Back",
  onPress,
}: {
  text?: string;
  onPress?: () => void;
}) {
  const router = useRouter();
  return (
    <Row>
      <Button
        small
        kind="ghost"
        icon="back"
        onPress={
          onPress ??
          (() =>
            router.canGoBack()
              ? router.back()
              : router.replace(playHomePath(Platform.OS)))
        }
      >
        {text}
      </Button>
    </Row>
  );
}
export function Title({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  const { width } = useWindowDimensions();
  return (
    <View style={{ gap: 12 }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Txt
        serif
        size={width < 720 ? 38 : 52}
        style={{ lineHeight: width < 720 ? 46 : 62, letterSpacing: -1.4 }}
      >
        {title}
      </Txt>
      {sub && (
        <Txt muted size={16}>
          {sub}
        </Txt>
      )}
    </View>
  );
}
