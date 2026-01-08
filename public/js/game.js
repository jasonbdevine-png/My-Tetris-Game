// Tetris Game Engine

// Game constants
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const NEXT_BLOCK_SIZE = 25;

// Colors for tetrominos
const COLORS = {
    I: '#00f5ff',  // Cyan
    O: '#ffeb3b',  // Yellow
    T: '#9c27b0',  // Purple
    S: '#4caf50',  // Green
    Z: '#f44336',  // Red
    J: '#2196f3',  // Blue
    L: '#ff9800'   // Orange
};

// Tetromino shapes (each rotation state)
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

// Default key bindings
const DEFAULT_CONTROLS = {
    moveLeft: 'KeyA',
    moveRight: 'KeyD',
    softDrop: 'KeyS',
    rotate: 'KeyW',
    hardDrop: 'Space',
    pause: 'KeyP'
};

// Game state
class TetrisGame {
    constructor() {
        // Screen elements
        this.titleScreen = document.getElementById('titleScreen');
        this.gameScreen = document.getElementById('gameScreen');
        
        // Title screen elements
        this.playBtn = document.getElementById('playBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.highScoresBtn = document.getElementById('highScoresBtn');
        this.settingsModal = document.getElementById('settingsModal');
        this.highScoresModal = document.getElementById('highScoresModal');
        this.closeSettingsBtn = document.getElementById('closeSettingsBtn');
        this.closeHighScoresBtn = document.getElementById('closeHighScoresBtn');
        this.titleHighScoreList = document.getElementById('titleHighScoreList');
        
        // Settings tabs
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // Control settings
        this.keybindBtns = document.querySelectorAll('.keybind-btn');
        this.resetControlsBtn = document.getElementById('resetControlsBtn');
        this.controlsWarning = document.getElementById('controlsWarning');
        this.listeningForKey = null;
        
        // Volume controls (title screen)
        this.musicVolumeSlider = document.getElementById('musicVolume');
        this.sfxVolumeSlider = document.getElementById('sfxVolume');
        this.musicVolumeValue = document.getElementById('musicVolumeValue');
        this.sfxVolumeValue = document.getElementById('sfxVolumeValue');
        
        // Volume controls (game screen)
        this.gameMusicVolumeSlider = document.getElementById('gameMusicVolume');
        this.gameSfxVolumeSlider = document.getElementById('gameSfxVolume');
        
        // Canvas setup
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = COLS * BLOCK_SIZE;
        this.canvas.height = ROWS * BLOCK_SIZE;

        // Next piece canvas
        this.nextCanvas = document.getElementById('nextCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        this.nextCanvas.width = 4 * NEXT_BLOCK_SIZE;
        this.nextCanvas.height = 4 * NEXT_BLOCK_SIZE;

        // UI elements
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.linesElement = document.getElementById('lines');
        this.highScoreList = document.getElementById('highScoreList');
        this.restartBtn = document.getElementById('restartBtn');
        this.menuBtn = document.getElementById('menuBtn');
        this.resumeBtn = document.getElementById('resumeBtn');
        this.backToMenuBtn = document.getElementById('backToMenuBtn');
        this.muteBtn = document.getElementById('muteBtn');
        this.pauseOverlay = document.getElementById('pauseOverlay');
        this.gameOverOverlay = document.getElementById('gameOverOverlay');
        this.finalScoreElement = document.getElementById('finalScore');
        this.pauseKeyDisplay = document.getElementById('pauseKeyDisplay');

        // Touch control buttons
        this.touchControls = document.getElementById('touchControls');
        this.touchLeft = document.getElementById('touchLeft');
        this.touchRight = document.getElementById('touchRight');
        this.touchDown = document.getElementById('touchDown');
        this.touchRotate = document.getElementById('touchRotate');
        this.touchDrop = document.getElementById('touchDrop');
        this.touchPause = document.getElementById('touchPause');

        // Game state
        this.board = [];
        this.currentPiece = null;
        this.nextPiece = null;
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

        // Key bindings
        this.controls = this.loadControls();

        // High scores
        this.highScores = this.loadHighScores();
        this.displayHighScores();

        // Load saved volume settings
        this.loadVolumeSettings();

        // Update control displays
        this.updateControlDisplays();

        // Check if mobile
        this.checkMobile();

        // Event listeners
        this.setupEventListeners();

        // Initial render
        this.drawBoard();
    }

    checkMobile() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                        window.matchMedia('(max-width: 900px)').matches ||
                        ('ontouchstart' in window);
        
        if (isMobile) {
            this.touchControls.classList.add('show-mobile');
        }
        
        // Also listen for resize to show/hide touch controls
        window.addEventListener('resize', () => {
            if (window.matchMedia('(max-width: 900px)').matches) {
                this.touchControls.classList.add('show-mobile');
            }
        });
    }

    loadControls() {
        const saved = localStorage.getItem('tetrisControls');
        if (saved) {
            return JSON.parse(saved);
        }
        return { ...DEFAULT_CONTROLS };
    }

    saveControls() {
        localStorage.setItem('tetrisControls', JSON.stringify(this.controls));
    }

    resetControls() {
        this.controls = { ...DEFAULT_CONTROLS };
        this.saveControls();
        this.updateControlDisplays();
    }

    getKeyDisplayName(code) {
        const keyNames = {
            'Space': 'SPACE',
            'ArrowLeft': '←',
            'ArrowRight': '→',
            'ArrowUp': '↑',
            'ArrowDown': '↓',
            'Enter': 'ENTER',
            'ShiftLeft': 'L-SHIFT',
            'ShiftRight': 'R-SHIFT',
            'ControlLeft': 'L-CTRL',
            'ControlRight': 'R-CTRL',
            'AltLeft': 'L-ALT',
            'AltRight': 'R-ALT',
            'Tab': 'TAB',
            'Backspace': 'BKSP',
            'Escape': 'ESC'
        };

        if (keyNames[code]) {
            return keyNames[code];
        }

        // Handle letter keys (KeyA -> A)
        if (code.startsWith('Key')) {
            return code.substring(3);
        }

        // Handle digit keys (Digit1 -> 1)
        if (code.startsWith('Digit')) {
            return code.substring(5);
        }

        // Handle numpad keys
        if (code.startsWith('Numpad')) {
            return 'NUM' + code.substring(6);
        }

        return code;
    }

    updateControlDisplays() {
        // Update settings modal key displays
        const actions = ['moveLeft', 'moveRight', 'softDrop', 'rotate', 'hardDrop', 'pause'];
        actions.forEach(action => {
            const displayEl = document.getElementById('key' + action.charAt(0).toUpperCase() + action.slice(1));
            if (displayEl) {
                displayEl.textContent = this.getKeyDisplayName(this.controls[action]);
            }
        });

        // Update game screen control displays
        document.getElementById('displayMoveLeft').textContent = this.getKeyDisplayName(this.controls.moveLeft);
        document.getElementById('displayMoveRight').textContent = this.getKeyDisplayName(this.controls.moveRight);
        document.getElementById('displayRotate').textContent = this.getKeyDisplayName(this.controls.rotate);
        document.getElementById('displaySoftDrop').textContent = this.getKeyDisplayName(this.controls.softDrop);
        document.getElementById('displayHardDrop').textContent = this.getKeyDisplayName(this.controls.hardDrop);
        document.getElementById('displayPause').textContent = this.getKeyDisplayName(this.controls.pause);

        // Update pause overlay key display
        if (this.pauseKeyDisplay) {
            this.pauseKeyDisplay.textContent = this.getKeyDisplayName(this.controls.pause);
        }
    }

    validateControls() {
        const requiredActions = ['moveLeft', 'moveRight', 'softDrop', 'rotate', 'pause'];
        for (const action of requiredActions) {
            if (!this.controls[action]) {
                return false;
            }
        }
        return true;
    }

    loadVolumeSettings() {
        const musicVol = localStorage.getItem('tetrisMusicVolume');
        const sfxVol = localStorage.getItem('tetrisSfxVolume');
        
        if (musicVol !== null) {
            this.musicVolumeSlider.value = musicVol;
            this.gameMusicVolumeSlider.value = musicVol;
            this.musicVolumeValue.textContent = musicVol + '%';
            audioEngine.setMusicVolume(musicVol / 100);
        }
        
        if (sfxVol !== null) {
            this.sfxVolumeSlider.value = sfxVol;
            this.gameSfxVolumeSlider.value = sfxVol;
            this.sfxVolumeValue.textContent = sfxVol + '%';
            audioEngine.setSfxVolume(sfxVol / 100);
        }
    }

    saveVolumeSettings() {
        localStorage.setItem('tetrisMusicVolume', this.musicVolumeSlider.value);
        localStorage.setItem('tetrisSfxVolume', this.sfxVolumeSlider.value);
    }

    setupEventListeners() {
        // Title screen buttons
        this.playBtn.addEventListener('click', () => {
            if (!this.validateControls()) {
                audioEngine.playPause();
                this.settingsModal.classList.remove('hidden');
                // Switch to controls tab
                this.tabBtns.forEach(btn => btn.classList.remove('active'));
                this.tabContents.forEach(content => content.classList.remove('active'));
                document.querySelector('[data-tab="controls"]').classList.add('active');
                document.getElementById('controlsTab').classList.add('active');
                this.controlsWarning.classList.remove('hidden');
                return;
            }
            audioEngine.playMenuSelect();
            this.showGameScreen();
        });
        
        this.settingsBtn.addEventListener('click', () => {
            audioEngine.playMenuSelect();
            this.settingsModal.classList.remove('hidden');
        });
        
        this.highScoresBtn.addEventListener('click', () => {
            audioEngine.playMenuSelect();
            this.displayHighScores();
            this.highScoresModal.classList.remove('hidden');
        });
        
        this.closeSettingsBtn.addEventListener('click', () => {
            if (this.listeningForKey) {
                this.listeningForKey.classList.remove('listening');
                this.listeningForKey = null;
            }
            audioEngine.playMenuSelect();
            this.settingsModal.classList.add('hidden');
            this.saveVolumeSettings();
            this.controlsWarning.classList.add('hidden');
        });
        
        this.closeHighScoresBtn.addEventListener('click', () => {
            audioEngine.playMenuSelect();
            this.highScoresModal.classList.add('hidden');
        });

        // Settings tabs
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                
                this.tabBtns.forEach(b => b.classList.remove('active'));
                this.tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(tab + 'Tab').classList.add('active');
                
                audioEngine.playMove();
            });
        });

        // Keybind buttons
        this.keybindBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove listening state from any other button
                if (this.listeningForKey && this.listeningForKey !== btn) {
                    this.listeningForKey.classList.remove('listening');
                }
                
                btn.classList.toggle('listening');
                this.listeningForKey = btn.classList.contains('listening') ? btn : null;
                
                if (this.listeningForKey) {
                    audioEngine.playRotate();
                }
            });
        });

        // Reset controls button
        this.resetControlsBtn.addEventListener('click', () => {
            audioEngine.playMenuSelect();
            this.resetControls();
            this.controlsWarning.classList.add('hidden');
        });

        // Listen for key presses when rebinding
        document.addEventListener('keydown', (e) => {
            if (this.listeningForKey) {
                e.preventDefault();
                
                const action = this.listeningForKey.dataset.action;
                const newKey = e.code;
                
                // Check if key is already used for another action
                for (const [existingAction, existingKey] of Object.entries(this.controls)) {
                    if (existingKey === newKey && existingAction !== action) {
                        // Swap the keys
                        this.controls[existingAction] = this.controls[action];
                    }
                }
                
                this.controls[action] = newKey;
                this.saveControls();
                this.updateControlDisplays();
                
                this.listeningForKey.classList.remove('listening');
                this.listeningForKey = null;
                
                // Check if all required controls are set
                if (this.validateControls()) {
                    this.controlsWarning.classList.add('hidden');
                }
                
                audioEngine.playMenuSelect();
                return;
            }

            // Normal game key handling
            this.handleKeyPress(e);
        });

        document.addEventListener('keyup', (e) => this.handleKeyRelease(e));

        // Volume sliders (title screen)
        this.musicVolumeSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            this.musicVolumeValue.textContent = value + '%';
            this.gameMusicVolumeSlider.value = value;
            audioEngine.setMusicVolume(value / 100);
        });
        
        this.sfxVolumeSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            this.sfxVolumeValue.textContent = value + '%';
            this.gameSfxVolumeSlider.value = value;
            audioEngine.setSfxVolume(value / 100);
        });

        // Volume sliders (game screen)
        this.gameMusicVolumeSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            this.musicVolumeSlider.value = value;
            this.musicVolumeValue.textContent = value + '%';
            audioEngine.setMusicVolume(value / 100);
            this.saveVolumeSettings();
        });
        
        this.gameSfxVolumeSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            this.sfxVolumeSlider.value = value;
            this.sfxVolumeValue.textContent = value + '%';
            audioEngine.setSfxVolume(value / 100);
            this.saveVolumeSettings();
        });

        // Game button controls
        this.restartBtn.addEventListener('click', () => {
            audioEngine.playMenuSelect();
            this.startGame();
        });
        
        this.menuBtn.addEventListener('click', () => {
            audioEngine.playMenuSelect();
            this.showTitleScreen();
        });
        
        this.resumeBtn.addEventListener('click', () => {
            this.togglePause();
        });
        
        this.backToMenuBtn.addEventListener('click', () => {
            audioEngine.playMenuSelect();
            this.showTitleScreen();
        });
        
        this.muteBtn.addEventListener('click', () => {
            const isMuted = audioEngine.toggleMute();
            this.muteBtn.innerHTML = isMuted ? 
                '<i class="fas fa-volume-mute"></i>' : 
                '<i class="fas fa-volume-up"></i>';
        });

        // Touch controls
        this.setupTouchControls();

        // Prevent context menu on touch buttons
        document.querySelectorAll('.touch-btn').forEach(btn => {
            btn.addEventListener('contextmenu', (e) => e.preventDefault());
        });
    }

    setupTouchControls() {
        // Helper for repeating action while holding
        const setupHoldAction = (element, action, interval = 100) => {
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
            
            // Also support mouse for testing
            element.addEventListener('mousedown', startAction);
            element.addEventListener('mouseup', stopAction);
            element.addEventListener('mouseleave', stopAction);
        };

        // Touch left (with hold repeat)
        setupHoldAction(this.touchLeft, () => {
            if (this.isPlaying && !this.isPaused && !this.gameOver) {
                this.movePiece(-1, 0);
                audioEngine.playMove();
            }
        }, 80);

        // Touch right (with hold repeat)
        setupHoldAction(this.touchRight, () => {
            if (this.isPlaying && !this.isPaused && !this.gameOver) {
                this.movePiece(1, 0);
                audioEngine.playMove();
            }
        }, 80);

        // Touch down (soft drop with hold)
        setupHoldAction(this.touchDown, () => {
            if (this.isPlaying && !this.isPaused && !this.gameOver) {
                if (this.movePiece(0, 1)) {
                    this.score += 1;
                    this.updateScore();
                }
            }
        }, 50);

        // Touch rotate (single press)
        const handleRotate = (e) => {
            e.preventDefault();
            if (this.isPlaying && !this.isPaused && !this.gameOver) {
                this.rotatePiece(1);
                audioEngine.playRotate();
            }
        };
        this.touchRotate.addEventListener('touchstart', handleRotate);
        this.touchRotate.addEventListener('click', handleRotate);

        // Touch hard drop (single press)
        const handleDrop = (e) => {
            e.preventDefault();
            if (this.isPlaying && !this.isPaused && !this.gameOver) {
                this.hardDrop();
            }
        };
        this.touchDrop.addEventListener('touchstart', handleDrop);
        this.touchDrop.addEventListener('click', handleDrop);

        // Touch pause (single press)
        const handlePause = (e) => {
            e.preventDefault();
            if (this.isPlaying && !this.gameOver) {
                this.togglePause();
            }
        };
        this.touchPause.addEventListener('touchstart', handlePause);
        this.touchPause.addEventListener('click', handlePause);
    }

    showTitleScreen() {
        this.gameScreen.classList.add('hidden');
        this.titleScreen.classList.remove('hidden');
        audioEngine.stopMusic();
        
        // Reset game state
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.isPlaying = false;
        this.gameOver = false;
        this.isPaused = false;
        this.hideOverlays();
    }

    showGameScreen() {
        this.titleScreen.classList.add('hidden');
        this.gameScreen.classList.remove('hidden');
        this.startGame();
    }

    handleKeyPress(e) {
        // Handle title screen
        if (!this.titleScreen.classList.contains('hidden')) {
            if (e.code === 'Enter' || e.code === 'Space') {
                if (!this.validateControls()) {
                    return;
                }
                audioEngine.playMenuSelect();
                this.showGameScreen();
                e.preventDefault();
            }
            return;
        }

        if (!this.isPlaying || this.gameOver) return;

        // Pause toggle
        if (e.code === this.controls.pause) {
            this.togglePause();
            e.preventDefault();
            return;
        }

        if (this.isPaused) return;

        // Game controls
        if (e.code === this.controls.moveLeft || e.code === 'ArrowLeft') {
            this.movePiece(-1, 0);
            audioEngine.playMove();
            e.preventDefault();
        } else if (e.code === this.controls.moveRight || e.code === 'ArrowRight') {
            this.movePiece(1, 0);
            audioEngine.playMove();
            e.preventDefault();
        } else if (e.code === this.controls.rotate || e.code === 'ArrowUp') {
            this.rotatePiece(1);
            audioEngine.playRotate();
            e.preventDefault();
        } else if (e.code === this.controls.softDrop || e.code === 'ArrowDown') {
            if (!this.softDropping) {
                this.softDropping = true;
            }
            if (this.movePiece(0, 1)) {
                this.score += 1;
                this.updateScore();
            }
            e.preventDefault();
        } else if (e.code === this.controls.hardDrop) {
            this.hardDrop();
            e.preventDefault();
        }
    }

    handleKeyRelease(e) {
        if (e.code === this.controls.softDrop || e.code === 'ArrowDown') {
            this.softDropping = false;
        }
    }

    initBoard() {
        this.board = [];
        for (let row = 0; row < ROWS; row++) {
            this.board[row] = [];
            for (let col = 0; col < COLS; col++) {
                this.board[row][col] = null;
            }
        }
    }

    startGame() {
        this.initBoard();
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.isPaused = false;
        this.isPlaying = true;
        this.dropInterval = 1000;
        this.lastDropTime = 0;

        this.updateScore();
        this.hideOverlays();

        this.nextPiece = this.createPiece();
        this.spawnPiece();

        // Start music
        audioEngine.startMusic();

        // Start game loop
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.gameLoop(0);
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
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.createPiece();
        
        // Center the piece
        this.currentPiece.x = Math.floor(COLS / 2) - Math.ceil(this.currentPiece.shape[0].length / 2);
        this.currentPiece.y = 0;

        // Check if game over
        if (!this.isValidMove(0, 0)) {
            this.endGame();
        }

        this.drawNextPiece();
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

                    // Check boundaries
                    if (x < 0 || x >= COLS || y >= ROWS) {
                        return false;
                    }

                    // Check collision with placed pieces
                    if (y >= 0 && this.board[y][x]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    movePiece(offsetX, offsetY) {
        if (this.isValidMove(offsetX, offsetY)) {
            this.currentPiece.x += offsetX;
            this.currentPiece.y += offsetY;
            return true;
        }
        return false;
    }

    rotatePiece(direction) {
        const type = this.currentPiece.type;
        let newRotation = this.currentPiece.rotation + direction;
        
        // Wrap rotation
        if (newRotation < 0) newRotation = 3;
        if (newRotation > 3) newRotation = 0;

        const newShape = TETROMINOS[type][newRotation];

        // Try rotation
        if (this.isValidMove(0, 0, newShape)) {
            this.currentPiece.shape = newShape;
            this.currentPiece.rotation = newRotation;
            return;
        }

        // Wall kick - try moving left or right
        const kicks = [-1, 1, -2, 2];
        for (const kick of kicks) {
            if (this.isValidMove(kick, 0, newShape)) {
                this.currentPiece.x += kick;
                this.currentPiece.shape = newShape;
                this.currentPiece.rotation = newRotation;
                return;
            }
        }
    }

    hardDrop() {
        while (this.movePiece(0, 1)) {
            this.score += 2;
        }
        audioEngine.playHardDrop();
        this.lockPiece();
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
        this.clearLines();
        this.spawnPiece();
    }

    clearLines() {
        let linesCleared = 0;

        for (let row = ROWS - 1; row >= 0; row--) {
            if (this.board[row].every(cell => cell !== null)) {
                // Remove the line
                this.board.splice(row, 1);
                // Add empty line at top
                this.board.unshift(new Array(COLS).fill(null));
                linesCleared++;
                row++; // Check same row again
            }
        }

        if (linesCleared > 0) {
            this.lines += linesCleared;
            
            // Scoring based on lines cleared
            const lineScores = [0, 100, 300, 500, 800];
            this.score += lineScores[linesCleared] * this.level;

            // Play clear sound
            audioEngine.playClear(linesCleared);

            // Level up every 10 lines
            const newLevel = Math.floor(this.lines / 10) + 1;
            if (newLevel > this.level) {
                this.level = newLevel;
                this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
            }

            this.updateScore();
        }
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
        this.levelElement.textContent = this.level;
        this.linesElement.textContent = this.lines;
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.pauseOverlay.classList.remove('hidden');
            audioEngine.playPause();
            audioEngine.pauseMusic();
        } else {
            this.pauseOverlay.classList.add('hidden');
            audioEngine.playUnpause();
            audioEngine.resumeMusic();
        }
    }

    hideOverlays() {
        this.pauseOverlay.classList.add('hidden');
        this.gameOverOverlay.classList.add('hidden');
    }

    endGame() {
        this.gameOver = true;
        this.isPlaying = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        audioEngine.stopMusic();
        audioEngine.playGameOver();

        this.finalScoreElement.textContent = this.score;
        this.gameOverOverlay.classList.remove('hidden');

        // Save high score
        this.saveHighScore(this.score);
        this.displayHighScores();
    }

    // High score management
    loadHighScores() {
        const scores = localStorage.getItem('tetrisHighScores');
        return scores ? JSON.parse(scores) : [];
    }

    saveHighScore(score) {
        this.highScores.push(score);
        this.highScores.sort((a, b) => b - a);
        this.highScores = this.highScores.slice(0, 5);
        localStorage.setItem('tetrisHighScores', JSON.stringify(this.highScores));
    }

    displayHighScores() {
        // Update game screen high scores
        const gameItems = this.highScoreList.querySelectorAll('li');
        gameItems.forEach((item, index) => {
            if (this.highScores[index] !== undefined) {
                item.textContent = this.highScores[index].toLocaleString();
            } else {
                item.textContent = '---';
            }
        });

        // Update title screen high scores
        const titleItems = this.titleHighScoreList.querySelectorAll('li');
        titleItems.forEach((item, index) => {
            if (this.highScores[index] !== undefined) {
                item.textContent = this.highScores[index].toLocaleString();
            } else {
                item.textContent = '---';
            }
        });
    }

    // Rendering
    drawBlock(ctx, x, y, color, size = BLOCK_SIZE) {
        const padding = 1;
        
        // Main block
        ctx.fillStyle = color;
        ctx.fillRect(x * size + padding, y * size + padding, size - padding * 2, size - padding * 2);
        
        // Highlight (top-left)
        ctx.fillStyle = this.lightenColor(color, 40);
        ctx.fillRect(x * size + padding, y * size + padding, size - padding * 2, 3);
        ctx.fillRect(x * size + padding, y * size + padding, 3, size - padding * 2);
        
        // Shadow (bottom-right)
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
        // Clear canvas
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid lines
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

        // Draw placed pieces
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (this.board[row] && this.board[row][col]) {
                    this.drawBlock(this.ctx, col, row, this.board[row][col]);
                }
            }
        }

        // Draw current piece
        if (this.currentPiece) {
            const shape = this.currentPiece.shape;
            
            // Draw ghost piece
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
                            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                            this.ctx.fillRect(x * BLOCK_SIZE + 1, y * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
                        }
                    }
                }
            }

            // Draw actual piece
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

    drawNextPiece() {
        // Clear canvas
        this.nextCtx.fillStyle = '#0a0a0a';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);

        if (!this.nextPiece) return;

        const shape = this.nextPiece.shape;
        const offsetX = (4 - shape[0].length) / 2;
        const offsetY = (4 - shape.length) / 2;

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    this.drawBlock(this.nextCtx, col + offsetX, row + offsetY, this.nextPiece.color, NEXT_BLOCK_SIZE);
                }
            }
        }
    }

    gameLoop(timestamp) {
        if (this.gameOver) return;

        if (!this.isPaused) {
            // Auto drop
            if (timestamp - this.lastDropTime > this.dropInterval) {
                if (!this.movePiece(0, 1)) {
                    this.lockPiece();
                }
                this.lastDropTime = timestamp;
            }

            this.drawBoard();
        }

        this.animationId = requestAnimationFrame((t) => this.gameLoop(t));
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new TetrisGame();
});
