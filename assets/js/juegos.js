// ========== VARIABLES GLOBALES ==========
let totalPoints = 0;
let currentGame = null;

// ========== FUNCIONES AUXILIARES ==========
function addPoints(points, message = '') {
    totalPoints += points;
    console.log(`+${points} puntos! Total: ${totalPoints}`);
    
    // Mostrar notificación flotante
    const notification = document.createElement('div');
    notification.className = 'points-notification';
    notification.innerHTML = `🎉 +${points} puntos ${message ? `(${message})` : ''}`;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4caf50, #45a049);
        color: white;
        padding: 12px 20px;
        border-radius: 50px;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2s forwards;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2300);
}

function playSound(type) {
    // Simulación de sonido
    console.log(`🔊 Sonido: ${type}`);
}














// ========== JUEGO 1: QUIZ MATEMÁTICO MEJORADO ==========
let mathQuizInterval = null;
let mathQuizCurrentQuestion = 0;
let mathQuizScore = 0;
let mathQuizTimerInterval = null;
let mathQuizTimeLeft = 10;
let mathQuizAnswerLocked = false;
let mathQuizDifficulty = 'normal';
let mathQuizLives = 3;
let mathQuizStreak = 0;
let mathQuizPowerUps = {
    doublePoints: false,
    extraTime: false,
    fiftyFifty: false
};
let mathQuizBestScore = localStorage.getItem('mathQuizBestScore') || 0;
let mathQuizQuestionsAnswered = 0;
let mathQuizCorrectAnswers = 0;

// Base de datos ampliada de preguntas matemáticas
const mathQuizQuestions = [
    // Fáciles
    { text: "5 + 3 = ?", options: ["6", "7", "8", "9"], correct: 2, dificultad: "facil", explicacion: "5 + 3 = 8" },
    { text: "10 - 4 = ?", options: ["5", "6", "7", "8"], correct: 1, dificultad: "facil", explicacion: "10 - 4 = 6" },
    { text: "2 × 4 = ?", options: ["6", "7", "8", "9"], correct: 2, dificultad: "facil", explicacion: "2 × 4 = 8" },
    { text: "12 ÷ 3 = ?", options: ["3", "4", "5", "6"], correct: 1, dificultad: "facil", explicacion: "12 ÷ 3 = 4" },
    { text: "¿Cuántos minutos hay en una hora?", options: ["30", "45", "60", "90"], correct: 2, dificultad: "facil", explicacion: "Una hora tiene 60 minutos" },
    { text: "7 + 8 = ?", options: ["13", "14", "15", "16"], correct: 2, dificultad: "facil", explicacion: "7 + 8 = 15" },
    { text: "20 - 5 = ?", options: ["10", "12", "15", "18"], correct: 2, dificultad: "facil", explicacion: "20 - 5 = 15" },
    { text: "3 × 4 = ?", options: ["10", "11", "12", "13"], correct: 2, dificultad: "facil", explicacion: "3 × 4 = 12" },
    
    // Normales
    { text: "4 × 3 = ?", options: ["10", "11", "12", "14"], correct: 2, dificultad: "normal", explicacion: "4 × 3 = 12" },
    { text: "15 ÷ 3 = ?", options: ["3", "4", "5", "6"], correct: 2, dificultad: "normal", explicacion: "15 ÷ 3 = 5" },
    { text: "7 × 2 = ?", options: ["12", "13", "14", "15"], correct: 2, dificultad: "normal", explicacion: "7 × 2 = 14" },
    { text: "20 - 8 = ?", options: ["10", "11", "12", "13"], correct: 2, dificultad: "normal", explicacion: "20 - 8 = 12" },
    { text: "25 ÷ 5 = ?", options: ["3", "4", "5", "6"], correct: 2, dificultad: "normal", explicacion: "25 ÷ 5 = 5" },
    { text: "9 + 7 = ?", options: ["14", "15", "16", "17"], correct: 2, dificultad: "normal", explicacion: "9 + 7 = 16" },
    { text: "6 × 6 = ?", options: ["30", "32", "36", "40"], correct: 2, dificultad: "normal", explicacion: "6 × 6 = 36" },
    { text: "30 - 12 = ?", options: ["16", "17", "18", "19"], correct: 2, dificultad: "normal", explicacion: "30 - 12 = 18" },
    
    // Difíciles
    { text: "9 × 6 = ?", options: ["54", "56", "63", "48"], correct: 0, dificultad: "dificil", explicacion: "9 × 6 = 54" },
    { text: "144 ÷ 12 = ?", options: ["10", "11", "12", "13"], correct: 2, dificultad: "dificil", explicacion: "144 ÷ 12 = 12" },
    { text: "√81 = ?", options: ["7", "8", "9", "10"], correct: 2, dificultad: "dificil", explicacion: "La raíz cuadrada de 81 es 9" },
    { text: "8² = ?", options: ["56", "64", "72", "48"], correct: 1, dificultad: "dificil", explicacion: "8 al cuadrado es 64" },
    { text: "45 ÷ 9 = ?", options: ["4", "5", "6", "7"], correct: 1, dificultad: "dificil", explicacion: "45 ÷ 9 = 5" },
    { text: "7 × 8 = ?", options: ["48", "54", "56", "63"], correct: 2, dificultad: "dificil", explicacion: "7 × 8 = 56" },
    { text: "100 ÷ 4 = ?", options: ["20", "25", "30", "35"], correct: 1, dificultad: "dificil", explicacion: "100 ÷ 4 = 25" },
    { text: "12 × 12 = ?", options: ["124", "132", "144", "156"], correct: 2, dificultad: "dificil", explicacion: "12 × 12 = 144" }
];

const difficultyConfig = {
    facil: { tiempoBase: 20, puntosBase: 10, vidas: 5, preguntas: 8, color: "#4CAF50" },
    normal: { tiempoBase: 15, puntosBase: 15, vidas: 3, preguntas: 12, color: "#2196F3" },
    dificil: { tiempoBase: 10, puntosBase: 25, vidas: 2, preguntas: 16, color: "#f44336" }
};

let currentQuestions = [];

function startMathQuiz() {
    const container = document.getElementById('mathQuizContainer');
    if (!container) return;
    
    mathQuizCurrentQuestion = 0;
    mathQuizScore = 0;
    mathQuizLives = difficultyConfig[mathQuizDifficulty].vidas;
    mathQuizStreak = 0;
    mathQuizAnswerLocked = false;
    mathQuizQuestionsAnswered = 0;
    mathQuizCorrectAnswers = 0;
    mathQuizPowerUps = {
        doublePoints: false,
        extraTime: false,
        fiftyFifty: false
    };
    
    if (mathQuizTimerInterval) clearInterval(mathQuizTimerInterval);
    
    // Seleccionar preguntas según dificultad
    selectQuestionsByDifficulty();
    showMainMenu();
}

function selectQuestionsByDifficulty() {
    const filtered = mathQuizQuestions.filter(q => q.dificultad === mathQuizDifficulty);
    const shuffled = [...filtered];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    currentQuestions = shuffled.slice(0, difficultyConfig[mathQuizDifficulty].preguntas);
}

