        // ----------------------------------------------------------------------
        // 1. EFECTOS UI (Navbar, Scroll Animations)
        // ----------------------------------------------------------------------
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Animación al hacer scroll
            const elements = document.querySelectorAll('.fade-in-up');
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight - 50) {
                    el.style.animationPlayState = 'running';
                    el.style.opacity = '1';
                }
            });
        });
        // ----------------------------------------------------------------------
        // 2. CURIOSIDADES DEL DÍA
        // ----------------------------------------------------------------------
        const curiositiesList = [
            "Los pulpos tienen tres corazones y su sangre es azul.",
            "Las abejas se comunican en una danza especial para decir dónde están las flores.",
            "Un día en Venus dura más que un año en Venus.",
            "El hueso más pequeño del cuerpo humano está en el oído y se llama estribo.",
            "El ADN de una célula estirado mide unos 2 metros.",
            "Las mariposas saborean con sus patas.",
            "Los árboles hablan entre sí con hongos en las raíces.",
            "El cero fue inventado en la India.",
            "El Sol podría albergar más de un millón de Tierras adentro.",
            "La Tierra no es una esfera perfecta, está un poco achatada en los polos.",
            "Los animales que caminan en cuatro patas se llaman cuadrúpedos.",
            "El corazón de un bebé late a más de 120 pulsaciones por minuto.",
            "Las plantas usan luz del sol para crear comida: fotosíntesis.",
            "Un rayo eléctrico puede ser cinco veces más caliente que la superficie del sol.",
            "El sonido viaja más rápido en agua que en aire.",
            "La Luna ya no se está formando; se aleja unos 4 cm cada año.",
            "Los dinosaurios vivieron hace más de 65 millones de años.",
            "Los canguros no pueden caminar hacia atrás.",
            "La luz tarda unos 8 minutos en viajar del Sol a la Tierra.",
            "Las tortugas pueden respirar a través de su cola "
        ];

        let curiosityQueue = [];
        let currentCuriosityIndex = 0;
        let curiosityIntervalId = null;

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function ensureCuriosityQueue() {
            if (curiosityQueue.length === 0) {
                curiosityQueue = shuffleArray([...curiositiesList]);
                currentCuriosityIndex = 0;
            }
        }

        function getNextCuriosity() {
            ensureCuriosityQueue();
            const next = curiosityQueue[currentCuriosityIndex];
            currentCuriosityIndex++;
            if (currentCuriosityIndex >= curiosityQueue.length) {
                curiosityQueue = [];
            }
            return next;
        }

        function showCuriosity(text) {
            const textElement = document.getElementById('curiosityText');
            textElement.style.transition = 'all 0.8s ease';
            textElement.style.opacity = '0';
            textElement.style.transform = 'scale(0.95)';

            setTimeout(() => {
                textElement.innerText = `"${text}"`;
                textElement.style.opacity = '1';
                textElement.style.transform = 'scale(1)';
            }, 700);
        }

        function generateCuriosity() {
            const seleccion = getNextCuriosity();
            showCuriosity(seleccion);
        }

        function startCuriosityCycle() {
            if (curiosityIntervalId) clearInterval(curiosityIntervalId);
            generateCuriosity();
            curiosityIntervalId = setInterval(() => {
                generateCuriosity();
            }, 7000);
        }

        function checkQuiz(answer) {
            const result = document.getElementById('quizResult');
            const correctAnswers = {
                1: 'Mercurio',
                2: 'Corazón',
                3: 'Fotosíntesis'
            };

            // Determine question by answer set
            let feedback = '¡Buena idea! Intenta otra vez.';

            if (answer === 'Mercurio') feedback = '¡Correcto! Mercurio está más cerca del Sol.';
            if (answer === 'Corazón') feedback = '¡Correcto! El corazón bombea sangre.';
            if (answer === 'Fotosíntesis') feedback = '¡Correcto! Las plantas hacen su comida con la luz del sol.';
            if (answer === 'Venus' || answer === 'Tierra' || answer === 'Pulmones' || answer === 'Hígado' || answer === 'Evaporación' || answer === 'Condensación') {
                feedback = 'Casi. Vuelve a intentarlo y recuerda lo aprendido.';
            }

            result.innerText = feedback;
            result.style.color = feedback.startsWith('¡Correcto') ? '#196f3d' : '#8b1a1a';
        }

        // ----------------------------------------------------------------------
        // 3. INICIALIZACIÓN GENERAL
        // ----------------------------------------------------------------------
        window.onload = () => {
            initMathGame(); // Iniciar primer juego por defecto
            startCuriosityCycle();
        };

        // Soporte tecla enter en input math y words
        document.getElementById('mathAnswer').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') checkMath();
        });
        document.getElementById('wordAnswer').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') checkWord();
        });