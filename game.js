// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
const gameState = {
    score: 0,
    lives: 3,
    currentQuestion: 0,
    gameRunning: false,
    wavePaused: false,
    questionTimer: 15,
    timerInterval: null
};

// Question bank
const questions = [
    {
        text: "Tác giả bài thơ Sông Đáy là?",
        answers: ['Xuân Diệu', 'Nguyễn Bính', 'Trần Đăng Khoa', 'Nguyễn Quang Thiều'],
        correct: 3
    },
    {
        text: "Câu thơ sau sử dụng biện pháp tu từ gì?\n“Sông Đáy chảy vào đời tôi\nNhư mẹ tôi gánh nặng rẽ vào ngõ sau mỗi buổi chiều đi làm về vất vả”",
        answers: ['Hoán dụ', 'Ẩn dụ', 'So sánh', 'Ẩn dụ và so sánh'],
        correct: 3
    },
    {
        text: "Bài thơ Sông Đáy được viết theo thể thơ nào?",
        answers: ['Tự do', 'Ngũ ngôn', 'Thất ngôn', 'Lục bát'],
        correct: 0
    },
    {
        text: "Bài thơ Sông Đáy được sáng tác năm nào?",
        answers: ['1989', '1990', '1991', '1992'],
        correct: 2
    },
    {
        text: "Bài thơ Sông Đáy được in trong tập?",
        answers: ['Lửa thiêng', 'Sự mất ngủ của lửa', 'Sự mất ngủ của gió', 'Lời thì thầm từ xa xưa'],
        correct: 1
    },
    {
        text: "Hình ảnh sông Đáy xuất hiện qua bao nhiêu mốc thời gian?",
        answers: ['1', '2', '3', '4'],
        correct: 2
    },
    {
        text: "Câu thơ sau sử dụng biện pháp tu từ nào?\n“Một cây ngô cuối vụ khô gầy\nSuốt đời buồn trong tiếng lá reo”",
        answers: ['Ẩn dụ', 'Hoán dụ', 'Nhân hóa', 'So sánh'],
        correct: 2
    },
    {
        text: "Nhà văn Nguyễn Quang Thiều sinh năm bao nhiêu?",
        answers: ['1955', '1956', '1957', '1958'],
        correct: 2
    },
    {
        text: "Địa danh nào sau đây là quê quán của nhà văn Nguyễn Quang Thiều?",
        answers: ['Hà Nam', 'Hà Tĩnh', 'Nam Định', 'Hà Nội'],
        correct: 3
    },
    {
        text: "Ngoài lĩnh vực chính là thơ ca tạo nên tên tuổi, ông còn là một nhà văn với các thể loại tiểu thuyết, truyện ngắn, bút kí và tham gia vào lĩnh vực nào?",
        answers: ['Báo chí', 'Điện ảnh', 'Xuất bản', 'Hội họa'],
        correct: 2
    }
];

// Shuffle array function
function shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

// Prepare shuffled answers and track correct answer
function prepareQuestion(questionIndex) {
    const question = questions[questionIndex];
    const answersWithIndices = question.answers.map((answer, index) => ({
        answer,
        originalIndex: index
    }));
    const shuffled = shuffleArray(answersWithIndices);
    const newCorrectIndex = shuffled.findIndex(item => item.originalIndex === question.correct);
    
    return {
        ...question,
        answers: shuffled.map(item => item.answer),
        correct: newCorrectIndex
    };
}