function showMainMenu() {
    const container = document.getElementById('mathQuizContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="math-quiz-container">
            <div class="math-header">
                <h2>🧮 QUIZ MATEMÁTICO</h2>
                <div class="math-best-score">🏆 Récord: ${mathQuizBestScore}</div>
            </div>
            
            <div class="math-difficulty-menu">
                <div class="difficulty-card facil" onclick="setMathDifficulty('facil')">
                    <div class="difficulty-icon">🌟</div>
                    <div class="difficulty-name">Fácil</div>
                    <div class="difficulty-details">
                        <span>⏱️ ${difficultyConfig.facil.tiempoBase}s</span>
                        <span>❤️ ${difficultyConfig.facil.vidas} vidas</span>
                        <span>⭐ ${difficultyConfig.facil.puntosBase} pts</span>
                    </div>
                </div>
                <div class="difficulty-card normal" onclick="setMathDifficulty('normal')">
                    <div class="difficulty-icon">⚡</div>
                    <div class="difficulty-name">Normal</div>
                    <div class="difficulty-details">
                        <span>⏱️ ${difficultyConfig.normal.tiempoBase}s</span>
                        <span>❤️ ${difficultyConfig.normal.vidas} vidas</span>
                        <span>⭐ ${difficultyConfig.normal.puntosBase} pts</span>
                    </div>
                </div>
                <div class="difficulty-card dificil" onclick="setMathDifficulty('dificil')">
                    <div class="difficulty-icon">🔥</div>
                    <div class="difficulty-name">Difícil</div>
                    <div class="difficulty-details">
                        <span>⏱️ ${difficultyConfig.dificil.tiempoBase}s</span>
                        <span>❤️ ${difficultyConfig.dificil.vidas} vidas</span>
                        <span>⭐ ${difficultyConfig.dificil.puntosBase} pts</span>
                    </div>
                </div>
            </div>
            
            <div class="math-instructions">
                <p>📖 Responde las preguntas antes de que se acabe el tiempo</p>
                <p>🎯 Acierta varias seguidas para obtener bonificaciones</p>
                <p>💪 Usa los power-ups para ayudarte</p>
            </div>
        </div>
    `;
}

function setMathDifficulty(difficulty) {
    mathQuizDifficulty = difficulty;
    startMathQuiz();
    showMathQuizQuestion();
}

function showMathQuizQuestion() {
    const container = document.getElementById('mathQuizContainer');
    if (!container) return;
    
    if (mathQuizLives <= 0) {
        handleGameOver();
        return;
    }
    
    if (mathQuizCurrentQuestion >= currentQuestions.length) {
        handleVictory();
        return;
    }
    
    const q = currentQuestions[mathQuizCurrentQuestion];
    const config = difficultyConfig[mathQuizDifficulty];
    mathQuizTimeLeft = config.tiempoBase;
    mathQuizAnswerLocked = false;
    
    // Mezclar opciones
    let options = [...q.options];
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    const correctValue = q.options[q.correct];
    const newCorrectIndex = options.indexOf(correctValue);
    
    container.innerHTML = `
        <div class="math-quiz-container active">
            <div class="math-header">
                <div class="math-stats">
                    <div class="stat">❤️ ${mathQuizLives}</div>
                    <div class="stat">🔥 ${mathQuizStreak}</div>
                    <div class="stat">⭐ ${mathQuizScore}</div>
                    <div class="stat">🎯 ${mathQuizDifficulty === 'facil' ? '🌟' : mathQuizDifficulty === 'dificil' ? '🔥' : '⚡'}</div>
                </div>
                <div class="math-timer">
                    <div class="timer-label">⏱️ Tiempo</div>
                    <div class="timer-value" id="mathTimerDisplay">${mathQuizTimeLeft}</div>
                    <div class="timer-bar">
                        <div id="mathTimerProgress" class="timer-progress" style="width:100%"></div>
                    </div>
                </div>
            </div>
            
            <div class="math-question">
                <div class="question-icon">🧮</div>
                <h3>${q.text}</h3>
            </div>
            
            <div class="math-options">
                ${options.map((opt, idx) => `
                    <button class="math-option" onclick="checkMathAnswer(${idx}, ${newCorrectIndex})">
                        <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                        <span class="option-text">${opt}</span>
                    </button>
                `).join('')}
            </div>
            
            <div class="math-powerups">
                <button class="powerup-btn ${mathQuizPowerUps.doublePoints ? 'used' : ''}" onclick="useMathPowerUp('doublePoints')">
                    <span>🎯</span> ×2 Puntos
                </button>
                <button class="powerup-btn ${mathQuizPowerUps.extraTime ? 'used' : ''}" onclick="useMathPowerUp('extraTime')">
                    <span>⏰</span> +5 seg
                </button>
                <button class="powerup-btn ${mathQuizPowerUps.fiftyFifty ? 'used' : ''}" onclick="useMathPowerUp('fiftyFifty')">
                    <span>50/50</span> 🔪
                </button>
            </div>
            
            <div class="math-progress">
                <span>Pregunta ${mathQuizCurrentQuestion + 1} de ${currentQuestions.length}</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${((mathQuizCurrentQuestion + 1) / currentQuestions.length) * 100}%"></div>
                </div>
            </div>
            
            <div id="mathFeedback" class="math-feedback"></div>
        </div>
    `;
    
    startMathTimer();
}

function startMathTimer() {
    if (mathQuizTimerInterval) clearInterval(mathQuizTimerInterval);
    
    const config = difficultyConfig[mathQuizDifficulty];
    const totalTime = config.tiempoBase;
    
    mathQuizTimerInterval = setInterval(() => {
        if (mathQuizAnswerLocked) return;
        
        mathQuizTimeLeft--;
        const timerDisplay = document.getElementById('mathTimerDisplay');
        const timerProgress = document.getElementById('mathTimerProgress');
        
        if (timerDisplay) timerDisplay.innerText = mathQuizTimeLeft;
        if (timerProgress) {
            const percentage = (mathQuizTimeLeft / totalTime) * 100;
            timerProgress.style.width = `${percentage}%`;
            if (mathQuizTimeLeft <= 5) {
                timerProgress.style.backgroundColor = '#ff4444';
                timerDisplay.style.color = '#ff4444';
                timerDisplay.style.animation = 'pulse 0.5s infinite';
            }
        }
        
        if (mathQuizTimeLeft <= 0 && !mathQuizAnswerLocked) {
            clearInterval(mathQuizTimerInterval);
            handleTimeOut();
        }
    }, 1000);
}

function handleTimeOut() {
    mathQuizAnswerLocked = true;
    mathQuizLives--;
    mathQuizStreak = 0;
    mathQuizQuestionsAnswered++;
    
    const q = currentQuestions[mathQuizCurrentQuestion];
    showMathMessage(`⏰ ¡TIEMPO AGOTADO! Era: ${q.options[q.correct]} -1 vida`, 'error');
    
    setTimeout(() => {
        mathQuizCurrentQuestion++;
        showMathQuizQuestion();
    }, 2000);
}

function checkMathAnswer(selectedIndex, correctIndex) {
    if (mathQuizAnswerLocked) return;
    
    mathQuizAnswerLocked = true;
    clearInterval(mathQuizTimerInterval);
    
    const q = currentQuestions[mathQuizCurrentQuestion];
    const config = difficultyConfig[mathQuizDifficulty];
    let pointsToAdd = config.puntosBase;
    
    if (mathQuizPowerUps.doublePoints) {
        pointsToAdd *= 2;
        mathQuizPowerUps.doublePoints = false;
    }
    
    if (selectedIndex === correctIndex) {
        // Correcto
        mathQuizCorrectAnswers++;
        mathQuizStreak++;
        mathQuizQuestionsAnswered++;
        
        // Bonus por racha
        if (mathQuizStreak >= 3) {
            const streakBonus = 10;
            pointsToAdd += streakBonus;
            showMathMessage(`🔥 ¡RACHA DE ${mathQuizStreak}! +${streakBonus} pts`, 'success');
        }
        
        // Bonus por respuesta rápida
        if (mathQuizTimeLeft > config.tiempoBase * 0.6) {
            const fastBonus = 5;
            pointsToAdd += fastBonus;
            showMathMessage(`⚡ ¡Rápido! +${fastBonus} pts`, 'success');
        }
        
        mathQuizScore += pointsToAdd;
        
        if (mathQuizScore > mathQuizBestScore) {
            mathQuizBestScore = mathQuizScore;
            localStorage.setItem('mathQuizBestScore', mathQuizBestScore);
        }
        
        showMathMessage(`✅ ¡Correcto! +${pointsToAdd} puntos`, 'success');
        
        // Efecto visual
        const questionDiv = document.querySelector('.math-question');
        if (questionDiv) {
            questionDiv.style.animation = 'celebrate 0.3s ease';
            setTimeout(() => {
                questionDiv.style.animation = '';
            }, 300);
        }
    } else {
        // Incorrecto
        mathQuizLives--;
        mathQuizStreak = 0;
        mathQuizQuestionsAnswered++;
        
        showMathMessage(`❌ Incorrecto. Respuesta: ${q.options[q.correct]}<br>📚 ${q.explicacion} -1 vida`, 'error');
        
        // Efecto de vibración
        const optionsDiv = document.querySelector('.math-options');
        if (optionsDiv) {
            optionsDiv.style.animation = 'shake 0.3s ease';
            setTimeout(() => {
                optionsDiv.style.animation = '';
            }, 300);
        }
    }
    
    setTimeout(() => {
        mathQuizCurrentQuestion++;
        showMathQuizQuestion();
    }, 2500);
}

function useMathPowerUp(powerUp) {
    if (mathQuizAnswerLocked || mathQuizPowerUps[powerUp]) {
        showMathMessage('⚠️ No puedes usar esto ahora', 'warning');
        return;
    }
    
    switch(powerUp) {
        case 'doublePoints':
            mathQuizPowerUps.doublePoints = true;
            showMathMessage('🎯 ¡Puntos dobles activados para la siguiente pregunta!', 'success');
            break;
        case 'extraTime':
            mathQuizTimeLeft += 5;
            mathQuizPowerUps.extraTime = true;
            showMathMessage('⏰ ¡+5 segundos de tiempo extra!', 'success');
            const timerDisplay = document.getElementById('mathTimerDisplay');
            if (timerDisplay) timerDisplay.innerText = mathQuizTimeLeft;
            break;
        case 'fiftyFifty':
            mathQuizPowerUps.fiftyFifty = true;
            activateFiftyFiftyMath();
            break;
    }
}

function activateFiftyFiftyMath() {
    const q = currentQuestions[mathQuizCurrentQuestion];
    let options = [...q.options];
    const correctAnswer = options[q.correct];
    
    // Eliminar 2 opciones incorrectas
    let incorrectOptions = options.filter((_, idx) => idx !== q.correct);
    for (let i = incorrectOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [incorrectOptions[i], incorrectOptions[j]] = [incorrectOptions[j], incorrectOptions[i]];
    }
    const remainingIncorrect = incorrectOptions.slice(0, 2);
    const finalOptions = [correctAnswer, ...remainingIncorrect];
    
    // Mezclar opciones finales
    for (let i = finalOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [finalOptions[i], finalOptions[j]] = [finalOptions[j], finalOptions[i]];
    }
    
    const optionsContainer = document.querySelector('.math-options');
    const correctValue = q.options[q.correct];
    const newCorrectIndex = finalOptions.indexOf(correctValue);
    
    if (optionsContainer) {
        optionsContainer.innerHTML = finalOptions.map((opt, idx) => `
            <button class="math-option" onclick="checkMathAnswer(${idx}, ${newCorrectIndex})">
                <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                <span class="option-text">${opt}</span>
            </button>
        `).join('');
        showMathMessage('🔪 ¡50/50 activado! Dos opciones eliminadas', 'info');
    }
}

function showMathMessage(message, type) {
    const feedbackDiv = document.getElementById('mathFeedback');
    if (!feedbackDiv) return;
    
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196F3'
    };
    
    feedbackDiv.innerHTML = `<div style="color: ${colors[type]}; padding: 12px; border-radius: 10px; background: rgba(0,0,0,0.1);">${message}</div>`;
    
    setTimeout(() => {
        if (feedbackDiv.innerHTML === `<div style="color: ${colors[type]}; padding: 12px; border-radius: 10px; background: rgba(0,0,0,0.1);">${message}</div>`) {
            feedbackDiv.innerHTML = '';
        }
    }, 3000);
}

function handleVictory() {
    const config = difficultyConfig[mathQuizDifficulty];
    const porcentaje = (mathQuizCorrectAnswers / currentQuestions.length) * 100;
    let bonusPrecision = 0;
    
    if (porcentaje >= 80) bonusPrecision = 50;
    else if (porcentaje >= 60) bonusPrecision = 30;
    else if (porcentaje >= 40) bonusPrecision = 15;
    
    const vidasBonus = mathQuizLives * 20;
    const totalScore = mathQuizScore + bonusPrecision + vidasBonus;
    
    const container = document.getElementById('mathQuizContainer');
    if (container) {
        container.innerHTML = `
            <div class="math-quiz-container victory">
                <div class="victory-icon">🏆✨</div>
                <h2>¡MATEMÁTICO EXCELENTE!</h2>
                <div class="score-details">
                    <div class="detail">📊 Puntaje: ${mathQuizScore}</div>
                    <div class="detail">🎯 Aciertos: ${mathQuizCorrectAnswers}/${currentQuestions.length} (${Math.round(porcentaje)}%)</div>
                    <div class="detail">🎁 Bonus precisión: +${bonusPrecision}</div>
                    <div class="detail">❤️ Bonus vidas: +${vidasBonus}</div>
                    <div class="detail total">⭐ TOTAL: ${totalScore} puntos</div>
                    <div class="detail record">🏆 Mejor puntaje: ${mathQuizBestScore}</div>
                </div>
                <div class="victory-buttons">
                    <button class="game-btn" onclick="startMathQuiz()">🔄 Jugar de nuevo</button>
                    <button class="game-btn" onclick="showMainMenu()">🏠 Menú principal</button>
                </div>
            </div>
        `;
        addPoints(totalScore, `Quiz Matemático - ${mathQuizCorrectAnswers}/${currentQuestions.length} aciertos`);
    }
}

function handleGameOver() {
    const container = document.getElementById('mathQuizContainer');
    if (container) {
        container.innerHTML = `
            <div class="math-quiz-container gameover">
                <div class="gameover-icon">💀</div>
                <h2>¡GAME OVER!</h2>
                <div class="score-details">
                    <div class="detail">📊 Puntaje final: ${mathQuizScore}</div>
                    <div class="detail">🎯 Aciertos: ${mathQuizCorrectAnswers}/${mathQuizQuestionsAnswered}</div>
                </div>
                <div class="victory-buttons">
                    <button class="game-btn" onclick="startMathQuiz()">🔄 Intentar de nuevo</button>
                    <button class="game-btn" onclick="showMainMenu()">🏠 Menú principal</button>
                </div>
            </div>
        `;
    }
}

function showMainMenu() {
    const container = document.getElementById('mathQuizContainer');
    if (container) {
        container.innerHTML = `
            <div class="math-quiz-container">
                <div class="math-header">
                    <h2>🧮 QUIZ MATEMÁTICO</h2>
                    <div class="math-best-score">🏆 Récord: ${mathQuizBestScore}</div>
                </div>
                
                <div class="math-difficulty-menu">
                    <div class="difficulty-card facil" onclick="setMathDifficulty('facil')">
                        <div class="difficulty-icon">🌟</div>
                        <div class="difficulty-name">Fácil</div>
                        <div class="difficulty-details">
                            <span>⏱️ ${difficultyConfig.facil.tiempoBase}s</span>
                            <span>❤️ ${difficultyConfig.facil.vidas} vidas</span>
                            <span>⭐ ${difficultyConfig.facil.puntosBase} pts</span>
                        </div>
                    </div>
                    <div class="difficulty-card normal" onclick="setMathDifficulty('normal')">
                        <div class="difficulty-icon">⚡</div>
                        <div class="difficulty-name">Normal</div>
                        <div class="difficulty-details">
                            <span>⏱️ ${difficultyConfig.normal.tiempoBase}s</span>
                            <span>❤️ ${difficultyConfig.normal.vidas} vidas</span>
                            <span>⭐ ${difficultyConfig.normal.puntosBase} pts</span>
                        </div>
                    </div>
                    <div class="difficulty-card dificil" onclick="setMathDifficulty('dificil')">
                        <div class="difficulty-icon">🔥</div>
                        <div class="difficulty-name">Difícil</div>
                        <div class="difficulty-details">
                            <span>⏱️ ${difficultyConfig.dificil.tiempoBase}s</span>
                            <span>❤️ ${difficultyConfig.dificil.vidas} vidas</span>
                            <span>⭐ ${difficultyConfig.dificil.puntosBase} pts</span>
                        </div>
                    </div>
                </div>
                
                <div class="math-instructions">
                    <p>📖 Responde las preguntas antes de que se acabe el tiempo</p>
                    <p>🎯 Acierta varias seguidas para obtener bonificaciones</p>
                    <p>💪 Usa los power-ups para ayudarte</p>
                </div>
            </div>
        `;
    }
}

function continueFromLastQuestion() {
    if (mathQuizLives > 0) {
        showMathQuizQuestion();
    } else {
        startMathQuiz();
    }
}

// Estilos CSS para el Quiz Matemático
const mathStyles = `
    .math-quiz-container {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 25px;
        padding: 25px;
        color: white;
        min-height: 500px;
    }
    
    .math-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        flex-wrap: wrap;
        gap: 10px;
    }
    
    .math-header h2 {
        margin: 0;
        font-size: 1.8rem;
        background: linear-gradient(135deg, #ffd700, #ff9800);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .math-best-score {
        background: rgba(255,215,0,0.2);
        padding: 8px 15px;
        border-radius: 20px;
        font-weight: bold;
    }
    
    .math-stats {
        display: flex;
        gap: 20px;
        background: rgba(0,0,0,0.3);
        padding: 10px 20px;
        border-radius: 30px;
    }
    
    .stat {
        font-size: 1.1rem;
        font-weight: bold;
    }
    
    .math-timer {
        background: rgba(0,0,0,0.3);
        padding: 10px 20px;
        border-radius: 30px;
        text-align: center;
        min-width: 120px;
    }
    
    .timer-label {
        font-size: 0.8rem;
        opacity: 0.8;
    }
    
    .timer-value {
        font-size: 1.5rem;
        font-weight: bold;
    }
    
    .timer-bar {
        width: 100%;
        height: 5px;
        background: rgba(255,255,255,0.3);
        border-radius: 5px;
        overflow: hidden;
        margin-top: 5px;
    }
    
    .timer-progress {
        height: 100%;
        background: #4CAF50;
        transition: width 1s linear;
    }
    
    .math-question {
        background: rgba(255,255,255,0.1);
        border-radius: 20px;
        padding: 25px;
        text-align: center;
        margin: 25px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
    }
    
    .question-icon {
        font-size: 2.5rem;
    }
    
    .math-question h3 {
        margin: 0;
        font-size: 1.5rem;
    }
    
    .math-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin: 20px 0;
    }
    
    .math-option {
        background: rgba(255,255,255,0.1);
        border: 2px solid rgba(255,255,255,0.2);
        border-radius: 15px;
        padding: 15px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 12px;
        transition: all 0.3s ease;
        color: white;
        font-size: 1rem;
    }
    
    .math-option:hover {
        background: rgba(255,255,255,0.2);
        transform: translateX(5px);
        border-color: #ffd700;
    }
    
    .option-letter {
        background: #ffd700;
        color: #333;
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-weight: bold;
    }
    
    .math-powerups {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin: 20px 0;
        flex-wrap: wrap;
    }
    
    .powerup-btn {
        background: rgba(255,215,0,0.2);
        border: 2px solid #ffd700;
        border-radius: 30px;
        padding: 10px 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        color: white;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .powerup-btn:hover:not(.used) {
        background: rgba(255,215,0,0.4);
        transform: translateY(-2px);
    }
    
    .powerup-btn.used {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .math-progress {
        text-align: center;
        margin: 20px 0;
    }
    
    .progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(255,255,255,0.2);
        border-radius: 10px;
        overflow: hidden;
        margin-top: 8px;
    }
    
    .progress-fill {
        height: 100%;
        background: #4CAF50;
        transition: width 0.3s ease;
    }
    
    .math-feedback {
        min-height: 70px;
        margin-top: 15px;
    }
    
    .math-difficulty-menu {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin: 30px 0;
    }
    
    .difficulty-card {
        background: rgba(255,255,255,0.1);
        border-radius: 20px;
        padding: 25px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .difficulty-card:hover {
        transform: translateY(-5px);
    }
    
    .difficulty-card.facil:hover { background: rgba(76,175,80,0.2); }
    .difficulty-card.normal:hover { background: rgba(33,150,243,0.2); }
    .difficulty-card.dificil:hover { background: rgba(244,67,54,0.2); }
    
    .difficulty-icon {
        font-size: 3rem;
        margin-bottom: 10px;
    }
    
    .difficulty-name {
        font-size: 1.3rem;
        font-weight: bold;
        margin-bottom: 10px;
    }
    
    .difficulty-details {
        display: flex;
        justify-content: center;
        gap: 15px;
        font-size: 0.8rem;
        opacity: 0.8;
    }
    
    .math-instructions {
        background: rgba(0,0,0,0.2);
        border-radius: 15px;
        padding: 15px;
        margin-top: 20px;
    }
    
    .math-instructions p {
        margin: 8px 0;
    }
    
    .victory .victory-icon,
    .gameover .gameover-icon {
        font-size: 4rem;
        text-align: center;
        margin-bottom: 20px;
    }
    
    .score-details {
        background: rgba(0,0,0,0.3);
        border-radius: 15px;
        padding: 20px;
        margin: 20px 0;
    }
    
    .detail {
        margin: 8px 0;
    }
    
    .detail.total {
        font-size: 1.2rem;
        font-weight: bold;
        color: #ffd700;
        margin-top: 12px;
    }
    
    .victory-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    @keyframes celebrate {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); background: rgba(76,175,80,0.2); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;

if (!document.querySelector('#mathStyles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'mathStyles';
    styleSheet.textContent = mathStyles;
    document.head.appendChild(styleSheet);
}



























// ========== JUEGO 2: SUMA CON ARRASTRE MEJORADO ==========
let dragDropSumTarget = 8;
let dragDropCurrentSum = 0;
let dragDropUsedNumbers = [];
let dragDropMoves = 0;
let dragDropBestScore = localStorage.getItem('dragDropBestScore') || 0;
let dragDropCombo = 0;
let dragDropHintUsed = false;
let dragDropLevel = 1;

// Niveles del juego
const dragDropLevels = [
    { target: 8, numbers: [1,2,3,4,5,6], timeLimit: 60, bonus: 20 },
    { target: 12, numbers: [2,3,4,5,6,7], timeLimit: 50, bonus: 30 },
    { target: 15, numbers: [3,4,5,6,7,8], timeLimit: 45, bonus: 40 },
    { target: 20, numbers: [4,5,6,7,8,9], timeLimit: 40, bonus: 50 },
    { target: 25, numbers: [5,6,7,8,9,10], timeLimit: 35, bonus: 60 }
];

let dragDropTimer = null;
let dragDropTimeLeft = 60;

function initDragDropNumbers() {
    const container = document.getElementById('dragDropNumbers');
    if (!container) return;
    
    // Resetear estado
    if (dragDropTimer) clearInterval(dragDropTimer);
    
    const level = dragDropLevels[dragDropLevel - 1];
    dragDropSumTarget = level.target;
    dragDropCurrentSum = 0;
    dragDropUsedNumbers = [];
    dragDropMoves = 0;
    dragDropCombo = 0;
    dragDropHintUsed = false;
    dragDropTimeLeft = level.timeLimit;
    
    // Generar números con valores aleatorios pero equilibrados
    let numbers = level.numbers.map(val => ({ 
        value: val, 
        text: val.toString(),
        used: false
    }));
    
    // Mezclar números
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    container.innerHTML = `
        <div class="drag-game-container enhanced">
            <div class="drag-header">
                <div class="drag-stats">
                    <div class="stat">🎯 Nivel ${dragDropLevel}</div>
                    <div class="stat">⭐ ${dragDropBestScore}</div>
                    <div class="stat">🎯 Objetivo: ${dragDropSumTarget}</div>
                </div>
                <div class="drag-timer">
                    ⏱️ <span id="dragTimer">${dragDropTimeLeft}</span>s
                    <div class="timer-bar">
                        <div id="dragTimerProgress" style="width:100%; height:100%; background:#4CAF50;"></div>
                    </div>
                </div>
            </div>
            
            <div class="drag-target">
                <div class="drop-zone" id="sumDropZone">
                    <div class="drop-zone-icon">📦</div>
                    <div class="drop-zone-text">Arrastra números aquí</div>
                    <div id="sumDisplay" class="sum-display">
                        <span class="sum-label">Suma actual:</span>
                        <span class="sum-value">0</span>
                    </div>
                </div>
            </div>
            
            <div class="drag-numbers-grid">
                ${numbers.map((n, idx) => `
                    <div class="drag-item" draggable="true" data-value="${n.value}" data-index="${idx}">
                        <div class="drag-number">${n.text}</div>
                        <div class="drag-badge">+${n.value}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="drag-controls">
                <div class="drag-moves">🎮 Movimientos: <span id="dragMoves">0</span></div>
                <div class="drag-combo">🔥 Combo: <span id="dragCombo">0</span></div>
                <button class="game-btn small" onclick="dragDropHint()" id="hintBtn">💡 Pista</button>
                <button class="game-btn small" onclick="dragDropUndo()">↩️ Deshacer</button>
                <button class="game-btn small" onclick="dragDropResetGame()">🔄 Reiniciar</button>
            </div>
            
            <div id="dragDropResult" class="game-feedback"></div>
            
            <div class="drag-history" id="dragHistory">
                <div class="history-title">📝 Historial:</div>
                <div class="history-items"></div>
            </div>
        </div>
    `;
    
    setupDragDropDragAndDrop(numbers);
    startDragDropTimer();
    updateDragDropStats();
}

function setupDragDropDragAndDrop(numbers) {
    let draggedValue = null;
    let draggedItem = null;
    
    document.querySelectorAll('.drag-item').forEach(item => {
        item.addEventListener('dragstart', e => {
            draggedValue = parseInt(e.target.closest('.drag-item').getAttribute('data-value'));
            draggedItem = e.target.closest('.drag-item');
            e.dataTransfer.setData('text/plain', draggedValue);
            e.target.closest('.drag-item').style.transform = 'scale(0.95)';
            e.target.closest('.drag-item').style.opacity = '0.7';
        });
        
        item.addEventListener('dragend', e => {
            if (e.target.closest('.drag-item')) {
                e.target.closest('.drag-item').style.transform = 'scale(1)';
                e.target.closest('.drag-item').style.opacity = '1';
            }
        });
    });
    
    const dropZone = document.getElementById('sumDropZone');
    if (!dropZone) return;
    
    dropZone.addEventListener('dragover', e => {
        e.preventDefault();
        dropZone.style.transform = 'scale(1.02)';
        dropZone.style.borderColor = '#4CAF50';
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.style.transform = 'scale(1)';
        dropZone.style.borderColor = '#ccc';
    });
    
    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.style.transform = 'scale(1)';
        dropZone.style.borderColor = '#ccc';
        
        const val = draggedValue;
        if (!val) return;
        
        const usedItem = document.querySelector(`.drag-item[data-value="${val}"]:not([style*="pointer-events: none"])`);
        
        if (dragDropUsedNumbers.includes(val)) {
            showDragDropMessage('⚠️ ¡Ya usaste ese número!', 'warning');
            playSound('incorrecto');
            return;
        }
        
        const newSum = dragDropCurrentSum + val;
        
        if (newSum <= dragDropSumTarget) {
            // Movimiento válido
            dragDropCurrentSum = newSum;
            dragDropUsedNumbers.push(val);
            dragDropMoves++;
            dragDropCombo++;
            
            // Actualizar UI
            const sumDisplay = document.getElementById('sumDisplay');
            if (sumDisplay) {
                sumDisplay.querySelector('.sum-value').innerHTML = dragDropCurrentSum;
            }
            
            // Marcar como usado
            if (usedItem) {
                usedItem.style.opacity = '0.3';
                usedItem.style.pointerEvents = 'none';
                usedItem.style.filter = 'grayscale(0.5)';
                usedItem.classList.add('used');
            }
            
            // Añadir al historial
            addToDragDropHistory(val);
            
            // Actualizar estadísticas
            updateDragDropStats();
            
            // Efecto visual
            showDragDropFloatingNumber(val, true);
            
            // Verificar victoria
            if (dragDropCurrentSum === dragDropSumTarget) {
                handleDragDropVictory();
            } else {
                playSound('correcto');
                showDragDropMessage(`✅ +${val} | Suma: ${dragDropCurrentSum}/${dragDropSumTarget}`, 'success');
            }
        } else {
            // Movimiento inválido - romper combo
            dragDropCombo = 0;
            updateDragDropStats();
            showDragDropMessage(`❌ ¡Te pasaste! ${dragDropCurrentSum} + ${val} = ${newSum} > ${dragDropSumTarget}`, 'error');
            playSound('incorrecto');
            showDragDropShake(dropZone);
        }
        
        draggedValue = null;
    });
}

function handleDragDropVictory() {
    if (dragDropTimer) clearInterval(dragDropTimer);
    
    const level = dragDropLevels[dragDropLevel - 1];
    let basePoints = level.bonus;
    let comboBonus = dragDropCombo * 5;
    let movesBonus = Math.max(0, (10 - dragDropMoves) * 2);
    let timeBonus = Math.floor(dragDropTimeLeft * 0.5);
    let hintPenalty = dragDropHintUsed ? -10 : 0;
    
    let totalPoints = basePoints + comboBonus + movesBonus + timeBonus + hintPenalty;
    totalPoints = Math.max(totalPoints, 10);
    
    // Actualizar mejor puntuación
    if (totalPoints > dragDropBestScore) {
        dragDropBestScore = totalPoints;
        localStorage.setItem('dragDropBestScore', dragDropBestScore);
    }
    
    const resultDiv = document.getElementById('dragDropResult');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="victory-animation">
                🎉✨ ¡VICTORIA! ✨🎉<br>
                ⭐ Puntos: ${totalPoints} ⭐<br>
                🔥 Combo: +${comboBonus}<br>
                🎯 Movimientos: +${movesBonus}<br>
                ⏱️ Tiempo: +${timeBonus}<br>
                ${hintPenalty < 0 ? `💡 Pista: ${hintPenalty}` : ''}<br>
                🏆 Mejor puntuación: ${dragDropBestScore}
            </div>
        `;
        playSound('win');
    }
    
    addPoints(totalPoints, `Nivel ${dragDropLevel} completado!`);
    
    // Subir de nivel o reiniciar
    if (dragDropLevel < dragDropLevels.length) {
        setTimeout(() => {
            if (confirm(`🎉 ¿Pasar al nivel ${dragDropLevel + 1}?`)) {
                dragDropLevel++;
                initDragDropNumbers();
            } else {
                dragDropResetGame();
            }
        }, 2000);
    } else {
        setTimeout(() => {
            showDragDropMessage('🏆 ¡COMPLETASTE TODOS LOS NIVELES! 🏆', 'win');
            setTimeout(() => dragDropResetGame(), 3000);
        }, 2000);
    }
}

function startDragDropTimer() {
    if (dragDropTimer) clearInterval(dragDropTimer);
    
    dragDropTimer = setInterval(() => {
        if (dragDropTimeLeft <= 0) {
            clearInterval(dragDropTimer);
            handleDragDropGameOver();
        } else {
            dragDropTimeLeft--;
            const timerSpan = document.getElementById('dragTimer');
            const timerProgress = document.getElementById('dragTimerProgress');
            
            if (timerSpan) timerSpan.innerText = dragDropTimeLeft;
            if (timerProgress) {
                const level = dragDropLevels[dragDropLevel - 1];
                const percentage = (dragDropTimeLeft / level.timeLimit) * 100;
                timerProgress.style.width = `${percentage}%`;
                timerProgress.style.backgroundColor = dragDropTimeLeft < 10 ? '#ff4444' : '#4CAF50';
            }
            
            if (dragDropTimeLeft === 5) {
                playSound('warning');
                showDragDropMessage('⚠️ ¡5 segundos restantes! ⚠️', 'warning');
            }
        }
    }, 1000);
}

function handleDragDropGameOver() {
    if (dragDropTimer) clearInterval(dragDropTimer);
    
    const resultDiv = document.getElementById('dragDropResult');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="game-over-animation">
                💀 ¡TIEMPO AGOTADO! 💀<br>
                Sumaste: ${dragDropCurrentSum}/${dragDropSumTarget}<br>
                🔄 Reinicia para intentarlo de nuevo
            </div>
        `;
        playSound('gameover');
    }
}

function dragDropHint() {
    if (dragDropHintUsed) {
        showDragDropMessage('💡 Ya usaste tu pista en este nivel', 'warning');
        return;
    }
    
    const remaining = dragDropSumTarget - dragDropCurrentSum;
    const availableNumbers = dragDropLevels[dragDropLevel - 1].numbers.filter(n => !dragDropUsedNumbers.includes(n));
    
    // Buscar combinación posible
    let hint = null;
    for (let num of availableNumbers) {
        if (num === remaining) {
            hint = num;
            break;
        }
    }
    
    if (!hint && availableNumbers.length > 0) {
        // Buscar combinación de dos números
        for (let i = 0; i < availableNumbers.length; i++) {
            for (let j = i + 1; j < availableNumbers.length; j++) {
                if (availableNumbers[i] + availableNumbers[j] === remaining) {
                    hint = `${availableNumbers[i]} + ${availableNumbers[j]}`;
                    break;
                }
            }
            if (hint) break;
        }
    }
    
    if (hint) {
        dragDropHintUsed = true;
        document.getElementById('hintBtn').disabled = true;
        showDragDropMessage(`💡 Pista: Necesitas ${typeof hint === 'number' ? hint : hint} para completar`, 'info');
        playSound('hint');
    } else {
        showDragDropMessage('😅 No hay pista disponible, ¡sigue intentando!', 'info');
    }
}

function dragDropUndo() {
    if (dragDropUsedNumbers.length === 0) {
        showDragDropMessage('⚠️ No hay movimientos para deshacer', 'warning');
        return;
    }
    
    const lastNumber = dragDropUsedNumbers.pop();
    dragDropCurrentSum -= lastNumber;
    dragDropMoves--;
    dragDropCombo = Math.max(0, dragDropCombo - 1);
    
    // Reactivar el número
    const items = document.querySelectorAll('.drag-item');
    for (let item of items) {
        if (parseInt(item.getAttribute('data-value')) === lastNumber && item.style.pointerEvents === 'none') {
            item.style.opacity = '1';
            item.style.pointerEvents = 'auto';
            item.style.filter = 'none';
            item.classList.remove('used');
            break;
        }
    }
    
    // Actualizar UI
    const sumDisplay = document.getElementById('sumDisplay');
    if (sumDisplay) {
        sumDisplay.querySelector('.sum-value').innerHTML = dragDropCurrentSum;
    }
    
    updateDragDropStats();
    showDragDropMessage(`↩️ Deshecho: -${lastNumber}`, 'info');
    playSound('undo');
    
    // Actualizar historial
    removeLastFromHistory();
}

function addToDragDropHistory(value) {
    const historyContainer = document.querySelector('.history-items');
    if (historyContainer) {
        const entry = document.createElement('div');
        entry.className = 'history-entry';
        entry.textContent = `+${value}`;
        historyContainer.appendChild(entry);
        historyContainer.scrollTop = historyContainer.scrollHeight;
    }
}

function removeLastFromHistory() {
    const historyContainer = document.querySelector('.history-items');
    if (historyContainer && historyContainer.lastChild) {
        historyContainer.removeChild(historyContainer.lastChild);
    }
}

function updateDragDropStats() {
    const movesSpan = document.getElementById('dragMoves');
    const comboSpan = document.getElementById('dragCombo');
    
    if (movesSpan) movesSpan.innerText = dragDropMoves;
    if (comboSpan) comboSpan.innerText = dragDropCombo;
}

function showDragDropMessage(message, type) {
    const resultDiv = document.getElementById('dragDropResult');
    if (resultDiv) {
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3',
            win: '#9C27B0'
        };
        resultDiv.innerHTML = `<span style="color: ${colors[type] || '#fff'}">${message}</span>`;
        setTimeout(() => {
            if (resultDiv.innerHTML === `<span style="color: ${colors[type] || '#fff'}">${message}</span>`) {
                resultDiv.innerHTML = '';
            }
        }, 2000);
    }
}

function showDragDropFloatingNumber(value, isPositive) {
    const dropZone = document.getElementById('sumDropZone');
    if (!dropZone) return;
    
    const floating = document.createElement('div');
    floating.className = 'floating-number';
    floating.textContent = `${isPositive ? '+' : '-'}${value}`;
    floating.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        font-weight: bold;
        color: ${isPositive ? '#4CAF50' : '#f44336'};
        pointer-events: none;
        animation: floatUp 0.8s ease-out forwards;
        z-index: 1000;
    `;
    
    dropZone.style.position = 'relative';
    dropZone.appendChild(floating);
    
    setTimeout(() => floating.remove(), 800);
}

function showDragDropShake(element) {
    if (!element) return;
    element.style.animation = 'shake 0.3s ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 300);
}

function dragDropResetGame() {
    dragDropLevel = 1;
    dragDropBestScore = localStorage.getItem('dragDropBestScore') || 0;
    initDragDropNumbers();
}

// Añadir estilos CSS dinámicos
const dragDropStyles = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -100%) scale(1.5);
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .drag-game-container.enhanced {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        border-radius: 20px;
        color: white;
    }
    
    .drag-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        flex-wrap: wrap;
        gap: 10px;
    }
    
    .drag-stats {
        display: flex;
        gap: 15px;
        background: rgba(255,255,255,0.2);
        padding: 8px 15px;
        border-radius: 25px;
    }
    
    .drag-timer {
        background: rgba(0,0,0,0.3);
        padding: 8px 15px;
        border-radius: 25px;
    }
    
    .timer-bar {
        width: 100px;
        height: 5px;
        background: rgba(255,255,255,0.3);
        border-radius: 5px;
        overflow: hidden;
        margin-top: 5px;
    }
    
    .drag-numbers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
        gap: 15px;
        margin: 20px 0;
    }
    
    .drag-item {
        background: white;
        border-radius: 15px;
        padding: 15px;
        text-align: center;
        cursor: grab;
        transition: all 0.3s ease;
        position: relative;
        user-select: none;
    }
    
    .drag-item:active {
        cursor: grabbing;
    }
    
    .drag-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    }
    
    .drag-number {
        font-size: 2rem;
        font-weight: bold;
        color: #667eea;
    }
    
    .drag-badge {
        font-size: 0.8rem;
        color: #999;
        margin-top: 5px;
    }
    
    .drag-item.used {
        opacity: 0.3;
        filter: grayscale(0.5);
        cursor: not-allowed;
    }
    
    .drop-zone {
        background: rgba(255,255,255,0.2);
        border: 3px dashed white;
        border-radius: 20px;
        padding: 30px;
        text-align: center;
        transition: all 0.3s ease;
        min-height: 150px;
    }
    
    .drop-zone-icon {
        font-size: 3rem;
        margin-bottom: 10px;
    }
    
    .sum-display {
        margin-top: 15px;
        font-size: 1.5rem;
        font-weight: bold;
    }
    
    .sum-value {
        font-size: 2rem;
        color: #ffd700;
        margin-left: 10px;
    }
    
    .drag-controls {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 20px;
    }
    
    .game-btn.small {
        padding: 8px 15px;
        font-size: 0.9rem;
        background: rgba(255,255,255,0.2);
    }
    
    .drag-history {
        margin-top: 20px;
        padding: 10px;
        background: rgba(0,0,0,0.2);
        border-radius: 10px;
    }
    
    .history-title {
        font-size: 0.9rem;
        margin-bottom: 5px;
    }
    
    .history-items {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        max-height: 50px;
        overflow-y: auto;
    }
    
    .history-entry {
        background: rgba(255,255,255,0.3);
        padding: 3px 8px;
        border-radius: 15px;
        font-size: 0.8rem;
    }
    
    .victory-animation, .game-over-animation {
        animation: pulse 0.5s ease;
        text-align: center;
        padding: 20px;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;

// Añadir estilos al documento
if (!document.querySelector('#dragDropStyles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'dragDropStyles';
    styleSheet.textContent = dragDropStyles;
    document.head.appendChild(styleSheet);
}





























































// ========== JUEGO 3: MEMORIA ==========
let memoryCards = [];
let memoryFlipped = [];
let memoryLocked = false;
let memoryMatched = 0;
let memoryCanFlip = true;

function initMemoryGame() {
    const container = document.getElementById('memoryGameContainer');
    if (!container) return;
    
    memoryFlipped = [];
    memoryLocked = false;
    memoryMatched = 0;
    memoryCanFlip = true;
    
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    let cards = [...emojis, ...emojis];
    
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    container.innerHTML = `
        <div class="memory-stats">
            <span>🎯 Parejas encontradas: <span id="memoryMatchedCount">0</span>/8</span>
            <button class="game-btn-small" onclick="initMemoryGame()">🔄 Reiniciar</button>
        </div>
        <div class="memory-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; max-width: 550px; margin: 20px auto;">
            ${cards.map((emoji, idx) => `
                <div class="memory-card" data-index="${idx}" data-emoji="${emoji}" data-flipped="false" data-matched="false">
                    <div class="memory-card-inner">
                        <div class="memory-card-front">❓</div>
                        <div class="memory-card-back">${emoji}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div id="memoryFeedback" class="game-feedback"></div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .memory-card {
            background: transparent;
            perspective: 1000px;
            cursor: pointer;
            aspect-ratio: 1;
        }
        .memory-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            text-align: center;
            transition: transform 0.6s;
            transform-style: preserve-3d;
            border-radius: 15px;
        }
        .memory-card.flipped .memory-card-inner {
            transform: rotateY(180deg);
        }
        .memory-card-front, .memory-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            border-radius: 15px;
        }
        .memory-card-front {
            background: linear-gradient(135deg, #6c5ce7, #a8e6cf);
            transform: rotateY(0deg);
        }
        .memory-card-back {
            background: linear-gradient(135deg, #00b894, #55efc4);
            transform: rotateY(180deg);
        }
        .memory-card.matched {
            opacity: 0.5;
            cursor: default;
            pointer-events: none;
        }
        .memory-card.matched .memory-card-back {
            background: #4caf50;
        }
        .game-btn-small {
            background: var(--color-1);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 0.9rem;
        }
        .memory-stats {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
    `;
    container.appendChild(style);
    
    document.querySelectorAll('.memory-card').forEach(card => {
        card.addEventListener('click', () => handleMemoryClick(card));
    });
}

function handleMemoryClick(card) {
    if (memoryLocked || !memoryCanFlip) return;
    if (card.classList.contains('flipped')) return;
    if (card.classList.contains('matched')) return;
    if (memoryFlipped.length >= 2) return;
    
    card.classList.add('flipped');
    memoryFlipped.push(card);
    
    if (memoryFlipped.length === 2) {
        memoryLocked = true;
        memoryCanFlip = false;
        
        const card1 = memoryFlipped[0];
        const card2 = memoryFlipped[1];
        const emoji1 = card1.querySelector('.memory-card-back').innerHTML;
        const emoji2 = card2.querySelector('.memory-card-back').innerHTML;
        
        if (emoji1 === emoji2) {
            memoryMatched++;
            document.getElementById('memoryMatchedCount').innerText = memoryMatched;
            document.getElementById('memoryFeedback').innerHTML = '✅ ¡Pareja encontrada! +10 puntos';
            addPoints(10, '¡Par de memoria encontrado!');
            playSound('correcto');
            
            card1.classList.add('matched');
            card2.classList.add('matched');
            memoryFlipped = [];
            memoryLocked = false;
            memoryCanFlip = true;
            
            if (memoryMatched === 8) {
                document.getElementById('memoryFeedback').innerHTML = '🎉 ¡Felicidades! Completaste el juego 🎉 +50 puntos extra';
                addPoints(50, '¡Memoria completada!');
                setTimeout(() => initMemoryGame(), 3000);
            }
        } else {
            document.getElementById('memoryFeedback').innerHTML = '❌ No coinciden. ¡Sigue intentando!';
            playSound('incorrecto');
            
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                memoryFlipped = [];
                memoryLocked = false;
                memoryCanFlip = true;
                document.getElementById('memoryFeedback').innerHTML = '';
            }, 1000);
        }
    }
}



































































// ========== JUEGO 4: FORMA ORACIONES MEJORADO ==========
let sentenceDroppedWords = [];
let sentenceCustomWords = [];
let sentenceMode = 'affirmative'; // 'affirmative', 'negative', 'question'
let sentenceScore = 0;
let sentenceAttempts = 0;
let sentenceMaxAttempts = 5;

// Banco de palabras expandido con categorías
const sentenceWordBank = {
    sujetos: {
        singular: ["El", "La", "Un", "Una", "Mi", "Tu", "Su"],
        plural: ["Los", "Las", "Unos", "Unas", "Mis", "Tus", "Sus"],
        nombres: ["gato", "perro", "niño", "niña", "maestro", "doctor", "cocinero", "artista", "músico"],
        nombres_propios: ["Ana", "Luis", "Carlos", "María", "Juan", "Sofía", "Pablo", "Laura"]
    },
    verbos: {
        presente: ["come", "lee", "juega", "canta", "baila", "dibuja", "escribe", "corre", "salta", "nada"],
        pasado: ["comió", "leyó", "jugó", "cantó", "bailó", "dibujó", "escribió", "corrió", "saltó", "nadó"],
        futuro: ["comerá", "leerá", "jugará", "cantará", "bailará", "dibujará", "escribirá", "correrá", "saltará", "nadará"]
    },
    objetos: {
        singular: ["pescado", "libro", "pelota", "canción", "dibujo", "carta", "juguete", "carro", "flor", "árbol"],
        plural: ["pescados", "libros", "pelotas", "canciones", "dibujos", "cartas", "juguetes", "carros", "flores", "árboles"]
    },
    complementos: ["en el parque", "en la escuela", "en casa", "rápidamente", "felizmente", "con energía", "todas las mañanas", "por la tarde"],
    conectores: ["y", "pero", "porque", "entonces", "también"],
    negativos: ["no", "nunca", "jamás", "tampoco"],
    preguntas: ["¿", "Qué", "Quién", "Cómo", "Cuándo", "Dónde", "Por qué", "Para qué"]
};

// Reglas gramaticales para validación
const grammarRules = {
    // Verificar que comienza con mayúscula
    hasCapitalLetter: (sentence) => /^[A-ZÁÉÍÓÚÜÑ]/.test(sentence),
    
    // Verificar que termina correctamente según el modo
    hasCorrectEnding: (sentence, mode) => {
        if (mode === 'question') return /[¿?]$/.test(sentence);
        if (mode === 'exclamation') return /[¡!]$/.test(sentence);
        return /[.!]$/.test(sentence) || !/[.?!]$/.test(sentence);
    },
    
    // Verificar que tiene al menos un sujeto y un verbo
    hasSubjectAndVerb: (words) => {
        const hasSubject = words.some(word => 
            sentenceWordBank.sujetos.singular.includes(word) ||
            sentenceWordBank.sujetos.plural.includes(word) ||
            sentenceWordBank.sujetos.nombres.includes(word) ||
            sentenceWordBank.sujetos.nombres_propios.includes(word)
        );
        const hasVerb = words.some(word => 
            sentenceWordBank.verbos.presente.includes(word) ||
            sentenceWordBank.verbos.pasado.includes(word) ||
            sentenceWordBank.verbos.futuro.includes(word)
        );
        return hasSubject && hasVerb;
    },
    
    // Verificar concordancia básica (artículo - sustantivo)
    checkAgreement: (words) => {
        let agreements = 0;
        for (let i = 0; i < words.length - 1; i++) {
            const current = words[i];
            const next = words[i + 1];
            
            // El/La + nombre singular
            if ((current === "El" || current === "La") && 
                sentenceWordBank.sujetos.nombres.includes(next)) {
                agreements++;
            }
            // Los/Las + nombre plural
            if ((current === "Los" || current === "Las") && 
                sentenceWordBank.objetos.plural.includes(next)) {
                agreements++;
            }
            // Un/Una + nombre
            if ((current === "Un" || current === "Una") && 
                (sentenceWordBank.sujetos.nombres.includes(next) || 
                 sentenceWordBank.objetos.singular.includes(next))) {
                agreements++;
            }
        }
        return agreements > 0;
    }
};

function initSentenceDragDrop() {
    const area = document.getElementById('sentenceDragArea');
    if (!area) return;
    
    sentenceDroppedWords = [];
    sentenceCustomWords = [];
    sentenceAttempts = 0;
    
    // Mezclar todas las palabras disponibles
    const allWords = [
        ...sentenceWordBank.sujetos.singular,
        ...sentenceWordBank.sujetos.plural,
        ...sentenceWordBank.sujetos.nombres,
        ...sentenceWordBank.sujetos.nombres_propios,
        ...sentenceWordBank.verbos.presente,
        ...sentenceWordBank.verbos.pasado,
        ...sentenceWordBank.verbos.futuro,
        ...sentenceWordBank.objetos.singular,
        ...sentenceWordBank.objetos.plural,
        ...sentenceWordBank.complementos,
        ...sentenceWordBank.conectores,
        ...sentenceWordBank.negativos
    ];
    
    // Mezclar palabras
    const shuffledWords = [...allWords].sort(() => Math.random() - 0.5);
    
    area.innerHTML = `
        <div class="sentence-game-enhanced">
            <div class="sentence-header">
                <div class="mode-selector">
                    <button class="mode-btn ${sentenceMode === 'affirmative' ? 'active' : ''}" onclick="setSentenceMode('affirmative')">
                        ✨ Oración Afirmativa
                    </button>
                    <button class="mode-btn ${sentenceMode === 'negative' ? 'active' : ''}" onclick="setSentenceMode('negative')">
                        ❌ Oración Negativa
                    </button>
                    <button class="mode-btn ${sentenceMode === 'question' ? 'active' : ''}" onclick="setSentenceMode('question')">
                        ❓ Pregunta
                    </button>
                </div>
                <div class="sentence-stats">
                    <span>⭐ Puntuación: ${sentenceScore}</span>
                    <span>🎯 Intento ${sentenceAttempts + 1}/${sentenceMaxAttempts}</span>
                </div>
            </div>
            
            <div class="sentence-bank-enhanced">
                <h4>📚 Banco de palabras <small>(¡Arrástralas para formar oraciones!)</small></h4>
                <div class="drag-container-enhanced" id="sentenceWordBank">
                    ${shuffledWords.map(p => `
                        <div class="drag-item-enhanced" draggable="true" data-word="${p}" data-category="${getWordCategory(p)}">
                            ${p}
                        </div>
                    `).join('')}
                </div>
                <div class="custom-word-input">
                    <input type="text" id="customWordInput" placeholder="✏️ Escribe tu propia palabra..." maxlength="20">
                    <button class="btn-small" onclick="addCustomWord()">➕ Añadir</button>
                </div>
            </div>
            
            <div class="sentence-area-enhanced">
                <h4>✏️ Tu oración</h4>
                <div class="drop-zone-enhanced" id="sentenceDropZone">
                    <div class="drop-zone-content" id="sentencePreview">
                        <span class="placeholder">✨ Arrastra o escribe palabras aquí</span>
                    </div>
                </div>
                <div class="sentence-buttons-enhanced">
                    <button id="checkSentenceBtn" class="btn-card">✅ Verificar Oración</button>
                    <button id="clearSentenceBtn" class="btn-card">🗑️ Limpiar Todo</button>
                    <button id="removeLastBtn" class="btn-card">↩️ Quitar Última</button>
                    <button id="randomSentenceBtn" class="btn-card">🎲 Oración Aleatoria</button>
                </div>
                <div id="sentenceResult" class="game-feedback"></div>
                <div id="grammarFeedback" class="grammar-feedback"></div>
            </div>
            
            <div class="tips-section">
                <h4>💡 Tips para formar oraciones:</h4>
                <ul>
                    <li>✓ Toda oración necesita un sujeto (quién hace la acción)</li>
                    <li>✓ Toda oración necesita un verbo (acción)</li>
                    <li>✓ Las oraciones afirmativas expresan hechos</li>
                    <li>✓ Las oraciones negativas llevan "no" antes del verbo</li>
                    <li>✓ Las preguntas llevan signos ¿?</li>
                </ul>
            </div>
        </div>
    `;
    
    setupSentenceDragAndDrop();
    setupSentenceButtons();
}

function getWordCategory(word) {
    if (sentenceWordBank.sujetos.singular.includes(word) || sentenceWordBank.sujetos.plural.includes(word)) return 'artículo';
    if (sentenceWordBank.sujetos.nombres.includes(word)) return 'sustantivo';
    if (sentenceWordBank.sujetos.nombres_propios.includes(word)) return 'nombre';
    if (sentenceWordBank.verbos.presente.includes(word) || sentenceWordBank.verbos.pasado.includes(word) || sentenceWordBank.verbos.futuro.includes(word)) return 'verbo';
    if (sentenceWordBank.objetos.singular.includes(word) || sentenceWordBank.objetos.plural.includes(word)) return 'objeto';
    if (sentenceWordBank.complementos.includes(word)) return 'complemento';
    if (sentenceWordBank.conectores.includes(word)) return 'conector';
    if (sentenceWordBank.negativos.includes(word)) return 'negativo';
    return 'otro';
}

function setSentenceMode(mode) {
    sentenceMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.mode-btn[onclick="setSentenceMode('${mode}')"]`).classList.add('active');
    
    // Limpiar oración actual al cambiar modo
    sentenceDroppedWords = [];
    updateSentencePreview();
    clearSentenceDragItems();
    showTemporaryMessage(`Modo cambiado a ${getModeName(mode)}`, 'info');
}

function getModeName(mode) {
    const modes = {
        'affirmative': 'Oración Afirmativa',
        'negative': 'Oración Negativa',
        'question': 'Pregunta'
    };
    return modes[mode];
}

function addCustomWord() {
    const input = document.getElementById('customWordInput');
    const newWord = input.value.trim();
    
    if (!newWord) {
        showTemporaryMessage('✏️ Escribe una palabra primero', 'warning');
        return;
    }
    
    if (newWord.length < 2) {
        showTemporaryMessage('⚠️ La palabra debe tener al menos 2 letras', 'warning');
        return;
    }
    
    // Añadir al banco de palabras personalizadas
    sentenceCustomWords.push(newWord);
    
    // Crear nuevo elemento arrastrable
    const wordBank = document.getElementById('sentenceWordBank');
    const newDragItem = document.createElement('div');
    newDragItem.className = 'drag-item-enhanced custom-word';
    newDragItem.setAttribute('draggable', 'true');
    newDragItem.setAttribute('data-word', newWord);
    newDragItem.setAttribute('data-category', 'personalizada');
    newDragItem.textContent = newWord;
    newDragItem.style.background = '#ffd700';
    newDragItem.style.color = '#333';
    
    // Añadir funcionalidad drag
    newDragItem.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', newWord);
        newDragItem.style.opacity = '0.5';
    });
    newDragItem.addEventListener('dragend', (e) => {
        newDragItem.style.opacity = '1';
    });
    
    wordBank.appendChild(newDragItem);
    input.value = '';
    playSound('correcto');
    showTemporaryMessage(`✨ "${newWord}" añadida al banco`, 'success');
}

