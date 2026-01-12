// Tetris Audio Engine - Web Audio API based sound synthesis + MP3 music

class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        this.isMuted = false;
        this.musicPlaying = false;
        this.musicGain = null;
        this.sfxGain = null;
        
        // MP3 Music
        this.musicElement = null;
        this.musicSource = null;
        this.musicLoaded = false;
    }

    init() {
        if (this.audioContext) return;
        
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create master gain nodes
        this.musicGain = this.audioContext.createGain();
        this.musicGain.connect(this.audioContext.destination);
        this.musicGain.gain.value = this.musicVolume;
        
        this.sfxGain = this.audioContext.createGain();
        this.sfxGain.connect(this.audioContext.destination);
        this.sfxGain.gain.value = this.sfxVolume;

        // Initialize MP3 music
        this.initMusic();
    }

    initMusic() {
        if (this.musicElement) return;
        
        this.musicElement = new Audio('/audio/tetris-remix.mp3');
        this.musicElement.loop = true;
        this.musicElement.volume = this.musicVolume;
        
        // Preload the audio
        this.musicElement.preload = 'auto';
        
        this.musicElement.addEventListener('canplaythrough', () => {
            this.musicLoaded = true;
        });

        this.musicElement.addEventListener('error', (e) => {
            console.warn('Music file could not be loaded:', e);
        });
    }

    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    setMusicVolume(value) {
        this.musicVolume = value;
        if (this.musicGain) {
            this.musicGain.gain.value = this.isMuted ? 0 : value;
        }
        if (this.musicElement) {
            this.musicElement.volume = this.isMuted ? 0 : value;
        }
    }

    setSfxVolume(value) {
        this.sfxVolume = value;
        if (this.sfxGain) {
            this.sfxGain.gain.value = this.isMuted ? 0 : value;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.musicGain) {
            this.musicGain.gain.value = this.isMuted ? 0 : this.musicVolume;
        }
        if (this.sfxGain) {
            this.sfxGain.gain.value = this.isMuted ? 0 : this.sfxVolume;
        }
        if (this.musicElement) {
            this.musicElement.volume = this.isMuted ? 0 : this.musicVolume;
        }
        return this.isMuted;
    }

    // Create a note with frequency
    playNote(frequency, duration, type = 'square', gainNode = this.sfxGain, volume = 1) {
        if (!this.audioContext || this.isMuted) return;

        const oscillator = this.audioContext.createOscillator();
        const noteGain = this.audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        noteGain.connect(gainNode);
        oscillator.connect(noteGain);
        
        // Envelope
        const now = this.audioContext.currentTime;
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(volume, now + 0.01);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        oscillator.start(now);
        oscillator.stop(now + duration);
        
        return oscillator;
    }

    // Create noise for percussion
    createNoiseBuffer(duration) {
        const sampleRate = this.audioContext.sampleRate;
        const bufferSize = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        return buffer;
    }

    // Play noise-based percussion hit
    playNoise(duration, frequency = 1000, volume = 0.3, type = 'highpass') {
        if (!this.audioContext || this.isMuted) return;
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = this.createNoiseBuffer(duration);
        
        const noiseGain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        filter.type = type;
        filter.frequency.value = frequency;
        
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.sfxGain);
        
        const now = this.audioContext.currentTime;
        noiseGain.gain.setValueAtTime(volume, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        noise.start(now);
        noise.stop(now + duration);
    }

    // Sound effect: Piece lands
    playLand() {
        this.init();
        this.resume();
        
        const frequencies = [150, 100];
        frequencies.forEach((freq, i) => {
            setTimeout(() => {
                this.playNote(freq, 0.1, 'square', this.sfxGain, 0.3);
            }, i * 30);
        });
    }

    // Sound effect: Line clear
    playClear(lineCount = 1) {
        this.init();
        this.resume();
        
        const baseFreq = 400;
        const duration = 0.1;
        
        // More lines = more elaborate sound
        for (let i = 0; i < lineCount + 2; i++) {
            setTimeout(() => {
                this.playNote(baseFreq + (i * 100), duration, 'square', this.sfxGain, 0.4);
            }, i * 60);
        }
        
        // Add a final flourish for tetris
        if (lineCount === 4) {
            setTimeout(() => {
                this.playNote(880, 0.3, 'square', this.sfxGain, 0.5);
                this.playNote(1100, 0.3, 'sawtooth', this.sfxGain, 0.2);
            }, 300);
        }
    }

    // Sound effect: Pause
    playPause() {
        this.init();
        this.resume();
        
        this.playNote(440, 0.15, 'sine', this.sfxGain, 0.3);
        setTimeout(() => {
            this.playNote(330, 0.2, 'sine', this.sfxGain, 0.3);
        }, 100);
    }

    // Sound effect: Unpause
    playUnpause() {
        this.init();
        this.resume();
        
        this.playNote(330, 0.15, 'sine', this.sfxGain, 0.3);
        setTimeout(() => {
            this.playNote(440, 0.2, 'sine', this.sfxGain, 0.3);
        }, 100);
    }

    // Sound effect: Game Over
    playGameOver() {
        this.init();
        this.resume();
        
        const notes = [392, 370, 349, 330, 294, 262, 220, 196];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playNote(freq, 0.25, 'square', this.sfxGain, 0.4);
                this.playNote(freq / 2, 0.25, 'triangle', this.sfxGain, 0.2);
            }, i * 150);
        });
    }

    // Sound effect: Move piece
    playMove() {
        this.init();
        this.resume();
        this.playNote(200, 0.05, 'square', this.sfxGain, 0.15);
    }

    // Sound effect: Rotate piece
    playRotate() {
        this.init();
        this.resume();
        this.playNote(300, 0.08, 'square', this.sfxGain, 0.2);
        setTimeout(() => {
            this.playNote(350, 0.08, 'square', this.sfxGain, 0.2);
        }, 40);
    }

    // Sound effect: Hard drop
    playHardDrop() {
        this.init();
        this.resume();
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.playNote(200 - i * 20, 0.05, 'square', this.sfxGain, 0.3);
            }, i * 20);
        }
    }

    // Sound effect: Menu select
    playMenuSelect() {
        this.init();
        this.resume();
        this.playNote(440, 0.1, 'square', this.sfxGain, 0.3);
        setTimeout(() => {
            this.playNote(550, 0.15, 'square', this.sfxGain, 0.3);
        }, 80);
    }

    // Start background music (MP3)
    startMusic() {
        this.init();
        this.resume();
        
        if (this.musicPlaying) return;
        
        if (this.musicElement) {
            this.musicElement.currentTime = 0;
            this.musicElement.volume = this.isMuted ? 0 : this.musicVolume;
            
            const playPromise = this.musicElement.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.musicPlaying = true;
                }).catch(error => {
                    console.warn('Music playback was prevented:', error);
                });
            }
        }
    }

    // Stop background music
    stopMusic() {
        this.musicPlaying = false;
        if (this.musicElement) {
            this.musicElement.pause();
            this.musicElement.currentTime = 0;
        }
    }

    // Pause music
    pauseMusic() {
        if (this.musicElement && this.musicPlaying) {
            this.musicElement.pause();
        }
    }

    // Resume music
    resumeMusic() {
        if (this.musicElement && this.musicPlaying) {
            const playPromise = this.musicElement.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn('Music resume was prevented:', error);
                });
            }
        }
    }

    // Dynamic music speed based on level
    setMusicSpeed(speed) {
        if (this.musicElement) {
            // Clamp speed between 0.8 and 1.5
            const clampedSpeed = Math.max(0.8, Math.min(1.5, speed));
            this.musicElement.playbackRate = clampedSpeed;
        }
    }

    // Play achievement sound
    playAchievement() {
        this.init();
        this.resume();
        
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playNote(freq, 0.2, 'square', this.sfxGain, 0.4);
                this.playNote(freq * 2, 0.2, 'sine', this.sfxGain, 0.2);
            }, i * 100);
        });
    }

    // Play T-Spin sound
    playTSpin() {
        this.init();
        this.resume();
        
        this.playNote(523, 0.1, 'square', this.sfxGain, 0.4);
        setTimeout(() => this.playNote(659, 0.1, 'square', this.sfxGain, 0.4), 50);
        setTimeout(() => this.playNote(784, 0.15, 'square', this.sfxGain, 0.5), 100);
        setTimeout(() => this.playNote(1047, 0.2, 'sawtooth', this.sfxGain, 0.3), 150);
    }

    // Play combo sound
    playCombo(comboCount) {
        this.init();
        this.resume();
        
        const baseFreq = 300 + (comboCount * 50);
        this.playNote(baseFreq, 0.1, 'square', this.sfxGain, 0.35);
        setTimeout(() => {
            this.playNote(baseFreq * 1.5, 0.15, 'square', this.sfxGain, 0.35);
        }, 60);
    }

    // Play level up sound
    playLevelUp() {
        this.init();
        this.resume();
        
        const notes = [440, 550, 660, 880];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playNote(freq, 0.15, 'square', this.sfxGain, 0.4);
            }, i * 80);
        });
    }

    // Play hold piece sound
    playHold() {
        this.init();
        this.resume();
        this.playNote(220, 0.1, 'triangle', this.sfxGain, 0.3);
        setTimeout(() => {
            this.playNote(330, 0.1, 'triangle', this.sfxGain, 0.3);
        }, 50);
    }
}

// Global audio engine instance
const audioEngine = new AudioEngine();
