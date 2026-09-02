/**
 * ============================================================================
 * SYNTHESIZED SOUND FX ENGINE (Native Web Audio API)
 * ============================================================================
 */
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = localStorage.getItem('lumen_muted') === 'true';
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('lumen_muted', this.muted);
        return this.muted;
    }

    playFlip() {
        if (this.muted) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(640, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }

    playMatch(combo = 1) {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const baseFreq = 440 * Math.pow(1.2, Math.min(combo - 1, 5));

        [baseFreq, baseFreq * 1.25, baseFreq * 1.5].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);

            gain.gain.setValueAtTime(0.12, now + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.35);
        });
    }

    playMismatch() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.2);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    playStar(index) {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const freqs = [523.25, 659.25, 783.99];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freqs[index] || 523.25, now);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
    }

    playWinFanfare() {
        if (this.muted) return;
        this.init();
        const notes = [261.63, 329.63, 392.00, 523.25];
        const now = this.ctx.currentTime;

        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.1);

            gain.gain.setValueAtTime(0.18, now + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.6);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.6);
        });
    }

    playClick() {
        if (this.muted) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
    }
}

/**
 * ============================================================================
 * CONFETTI PARTICLE SYSTEM
 * ============================================================================
 */
class ConfettiCannon {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animId = null;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    fire() {
        this.particles = [];
        const colors = ['#00f0ff', '#6366f1', '#a855f7', '#f59e0b', '#10b981', '#ffffff'];
        const count = 120;

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: this.canvas.width * 0.5,
                y: this.canvas.height * 0.6,
                vx: (Math.random() - 0.5) * 22,
                vy: (Math.random() - 0.8) * 22,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rSpeed: (Math.random() - 0.5) * 10,
                gravity: 0.45,
                opacity: 1
            });
        }

        if (!this.animId) {
            this.render();
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.rotation += p.rSpeed;
            p.opacity -= 0.008;

            this.ctx.save();
            this.ctx.globalAlpha = Math.max(p.opacity, 0);
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            this.ctx.restore();

            if (p.opacity <= 0 || p.y > this.canvas.height) {
                this.particles.splice(index, 1);
            }
        });

        if (this.particles.length > 0) {
            this.animId = requestAnimationFrame(() => this.render());
        } else {
            this.animId = null;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

/**
 * ============================================================================
 * CORE GAME CONTROLLER (ASSETS FOLDER INTEGRATION)
 * ============================================================================
 */
class MemoryGame {
    constructor() {
        this.sound = new SoundEngine();
        this.confetti = new ConfettiCannon('confetti-canvas');

        // Define filenames located in your assets folder
        this.cardImageFiles = [
            'card1.png',
            'card2.png',
            'card3.png',
            'card4.png',
            'card5.png',
            'card6.png',
            'card7.png',
            'card8.png',
            'card9.png',
            'card10.png',
            'card11.png',
            'card12.png'
        ];

        // Difficulty Configuration
        this.difficulty = 'medium'; // 'easy' | 'medium' | 'hard'
        this.diffConfigs = {
            easy: { pairs: 6, cols: 'easy' },     // Uses 6 images
            medium: { pairs: 8, cols: 'medium' }, // Uses 8 images
            hard: { pairs: 12, cols: 'hard' }     // Uses 12 images
        };

        // Game State Variables
        this.firstCard = null;
        this.secondCard = null;
        this.hasFlipped = false;
        this.lockBoard = false;
        this.moves = 0;
        this.matches = 0;
        this.totalPairs = 8;
        this.score = 0;
        this.combo = 0;
        this.secondsElapsed = 0;
        this.timerInterval = null;

        // Cache DOM Elements
        this.dom = {
            startScreen: document.getElementById('start-screen'),
            gameScreen: document.getElementById('game-screen'),
            victoryModal: document.getElementById('victory-modal'),
            board: document.getElementById('game-board'),
            moves: document.getElementById('hud-moves'),
            timer: document.getElementById('hud-timer'),
            score: document.getElementById('hud-score'),
            comboToast: document.getElementById('combo-toast'),
            menuBestScore: document.getElementById('menu-best-score'),
            winRecordBadge: document.getElementById('win-record-badge'),
            vScore: document.getElementById('v-final-score'),
            vTime: document.getElementById('v-final-time'),
            vMoves: document.getElementById('v-final-moves'),
            vAccuracy: document.getElementById('v-final-accuracy'),
            stars: [
                document.querySelector('.star-1'),
                document.querySelector('.star-2'),
                document.querySelector('.star-3')
            ],
            soundIcons: document.querySelectorAll('.sound-on-icon, .sound-off-icon')
        };

        this.initEventListeners();
        this.updateAudioIcons();
        this.updateMenuBestScore();
    }

    initEventListeners() {
        // Difficulty Selection
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.sound.playClick();
                document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
                const target = e.currentTarget;
                target.classList.add('active');
                this.difficulty = target.dataset.diff;
                this.updateMenuBestScore();
            });
        });

        // Start & Restart Buttons
        document.getElementById('start-game-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.switchScreen('game');
            this.startNewGame();
        });

        document.getElementById('hud-restart-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.startNewGame();
        });

        document.getElementById('home-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.stopTimer();
            this.switchScreen('start');
            this.updateMenuBestScore();
        });

        document.getElementById('victory-replay-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.dom.victoryModal.classList.remove('active');
            this.startNewGame();
        });

        document.getElementById('victory-home-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.dom.victoryModal.classList.remove('active');
            this.switchScreen('start');
            this.updateMenuBestScore();
        });

        // Sound Toggles
        const toggleSound = () => {
            const isMuted = this.sound.toggleMute();
            this.updateAudioIcons();
            if (!isMuted) this.sound.playClick();
        };

        document.getElementById('menu-sound-btn').addEventListener('click', toggleSound);
        document.getElementById('game-sound-btn').addEventListener('click', toggleSound);
    }

    updateAudioIcons() {
        const isMuted = this.sound.muted;
        document.querySelectorAll('.sound-on-icon').forEach(el => el.classList.toggle('hidden', isMuted));
        document.querySelectorAll('.sound-off-icon').forEach(el => el.classList.toggle('hidden', !isMuted));
    }

    switchScreen(screenName) {
        if (screenName === 'game') {
            this.dom.startScreen.classList.remove('active');
            this.dom.gameScreen.classList.add('active');
        } else {
            this.dom.gameScreen.classList.remove('active');
            this.dom.startScreen.classList.add('active');
        }
    }

    startNewGame() {
        this.stopTimer();
        this.resetTurnState();
        this.moves = 0;
        this.matches = 0;
        this.score = 0;
        this.combo = 0;
        this.secondsElapsed = 0;

        const config = this.diffConfigs[this.difficulty];
        this.totalPairs = config.pairs;

        // Configure Grid Class
        this.dom.board.className = `game-board diff-${config.cols}`;
        this.dom.board.innerHTML = '';

        // Reset HUD displays
        this.updateHUD();

        // Select the slice of images needed for the current difficulty
        const selectedImages = this.cardImageFiles.slice(0, this.totalPairs);
        let deck = [...selectedImages, ...selectedImages];
        deck = this.shuffle(deck);

        // Build DOM Card Elements using assets/ images
        deck.forEach((imageName, index) => {
            const card = this.createCardElement(imageName, index);
            this.dom.board.appendChild(card);
        });

        // Start Live Timer
        this.startTimer();
    }

    createCardElement(imageName, index) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.id = imageName;
        card.style.animationDelay = `${index * 0.03}s`;

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-back">
                    <svg class="card-back-pattern" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                        <polyline points="2 17 12 22 22 17"/>
                        <polyline points="2 12 12 17 22 12"/>
                    </svg>
                </div>
                <div class="card-face card-front">
                    <div class="card-front-content">
                        <img src="assets/${imageName}" 
                             alt="Card ${imageName}" 
                             draggable="false"
                             onerror="this.onerror=null; this.parentElement.innerHTML='<span style=\\'font-weight:900; color:#00f0ff; font-size:1.8rem;\\'>${imageName.replace(/\.[^/.]+$/, '')}</span>';" />
                    </div>
                </div>
            </div>
        `;

        card.addEventListener('click', () => this.handleCardClick(card));
        return card;
    }

    handleCardClick(card) {
        if (this.lockBoard) return;
        if (card === this.firstCard) return;
        if (card.classList.contains('matched') || card.classList.contains('flipped')) return;

        if (navigator.vibrate) navigator.vibrate(15);

        this.sound.playFlip();
        card.classList.add('flipped');

        if (!this.hasFlipped) {
            this.hasFlipped = true;
            this.firstCard = card;
            return;
        }

        this.secondCard = card;
        this.moves++;
        this.updateHUD();
        this.evaluateMatch();
    }

    evaluateMatch() {
        const isMatch = this.firstCard.dataset.id === this.secondCard.dataset.id;

        if (isMatch) {
            this.handleMatchSuccess();
        } else {
            this.handleMatchFailure();
        }
    }

    handleMatchSuccess() {
        this.lockBoard = true;
        this.combo++;
        this.matches++;

        const comboBonus = (this.combo - 1) * 150;
        const speedBonus = Math.max(50 - this.secondsElapsed, 10);
        this.score += 200 + comboBonus + speedBonus;

        if (this.combo > 1) {
            this.showComboToast(this.combo);
        }

        if (navigator.vibrate) navigator.vibrate([20, 50, 20]);
        this.sound.playMatch(this.combo);

        setTimeout(() => {
            this.firstCard.classList.add('matched');
            this.secondCard.classList.add('matched');
            this.updateHUD();
            this.resetTurnState();

            if (this.matches === this.totalPairs) {
                this.handleGameVictory();
            }
        }, 320);
    }

    handleMatchFailure() {
        this.lockBoard = true;
        this.combo = 0;
        this.score = Math.max(0, this.score - 20);

        if (navigator.vibrate) navigator.vibrate(40);
        setTimeout(() => {
            this.sound.playMismatch();
            this.firstCard.classList.add('mismatch');
            this.secondCard.classList.add('mismatch');
        }, 400);

        setTimeout(() => {
            this.firstCard.classList.remove('flipped', 'mismatch');
            this.secondCard.classList.remove('flipped', 'mismatch');
            this.updateHUD();
            this.resetTurnState();
        }, 1100);
    }

    handleGameVictory() {
        this.stopTimer();
        this.sound.playWinFanfare();
        this.confetti.fire();

        const minMoves = this.totalPairs;
        const accuracy = Math.round((minMoves / this.moves) * 100);
        let starsCount = 1;

        if (this.moves <= minMoves * 1.35 && this.secondsElapsed <= this.totalPairs * 4) {
            starsCount = 3;
        } else if (this.moves <= minMoves * 1.85) {
            starsCount = 2;
        }

        const storageKey = `lumen_best_${this.difficulty}`;
        const prevBest = parseInt(localStorage.getItem(storageKey)) || 0;
        const isNewRecord = this.score > prevBest;

        if (isNewRecord) {
            localStorage.setItem(storageKey, this.score);
        }

        this.dom.vScore.textContent = this.score;
        this.dom.vTime.textContent = this.formatTime(this.secondsElapsed);
        this.dom.vMoves.textContent = this.moves;
        this.dom.vAccuracy.textContent = `${accuracy}%`;
        this.dom.winRecordBadge.classList.toggle('hidden', !isNewRecord);

        this.dom.stars.forEach(star => star.classList.remove('earned'));

        setTimeout(() => {
            this.dom.victoryModal.classList.add('active');

            for (let i = 0; i < starsCount; i++) {
                setTimeout(() => {
                    this.dom.stars[i].classList.add('earned');
                    this.sound.playStar(i);
                    if (navigator.vibrate) navigator.vibrate(25);
                }, 400 + i * 280);
            }
        }, 500);
    }

    showComboToast(comboCount) {
        this.dom.comboToast.textContent = `STREAK ×${comboCount}!`;
        this.dom.comboToast.classList.add('show');
        setTimeout(() => {
            this.dom.comboToast.classList.remove('show');
        }, 850);
    }

    resetTurnState() {
        this.hasFlipped = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
    }

    startTimer() {
        this.secondsElapsed = 0;
        this.timerInterval = setInterval(() => {
            this.secondsElapsed++;
            this.dom.timer.textContent = this.formatTime(this.secondsElapsed);
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    updateHUD() {
        this.dom.moves.textContent = this.moves;
        this.dom.score.textContent = this.score;
    }

    updateMenuBestScore() {
        const storageKey = `lumen_best_${this.difficulty}`;
        const best = localStorage.getItem(storageKey) || 0;
        this.dom.menuBestScore.textContent = `${best} PTS`;
    }

    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
}

// Bootstrap on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new MemoryGame();
});