function setupSentenceDragAndDrop() {
    let draggedWord = null;
    
    document.querySelectorAll('.drag-item-enhanced').forEach(drag => {
        drag.addEventListener('dragstart', e => {
            draggedWord = drag.getAttribute('data-word');
            e.dataTransfer.setData('text/plain', draggedWord);
            drag.style.opacity = '0.5';
        });
        drag.addEventListener('dragend', e => {
            drag.style.opacity = '1';
        });
    });
    
    const dropZone = document.getElementById('sentenceDropZone');
    if (dropZone) {
        dropZone.addEventListener('dragover', e => e.preventDefault());
        dropZone.addEventListener('drop', e => {
            e.preventDefault();
            if (draggedWord) {
                addWordToSentence(draggedWord);
            }
        });
    }
}

function addWordToSession(word) {
    addWordToSentence(word);
}

function addWordToSentence(word) {
    sentenceDroppedWords.push(word);
    updateSentencePreview();
    playSound('correcto');
    
    // Marcar palabra como usada en el banco
    const usedWord = document.querySelector(`.drag-item-enhanced[data-word="${word}"]:not(.custom-word)`);
    if (usedWord && !usedWord.classList.contains('used')) {
        usedWord.style.opacity = '0.4';
        usedWord.style.pointerEvents = 'none';
        usedWord.classList.add('used');
    }
}

function updateSentencePreview() {
    const preview = document.getElementById('sentencePreview');
    if (!preview) return;
    
    if (sentenceDroppedWords.length === 0) {
        preview.innerHTML = '<span class="placeholder">✨ Arrastra o escribe palabras aquí</span>';
    } else {
        let sentenceText = sentenceDroppedWords.join(' ');
        
        // Añadir signos según el modo
        if (sentenceMode === 'question') {
            if (!sentenceText.startsWith('¿')) sentenceText = '¿' + sentenceText;
            if (!sentenceText.endsWith('?')) sentenceText += '?';
        } else if (sentenceMode === 'negative' && !sentenceDroppedWords.includes('no')) {
            // Sugerir añadir "no" para negativas
            const grammarFeedback = document.getElementById('grammarFeedback');
            if (grammarFeedback && sentenceDroppedWords.length > 0) {
                grammarFeedback.innerHTML = '<span style="color:#ff9800">💡 Las oraciones negativas necesitan la palabra "no"</span>';
            }
        }
        
        preview.innerHTML = `<span class="sentence-text">${sentenceText}</span> <span class="word-count">(${sentenceDroppedWords.length} palabras)</span>`;
    }
}

function setupSentenceButtons() {
    const checkBtn = document.getElementById('checkSentenceBtn');
    const clearBtn = document.getElementById('clearSentenceBtn');
    const removeLastBtn = document.getElementById('removeLastBtn');
    const randomBtn = document.getElementById('randomSentenceBtn');
    
    if (checkBtn) checkBtn.onclick = checkSentence;
    if (clearBtn) clearBtn.onclick = clearSentence;
    if (removeLastBtn) removeLastBtn.onclick = removeLastWord;
    if (randomBtn) randomBtn.onclick = generateRandomSentence;
}

function checkSentence() {
    if (sentenceDroppedWords.length === 0) {
        showGrammarFeedback('⚠️ ¡No has formado ninguna oración! Arrastra palabras primero.', 'error');
        return;
    }
    
    sentenceAttempts++;
    let sentenceText = sentenceDroppedWords.join(' ');
    let isValid = true;
    let feedbackMessages = [];
    let scoreEarned = 0;
    
    // 1. Verificar modo y estructura básica
    if (sentenceMode === 'negative') {
        if (!sentenceDroppedWords.includes('no')) {
            isValid = false;
            feedbackMessages.push('❌ Las oraciones negativas necesitan la palabra "no"');
        }
    }
    
    if (sentenceMode === 'question') {
        if (!grammarRules.hasCorrectEnding(sentenceText, 'question')) {
            isValid = false;
            feedbackMessages.push('❌ Las preguntas deben llevar signos ¿?');
        }
    }
    
    // 2. Verificar sujeto y verbo
    if (!grammarRules.hasSubjectAndVerb(sentenceDroppedWords)) {
        isValid = false;
        feedbackMessages.push('❌ Tu oración necesita un sujeto (quién) y un verbo (acción)');
    }
    
    // 3. Verificar mayúscula inicial
    if (!grammarRules.hasCapitalLetter(sentenceText)) {
        isValid = false;
        feedbackMessages.push('❌ La oración debe comenzar con mayúscula');
    }
    
    // 4. Verificar longitud mínima
    if (sentenceDroppedWords.length < 3) {
        isValid = false;
        feedbackMessages.push('❌ Las oraciones necesitan al menos 3 palabras');
    }
    
    // 5. Verificar concordancia básica (bonus)
    const hasAgreement = grammarRules.checkAgreement(sentenceDroppedWords);
    
    if (isValid) {
        // Calcular puntuación
        let baseScore = 25;
        let bonusLength = Math.min(sentenceDroppedWords.length - 2, 5) * 2;
        let bonusAgreement = hasAgreement ? 10 : 0;
        let bonusCreativity = sentenceCustomWords.length > 0 ? 15 : 0;
        
        scoreEarned = baseScore + bonusLength + bonusAgreement + bonusCreativity;
        sentenceScore += scoreEarned;
        
        // Feedback de éxito
        const resultDiv = document.getElementById('sentenceResult');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="success-feedback">
                    🎉 ¡ORACIÓN CORRECTA! 🎉<br>
                    <strong>"${sentenceText}"</strong><br>
                    ⭐ +${scoreEarned} puntos ⭐<br>
                    ${bonusLength > 0 ? `📏 +${bonusLength} por longitud` : ''}<br>
                    ${bonusAgreement > 0 ? `🔗 +${bonusAgreement} por concordancia` : ''}<br>
                    ${bonusCreativity > 0 ? `🎨 +${bonusCreativity} por creatividad` : ''}
                </div>
            `;
        }
        
        showGrammarFeedback('✅ ¡Excelente! Has formado una oración correcta', 'success');
        playSound('correcto');
        addPoints(scoreEarned, `Oración correcta: "${sentenceText}"`);
        
        // Verificar si completó los intentos
        if (sentenceAttempts >= sentenceMaxAttempts) {
            completeSentenceGame();
        } else {
            setTimeout(() => clearSentence(), 3000);
        }
    } else {
        // Feedback de errores
        const resultDiv = document.getElementById('sentenceResult');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="error-feedback">
                    ❌ AÚN NO ES CORRECTA ❌<br>
                    ${feedbackMessages.join('<br>')}<br>
                    📝 Intenta de nuevo (${sentenceAttempts}/${sentenceMaxAttempts})
                </div>
            `;
        }
        showGrammarFeedback(feedbackMessages.join('<br>'), 'error');
        playSound('incorrecto');
        
        // Dar pista según el error
        giveHint(feedbackMessages);
    }
    
    // Actualizar estadísticas
    updateSentenceStats();
}

function giveHint(feedbackMessages) {
    let hint = '';
    if (feedbackMessages.some(msg => msg.includes('sujeto'))) {
        hint = '💡 Pista: El sujeto puede ser: El niño, La niña, Un perro, Ana, etc.';
    } else if (feedbackMessages.some(msg => msg.includes('verbo'))) {
        hint = '💡 Pista: Los verbos son acciones como: come, corre, juega, lee, etc.';
    } else if (feedbackMessages.some(msg => msg.includes('negativas'))) {
        hint = '💡 Pista: Para oraciones negativas, coloca "no" antes del verbo. Ejemplo: "El niño no come pescado"';
    } else if (feedbackMessages.some(msg => msg.includes('preguntas'))) {
        hint = '💡 Pista: Las preguntas empiezan con ¿ y terminan con ?. Ejemplo: "¿El niño come pescado?"';
    }
    
    if (hint) {
        setTimeout(() => showGrammarFeedback(hint, 'info'), 1000);
    }
}

