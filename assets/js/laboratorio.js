function initGerminationLab() {
    const labDiv = document.getElementById('germinationLab');
    if (!labDiv) return;
    labDiv.innerHTML = `
        <div class="lab-step"><span>🌱 Paso 1: Coloca algodón húmedo en un frasco</span> <button onclick="nextStep(1)">Listo</button></div>
        <div id="step2" style="display:none;">Paso 2: Introduce el frijol y mantenlo húmedo <button onclick="nextStep(2)">Hecho</button></div>
        <div id="step3" style="display:none;">¡Observa! En 3 días aparecerá una raíz. +10 puntos <button onclick="finishGermination()">Completar</button></div>
    `;
    window.nextStep = (step) => {
        if (step === 1) {
            document.getElementById('step2').style.display = 'block';
        } else if (step === 2) {
            document.getElementById('step3').style.display = 'block';
        }
    };
    window.finishGermination = () => {
        addPoints(10, "¡Excelente! Has completado el experimento de germinación");
        labDiv.innerHTML = "<p class='highlight'>🌿 ¡Felicidades! Ahora eres un científico.</p>";
    };
}

function initWaterLab() {
    const waterDiv = document.getElementById('waterLab');
    if (!waterDiv) return;
    waterDiv.innerHTML = `
        <h4>🧊 Estados del agua</h4>
        <div class="drag-container">
            <div class="drag-item" data-estado="solid">Hielo (sólido)</div>
            <div class="drag-item" data-estado="liquid">Agua (líquido)</div>
            <div class="drag-item" data-estado="gas">Vapor (gas)</div>
        </div>
        <div class="drop-zone" data-cambio="derretir">¿Qué cambio convierte hielo en agua?</div>
        <div id="waterResult"></div>
    `;
    document.querySelectorAll('#waterLab .drag-item').forEach(d => {
        d.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', d.getAttribute('data-estado')));
    });
    const dropZone = document.querySelector('#waterLab .drop-zone');
    dropZone.addEventListener('dragover', e => e.preventDefault());
    dropZone.addEventListener('drop', e => {
        const estado = e.dataTransfer.getData('text/plain');
        if (estado === 'solid') {
            dropZone.style.background = '#c8e6c9';
            document.getElementById('waterResult').innerHTML = '✅ Correcto: el hielo se derrite por calor. +15 puntos';
            addPoints(15);
        } else {
            dropZone.style.background = '#ffcdd2';
            document.getElementById('waterResult').innerHTML = '❌ No es correcto. El hielo (sólido) se derrite.';
            playSound('incorrecto');
        }
    });
}

if (document.getElementById('germinationLab')) initGerminationLab();
if (document.getElementById('waterLab')) initWaterLab();