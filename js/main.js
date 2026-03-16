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
            "¿Sabías que los pulpos tienen tres corazones y su sangre es de color azul? ¡Son verdaderos extraterrestres del océano!",
            "Las abejas se comunican bailando. Dependiendo de cómo se muevan, le dicen a sus compañeras dónde hay flores.",
            "¡Un día en Venus dura más que un año en Venus! Gira sobre sí mismo muy, muy lento.",
            "El hueso más pequeño del cuerpo humano está en la oreja y se llama 'estribo'. Es del tamaño de un grano de arroz.",
            "Si estiraras todo el ADN de una sola de tus células, mediría unos 2 metros de largo. ¡Increíble!",
            "Las mariposas saborean con sus patas. Al posarse sobre una flor, saben si es deliciosa.",
            "Los árboles se comunican entre sí a través de una red subterránea de hongos llamada micelio.",
            "El número cero (0) fue inventado en la India hace miles de años. Antes de eso, ¡era muy difícil hacer matemáticas grandes!",
            "El Sol es tan grande que cabrían más de un millón de planetas Tierra en su interior."
        ];

        function generateCuriosity() {
            const textElement = document.getElementById('curiosityText');
            // Animación de salida
            textElement.style.opacity = '0';
            textElement.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                const randomFact = curiositiesList[Math.floor(Math.random() * curiositiesList.length)];
                textElement.innerText = `"${randomFact}"`;
                
                // Animación de entrada
                textElement.style.transition = 'all 0.5s ease';
                textElement.style.opacity = '1';
                textElement.style.transform = 'scale(1)';
            }, 300);
        }

        // ----------------------------------------------------------------------
        // 3. INICIALIZACIÓN GENERAL
        // ----------------------------------------------------------------------
        window.onload = () => {
            initMathGame(); // Iniciar primer juego por defecto
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