function generateRandomSentence() {
    clearSentence();
    
    // Generar oración aleatoria según el modo
    let randomWords = [];
    
    if (sentenceMode === 'question') {
        const questionWords = ['¿Qué', '¿Quién', '¿Cómo', '¿Dónde'];
        randomWords.push(questionWords[Math.floor(Math.random() * questionWords.length)]);
        randomWords.push(getRandomWord('sujetos.nombres'));
        randomWords.push(getRandomWord('verbos.presente'));
        if (Math.random() > 0.5) randomWords.push(getRandomWord('objetos.singular'));
    } else {
        // Oración afirmativa o negativa
        randomWords.push(getRandomWord('sujetos.singular'));
        randomWords.push(getRandomWord('sujetos.nombres'));
        randomWords.push(getRandomWord('verbos.presente'));
        randomWords.push(getRandomWord('objetos.singular'));
        
        if (sentenceMode === 'negative') {
            randomWords.splice(2, 0, 'no');
        }
    }
    
    // Añadir palabras aleatorias
    for (let word of randomWords) {
        addWordToSentence(word);
    }
    
    showTemporaryMessage('🎲 ¡Oración aleatoria generada! Modifícala como quieras', 'info');
}

function getRandomWord(category) {
    const categories = category.split('.');
    let target = sentenceWordBank;
    for (let cat of categories) {
        target = target[cat];
        if (!target) return 'palabra';
    }
    if (Array.isArray(target) && target.length > 0) {
        return target[Math.floor(Math.random() * target.length)];
    }
    return 'palabra';
}

function clearSentence() {
    sentenceDroppedWords = [];
    updateSentencePreview();
    clearSentenceDragItems();
    document.getElementById('sentenceResult').innerHTML = '';
    document.getElementById('grammarFeedback').innerHTML = '';
    playSound('correcto');
}

function removeLastWord() {
    if (sentenceDroppedWords.length > 0) {
        const lastWord = sentenceDroppedWords.pop();
        
        // Reactivar palabra en el banco si no es personalizada
        const wordElement = document.querySelector(`.drag-item-enhanced[data-word="${lastWord}"]`);
        if (wordElement && !wordElement.classList.contains('custom-word')) {
            wordElement.style.opacity = '1';
            wordElement.style.pointerEvents = 'auto';
            wordElement.classList.remove('used');
        }
        
        updateSentencePreview();
        playSound('correcto');
        showTemporaryMessage(`↩️ Se quitó "${lastWord}"`, 'info');
    }
}

function clearSentenceDragItems() {
    document.querySelectorAll('.drag-item-enhanced').forEach(item => {
        if (!item.classList.contains('custom-word')) {
            item.style.opacity = '1';
            item.style.pointerEvents = 'auto';
            item.classList.remove('used');
        }
    });
}

function showGrammarFeedback(message, type) {
    const feedbackDiv = document.getElementById('grammarFeedback');
    if (!feedbackDiv) return;
    
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        info: '#2196F3',
        warning: '#ff9800'
    };
    
    feedbackDiv.innerHTML = `<div style="color: ${colors[type]}; padding: 10px; border-radius: 10px; background: rgba(0,0,0,0.1);">${message}</div>`;
    setTimeout(() => {
        if (feedbackDiv.innerHTML === `<div style="color: ${colors[type]}; padding: 10px; border-radius: 10px; background: rgba(0,0,0,0.1);">${message}</div>`) {
            feedbackDiv.innerHTML = '';
        }
    }, 5000);
}

function showTemporaryMessage(message, type) {
    const resultDiv = document.getElementById('sentenceResult');
    if (!resultDiv) return;
    
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        info: '#2196F3',
        warning: '#ff9800'
    };
    
    const originalContent = resultDiv.innerHTML;
    resultDiv.innerHTML = `<div style="color: ${colors[type]}">${message}</div>`;
    setTimeout(() => {
        if (resultDiv.innerHTML === `<div style="color: ${colors[type]}">${message}</div>`) {
            resultDiv.innerHTML = originalContent;
        }
    }, 2000);
}

function updateSentenceStats() {
    const statsDiv = document.querySelector('.sentence-stats');
    if (statsDiv) {
        statsDiv.innerHTML = `
            <span>⭐ Puntuación: ${sentenceScore}</span>
            <span>🎯 Intento ${sentenceAttempts}/${sentenceMaxAttempts}</span>
        `;
    }
}

function completeSentenceGame() {
    const area = document.getElementById('sentenceDragArea');
    if (!area) return;
    
    const bonus = sentenceScore > 100 ? 50 : (sentenceScore > 50 ? 25 : 10);
    const totalScore = sentenceScore + bonus;
    
    area.innerHTML = `
        <div class="game-complete">
            <div class="victory-animation">
                🏆 ¡GRAN TRABAJO! 🏆<br>
                Puntuación final: ${sentenceScore}<br>
                🎁 Bonus por participación: +${bonus}<br>
                ⭐ TOTAL: ${totalScore} puntos ⭐<br><br>
                ¡Has aprendido a formar oraciones! 🎉
            </div>
            <button class="game-btn" onclick="initSentenceDragDrop()">🔄 Jugar de nuevo</button>
        </div>
    `;
    
    addPoints(totalScore, 'Completaste el juego de oraciones');
    playSound('win');
}

// Añadir estilos CSS para el juego mejorado
const sentenceStyles = `
    .sentence-game-enhanced {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        border-radius: 20px;
        color: white;
    }
    
    .mode-selector {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }
    
    .mode-btn {
        padding: 10px 20px;
        border: 2px solid white;
        background: transparent;
        color: white;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .mode-btn.active {
        background: #ffd700;
        color: #333;
        border-color: #ffd700;
    }
    
    .mode-btn:hover {
        transform: translateY(-2px);
        background: rgba(255,255,255,0.2);
    }
    
    .drag-container-enhanced {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        gap: 10px;
        background: rgba(255,255,255,0.1);
        padding: 15px;
        border-radius: 15px;
        margin-bottom: 15px;
        max-height: 300px;
        overflow-y: auto;
    }
    
    .drag-item-enhanced {
        background: white;
        color: #667eea;
        padding: 10px;
        border-radius: 10px;
        text-align: center;
        cursor: grab;
        transition: all 0.3s ease;
        font-weight: bold;
    }
    
    .drag-item-enhanced:active {
        cursor: grabbing;
    }
    
    .drag-item-enhanced:hover {
        transform: scale(1.05);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    .drop-zone-enhanced {
        background: rgba(255,255,255,0.2);
        border: 3px dashed white;
        border-radius: 15px;
        padding: 20px;
        margin: 20px 0;
        min-height: 100px;
    }
    
    .sentence-text {
        font-size: 1.3rem;
        font-weight: bold;
        color: #ffd700;
    }
    
    .word-count {
        font-size: 0.8rem;
        margin-left: 10px;
        color: #ccc;
    }
    
    .sentence-buttons-enhanced {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
        margin: 15px 0;
    }
    
    .custom-word-input {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }
    
    .custom-word-input input {
        flex: 1;
        padding: 8px;
        border-radius: 10px;
        border: none;
        outline: none;
    }
    
    .btn-small {
        padding: 8px 15px;
        background: #ffd700;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-weight: bold;
    }
    
    .tips-section {
        background: rgba(0,0,0,0.2);
        padding: 15px;
        border-radius: 15px;
        margin-top: 20px;
    }
    
    .tips-section ul {
        margin: 10px 0 0 20px;
    }
    
    .tips-section li {
        margin: 5px 0;
    }
    
    .success-feedback, .error-feedback {
        padding: 15px;
        border-radius: 10px;
        text-align: center;
        animation: slideIn 0.3s ease;
    }
    
    .success-feedback {
        background: rgba(76, 175, 80, 0.3);
        border: 2px solid #4CAF50;
    }
    
    .error-feedback {
        background: rgba(244, 67, 54, 0.3);
        border: 2px solid #f44336;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

if (!document.querySelector('#sentenceStyles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'sentenceStyles';
    styleSheet.textContent = sentenceStyles;
    document.head.appendChild(styleSheet);
}









































// ========== JUEGO 5: CLASIFICA ANIMALES MEJORADO ==========
let animalScore = 0;
let classifiedAnimals = [];
let currentAnimals = [];
let totalAnimalsToShow = 6;
let animalAttempts = 0;
let animalCombo = 0;
let animalBestScore = localStorage.getItem('animalBestScore') || 0;

// Base de datos completa de animales (100+ animales correctamente clasificados)
const animalDatabase = {
    mamiferos: [
        { nombre: "León", icono: "🦁", habitat: "Sabana", caracteristica: "Rey de la selva" },
        { nombre: "Ballena", icono: "🐋", habitat: "Océano", caracteristica: "Mamífero marino" },
        { nombre: "Delfín", icono: "🐬", habitat: "Océano", caracteristica: "Inteligente y juguetón" },
        { nombre: "Elefante", icono: "🐘", habitat: "Sabana", caracteristica: "El más grande terrestre" },
        { nombre: "Jirafa", icono: "🦒", habitat: "Sabana", caracteristica: "Cuello largo" },
        { nombre: "Cebra", icono: "🦓", habitat: "Sabana", caracteristica: "Rayas blancas y negras" },
        { nombre: "Rinoceronte", icono: "🦏", habitat: "Sabana", caracteristica: "Cuerno en la nariz" },
        { nombre: "Hipopótamo", icono: "🦛", habitat: "Ríos", caracteristica: "Pasa mucho tiempo en el agua" },
        { nombre: "Mono", icono: "🐒", habitat: "Selva", caracteristica: "Ágil trepador" },
        { nombre: "Gorila", icono: "🦍", habitat: "Selva", caracteristica: "Pariente cercano del humano" },
        { nombre: "Orangután", icono: "🦧", habitat: "Selva", caracteristica: "Pelaje rojizo" },
        { nombre: "Oso", icono: "🐻", habitat: "Bosque", caracteristica: "Hiberna en invierno" },
        { nombre: "Oso Polar", icono: "🐻‍❄️", habitat: "Ártico", caracteristica: "Vive en el hielo" },
        { nombre: "Zorro", icono: "🦊", habitat: "Bosque", caracteristica: "Astuto y ágil" },
        { nombre: "Lobo", icono: "🐺", habitat: "Bosque", caracteristica: "Vive en manada" },
        { nombre: "Tigre", icono: "🐯", habitat: "Selva", caracteristica: "Felino rayado" },
        { nombre: "Pantera", icono: "🐆", habitat: "Selva", caracteristica: "Felino negro" },
        { nombre: "Canguro", icono: "🦘", habitat: "Australia", caracteristica: "Salta y tiene bolsa" },
        { nombre: "Koala", icono: "🐨", habitat: "Australia", caracteristica: "Duerme mucho" },
        { nombre: "Panda", icono: "🐼", habitat: "China", caracteristica: "Come bambú" },
        { nombre: "Murciélago", icono: "🦇", habitat: "Cuevas", caracteristica: "Único mamífero volador" },
        { nombre: "Erizo", icono: "🦔", habitat: "Bosque", caracteristica: "Cubierto de púas" },
        { nombre: "Conejo", icono: "🐰", habitat: "Campo", caracteristica: "Orejas largas" },
        { nombre: "Ardilla", icono: "🐿️", habitat: "Bosque", caracteristica: "Acumula nueces" },
        { nombre: "Castor", icono: "🦫", habitat: "Ríos", caracteristica: "Construye represas" }
    ],
    aves: [
        { nombre: "Águila", icono: "🦅", habitat: "Montañas", caracteristica: "Gran vista" },
        { nombre: "Pingüino", icono: "🐧", habitat: "Polo Sur", caracteristica: "No vuela, nada bien" },
        { nombre: "Loro", icono: "🦜", habitat: "Selva", caracteristica: "Imita sonidos" },
        { nombre: "Búho", icono: "🦉", habitat: "Bosque", caracteristica: "Caza de noche" },
        { nombre: "Paloma", icono: "🕊️", habitat: "Ciudades", caracteristica: "Símbolo de paz" },
        { nombre: "Pavo Real", icono: "🦚", habitat: "India", caracteristica: "Cola colorida" },
        { nombre: "Flamenco", icono: "🦩", habitat: "Lagunas", caracteristica: "Color rosado" },
        { nombre: "Colibrí", icono: "🐦", habitat: "Jardines", caracteristica: "Vuela hacia atrás" },
        { nombre: "Cisne", icono: "🦢", habitat: "Lagos", caracteristica: "Cuello elegante" },
        { nombre: "Golondrina", icono: "🐦", habitat: "Campos", caracteristica: "Anuncia la primavera" },
        { nombre: "Gaviota", icono: "🕊️", habitat: "Playas", caracteristica: "Vive cerca del mar" },
        { nombre: "Cuervo", icono: "🐦‍⬛", habitat: "Bosques", caracteristica: "Muy inteligente" },
        { nombre: "Pájaro Carpintero", icono: "🐦", habitat: "Bosques", caracteristica: "Taladra árboles" }
    ],
    peces: [
        { nombre: "Tiburón", icono: "🦈", habitat: "Océano", caracteristica: "Gran depredador" },
        { nombre: "Pez Payaso", icono: "🐠", habitat: "Arrecife", caracteristica: "Vive con anémonas" },
        { nombre: "Pez Globo", icono: "🐡", habitat: "Océano", caracteristica: "Se infla" },
        { nombre: "Caballito de Mar", icono: "🐴", habitat: "Arrecife", caracteristica: "El macho da a luz" },
        { nombre: "Salmón", icono: "🐟", habitat: "Ríos", caracteristica: "Nada contra corriente" },
        { nombre: "Trucha", icono: "🐟", habitat: "Ríos", caracteristica: "Agua fría" },
        { nombre: "Anguila", icono: "🐍", habitat: "Océano", caracteristica: "Cuerpo alargado" },
        { nombre: "Raya", icono: "🐟", habitat: "Océano", caracteristica: "Cuerpo plano" }
    ],
    reptiles: [
        { nombre: "Cocodrilo", icono: "🐊", habitat: "Ríos", caracteristica: "Fuerte mordida" },
        { nombre: "Serpiente", icono: "🐍", habitat: "Selva", caracteristica: "Sin patas" },
        { nombre: "Tortuga", icono: "🐢", habitat: "Ríos", caracteristica: "Caparazón protector" },
        { nombre: "Iguana", icono: "🦎", habitat: "Selva", caracteristica: "Puede cambiar de color" },
        { nombre: "Camaleón", icono: "🦎", habitat: "Selva", caracteristica: "Cambia de color" },
        { nombre: "Gecko", icono: "🦎", habitat: "Casas", caracteristica: "Pega en paredes" },
        { nombre: "Lagartija", icono: "🦎", habitat: "Jardines", caracteristica: "Pequeño reptil" },
        { nombre: "Galápago", icono: "🐢", habitat: "Ríos", caracteristica: "Tortuga de río" }
    ],
    anfibios: [
        { nombre: "Rana", icono: "🐸", habitat: "Charcas", caracteristica: "Salta y croa" },
        { nombre: "Sapo", icono: "🐸", habitat: "Jardines", caracteristica: "Piel rugosa" },
        { nombre: "Tritón", icono: "🦎", habitat: "Ríos", caracteristica: "Parece lagartija" },
        { nombre: "Ajolote", icono: "🐸", habitat: "México", caracteristica: "No se transforma" },
        { nombre: "Cecilia", icono: "🐍", habitat: "Tierra", caracteristica: "Parece serpiente" }
    ]
};

// Niveles de dificultad
const gameLevels = {
    facil: { animalesMostrar: 4, tiempoPorIntento: 30, puntosBase: 10 },
    normal: { animalesMostrar: 6, tiempoPorIntento: 25, puntosBase: 15 },
    dificil: { animalesMostrar: 8, tiempoPorIntento: 20, puntosBase: 20 }
};

let currentLevel = 'normal';
let gameTimer = null;
let timeLeft = 25;

function initAnimalClassification() {
    const container = document.getElementById('animalClassify');
    if (!container) return;
    
    // Resetear estado
    if (gameTimer) clearInterval(gameTimer);
    animalScore = 0;
    classifiedAnimals = [];
    animalAttempts = 0;
    animalCombo = 0;
    currentAnimals = [];
    
    const levelConfig = gameLevels[currentLevel];
    totalAnimalsToShow = levelConfig.animalesMostrar;
    timeLeft = levelConfig.tiempoPorIntento;
    
    // Seleccionar animales aleatorios de la base de datos
    selectRandomAnimals();
    
    // Crear contenedor de grupos
    const grupos = [
        { id: "mamifero", nombre: "🐘 Mamíferos", color: "#4caf50", descripcion: "Tienen pelo y dan leche" },
        { id: "ave", nombre: "🦅 Aves", color: "#2196f3", descripcion: "Tienen plumas y vuelan" },
        { id: "pez", nombre: "🐟 Peces", color: "#00bcd4", descripcion: "Viven en agua y tienen branquias" },
        { id: "reptil", nombre: "🐊 Reptiles", color: "#ff9800", descripcion: "Tienen escamas y son de sangre fría" },
        { id: "anfibio", nombre: "🐸 Anfibios", color: "#9c27b0", descripcion: "Viven en agua y tierra" }
    ];
    
    container.innerHTML = `
        <div class="classify-game-enhanced">
            <div class="game-header">
                <div class="level-selector">
                    <button class="level-btn ${currentLevel === 'facil' ? 'active' : ''}" onclick="setAnimalLevel('facil')">🌟 Fácil</button>
                    <button class="level-btn ${currentLevel === 'normal' ? 'active' : ''}" onclick="setAnimalLevel('normal')">⚡ Normal</button>
                    <button class="level-btn ${currentLevel === 'dificil' ? 'active' : ''}" onclick="setAnimalLevel('dificil')">🔥 Difícil</button>
                </div>
                <div class="game-stats">
                    <span>⭐ Puntos: ${animalScore}</span>
                    <span>🔥 Combo: ${animalCombo}</span>
                    <span>🏆 Récord: ${animalBestScore}</span>
                    <span>⏱️ <span id="animalTimer">${timeLeft}</span>s</span>
                </div>
            </div>
            
            <div class="classify-animals-enhanced" id="animalsContainer">
                ${currentAnimals.map(a => `
                    <div class="animal-card-enhanced" draggable="true" data-animal="${a.nombre}" data-grupo="${a.grupo}" data-icono="${a.icono}">
                        <div class="animal-icon">${a.icono}</div>
                        <div class="animal-name">${a.nombre}</div>
                        <div class="animal-hint">${a.caracteristica}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="classify-groups-enhanced">
                ${grupos.map(g => `
                    <div class="group-zone-enhanced" data-group="${g.id}" style="border-color: ${g.color};">
                        <div class="group-header" style="background: ${g.color};">
                            <h4>${g.nombre}</h4>
                            <div class="group-desc">${g.descripcion}</div>
                        </div>
                        <div class="group-items" id="group-${g.id}"></div>
                        <div class="group-counter">0/${getGroupAnimalCount(g.id)}</div>
                    </div>
                `).join('')}
            </div>
            
            <div id="classifyResult" class="game-feedback"></div>
            <div class="game-buttons">
                <button class="game-btn" onclick="resetAnimalGame()">🔄 Reiniciar nivel</button>
                <button class="game-btn" onclick="getAnimalHint()">💡 Pista</button>
                <button class="game-btn" onclick="skipAnimal()">⏭️ Saltar animal</button>
            </div>
        </div>
    `;
    
    setupAnimalDragAndDrop();
    startAnimalTimer();
    updateAnimalGroupCounters();
}

function selectRandomAnimals() {
    // Recolectar todos los animales de todas las categorías
    let allAnimals = [];
    
    for (let grupo in animalDatabase) {
        animalDatabase[grupo].forEach(animal => {
            allAnimals.push({
                ...animal,
                grupo: getGrupoFromCategory(grupo)
            });
        });
    }
    
    // Mezclar array
    for (let i = allAnimals.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allAnimals[i], allAnimals[j]] = [allAnimals[j], allAnimals[i]];
    }
    
    // Seleccionar cantidad aleatoria pero asegurando variedad de grupos
    const selectedAnimals = [];
    const gruposRepresentados = new Set();
    
    for (let animal of allAnimals) {
        if (selectedAnimals.length >= totalAnimalsToShow) break;
        
        // Intentar tener variedad de grupos
        if (!gruposRepresentados.has(animal.grupo) || selectedAnimals.length > totalAnimalsToShow - 3) {
            selectedAnimals.push(animal);
            gruposRepresentados.add(animal.grupo);
        }
    }
    
    // Si no se completó, llenar con más animales
    for (let animal of allAnimals) {
        if (selectedAnimals.length >= totalAnimalsToShow) break;
        if (!selectedAnimals.includes(animal)) {
            selectedAnimals.push(animal);
        }
    }
    
    currentAnimals = selectedAnimals;
}

function getGrupoFromCategory(category) {
    const grupos = {
        mamiferos: "mamifero",
        aves: "ave",
        peces: "pez",
        reptiles: "reptil",
        anfibios: "anfibio"
    };
    return grupos[category];
}

function getCategoryFromGrupo(grupo) {
    const categories = {
        mamifero: "mamiferos",
        ave: "aves",
        pez: "peces",
        reptil: "reptiles",
        anfibio: "anfibios"
    };
    return categories[grupo];
}

function getGroupAnimalCount(groupId) {
    const category = getCategoryFromGrupo(groupId);
    if (!category) return 0;
    return currentAnimals.filter(a => a.grupo === groupId).length;
}

function updateAnimalGroupCounters() {
    const grupos = ["mamifero", "ave", "pez", "reptil", "anfibio"];
    grupos.forEach(grupo => {
        const counter = document.querySelector(`#group-${grupo}`)?.parentElement?.querySelector('.group-counter');
        if (counter) {
            const classified = document.querySelectorAll(`#group-${grupo} .group-item`).length;
            const total = getGroupAnimalCount(grupo);
            counter.textContent = `${classified}/${total}`;
        }
    });
}

function setupAnimalDragAndDrop() {
    let draggedAnimal = null;
    let draggedGrupo = null;
    let draggedData = null;
    
    document.querySelectorAll('.animal-card-enhanced').forEach(card => {
        card.addEventListener('dragstart', e => {
            draggedAnimal = card.getAttribute('data-animal');
            draggedGrupo = card.getAttribute('data-grupo');
            draggedData = { animal: draggedAnimal, grupo: draggedGrupo };
            e.dataTransfer.setData('text/plain', draggedAnimal);
            card.classList.add('dragging');
        });
        
        card.addEventListener('dragend', e => {
            card.classList.remove('dragging');
        });
    });
    
    document.querySelectorAll('.group-zone-enhanced').forEach(zone => {
        zone.addEventListener('dragover', e => e.preventDefault());
        zone.addEventListener('drop', e => {
            e.preventDefault();
            const targetGroup = zone.getAttribute('data-group');
            
            if (!draggedAnimal) return;
            
            if (classifiedAnimals.includes(draggedAnimal)) {
                showAnimalMessage('⚠️ ¡Este animal ya fue clasificado!', 'warning');
                return;
            }
            
            const levelConfig = gameLevels[currentLevel];
            let puntosGanados = levelConfig.puntosBase;
            
            if (draggedGrupo === targetGroup) {
                // Clasificación correcta
                const groupItems = document.getElementById(`group-${targetGroup}`);
                const item = document.createElement('div');
                item.className = 'group-item-enhanced';
                item.innerHTML = `
                    <span class="group-item-icon">${draggedData ? getAnimalIcon(draggedAnimal) : '🐾'}</span>
                    <span class="group-item-name">${draggedAnimal}</span>
                `;
                groupItems.appendChild(item);
                
                classifiedAnimals.push(draggedAnimal);
                animalCombo++;
                
                // Bonus por combo
                if (animalCombo >= 3) {
                    puntosGanados += 5;
                    showAnimalMessage(`🔥 ¡COMBO x${animalCombo}! +5 puntos`, 'success');
                }
                
                animalScore += puntosGanados;
                
                // Actualizar récord
                if (animalScore > animalBestScore) {
                    animalBestScore = animalScore;
                    localStorage.setItem('animalBestScore', animalBestScore);
                }
                
                // Ocultar animal arrastrado
                const animalCard = document.querySelector(`.animal-card-enhanced[data-animal="${draggedAnimal}"]`);
                if (animalCard) {
                    animalCard.style.opacity = '0.3';
                    animalCard.style.pointerEvents = 'none';
                    animalCard.style.transform = 'scale(0.9)';
                }
                
                updateAnimalStats();
                updateAnimalGroupCounters();
                
                showAnimalMessage(`✅ ¡Correcto! ${draggedAnimal} es un ${targetGroup} +${puntosGanados} puntos`, 'success');
                addPoints(puntosGanados, `Clasificaste a ${draggedAnimal}`);
                playSound('correcto');
                
                // Verificar si completó todos
                if (classifiedAnimals.length === currentAnimals.length) {
                    completeAnimalGame();
                }
            } else {
                // Clasificación incorrecta
                animalCombo = 0;
                animalAttempts++;
                updateAnimalStats();
                
                const grupoCorrecto = draggedGrupo === "mamifero" ? "mamífero" : draggedGrupo === "ave" ? "ave" : draggedGrupo === "pez" ? "pez" : draggedGrupo === "reptil" ? "reptil" : "anfibio";
                showAnimalMessage(`❌ ¡Incorrecto! ${draggedAnimal} es un ${grupoCorrecto}, no un ${targetGroup}`, 'error');
                playSound('incorrecto');
                
                // Perder tiempo por error en modo difícil
                if (currentLevel === 'dificil') {
                    timeLeft -= 2;
                    showAnimalMessage(`⏰ -2 segundos por error`, 'warning');
                }
            }
            
            draggedAnimal = null;
            draggedGrupo = null;
            draggedData = null;
        });
    });
}

