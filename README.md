# Jason's Tetris Game

A classic Tetris-style falling block puzzle game built with HTML5 Canvas, CSS, and vanilla JavaScript. Features an animated Tetris-themed background, custom MP3 background music, customizable controls, and touch controls for mobile play.

## URLs

- **Production**: https://jasons-tetris.pages.dev/
- **GitHub**: https://github.com/jasonbdevine-png/My-Tetris-Game

## Features

### Gameplay
- **Classic Tetris Gameplay**: All 7 standard tetromino shapes (I, O, T, S, Z, J, L) with proper rotation states
- **Ghost Piece**: Shows where the current piece will land
- **Next Piece Preview**: See what's coming next
- **Soft Drop**: Hold down to make pieces fall faster
- **Hard Drop**: Instantly drop piece to the bottom
- **Line Clearing**: Complete rows disappear and score points
- **Level Progression**: Speed increases every 10 lines cleared

### Visual Design
- **Animated Tetris Background**: Moving grid pattern, falling tetromino blocks, colorful silhouettes
- **3D-style blocks** with highlights and shadows
- **Ghost piece preview** showing landing position
- **Responsive design** for all screen sizes

### Controls

**Keyboard (Customizable)**:
| Key | Action |
|-----|--------|
| A / ← | Move piece left |
| D / → | Move piece right |
| W / ↑ | Rotate piece 90° clockwise |
| S / ↓ | Soft drop (move down faster) |
| Space | Hard drop (instant drop) |
| P | Pause/Resume game |

**Touch Controls (Mobile)**:
- Left/Right buttons: Move piece horizontally
- Rotate button (purple): Rotate piece clockwise
- Down button: Soft drop
- DROP button (red): Hard drop
- Pause button (orange): Pause/Resume game

### Audio
- **Background Music**: Custom MP3 music track ("Tetris Remix")
- **Sound Effects**: Piece landing, line clear, Tetris (4 lines), pause/unpause, game over, menu selection, move, rotate, hard drop
- **Volume Controls**: Separate sliders for music and sound effects

### Scoring System
- Single line: 100 points × level
- Double: 300 points × level  
- Triple: 500 points × level
- Tetris (4 lines): 800 points × level
- Soft drop: 1 point per cell
- Hard drop: 2 points per cell dropped

### High Score System
- Top 5 scores saved to localStorage

## Tech Stack

- **Framework**: Hono + TypeScript
- **Platform**: Cloudflare Pages
- **Frontend**: Vanilla JavaScript, HTML5 Canvas, CSS3 Animations
- **Audio**: Web Audio API + HTML5 Audio

## Project Structure

```
webapp/
├── src/
│   └── index.tsx          # Hono app - serves static files
├── public/
│   ├── index.html         # Main HTML file
│   ├── css/
│   │   └── style.css      # Styling including animated backgrounds
│   ├── js/
│   │   ├── audio.js       # Audio engine (MP3 music + synthesized SFX)
│   │   └── game.js        # Game engine, controls, and logic
│   └── audio/
│       └── tetris-remix.mp3  # Background music track
├── ecosystem.config.cjs    # PM2 configuration
├── wrangler.jsonc         # Cloudflare configuration
├── vite.config.ts         # Vite configuration
├── package.json           # Dependencies
└── README.md              # This file
```

## Data Storage

All data is stored in browser localStorage:
- `tetrisHighScores`: Array of top 5 high scores
- `tetrisMusicVolume`: Music volume setting (0-100)
- `tetrisSfxVolume`: Sound effects volume setting (0-100)
- `tetrisControls`: Custom key bindings object

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start local development server
npm run dev:sandbox

# Deploy to Cloudflare Pages
npm run deploy:prod
```

## Deployment Status

- **Platform**: Cloudflare Pages
- **Status**: ✅ Active
- **Last Updated**: January 8, 2026
