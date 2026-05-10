// ========== JUEGO QUIZ MATEMÁTICAS ==========
let mathQuizInterval = null;
function startMathQuiz() {
    const container = document.getElementById('mathQuizContainer');
    if (!container) return;
    let currentQuestion = 0;
    let score = 0;
    const questions = [
        { text: "5 + 3 = ?", options: ["6", "7", "8", "9"], correct: 2 },
        { text: "12 - 4 = ?", options: ["6", "7", "8", "9"], correct: 2 },
        { text: "4 × 3 = ?", options: ["10", "11", "12", "14"], correct: 2 },
        { text: "¿Cuántos minutos hay en una hora?", options: ["30", "45", "60", "90"], correct: 2 }
    ];
    let timeLeft = 10;
    let timerInterval;

    function showQuestion() {
        if (currentQuestion >= questions.length) {
            clearInterval(timerInterval);
            container.innerHTML = `<div class="game-feedback">¡Terminaste! Puntaje: ${score}/${questions.length} <br> ${score === questions.length ? '🏆 Perfecto' : 'Sigue practicando'}</div>`;
            if (score > 0) addPoints(score * 10, `Ganaste ${score*10} puntos en el quiz`);
            return;
        }
        const q = questions[currentQuestion];
        timeLeft = 10;
        let html = `<div class="quiz-question">${q.text}</div><div>Tiempo: <span id="quizTimer">${timeLeft}</span> seg</div><div class="quiz-options">`;
        q.options.forEach((opt, idx) => {
            html += `<button class="quiz-option" onclick="checkMathQuizAnswer(${idx})">${opt}</button>`;
        });
        html += `</div><div id="quizFeedback"></div>`;
        container.innerHTML = html;
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            const timerSpan = document.getElementById('quizTimer');
            if (timerSpan) timerSpan.innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                document.getElementById('quizFeedback').innerHTML = '<span style="color:red">¡Tiempo agotado!</span>';
                setTimeout(() => { currentQuestion++; showQuestion(); }, 1500);
            }
        }, 1000);
        window.currentQuizAnswer = q.correct;
    }
    window.checkMathQuizAnswer = (selected) => {
        if (selected === window.currentQuizAnswer) {
            score++;
            document.getElementById('quizFeedback').innerHTML = '<span style="color:green">✅ Correcto</span>';
            playSound('correcto');
        } else {
            document.getElementById('quizFeedback').innerHTML = '<span style="color:red">❌ Incorrecto</span>';
            playSound('incorrecto');
        }
        clearInterval(timerInterval);
        setTimeout(() => { currentQuestion++; showQuestion(); }, 1200);
    };
    showQuestion();
}

// ========== DRAG & DROP NÚMEROS ==========
function initDragDropNumbers() {
    const container = document.getElementById('dragDropNumbers');
    if (!container) return;
    container.innerHTML = `
        <div class="drag-container">
            <div class="drag-item" draggable="true" data-value="5">5</div>
            <div class="drag-item" draggable="true" data-value="3">3</div>
            <div class="drag-item" draggable="true" data-value="8">8</div>
            <div class="drag-item" draggable="true" data-value="2">2</div>
        </div>
        <div class="drop-zone" data-expected="8">Coloca aquí los números que sumen 8</div>
        <div id="dragDropResult"></div>
    `;
    let draggedValue = null;
    document.querySelectorAll('.drag-item').forEach(item => {
        item.addEventListener('dragstart', e => {
            draggedValue = e.target.getAttribute('data-value');
            e.dataTransfer.setData('text/plain', draggedValue);
        });
    });
    const dropZone = document.querySelector('.drop-zone');
    dropZone.addEventListener('dragover', e => e.preventDefault());
    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        const val = parseInt(draggedValue);
        const currentSum = parseInt(dropZone.getAttribute('data-sum') || '0');
        const newSum = currentSum + val;
        dropZone.setAttribute('data-sum', newSum);
        dropZone.innerHTML = `Suma parcial: ${newSum} <br> (sigue arrastrando)`;
        if (newSum === 8) {
            dropZone.style.background = '#c8e6c9';
            document.getElementById('dragDropResult').innerHTML = '<span style="color:green">🎉 ¡Correcto! Has sumado 8. +15 puntos.</span>';
            addPoints(15, '+15 puntos por resolver la suma');
            setTimeout(() => initDragDropNumbers(), 2000);
        } else if (newSum > 8) {
            dropZone.style.background = '#ffcdd2';
            document.getElementById('dragDropResult').innerHTML = '<span style="color:red">Te pasaste de 8. Reinicia el juego.</span>';
            playSound('incorrecto');
            setTimeout(() => initDragDropNumbers(), 1500);
        } else {
            playSound('correcto');
        }
    });
}