function getAnimalIcon(animalName) {
    const animal = currentAnimals.find(a => a.nombre === animalName);
    return animal ? animal.icono : '🐾';
}

function startAnimalTimer() {
    if (gameTimer) clearInterval(gameTimer);
    
    gameTimer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            handleAnimalTimeOut();
        } else {
            timeLeft--;
            const timerSpan = document.getElementById('animalTimer');
            if (timerSpan) {
                timerSpan.innerText = timeLeft;
                if (timeLeft <= 5) {
                    timerSpan.style.color = '#ff4444';
                    timerSpan.style.fontWeight = 'bold';
                }
            }
        }
    }, 1000);
}

function handleAnimalTimeOut() {
    showAnimalMessage('⏰ ¡TIEMPO AGOTADO! Reiniciando nivel...', 'error');
    playSound('gameover');
    setTimeout(() => {
        initAnimalClassification();
    }, 2000);
}

function getAnimalHint() {
    const pendingAnimals = currentAnimals.filter(a => !classifiedAnimals.includes(a.nombre));
    if (pendingAnimals.length === 0) {
        showAnimalMessage('🎉 ¡Ya clasificaste todos los animales!', 'success');
        return;
    }
    
    const randomAnimal = pendingAnimals[Math.floor(Math.random() * pendingAnimals.length)];
    const grupoCorrecto = randomAnimal.grupo === "mamifero" ? "mamífero" : 
                         randomAnimal.grupo === "ave" ? "ave" : 
                         randomAnimal.grupo === "pez" ? "pez" : 
                         randomAnimal.grupo === "reptil" ? "reptil" : "anfibio";
    
    showAnimalMessage(`💡 Pista: ${randomAnimal.nombre} es un ${grupoCorrecto}. ${randomAnimal.caracteristica}`, 'info');
    playSound('hint');
}

function skipAnimal() {
    const pendingAnimals = currentAnimals.filter(a => !classifiedAnimals.includes(a.nombre));
    if (pendingAnimals.length === 0) {
        showAnimalMessage('🎉 ¡Ya clasificaste todos!', 'success');
        return;
    }
    
    const randomAnimal = pendingAnimals[Math.floor(Math.random() * pendingAnimals.length)];
    
    // Mostrar respuesta correcta y eliminar animal
    const grupoCorrecto = randomAnimal.grupo === "mamifero" ? "mamífero" : 
                         randomAnimal.grupo === "ave" ? "ave" : 
                         randomAnimal.grupo === "pez" ? "pez" : 
                         randomAnimal.grupo === "reptil" ? "reptil" : "anfibio";
    
    showAnimalMessage(`⏭️ Saltando ${randomAnimal.nombre}. Era un ${grupoCorrecto}.`, 'info');
    
    // Marcar como clasificado (aunque no gane puntos)
    classifiedAnimals.push(randomAnimal.nombre);
    const animalCard = document.querySelector(`.animal-card-enhanced[data-animal="${randomAnimal.nombre}"]`);
    if (animalCard) {
        animalCard.style.opacity = '0.3';
        animalCard.style.pointerEvents = 'none';
        animalCard.style.transform = 'scale(0.9)';
    }
    
    updateAnimalGroupCounters();
    
    if (classifiedAnimals.length === currentAnimals.length) {
        completeAnimalGame();
    }
}

function setAnimalLevel(level) {
    currentLevel = level;
    initAnimalClassification();
}

function resetAnimalGame() {
    initAnimalClassification();
}

function updateAnimalStats() {
    const statsDiv = document.querySelector('.game-stats');
    if (statsDiv) {
        statsDiv.innerHTML = `
            <span>⭐ Puntos: ${animalScore}</span>
            <span>🔥 Combo: ${animalCombo}</span>
            <span>🏆 Récord: ${animalBestScore}</span>
            <span>⏱️ <span id="animalTimer">${timeLeft}</span>s</span>
        `;
    }
}

function showAnimalMessage(message, type) {
    const resultDiv = document.getElementById('classifyResult');
    if (!resultDiv) return;
    
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196F3'
    };
    
    resultDiv.innerHTML = `<div style="color: ${colors[type]}; background: rgba(0,0,0,0.1); padding: 10px; border-radius: 10px;">${message}</div>`;
    
    setTimeout(() => {
        if (resultDiv.innerHTML === `<div style="color: ${colors[type]}; background: rgba(0,0,0,0.1); padding: 10px; border-radius: 10px;">${message}</div>`) {
            resultDiv.innerHTML = '';
        }
    }, 3000);
}

function completeAnimalGame() {
    if (gameTimer) clearInterval(gameTimer);
    
    const bonusTiempo = Math.floor(timeLeft * 2);
    const bonusCombo = animalCombo * 5;
    const puntosFinales = animalScore + bonusTiempo + bonusCombo;
    
    const container = document.getElementById('animalClassify');
    if (container) {
        container.innerHTML = `
            <div class="game-complete-animation">
                🏆 ¡FELICIDADES! 🏆<br>
                📊 Puntuación final: ${animalScore}<br>
                ⏱️ Bonus por tiempo: +${bonusTiempo}<br>
                🔥 Bonus por combo: +${bonusCombo}<br>
                ⭐ TOTAL: ${puntosFinales} puntos ⭐<br><br>
                🎉 ¡Has clasificado todos los animales! 🎉
            </div>
            <button class="game-btn" onclick="initAnimalClassification()">🔄 Jugar de nuevo</button>
            <button class="game-btn" onclick="setAnimalLevel('normal')">🎯 Cambiar nivel</button>
        `;
    }
    
    addPoints(puntosFinales, 'Completaste la clasificación de animales');
    playSound('win');
}

// Añadir estilos CSS mejorados
const animalStyles = `
    .classify-game-enhanced {
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        padding: 20px;
        border-radius: 20px;
        color: white;
    }
    
    .level-selector {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
    }
    
    .level-btn {
        padding: 5px 15px;
        border: 2px solid white;
        background: transparent;
        color: white;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .level-btn.active {
        background: #ffd700;
        color: #333;
        border-color: #ffd700;
    }
    
    .game-stats {
        display: flex;
        gap: 20px;
        justify-content: center;
        background: rgba(0,0,0,0.3);
        padding: 10px;
        border-radius: 15px;
        margin-bottom: 20px;
    }
    
    .classify-animals-enhanced {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 15px;
        padding: 20px;
        background: rgba(255,255,255,0.1);
        border-radius: 15px;
        margin-bottom: 20px;
    }
    
    .animal-card-enhanced {
        background: linear-gradient(135deg, #667eea, #764ba2);
        padding: 15px;
        border-radius: 15px;
        text-align: center;
        cursor: grab;
        transition: all 0.3s ease;
    }
    
    .animal-card-enhanced:active {
        cursor: grabbing;
    }
    
    .animal-card-enhanced:hover {
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    }
    
    .animal-icon {
        font-size: 3rem;
        margin-bottom: 5px;
    }
    
    .animal-name {
        font-weight: bold;
        margin-bottom: 5px;
    }
    
    .animal-hint {
        font-size: 0.7rem;
        opacity: 0.8;
    }
    
    .classify-groups-enhanced {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
    }
    
    .group-zone-enhanced {
        background: rgba(255,255,255,0.1);
        border: 2px solid;
        border-radius: 15px;
        overflow: hidden;
    }
    
    .group-header {
        padding: 10px;
        text-align: center;
    }
    
    .group-header h4 {
        margin: 0;
        color: white;
    }
    
    .group-desc {
        font-size: 0.7rem;
        opacity: 0.9;
        margin-top: 5px;
    }
    
    .group-items {
        min-height: 100px;
        padding: 10px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: flex-start;
    }
    
    .group-item-enhanced {
        background: rgba(255,255,255,0.9);
        color: #333;
        padding: 5px 10px;
        border-radius: 20px;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 0.85rem;
        animation: slideIn 0.3s ease;
    }
    
    .group-counter {
        text-align: center;
        padding: 5px;
        font-size: 0.8rem;
        background: rgba(0,0,0,0.2);
    }
    
    .game-buttons {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .game-complete-animation {
        text-align: center;
        padding: 30px;
        animation: pulse 0.5s ease;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .dragging {
        opacity: 0.5;
        cursor: grabbing;
    }
`;

if (!document.querySelector('#animalStyles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'animalStyles';
    styleSheet.textContent = animalStyles;
    document.head.appendChild(styleSheet);
}




























































// ========== JUEGO 6: SOPA DE LETRAS (YA EXISTENTE, NO MODIFICAR) ==========
 // ==================== SOPA DE LETRAS COMPLETAMENTE FUNCIONAL ====================
// Configuración principal
let currentWordSearchGrid = [];
let wordSearchWordsList = [];
let wordSearchFound = [];
let wordSearchFoundPositions = [];
let wordSearchSelection = [];
let wordSearchMouseDown = false;
let wordSearchGridSize = 12;
let wordSearchHintsUsed = 0;
let maxHints = 3;
let wordSearchDictionary = [];
let wordSearchWordPositions = [];

// Direcciones posibles
const wordSearchDirections = [
    { dr: 0, dc: 1, name: "derecha" },
    { dr: 0, dc: -1, name: "izquierda" },
    { dr: 1, dc: 0, name: "abajo" },
    { dr: -1, dc: 0, name: "arriba" },
    /*{ dr: 1, dc: 1, name: "diagonal-abajo-derecha" },
    { dr: 1, dc: -1, name: "diagonal-abajo-izquierda" },
    { dr: -1, dc: 1, name: "diagonal-arriba-derecha" },
    { dr: -1, dc: -1, name: "diagonal-arriba-izquierda" }*/
];

// Diccionario por defecto (100 palabras)
const defaultDictionary = [
    "SOL", "LUNA", "CIELO", "AGUA", "FLOR", "ARBOL", "PERRO", "GATO", "RATON", "PAJARO",
    "PEZ", "ELEFANTE", "JIRAFA", "LEON", "TIGRE", "CEBRA", "MONO", "OSO", "CONEJO", "RANA",
    "MARIPOSA", "ABEJA", "HORMIGA", "ARAÑA", "LIBELULA", "MANZANA", "PERA", "UVA", "FRESA", "NARANJA",
    "ROJO", "AZUL", "VERDE", "AMARILLO", "ROSADO", "CASA", "ESCUELA", "PARQUE", "PISCINA", "BIBLIOTECA",
    "LIBRO", "CUADERNO", "LAPIZ", "BOLIGRAFO", "MOCHILA", "PROFESOR", "ALUMNO", "MATEMATICAS", "CIENCIAS", "HISTORIA",
    "MUSICA", "DEPORTE", "FUTBOL", "BASQUET", "NATACION", "FAMILIA", "MAMA", "PAPA", "HERMANO", "HERMANA",
    "ABUELO", "ABUELA", "AMIGO", "FELIZ", "TRISTE", "EMOCIONADO", "TRANQUILO", "RAPIDO", "LENTO", "GRANDE",
    "PEQUEÑO", "ALTO", "BAJO", "LARGO", "CORTO", "CALIENTE", "FRIO", "DURO", "BLANDO", "SUAVE",
    "DULCE", "SALADO", "AMARGO", "BUENO", "MALO", "LINDO", "FEO", "NUEVO", "VIEJO", "JOVEN",
    "DIA", "NOCHE", "MANANA", "TARDE", "SEMANA", "MES", "AÑO", "HORA", "MINUTO", "SEGUNDO"
];

// Cargar diccionario desde JSON
async function loadWordDictionary() {
    try {
        const response = await fetch('assets/data/palabras.json');
        if (response.ok) {
            const data = await response.json();
            wordSearchDictionary = data.palabras || defaultDictionary;
            console.log('✅ Diccionario cargado desde JSON:', wordSearchDictionary.length, 'palabras');
        } else {
            console.log('⚠️ No se encontró el JSON, usando diccionario por defecto');
            wordSearchDictionary = defaultDictionary;
        }
    } catch (error) {
        console.log('❌ Error al cargar JSON:', error);
        console.log('📚 Usando diccionario por defecto');
        wordSearchDictionary = defaultDictionary;
    }
}

// Obtener palabras aleatorias
function getRandomWords(count) {
    const validWords = wordSearchDictionary.filter(word => word.length <= wordSearchGridSize);
    const shuffled = [...validWords];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
}

// Verificar si una palabra se puede colocar
function canPlaceWord(word, row, col, direction) {
    for (let i = 0; i < word.length; i++) {
        const newRow = row + (direction.dr * i);
        const newCol = col + (direction.dc * i);
        
        if (newRow < 0 || newRow >= wordSearchGridSize || newCol < 0 || newCol >= wordSearchGridSize) {
            return false;
        }
        
        const currentChar = currentWordSearchGrid[newRow][newCol];
        if (currentChar !== '' && currentChar !== word[i]) {
            return false;
        }
    }
    return true;
}

// Colocar una palabra en el grid
function placeWord(word, row, col, direction) {
    const positions = [];
    for (let i = 0; i < word.length; i++) {
        const newRow = row + (direction.dr * i);
        const newCol = col + (direction.dc * i);
        currentWordSearchGrid[newRow][newCol] = word[i];
        positions.push({ row: newRow, col: newCol, letter: word[i] });
    }
    return positions;
}

// Generar nueva sopa de letras
async function generateNewWordSearchGrid() {
    currentWordSearchGrid = Array(wordSearchGridSize).fill().map(() => Array(wordSearchGridSize).fill(''));
    wordSearchWordPositions = [];
    
    const wordsToPlace = [...wordSearchWordsList];
    wordsToPlace.sort((a, b) => b.length - a.length);
    
    for (let word of wordsToPlace) {
        let placed = false;
        let attempts = 0;
        const maxAttempts = 500;
        
        while (!placed && attempts < maxAttempts) {
            const direction = wordSearchDirections[Math.floor(Math.random() * wordSearchDirections.length)];
            
            let minRow = 0, maxRow = wordSearchGridSize - 1;
            let minCol = 0, maxCol = wordSearchGridSize - 1;
            
            if (direction.dr > 0) maxRow = wordSearchGridSize - word.length;
            if (direction.dr < 0) minRow = word.length - 1;
            if (direction.dc > 0) maxCol = wordSearchGridSize - word.length;
            if (direction.dc < 0) minCol = word.length - 1;
            
            if (minRow > maxRow || minCol > maxCol) {
                attempts++;
                continue;
            }
            
            const startRow = minRow + Math.floor(Math.random() * (maxRow - minRow + 1));
            const startCol = minCol + Math.floor(Math.random() * (maxCol - minCol + 1));
            
            if (canPlaceWord(word, startRow, startCol, direction)) {
                const positions = placeWord(word, startRow, startCol, direction);
                wordSearchWordPositions.push({
                    word: word,
                    positions: positions,
                    direction: direction
                });
                placed = true;
            }
            attempts++;
        }
        
        if (!placed) {
            console.warn(`⚠️ No se pudo colocar la palabra: ${word}`);
        }
    }
    
    // Rellenar espacios vacíos
    for (let i = 0; i < wordSearchGridSize; i++) {
        for (let j = 0; j < wordSearchGridSize; j++) {
            if (currentWordSearchGrid[i][j] === '') {
                currentWordSearchGrid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
    }
}

// Verificar si una celda pertenece a una palabra encontrada
function isCellPartOfFoundWord(row, col) {
    return wordSearchFoundPositions.some(pos => pos.row === row && pos.col === col);
}

// Dar pista (SIN REDIBUJAR, solo resaltando celdas existentes)
function giveWordSearchHint() {
    if (wordSearchHintsUsed >= maxHints) {
        const feedback = document.getElementById('wordSearchFeedback');
        if (feedback) {
            feedback.innerHTML = '⚠️ Ya no te quedan más pistas para esta sopa de letras';
            feedback.style.color = 'orange';
            setTimeout(() => { if(feedback) feedback.innerHTML = ''; }, 2000);
        }
        return;
    }
    
    // Encontrar palabras no encontradas
    const notFoundWords = wordSearchWordPositions.filter(wordInfo => !wordSearchFound.includes(wordInfo.word));
    
    if (notFoundWords.length === 0) {
        const feedback = document.getElementById('wordSearchFeedback');
        if (feedback) {
            feedback.innerHTML = '🎉 ¡Ya encontraste todas las palabras!';
            feedback.style.color = 'green';
        }
        return;
    }
    
    // Elegir una palabra aleatoria no encontrada
    const randomWordInfo = notFoundWords[Math.floor(Math.random() * notFoundWords.length)];
    const firstLetterPos = randomWordInfo.positions[0];
    
    wordSearchHintsUsed++;
    
    // Resaltar la celda temporalmente
    const cells = document.querySelectorAll('.wordsearch-cell');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        if (row === firstLetterPos.row && col === firstLetterPos.col) {
            const originalBg = cell.style.background;
            cell.style.background = '#ffd700';
            cell.style.transform = 'scale(1.1)';
            cell.style.transition = 'all 0.3s';
            setTimeout(() => {
                if (!cell.classList.contains('found')) {
                    cell.style.background = originalBg;
                }
                cell.style.transform = '';
            }, 2000);
        }
    });
    
    const feedback = document.getElementById('wordSearchFeedback');
    if (feedback) {
        feedback.innerHTML = `💡 Pista: La palabra "${randomWordInfo.word}" comienza aquí (celda resaltada). Pistas restantes: ${maxHints - wordSearchHintsUsed}`;
        feedback.style.color = '#ffd700';
        setTimeout(() => { 
            if(feedback && feedback.innerHTML.includes('Pista')) {
                feedback.innerHTML = '';
            }
        }, 4000);
    }
    
    // Actualizar texto del botón de pistas
    const hintButton = document.getElementById('hintButton');
    if (hintButton) {
        hintButton.innerHTML = `<i class="fas fa-lightbulb"></i> Pista (${maxHints - wordSearchHintsUsed}/${maxHints})`;
    }
    
    playSound('correcto');
}

// Inicializar el juego
async function initWordSearch() {
    const container = document.getElementById('wordSearchContainer');
    if (!container) return;
    
    // Cargar diccionario si no está cargado
    if (wordSearchDictionary.length === 0) {
        await loadWordDictionary();
    }
    
    // Reiniciar estado
    wordSearchFound = [];
    wordSearchFoundPositions = [];
    wordSearchSelection = [];
    wordSearchWordPositions = [];
    wordSearchMouseDown = false;
    wordSearchHintsUsed = 0;
    
    // Seleccionar 7 palabras aleatorias
    wordSearchWordsList = getRandomWords(7);
    console.log('🎲 Palabras seleccionadas:', wordSearchWordsList);
    
    // Generar grid con las palabras
    await generateNewWordSearchGrid();
    
    // Renderizar
    renderWordSearchGame(container);
}

// Renderizar el juego (estructura de dos columnas fija)
function renderWordSearchGame(container) {
    let gridHTML = `
        <div style="display: flex; gap: 30px; justify-content: center; flex-wrap: nowrap; align-items: flex-start;">
            <!-- Columna izquierda: Grid de la sopa de letras -->
            <div style="text-align: center; flex-shrink: 0;">
                <p>🔍 Encuentra las palabras arrastrando el mouse sobre las letras</p>
                <div style="display: grid; grid-template-columns: repeat(${wordSearchGridSize}, 42px); gap: 3px; justify-content: center; margin: 20px auto;">
    `;
    
    // Generar grid
    for (let row = 0; row < wordSearchGridSize; row++) {
        for (let col = 0; col < wordSearchGridSize; col++) {
            const cellChar = currentWordSearchGrid[row][col] || '?';
            const isFound = isCellPartOfFoundWord(row, col);
            
            // Color verde brillante para palabras encontradas
            let additionalStyle = '';
            if (isFound) {
                additionalStyle = 'background: #4caf50; color: white; font-weight: bold; box-shadow: 0 0 8px rgba(76, 175, 80, 0.6);';
            } else {
                additionalStyle = 'background: var(--color-2);';
            }
            
            gridHTML += `<div class="wordsearch-cell" data-row="${row}" data-col="${col}" data-char="${cellChar}" 
                style="${additionalStyle} padding: 10px; text-align: center; border-radius: 8px; font-weight: bold; cursor: pointer; user-select: none; transition: all 0.2s; font-size: 16px;">
                ${cellChar}
            </div>`;
        }
    }
    
    gridHTML += `
                </div>
            </div>
            
            <!-- Columna derecha: Panel de palabras y controles -->
            <div style="min-width: 250px; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px; backdrop-filter: blur(10px); flex-shrink: 0;">
                <h3 style="margin-top: 0; text-align: center;">📝 Palabras a encontrar</h3>
                <div id="wordListPanel" style="display: flex; flex-direction: column; gap: 10px;">
    `;
    
    // Lista de palabras
    for (let word of wordSearchWordsList) {
        const isFound = wordSearchFound.includes(word);
        gridHTML += `
            <div class="word-item" data-word="${word}" 
                style="background: ${isFound ? '#4caf50' : 'var(--color-3)'}; padding: 10px 15px; border-radius: 20px; font-weight: bold; text-align: center; transition: all 0.3s; ${isFound ? 'text-decoration: line-through; opacity: 0.8;' : ''}">
                ${word} ${isFound ? '✓' : ''}
            </div>
        `;
    }
    
    gridHTML += `
                </div>
                
                <!-- Información de pistas -->
                <div style="margin-top: 25px; padding-top: 20px; border-top: 2px solid rgba(255,255,255,0.3);">
                    <div style="display: flex; gap: 10px; justify-content: space-between; align-items: center;">
                        <span>💡 Pistas disponibles: ${maxHints - wordSearchHintsUsed}/${maxHints}</span>
                        <button class="btn-card" id="hintButton" style="padding: 8px 15px; cursor: pointer;">
                            <i class="fas fa-lightbulb"></i> Pista
                        </button>
                    </div>
                </div>
                
                <!-- Botones de acción -->
                <div style="margin-top: 20px; display: flex; gap: 10px; flex-direction: column;">
                    <button class="btn-card" id="clearWordSearchSelection" style="background: #6c757d; cursor: pointer; color: white; border: none; padding: 10px; border-radius: 8px;">
                        🗑️ Limpiar selección
                    </button>
                    <button class="btn-card" id="resetWordSearch" style="background: #007bff; cursor: pointer; color: white; border: none; padding: 10px; border-radius: 8px;">
                        🔄 Nueva sopa de letras
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Área de feedback -->
        <div id="selectedWordDisplay" style="text-align: center; margin: 20px auto 10px auto; padding: 12px; background: var(--color-1); border-radius: 10px; display: inline-block; width: auto; max-width: 80%;">
            🖱️ Haz clic y arrastra sobre las letras para formar una palabra
        </div>
        <div id="wordSearchFeedback" class="game-feedback" style="text-align: center; margin-top: 10px; min-height: 50px;"></div>
    `;
    
    container.innerHTML = gridHTML;
    
    // Agregar event listeners
    attachWordSearchEvents();
    
    // Botón de pistas
    const hintBtn = document.getElementById('hintButton');
    if (hintBtn) {
        hintBtn.removeEventListener('click', giveWordSearchHint);
        hintBtn.addEventListener('click', () => giveWordSearchHint());
    }
    
    // Botón para limpiar selección
    const clearBtn = document.getElementById('clearWordSearchSelection');
    if (clearBtn) {
        clearBtn.removeEventListener('click', clearWordSearchSelectionHandler);
        clearBtn.addEventListener('click', clearWordSearchSelectionHandler);
    }
    
    // Botón para reiniciar sopa de letras
    const resetBtn = document.getElementById('resetWordSearch');
    if (resetBtn) {
        resetBtn.removeEventListener('click', resetWordSearchHandler);
        resetBtn.addEventListener('click', resetWordSearchHandler);
    }
}

// Handlers separados
function clearWordSearchSelectionHandler() {
    clearWordSearchSelection();
    updateSelectedWordDisplay("🖱️ Selección limpiada");
    const feedback = document.getElementById('wordSearchFeedback');
    if (feedback) {
        feedback.innerHTML = '🧹 Selección limpiada';
        feedback.style.color = 'orange';
        setTimeout(() => { if(feedback) feedback.innerHTML = ''; }, 1500);
    }
}

function resetWordSearchHandler() {
    initWordSearch();
    addPoints(5);
    const feedback = document.getElementById('wordSearchFeedback');
    if (feedback) {
        feedback.innerHTML = '🔄 Nueva sopa de letras generada! +5 puntos';
        feedback.style.color = 'green';
        playSound('correcto');
    }
}

// Adjuntar eventos de selección con arrastre
function attachWordSearchEvents() {
    const cells = document.querySelectorAll('.wordsearch-cell');
    if (!cells.length) return;
    
    let isDragging = false;
    
    const handleCellSelection = (cell, isAdding) => {
        if (cell.classList.contains('found')) return;
        
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const coord = { row, col };
        
        if (isAdding) {
            if (!wordSearchSelection.some(c => c.row === row && c.col === col)) {
                wordSearchSelection.push(coord);
                // Color azul pastel para selección
                cell.style.background = '#a8d8ff';
                cell.style.transform = 'scale(1.02)';
                cell.style.boxShadow = '0 0 10px rgba(168, 216, 255, 0.8)';
            }
        } else {
            const index = wordSearchSelection.findIndex(c => c.row === row && c.col === col);
            if (index !== -1) {
                wordSearchSelection.splice(index, 1);
                if (!cell.classList.contains('found')) {
                    cell.style.background = 'var(--color-2)';
                    cell.style.boxShadow = 'none';
                }
                cell.style.transform = '';
            }
        }
        updateSelectedWordDisplay();
    };
    
    cells.forEach(cell => {
        cell.removeEventListener('mousedown', cell._mousedownHandler);
        cell.removeEventListener('mouseenter', cell._mouseenterHandler);
        
        const mousedownHandler = (e) => {
            e.preventDefault();
            if (cell.classList.contains('found')) return;
            isDragging = true;
            clearWordSearchSelection();
            handleCellSelection(cell, true);
        };
        
        const mouseenterHandler = () => {
            if (isDragging && !cell.classList.contains('found')) {
                if (wordSearchSelection.length > 0) {
                    const lastCoord = wordSearchSelection[wordSearchSelection.length - 1];
                    const currentRow = parseInt(cell.dataset.row);
                    const currentCol = parseInt(cell.dataset.col);
                    const rowDiff = Math.abs(currentRow - lastCoord.row);
                    const colDiff = Math.abs(currentCol - lastCoord.col);
                    
                    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1) || 
                        (rowDiff === 1 && colDiff === 1)) {
                        if (!wordSearchSelection.some(c => c.row === currentRow && c.col === currentCol)) {
                            wordSearchSelection.push({ row: currentRow, col: currentCol });
                            cell.style.background = '#a8d8ff';
                            cell.style.transform = 'scale(1.02)';
                            cell.style.boxShadow = '0 0 10px rgba(168, 216, 255, 0.8)';
                            updateSelectedWordDisplay();
                        }
                    }
                } else {
                    handleCellSelection(cell, true);
                }
            }
        };
        
        cell._mousedownHandler = mousedownHandler;
        cell._mouseenterHandler = mouseenterHandler;
        
        cell.addEventListener('mousedown', mousedownHandler);
        cell.addEventListener('mouseenter', mouseenterHandler);
    });
    
    const mouseupHandler = () => {
        if (isDragging) {
            isDragging = false;
            validateSelectedWord();
        }
    };
    
    document.removeEventListener('mouseup', mouseupHandler);
    document.addEventListener('mouseup', mouseupHandler);
}

