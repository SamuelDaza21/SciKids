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

        // Soporte tecla enter en input math y words
        document.getElementById('mathAnswer').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') checkMath();
        });
        document.getElementById('wordAnswer').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') checkWord();
        });