// ========== FORMAR ORACIONES ==========
function initSentenceDragDrop() {
    const area = document.getElementById('sentenceDragArea');
    if (!area) return;
    const palabras = ["El", "gato", "come", "pescado", "La", "niña", "lee", "libro"];
    area.innerHTML = `<div class="drag-container" id="wordBank">${palabras.map(p => `<div class="drag-item" draggable="true">${p}</div>`).join('')}</div>
                      <div class="drop-zone" id="sentenceDropZone" style="min-height:100px;">Arrastra aquí para formar la oración</div>
                      <button id="checkSentenceBtn" class="btn-card">Revisar oración</button>
                      <div id="sentenceResult"></div>`;
    let droppedWords = [];
    const dropZone = document.getElementById('sentenceDropZone');
    document.querySelectorAll('.drag-item').forEach(drag => {
        drag.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', drag.innerText));
    });
    dropZone.addEventListener('dragover', e => e.preventDefault());
    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        const word = e.dataTransfer.getData('text/plain');
        droppedWords.push(word);
        dropZone.innerHTML = droppedWords.join(' ') + ' █';
    });
    document.getElementById('checkSentenceBtn').onclick = () => {
        const sentence = droppedWords.join(' ');
        if (sentence === "El gato come pescado" || sentence === "La niña lee libro") {
            dropZone.style.background = '#c8e6c9';
            document.getElementById('sentenceResult').innerHTML = '¡Excelente oración! +20 puntos';
            addPoints(20);
        } else {
            dropZone.style.background = '#ffcdd2';
            document.getElementById('sentenceResult').innerHTML = 'Intenta formar otra oración con sentido';
            playSound('incorrecto');
        }
        setTimeout(() => initSentenceDragDrop(), 2000);
    };
}

// ========== CLASIFICACIÓN DE ANIMALES ==========
function initAnimalClassification() {
    const container = document.getElementById('animalClassify');
    if (!container) return;
    const animales = ["León", "Águila", "Ballena", "Salamandra", "Tiburón"];
    container.innerHTML = `
        <p>Arrastra cada animal al grupo correcto:</p>
        <div class="drag-container">${animales.map(a => `<div class="drag-item" draggable="true">${a}</div>`).join('')}</div>
        <div style="display:flex; gap:20px; justify-content:center; flex-wrap:wrap;">
            <div class="drop-zone" data-group="mamifero">🐘 Mamíferos</div>
            <div class="drop-zone" data-group="ave">🦅 Aves</div>
            <div class="drop-zone" data-group="pez">🐟 Peces</div>
            <div class="drop-zone" data-group="anfibio">🐸 Anfibios</div>
        </div>
        <div id="classifyResult"></div>
    `;
    const correctMap = { León: "mamifero", Águila: "ave", Ballena: "mamifero", Salamandra: "anfibio", Tiburón: "pez" };
    let scoreClassify = 0;
    document.querySelectorAll('.drag-item').forEach(drag => {
        drag.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', drag.innerText));
    });
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.addEventListener('dragover', e => e.preventDefault());
        zone.addEventListener('drop', e => {
            e.preventDefault();
            const animal = e.dataTransfer.getData('text/plain');
            const group = zone.getAttribute('data-group');
            if (correctMap[animal] === group) {
                zone.style.background = '#c8e6c9';
                scoreClassify++;
                document.getElementById('classifyResult').innerHTML = `Bien clasificado! Puntaje: ${scoreClassify}/5`;
                if (scoreClassify === 5) {
                    addPoints(25, '¡Clasificaste todos los animales!');
                    setTimeout(() => initAnimalClassification(), 2500);
                }
                playSound('correcto');
            } else {
                zone.style.background = '#ffcdd2';
                document.getElementById('classifyResult').innerHTML = '¡Ups! Ese animal no pertenece aquí.';
                playSound('incorrecto');
            }
            setTimeout(() => zone.style.background = '', 800);
        });
    });
}