// Actualizar display de palabra seleccionada
function updateSelectedWordDisplay(message = null) {
    const displayDiv = document.getElementById('selectedWordDisplay');
    if (!displayDiv) return;
    
    if (message) {
        displayDiv.innerHTML = message;
        displayDiv.style.background = 'var(--color-1)';
        return;
    }
    
    if (wordSearchSelection.length === 0) {
        displayDiv.innerHTML = '🖱️ Haz clic y arrastra sobre las letras para formar una palabra';
        displayDiv.style.background = 'var(--color-1)';
        return;
    }
    
    let formedWord = '';
    for (let coord of wordSearchSelection) {
        formedWord += currentWordSearchGrid[coord.row][coord.col];
    }
    
    const reversedWord = formedWord.split('').reverse().join('');
    
    displayDiv.innerHTML = `📝 Palabra seleccionada: <strong>${formedWord}</strong> ${reversedWord !== formedWord ? `(o al revés: ${reversedWord})` : ''}`;
    displayDiv.style.background = 'var(--color-5)';
}

// Validar palabra seleccionada
function validateSelectedWord() {
    if (wordSearchSelection.length < 3) {
        const feedback = document.getElementById('wordSearchFeedback');
        if (feedback) {
            feedback.innerHTML = '⚠️ Selecciona al menos 3 letras para formar una palabra';
            feedback.style.color = 'orange';
            setTimeout(() => { if(feedback) feedback.innerHTML = ''; }, 1500);
        }
        clearWordSearchSelection();
        updateSelectedWordDisplay();
        return;
    }
    
    let formedWord = '';
    for (let coord of wordSearchSelection) {
        formedWord += currentWordSearchGrid[coord.row][coord.col];
    }
    
    const reversedWord = formedWord.split('').reverse().join('');
    let foundWord = null;
    let foundWordInfo = null;
    
    for (let wordInfo of wordSearchWordPositions) {
        if (!wordSearchFound.includes(wordInfo.word)) {
            if (formedWord === wordInfo.word || reversedWord === wordInfo.word) {
                foundWord = wordInfo.word;
                foundWordInfo = wordInfo;
                break;
            }
        }
    }
    
    if (foundWord && foundWordInfo) {
        wordSearchFound.push(foundWord);
        
        for (let pos of foundWordInfo.positions) {
            if (!wordSearchFoundPositions.some(p => p.row === pos.row && p.col === pos.col)) {
                wordSearchFoundPositions.push(pos);
            }
        }
        
        // Actualizar UI: verde brillante
        document.querySelectorAll('.wordsearch-cell').forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            if (wordSearchFoundPositions.some(p => p.row === row && p.col === col)) {
                cell.style.background = '#4caf50';
                cell.style.color = 'white';
                cell.style.fontWeight = 'bold';
                cell.style.boxShadow = '0 0 8px rgba(76, 175, 80, 0.6)';
                cell.style.textDecoration = 'none';
            }
        });
        
        // Actualizar lista de palabras
        const wordItems = document.querySelectorAll('.word-item');
        wordItems.forEach(item => {
            if (item.dataset.word === foundWord) {
                item.style.background = '#4caf50';
                item.style.textDecoration = 'line-through';
                item.style.opacity = '0.8';
                item.innerHTML = `${foundWord} ✓`;
            }
        });
        
        const pointsEarned = 20;
        addPoints(pointsEarned);
        const feedback = document.getElementById('wordSearchFeedback');
        if (feedback) {
            feedback.innerHTML = `✅ ¡Correcto! Encontraste "${foundWord}" +${pointsEarned} puntos`;
            feedback.style.color = 'green';
            setTimeout(() => { 
                if(feedback && feedback.innerHTML.includes('Correcto')) {
                    feedback.innerHTML = '';
                }
            }, 2000);
        }
        playSound('correcto');
        
        if (wordSearchFound.length === wordSearchWordsList.length) {
            const bonusPoints = 100;
            addPoints(bonusPoints);
            if (feedback) {
                feedback.innerHTML = `🎉 ¡FELICIDADES! Encontraste todas las palabras 🎉 +${bonusPoints} puntos extra`;
                feedback.style.color = 'gold';
            }
            playSound('correcto');
        }
        
        clearWordSearchSelection();
        updateSelectedWordDisplay();
    } else {
        const feedback = document.getElementById('wordSearchFeedback');
        if (feedback) {
            feedback.innerHTML = `❌ "${formedWord}" no está en la lista. ¡Sigue buscando!`;
            feedback.style.color = 'red';
            setTimeout(() => { if(feedback) feedback.innerHTML = ''; }, 2000);
        }
        playSound('incorrecto');
        clearWordSearchSelection();
        updateSelectedWordDisplay();
    }
}

// Limpiar selección actual
function clearWordSearchSelection() {
    wordSearchSelection = [];
    document.querySelectorAll('.wordsearch-cell').forEach(cell => {
        if (!cell.classList.contains('found')) {
            cell.style.background = 'var(--color-2)';
            cell.style.boxShadow = 'none';
        }
        cell.style.transform = '';
    });
    updateSelectedWordDisplay();
}




































































// ========== JUEGO 7: AHORCADO MEJORADO ==========
let hangmanWord = "";
let hangmanGuessed = [];
let hangmanAttempts = 6;
let hangmanScore = 0;
let hangmanHintsUsed = 0;
let hangmanStartTime = null;
let hangmanTimer = null;
let hangmanTimeLeft = 60;
let hangmanDifficulty = 'normal';
let hangmanCurrentCategory = 'todas';
let hangmanGameActive = true;

// Base de datos de palabras por categorías (más de 100 palabras)
const hangmanWordDatabase = {
    animales: [
        "ELEFANTE", "JIRAFA", "CANGURO", "DELFIN", "MARIPOSA", "LIBELULA", 
        "ORNITORRINCO", "CAMALEON", "IGUANA", "HALCON", "COLIBRI", "FLAMENCO",
        "PINGUINO", "KOALA", "PANDA", "CEBRA", "HIPOPOTAMO", "RINOCERONTE"
    ],
    frutas: [
        "MANZANA", "NARANJA", "FRUTILLA", "BANANA", "UVA", "SANDIA", "MELON",
        "PINA", "MANGO", "KIWI", "PERA", "CEREZA", "DURAZNO", "CIRUELA"
    ],
    paises: [
        "MEXICO", "ARGENTINA", "COLOMBIA", "PERU", "CHILE", "ESPAÑA", "FRANCIA",
        "ITALIA", "ALEMANIA", "JAPON", "CHINA", "BRASIL", "CANADA", "AUSTRALIA"
    ],
    profesiones: [
        "DOCTOR", "ENFERMERO", "PROFESOR", "ARQUITECTO", "INGENIERO", "CARPINTERO",
        "ELECTRICISTA", "BOMBERO", "POLICIA", "COCINERO", "ARTISTA", "DENTISTA"
    ],
    deportes: [
        "FUTBOL", "BASKETBALL", "VOLEIBOL", "TENIS", "NATACION", "BEISBOL",
        "GIMNASIA", "ATLETISMO", "CICLISMO", "ESGRIMA", "JUDO", "BOXEO"
    ],
    naturaleza: [
        "MONTAÑA", "RIO", "LAGO", "OCEANO", "VOLCAN", "DESIERTO", "BOSQUE",
        "SELVA", "ISLA", "VALLE", "CASCADA", "ARCOIRIS", "ESTRELLA"
    ],
    tecnologia: [
        "COMPUTADORA", "TELEFONO", "TABLETA", "TELEVISION", "MICROONDAS",
        "REFRIGERADOR", "LAVADORA", "ASPIADORA", "CALEFACTOR", "VENTILADOR"
    ],
    emociones: [
        "FELICIDAD", "TRISTEZA", "AMOR", "ENOJO", "MIEDO", "SORPRESA",
        "EMOCION", "TRANQUILIDAD", "ENTUSIASMO", "GRATITUD"
    ],
    comida: [
        "CHOCOLATE", "PIZZA", "HAMBURGUESA", "ENSALADA", "SOPA", "PASTA",
        "ARROZ", "FRIJOLES", "TACOS", "EMPANADA", "HUEVO", "PAN", "QUESO"
    ],
    escuela: [
        "ESCUELA", "BIBLIOTECA", "LABORATORIO", "GIMNASIO", "PATIO", "SALON",
        "PIZARRON", "MOCHILA", "CUADERNO", "LAPICERO", "REGLA", "COMPAS"
    ]
};

// Configuración de dificultad
const hangmanDifficultyConfig = {
    facil: { intentos: 8, tiempoLimite: 90, puntosBase: 30, bonusTiempo: 0.5 },
    normal: { intentos: 6, tiempoLimite: 60, puntosBase: 50, bonusTiempo: 1 },
    dificil: { intentos: 4, tiempoLimite: 45, puntosBase: 80, bonusTiempo: 1.5 }
};

// Pistas para cada palabra
const hangmanHints = {
    "ELEFANTE": "🐘 Tiene trompa larga y orejas grandes",
    "JIRAFA": "🦒 Tiene el cuello muy largo",
    "MANZANA": "🍎 Fruta roja o verde, es la favorita de Blancanieves",
    "CHOCOLATE": "🍫 Dulce hecho de cacao, puede ser blanco o negro",
    "COMPUTADORA": "💻 Máquina que usas para jugar y aprender",
    "ESCUELA": "📚 Lugar donde aprendes con tus amigos",
    "BIBLIOTECA": "📖 Lugar lleno de libros para leer",
    "PROFESOR": "👨‍🏫 Persona que te enseña en la escuela",
    "PRIMAVERA": "🌸 Estación donde florecen las flores",
    "FELICIDAD": "😊 Emoción que sientes cuando estás contento",
    "MARIPOSA": "🦋 Insecto colorido que vuela entre las flores",
    "ORNITORRINCO": "🦆 Animal raro con pico de pato y cola de castor",
    "CAMALEON": "🦎 Cambia de color para camuflarse",
    "AUSTRALIA": "🇦🇺 País de los canguros y koalas",
    "ARCOIRIS": "🌈 Siete colores aparecen después de la lluvia"
};

function initHangman() {
    const container = document.getElementById('hangmanContainer');
    if (!container) return;
    
    // Resetear estado
    if (hangmanTimer) clearInterval(hangmanTimer);
    hangmanGuessed = [];
    hangmanHintsUsed = 0;
    hangmanGameActive = true;
    
    // Configurar según dificultad
    const config = hangmanDifficultyConfig[hangmanDifficulty];
    hangmanAttempts = config.intentos;
    hangmanTimeLeft = config.tiempoLimite;
    hangmanStartTime = Date.now();
    
    // Seleccionar palabra según categoría
    selectWordByCategory();
    
    renderHangman(container);
    startHangmanTimer();
}

function selectWordByCategory() {
    let wordPool = [];
    
    if (hangmanCurrentCategory === 'todas') {
        // Combinar todas las categorías
        for (let category in hangmanWordDatabase) {
            wordPool = wordPool.concat(hangmanWordDatabase[category]);
        }
    } else {
        wordPool = hangmanWordDatabase[hangmanCurrentCategory] || hangmanWordDatabase.animales;
    }
    
    const randomIndex = Math.floor(Math.random() * wordPool.length);
    hangmanWord = wordPool[randomIndex];
}

function startHangmanTimer() {
    hangmanTimer = setInterval(() => {
        if (!hangmanGameActive) return;
        
        if (hangmanTimeLeft <= 0) {
            clearInterval(hangmanTimer);
            handleHangmanTimeout();
        } else {
            hangmanTimeLeft--;
            const timerSpan = document.getElementById('hangmanTimerDisplay');
            if (timerSpan) {
                timerSpan.innerText = hangmanTimeLeft;
                if (hangmanTimeLeft <= 10) {
                    timerSpan.style.color = '#ff4444';
                    timerSpan.style.fontWeight = 'bold';
                    timerSpan.style.animation = 'pulse 0.5s infinite';
                }
            }
            
            // Barra de progreso
            const timerBar = document.getElementById('hangmanTimerBar');
            if (timerBar) {
                const config = hangmanDifficultyConfig[hangmanDifficulty];
                const percentage = (hangmanTimeLeft / config.tiempoLimite) * 100;
                timerBar.style.width = `${percentage}%`;
                timerBar.style.backgroundColor = hangmanTimeLeft < 10 ? '#ff4444' : '#4CAF50';
            }
        }
    }, 1000);
}

