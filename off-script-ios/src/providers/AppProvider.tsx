import * as Crypto from "expo-crypto";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState, Platform } from "react-native";
import { activityById } from "../domain/content";
import {
  PartyComfortSchema,
  PromptSnapshot,
  SessionSettings,
} from "../domain/contracts";
import {
  makePartySession,
  appendPartyCard,
  normalizePartyOptions,
  editPartyRoster,
  type PartyPlayerDraft,
} from "../domain/party";
import type { PartyOptions } from "../domain/party-contracts";
import type { PlayIntent } from "../domain/playbooks";
import { seededRng } from "../domain/random";
import {
  chooseNextActivity,
  currentRound,
  GameAction,
  makeSession,
  prepareRound,
  restoreSession,
  SessionSnapshot,
  transitionRound,
} from "../domain/session";
import { AppData, AppDataSchema, initialData } from "../storage/model";
import { repository } from "../storage/repository";
import { ringNewChoiceBell } from "../audio/new-choice-bell";
export const uuid = () => Crypto.randomUUID();
type Context = {
  data: AppData;
  ready: boolean;
  error: string;
  clearError: () => void;
  update: (f: (d: AppData) => AppData) => Promise<void>;
  start: (
    count: number,
    mode: SessionSettings["mode"],
    names?: string[],
    activity?: string,
    prompt?: PromptSnapshot,
    playIntent?: PlayIntent,
    playFlow?: SessionSettings["playFlow"],
  ) => Promise<string>;
  startParty: (
    count: number,
    names: string[],
    options: PartyOptions,
  ) => Promise<string>;
  editPartyPlayers: (
    sessionId: string,
    players: PartyPlayerDraft[],
  ) => Promise<void>;
  advanceParty: (
    sessionId: string,
    options?: { replay?: boolean; skip?: boolean; recipeId?: string },
  ) => Promise<void>;
  act: (sessionId: string, a: GameAction) => Promise<void>;
  next: (sessionId: string, replay?: boolean) => Promise<void>;
  changeSession: (
    sessionId: string,
    f: (s: SessionSnapshot) => SessionSnapshot,
  ) => Promise<void>;
  favorite: (id: string) => void;
  reset: () => Promise<void>;
};
const C = createContext<Context | null>(null);
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(initialData);
  const ref = useRef(data);
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);
  const loading = useRef(true);
  const [error, setError] = useState("");
  const queue = useRef(Promise.resolve());
  const persist = useCallback((d: AppData) => {
    queue.current = queue.current
      .catch(() => {})
      .then(() => repository.write(d))
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Could not save data.");
        throw e;
      });
    return queue.current;
  }, []);
  const requireHydration = useCallback(() => {
    if (hydrated.current) return;
    const error = new Error(
      "Local data is not ready. Wait for it to open, or clear local data to recover.",
    );
    setError((previous) => previous || error.message);
    throw error;
  }, []);
  const apply = useCallback(
    (d: AppData, save = true) => {
      requireHydration();
      let validated = d;
      if (save)
        try {
          validated = AppDataSchema.parse(d);
        } catch (e) {
          setError(
            e instanceof Error
              ? e.message
              : "That change could not be validated.",
          );
          return Promise.reject(e);
        }
      ref.current = validated;
      setData(validated);
      return save ? persist(validated) : Promise.resolve();
    },
    [persist, requireHydration],
  );
  const update = useCallback(
    async (f: (d: AppData) => AppData) => {
      requireHydration();
      await apply(f(ref.current));
    },
    [apply, requireHydration],
  );
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await repository.initialize();
        const d = await repository.read();
        d.sessions = d.sessions.map(restoreSession);
        if (mounted) {
          ref.current = d;
          hydrated.current = true;
          setData(d);
          setError("");
          setReady(true);
        }
      } catch (e) {
        if (mounted)
          setError(
            e instanceof Error
              ? e.message
              : "Stored data could not be read. Clear local data to recover.",
          );
      } finally {
        if (mounted) loading.current = false;
      }
    })();
    return () => {
      mounted = false;
      hydrated.current = false;
    };
  }, []);
  const changeSession = useCallback(
    (sid: string, f: (s: SessionSnapshot) => SessionSnapshot) =>
      update((d) => ({
        ...d,
        sessions: d.sessions.map((s) =>
          s.id === sid ? { ...f(s), updatedAt: new Date().toISOString() } : s,
        ),
      })),
    [update],
  );
  const act = useCallback(
    async (sid: string, a: GameAction) => {
      const s = ref.current.sessions.find((s) => s.id === sid);
      // Navigation cleanup may arrive after Done; never reactivate finished sessions.
      if (!s || s.status === "finished") return;
      const before = currentRound(s);
      const r = transitionRound(before, a, {
        now: new Date().toISOString(),
        rng: seededRng(
          s.seed +
            before.ordinal * 7919 +
            before.cueIndex * 113 +
            Math.floor(before.elapsedMs) +
            before.turn * 29 +
            before.rngCursor * 104729,
        ),
        id: uuid,
        session: s,
      });
      if (
        r.cue &&
        r.cue.id !== before.cue?.id &&
        (r.status === "live" ||
          (r.status === "review" && r.cue.type === "stop"))
      ) {
        if (a.type === "CALL_CUE" && r.activityId === "G2") {
          void ringNewChoiceBell().catch(() => {
            setError(
              "The New Choice bell could not play. Use the visible cue and check device volume, silent mode, and audio output, then try again.",
            );
          });
        }
        if (
          (s.party
            ? s.party.options.sound
            : ref.current.preferences.soundEnabled) &&
          s.settings.cuePreference !== "visual_only"
        )
          try {
            Speech.stop();
            Speech.speak(r.cue.spokenText ?? r.cue.text, { rate: 0.95 });
          } catch {}
        if (Platform.OS !== "web" && ref.current.preferences.hapticsEnabled)
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success,
          ).catch(() => {});
      }
      const d = {
        ...ref.current,
        sessions: ref.current.sessions.map((x) =>
          x.id === sid
            ? {
                ...x,
                rounds: [...x.rounds.slice(0, -1), r],
                status:
                  r.status === "paused"
                    ? ("paused" as const)
                    : ("active" as const),
              }
            : x,
        ),
      };
      const save =
        a.type !== "TICK" ||
        Math.floor(r.elapsedMs / 3000) !==
          Math.floor(before.elapsedMs / 3000) ||
        r.status !== before.status ||
        r.cueIndex !== before.cueIndex;
      await apply(d, save);
    },
    [apply],
  );
  useEffect(() => {
    let last = performance.now();
    const interval = setInterval(() => {
      const now = performance.now();
      const delta = now - last;
      last = now;
      for (const s of ref.current.sessions) {
        if (currentRound(s)?.status === "live")
          void act(s.id, { type: "TICK", deltaMs: delta }).catch(() => {});
      }
    }, 250);
    const pause = () => {
      Speech.stop();
      for (const s of ref.current.sessions) {
        if (currentRound(s)?.status === "live")
          void act(s.id, { type: "PAUSE" }).catch(() => {});
      }
      last = performance.now();
    };
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") pause();
      else last = performance.now();
    });
    const visibility = () => {
      if (document.hidden) pause();
      else last = performance.now();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") pause();
    };
    if (Platform.OS === "web") {
      document.addEventListener("visibilitychange", visibility);
      window.addEventListener("pagehide", pause);
      window.addEventListener("keydown", key);
    }
    return () => {
      clearInterval(interval);
      sub.remove();
      if (Platform.OS === "web") {
        document.removeEventListener("visibilitychange", visibility);
        window.removeEventListener("pagehide", pause);
        window.removeEventListener("keydown", key);
      }
    };
  }, [act]);
  const start = async (
    count: number,
    mode: SessionSettings["mode"],
    names: string[] = [],
    activity?: string,
    prompt?: PromptSnapshot,
    playIntent?: PlayIntent,
    playFlow: SessionSettings["playFlow"] = "rounds",
  ) => {
    const seed = Crypto.getRandomValues(new Uint32Array(1))[0];
    const s = makeSession(
      count,
      mode,
      ref.current.preferences,
      uuid,
      seed,
      names,
      activity,
      prompt,
      playIntent,
      playFlow,
    );
    await update((d) => ({
      ...d,
      hasPlayed: true,
      preferences: {
        ...d.preferences,
        lastPlayerCount: count,
        lastPlayerNames: s.players.map((p) => p.displayName),
        lastPlayFlow: playFlow,
      },
      sessions: [
        ...d.sessions.map((x) =>
          currentRound(x)?.status === "live" ? restoreSession(x) : x,
        ),
        s,
      ],
    }));
    return s.id;
  };
  const startParty = async (
    count: number,
    names: string[],
    options: PartyOptions,
  ) => {
    const seed = Crypto.getRandomValues(new Uint32Array(1))[0];
    const s = makePartySession(
      count,
      ref.current.preferences,
      names,
      options,
      uuid,
      seed,
    );
    await update((d) => ({
      ...d,
      hasPlayed: true,
      preferences: {
        ...d.preferences,
        lastPlayerCount: count,
        lastPlayerNames: names.map((n) => n.trim().slice(0, 40)),
        lastPartyGroup: {
          count,
          names: names.map((n) => n.trim().slice(0, 40)),
        },
        selectedPartyActivityIds: s.party!.options.selectedActivityIds,
        lastPartyOptions: PartyComfortSchema.parse(s.party!.options),
      },
      sessions: [
        ...d.sessions.map((x) =>
          currentRound(x)?.status === "live" ? restoreSession(x) : x,
        ),
        s,
      ],
    }));
    return s.id;
  };
  const editPartyPlayers: Context["editPartyPlayers"] = async (
    sid,
    players,
  ) => {
    await update((d) => {
      const old = d.sessions.find((s) => s.id === sid);
      if (!old) return d;
      const changed = editPartyRoster(
        old,
        players,
        uuid,
        new Date().toISOString(),
      );
      const names = changed.players.map((p) => p.displayName);
      return {
        ...d,
        preferences: {
          ...d.preferences,
          lastPlayerCount: names.length,
          lastPlayerNames: names,
          lastPartyGroup: { count: names.length, names },
        },
        sessions: d.sessions.map((s) => (s.id === sid ? changed : s)),
      };
    });
  };
  const advanceParty: Context["advanceParty"] = async (sid, options = {}) => {
    await changeSession(sid, (s) => {
      if (!s.party || s.status === "finished") return s;
      const cleanOptions = normalizePartyOptions(
        s.party.options,
        ref.current.preferences.classroomDefault,
      );
      return appendPartyCard(
        { ...s, party: { ...s.party, options: cleanOptions } },
        uuid,
        new Date().toISOString(),
        options,
      );
    });
  };
  const next = async (sid: string, replay = false) => {
    await changeSession(sid, (s) => {
      const r = currentRound(s);
      if (!["review", "complete", "skipped"].includes(r.status)) return s;
      const history = s.rounds.map((x) =>
        x.id === r.id && x.status === "review"
          ? { ...x, status: "complete" as const }
          : x,
      );
      const base = { ...s, rounds: history };
      const a = replay
        ? activityById(r.activityId)
        : chooseNextActivity(
            s.settings,
            ref.current.preferences,
            history,
            seededRng(s.seed + history.length * 104729),
          );
      return {
        ...base,
        status: "active",
        rounds: [
          ...history,
          prepareRound(base, a, uuid, new Date().toISOString()),
        ],
      };
    });
  };
  const reset = async () => {
    try {
      if (loading.current)
        throw new Error(
          "Wait for local data to finish opening before resetting.",
        );
      hydrated.current = false;
      setReady(false);
      await queue.current.catch(() => {});
      await repository.resetAllLocalData();
      const d = initialData();
      await persist(d);
      ref.current = d;
      hydrated.current = true;
      setData(d);
      setReady(true);
      setError("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Local data could not be cleared.",
      );
      throw e;
    }
  };
  return (
    <C.Provider
      value={{
        data,
        ready,
        error,
        clearError: () => setError(""),
        update,
        start,
        startParty,
        editPartyPlayers,
        advanceParty,
        act,
        next,
        changeSession,
        favorite: (id) => {
          void update((d) => ({
            ...d,
            favorites: d.favorites.includes(id)
              ? d.favorites.filter((f) => f !== id)
              : [...d.favorites, id],
          })).catch(() => {});
        },
        reset,
      }}
    >
      {children}
    </C.Provider>
  );
}
export function useApp() {
  const c = useContext(C);
  if (!c) throw Error("App provider missing");
  return c;
}
