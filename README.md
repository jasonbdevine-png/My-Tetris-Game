# Jason's Tetris

A feature-rich Tetris game built with HTML5 Canvas, JavaScript, and deployed on Cloudflare Pages.

## Project Overview
- **Name**: Jason's Tetris
- **Version**: 2.0
- **Creator**: Jason Devine
- **Built With**: Genspark AI

## URLs
- **Production**: https://jasons-tetris.pages.dev
- **GitHub**: https://github.com/jasonbdevine-png/My-Tetris-Game

## Features

### Core Gameplay
- Classic Tetris mechanics with 7 tetromino shapes (I, O, T, S, Z, J, L)
- SRS (Super Rotation System) with wall kicks
- Ghost piece preview showing landing position
- Hold piece functionality
- 3-piece preview queue
- Lock delay system with reset on movement

### Game Modes
- **Marathon**: Classic endless mode - play until you top out
- **Sprint**: Clear 40 lines as fast as possible
- **Ultra**: Score as high as possible in 2 minutes
- **Zen**: Relaxed mode with no game over

### Advanced Mechanics
- **T-Spin Detection**: Perform T-Spins for bonus points
- **Combo System**: Chain line clears for multiplied scores
- **Counter-Clockwise Rotation**: Full rotation in both directions
- **Lock Delay**: Extra time to move pieces before locking

### Scoring System
- 1 Line: 100 × Level
- 2 Lines: 300 × Level
- 3 Lines: 500 × Level
- Tetris (4 Lines): 800 × Level
- T-Spin Single: 800 × Level
- T-Spin Double: 1200 × Level
- T-Spin Triple: 1600 × Level
- Combo Bonus: 50 × Combo × Level
- Perfect Clear: 3000 × Level
- Soft Drop: 1 point per cell
- Hard Drop: 2 points per cell

### Visual Effects
- Animated background with falling tetris blocks
- Level-based color themes (changes every 5 levels)
- Screen shake on hard drops and tetrises
- Line clear flash animations
- Ghost piece with outlined style

### Audio System
- Background music (Tetris Remix) with loop
- Dynamic music speed (increases with level)
- Sound effects for all actions:
  - Move, Rotate, Hard Drop, Land
  - Line Clear (varies by lines cleared)
  - T-Spin, Combo, Level Up
  - Pause, Game Over, Menu Select
- Separate volume controls for music and SFX
- Mute toggle

### Statistics & Achievements
- Games played, Total lines, Best score
- Tetrises, T-Spins, Perfect clears
- Best combo, Max level, Time played
- 14 achievements to unlock

### Online Leaderboard
- Global leaderboards for each game mode
- Optional username (play offline without account)
- Submit scores to compete globally
- Personal best tracking

### Controls
- **Desktop**: Fully customizable keyboard controls
- **Mobile**: Touch buttons with haptic feedback
- **Swipe Controls**: Swipe gestures on game canvas
- Default Controls:
  - A/Left Arrow: Move Left
  - D/Right Arrow: Move Right
  - W/Up Arrow: Rotate Clockwise
  - Q: Rotate Counter-Clockwise
  - S/Down Arrow: Soft Drop
  - Space: Hard Drop
  - C: Hold Piece
  - P: Pause

### PWA Support
- Installable as a Progressive Web App
- Works offline after first load
- App icons for home screen

## Technology Stack
- **Frontend**: HTML5 Canvas, CSS3, Vanilla JavaScript
- **Backend**: Hono Framework on Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite) for leaderboard
- **Audio**: Web Audio API + HTML5 Audio
- **Deployment**: Cloudflare Pages

## Project Structure
```
webapp/
├── public/
│   ├── index.html          # Main HTML file
│   ├── manifest.json       # PWA manifest
│   ├── sw.js              # Service worker
│   ├── css/
│   │   └── style.css      # All styles
│   ├── js/
│   │   ├── game.js        # Game engine
│   │   └── audio.js       # Audio system
│   ├── audio/
│   │   └── tetris-remix.mp3
│   └── icons/             # PWA icons
├── src/
│   └── index.tsx          # Hono backend with API
├── migrations/
│   └── 0001_leaderboard.sql
├── wrangler.jsonc
├── package.json
└── README.md
```

## API Endpoints
- `GET /api/leaderboard?mode=marathon` - Get leaderboard scores
- `POST /api/leaderboard` - Submit a score
- `GET /api/leaderboard/user/:username` - Get user's best scores
- `GET /api/health` - Health check

## Local Development
```bash
# Install dependencies
npm install

# Apply database migrations (local)
npm run db:migrate:local

# Start development server
npm run build
pm2 start ecosystem.config.cjs

# Access at http://localhost:3000
```

## Deployment
```bash
# Create D1 database (first time only)
npm run db:create

# Apply migrations to production
npm run db:migrate:prod

# Deploy to Cloudflare Pages
npm run deploy:prod
```

## Data Storage
- **LocalStorage Keys**:
  - `jasonsTetrisControls` - Custom key bindings
  - `jasonsTetrisMusicVolume` - Music volume setting
  - `jasonsTetrisSfxVolume` - SFX volume setting
  - `jasonsTetrisHighScores` - Local high scores (top 5)
  - `jasonsTetrisStats` - Player statistics
  - `jasonsTetrisUsername` - Optional username
  - `jasonsTetrisMode` - Last selected game mode

## Credits
- **Created by**: Jason Devine
- **Built with**: Genspark AI
- **Music**: Tetris Remix

---
© 2024 Jason Devine. All rights reserved.