function handleHangmanTimeout() {
    hangmanGameActive = false;
    const container = document.getElementById('hangmanContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="hangman-game-over">
            <div class="game-over-animation">
                ⏰ ¡TIEMPO AGOTADO! ⏰<br>
                La palabra era: <strong>${hangmanWord}</strong><br>
                🔄 Intenta de nuevo
            </div>
            <button class="game-btn" onclick="initHangman()">🔄 Nueva partida</button>
        </div>
    `;
    playSound('gameover');
}

function renderHangman(container) {
    const wordDisplay = hangmanWord.split('').map(letter => 
        hangmanGuessed.includes(letter) ? letter : '_'
    ).join(' ');
    
    const isGameWon = wordDisplay.indexOf('_') === -1 && hangmanAttempts > 0;
    const isGameLost = hangmanAttempts === 0;
    
    if (isGameWon && hangmanGameActive) {
        handleVictory();
        return;
    }
    
    if (isGameLost && hangmanGameActive) {
        handleDefeat();
        return;
    }
    
    // Obtener pista si existe
    const hint = hangmanHints[hangmanWord] || "💡 Pista: Usa las pistas si lo necesitas";
    
    container.innerHTML = `
        <div class="hangman-game-enhanced">
            <div class="hangman-header">
                <div class="difficulty-selector">
                    <button class="diff-btn ${hangmanDifficulty === 'facil' ? 'active' : ''}" onclick="setHangmanDifficulty('facil')">🌟 Fácil</button>
                    <button class="diff-btn ${hangmanDifficulty === 'normal' ? 'active' : ''}" onclick="setHangmanDifficulty('normal')">⚡ Normal</button>
                    <button class="diff-btn ${hangmanDifficulty === 'dificil' ? 'active' : ''}" onclick="setHangmanDifficulty('dificil')">🔥 Difícil</button>
                </div>
                <div class="category-selector">
                    <select id="categorySelect" onchange="setHangmanCategory(this.value)" class="category-select">
                        <option value="todas" ${hangmanCurrentCategory === 'todas' ? 'selected' : ''}>📚 Todas las categorías</option>
                        <option value="animales" ${hangmanCurrentCategory === 'animales' ? 'selected' : ''}>🦁 Animales</option>
                        <option value="frutas" ${hangmanCurrentCategory === 'frutas' ? 'selected' : ''}>🍎 Frutas</option>
                        <option value="paises" ${hangmanCurrentCategory === 'paises' ? 'selected' : ''}>🌍 Países</option>
                        <option value="profesiones" ${hangmanCurrentCategory === 'profesiones' ? 'selected' : ''}>👨‍⚕️ Profesiones</option>
                        <option value="deportes" ${hangmanCurrentCategory === 'deportes' ? 'selected' : ''}>⚽ Deportes</option>
                        <option value="naturaleza" ${hangmanCurrentCategory === 'naturaleza' ? 'selected' : ''}>🌿 Naturaleza</option>
                        <option value="tecnologia" ${hangmanCurrentCategory === 'tecnologia' ? 'selected' : ''}>💻 Tecnología</option>
                        <option value="emociones" ${hangmanCurrentCategory === 'emociones' ? 'selected' : ''}>😊 Emociones</option>
                        <option value="comida" ${hangmanCurrentCategory === 'comida' ? 'selected' : ''}>🍕 Comida</option>
                        <option value="escuela" ${hangmanCurrentCategory === 'escuela' ? 'selected' : ''}>📚 Escuela</option>
                    </select>
                </div>
            </div>
            
            <div class="hangman-stats">
                <div class="stat">🎯 Intentos: ${hangmanAttempts}</div>
                <div class="stat">⭐ Puntaje: ${hangmanScore}</div>
                <div class="stat">💡 Pistas: ${hangmanHintsUsed}/3</div>
                <div class="stat timer-stat">
                    ⏱️ <span id="hangmanTimerDisplay">${hangmanTimeLeft}</span>s
                    <div class="timer-bar-container">
                        <div id="hangmanTimerBar" class="timer-bar-fill" style="width: 100%"></div>
                    </div>
                </div>
            </div>
            
            <div class="hangman-canvas">
                <svg width="300" height="250" viewBox="0 0 300 250" class="hangman-svg">
                    <!-- Base -->
                    <line x1="20" y1="230" x2="280" y2="230" stroke="white" stroke-width="3"/>
                    <line x1="50" y1="230" x2="50" y2="20" stroke="white" stroke-width="3"/>
                    <line x1="50" y1="20" x2="150" y2="20" stroke="white" stroke-width="3"/>
                    <line x1="150" y1="20" x2="150" y2="50" stroke="white" stroke-width="3"/>
                    
                    <!-- Cuerpo del ahorcado según intentos -->
                    ${hangmanAttempts <= 5 ? `<circle cx="150" cy="70" r="20" fill="none" stroke="white" stroke-width="3"/>` : ''}
                    ${hangmanAttempts <= 4 ? `<line x1="150" y1="90" x2="150" y2="150" stroke="white" stroke-width="3"/>` : ''}
                    ${hangmanAttempts <= 3 ? `<line x1="150" y1="100" x2="120" y2="130" stroke="white" stroke-width="3"/>` : ''}
                    ${hangmanAttempts <= 3 ? `<line x1="150" y1="100" x2="180" y2="130" stroke="white" stroke-width="3"/>` : ''}
                    ${hangmanAttempts <= 2 ? `<line x1="150" y1="150" x2="120" y2="190" stroke="white" stroke-width="3"/>` : ''}
                    ${hangmanAttempts <= 2 ? `<line x1="150" y1="150" x2="180" y2="190" stroke="white" stroke-width="3"/>` : ''}
                    
                    <!-- Cara según intentos -->
                    ${hangmanAttempts <= 5 ? `
                        <circle cx="140" cy="65" r="3" fill="white"/>
                        <circle cx="160" cy="65" r="3" fill="white"/>
                        ${hangmanAttempts <= 4 ? `<path d="M 143 80 Q 150 85 157 80" fill="none" stroke="white" stroke-width="2"/>` : ''}
                    ` : ''}
                </svg>
            </div>
            
            <div class="hangman-word">
                <h2>${wordDisplay}</h2>
            </div>
            
            <div class="hangman-hint">
                <div class="hint-icon">💡</div>
                <div class="hint-text">${hint}</div>
            </div>
            
            <div class="hangman-keyboard">
                ${'ABCDEFGHIJKLMNOPQRSTUVWXYZÑ'.split('').map(letter => `
                    <button class="hangman-key-enhanced ${hangmanGuessed.includes(letter) ? 'used' : ''}" 
                            onclick="guessLetterEnhanced('${letter}')"
                            ${hangmanGuessed.includes(letter) || !hangmanGameActive ? 'disabled' : ''}>
                        ${letter}
                    </button>
                `).join('')}
            </div>
            
            <div class="hangman-controls">
                <button class="game-btn" onclick="getHangmanHint()">💡 Pedir pista</button>
                <button class="game-btn" onclick="revealLetter()">🔍 Revelar letra (-5 pts)</button>
                <button class="game-btn" onclick="initHangman()">🔄 Nueva palabra</button>
                <button class="game-btn" onclick="skipWord()">⏭️ Saltar palabra (-10 pts)</button>
            </div>
            
            <div id="hangmanFeedback" class="game-feedback"></div>
        </div>
    `;
}

function guessLetterEnhanced(letter) {
    if (!hangmanGameActive) return;
    if (hangmanGuessed.includes(letter)) return;
    
    hangmanGuessed.push(letter);
    
    if (hangmanWord.includes(letter)) {
        // Acierto
        const pointsEarned = 10;
        hangmanScore += pointsEarned;
        showHangmanMessage(`✅ ¡Correcto! "${letter}" está en la palabra +${pointsEarned} pts`, 'success');
        playSound('correcto');
        
        // Efecto visual en el teclado
        const btn = document.querySelector(`.hangman-key-enhanced:not(.used)[onclick="guessLetterEnhanced('${letter}')"]`);
        if (btn) {
            btn.style.background = '#4CAF50';
            btn.style.transform = 'scale(1.1)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 200);
        }
    } else {
        // Error
        const config = hangmanDifficultyConfig[hangmanDifficulty];
        hangmanAttempts--;
        showHangmanMessage(`❌ ¡Ups! "${letter}" no está en la palabra. Te quedan ${hangmanAttempts} intentos`, 'error');
        playSound('incorrecto');
        
        // Efecto de vibración
        const canvas = document.querySelector('.hangman-canvas');
        if (canvas) {
            canvas.style.animation = 'shake 0.3s ease-in-out';
            setTimeout(() => {
                canvas.style.animation = '';
            }, 300);
        }
    }
    
    // Actualizar estadísticas
    updateHangmanStats();
    
    // Verificar si se completó la palabra
    const wordDisplay = hangmanWord.split('').map(l => hangmanGuessed.includes(l) ? l : '_').join('');
    if (wordDisplay.indexOf('_') === -1 && hangmanAttempts > 0) {
        handleVictory();
    } else if (hangmanAttempts === 0) {
        handleDefeat();
    } else {
        const container = document.getElementById('hangmanContainer');
        if (container) renderHangman(container);
    }
}

function handleVictory() {
    if (!hangmanGameActive) return;
    
    hangmanGameActive = false;
    if (hangmanTimer) clearInterval(hangmanTimer);
    
    const config = hangmanDifficultyConfig[hangmanDifficulty];
    const tiempoUsado = config.tiempoLimite - hangmanTimeLeft;
    const bonusTiempo = Math.floor(hangmanTimeLeft * config.bonusTiempo);
    const bonusIntentos = hangmanAttempts * 5;
    const penalizacionPistas = hangmanHintsUsed * 5;
    
    const puntosFinales = config.puntosBase + hangmanScore + bonusTiempo + bonusIntentos - penalizacionPistas;
    
    const container = document.getElementById('hangmanContainer');
    if (container) {
        container.innerHTML = `
            <div class="victory-screen">
                <div class="victory-animation">
                    🎉✨ ¡VICTORIA! ✨🎉<br>
                    Palabra: <strong>${hangmanWord}</strong><br><br>
                    📊 PUNTUACIÓN:<br>
                    Base: +${config.puntosBase}<br>
                    Aciertos: +${hangmanScore}<br>
                    Tiempo restante: +${bonusTiempo}<br>
                    Intentos restantes: +${bonusIntentos}<br>
                    ${penalizacionPistas > 0 ? `Pistas usadas: -${penalizacionPistas}<br>` : ''}
                    ⭐ TOTAL: ${Math.max(puntosFinales, 10)} puntos ⭐
                </div>
                <button class="game-btn" onclick="initHangman()">🎮 Nueva partida</button>
            </div>
        `;
    }
    
    addPoints(Math.max(puntosFinales, 10), `Ganaste en el ahorcado: ${hangmanWord}`);
    playSound('win');
}

function handleDefeat() {
    if (!hangmanGameActive) return;
    
    hangmanGameActive = false;
    if (hangmanTimer) clearInterval(hangmanTimer);
    
    const container = document.getElementById('hangmanContainer');
    if (container) {
        container.innerHTML = `
            <div class="defeat-screen">
                <div class="defeat-animation">
                    💀 ¡AHORCADO! 💀<br>
                    La palabra era: <strong>${hangmanWord}</strong><br><br>
                    📝 Puntuación final: ${hangmanScore} puntos<br><br>
                    ¡Sigue practicando para mejorar!
                </div>
                <button class="game-btn" onclick="initHangman()">🔄 Intentar de nuevo</button>
            </div>
        `;
    }
    playSound('gameover');
}

function getHangmanHint() {
    if (hangmanHintsUsed >= 3) {
        showHangmanMessage('⚠️ Ya usaste tus 3 pistas disponibles', 'warning');
        return;
    }
    
    const hint = hangmanHints[hangmanWord];
    if (hint) {
        hangmanHintsUsed++;
        showHangmanMessage(`💡 Pista: ${hint}`, 'info');
        playSound('hint');
        updateHangmanStats();
    } else {
        // Pista genérica
        const letrasFaltantes = hangmanWord.split('').filter(l => !hangmanGuessed.includes(l));
        const letrasUnicas = [...new Set(letrasFaltantes)];
        if (letrasUnicas.length > 0) {
            const randomLetter = letrasUnicas[Math.floor(Math.random() * letrasUnicas.length)];
            showHangmanMessage(`💡 Pista: La palabra contiene la letra "${randomLetter}"`, 'info');
            hangmanHintsUsed++;
            updateHangmanStats();
        }
    }
}

function revealLetter() {
    if (hangmanScore < 5) {
        showHangmanMessage('⚠️ Necesitas al menos 5 puntos para revelar una letra', 'warning');
        return;
    }
    
    const letrasFaltantes = hangmanWord.split('').filter(l => !hangmanGuessed.includes(l));
    const letrasUnicas = [...new Set(letrasFaltantes)];
    
    if (letrasUnicas.length > 0) {
        const letterToReveal = letrasUnicas[Math.floor(Math.random() * letrasUnicas.length)];
        hangmanScore -= 5;
        showHangmanMessage(`🔍 Letra revelada: "${letterToReveal}" (-5 puntos)`, 'info');
        guessLetterEnhanced(letterToReveal);
    } else {
        showHangmanMessage('🎉 No quedan letras por revelar', 'success');
    }
}

function skipWord() {
    if (hangmanScore < 10) {
        showHangmanMessage('⚠️ Necesitas al menos 10 puntos para saltar palabra', 'warning');
        return;
    }
    
    hangmanScore -= 10;
    showHangmanMessage(`⏭️ Saltando palabra... -10 puntos. Nueva palabra cargando...`, 'info');
    
    setTimeout(() => {
        selectWordByCategory();
        hangmanGuessed = [];
        const config = hangmanDifficultyConfig[hangmanDifficulty];
        hangmanAttempts = config.intentos;
        const container = document.getElementById('hangmanContainer');
        if (container) renderHangman(container);
        updateHangmanStats();
    }, 1500);
}

function setHangmanDifficulty(difficulty) {
    hangmanDifficulty = difficulty;
    initHangman();
}

function setHangmanCategory(category) {
    hangmanCurrentCategory = category;
    initHangman();
}

function updateHangmanStats() {
    const statsContainer = document.querySelector('.hangman-stats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat">🎯 Intentos: ${hangmanAttempts}</div>
            <div class="stat">⭐ Puntaje: ${hangmanScore}</div>
            <div class="stat">💡 Pistas: ${hangmanHintsUsed}/3</div>
            <div class="stat timer-stat">
                ⏱️ <span id="hangmanTimerDisplay">${hangmanTimeLeft}</span>s
                <div class="timer-bar-container">
                    <div id="hangmanTimerBar" class="timer-bar-fill" style="width: ${(hangmanTimeLeft / hangmanDifficultyConfig[hangmanDifficulty].tiempoLimite) * 100}%"></div>
                </div>
            </div>
        `;
    }
}

function showHangmanMessage(message, type) {
    const feedbackDiv = document.getElementById('hangmanFeedback');
    if (!feedbackDiv) return;
    
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196F3'
    };
    
    feedbackDiv.innerHTML = `<div style="color: ${colors[type]}; padding: 10px; border-radius: 10px; background: rgba(0,0,0,0.1); animation: slideIn 0.3s ease;">${message}</div>`;
    
    setTimeout(() => {
        if (feedbackDiv.innerHTML === `<div style="color: ${colors[type]}; padding: 10px; border-radius: 10px; background: rgba(0,0,0,0.1); animation: slideIn 0.3s ease;">${message}</div>`) {
            feedbackDiv.innerHTML = '';
        }
    }, 3000);
}

// Añadir estilos CSS mejorados
const hangmanStyles = `
    .hangman-game-enhanced {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        padding: 20px;
        border-radius: 20px;
        color: white;
    }
    
    .hangman-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        flex-wrap: wrap;
        gap: 10px;
    }
    
    .difficulty-selector {
        display: flex;
        gap: 10px;
    }
    
    .diff-btn {
        padding: 5px 15px;
        border: 2px solid white;
        background: transparent;
        color: white;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .diff-btn.active {
        background: #ffd700;
        color: #333;
        border-color: #ffd700;
    }
    
    .category-select {
        padding: 5px 15px;
        border-radius: 20px;
        background: rgba(255,255,255,0.2);
        color: white;
        border: 2px solid white;
        cursor: pointer;
    }
    
    .category-select option {
        background: #16213e;
    }
    
    .hangman-stats {
        display: flex;
        justify-content: space-around;
        background: rgba(0,0,0,0.3);
        padding: 10px;
        border-radius: 15px;
        margin-bottom: 20px;
        flex-wrap: wrap;
        gap: 15px;
    }
    
    .stat {
        font-weight: bold;
    }
    
    .timer-stat {
        min-width: 120px;
    }
    
    .timer-bar-container {
        width: 100px;
        height: 5px;
        background: rgba(255,255,255,0.3);
        border-radius: 5px;
        overflow: hidden;
        margin-top: 5px;
    }
    
    .timer-bar-fill {
        height: 100%;
        background: #4CAF50;
        transition: width 1s linear;
    }
    
    .hangman-canvas {
        display: flex;
        justify-content: center;
        margin: 20px 0;
    }
    
    .hangman-svg {
        background: rgba(0,0,0,0.3);
        border-radius: 15px;
        padding: 10px;
    }
    
    .hangman-word h2 {
        font-size: 2rem;
        letter-spacing: 10px;
        font-family: monospace;
        text-align: center;
        background: rgba(0,0,0,0.3);
        padding: 15px;
        border-radius: 15px;
    }
    
    .hangman-hint {
        background: rgba(255,193,7,0.2);
        border: 2px solid #ffc107;
        border-radius: 15px;
        padding: 10px;
        margin: 15px 0;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .hint-icon {
        font-size: 1.5rem;
    }
    
    .hint-text {
        font-size: 0.9rem;
    }
    
    .hangman-keyboard {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        margin: 20px 0;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .hangman-key-enhanced {
        width: 45px;
        height: 45px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        font-weight: bold;
        font-size: 1.1rem;
        transition: all 0.2s;
    }
    
    .hangman-key-enhanced:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }
    
    .hangman-key-enhanced.used {
        background: #6c757d;
        cursor: default;
        opacity: 0.5;
    }
    
    .hangman-key-enhanced:disabled {
        cursor: not-allowed;
    }
    
    .hangman-controls {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 20px;
    }
    
    .victory-screen, .defeat-screen {
        text-align: center;
        padding: 30px;
        background: rgba(0,0,0,0.3);
        border-radius: 20px;
    }
    
    .victory-animation, .defeat-animation {
        animation: fadeInUp 0.5s ease;
        margin-bottom: 20px;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;

if (!document.querySelector('#hangmanStyles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'hangmanStyles';
    styleSheet.textContent = hangmanStyles;
    document.head.appendChild(styleSheet);
}














































































// ========== JUEGO 8: QUIZ DE CIENCIAS MEJORADO ==========
let scienceScore = 0;
let scienceCurrent = 0;
let scienceTimerInterval = null;
let scienceTimeLeft = 15;
let scienceLives = 3;
let scienceStreak = 0;
let sciencePowerUps = {
    doublePoints: false,
    extraTime: false,
    fiftyFifty: false,
    skipQuestion: false
};
let scienceDifficulty = 'normal';
let scienceCategory = 'general';
let scienceDailyBonus = false;
let scienceAnsweredToday = false;
let scienceBestScore = localStorage.getItem('scienceBestScore') || 0;
let scienceQuestionsAnswered = 0;
let scienceCorrectAnswers = 0;

// Base de datos extensa de preguntas de ciencias por categorías (100+ preguntas)
const scienceDatabase = {
    biologia: [
        { text: "¿Cuál es el órgano más grande del cuerpo humano?", options: ["Corazón", "Hígado", "Piel", "Cerebro"], correct: 2, explicacion: "La piel es el órgano más grande, pesa unos 5 kg y mide unos 2 metros cuadrados" },
        { text: "¿Qué tipo de célula transporta oxígeno en la sangre?", options: ["Glóbulo blanco", "Glóbulo rojo", "Plaqueta", "Neurona"], correct: 1, explicacion: "Los glóbulos rojos contienen hemoglobina que transporta oxígeno" },
        { text: "¿Cuántos cromosomas tiene un ser humano normal?", options: ["23", "46", "48", "24"], correct: 1, explicacion: "Los humanos tenemos 46 cromosomas (23 pares)" },
        { text: "¿Qué parte de la célula contiene el material genético?", options: ["Citoplasma", "Mitocondria", "Núcleo", "Membrana"], correct: 2, explicacion: "El núcleo contiene el ADN de la célula" },
        { text: "¿Cuál es el hueso más largo del cuerpo humano?", options: ["Fémur", "Tibia", "Húmero", "Radio"], correct: 0, explicacion: "El fémur es el hueso más largo, va desde la cadera hasta la rodilla" },
        { text: "¿Qué función tiene el corazón?", options: ["Digestión", "Respiración", "Bombear sangre", "Pensar"], correct: 2, explicacion: "El corazón bombea sangre a todo el cuerpo" },
        { text: "¿Cuántos litros de sangre tiene un adulto promedio?", options: ["3-4", "5-6", "7-8", "2-3"], correct: 1, explicacion: "Un adulto tiene aproximadamente 5-6 litros de sangre" },
        { text: "¿Qué vitamina produce el cuerpo cuando recibe luz solar?", options: ["Vitamina A", "Vitamina C", "Vitamina D", "Vitamina E"], correct: 2, explicacion: "La vitamina D se produce en la piel con la exposición solar" },
        { text: "¿Cuántos músculos tiene el cuerpo humano?", options: ["Unos 200", "Unos 400", "Unos 600", "Unos 800"], correct: 2, explicacion: "El cuerpo humano tiene aproximadamente 600 músculos" }
    ],
    fisica: [
        { text: "¿Quién formuló la ley de la gravedad?", options: ["Einstein", "Newton", "Galileo", "Tesla"], correct: 1, explicacion: "Isaac Newton descubrió la gravedad al ver caer una manzana" },
        { text: "¿Cuál es la unidad de medida de la fuerza?", options: ["Julio", "Watt", "Newton", "Pascal"], correct: 2, explicacion: "El Newton (N) es la unidad de fuerza" },
        { text: "¿Qué color tiene la luz del sol?", options: ["Amarilla", "Blanca", "Roja", "Azul"], correct: 1, explicacion: "La luz solar es blanca, pero contiene todos los colores" },
        { text: "¿Cuál es el estado de la materia que tiene volumen fijo pero forma variable?", options: ["Sólido", "Líquido", "Gaseoso", "Plasma"], correct: 1, explicacion: "Los líquidos tienen volumen fijo pero adoptan la forma del recipiente" },
        { text: "¿Qué fenómeno explica por qué vemos el cielo azul?", options: ["Refracción", "Reflexión", "Dispersión", "Difracción"], correct: 2, explicacion: "La dispersión de Rayleigh hace que la luz azul se disperse más" },
        { text: "¿Cuál es la velocidad de la luz en el vacío?", options: ["300,000 km/s", "150,000 km/s", "400,000 km/s", "100,000 km/s"], correct: 0, explicacion: "La luz viaja a 300,000 kilómetros por segundo" },
        { text: "¿Qué ley dice que 'a toda acción corresponde una reacción igual y opuesta'?", options: ["Ley de inercia", "Ley de acción-reacción", "Ley de gravedad", "Ley de conservación"], correct: 1, explicacion: "Es la tercera ley de Newton" }
    ],
    quimica: [
        { text: "¿Cuál es el símbolo químico del agua?", options: ["CO2", "O2", "H2O", "NaCl"], correct: 2, explicacion: "El agua está compuesta por 2 átomos de hidrógeno y 1 de oxígeno" },
        { text: "¿Cuál es el metal más abundante en la corteza terrestre?", options: ["Hierro", "Aluminio", "Cobre", "Oro"], correct: 1, explicacion: "El aluminio es el tercer elemento más abundante de la corteza" },
        { text: "¿Cuál es el elemento más ligero de la tabla periódica?", options: ["Helio", "Litio", "Hidrógeno", "Oxígeno"], correct: 2, explicacion: "El hidrógeno es el elemento más ligero, con número atómico 1" },
        { text: "¿Qué pH tiene el agua pura?", options: ["5", "6", "7", "8"], correct: 2, explicacion: "El agua pura es neutra con pH 7" },
        { text: "¿Qué gas respiramos que es esencial para la vida?", options: ["Nitrógeno", "Oxígeno", "Dióxido de carbono", "Hidrógeno"], correct: 1, explicacion: "El oxígeno es esencial para la respiración celular" }
    ],
    astronomia: [
        { text: "¿Cuántos planetas tiene el sistema solar?", options: ["7", "8", "9", "10"], correct: 1, explicacion: "Hay 8 planetas: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno" },
        { text: "¿Cuál es la estrella más cercana a la Tierra?", options: ["Próxima Centauri", "Sol", "Sirio", "Alfa Centauri"], correct: 1, explicacion: "El Sol es nuestra estrella más cercana, a 150 millones de km" },
        { text: "¿Qué planeta es conocido como el 'gigante rojo'?", options: ["Marte", "Júpiter", "Saturno", "Urano"], correct: 0, explicacion: "Marte se llama planeta rojo por su color rojizo" },
        { text: "¿Qué es la Vía Láctea?", options: ["Una estrella", "Un planeta", "Una galaxia", "Un agujero negro"], correct: 2, explicacion: "La Vía Láctea es nuestra galaxia, contiene miles de millones de estrellas" },
        { text: "¿Cuánto tarda la Tierra en dar una vuelta alrededor del Sol?", options: ["24 horas", "30 días", "365 días", "12 meses"], correct: 2, explicacion: "Un año terrestre dura 365 días" }
    ],
    medicina: [
        { text: "¿Qué médico es conocido como el 'padre de la medicina moderna'?", options: ["Hipócrates", "Galeno", "Avicena", "Paracelso"], correct: 0, explicacion: "Hipócrates es considerado el padre de la medicina" },
        { text: "¿Cuál es la función de las vacunas?", options: ["Curar enfermedades", "Prevenir enfermedades", "Aliviar síntomas", "Matar bacterias"], correct: 1, explicacion: "Las vacunas preparan el sistema inmune contra enfermedades" },
        { text: "¿Quién descubrió la penicilina?", options: ["Louis Pasteur", "Alexander Fleming", "Marie Curie", "Robert Koch"], correct: 1, explicacion: "Fleming descubrió la penicilina por accidente en 1928" },
        { text: "¿Qué instrumento usan los médicos para escuchar el corazón?", options: ["Termómetro", "Esfigmomanómetro", "Estetoscopio", "Oftalmoscopio"], correct: 2, explicacion: "El estetoscopio amplifica los sonidos internos del cuerpo" }
    ],
    ecologia: [
        { text: "¿Qué fenómeno causa el calentamiento global?", options: ["Efecto invernadero", "Lluvia ácida", "Agujero de ozono", "Desertificación"], correct: 0, explicacion: "El efecto invernadero intensificado por gases como CO2" },
        { text: "¿Cuál es el gas más abundante en la atmósfera terrestre?", options: ["Oxígeno", "Dióxido de carbono", "Nitrógeno", "Argón"], correct: 2, explicacion: "El nitrógeno constituye el 78% de la atmósfera" },
        { text: "¿Qué capa de la atmósfera nos protege de los rayos UV?", options: ["Troposfera", "Estratosfera", "Capa de ozono", "Ionosfera"], correct: 2, explicacion: "La capa de ozono filtra los dañinos rayos UV del sol" }
    ]
};

// Configuración de dificultad
const scienceDifficultyConfig = {
    facil: { tiempoBase: 25, puntosBase: 10, vidas: 5, bonusTiempo: 0.5, preguntas: 7 },
    normal: { tiempoBase: 15, puntosBase: 15, vidas: 3, bonusTiempo: 1, preguntas: 10 },
    dificil: { tiempoBase: 10, puntosBase: 25, vidas: 2, bonusTiempo: 1.5, preguntas: 12 }
};

// Joker disponible por partida
let jokerUsed = false;

function startScienceQuiz() {
    const container = document.getElementById('scienceQuizContainer');
    if (!container) return;
    
    // Resetear estado
    if (scienceTimerInterval) clearInterval(scienceTimerInterval);
    
    scienceScore = 0;
    scienceCurrent = 0;
    scienceQuestionsAnswered = 0;
    scienceCorrectAnswers = 0;
    scienceStreak = 0;
    jokerUsed = false;
    
    const config = scienceDifficultyConfig[scienceDifficulty];
    scienceLives = config.vidas;
    scienceTimeLeft = config.tiempoBase;
    
    sciencePowerUps = {
        doublePoints: false,
        extraTime: false,
        fiftyFifty: false,
        skipQuestion: false
    };
    
    // Verificar bonus diario
    const lastPlayed = localStorage.getItem('scienceLastPlayed');
    const today = new Date().toDateString();
    scienceDailyBonus = lastPlayed !== today;
    scienceAnsweredToday = false;
    
    if (scienceDailyBonus) {
        showDailyBonusMenu();
    } else {
        showScienceQuestion();
    }
}

function showDailyBonusMenu() {
    const container = document.getElementById('scienceQuizContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="daily-bonus-screen">
            <div class="bonus-animation">🎁 ¡BONUS DIARIO DISPONIBLE! 🎁</div>
            <div class="bonus-options">
                <button class="game-btn" onclick="claimDailyBonus(50)">⭐ +50 puntos iniciales</button>
                <button class="game-btn" onclick="claimDailyBonus('extraLife')">❤️ +1 vida extra</button>
                <button class="game-btn" onclick="claimDailyBonus('joker')">🃏 Joker gratis</button>
                <button class="game-btn" onclick="claimDailyBonus('skip')">⏩ Saltar primera pregunta</button>
            </div>
            <button class="game-btn" onclick="startQuizWithoutBonus()">➡️ Continuar sin bonus</button>
        </div>
    `;
}