// Player class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 40;
        this.speed = 6;
    }

    update(keys) {
        const marginLeft = 12; // 15 - 3.5 offset để cân bằng trái
        const marginRight = 15; // cân bằng phải
        if ((keys['a'] || keys['A']) && this.x > marginLeft) {
            this.x -= this.speed;
        }
        if ((keys['d'] || keys['D']) && this.x < canvas.width - this.width - marginRight) {
            this.x += this.speed;
        }
    }

    draw() {
        // Draw spaceship - tower/pyramid style (green pixel art)
        const pixelSize = 7;
        ctx.fillStyle = '#00ff88';
        
        // Nose/Gun tip (1 pixel - top)
        ctx.fillRect(this.x + 24.5, this.y, pixelSize, pixelSize);
        
        // Row 1 (3 pixels)
        ctx.fillRect(this.x + 17.5, this.y + 7, pixelSize, pixelSize);
        ctx.fillRect(this.x + 24.5, this.y + 7, pixelSize, pixelSize);
        ctx.fillRect(this.x + 31.5, this.y + 7, pixelSize, pixelSize);
        
        // Row 2 (5 pixels)
        ctx.fillRect(this.x + 10.5, this.y + 14, pixelSize, pixelSize);
        ctx.fillRect(this.x + 17.5, this.y + 14, pixelSize, pixelSize);
        ctx.fillRect(this.x + 24.5, this.y + 14, pixelSize, pixelSize);
        ctx.fillRect(this.x + 31.5, this.y + 14, pixelSize, pixelSize);
        ctx.fillRect(this.x + 38.5, this.y + 14, pixelSize, pixelSize);
        
        // Row 3 (7 pixels - widest)
        ctx.fillRect(this.x + 3.5, this.y + 21, pixelSize, pixelSize);
        ctx.fillRect(this.x + 10.5, this.y + 21, pixelSize, pixelSize);
        ctx.fillRect(this.x + 17.5, this.y + 21, pixelSize, pixelSize);
        ctx.fillRect(this.x + 24.5, this.y + 21, pixelSize, pixelSize);
        ctx.fillRect(this.x + 31.5, this.y + 21, pixelSize, pixelSize);
        ctx.fillRect(this.x + 38.5, this.y + 21, pixelSize, pixelSize);
        ctx.fillRect(this.x + 45.5, this.y + 21, pixelSize, pixelSize);
        
        // Row 4 (5 pixels)
        ctx.fillRect(this.x + 10.5, this.y + 28, pixelSize, pixelSize);
        ctx.fillRect(this.x + 17.5, this.y + 28, pixelSize, pixelSize);
        ctx.fillRect(this.x + 24.5, this.y + 28, pixelSize, pixelSize);
        ctx.fillRect(this.x + 31.5, this.y + 28, pixelSize, pixelSize);
        ctx.fillRect(this.x + 38.5, this.y + 28, pixelSize, pixelSize);
        
        // Engine flame (yellow at bottom)
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(this.x + 17.5, this.y + 35, pixelSize, pixelSize);
        ctx.fillRect(this.x + 24.5, this.y + 35, pixelSize, pixelSize);
        ctx.fillRect(this.x + 31.5, this.y + 35, pixelSize, pixelSize);
    }
}

// Bullet class
class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 5;
        this.height = 15;
        this.speed = 8;
    }

    update() {
        this.y -= this.speed;
    }

    draw() {
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 1, this.y + 2, 3, 4);
    }

    isOffScreen() {
        return this.y < 0;
    }
}

// Alien class
class Alien {
    constructor(x, y, answer, isCorrect, answerIndex) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 40;
        this.speed = 0.49;
        this.answer = answer;
        this.isCorrect = isCorrect;
        this.answerIndex = answerIndex; // Position in the answer list (0-3)
        this.alive = true;
        this.animationFrame = 0;
        // Rainbow colors: Red, Orange, Yellow, Green, Blue, Indigo, Violet
        this.rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
        this.color = this.rainbowColors[Math.floor(Math.random() * this.rainbowColors.length)];
    }

    update() {
        this.y += this.speed;
        this.animationFrame++;
    }

    draw() {
        if (!this.alive) return;

        // Use random rainbow color for this alien
        const color = this.color;
        
        // Draw alien body (classic invader style with rainbow colors)
        ctx.fillStyle = color;
        
        // Head
        ctx.fillRect(this.x + 10, this.y, 30, 20);
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 15, this.y + 5, 6, 6);
        ctx.fillRect(this.x + 29, this.y + 5, 6, 6);
        
        // Body
        ctx.fillStyle = color;
        ctx.fillRect(this.x + 5, this.y + 20, 40, 15);
        
        // Legs
        ctx.fillRect(this.x + 10, this.y + 35, 8, 5);
        ctx.fillRect(this.x + 32, this.y + 35, 8, 5);

        // Animation wobble
        const wobble = Math.sin(this.animationFrame * 0.1) * 2;
        
        // Glow effect with rainbow color
        ctx.strokeStyle = `${color}99`;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x + wobble - 2, this.y - 2, this.width + 4, this.height + 4);

        // Draw answer text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const answerChar = String.fromCharCode(65 + this.answerIndex); // A, B, C, D
        ctx.fillText(answerChar, this.x + this.width / 2, this.y + this.height + 15);
    }

    isPastSafety() {
        return this.y > canvas.height;
    }

    collidesWith(bullet) {
        return (
            bullet.x < this.x + this.width &&
            bullet.x + bullet.width > this.x &&
            bullet.y < this.y + this.height &&
            bullet.y + bullet.height > this.y
        );
    }
}

