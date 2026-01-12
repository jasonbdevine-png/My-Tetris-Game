-- Leaderboard table for Jason's Tetris
CREATE TABLE IF NOT EXISTS leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    score INTEGER NOT NULL,
    mode TEXT NOT NULL DEFAULT 'marathon',
    level INTEGER DEFAULT 1,
    lines INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_mode_score ON leaderboard(mode, score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_username ON leaderboard(username);
CREATE INDEX IF NOT EXISTS idx_leaderboard_created_at ON leaderboard(created_at DESC);
