// Jason's Tetris - Enhanced Game Engine v2.0

// Game constants
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const NEXT_BLOCK_SIZE = 20;
const HOLD_BLOCK_SIZE = 20;
const PREVIEW_COUNT = 3;

// Colors for tetrominos
const COLORS = {
    I: '#00f5ff',
    O: '#ffeb3b',
    T: '#9c27b0',
    S: '#4caf50',
    Z: '#f44336',
    J: '#2196f3',
    L: '#ff9800'
};

// Level themes (background colors)
const LEVEL_THEMES = [
    { bg: '#0a0a1a', grid: '#1a1a2e', accent: '#4a69bd' }, // 1-5
    { bg: '#0a1a1a', grid: '#1a2e2e', accent: '#2ecc71' }, // 6-10
    { bg: '#1a0a1a', grid: '#2e1a2e', accent: '#9b59b6' }, // 11-15
    { bg: '#1a0a0a', grid: '#2e1a1a', accent: '#e74c3c' }, // 16-20
    { bg: '#1a1a0a', grid: '#2e2e1a', accent: '#f39c12' }  // 21+
];

// Tetromino shapes (SRS rotation system)
const TETROMINOS = {
    I: [
        [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
        [[0,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,1,0]],
        [[0,0,0,0], [0,0,0,0], [1,1,1,1], [0,0,0,0]],
        [[0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]]
    ],
    O: [
        [[1,1], [1,1]],
        [[1,1], [1,1]],
        [[1,1], [1,1]],
        [[1,1], [1,1]]
    ],
    T: [
        [[0,1,0], [1,1,1], [0,0,0]],
        [[0,1,0], [0,1,1], [0,1,0]],
        [[0,0,0], [1,1,1], [0,1,0]],
        [[0,1,0], [1,1,0], [0,1,0]]
    ],
    S: [
        [[0,1,1], [1,1,0], [0,0,0]],
        [[0,1,0], [0,1,1], [0,0,1]],
        [[0,0,0], [0,1,1], [1,1,0]],
        [[1,0,0], [1,1,0], [0,1,0]]
    ],
    Z: [
        [[1,1,0], [0,1,1], [0,0,0]],
        [[0,0,1], [0,1,1], [0,1,0]],
        [[0,0,0], [1,1,0], [0,1,1]],
        [[0,1,0], [1,1,0], [1,0,0]]
    ],
    J: [
        [[1,0,0], [1,1,1], [0,0,0]],
        [[0,1,1], [0,1,0], [0,1,0]],
        [[0,0,0], [1,1,1], [0,0,1]],
        [[0,1,0], [0,1,0], [1,1,0]]
    ],
    L: [
        [[0,0,1], [1,1,1], [0,0,0]],
        [[0,1,0], [0,1,0], [0,1,1]],
        [[0,0,0], [1,1,1], [1,0,0]],
        [[1,1,0], [0,1,0], [0,1,0]]
    ]
};

// Wall kick data (SRS)
const WALL_KICKS = {
    'JLSTZ': [
        [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]],
        [[0,0], [1,0], [1,-1], [0,2], [1,2]],
        [[0,0], [1,0], [1,1], [0,-2], [1,-2]],
        [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]]
    ],
    'I': [
        [[0,0], [-2,0], [1,0], [-2,-1], [1,2]],
        [[0,0], [-1,0], [2,0], [-1,2], [2,-1]],
        [[0,0], [2,0], [-1,0], [2,1], [-1,-2]],
        [[0,0], [1,0], [-2,0], [1,-2], [-2,1]]
    ]
};

// Default key bindings
const DEFAULT_CONTROLS = {
    moveLeft: 'KeyA',
    moveRight: 'KeyD',
    softDrop: 'KeyS',
    rotateCW: 'KeyW',
    rotateCCW: 'KeyQ',
    hardDrop: 'Space',
    hold: 'KeyC',
    pause: 'KeyP'
};

// Achievements
const ACHIEVEMENTS = [
    { id: 'first_tetris', name: 'First Tetris', desc: 'Clear 4 lines at once', icon: 'fa-layer-group', check: (s) => s.tetrises >= 1 },
    { id: 'combo_5', name: 'Combo King', desc: 'Get a 5x combo', icon: 'fa-fire', check: (s) => s.bestCombo >= 5 },
    { id: 'combo_10', name: 'Combo Master', desc: 'Get a 10x combo', icon: 'fa-fire-flame-curved', check: (s) => s.bestCombo >= 10 },
    { id: 'level_10', name: 'Speed Demon', desc: 'Reach level 10', icon: 'fa-bolt', check: (s) => s.maxLevel >= 10 },
    { id: 'level_20', name: 'Legendary', desc: 'Reach level 20', icon: 'fa-crown', check: (s) => s.maxLevel >= 20 },
    { id: 'score_10k', name: 'Ten Thousand', desc: 'Score 10,000 points', icon: 'fa-star', check: (s) => s.bestScore >= 10000 },
    { id: 'score_100k', name: 'Century Club', desc: 'Score 100,000 points', icon: 'fa-gem', check: (s) => s.bestScore >= 100000 },
    { id: 'lines_100', name: 'Line Clearer', desc: 'Clear 100 total lines', icon: 'fa-lines-leaning', check: (s) => s.totalLines >= 100 },
    { id: 'lines_1000', name: 'Line Master', desc: 'Clear 1000 total lines', icon: 'fa-layer-group', check: (s) => s.totalLines >= 1000 },
    { id: 'games_10', name: 'Getting Started', desc: 'Play 10 games', icon: 'fa-gamepad', check: (s) => s.gamesPlayed >= 10 },
    { id: 'games_100', name: 'Dedicated', desc: 'Play 100 games', icon: 'fa-heart', check: (s) => s.gamesPlayed >= 100 },
    { id: 't_spin', name: 'T-Spinner', desc: 'Perform a T-Spin', icon: 'fa-sync', check: (s) => s.tSpins >= 1 },
    { id: 't_spin_10', name: 'T-Spin Pro', desc: 'Perform 10 T-Spins', icon: 'fa-tornado', check: (s) => s.tSpins >= 10 },
    { id: 'perfect_clear', name: 'Perfect Clear', desc: 'Clear the entire board', icon: 'fa-broom', check: (s) => s.perfectClears >= 1 }
];

// Game state
class TetrisGame {
    constructor() {
        this.initElements();
        this.initState();
        this.loadSettings();
        this.setupEventListeners();
        this.drawBoard();
    }

