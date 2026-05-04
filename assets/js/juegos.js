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