// Inicializar automático si existen los contenedores
if (document.getElementById('mathQuizContainer')) startMathQuiz();
if (document.getElementById('dragDropNumbers')) initDragDropNumbers();
if (document.getElementById('sentenceDragArea')) initSentenceDragDrop();
if (document.getElementById('animalClassify')) initAnimalClassification();

// ========== COMPLETAR OPERACIONES ==========
let currentCompleteQuestion = null;
let completeScore = 0;
let completeQuestions = [
    { text: "3 + ___ = 7", answer: 4, hint: "¿Cuánto falta para llegar a 7?" },
    { text: "___ + 5 = 9", answer: 4, hint: "9 menos 5 es..." },
    { text: "8 - ___ = 3", answer: 5, hint: "8 menos ¿qué número da 3?" },
    { text: "___ - 2 = 6", answer: 8, hint: "6 más 2 es..." },
    { text: "4 × ___ = 12", answer: 3, hint: "¿4 por cuánto es 12?" },
    { text: "___ × 5 = 20", answer: 4, hint: "¿Por cuánto multiplicas 5 para llegar a 20?" }
];
let completeCurrentIndex = 0;

function initCompleteOperation() {
    const container = document.getElementById('completeOperationContainer');
    if (!container) return;
    completeCurrentIndex = 0;
    completeScore = 0;
    showCompleteQuestion();
}

function showCompleteQuestion() {
    const container = document.getElementById('completeOperationContainer');
    if (!container) return;
    
    if (completeCurrentIndex >= completeQuestions.length) {
        let pointsEarned = completeScore * 10;
        container.innerHTML = `
            <div class="game-feedback">
                🎉 ¡Completaste todas las operaciones! 🎉<br>
                Aciertos: ${completeScore}/${completeQuestions.length}<br>
                Ganaste ${pointsEarned} puntos.
            </div>
            <button class="game-btn" onclick="initCompleteOperation()">Jugar de nuevo</button>
        `;
        if (completeScore > 0) {
            addPoints(pointsEarned, `+${pointsEarned} puntos por las operaciones`);
        }
        return;
    }
    
    currentCompleteQuestion = completeQuestions[completeCurrentIndex];
    
    container.innerHTML = `
        <div class="math-problem">${currentCompleteQuestion.text}</div>
        <div class="math-hint" style="color: #888; margin-bottom: 20px;">💡 Pista: ${currentCompleteQuestion.hint}</div>
        <input type="number" id="completeInput" class="math-input" placeholder="?">
        <button class="game-btn" onclick="checkCompleteAnswer()">Comprobar</button>
        <div id="completeFeedback" class="game-feedback"></div>
        <div style="margin-top: 20px;">Pregunta ${completeCurrentIndex + 1} de ${completeQuestions.length}</div>
    `;
    
    const input = document.getElementById('completeInput');
    if (input) input.focus();
}

function checkCompleteAnswer() {
    const input = document.getElementById('completeInput');
    const userAnswer = parseInt(input.value);
    const feedback = document.getElementById('completeFeedback');
    
    if (isNaN(userAnswer)) {
        feedback.innerHTML = '❌ Escribe un número en el espacio.';
        feedback.style.color = 'red';
        playSound('incorrecto');
        return;
    }
    
    if (userAnswer === currentCompleteQuestion.answer) {
        completeScore++;
        feedback.innerHTML = '✅ ¡Correcto! +10 puntos';
        feedback.style.color = 'green';
        playSound('correcto');
        addPoints(10, `+10 puntos: ${currentCompleteQuestion.text} = ${userAnswer}`);
        
        setTimeout(() => {
            completeCurrentIndex++;
            showCompleteQuestion();
        }, 1200);
    } else {
        feedback.innerHTML = `❌ Incorrecto. ${currentCompleteQuestion.text} era ${currentCompleteQuestion.answer}. ¡Sigue intentando!`;
        feedback.style.color = 'red';
        playSound('incorrecto');
        completeCurrentIndex++;
        setTimeout(() => showCompleteQuestion(), 2000);
    }
}