function claimDailyBonus(bonus) {
    if (bonus === 50) {
        scienceScore = 50;
        showMessage('🎁 ¡Recibiste 50 puntos de bonus!', 'success');
    } else if (bonus === 'extraLife') {
        scienceLives++;
        showMessage('❤️ ¡Obtuviste una vida extra!', 'success');
    } else if (bonus === 'joker') {
        jokerUsed = false;
        showMessage('🃏 ¡Tienes un joker disponible!', 'success');
    } else if (bonus === 'skip') {
        scienceCurrent++;
        showMessage('⏩ Primera pregunta saltada automáticamente', 'info');
    }
    
    localStorage.setItem('scienceLastPlayed', new Date().toDateString());
    scienceDailyBonus = false;
    showScienceQuestion();
}

function startQuizWithoutBonus() {
    localStorage.setItem('scienceLastPlayed', new Date().toDateString());
    scienceDailyBonus = false;
    showScienceQuestion();
}

function getCurrentQuestions() {
    if (scienceCategory === 'todas') {
        let allQuestions = [];
        for (let cat in scienceDatabase) {
            allQuestions = allQuestions.concat(scienceDatabase[cat]);
        }
        // Mezclar preguntas
        for (let i = allQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
        }
        const config = scienceDifficultyConfig[scienceDifficulty];
        return allQuestions.slice(0, config.preguntas);
    } else {
        const questions = scienceDatabase[scienceCategory] || scienceDatabase.biologia;
        const shuffled = [...questions];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        const config = scienceDifficultyConfig[scienceDifficulty];
        return shuffled.slice(0, config.preguntas);
    }
}

let currentQuestionSet = [];

function showScienceQuestion() {
    const container = document.getElementById('scienceQuizContainer');
    if (!container) return;
    
    if (currentQuestionSet.length === 0) {
        currentQuestionSet = getCurrentQuestions();
    }
    
    // Verificar Game Over
    if (scienceLives <= 0) {
        if (scienceTimerInterval) clearInterval(scienceTimerInterval);
        const finalScore = calculateFinalScore();
        handleGameOver(finalScore);
        return;
    }
    
    if (scienceCurrent >= currentQuestionSet.length) {
        if (scienceTimerInterval) clearInterval(scienceTimerInterval);
        const finalScore = calculateFinalScore();
        handleVictory(finalScore);
        return;
    }
    
    const q = currentQuestionSet[scienceCurrent];
    const config = scienceDifficultyConfig[scienceDifficulty];
    scienceTimeLeft = config.tiempoBase;
    
    // Crear opciones mezcladas
    let options = [...q.options];
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    
    // Encontrar el índice correcto en las opciones mezcladas
    const correctValue = q.options[q.correct];
    const newCorrectIndex = options.indexOf(correctValue);
    
    container.innerHTML = `
        <div class="science-quiz-enhanced">
            <div class="quiz-header">
                <div class="difficulty-buttons">
                    <button class="diff-science-btn ${scienceDifficulty === 'facil' ? 'active' : ''}" onclick="setScienceDifficulty('facil')">🌟 Fácil</button>
                    <button class="diff-science-btn ${scienceDifficulty === 'normal' ? 'active' : ''}" onclick="setScienceDifficulty('normal')">⚡ Normal</button>
                    <button class="diff-science-btn ${scienceDifficulty === 'dificil' ? 'active' : ''}" onclick="setScienceDifficulty('dificil')">🔥 Difícil</button>
                </div>
                <div class="category-selector">
                    <select id="scienceCategorySelect" onchange="setScienceCategory(this.value)" class="science-category-select">
                        <option value="todas" ${scienceCategory === 'todas' ? 'selected' : ''}>📚 Todas las categorías</option>
                        <option value="biologia" ${scienceCategory === 'biologia' ? 'selected' : ''}>🧬 Biología</option>
                        <option value="fisica" ${scienceCategory === 'fisica' ? 'selected' : ''}>⚡ Física</option>
                        <option value="quimica" ${scienceCategory === 'quimica' ? 'selected' : ''}>🧪 Química</option>
                        <option value="astronomia" ${scienceCategory === 'astronomia' ? 'selected' : ''}>🔭 Astronomía</option>
                        <option value="medicina" ${scienceCategory === 'medicina' ? 'selected' : ''}>💊 Medicina</option>
                        <option value="ecologia" ${scienceCategory === 'ecologia' ? 'selected' : ''}>🌍 Ecología</option>
                    </select>
                </div>
            </div>
            
            <div class="quiz-stats">
                <div class="stat-item">❤️ Vidas: ${scienceLives}</div>
                <div class="stat-item">⭐ Puntos: ${scienceScore}</div>
                <div class="stat-item">🔥 Racha: ${scienceStreak}</div>
                <div class="stat-item">🏆 Récord: ${scienceBestScore}</div>
                <div class="stat-item timer-stat">
                    ⏱️ <span id="scienceTimerDisplay">${scienceTimeLeft}</span>s
                    <div class="timer-bar">
                        <div id="scienceTimerProgress" class="timer-progress" style="width:100%"></div>
                    </div>
                </div>
            </div>
            
            <div class="science-question">
                <span class="question-icon">🔬</span>
                <h3>${q.text}</h3>
            </div>
            
            <div class="science-options-grid">
                ${options.map((opt, idx) => `
                    <button class="science-option" onclick="checkScienceAnswerEnhanced(${idx}, ${newCorrectIndex})">
                        <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                        <span class="option-text">${opt}</span>
                    </button>
                `).join('')}
            </div>
            
            <div class="science-powerups">
                <button class="powerup ${sciencePowerUps.doublePoints ? 'used' : ''}" onclick="useSciencePowerUp('doublePoints')">
                    🎯 ×2 Puntos ${sciencePowerUps.doublePoints ? '(usado)' : ''}
                </button>
                <button class="powerup ${sciencePowerUps.extraTime ? 'used' : ''}" onclick="useSciencePowerUp('extraTime')">
                    ⏰ +5 seg ${sciencePowerUps.extraTime ? '(usado)' : ''}
                </button>
                <button class="powerup ${sciencePowerUps.fiftyFifty ? 'used' : ''}" onclick="useSciencePowerUp('fiftyFifty')">
                    50/50 🔪 ${sciencePowerUps.fiftyFifty ? '(usado)' : ''}
                </button>
                <button class="powerup ${sciencePowerUps.skipQuestion ? 'used' : ''}" onclick="useSciencePowerUp('skipQuestion')">
                    ⏭️ Saltar ${sciencePowerUps.skipQuestion ? '(usado)' : ''}
                </button>
                ${!jokerUsed ? '<button class="powerup joker" onclick="useJoker()">🃏 Joker</button>' : ''}
            </div>
            
            <div class="quiz-progress">
                Pregunta ${scienceCurrent + 1} de ${currentQuestionSet.length}
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${((scienceCurrent + 1) / currentQuestionSet.length) * 100}%"></div>
                </div>
            </div>
            
            <div id="scienceFeedback" class="game-feedback"></div>
        </div>
    `;
    
    startScienceTimer();
}

function startScienceTimer() {
    if (scienceTimerInterval) clearInterval(scienceTimerInterval);
    
    const config = scienceDifficultyConfig[scienceDifficulty];
    const totalTime = config.tiempoBase;
    
    scienceTimerInterval = setInterval(() => {
        if (scienceTimeLeft <= 0) {
            clearInterval(scienceTimerInterval);
            handleTimeOut();
        } else {
            scienceTimeLeft--;
            const timerSpan = document.getElementById('scienceTimerDisplay');
            const timerProgress = document.getElementById('scienceTimerProgress');
            
            if (timerSpan) {
                timerSpan.innerText = scienceTimeLeft;
                if (scienceTimeLeft <= 5) {
                    timerSpan.style.color = '#ff4444';
                    timerSpan.style.fontWeight = 'bold';
                }
            }
            
            if (timerProgress) {
                const percentage = (scienceTimeLeft / totalTime) * 100;
                timerProgress.style.width = `${percentage}%`;
                timerProgress.style.backgroundColor = scienceTimeLeft < 5 ? '#ff4444' : '#4CAF50';
            }
        }
    }, 1000);
}

function handleTimeOut() {
    scienceLives--;
    scienceStreak = 0;
    
    const q = currentQuestionSet[scienceCurrent];
    showMessage(`⏰ ¡Tiempo agotado! La respuesta era: ${q.options[q.correct]} -1 vida`, 'error');
    playSound('incorrecto');
    
    setTimeout(() => {
        scienceCurrent++;
        showScienceQuestion();
    }, 2000);
}

function checkScienceAnswerEnhanced(selected, correctIndex) {
    if (scienceTimerInterval) clearInterval(scienceTimerInterval);
    
    const q = currentQuestionSet[scienceCurrent];
    const config = scienceDifficultyConfig[scienceDifficulty];
    let puntosGanados = config.puntosBase;
    
    if (sciencePowerUps.doublePoints) {
        puntosGanados *= 2;
        sciencePowerUps.doublePoints = false;
    }
    
    if (selected === correctIndex) {
        // Respuesta correcta
        scienceCorrectAnswers++;
        scienceStreak++;
        scienceQuestionsAnswered++;
        
        // Bonus por racha
        if (scienceStreak >= 3) {
            const streakBonus = 10;
            puntosGanados += streakBonus;
            showMessage(`🔥 ¡RACHA DE ${scienceStreak}! +${streakBonus} puntos`, 'success');
        }
        
        // Bonus por respuesta rápida
        if (scienceTimeLeft > config.tiempoBase * 0.7) {
            const fastBonus = 5;
            puntosGanados += fastBonus;
            showMessage(`⚡ ¡Respuesta rápida! +${fastBonus} puntos`, 'success');
        }
        
        scienceScore += puntosGanados;
        
        // Actualizar récord
        if (scienceScore > scienceBestScore) {
            scienceBestScore = scienceScore;
            localStorage.setItem('scienceBestScore', scienceBestScore);
        }
        
        showMessage(`✅ ¡Correcto! +${puntosGanados} puntos`, 'success');
        playSound('correcto');
        
        // Efecto visual de celebración
        const questionDiv = document.querySelector('.science-question');
        if (questionDiv) {
            questionDiv.style.animation = 'celebrate 0.3s ease';
            setTimeout(() => {
                questionDiv.style.animation = '';
            }, 300);
        }
    } else {
        // Respuesta incorrecta
        scienceLives--;
        scienceStreak = 0;
        scienceQuestionsAnswered++;
        
        showMessage(`❌ Incorrecto. La respuesta correcta es: ${q.options[q.correct]}<br>📚 ${q.explicacion || '¡Sigue aprendiendo!'} -1 vida`, 'error');
        playSound('incorrecto');
        
        // Efecto de vibración
        const optionsGrid = document.querySelector('.science-options-grid');
        if (optionsGrid) {
            optionsGrid.style.animation = 'shake 0.3s ease';
            setTimeout(() => {
                optionsGrid.style.animation = '';
            }, 300);
        }
    }
    
    setTimeout(() => {
        scienceCurrent++;
        showScienceQuestion();
    }, 2500);
}

function useSciencePowerUp(powerUp) {
    if (sciencePowerUps[powerUp]) {
        showMessage('⚠️ Ya usaste este power-up', 'warning');
        return;
    }
    
    switch(powerUp) {
        case 'doublePoints':
            sciencePowerUps.doublePoints = true;
            showMessage('🎯 ¡Puntos dobles activados para la siguiente pregunta!', 'success');
            break;
        case 'extraTime':
            scienceTimeLeft += 5;
            sciencePowerUps.extraTime = true;
            showMessage('⏰ ¡Tiempo extra! +5 segundos', 'success');
            break;
        case 'fiftyFifty':
            sciencePowerUps.fiftyFifty = true;
            activateFiftyFifty();
            break;
        case 'skipQuestion':
            sciencePowerUps.skipQuestion = true;
            showMessage('⏭️ Pregunta saltada', 'info');
            setTimeout(() => {
                scienceCurrent++;
                showScienceQuestion();
            }, 1000);
            break;
    }
    
    // Actualizar UI
    const container = document.getElementById('scienceQuizContainer');
    if (container && container.innerHTML.includes('powerup')) {
        showScienceQuestion();
    }
}

function activateFiftyFifty() {
    const q = currentQuestionSet[scienceCurrent];
    let options = [...q.options];
    const correctAnswer = options[q.correct];
    
    // Filtrar opciones incorrectas
    let incorrectOptions = options.filter((_, idx) => idx !== q.correct);
    // Mezclar incorrectas
    for (let i = incorrectOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [incorrectOptions[i], incorrectOptions[j]] = [incorrectOptions[j], incorrectOptions[i]];
    }
    // Dejar solo 2 incorrectas aleatorias
    const remainingIncorrect = incorrectOptions.slice(0, 2);
    const finalOptions = [correctAnswer, ...remainingIncorrect];
    
    // Mezclar opciones finales
    for (let i = finalOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [finalOptions[i], finalOptions[j]] = [finalOptions[j], finalOptions[i]];
    }
    
    // Actualizar UI con solo 3 opciones
    const optionsGrid = document.querySelector('.science-options-grid');
    if (optionsGrid) {
        const correctValue = q.options[q.correct];
        const newCorrectIndex = finalOptions.indexOf(correctValue);
        
        optionsGrid.innerHTML = finalOptions.map((opt, idx) => `
            <button class="science-option" onclick="checkScienceAnswerEnhanced(${idx}, ${newCorrectIndex})">
                <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                <span class="option-text">${opt}</span>
            </button>
        `).join('');
        
        showMessage('🔪 ¡50/50 activado! Dos opciones incorrectas eliminadas', 'info');
    }
}

function useJoker() {
    if (jokerUsed) {
        showMessage('🃏 Ya usaste tu joker en esta partida', 'warning');
        return;
    }
    
    jokerUsed = true;
    const randomBonus = Math.floor(Math.random() * 4);
    
    switch(randomBonus) {
        case 0:
            scienceScore += 30;
            showMessage('🃏 ¡JOKER! +30 puntos', 'success');
            break;
        case 1:
            scienceLives++;
            showMessage('🃏 ¡JOKER! +1 vida extra', 'success');
            break;
        case 2:
            if (!sciencePowerUps.doublePoints) {
                sciencePowerUps.doublePoints = true;
                showMessage('🃏 ¡JOKER! Puntos dobles activados', 'success');
            } else {
                scienceScore += 20;
                showMessage('🃏 ¡JOKER! +20 puntos', 'success');
            }
            break;
        case 3:
            scienceTimeLeft += 10;
            showMessage('🃏 ¡JOKER! +10 segundos de tiempo', 'success');
            break;
    }
    
    playSound('correcto');
}

function calculateFinalScore() {
    const config = scienceDifficultyConfig[scienceDifficulty];
    const porcentajeAciertos = (scienceCorrectAnswers / scienceQuestionsAnswered) * 100;
    let bonusAciertos = 0;
    
    if (porcentajeAciertos >= 80) bonusAciertos = 50;
    else if (porcentajeAciertos >= 60) bonusAciertos = 30;
    else if (porcentajeAciertos >= 40) bonusAciertos = 15;
    
    const vidasBonus = scienceLives * 20;
    const totalFinal = scienceScore + bonusAciertos + vidasBonus;
    
    return {
        total: totalFinal,
        bonusAciertos: bonusAciertos,
        vidasBonus: vidasBonus,
        porcentaje: porcentajeAciertos
    };
}

function handleVictory(finalScore) {
    const container = document.getElementById('scienceQuizContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="victory-science">
            <div class="victory-animation">🏆✨ ¡CIENTÍFICO EXCELENTE! ✨🏆</div>
            <div class="score-breakdown">
                <p>📊 Puntuación final: ${scienceScore}</p>
                <p>🎯 Aciertos: ${scienceCorrectAnswers}/${scienceQuestionsAnswered} (${Math.round(finalScore.porcentaje)}%)</p>
                <p>🎁 Bonus por precisión: +${finalScore.bonusAciertos}</p>
                <p>❤️ Bonus por vidas restantes: +${finalScore.vidasBonus}</p>
                <p>⭐ TOTAL: ${finalScore.total} puntos ⭐</p>
                <p>🏆 Mejor puntuación: ${scienceBestScore}</p>
            </div>
            <div class="victory-buttons">
                <button class="game-btn" onclick="resetScienceQuiz()">🔄 Jugar de nuevo</button>
                <button class="game-btn" onclick="shareScienceScore()">📤 Compartir puntuación</button>
            </div>
        </div>
    `;
    
    addPoints(finalScore.total, `Completaste el Quiz de Ciencias - ${scienceCorrectAnswers}/${scienceQuestionsAnswered} aciertos`);
    playSound('win');
}

function handleGameOver(finalScore) {
    const container = document.getElementById('scienceQuizContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="gameover-science">
            <div class="gameover-animation">💀 ¡GAME OVER! 💀</div>
            <div class="score-breakdown">
                <p>📊 Puntuación final: ${scienceScore}</p>
                <p>🎯 Aciertos: ${scienceCorrectAnswers}/${scienceQuestionsAnswered}</p>
                <p>⭐ TOTAL: ${finalScore.total} puntos ⭐</p>
            </div>
            <button class="game-btn" onclick="resetScienceQuiz()">🔄 Intentar de nuevo</button>
        </div>
    `;
    playSound('gameover');
}

function setScienceDifficulty(difficulty) {
    scienceDifficulty = difficulty;
    resetScienceQuiz();
}

function setScienceCategory(category) {
    scienceCategory = category;
    resetScienceQuiz();
}

function resetScienceQuiz() {
    currentQuestionSet = [];
    startScienceQuiz();
}

function shareScienceScore() {
    const message = `¡Acabo de obtener ${scienceScore} puntos en el Quiz de Ciencias! 🎓🔬 ¿Puedes superarme?`;
    if (navigator.share) {
        navigator.share({ title: 'Mi puntuación en Ciencias', text: message });
    } else {
        navigator.clipboard.writeText(message);
        showMessage('📋 ¡Puntuación copiada al portapapeles!', 'success');
    }
}

function showMessage(message, type) {
    const feedbackDiv = document.getElementById('scienceFeedback');
    if (!feedbackDiv) return;
    
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196F3'
    };
    
    feedbackDiv.innerHTML = `<div style="color: ${colors[type]}; padding: 12px; border-radius: 10px; background: rgba(0,0,0,0.1); animation: slideIn 0.3s ease;">${message}</div>`;
    
    setTimeout(() => {
        if (feedbackDiv.innerHTML === `<div style="color: ${colors[type]}; padding: 12px; border-radius: 10px; background: rgba(0,0,0,0.1); animation: slideIn 0.3s ease;">${message}</div>`) {
            feedbackDiv.innerHTML = '';
        }
    }, 3000);
}

// Añadir estilos CSS
const scienceStyles = `
    .science-quiz-enhanced {
        background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
        padding: 25px;
        border-radius: 25px;
        color: white;
    }
    
    .difficulty-buttons {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
        flex-wrap: wrap;
    }
    
    .diff-science-btn {
        padding: 8px 20px;
        border: 2px solid white;
        background: transparent;
        color: white;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .diff-science-btn.active {
        background: #ffd700;
        color: #333;
        border-color: #ffd700;
    }
    
    .science-category-select {
        padding: 8px 15px;
        border-radius: 25px;
        background: rgba(255,255,255,0.2);
        color: white;
        border: 2px solid white;
        cursor: pointer;
        margin-bottom: 15px;
    }
    
    .quiz-stats {
        display: flex;
        justify-content: space-around;
        background: rgba(0,0,0,0.3);
        padding: 12px;
        border-radius: 15px;
        margin: 15px 0;
        flex-wrap: wrap;
        gap: 15px;
    }
    
    .stat-item {
        font-weight: bold;
    }
    
    .timer-stat {
        min-width: 120px;
    }
    
    .timer-bar {
        width: 100px;
        height: 5px;
        background: rgba(255,255,255,0.3);
        border-radius: 5px;
        overflow: hidden;
        margin-top: 5px;
    }
    
    .timer-progress {
        height: 100%;
        background: #4CAF50;
        transition: width 1s linear;
    }
    
    .science-question {
        background: rgba(255,255,255,0.1);
        padding: 20px;
        border-radius: 15px;
        margin: 20px 0;
        display: flex;
        align-items: center;
        gap: 15px;
        text-align: center;
        justify-content: center;
    }
    
    .question-icon {
        font-size: 2rem;
    }
    
    .science-question h3 {
        margin: 0;
        font-size: 1.3rem;
    }
    
    .science-options-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
        margin: 20px 0;
    }
    
    .science-option {
        background: rgba(255,255,255,0.15);
        border: 2px solid rgba(255,255,255,0.3);
        padding: 15px;
        border-radius: 15px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 12px;
        transition: all 0.3s ease;
        color: white;
        font-size: 1rem;
    }
    
    .science-option:hover {
        background: rgba(255,255,255,0.3);
        transform: translateX(5px);
    }
    
    .option-letter {
        background: #ffd700;
        color: #333;
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-weight: bold;
    }
    
    .science-powerups {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
        margin: 20px 0;
    }
    
    .powerup {
        padding: 8px 15px;
        background: rgba(255,215,0,0.2);
        border: 2px solid #ffd700;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        color: white;
    }
    
    .powerup:hover:not(.used) {
        background: rgba(255,215,0,0.4);
        transform: translateY(-2px);
    }
    
    .powerup.used {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .powerup.joker {
        background: rgba(156,39,176,0.3);
        border-color: #9c27b0;
    }
    
    .quiz-progress {
        text-align: center;
        margin-top: 20px;
    }
    
    .progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(255,255,255,0.2);
        border-radius: 10px;
        overflow: hidden;
        margin-top: 8px;
    }
    
    .progress-fill {
        height: 100%;
        background: #4CAF50;
        transition: width 0.3s ease;
    }
    
    .daily-bonus-screen {
        text-align: center;
        padding: 30px;
        background: rgba(0,0,0,0.3);
        border-radius: 20px;
    }
    
    .bonus-animation {
        font-size: 1.5rem;
        margin-bottom: 20px;
        animation: pulse 0.5s ease;
    }
    
    .bonus-options {
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
        margin: 20px 0;
    }
    
    .victory-science, .gameover-science {
        text-align: center;
        padding: 30px;
    }
    
    .score-breakdown {
        background: rgba(0,0,0,0.3);
        padding: 20px;
        border-radius: 15px;
        margin: 20px 0;
    }
    
    @keyframes celebrate {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); background: rgba(76,175,80,0.3); }
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;

if (!document.querySelector('#scienceStyles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'scienceStyles';
    styleSheet.textContent = scienceStyles;
    document.head.appendChild(styleSheet);
}





































// ========== NAVEGACIÓN ENTRE JUEGOS ==========
window.showGame = function(id) {
    document.querySelectorAll('.game-area').forEach(area => area.classList.remove('active'));
    const selectedArea = document.getElementById(id);
    if (selectedArea) selectedArea.classList.add('active');
    
    // Inicializar el juego seleccionado
    switch(id) {
        case 'mathQuiz':
            startMathQuiz();
            break;
        case 'dragDropNumbers':
            initDragDropNumbers();
            break;
        case 'memoryGame':
            initMemoryGame();
            break;
        case 'sentenceDrag':
            initSentenceDragDrop();
            break;
        case 'classifyAnimals':
            initAnimalClassification();
            break;
        case 'wordSearch':
            if (typeof initWordSearch === 'function') initWordSearch();
            break;
        case 'hangman':
            initHangman();
            break;
        case 'scienceQuiz':
            startScienceQuiz();
            break;
    }
};

// ========== INICIALIZACIÓN AL CARGAR ==========
window.onload = () => {
    startMathQuiz();
    initMemoryGame();
    if (typeof initWordSearch === 'function') initWordSearch();
    initHangman();
    startScienceQuiz();
};