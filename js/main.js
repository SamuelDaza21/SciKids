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
        // 2B. CURIOSIDADES DE ESPAÑOL (NUEVO)
        // ----------------------------------------------------------------------
        /**
         * Sistema de curiosidades para la sección de español.
         * Muestra curiosidades aleatorias con efecto fade in/out, sin repeticiones, duración 7s.
         * Uso: generateCuriosityEsp()
         */
        const curiositiesEspList = [
            "La palabra más larga en español es 'anticonstitucionalmente'.",
            "El español es el segundo idioma más hablado del mundo por número de hablantes nativos.",
            "La letra 'ñ' solo existe en el español y algunos idiomas derivados.",
            "La Real Academia Española fue fundada en 1713.",
            "El primer libro impreso en español fue 'La Gramática de Nebrija' en 1492.",
            "La tilde puede cambiar el significado: 'sí' (afirmación) y 'si' (condición).",
            "El español tiene más de 100,000 palabras registradas.",
            "La palabra 'murciélago' contiene todas las vocales.",
            "El poema más corto en español es 'Yo' de Octavio Paz.",
            "La palabra 'reloj' no tiene plural.",
            "El abecedario español tiene 27 letras.",
            "La palabra 'ojalá' viene del árabe y significa 'si Dios quiere'.",
            "El español se habla en más de 20 países.",
            "La palabra 'quiosco' viene del persa.",
            "El verbo más usado es 'ser'.",
            "La palabra 'sol' es femenina en español.",
            "El español tiene palabras que no existen en otros idiomas, como 'estrenar'.",
            "La palabra 'café' viene del árabe 'qahwa'.",
            "El español tiene muchos sinónimos para 'feliz': alegre, contento, dichoso, risueño.",
            "La palabra 'caligrafía' significa 'escritura bella'.",
            "En español, los signos de exclamación e interrogación se ponen al inicio y al final: ¡Hola! ¿Cómo estás?",
            "La palabra 'literatura' viene del latín 'littera', que significa letra.",
            "El español tiene palabras con doble significado, como 'banco' (asiento o entidad financiera).",
            "La palabra 'gramática' viene del griego 'gramma', que significa letra o escrito."
        ];

        let curiositiesEspUsed = [];
        let curiosityEspTimeout = null;

        function generateCuriosityEsp() {
            const textElement = document.getElementById('curiosityTextEsp');
            // Fade out
            textElement.style.opacity = '0';
            textElement.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                // Elegir curiosidad no repetida
                if (curiositiesEspUsed.length === curiositiesEspList.length) {
                    curiositiesEspUsed = [];
                }
                let randomIndex;
                do {
                    randomIndex = Math.floor(Math.random() * curiositiesEspList.length);
                } while (curiositiesEspUsed.includes(randomIndex));
                curiositiesEspUsed.push(randomIndex);
                const randomFact = curiositiesEspList[randomIndex];
                textElement.innerText = randomFact;
                // Fade in
                textElement.style.opacity = '1';
                textElement.style.transition = 'opacity 1s';
                // Mantener visible 7 segundos
                if (curiosityEspTimeout) clearTimeout(curiosityEspTimeout);
                curiosityEspTimeout = setTimeout(() => {
                    textElement.style.opacity = '0';
                    setTimeout(() => {
                        textElement.innerText = '¡Haz clic en el botón para descubrir una curiosidad sobre el español!';
                        textElement.style.opacity = '1';
                    }, 700);
                }, 7000);
            }, 500);
        }
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

// ----------------------------------------------------------------------
// 4. MINI QUIZ ESPAÑOL (NUEVO)
// ----------------------------------------------------------------------
/**
 * Revisa respuestas del mini quiz de español.
 * Uso: checkMiniQuizEsp()
 */
function checkMiniQuizEsp() {
    const form = document.getElementById('miniQuizEsp');
    const q1 = form.q1.value;
    const q2 = form.q2.value;
    let result = '';
    if (q1 === 'Tomás' && q2 === 'Mariposa') {
        result = '<span style="color:green;font-weight:bold;">¡Correcto! Tomás siguió a la mariposa.</span>';
    } else {
        result = '<span style="color:red;font-weight:bold;">¡Intenta de nuevo! Relee la historia y prueba otra vez.</span>';
    }
    document.getElementById('miniQuizEspResult').innerHTML = result;
}

        // Soporte tecla enter en input math y words
        document.getElementById('mathAnswer').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') checkMath();
        });
        document.getElementById('wordAnswer').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') checkWord();
        });

// ----------------------------------------------------------------------
// 5. VIDEOS INTERACTIVOS DE CIENCIAS
// ----------------------------------------------------------------------

function mostrarVideo(elemento) {
    const rutaVideo = elemento.getAttribute('data-video');
    const modal = document.getElementById('videoModal');
    const contenedor = document.getElementById('contenedorVideoModal');
    const contenidoCaja = modal.querySelector('.modal-content');

    // 1. Inyectamos el video
    contenedor.innerHTML = `
        <video width="100%" controls autoplay>
            <source src="${rutaVideo}" type="video/mp4">
        </video>`;

    // 2. Aplicamos tus animaciones
    modal.style.display = "flex";
    modal.style.animation = "fadeIn 0.5s ease forwards"; // Tu animación de fondo
    contenidoCaja.style.animation = "bounceIn 0.8s ease forwards"; // Tu animación de rebote
}

function cerrarVideo() {
    const modal = document.getElementById('videoModal');
    
    // Animación rápida de salida (opcional, o solo ocultar)
    modal.style.opacity = "0";
    modal.style.transition = "opacity 0.3s ease";

    setTimeout(() => {
        modal.style.display = "none";
        modal.style.opacity = "1"; // Reset para la próxima vez
        document.getElementById('contenedorVideoModal').innerHTML = "";
    }, 300);
}

// ----------------------------------------------------------------------
// 6. TRIVIAS VARIADAS
// ----------------------------------------------------------------------