    initElements() {
        // Screen elements
        this.titleScreen = document.getElementById('titleScreen');
        this.gameScreen = document.getElementById('gameScreen');
        this.tetrisBg = document.getElementById('tetrisBg');
        
        // Title screen buttons
        this.playBtn = document.getElementById('playBtn');
        this.gameModeBtn = document.getElementById('gameModeBtn');
        this.leaderboardBtn = document.getElementById('leaderboardBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.statsBtn = document.getElementById('statsBtn');
        this.creditsBtn = document.getElementById('creditsBtn');
        
        // Modals
        this.gameModeModal = document.getElementById('gameModeModal');
        this.leaderboardModal = document.getElementById('leaderboardModal');
        this.settingsModal = document.getElementById('settingsModal');
        this.statsModal = document.getElementById('statsModal');
        this.creditsModal = document.getElementById('creditsModal');
        
        // Close buttons
        this.closeGameModeBtn = document.getElementById('closeGameModeBtn');
        this.closeLeaderboardBtn = document.getElementById('closeLeaderboardBtn');
        this.closeSettingsBtn = document.getElementById('closeSettingsBtn');
        this.closeStatsBtn = document.getElementById('closeStatsBtn');
        this.closeCreditsBtn = document.getElementById('closeCreditsBtn');
        
        // Settings tabs
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // Control settings
        this.keybindBtns = document.querySelectorAll('.keybind-btn');
        this.resetControlsBtn = document.getElementById('resetControlsBtn');
        this.controlsWarning = document.getElementById('controlsWarning');
        
        // Volume controls
        this.musicVolumeSlider = document.getElementById('musicVolume');
        this.sfxVolumeSlider = document.getElementById('sfxVolume');
        this.musicVolumeValue = document.getElementById('musicVolumeValue');
        this.sfxVolumeValue = document.getElementById('sfxVolumeValue');
        this.gameMusicVolumeSlider = document.getElementById('gameMusicVolume');
        this.gameSfxVolumeSlider = document.getElementById('gameSfxVolume');
        
        // Leaderboard
        this.leaderboardList = document.getElementById('leaderboardList');
        this.usernameInput = document.getElementById('usernameInput');
        this.saveUsernameBtn = document.getElementById('saveUsernameBtn');
        this.leaderboardTabBtns = document.querySelectorAll('.leaderboard-tab-btn');
        
        // Canvas setup
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = COLS * BLOCK_SIZE;
        this.canvas.height = ROWS * BLOCK_SIZE;
        this.canvasWrapper = document.getElementById('canvasWrapper');

        // Next piece canvas (larger for preview)
        this.nextCanvas = document.getElementById('nextCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        this.nextCanvas.width = 4 * NEXT_BLOCK_SIZE;
        this.nextCanvas.height = 4 * NEXT_BLOCK_SIZE * PREVIEW_COUNT + (PREVIEW_COUNT - 1) * 5;

        // Hold piece canvas
        this.holdCanvas = document.getElementById('holdCanvas');
        this.holdCtx = this.holdCanvas.getContext('2d');
        this.holdCanvas.width = 4 * HOLD_BLOCK_SIZE;
        this.holdCanvas.height = 4 * HOLD_BLOCK_SIZE;

        // UI elements
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.linesElement = document.getElementById('lines');
        this.highScoreList = document.getElementById('highScoreList');
        this.modeDisplay = document.getElementById('modeDisplay');
        this.comboDisplay = document.getElementById('comboDisplay');
        this.comboCount = document.getElementById('comboCount');
        this.timerDisplay = document.getElementById('timerDisplay');
        this.lineClearEffect = document.getElementById('lineClearEffect');
        
        // Overlays
        this.pauseOverlay = document.getElementById('pauseOverlay');
        this.gameOverOverlay = document.getElementById('gameOverOverlay');
        this.countdownOverlay = document.getElementById('countdownOverlay');
        this.countdownNumber = document.getElementById('countdownNumber');
        this.finalScoreElement = document.getElementById('finalScore');
        this.newHighScoreMsg = document.getElementById('newHighScoreMsg');
        this.submitScoreSection = document.getElementById('submitScoreSection');
        this.submitScoreBtn = document.getElementById('submitScoreBtn');
        this.pauseKeyDisplay = document.getElementById('pauseKeyDisplay');
        
        // Game buttons
        this.restartBtn = document.getElementById('restartBtn');
        this.menuBtn = document.getElementById('menuBtn');
        this.resumeBtn = document.getElementById('resumeBtn');
        this.backToMenuBtn = document.getElementById('backToMenuBtn');
        this.muteBtn = document.getElementById('muteBtn');

        // Touch controls
        this.touchControls = document.getElementById('touchControls');
        this.touchLeft = document.getElementById('touchLeft');
        this.touchRight = document.getElementById('touchRight');
        this.touchDown = document.getElementById('touchDown');
        this.touchRotateCW = document.getElementById('touchRotateCW');
        this.touchRotateCCW = document.getElementById('touchRotateCCW');
        this.touchDrop = document.getElementById('touchDrop');
        this.touchHold = document.getElementById('touchHold');
        this.touchPause = document.getElementById('touchPause');

        // Mode buttons
        this.modeBtns = document.querySelectorAll('.mode-btn');
        
        // Achievements list
        this.achievementsList = document.getElementById('achievementsList');
    }

    initState() {
        // Game state
        this.board = [];
        this.currentPiece = null;
        this.nextPieces = [];
        this.holdPiece = null;
        this.canHold = true;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.isPaused = false;
        this.isPlaying = false;
        this.dropInterval = 1000;
        this.lastDropTime = 0;
        this.animationId = null;
        this.softDropping = false;
        this.listeningForKey = null;
        
        // Lock delay
        this.lockDelay = 500;
        this.lockTimer = 0;
        this.lockMoves = 0;
        this.maxLockMoves = 15;
        this.isLocking = false;
        
        // Combo system
        this.combo = 0;
        this.lastClearWasCombo = false;
        
        // T-Spin detection
        this.lastMoveWasRotation = false;
        this.lastKickUsed = false;
        
        // Game mode
        this.gameMode = 'marathon';
        this.modeTimer = 0;
        this.modeStartTime = 0;
        this.sprintLines = 40;
        this.ultraTime = 120000; // 2 minutes
        
        // Screen shake
        this.shakeIntensity = 0;
        this.shakeDecay = 0.9;
        
        // Line clear animation
        this.clearingLines = [];
        this.clearAnimationFrame = 0;
        
        // Swipe controls
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.lastTouchTime = 0;
        
        // Current leaderboard mode
        this.currentLeaderboardMode = 'marathon';
    }

    loadSettings() {
        // Load controls
        const savedControls = localStorage.getItem('jasonsTetrisControls');
        this.controls = savedControls ? JSON.parse(savedControls) : { ...DEFAULT_CONTROLS };
        
        // Load statistics
        const savedStats = localStorage.getItem('jasonsTetrisStats');
        this.stats = savedStats ? JSON.parse(savedStats) : {
            gamesPlayed: 0,
            totalLines: 0,
            bestScore: 0,
            tetrises: 0,
            bestCombo: 0,
            timePlayed: 0,
            tSpins: 0,
            perfectClears: 0,
            maxLevel: 1,
            achievements: []
        };
        
        // Load high scores
        this.highScores = this.loadHighScores();
        
        // Load username
        this.username = localStorage.getItem('jasonsTetrisUsername') || '';
        if (this.usernameInput) {
            this.usernameInput.value = this.username;
        }
        
        // Load game mode
        const savedMode = localStorage.getItem('jasonsTetrisMode');
        if (savedMode) {
            this.gameMode = savedMode;
            this.updateModeSelection();
        }
        
        // Load volume
        this.loadVolumeSettings();
        
        // Update displays
        this.updateControlDisplays();
        this.displayHighScores();
        this.displayStats();
        this.displayAchievements();
        
        // Check mobile
        this.checkMobile();
    }

    checkMobile() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                        window.matchMedia('(max-width: 900px)').matches ||
                        ('ontouchstart' in window);
        
        if (isMobile && this.touchControls) {
            this.touchControls.classList.add('show-mobile');
        }
        
        window.addEventListener('resize', () => {
            if (window.matchMedia('(max-width: 900px)').matches && this.touchControls) {
                this.touchControls.classList.add('show-mobile');
            }
        });
    }

    loadVolumeSettings() {
        const musicVol = localStorage.getItem('jasonsTetrisMusicVolume');
        const sfxVol = localStorage.getItem('jasonsTetrisSfxVolume');
        
        if (musicVol !== null) {
            if (this.musicVolumeSlider) this.musicVolumeSlider.value = musicVol;
            if (this.gameMusicVolumeSlider) this.gameMusicVolumeSlider.value = musicVol;
            if (this.musicVolumeValue) this.musicVolumeValue.textContent = musicVol + '%';
            audioEngine.setMusicVolume(musicVol / 100);
        }
        
        if (sfxVol !== null) {
            if (this.sfxVolumeSlider) this.sfxVolumeSlider.value = sfxVol;
            if (this.gameSfxVolumeSlider) this.gameSfxVolumeSlider.value = sfxVol;
            if (this.sfxVolumeValue) this.sfxVolumeValue.textContent = sfxVol + '%';
            audioEngine.setSfxVolume(sfxVol / 100);
        }
    }

    saveVolumeSettings() {
        localStorage.setItem('jasonsTetrisMusicVolume', this.musicVolumeSlider.value);
        localStorage.setItem('jasonsTetrisSfxVolume', this.sfxVolumeSlider.value);
    }

    saveControls() {
        localStorage.setItem('jasonsTetrisControls', JSON.stringify(this.controls));
    }

    resetControls() {
        this.controls = { ...DEFAULT_CONTROLS };
        this.saveControls();
        this.updateControlDisplays();
    }

    getKeyDisplayName(code) {
        if (!code) return '?';
        const keyNames = {
            'Space': 'SPC', 'ArrowLeft': '←', 'ArrowRight': '→', 'ArrowUp': '↑', 'ArrowDown': '↓',
            'Enter': 'ENT', 'ShiftLeft': 'LSH', 'ShiftRight': 'RSH', 'ControlLeft': 'LCT',
            'ControlRight': 'RCT', 'AltLeft': 'LAT', 'AltRight': 'RAT', 'Tab': 'TAB',
            'Backspace': 'BSP', 'Escape': 'ESC'
        };
        if (keyNames[code]) return keyNames[code];
        if (code.startsWith('Key')) return code.substring(3);
        if (code.startsWith('Digit')) return code.substring(5);
        if (code.startsWith('Numpad')) return 'N' + code.substring(6);
        return code.substring(0, 3);
    }

    updateControlDisplays() {
        const actions = ['moveLeft', 'moveRight', 'softDrop', 'rotateCW', 'rotateCCW', 'hardDrop', 'hold', 'pause'];
        
        // Update settings modal
        actions.forEach(action => {
            const keyEl = document.getElementById('key' + action.charAt(0).toUpperCase() + action.slice(1));
            if (keyEl) keyEl.textContent = this.getKeyDisplayName(this.controls[action]);
        });

        // Update game screen displays
        const displayMap = {
            'displayMoveLeft': 'moveLeft', 'displayMoveRight': 'moveRight',
            'displayRotateCW': 'rotateCW', 'displayRotateCCW': 'rotateCCW',
            'displaySoftDrop': 'softDrop', 'displayHardDrop': 'hardDrop',
            'displayHold': 'hold', 'displayPause': 'pause'
        };
        
        for (const [id, action] of Object.entries(displayMap)) {
            const el = document.getElementById(id);
            if (el) el.textContent = this.getKeyDisplayName(this.controls[action]);
        }

        if (this.pauseKeyDisplay) {
            this.pauseKeyDisplay.textContent = this.getKeyDisplayName(this.controls.pause);
        }
    }

    validateControls() {
        const required = ['moveLeft', 'moveRight', 'softDrop', 'rotateCW', 'pause'];
        return required.every(action => this.controls[action]);
    }

    updateModeSelection() {
        this.modeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === this.gameMode);
        });
    }

    // ============== Event Listeners ==============
    setupEventListeners() {
        // Title screen buttons
        this.playBtn?.addEventListener('click', () => this.handlePlay());
        this.gameModeBtn?.addEventListener('click', () => this.openModal(this.gameModeModal));
        this.leaderboardBtn?.addEventListener('click', () => {
            this.openModal(this.leaderboardModal);
            this.loadLeaderboard();
        });
        this.settingsBtn?.addEventListener('click', () => this.openModal(this.settingsModal));
        this.statsBtn?.addEventListener('click', () => {
            this.displayStats();
            this.displayAchievements();
            this.openModal(this.statsModal);
        });
        this.creditsBtn?.addEventListener('click', () => this.openModal(this.creditsModal));
        
        // Close buttons
        this.closeGameModeBtn?.addEventListener('click', () => {
            this.closeModal(this.gameModeModal);
            localStorage.setItem('jasonsTetrisMode', this.gameMode);
        });
        this.closeLeaderboardBtn?.addEventListener('click', () => this.closeModal(this.leaderboardModal));
        this.closeSettingsBtn?.addEventListener('click', () => {
            if (this.listeningForKey) {
                this.listeningForKey.classList.remove('listening');
                this.listeningForKey = null;
            }
            this.closeModal(this.settingsModal);
            this.saveVolumeSettings();
            this.controlsWarning?.classList.add('hidden');
        });
        this.closeStatsBtn?.addEventListener('click', () => this.closeModal(this.statsModal));
        this.closeCreditsBtn?.addEventListener('click', () => this.closeModal(this.creditsModal));
        
        // Mode selection
        this.modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.gameMode = btn.dataset.mode;
                this.updateModeSelection();
                audioEngine.playMove();
            });
        });
        
        // Leaderboard tabs
        this.leaderboardTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.leaderboardTabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentLeaderboardMode = btn.dataset.mode;
                this.loadLeaderboard();
            });
        });
        
        // Username
        this.saveUsernameBtn?.addEventListener('click', () => this.saveUsername());
        this.usernameInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveUsername();
        });

        // Settings tabs
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.tabBtns.forEach(b => b.classList.remove('active'));
                this.tabContents.forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(tab + 'Tab')?.classList.add('active');
                audioEngine.playMove();
            });
        });

        // Keybind buttons
        this.keybindBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.listeningForKey && this.listeningForKey !== btn) {
                    this.listeningForKey.classList.remove('listening');
                }
                btn.classList.toggle('listening');
                this.listeningForKey = btn.classList.contains('listening') ? btn : null;
                if (this.listeningForKey) audioEngine.playRotate();
            });
        });

        this.resetControlsBtn?.addEventListener('click', () => {
            audioEngine.playMenuSelect();
            this.resetControls();
            this.controlsWarning?.classList.add('hidden');
        });

        // Key events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // Volume sliders
        this.musicVolumeSlider?.addEventListener('input', (e) => {
            const value = e.target.value;
            if (this.musicVolumeValue) this.musicVolumeValue.textContent = value + '%';
            if (this.gameMusicVolumeSlider) this.gameMusicVolumeSlider.value = value;
            audioEngine.setMusicVolume(value / 100);
        });
        
        this.sfxVolumeSlider?.addEventListener('input', (e) => {
            const value = e.target.value;
            if (this.sfxVolumeValue) this.sfxVolumeValue.textContent = value + '%';
            if (this.gameSfxVolumeSlider) this.gameSfxVolumeSlider.value = value;
            audioEngine.setSfxVolume(value / 100);
        });

        this.gameMusicVolumeSlider?.addEventListener('input', (e) => {
            const value = e.target.value;
            if (this.musicVolumeSlider) this.musicVolumeSlider.value = value;
            if (this.musicVolumeValue) this.musicVolumeValue.textContent = value + '%';
            audioEngine.setMusicVolume(value / 100);
            this.saveVolumeSettings();
        });
        
        this.gameSfxVolumeSlider?.addEventListener('input', (e) => {
            const value = e.target.value;
            if (this.sfxVolumeSlider) this.sfxVolumeSlider.value = value;
            if (this.sfxVolumeValue) this.sfxVolumeValue.textContent = value + '%';
            audioEngine.setSfxVolume(value / 100);
            this.saveVolumeSettings();
        });

        // Game buttons
        this.restartBtn?.addEventListener('click', () => {
            audioEngine.playMenuSelect();
            this.startGame();
        });
        
        this.menuBtn?.addEventListener('click', () => {
            audioEngine.playMenuSelect();
            this.showTitleScreen();
        });
        
        this.resumeBtn?.addEventListener('click', () => this.togglePause());
        this.backToMenuBtn?.addEventListener('click', () => {
            audioEngine.playMenuSelect();
            this.showTitleScreen();
        });
        
        this.muteBtn?.addEventListener('click', () => {
            const isMuted = audioEngine.toggleMute();
            this.muteBtn.innerHTML = isMuted ? 
                '<i class="fas fa-volume-mute"></i>' : 
                '<i class="fas fa-volume-up"></i>';
        });

        this.submitScoreBtn?.addEventListener('click', () => this.submitScore());

        // Touch controls
        this.setupTouchControls();
        this.setupSwipeControls();

        // Prevent context menu on touch
        document.querySelectorAll('.touch-btn').forEach(btn => {
            btn.addEventListener('contextmenu', (e) => e.preventDefault());
        });
    }

    openModal(modal) {
        audioEngine.playMenuSelect();
        modal?.classList.remove('hidden');
    }

    closeModal(modal) {
        audioEngine.playMenuSelect();
        modal?.classList.add('hidden');
    }

    handlePlay() {
        if (!this.validateControls()) {
            audioEngine.playPause();
            this.openModal(this.settingsModal);
            this.tabBtns.forEach(btn => btn.classList.remove('active'));
            this.tabContents.forEach(content => content.classList.remove('active'));
            document.querySelector('[data-tab="controls"]')?.classList.add('active');
            document.getElementById('controlsTab')?.classList.add('active');
            this.controlsWarning?.classList.remove('hidden');
            return;
        }
        audioEngine.playMenuSelect();
        this.showGameScreen();
    }

    handleKeyDown(e) {
        // Keybind listening
        if (this.listeningForKey) {
            e.preventDefault();
            const action = this.listeningForKey.dataset.action;
            const newKey = e.code;
            
            // Check for duplicates and swap
            for (const [existingAction, existingKey] of Object.entries(this.controls)) {
                if (existingKey === newKey && existingAction !== action) {
                    this.controls[existingAction] = this.controls[action];
                }
            }
            
            this.controls[action] = newKey;
            this.saveControls();
            this.updateControlDisplays();
            this.listeningForKey.classList.remove('listening');
            this.listeningForKey = null;
            
            if (this.validateControls()) {
                this.controlsWarning?.classList.add('hidden');
            }
            audioEngine.playMenuSelect();
            return;
        }

        // Title screen
        if (!this.titleScreen?.classList.contains('hidden')) {
            if (e.code === 'Enter' || e.code === 'Space') {
                if (this.validateControls()) {
                    audioEngine.playMenuSelect();
                    this.showGameScreen();
                    e.preventDefault();
                }
            }
            return;
        }

        if (!this.isPlaying || this.gameOver) return;

        // Pause
        if (e.code === this.controls.pause) {
            this.togglePause();
            e.preventDefault();
            return;
        }

        if (this.isPaused) return;

        // Game controls
        if (e.code === this.controls.moveLeft || e.code === 'ArrowLeft') {
            this.movePiece(-1, 0);
            this.lastMoveWasRotation = false;
            audioEngine.playMove();
            e.preventDefault();
        } else if (e.code === this.controls.moveRight || e.code === 'ArrowRight') {
            this.movePiece(1, 0);
            this.lastMoveWasRotation = false;
            audioEngine.playMove();
            e.preventDefault();
        } else if (e.code === this.controls.rotateCW || e.code === 'ArrowUp') {
            this.rotatePiece(1);
            audioEngine.playRotate();
            e.preventDefault();
        } else if (e.code === this.controls.rotateCCW) {
            this.rotatePiece(-1);
            audioEngine.playRotate();
            e.preventDefault();
        } else if (e.code === this.controls.softDrop || e.code === 'ArrowDown') {
            this.softDropping = true;
            if (this.movePiece(0, 1)) {
                this.score += 1;
                this.updateScore();
                this.lastMoveWasRotation = false;
            }
            e.preventDefault();
        } else if (e.code === this.controls.hardDrop) {
            this.hardDrop();
            e.preventDefault();
        } else if (e.code === this.controls.hold) {
            this.holdCurrentPiece();
            e.preventDefault();
        }
    }

    handleKeyUp(e) {
        if (e.code === this.controls.softDrop || e.code === 'ArrowDown') {
            this.softDropping = false;
        }
    }

    setupTouchControls() {
        const setupHoldAction = (element, action, interval = 100) => {
            if (!element) return;
            let holdInterval = null;
            
            const startAction = (e) => {
                e.preventDefault();
                action();
                holdInterval = setInterval(action, interval);
            };
            
            const stopAction = () => {
                if (holdInterval) {
                    clearInterval(holdInterval);
                    holdInterval = null;
                }
            };
            
            element.addEventListener('touchstart', startAction);
            element.addEventListener('touchend', stopAction);
            element.addEventListener('touchcancel', stopAction);
            element.addEventListener('mousedown', startAction);
            element.addEventListener('mouseup', stopAction);
            element.addEventListener('mouseleave', stopAction);
        };

        setupHoldAction(this.touchLeft, () => {
            if (this.isPlaying && !this.isPaused && !this.gameOver) {
                this.movePiece(-1, 0);
                this.lastMoveWasRotation = false;
                audioEngine.playMove();
                this.triggerHaptic('light');
            }
        }, 80);

        setupHoldAction(this.touchRight, () => {
            if (this.isPlaying && !this.isPaused && !this.gameOver) {
                this.movePiece(1, 0);
                this.lastMoveWasRotation = false;
                audioEngine.playMove();
                this.triggerHaptic('light');
            }
        }, 80);

        setupHoldAction(this.touchDown, () => {
            if (this.isPlaying && !this.isPaused && !this.gameOver) {
                if (this.movePiece(0, 1)) {
                    this.score += 1;
                    this.updateScore();
                    this.lastMoveWasRotation = false;
                }
            }
        }, 50);

        const singlePress = (element, action) => {
            if (!element) return;
            const handler = (e) => {
                e.preventDefault();
                if (this.isPlaying && !this.isPaused && !this.gameOver) action();
            };
            element.addEventListener('touchstart', handler);
            element.addEventListener('click', handler);
        };

        singlePress(this.touchRotateCW, () => {
            this.rotatePiece(1);
            audioEngine.playRotate();
            this.triggerHaptic('light');
        });

        singlePress(this.touchRotateCCW, () => {
            this.rotatePiece(-1);
            audioEngine.playRotate();
            this.triggerHaptic('light');
        });

        singlePress(this.touchDrop, () => this.hardDrop());
        singlePress(this.touchHold, () => this.holdCurrentPiece());

        this.touchPause?.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.isPlaying && !this.gameOver) this.togglePause();
        });
        this.touchPause?.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.isPlaying && !this.gameOver) this.togglePause();
        });
    }

    setupSwipeControls() {
        if (!this.canvas) return;
        
        this.canvas.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            this.lastTouchTime = Date.now();
        });

        this.canvas.addEventListener('touchend', (e) => {
            if (!this.isPlaying || this.isPaused || this.gameOver) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - this.touchStartX;
            const deltaY = touchEndY - this.touchStartY;
            const deltaTime = Date.now() - this.lastTouchTime;
            
            const minSwipe = 30;
            
            // Double tap for hard drop
            if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 300) {
                // Quick tap = rotate
                this.rotatePiece(1);
                audioEngine.playRotate();
            } else if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipe) {
                // Horizontal swipe
                if (deltaX > 0) {
                    this.movePiece(1, 0);
                } else {
                    this.movePiece(-1, 0);
                }
                this.lastMoveWasRotation = false;
                audioEngine.playMove();
            } else if (deltaY > minSwipe && Math.abs(deltaY) > Math.abs(deltaX)) {
                // Swipe down = soft drop
                if (this.movePiece(0, 1)) {
                    this.score += 1;
                    this.updateScore();
                    this.lastMoveWasRotation = false;
                }
            } else if (deltaY < -minSwipe && Math.abs(deltaY) > Math.abs(deltaX)) {
                // Swipe up = hard drop
                this.hardDrop();
            }
        });
    }

    // ============== Game Logic ==============
    showTitleScreen() {
        this.gameScreen?.classList.add('hidden');
        this.titleScreen?.classList.remove('hidden');
        audioEngine.stopMusic();
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.isPlaying = false;
        this.gameOver = false;
        this.isPaused = false;
        this.hideOverlays();
        
        // Reset theme
        this.updateTheme(1);
    }

    showGameScreen() {
        this.titleScreen?.classList.add('hidden');
        this.gameScreen?.classList.remove('hidden');
        this.startCountdown();
    }

    startCountdown() {
        this.countdownOverlay?.classList.remove('hidden');
        let count = 3;
        if (this.countdownNumber) this.countdownNumber.textContent = count;
        
        const countInterval = setInterval(() => {
            count--;
            if (count > 0) {
                if (this.countdownNumber) this.countdownNumber.textContent = count;
                audioEngine.playMove();
            } else {
                clearInterval(countInterval);
                this.countdownOverlay?.classList.add('hidden');
                this.startGame();
            }
        }, 800);
    }

    startGame() {
        this.initBoard();
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.combo = 0;
        this.gameOver = false;
        this.isPaused = false;
        this.isPlaying = true;
        this.dropInterval = 1000;
        this.lastDropTime = 0;
        this.holdPiece = null;
        this.canHold = true;
        this.clearingLines = [];
        this.lastMoveWasRotation = false;
        this.lastKickUsed = false;
        this.modeStartTime = Date.now();

        // Mode setup
        this.modeDisplay.textContent = this.gameMode.toUpperCase();
        this.timerDisplay?.classList.toggle('hidden', this.gameMode !== 'ultra' && this.gameMode !== 'sprint');
        this.comboDisplay?.classList.add('hidden');

        this.updateScore();
        this.hideOverlays();
        this.updateTheme(1);

        // Initialize pieces
        this.nextPieces = [];
        for (let i = 0; i < PREVIEW_COUNT + 1; i++) {
            this.nextPieces.push(this.createPiece());
        }
        this.spawnPiece();

        // Draw hold piece (empty)
        this.drawHoldPiece();

        audioEngine.startMusic();

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.gameLoop(0);
    }

    initBoard() {
        this.board = [];
        for (let row = 0; row < ROWS; row++) {
            this.board[row] = new Array(COLS).fill(null);
        }
    }

    createPiece() {
        const types = Object.keys(TETROMINOS);
        const type = types[Math.floor(Math.random() * types.length)];
        return {
            type: type,
            shape: TETROMINOS[type][0],
            rotation: 0,
            x: Math.floor(COLS / 2) - Math.ceil(TETROMINOS[type][0][0].length / 2),
            y: 0,
            color: COLORS[type]
        };
    }

    spawnPiece() {
        this.currentPiece = this.nextPieces.shift();
        this.nextPieces.push(this.createPiece());
        
        this.currentPiece.x = Math.floor(COLS / 2) - Math.ceil(this.currentPiece.shape[0].length / 2);
        this.currentPiece.y = 0;
        
        this.canHold = true;
        this.isLocking = false;
        this.lockTimer = 0;
        this.lockMoves = 0;
        this.lastMoveWasRotation = false;
        this.lastKickUsed = false;

        if (!this.isValidMove(0, 0)) {
            this.endGame();
        }

        this.drawNextPieces();
    }

    isValidMove(offsetX, offsetY, newShape = null) {
        const shape = newShape || this.currentPiece.shape;
        const newX = this.currentPiece.x + offsetX;
        const newY = this.currentPiece.y + offsetY;

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const x = newX + col;
                    const y = newY + row;

                    if (x < 0 || x >= COLS || y >= ROWS) return false;
                    if (y >= 0 && this.board[y][x]) return false;
                }
            }
        }
        return true;
    }

    movePiece(offsetX, offsetY) {
        if (this.isValidMove(offsetX, offsetY)) {
            this.currentPiece.x += offsetX;
            this.currentPiece.y += offsetY;
            
            // Reset lock delay on successful move
            if (this.isLocking && this.lockMoves < this.maxLockMoves) {
                this.lockTimer = 0;
                this.lockMoves++;
            }
            
            return true;
        }
        return false;
    }

    rotatePiece(direction) {
        const type = this.currentPiece.type;
        let newRotation = (this.currentPiece.rotation + direction + 4) % 4;
        const newShape = TETROMINOS[type][newRotation];

        // Get wall kick data
        const kickData = type === 'I' ? WALL_KICKS['I'] : WALL_KICKS['JLSTZ'];
        const kickIndex = direction === 1 ? this.currentPiece.rotation : newRotation;
        const kicks = kickData[kickIndex];

        for (let i = 0; i < kicks.length; i++) {
            const [kickX, kickY] = kicks[i];
            const testX = direction === 1 ? kickX : -kickX;
            const testY = direction === 1 ? -kickY : kickY;
            
            if (this.isValidMove(testX, testY, newShape)) {
                this.currentPiece.x += testX;
                this.currentPiece.y += testY;
                this.currentPiece.shape = newShape;
                this.currentPiece.rotation = newRotation;
                this.lastMoveWasRotation = true;
                this.lastKickUsed = i > 0;
                
                // Reset lock delay on rotation
                if (this.isLocking && this.lockMoves < this.maxLockMoves) {
                    this.lockTimer = 0;
                    this.lockMoves++;
                }
                
                return true;
            }
        }
        return false;
    }

    holdCurrentPiece() {
        if (!this.canHold) return;
        
        audioEngine.playHold();
        this.triggerHaptic('light');
        
        if (this.holdPiece) {
            // Swap
            const temp = this.holdPiece;
            this.holdPiece = {
                type: this.currentPiece.type,
                shape: TETROMINOS[this.currentPiece.type][0],
                rotation: 0,
                color: this.currentPiece.color
            };
            this.currentPiece = {
                ...temp,
                x: Math.floor(COLS / 2) - Math.ceil(temp.shape[0].length / 2),
                y: 0
            };
        } else {
            this.holdPiece = {
                type: this.currentPiece.type,
                shape: TETROMINOS[this.currentPiece.type][0],
                rotation: 0,
                color: this.currentPiece.color
            };
            this.spawnPiece();
        }
        
        this.canHold = false;
        this.isLocking = false;
        this.lockTimer = 0;
        this.lockMoves = 0;
        this.drawHoldPiece();
    }

    hardDrop() {
        let dropDistance = 0;
        while (this.movePiece(0, 1)) {
            dropDistance++;
        }
        this.score += dropDistance * 2;
        audioEngine.playHardDrop();
        this.addScreenShake(5);
        this.triggerHaptic('heavy');
        this.lockPiece();
    }

    // Haptic feedback for mobile devices
    triggerHaptic(type = 'light') {
        if ('vibrate' in navigator) {
            switch (type) {
                case 'light':
                    navigator.vibrate(10);
                    break;
                case 'medium':
                    navigator.vibrate(25);
                    break;
                case 'heavy':
                    navigator.vibrate([30, 10, 30]);
                    break;
                case 'success':
                    navigator.vibrate([20, 50, 20, 50, 30]);
                    break;
            }
        }
    }

    lockPiece() {
        const shape = this.currentPiece.shape;
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const x = this.currentPiece.x + col;
                    const y = this.currentPiece.y + row;
                    if (y >= 0) {
                        this.board[y][x] = this.currentPiece.color;
                    }
                }
            }
        }

        audioEngine.playLand();
        
        // Check for T-Spin
        const isTSpin = this.checkTSpin();
        
        this.clearLines(isTSpin);
        this.spawnPiece();
    }

    checkTSpin() {
        if (this.currentPiece.type !== 'T' || !this.lastMoveWasRotation) return false;
        
        const x = this.currentPiece.x;
        const y = this.currentPiece.y;
        
        // Check corners
        const corners = [
            [0, 0], [2, 0], [0, 2], [2, 2]
        ];
        
        let filledCorners = 0;
        for (const [dx, dy] of corners) {
            const checkX = x + dx;
            const checkY = y + dy;
            if (checkX < 0 || checkX >= COLS || checkY >= ROWS || 
                (checkY >= 0 && this.board[checkY][checkX])) {
                filledCorners++;
            }
        }
        
        return filledCorners >= 3;
    }

    clearLines(isTSpin = false) {
        const linesToClear = [];
        
        for (let row = ROWS - 1; row >= 0; row--) {
            if (this.board[row].every(cell => cell !== null)) {
                linesToClear.push(row);
            }
        }

        if (linesToClear.length > 0) {
            // Store for animation
            this.clearingLines = linesToClear;
            
            // Animate
            this.playLineClearAnimation(linesToClear);
            
            // Remove lines
            for (const row of linesToClear.sort((a, b) => b - a)) {
                this.board.splice(row, 1);
                this.board.unshift(new Array(COLS).fill(null));
            }

            this.lines += linesToClear.length;

            // Scoring
            let points = 0;
            const lineScores = [0, 100, 300, 500, 800];
            
            if (isTSpin) {
                const tSpinScores = [400, 800, 1200, 1600];
                points = tSpinScores[linesToClear.length - 1] || tSpinScores[3];
                this.stats.tSpins++;
                audioEngine.playTSpin();
                this.triggerHaptic('success');
            } else {
                points = lineScores[linesToClear.length] || lineScores[4];
                audioEngine.playClear(linesToClear.length);
            }

            // Combo bonus
            if (this.lastClearWasCombo || linesToClear.length > 0) {
                this.combo++;
                if (this.combo > 1) {
                    points += 50 * this.combo * this.level;
                    this.showCombo();
                    audioEngine.playCombo(this.combo);
                    this.triggerHaptic('medium');
                }
                this.lastClearWasCombo = true;
            }

            this.score += points * this.level;

            // Update stats
            if (linesToClear.length === 4) {
                this.stats.tetrises++;
                this.addScreenShake(10);
            }
            if (this.combo > this.stats.bestCombo) {
                this.stats.bestCombo = this.combo;
            }

            // Check perfect clear
            if (this.board.every(row => row.every(cell => cell === null))) {
                this.score += 3000 * this.level;
                this.stats.perfectClears++;
                audioEngine.playClear(6);
            }

            // Level up
            const newLevel = Math.floor(this.lines / 10) + 1;
            if (newLevel > this.level) {
                this.level = newLevel;
                this.dropInterval = Math.max(50, 1000 - (this.level - 1) * 50);
                this.updateTheme(this.level);
                audioEngine.setMusicSpeed(1 + (this.level - 1) * 0.05);
                audioEngine.playLevelUp();
                this.triggerHaptic('success');
            }

            this.updateScore();

            // Check sprint mode
            if (this.gameMode === 'sprint' && this.lines >= this.sprintLines) {
                this.endGame(true);
            }
        } else {
            this.combo = 0;
            this.lastClearWasCombo = false;
            this.hideCombo();
        }
    }

    playLineClearAnimation(lines) {
        this.lineClearEffect?.classList.remove('hidden');
        
        // Flash effect
        lines.forEach(row => {
            for (let col = 0; col < COLS; col++) {
                const x = col * BLOCK_SIZE;
                const y = row * BLOCK_SIZE;
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                this.ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
        
        setTimeout(() => {
            this.lineClearEffect?.classList.add('hidden');
        }, 200);
    }

    showCombo() {
        if (this.comboDisplay && this.comboCount) {
            this.comboDisplay.classList.remove('hidden');
            this.comboCount.textContent = this.combo;
        }
    }

    hideCombo() {
        this.comboDisplay?.classList.add('hidden');
    }

    addScreenShake(intensity) {
        this.shakeIntensity = intensity;
    }

    applyScreenShake() {
        if (this.shakeIntensity > 0.5) {
            const offsetX = (Math.random() - 0.5) * this.shakeIntensity;
            const offsetY = (Math.random() - 0.5) * this.shakeIntensity;
            if (this.canvasWrapper) {
                this.canvasWrapper.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            }
            this.shakeIntensity *= this.shakeDecay;
        } else {
            if (this.canvasWrapper) {
                this.canvasWrapper.style.transform = '';
            }
            this.shakeIntensity = 0;
        }
    }

    updateTheme(level) {
        const themeIndex = Math.min(Math.floor((level - 1) / 5), LEVEL_THEMES.length - 1);
        const theme = LEVEL_THEMES[themeIndex];
        
        document.documentElement.style.setProperty('--bg-color', theme.bg);
        document.documentElement.style.setProperty('--grid-color', theme.grid);
        document.documentElement.style.setProperty('--accent-color', theme.accent);
        
        if (this.tetrisBg) {
            this.tetrisBg.style.setProperty('--theme-accent', theme.accent);
        }
    }

    updateScore() {
        if (this.scoreElement) this.scoreElement.textContent = this.score.toLocaleString();
        if (this.levelElement) this.levelElement.textContent = this.level;
        if (this.linesElement) this.linesElement.textContent = this.lines;

        // Update timer for timed modes
        if (this.gameMode === 'ultra' || this.gameMode === 'sprint') {
            this.updateTimer();
        }
    }

    updateTimer() {
        const elapsed = Date.now() - this.modeStartTime;
        
        if (this.gameMode === 'ultra') {
            const remaining = Math.max(0, this.ultraTime - elapsed);
            const seconds = Math.ceil(remaining / 1000);
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            if (this.timerDisplay) {
                this.timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            }
            
            if (remaining <= 0) {
                this.endGame(true);
            }
        } else if (this.gameMode === 'sprint') {
            const seconds = Math.floor(elapsed / 1000);
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            const ms = Math.floor((elapsed % 1000) / 10);
            if (this.timerDisplay) {
                this.timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
            }
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.pauseOverlay?.classList.remove('hidden');
            audioEngine.playPause();
            audioEngine.pauseMusic();
        } else {
            this.pauseOverlay?.classList.add('hidden');
            audioEngine.playUnpause();
            audioEngine.resumeMusic();
        }
    }

    hideOverlays() {
        this.pauseOverlay?.classList.add('hidden');
        this.gameOverOverlay?.classList.add('hidden');
        this.countdownOverlay?.classList.add('hidden');
    }

    endGame(completed = false) {
        this.gameOver = true;
        this.isPlaying = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        // Update stats
        this.stats.gamesPlayed++;
        this.stats.totalLines += this.lines;
        this.stats.timePlayed += Date.now() - this.modeStartTime;
        if (this.level > this.stats.maxLevel) this.stats.maxLevel = this.level;
        
        const isHighScore = this.score > this.stats.bestScore;
        if (isHighScore) {
            this.stats.bestScore = this.score;
        }
        
        this.saveStats();
        this.checkAchievements();

        audioEngine.stopMusic();
        if (!completed) audioEngine.playGameOver();

        if (this.finalScoreElement) this.finalScoreElement.textContent = this.score.toLocaleString();
        
        this.newHighScoreMsg?.classList.toggle('hidden', !isHighScore);
        
        // Show submit option if username set
        if (this.username && this.gameMode !== 'zen') {
            this.submitScoreSection?.classList.remove('hidden');
        } else {
            this.submitScoreSection?.classList.add('hidden');
        }
        
        this.gameOverOverlay?.classList.remove('hidden');

        this.saveHighScore(this.score);
        this.displayHighScores();
    }

    // ============== Statistics & Achievements ==============
    saveStats() {
        localStorage.setItem('jasonsTetrisStats', JSON.stringify(this.stats));
    }

    displayStats() {
        const el = (id) => document.getElementById(id);
        if (el('statGamesPlayed')) el('statGamesPlayed').textContent = this.stats.gamesPlayed.toLocaleString();
        if (el('statTotalLines')) el('statTotalLines').textContent = this.stats.totalLines.toLocaleString();
        if (el('statBestScore')) el('statBestScore').textContent = this.stats.bestScore.toLocaleString();
        if (el('statTetrises')) el('statTetrises').textContent = this.stats.tetrises.toLocaleString();
        if (el('statBestCombo')) el('statBestCombo').textContent = this.stats.bestCombo + 'x';
        if (el('statTSpins')) el('statTSpins').textContent = this.stats.tSpins.toLocaleString();
        
        // Format time
        const hours = Math.floor(this.stats.timePlayed / 3600000);
        const minutes = Math.floor((this.stats.timePlayed % 3600000) / 60000);
        if (el('statTimePlayed')) el('statTimePlayed').textContent = `${hours}h ${minutes}m`;
        
        // Tetris rate
        const totalClears = this.stats.totalLines;
        const tetrisLines = this.stats.tetrises * 4;
        const rate = totalClears > 0 ? Math.round((tetrisLines / totalClears) * 100) : 0;
        if (el('statTetrisRate')) el('statTetrisRate').textContent = rate + '%';
    }

    checkAchievements() {
        const newAchievements = [];
        
        for (const achievement of ACHIEVEMENTS) {
            if (!this.stats.achievements.includes(achievement.id) && achievement.check(this.stats)) {
                this.stats.achievements.push(achievement.id);
                newAchievements.push(achievement);
            }
        }
        
        if (newAchievements.length > 0) {
            this.saveStats();
            // Could show achievement popup here
        }
    }

    displayAchievements() {
        if (!this.achievementsList) return;
        
        this.achievementsList.innerHTML = ACHIEVEMENTS.map(a => {
            const unlocked = this.stats.achievements.includes(a.id);
            return `
                <div class="achievement ${unlocked ? 'unlocked' : 'locked'}">
                    <i class="fas ${a.icon}"></i>
                    <div class="achievement-info">
                        <span class="achievement-name">${a.name}</span>
                        <span class="achievement-desc">${a.desc}</span>
                    </div>
                    ${unlocked ? '<i class="fas fa-check achievement-check"></i>' : ''}
                </div>
            `;
        }).join('');
    }

    // ============== High Scores & Leaderboard ==============
    loadHighScores() {
        const scores = localStorage.getItem('jasonsTetrisHighScores');
        return scores ? JSON.parse(scores) : [];
    }

    saveHighScore(score) {
        this.highScores.push(score);
        this.highScores.sort((a, b) => b - a);
        this.highScores = this.highScores.slice(0, 5);
        localStorage.setItem('jasonsTetrisHighScores', JSON.stringify(this.highScores));
    }

    displayHighScores() {
        if (!this.highScoreList) return;
        const items = this.highScoreList.querySelectorAll('li');
        items.forEach((item, index) => {
            item.textContent = this.highScores[index]?.toLocaleString() || '---';
        });
    }

    saveUsername() {
        this.username = this.usernameInput?.value.trim().substring(0, 20) || '';
        localStorage.setItem('jasonsTetrisUsername', this.username);
        audioEngine.playMenuSelect();
    }

    async loadLeaderboard() {
        if (!this.leaderboardList) return;
        
        this.leaderboardList.innerHTML = '<div class="leaderboard-loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
        
        try {
            const response = await fetch(`/api/leaderboard?mode=${this.currentLeaderboardMode}`);
            const data = await response.json();
            
            if (data.scores && data.scores.length > 0) {
                this.leaderboardList.innerHTML = data.scores.map((entry, i) => `
                    <div class="leaderboard-entry ${entry.username === this.username ? 'self' : ''}">
                        <span class="rank">${i + 1}</span>
                        <span class="name">${entry.username || 'Anonymous'}</span>
                        <span class="score">${entry.score.toLocaleString()}</span>
                    </div>
                `).join('');
            } else {
                this.leaderboardList.innerHTML = '<div class="leaderboard-empty">No scores yet. Be the first!</div>';
            }
        } catch (err) {
            this.leaderboardList.innerHTML = '<div class="leaderboard-error">Unable to load leaderboard</div>';
        }
    }

    async submitScore() {
        if (!this.username || this.gameMode === 'zen') return;
        
        try {
            this.submitScoreBtn.disabled = true;
            this.submitScoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            await fetch('/api/leaderboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: this.username,
                    score: this.score,
                    mode: this.gameMode,
                    level: this.level,
                    lines: this.lines
                })
            });
            
            this.submitScoreBtn.innerHTML = '<i class="fas fa-check"></i> SUBMITTED';
            this.submitScoreSection?.classList.add('hidden');
        } catch (err) {
            this.submitScoreBtn.innerHTML = '<i class="fas fa-times"></i> FAILED';
            this.submitScoreBtn.disabled = false;
        }
    }

    // ============== Rendering ==============
    drawBlock(ctx, x, y, color, size = BLOCK_SIZE) {
        const padding = 1;
        
        ctx.fillStyle = color;
        ctx.fillRect(x * size + padding, y * size + padding, size - padding * 2, size - padding * 2);
        
        ctx.fillStyle = this.lightenColor(color, 40);
        ctx.fillRect(x * size + padding, y * size + padding, size - padding * 2, 3);
        ctx.fillRect(x * size + padding, y * size + padding, 3, size - padding * 2);
        
        ctx.fillStyle = this.darkenColor(color, 40);
        ctx.fillRect(x * size + padding, y * size + size - padding - 3, size - padding * 2, 3);
        ctx.fillRect(x * size + size - padding - 3, y * size + padding, 3, size - padding * 2);
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `rgb(${R}, ${G}, ${B})`;
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return `rgb(${R}, ${G}, ${B})`;
    }

    drawBoard() {
        // Clear
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Grid
        this.ctx.strokeStyle = '#1a1a2e';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x <= COLS; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * BLOCK_SIZE, 0);
            this.ctx.lineTo(x * BLOCK_SIZE, ROWS * BLOCK_SIZE);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= ROWS; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * BLOCK_SIZE);
            this.ctx.lineTo(COLS * BLOCK_SIZE, y * BLOCK_SIZE);
            this.ctx.stroke();
        }

        // Danger zone indicator
        if (this.board.some((row, i) => i < 4 && row.some(cell => cell))) {
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
            this.ctx.fillRect(0, 0, COLS * BLOCK_SIZE, 4 * BLOCK_SIZE);
        }

        // Placed pieces
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (this.board[row]?.[col]) {
                    this.drawBlock(this.ctx, col, row, this.board[row][col]);
                }
            }
        }

        // Current piece
        if (this.currentPiece) {
            const shape = this.currentPiece.shape;
            
            // Ghost piece
            let ghostY = this.currentPiece.y;
            while (this.isValidMove(0, ghostY - this.currentPiece.y + 1)) {
                ghostY++;
            }
            
            for (let row = 0; row < shape.length; row++) {
                for (let col = 0; col < shape[row].length; col++) {
                    if (shape[row][col]) {
                        const x = this.currentPiece.x + col;
                        const y = ghostY + row;
                        if (y >= 0) {
                            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
                            this.ctx.fillRect(x * BLOCK_SIZE + 1, y * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
                            this.ctx.strokeStyle = this.currentPiece.color;
                            this.ctx.lineWidth = 2;
                            this.ctx.strokeRect(x * BLOCK_SIZE + 2, y * BLOCK_SIZE + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
                        }
                    }
                }
            }

            // Current piece
            for (let row = 0; row < shape.length; row++) {
                for (let col = 0; col < shape[row].length; col++) {
                    if (shape[row][col]) {
                        const x = this.currentPiece.x + col;
                        const y = this.currentPiece.y + row;
                        if (y >= 0) {
                            this.drawBlock(this.ctx, x, y, this.currentPiece.color);
                        }
                    }
                }
            }
        }
    }

    drawNextPieces() {
        this.nextCtx.fillStyle = '#0a0a0a';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);

        for (let i = 0; i < PREVIEW_COUNT; i++) {
            const piece = this.nextPieces[i];
            if (!piece) continue;
            
            const shape = piece.shape;
            const offsetX = (4 - shape[0].length) / 2;
            const offsetY = i * (4 * NEXT_BLOCK_SIZE + 5) + (4 - shape.length) / 2;

            for (let row = 0; row < shape.length; row++) {
                for (let col = 0; col < shape[row].length; col++) {
                    if (shape[row][col]) {
                        this.drawBlock(this.nextCtx, col + offsetX, offsetY / NEXT_BLOCK_SIZE + row, piece.color, NEXT_BLOCK_SIZE);
                    }
                }
            }
        }
    }

    drawHoldPiece() {
        this.holdCtx.fillStyle = '#0a0a0a';
        this.holdCtx.fillRect(0, 0, this.holdCanvas.width, this.holdCanvas.height);

        if (!this.holdPiece) return;

        const shape = this.holdPiece.shape;
        const offsetX = (4 - shape[0].length) / 2;
        const offsetY = (4 - shape.length) / 2;
        const color = this.canHold ? this.holdPiece.color : '#555';

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    this.drawBlock(this.holdCtx, col + offsetX, row + offsetY, color, HOLD_BLOCK_SIZE);
                }
            }
        }
    }

    // ============== Game Loop ==============
    gameLoop(timestamp) {
        if (this.gameOver) return;

        if (!this.isPaused) {
            // Lock delay logic
            if (!this.isValidMove(0, 1)) {
                if (!this.isLocking) {
                    this.isLocking = true;
                    this.lockTimer = timestamp;
                }
                
                if (timestamp - this.lockTimer > this.lockDelay) {
                    this.lockPiece();
                }
            } else {
                this.isLocking = false;
                this.lockTimer = 0;
            }

            // Auto drop
            if (timestamp - this.lastDropTime > this.dropInterval) {
                if (!this.movePiece(0, 1)) {
                    // Start lock delay if not already
                    if (!this.isLocking) {
                        this.isLocking = true;
                        this.lockTimer = timestamp;
                    }
                }
                this.lastDropTime = timestamp;
            }

            // Update timer
            if (this.gameMode === 'ultra' || this.gameMode === 'sprint') {
                this.updateTimer();
            }

            // Screen shake
            this.applyScreenShake();

            this.drawBoard();
        }

        this.animationId = requestAnimationFrame((t) => this.gameLoop(t));
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.tetrisGame = new TetrisGame();
});