// ========== JUEGO DE MULTIPLICACIÓN ==========
let currentMultiplication = null;
let multiScore = 0;
let multiQuestions = [
    { text: "2 × 3 = ?", answer: 6, options: [4, 5, 6, 7] },
    { text: "2 × 5 = ?", answer: 10, options: [8, 9, 10, 12] },
    { text: "3 × 3 = ?", answer: 9, options: [6, 7, 8, 9] },
    { text: "4 × 2 = ?", answer: 8, options: [6, 7, 8, 10] },
    { text: "5 × 2 = ?", answer: 10, options: [8, 9, 10, 12] },
    { text: "3 × 4 = ?", answer: 12, options: [10, 11, 12, 14] },
    { text: "2 × 8 = ?", answer: 16, options: [14, 15, 16, 18] },
    { text: "4 × 4 = ?", answer: 16, options: [12, 14, 16, 18] }
];
let multiCurrentIndex = 0;

function initMultiplicationGame() {
    const container = document.getElementById('multiplicationGameContainer');
    if (!container) return;
    multiCurrentIndex = 0;
    multiScore = 0;
    showMultiplicationQuestion();
}

function showMultiplicationQuestion() {
    const container = document.getElementById('multiplicationGameContainer');
    if (!container) return;
    
    if (multiCurrentIndex >= multiQuestions.length) {
        let pointsEarned = multiScore * 15;
        container.innerHTML = `
            <div class="game-feedback">
                🎉 ¡Multiplicación completada! 🎉<br>
                Aciertos: ${multiScore}/${multiQuestions.length}<br>
                Ganaste ${pointsEarned} puntos.
            </div>
            <button class="game-btn" onclick="initMultiplicationGame()">Jugar de nuevo</button>
        `;
        if (multiScore > 0) {
            addPoints(pointsEarned, `+${pointsEarned} puntos por multiplicar`);
        }
        return;
    }
    
    currentMultiplication = multiQuestions[multiCurrentIndex];
    
    let optionsHtml = '<div class="quiz-options" style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin: 20px 0;">';
    currentMultiplication.options.forEach((opt, idx) => {
        optionsHtml += `<button class="quiz-option" style="font-size: 2rem; padding: 15px 30px; background: var(--color-1); color: white; border: none; border-radius: 20px; cursor: pointer;" onclick="checkMultiplicationAnswer(${opt})">${opt}</button>`;
    });
    optionsHtml += '</div>';
    
    container.innerHTML = `
        <div class="math-problem" style="font-size: 4rem;">${currentMultiplication.text}</div>
        ${optionsHtml}
        <div id="multiFeedback" class="game-feedback"></div>
        <div style="margin-top: 20px;">Pregunta ${multiCurrentIndex + 1} de ${multiQuestions.length}</div>
    `;
}

function checkMultiplicationAnswer(selected) {
    const feedback = document.getElementById('multiFeedback');
    
    if (selected === currentMultiplication.answer) {
        multiScore++;
        feedback.innerHTML = '✅ ¡Correcto! +15 puntos';
        feedback.style.color = 'green';
        playSound('correcto');
        addPoints(15, `+15 puntos: ${currentMultiplication.text} = ${selected}`);
        
        setTimeout(() => {
            multiCurrentIndex++;
            showMultiplicationQuestion();
        }, 1000);
    } else {
        feedback.innerHTML = `❌ Incorrecto. La respuesta correcta era ${currentMultiplication.answer}. ¡Sigue practicando!`;
        feedback.style.color = 'red';
        playSound('incorrecto');
        multiCurrentIndex++;
        setTimeout(() => showMultiplicationQuestion(), 2000);
    }
}