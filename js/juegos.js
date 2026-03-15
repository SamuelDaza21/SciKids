// ----------------------------------------------------------------------
        // 1. SISTEMA DE TABS PARA JUEGOS
        // ----------------------------------------------------------------------
        function switchGame(gameId, tabElement) {
            // Remover active de todos los tabs y areas
            document.querySelectorAll('.game-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.game-area').forEach(a => a.classList.remove('active'));
            
            // Añadir active al seleccionado
            tabElement.classList.add('active');
            document.getElementById('game-' + gameId).classList.add('active');

            // Inicializar el juego correspondiente si es necesario
            if (gameId === 'math') initMathGame();
            if (gameId === 'memory') initMemoryGame();
            if (gameId === 'words') initWordGame();
            if (gameId === 'quiz') initQuiz();
        }

        // Función para enlaces directos desde las tarjetas
        function openGameTab(gameId) {
            const tabs = document.querySelectorAll('.game-tab');
            let targetTab;
            if (gameId === 'math') targetTab = tabs[0];
            if (gameId === 'memory') targetTab = tabs[1];
            if (gameId === 'words') targetTab = tabs[2];
            if (gameId === 'quiz') targetTab = tabs[3];
            
            if (targetTab) {
                switchGame(gameId, targetTab);
            }
        }

        // ----------------------------------------------------------------------
        // 2. JUEGO 1: SUMAS RÁPIDAS
        // ----------------------------------------------------------------------
        let mathCorrectAnswer = 0;

        function initMathGame() {
            const num1 = Math.floor(Math.random() * 20) + 1;
            const num2 = Math.floor(Math.random() * 20) + 1;
            const operator = Math.random() > 0.5 ? '+' : '-';
            
            // Evitar resultados negativos en restas
            if (operator === '-' && num2 > num1) {
                mathCorrectAnswer = num2 - num1;
                document.getElementById('mathProblem').innerText = `${num2} - ${num1}`;
            } else {
                mathCorrectAnswer = operator === '+' ? num1 + num2 : num1 - num2;
                document.getElementById('mathProblem').innerText = `${num1} ${operator} ${num2}`;
            }

            document.getElementById('mathAnswer').value = '';
            document.getElementById('mathFeedback').innerText = '';
            document.getElementById('mathAnswer').focus();
        }

        function checkMath() {
            const userAnswer = parseInt(document.getElementById('mathAnswer').value);
            const feedback = document.getElementById('mathFeedback');

            if (isNaN(userAnswer)) {
                feedback.innerHTML = '<span style="color:var(--color-4)">¡Escribe un número! ✍️</span>';
                return;
            }

            if (userAnswer === mathCorrectAnswer) {
                feedback.innerHTML = '<span style="color:#22c55e">¡Excelente! Eres un genio 🌟</span>';
                setTimeout(initMathGame, 1500);
            } else {
                feedback.innerHTML = '<span style="color:#ef4444">¡Casi! Inténtalo de nuevo 💪</span>';
            }
        }

        // ----------------------------------------------------------------------
        // 3. JUEGO 2: MEMORIA DE NÚMEROS
        // ----------------------------------------------------------------------
        const numbersArray = ['1', '1', '5', '5', '9', '9', '12', '12', '20', '20', '50', '50'];
        let firstCard = null;
        let secondCard = null;
        let lockBoard = false;
        let matchesFound = 0;

        function initMemoryGame() {
            const grid = document.getElementById('memoryGrid');
            grid.innerHTML = '';
            firstCard = null;
            secondCard = null;
            lockBoard = false;
            matchesFound = 0;

            // Barajar
            const shuffled = numbersArray.sort(() => 0.5 - Math.random());

            shuffled.forEach(num => {
                const card = document.createElement('div');
                card.classList.add('memory-card');
                card.dataset.num = num;
                
                card.innerHTML = `
                    <div class="front"></div>
                    <div class="back" style="color: var(--color-1); font-family: var(--font-headings);">${num}</div>
                `;
                
                card.addEventListener('click', flipCard);
                grid.appendChild(card);
            });
        }

        function flipCard() {
            if (lockBoard) return;
            if (this === firstCard) return;

            this.classList.add('flipped');

            if (!firstCard) {
                firstCard = this;
                return;
            }

            secondCard = this;
            checkForMatch();
        }

        function checkForMatch() {
            let isMatch = firstCard.dataset.num === secondCard.dataset.num;

            if (isMatch) {
                disableCards();
                matchesFound += 2;
                if (matchesFound === numbersArray.length) {
                    setTimeout(() => {
                        alert('¡Felicidades! Encontraste todas las parejas. 🎉');
                        initMemoryGame();
                    }, 500);
                }
            } else {
                unflipCards();
            }
        }

        function disableCards() {
            firstCard.removeEventListener('click', flipCard);
            secondCard.removeEventListener('click', flipCard);
            
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');

            resetBoard();
        }

        function unflipCards() {
            lockBoard = true;
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                resetBoard();
            }, 1000);
        }

        function resetBoard() {
            [firstCard, secondCard, lockBoard] = [null, null, false];
        }

        // ----------------------------------------------------------------------
        // 4. JUEGO 3: ORDENAR PALABRAS
        // ----------------------------------------------------------------------
        const words = [
            { word: "PLANETA", hint: "Vivimos en el... Tierra" },
            { word: "AGUA", hint: "Líquido vital que bebemos" },
            { word: "LIBRO", hint: "Tiene hojas pero no es un árbol" },
            { word: "CIENCIA", hint: "Estudia el mundo y hace experimentos" },
            { word: "HONGOS", hint: "No son plantas ni animales, reino Fungi" }
        ];

        let currentWordObj;

        function initWordGame() {
            currentWordObj = words[Math.floor(Math.random() * words.length)];
            
            // Desordenar palabra
            let scrambled = currentWordObj.word.split('').sort(() => 0.5 - Math.random()).join('');
            // Asegurar que no quede igual
            while(scrambled === currentWordObj.word) {
                scrambled = currentWordObj.word.split('').sort(() => 0.5 - Math.random()).join('');
            }

            document.getElementById('wordScramble').innerText = scrambled;
            document.getElementById('wordHint').innerText = "Pista: " + currentWordObj.hint;
            document.getElementById('wordAnswer').value = '';
            document.getElementById('wordFeedback').innerText = '';
        }

        function checkWord() {
            const answer = document.getElementById('wordAnswer').value.trim().toUpperCase();
            const feedback = document.getElementById('wordFeedback');

            if (answer === currentWordObj.word) {
                feedback.innerHTML = '<span style="color:#22c55e">¡Correcto! Eres muy inteligente 🏆</span>';
                setTimeout(initWordGame, 2000);
            } else {
                feedback.innerHTML = '<span style="color:#ef4444">Mmm... esa no es. Sigue intentando 🧩</span>';
            }
        }

        // ----------------------------------------------------------------------
        // 5. JUEGO 4: TEST DE CIENCIAS
        // ----------------------------------------------------------------------
        const quizData = [
            {
                question: "¿Qué necesitan las plantas para hacer su comida?",
                options: ["Leche y galletas", "Sol, agua y aire", "Solo tierra", "Electricidad"],
                correct: 1
            },
            {
                question: "¿Cuál de estos animales es un mamífero?",
                options: ["Tiburón", "Águila", "Ballena", "Rana"],
                correct: 2
            },
            {
                question: "El agua congelada se convierte en...",
                options: ["Vapor", "Hielo", "Lluvia", "Nieve caliente"],
                correct: 1
            },
            {
                question: "¿Cuál es el satélite natural de la Tierra?",
                options: ["El Sol", "Marte", "La Luna", "Las estrellas"],
                correct: 2
            }
        ];

        let currentQuiz = 0;

        function initQuiz() {
            currentQuiz = 0;
            loadQuizQuestion();
        }

        function loadQuizQuestion() {
            const q = quizData[currentQuiz];
            document.getElementById('quizQuestion').innerText = q.question;
            const optionsContainer = document.getElementById('quizOptions');
            optionsContainer.innerHTML = '';
            
            document.getElementById('quizFeedback').innerHTML = '';
            document.getElementById('nextQuizBtn').style.display = 'none';

            q.options.forEach((opt, index) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option';
                btn.innerText = opt;
                btn.onclick = () => checkQuizAnswer(index, btn);
                optionsContainer.appendChild(btn);
            });
        }

        function checkQuizAnswer(selectedIndex, btnElement) {
            const correctIndex = quizData[currentQuiz].correct;
            const options = document.querySelectorAll('.quiz-option');
            
            // Deshabilitar botones
            options.forEach(opt => opt.style.pointerEvents = 'none');

            if (selectedIndex === correctIndex) {
                btnElement.classList.add('correct');
                document.getElementById('quizFeedback').innerHTML = '<span style="color:#22c55e">¡Súper! Respuesta correcta 🌠</span>';
            } else {
                btnElement.classList.add('wrong');
                options[correctIndex].classList.add('correct');
                document.getElementById('quizFeedback').innerHTML = '<span style="color:#ef4444">¡Uy! La respuesta correcta era la verde.</span>';
            }

            document.getElementById('nextQuizBtn').style.display = 'inline-block';
        }

        function loadNextQuiz() {
            currentQuiz++;
            if (currentQuiz < quizData.length) {
                loadQuizQuestion();
            } else {
                document.getElementById('quizQuestion').innerText = "¡Has completado el test!";
                document.getElementById('quizOptions').innerHTML = '';
                document.getElementById('quizFeedback').innerHTML = '<span style="color:var(--color-1)">¡Eres un pequeño científico experto! 🎓</span>';
                document.getElementById('nextQuizBtn').innerText = "Jugar de nuevo";
                document.getElementById('nextQuizBtn').onclick = initQuiz;
            }
        }