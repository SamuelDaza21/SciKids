// ----------------------------------------------------------------------
// 1. LABORATORIO CIENCIAS
// ----------------------------------------------------------------------
function abrirlab() {
    const modal = document.getElementById('videoModal');
    const contenedor = document.getElementById('contenedorVideoModal');
    const contenidoCaja = modal.querySelector('.modal-content');

    // 1. Título y Menú de Experimentos
    contenedor.innerHTML = `
        <div class="lab-virtual-header">
            <h2>🧪 Laboratorio de Ciencias</h2>
            <p>Elige un experimento para empezar la aventura:</p>
        </div>
        <div class="lab-grid">
            <div class="lab-item" onclick="verPasos('frijol')">
                <span>🌱</span>
                <p>El Frijol Mágico</p>
            </div>
            <div class="lab-item" onclick="verPasos('insectos')">
                <span>🐜</span>
                <p>Caza Bichitos</p>
            </div>
            <div class="lab-item" onclick="verPasos('agua')">
                <span>🌈</span>
                <p>Arcoíris Líquido</p>
            </div>
        </div>
        <div id="pasos-experimento" class="pasos-container"></div>
    `;

    // 2. Mostrar con tus animaciones
    modal.style.display = "flex";
    modal.style.animation = "fadeIn 0.5s ease forwards";
    contenidoCaja.style.animation = "bounceIn 0.8s ease forwards";
}

// Función para mostrar los pasos de cada experimento
function verPasos(tipo) {
    const zonaPasos = document.getElementById('pasos-experimento');
    let contenido = "";

    if(tipo === 'frijol') {
        contenido = "<h4>🌱 Germinación</h4><ol><li>Pon algodón en un frasco.</li><li>Pon el frijolito.</li><li>Moja un poco el algodón.</li></ol>";
    } else if(tipo === 'insectos') {
        contenido = "<h4>🐜 Observador de Bichos</h4><p>Lleva una lupa al jardín y busca 3 tipos de hormigas diferentes. ¡No las toques, solo observa!</p>";
    } else if(tipo === 'agua') {
        contenido = "<h4>🌈 Arcoíris de Densidad</h4><p>Mezcla agua con mucha azúcar y colorante, luego ve echando capas suaves en un vaso largo.</p>";
    }

    zonaPasos.innerHTML = contenido;
    zonaPasos.style.animation = "fadeInUp 0.5s ease forwards";
}