// Game variables
const SHOOT_COOLDOWN = 200; // milliseconds between shots
let player = new Player(canvas.width / 2 - 20, canvas.height - 60);
let bullets = [];
let aliens = [];
let keys = {};
let currentQuestionData = null;
let aliensShotCorrectly = 0;
let waveWrongAliensKilled = 0;
let lastShotTime = 0;

// Initialize game
function initGame() {
    gameState.score = 0;
    gameState.lives = 3;
    gameState.currentQuestion = 0;
    gameState.gameRunning = true;
    gameState.wavePaused = false;
    
    updateHUD();
    startNewWave();
}

// Start new wave
function startNewWave() {
    if (gameState.currentQuestion >= 10) {
        finishGame();
        return;
    }

    // Clear any existing timer interval
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }

    gameState.wavePaused = true;
    gameState.questionTimer = 15;
    bullets = [];
    aliens = [];
    aliensShotCorrectly = 0;
    waveWrongAliensKilled = 0;
    updateHUD();

    // Prepare question
    currentQuestionData = prepareQuestion(gameState.currentQuestion);
    document.getElementById('question-text').textContent = currentQuestionData.text;
    document.getElementById('question-number').textContent = gameState.currentQuestion + 1;

    // Display answers on the right panel
    for (let i = 0; i < 4; i++) {
        document.getElementById(`answer-text-${i}`).textContent = currentQuestionData.answers[i];
    }

    // Create aliens - evenly spaced with equal distance between centers (100px)
    const alienX = [100, 200, 300, 400];
    const alienY = 50;

    for (let i = 0; i < 4; i++) {
        const isCorrect = i === currentQuestionData.correct;
        const alien = new Alien(
            alienX[i],
            alienY,
            currentQuestionData.answers[i],
            isCorrect,
            i
        );
        aliens.push(alien);
    }

    // Start wave after 2 seconds
    setTimeout(() => {
        gameState.wavePaused = false;
        startQuestionTimer();
    }, 2000);
}

// Start timer for question
function startQuestionTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }

    gameState.questionTimer = 15;
    updateHUD();

    gameState.timerInterval = setInterval(() => {
        gameState.questionTimer--;
        
        if (gameState.questionTimer >= 0) {
            updateHUD();
        }
        
        if (gameState.questionTimer < 0) {
            clearInterval(gameState.timerInterval);
            // Time's up, wait 1.5 seconds to let player see the "0"
            setTimeout(() => {
                const aliensPassed = aliens.some(a => a.isPastSafety());
                if (aliensPassed) {
                    loseLife(true);
                } else {
                    nextWave();
                }
            }, 1500);
        }
    }, 1000);
}

// Update HUD
function updateHUD() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('lives').textContent = gameState.lives;
    document.getElementById('timer').textContent = gameState.questionTimer;
}

// Shoot bullet
function shootBullet() {
    if (!gameState.wavePaused && gameState.gameRunning) {
        const now = Date.now();
        if (now - lastShotTime >= SHOOT_COOLDOWN) {
            lastShotTime = now;
            const bullet = new Bullet(
                player.x + 25.5,
                player.y
            );
            bullets.push(bullet);
            playShootSound();
        }
    }
}

// Check collisions
function checkCollisions() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];

        for (let j = aliens.length - 1; j >= 0; j--) {
            const alien = aliens[j];

            if (alien.alive && alien.collidesWith(bullet)) {
                alien.alive = false;
                bullets.splice(i, 1);

                playExplosionSound();

                if (alien.isCorrect) {
                    // Shot the correct answer - lose a life!
                    clearInterval(gameState.timerInterval);
                    loseLife(false);
                    return;
                } else {
                    // Shot a wrong answer
                    waveWrongAliensKilled++;
                }

                break;
            }
        }
    }
}

