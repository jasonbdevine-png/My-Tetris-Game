# Tetris Game

A classic Tetris-style falling block puzzle game built with HTML5 Canvas, CSS, and vanilla JavaScript. Features an animated Tetris-themed background, custom MP3 background music, customizable controls, and touch controls for mobile play.

## 🌐 Live Demo

**Production URL**: https://jasons-tetris.pages.dev

## 🎮 Features

### Currently Implemented

#### Gameplay
- **Classic Tetris Gameplay**: All 7 standard tetromino shapes (I, O, T, S, Z, J, L) with proper rotation states
- **Ghost Piece**: Shows where the current piece will land
- **Next Piece Preview**: See what's coming next
- **Soft Drop**: Hold down to make pieces fall faster
- **Hard Drop**: Instantly drop piece to the bottom
- **Line Clearing**: Complete rows disappear and score points
- **Level Progression**: Speed increases every 10 lines cleared

#### Visual Design
- **Animated Tetris Background**:
  - Moving grid pattern overlay
  - Falling tetromino blocks animation
  - Colorful tetromino silhouettes floating in background
  - Gradient color scheme matching Tetris colors
- **3D-style blocks** with highlights and shadows
- **Ghost piece preview** showing landing position
- **Responsive design** for all screen sizes

#### Controls

**Default Keyboard Controls:**
| Key | Action |
|-----|--------|
| A / ← | Move piece left |
| D / → | Move piece right |
| W / ↑ | Rotate piece 90° clockwise |
| S / ↓ | Soft drop (move down faster) |
| Space | Hard drop (instant drop) |
| P | Pause/Resume game |

**Touch Controls (Mobile):**
- Left/Right buttons: Move piece horizontally
- Rotate button (purple): Rotate piece clockwise
- Down button: Soft drop
- DROP button (red): Hard drop
- Pause button (orange): Pause/Resume game
- Touch controls support hold-to-repeat for movement

**Custom Control Schemes:**
- Fully customizable key bindings in Settings → Controls tab
- Click any control and press a new key to rebind
- Controls are automatically validated before starting
- Required controls: Move Left, Move Right, Soft Drop, Rotate, Pause
- Reset to defaults option available
- Settings saved to localStorage

#### Audio

**Background Music:**
- Custom MP3 music track ("Tetris Remix")
- Loops continuously during gameplay
- Stops on game over
- Pauses when game is paused

**Sound Effects:**
- Piece landing sound
- Line clear sound (varies by number of lines)
- Tetris (4 lines) gets a special flourish
- Pause/unpause sounds
- Game over sound
- Menu selection sounds
- Move and rotate sounds
- Hard drop sound

**Volume Controls:**
- Separate sliders for music and sound effects
- Available in Settings modal and during gameplay
- Mute button for quick toggle
- Settings persist between sessions

#### Scoring System
- Single line: 100 points × level
- Double: 300 points × level  
- Triple: 500 points × level
- Tetris (4 lines): 800 points × level
- Soft drop: 1 point per cell
- Hard drop: 2 points per cell dropped

#### High Score System
- Top 5 scores saved to localStorage
- Displayed on both title screen and game screen

## 📁 Project Structure

```
webapp/
├── public/
│   ├── index.html          # Main HTML file
│   ├── css/
│   │   └── style.css       # Styling including animated backgrounds
│   ├── js/
│   │   ├── audio.js        # Audio engine (MP3 music + synthesized SFX)
│   │   └── game.js         # Game engine, controls, and logic
│   └── audio/
│       └── tetris-remix.mp3  # Background music track
├── src/
│   └── index.tsx           # Hono server entry point
├── ecosystem.config.cjs    # PM2 configuration
├── wrangler.jsonc          # Cloudflare Pages configuration
├── vite.config.ts          # Vite build configuration
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🚀 Deployment

### URLs
- **Production**: https://jasons-tetris.pages.dev
- **GitHub**: https://github.com/jasonbdevine-png/My-Tetris-Game

### Tech Stack
- **Framework**: Hono
- **Platform**: Cloudflare Pages
- **Build Tool**: Vite

## 💾 Data Storage

The following data is stored in the browser's localStorage:
- `tetrisHighScores`: Array of top 5 high scores
- `tetrisMusicVolume`: Music volume setting (0-100)
- `tetrisSfxVolume`: Sound effects volume setting (0-100)
- `tetrisControls`: Custom key bindings object

## 🔧 Technical Details

- Built with vanilla JavaScript (ES6+)
- Uses HTML5 Canvas for rendering
- Web Audio API for synthesized sound effects
- HTML5 Audio element for MP3 music playback
- CSS animations for background effects
- No external dependencies required (except Google Fonts & Font Awesome via CDN)
- Game runs at ~60 FPS using requestAnimationFrame

## 🎨 Tetromino Colors

- **I-piece**: Cyan (#00f5ff)
- **O-piece**: Yellow (#ffeb3b)
- **T-piece**: Purple (#9c27b0)
- **S-piece**: Green (#4caf50)
- **Z-piece**: Red (#f44336)
- **J-piece**: Blue (#2196f3)
- **L-piece**: Orange (#ff9800)

## 📱 Responsive Design

The game is fully responsive and adapts to different screen sizes:
- **Desktop**: Side panels on left and right, keyboard controls
- **Tablet/Mobile**: Panels stack vertically, touch controls appear automatically

## 📝 Future Enhancements

- Hold piece functionality
- Customizable themes/skins
- Online leaderboard
- Multiplayer mode
- More music tracks
- Combo system
- Counter-clockwise rotation option
