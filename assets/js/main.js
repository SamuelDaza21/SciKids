// ==================== SISTEMA DE PUNTAJE GLOBAL ====================
let globalPoints = 0;
const STORAGE_POINTS = 'scikids_global_points';

function loadGlobalScore() {
    const saved = localStorage.getItem(STORAGE_POINTS);
    globalPoints = saved ? parseInt(saved) : 0;
    updateScoreUI();
}
function saveGlobalScore() {
    localStorage.setItem(STORAGE_POINTS, globalPoints);
    updateScoreUI();
}
function addPoints(amount, message = '') {
    globalPoints += amount;
    saveGlobalScore();
    if (message) showToast(message);
    playSound('correcto');
    const scoreSpan = document.getElementById('globalScore');
    if (scoreSpan) {
        scoreSpan.style.transform = 'scale(1.2)';
        setTimeout(() => scoreSpan.style.transform = 'scale(1)', 200);
    }
}
function updateScoreUI() {
    const scoreSpan = document.getElementById('globalScore');
    if (scoreSpan) scoreSpan.innerText = globalPoints;
}
function showToast(msg) {
    let toast = document.querySelector('.toast-message');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-message';
        document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.style.opacity = '1';
    setTimeout(() => toast.style.opacity = '0', 2000);
}

// ==================== SISTEMA DE SONIDOS ====================
let audioCtx = null;
function playSound(type) {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    gain.gain.value = 0.3;
    if (type === 'correcto') {
        osc.frequency.value = 880;
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
    } else {
        osc.frequency.value = 440;
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
    }
}

// ==================== EFECTOS UI ====================
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
    loadGlobalScore();
    const resetBtn = document.getElementById('resetScoreBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            globalPoints = 0;
            saveGlobalScore();
            showToast('Puntaje reiniciado');
        });
    }
    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => el.style.animationPlayState = 'running');
});

window.addPoints = addPoints;
window.playSound = playSound;