// Lose a life
function loseLife(passedSafety) {
    gameState.lives--;
    updateHUD();

    if (gameState.lives <= 0) {
        gameOver();
        return;
    }

    // Show modal with wrong answer info
    const correctAnswerChar = String.fromCharCode(65 + currentQuestionData.correct);
    document.getElementById('wrongAnswerText').textContent = 
        `Đáp án đúng: ${correctAnswerChar}`;
    document.getElementById('wrongAnswerModal').style.display = 'block';

    gameState.wavePaused = true;
}

// Continue game after losing life
function continueGame() {
    document.getElementById('wrongAnswerModal').style.display = 'none';
    startNewWave();
}

// Next wave (successful completion)
function nextWave() {
    clearInterval(gameState.timerInterval);
    
    // Check if all wrong answers were killed and correct answer passed
    if (waveWrongAliensKilled === 3) {
        // Perfect! Get a point
        gameState.score++;
        playFinishedSound();
    }

    updateHUD();
    gameState.currentQuestion++;

    // Immediately start next wave
    startNewWave();
}

// Game over
function gameOver() {
    gameState.gameRunning = false;
    clearInterval(gameState.timerInterval);
    
    playGameOverSound();
    
    document.getElementById('gameOverScore').textContent = gameState.score;
    document.getElementById('gameOverModal').style.display = 'block';
}

// Finish game
function finishGame() {
    gameState.gameRunning = false;
    clearInterval(gameState.timerInterval);
    
    playFinishedSound();
    
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('finishedModal').style.display = 'block';
}

// Sound functions (user will provide audio files)
function playShootSound() {
    // TODO: Play shoot sound
    // const audio = new Audio('sounds/shoot.mp3');
    // audio.play();
    console.log('Shoot sound');
}

function playExplosionSound() {
    // TODO: Play explosion sound
    // const audio = new Audio('sounds/explosion.mp3');
    // audio.play();
    console.log('Explosion sound');
}

function playGameOverSound() {
    // TODO: Play game over sound
    // const audio = new Audio('sounds/gameover.mp3');
    // audio.play();
    console.log('Game over sound');
}

function playFinishedSound() {
    // TODO: Play finished sound
    // const audio = new Audio('sounds/finished.mp3');
    // audio.play();
    console.log('Finished sound');
}

function playBackgroundMusic() {
    // TODO: Play background music
    // const audio = new Audio('sounds/background.mp3');
    // audio.loop = true;
    // audio.play();
    console.log('Background music started');
}

// Input handling
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (e.key === ' ') {
        e.preventDefault();
        shootBullet();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = 'rgba(10, 10, 30, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameState.gameRunning) {
        if (!gameState.wavePaused) {
            // Update
            player.update(keys);
            bullets.forEach(bullet => bullet.update());
            aliens.forEach(alien => alien.update());

            // Check collisions
            checkCollisions();

            // Check if aliens passed safety line
            for (const alien of aliens) {
                if (alien.isPastSafety() && alien.alive) {
                    clearInterval(gameState.timerInterval);
                    if (alien.isCorrect) {
                        // Correct alien passed - good! Move to next wave
                        nextWave();
                    } else {
                        // Wrong alien passed - lose a life
                        loseLife(true);
                    }
                    break;
                }
            }
        }

        // Remove off-screen bullets
        bullets = bullets.filter(b => !b.isOffScreen());

        // Draw everything
        aliens.forEach(alien => alien.draw());
        bullets.forEach(bullet => bullet.draw());
        player.draw();

        // Draw timer bar
        const timerBarWidth = (gameState.questionTimer / 15) * 150;
        ctx.fillStyle = gameState.questionTimer > 3 ? '#00ff88' : '#ff0055';
        ctx.fillRect(canvas.width - 160, 10, timerBarWidth, 10);
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 1;
        ctx.strokeRect(canvas.width - 160, 10, 150, 10);

        // Draw safety line (red pixel line at bottom)
        ctx.fillStyle = '#ff0055';
        for (let i = 0; i < canvas.width; i += 8) {
            ctx.fillRect(i, canvas.height - 8, 8, 8);
        }
    }

    requestAnimationFrame(gameLoop);
}

// Start game from instructions modal
function startGameFromInstructions() {
    // Hide instructions modal
    document.getElementById('instructionsModal').style.display = 'none';
    // Initialize and start game
    initGame();
    playBackgroundMusic();
}

// Start game
window.addEventListener('load', () => {
    // Instructions modal will be shown by default
    // Game will start when user clicks "Bắt Đầu Chơi" button
    gameLoop();
});

