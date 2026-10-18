import * as SQLite from "expo-sqlite";
import { migration } from "./migration";
import {
  AppData,
  AppDataSchema,
  initialData,
  OffScriptRepository,
} from "./model";
export class NativeRepository implements OffScriptRepository {
  private db: SQLite.SQLiteDatabase | null = null;
  private sessionSignatures = new Map<string, string>();
  private roundSignatures = new Map<string, string>();
  async initialize() {
    this.db = await SQLite.openDatabaseAsync("off-script.db");
    await this.db.execAsync("PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;");
    const v = await this.db.getFirstAsync<{ user_version: number }>(
      "PRAGMA user_version",
    );
    if ((v?.user_version ?? 0) < 1)
      await this.db.withTransactionAsync(async () => {
        await this.db!.execAsync(migration);
      });
  }
  async read() {
    if (!this.db) throw Error("Storage has not opened.");
    const row = await this.db.getFirstAsync<{ value_json: string }>(
      "SELECT value_json FROM app_preferences WHERE key=?",
      "aggregate",
    );
    return row
      ? AppDataSchema.parse(JSON.parse(row.value_json))
      : initialData();
  }
  async write(data: AppData) {
    const d = AppDataSchema.parse(data);
    if (!this.db) throw Error("Storage has not opened.");
    const db = this.db;
    const now = new Date().toISOString();
    const sessions = new Map(this.sessionSignatures);
    const rounds = new Map(this.roundSignatures);
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        "INSERT OR REPLACE INTO app_preferences(key,value_json,updated_at) VALUES(?,?,?)",
        "aggregate",
        JSON.stringify(d),
        now,
      );
      for (const s of d.sessions) {
        const sessionSignature = JSON.stringify(s);
        if (sessions.get(s.id) === sessionSignature) continue;
        sessions.set(s.id, sessionSignature);
        const allPlayers = [...s.players, ...(s.party?.archivedPlayers ?? [])];
        for (const p of allPlayers)
          await db.runAsync(
            "INSERT INTO players(id,display_name,created_at,updated_at) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET display_name=excluded.display_name,updated_at=excluded.updated_at",
            p.id,
            p.displayName,
            now,
            now,
          );
        await db.runAsync(
          "INSERT INTO sessions(id,mode,status,player_count,settings_json,rng_seed,content_pack_version,current_round_ordinal,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET status=excluded.status,player_count=excluded.player_count,settings_json=excluded.settings_json,current_round_ordinal=excluded.current_round_ordinal,updated_at=excluded.updated_at",
          s.id,
          s.settings.mode,
          s.status,
          s.players.filter((p) => !p.isSittingOut).length,
          JSON.stringify(s.settings),
          s.seed,
          s.contentPackVersion,
          s.rounds.length - 1,
          s.createdAt,
          now,
        );
        await db.runAsync(
          "DELETE FROM session_players WHERE session_id=?",
          s.id,
        );
        for (const p of s.players)
          await db.runAsync(
            "INSERT OR REPLACE INTO session_players(session_id,player_id,seat_index,is_sitting_out) VALUES(?,?,?,?)",
            s.id,
            p.id,
            p.seatIndex,
            Number(p.isSittingOut),
          );
        for (const r of s.rounds) {
          const roundSignature = JSON.stringify(r);
          if (rounds.get(r.id) === roundSignature) continue;
          rounds.set(r.id, roundSignature);
          await db.runAsync(
            "INSERT INTO rounds(id,session_id,ordinal,activity_id,status,assigned_player_ids_json,supporting_player_ids_json,prompt_snapshot_json,selected_variant,remaining_ms,timer_started_at_epoch_ms,cue_index,started_at,completed_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET status=excluded.status,assigned_player_ids_json=excluded.assigned_player_ids_json,supporting_player_ids_json=excluded.supporting_player_ids_json,prompt_snapshot_json=excluded.prompt_snapshot_json,remaining_ms=excluded.remaining_ms,cue_index=excluded.cue_index,started_at=excluded.started_at,completed_at=excluded.completed_at",
            r.id,
            s.id,
            r.ordinal,
            r.activityId,
            r.status,
            JSON.stringify(r.performerIds),
            JSON.stringify(r.supportingPlayerIds),
            JSON.stringify(r.promptSnapshot),
            r.variant,
            Math.floor(r.remainingMs),
            null,
            r.cueIndex,
            r.startedAt,
            r.completedAt,
          );
          for (const p of allPlayers)
            await db.runAsync(
              "INSERT OR REPLACE INTO round_participants(round_id,player_id,contribution_role,performance_seconds) VALUES(?,?,?,?)",
              r.id,
              p.id,
              (r.participation[p.id]?.performanceMs ?? 0) > 0 ||
                r.performerIds.includes(p.id)
                ? "performer"
                : r.supportingPlayerIds.includes(p.id)
                  ? "support"
                  : "audience",
              Math.floor(
                (r.participation[p.id]?.performanceMs ??
                  (r.performerIds.includes(p.id) && r.startedAt
                    ? r.elapsedMs
                    : 0)) / 1000,
              ),
            );
        }
        for (const t of s.teams) {
          await db.runAsync(
            "INSERT OR REPLACE INTO teams(id,session_id,display_name) VALUES(?,?,?)",
            t.id,
            s.id,
            t.displayName,
          );
          await db.runAsync("DELETE FROM team_members WHERE team_id=?", t.id);
          for (const pid of t.playerIds)
            await db.runAsync(
              "INSERT OR REPLACE INTO team_members(team_id,player_id) VALUES(?,?)",
              t.id,
              pid,
            );
        }
        for (const award of s.scores)
          await db.runAsync(
            "INSERT OR REPLACE INTO score_awards(id,round_id,target_player_id,target_team_id,points,reason,created_at) VALUES(?,?,?,?,?,?,?)",
            award.id,
            award.roundId,
            award.targetPlayerId,
            award.targetTeamId,
            award.points,
            award.reason,
            now,
          );
        for (const v of s.votes)
          await db.runAsync(
            "INSERT OR REPLACE INTO votes(id,round_id,voter_player_id,target_player_id,target_team_id,created_at) VALUES(?,?,?,?,?,?)",
            v.id,
            v.roundId,
            v.voterPlayerId,
            v.targetPlayerId,
            v.targetTeamId,
            now,
          );
      }
      await db.runAsync("DELETE FROM favorite_activities");
      for (const f of d.favorites)
        await db.runAsync(
          "INSERT INTO favorite_activities(activity_id,created_at) VALUES(?,?)",
          f,
          now,
        );
      await db.runAsync("DELETE FROM saved_prompts");
      for (const p of d.savedPrompts)
        await db.runAsync(
          "INSERT INTO saved_prompts(id,label,snapshot_json,created_at,updated_at) VALUES(?,?,?,?,?)",
          p.id,
          p.label,
          JSON.stringify(p.snapshot),
          p.createdAt,
          now,
        );
      await db.runAsync("DELETE FROM prompt_presets");
      for (const p of d.presets)
        await db.runAsync(
          "INSERT INTO prompt_presets(id,label,categories_json,generation_style,player_count,created_at) VALUES(?,?,?,?,?,?)",
          p.id,
          p.label,
          JSON.stringify(p.state.categories),
          p.state.generationStyle,
          p.state.playerCount,
          now,
        );
    });
    this.sessionSignatures = sessions;
    this.roundSignatures = rounds;
  }
  async resetAllLocalData() {
    if (!this.db) await this.initialize();
    this.sessionSignatures.clear();
    this.roundSignatures.clear();
    await this.db!.withTransactionAsync(async () => {
      await this.db!.execAsync(
        "DELETE FROM votes;DELETE FROM score_awards;DELETE FROM team_members;DELETE FROM teams;DELETE FROM round_participants;DELETE FROM rounds;DELETE FROM session_players;DELETE FROM sessions;DELETE FROM players;DELETE FROM saved_prompts;DELETE FROM favorite_activities;DELETE FROM prompt_presets;DELETE FROM prompt_usage;DELETE FROM app_preferences;",
      );
    });
  }
}
export const repository = new NativeRepository();
