-- OFF SCRIPT V1 - Local-only SQLite database.
-- Use expo-sqlite SQLiteProvider onInit and PRAGMA user_version migrations.
-- Execute this migration transactionally using appropriate expo-sqlite APIs.
-- Static game and prompt catalogs remain bundled immutable JSON, NOT copied to the database.
-- ALL user data is stored on device; no cloud account or analytics in v1.
-- On opening the DB, BEFORE transaction: PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY NOT NULL,
    display_name TEXT NOT NULL CHECK (length(display_name) BETWEEN 1 AND 40),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('surprise','party_night','just_us','game_show','scene_lab','improv_gym')),
    status TEXT NOT NULL CHECK (status IN ('setup','active','paused','finished')),
    player_count INTEGER NOT NULL CHECK (player_count BETWEEN 2 AND 12),
    settings_json TEXT NOT NULL CHECK (json_valid(settings_json)),
    rng_seed INTEGER NOT NULL,
    content_pack_version TEXT NOT NULL,
    current_round_ordinal INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    finished_at TEXT
);

CREATE TABLE IF NOT EXISTS session_players (
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    player_id TEXT NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
    seat_index INTEGER NOT NULL CHECK (seat_index BETWEEN 0 AND 11),
    is_sitting_out INTEGER NOT NULL DEFAULT 0 CHECK (is_sitting_out IN (0,1)),
    PRIMARY KEY (session_id, player_id),
    UNIQUE (session_id, seat_index)
);

CREATE TABLE IF NOT EXISTS rounds (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    ordinal INTEGER NOT NULL CHECK (ordinal >= 0),
    activity_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('intro','private_reveal','ready','live','paused','review','complete','skipped')),
    assigned_player_ids_json TEXT NOT NULL CHECK (json_valid(assigned_player_ids_json)),
    supporting_player_ids_json TEXT NOT NULL CHECK (json_valid(supporting_player_ids_json)),
    prompt_snapshot_json TEXT NOT NULL CHECK (json_valid(prompt_snapshot_json)),
    selected_variant TEXT NOT NULL,
    remaining_ms INTEGER NOT NULL CHECK (remaining_ms >= 0),
    timer_started_at_epoch_ms INTEGER,
    cue_index INTEGER NOT NULL DEFAULT 0 CHECK (cue_index >= 0),
    started_at TEXT,
    completed_at TEXT,
    UNIQUE (session_id, ordinal)
);

CREATE TABLE IF NOT EXISTS round_participants (
    round_id TEXT NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
    player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    contribution_role TEXT NOT NULL CHECK (contribution_role IN ('performer','support','audience')),
    performance_seconds INTEGER NOT NULL DEFAULT 0 CHECK (performance_seconds >= 0),
    PRIMARY KEY (round_id, player_id)
);

CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL CHECK (length(display_name) BETWEEN 1 AND 40)
);

CREATE TABLE IF NOT EXISTS team_members (
    team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    PRIMARY KEY (team_id, player_id)
);

CREATE TABLE IF NOT EXISTS votes (
    id TEXT PRIMARY KEY NOT NULL,
    round_id TEXT NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
    voter_player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    target_player_id TEXT REFERENCES players(id) ON DELETE CASCADE,
    target_team_id TEXT REFERENCES teams(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL,
    CHECK ((target_player_id IS NOT NULL) + (target_team_id IS NOT NULL) = 1),
    UNIQUE (round_id, voter_player_id)
);

CREATE TABLE IF NOT EXISTS score_awards (
    id TEXT PRIMARY KEY NOT NULL,
    round_id TEXT NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
    target_player_id TEXT REFERENCES players(id) ON DELETE CASCADE,
    target_team_id TEXT REFERENCES teams(id) ON DELETE CASCADE,
    points INTEGER NOT NULL CHECK (points BETWEEN 1 AND 10),
    reason TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    CHECK ((target_player_id IS NOT NULL) + (target_team_id IS NOT NULL) = 1)
);

CREATE TABLE IF NOT EXISTS favorite_activities (
    activity_id TEXT PRIMARY KEY NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS saved_prompts (
    id TEXT PRIMARY KEY NOT NULL,
    label TEXT NOT NULL DEFAULT '',
    snapshot_json TEXT NOT NULL CHECK (json_valid(snapshot_json)),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS prompt_presets (
    id TEXT PRIMARY KEY NOT NULL,
    label TEXT NOT NULL,
    categories_json TEXT NOT NULL CHECK (json_valid(categories_json)),
    generation_style TEXT NOT NULL CHECK (generation_style IN ('independent','coherent')),
    player_count INTEGER NOT NULL CHECK (player_count BETWEEN 2 AND 12),
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS prompt_usage (
    id TEXT PRIMARY KEY NOT NULL,
    category TEXT NOT NULL,
    prompt_id TEXT NOT NULL,
    used_at TEXT NOT NULL,
    session_id TEXT REFERENCES sessions(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS app_preferences (
    key TEXT PRIMARY KEY NOT NULL,
    value_json TEXT NOT NULL CHECK (json_valid(value_json)),
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_updated ON sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_rounds_session ON rounds(session_id, ordinal);
CREATE INDEX IF NOT EXISTS idx_participation_player ON round_participants(player_id, round_id);
CREATE INDEX IF NOT EXISTS idx_prompt_usage_category ON prompt_usage(category, used_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_prompts_created ON saved_prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_votes_round ON votes(round_id);
CREATE INDEX IF NOT EXISTS idx_teams_session ON teams(session_id);
CREATE INDEX IF NOT EXISTS idx_score_awards_round ON score_awards(round_id);

PRAGMA user_version = 1;
