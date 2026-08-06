<p align="center">
  <img src="https://raw.githubusercontent.com/SamuelDaza21/SciKids/main/img/Scikids.png" width="160" alt="Logo SciKids"/>
</p>

<h1 align="center">🚀 SciKids</h1>
<p align="center"><b>Plataforma educativa interactiva para niños de 0 a 5° de primaria</b></p>
<p align="center">
  <img src="https://img.shields.io/badge/-HTML5-1b212c?style=flat&logo=html5&logoColor=d4a84b&labelColor=1b212c" alt="HTML5"/>
  <img src="https://img.shields.io/badge/-CSS3-1b212c?style=flat&logo=css3&logoColor=d4a84b&labelColor=1b212c" alt="CSS3"/>
  <img src="https://img.shields.io/badge/-JavaScript-1b212c?style=flat&logo=javascript&logoColor=d4a84b&labelColor=1b212c" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/-PWA-1b212c?style=flat&logo=pwa&logoColor=d4a84b&labelColor=1b212c" alt="PWA"/>
  <img src="https://img.shields.io/badge/-GitHub%20Pages-1b212c?style=flat&logo=github&logoColor=d4a84b&labelColor=1b212c" alt="GitHub Pages"/>
</p>

<style>
  @keyframes skFadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  .sk-card { background: #161b22; border: 1px solid #21262d; border-radius: 14px; padding: 20px 24px; animation: skFadeUp 0.6s ease both; }
  .sk-card:hover { border-color: #d4a84b; transform: translateY(-3px); box-shadow: 0 10px 30px -12px rgba(212,168,75,0.25); transition: all 0.3s ease; }
  .sk-title { color: #d4a84b; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; font-weight: 600; }
  .sk-btn { display: inline-block; padding: 8px 18px; margin: 4px 8px 4px 0; border-radius: 8px; border: 1px solid #d4a84b; color: #d4a84b; text-decoration: none; font-size: 14px; transition: all 0.25s ease; }
  .sk-btn:hover { background: #d4a84b; color: #0d1117; box-shadow: 0 0 18px -3px rgba(212,168,75,0.5); }
  .sk-tag { display: inline-block; background: #1b212c; color: #9da7b3; font-size: 12px; padding: 3px 11px; border-radius: 20px; margin: 2px 4px 2px 0; }
</style>

---

<div class="sk-card">
  <div class="sk-title">Sobre el proyecto</div>
  <p style="margin-top: 10px; color: #e6edf3; font-size: 14px; line-height: 1.7">
    Plataforma educativa que enseña diferentes temas mediante <b style="color:#d4a84b">teoría sencilla, ilustraciones, videos, juegos interactivos, mini quizzes y curiosidades científicas</b>.
    Desarrollada solo con tecnologías web básicas y pensada para funcionar de forma <b style="color:#d4a84b">100% local</b>, sin depender de internet.
  </p>
</div>

<br/>

<div class="sk-card" style="animation-delay: 0.1s">
  <div class="sk-title">Áreas de aprendizaje</div>
  <ul style="color: #e6edf3; font-size: 14px; line-height: 1.9; margin-top: 8px; padding-left: 20px">
    <li>➕ <b style="color:#d4a84b">Matemáticas</b>: números, operaciones y problemas divertidos</li>
    <li>📖 <b style="color:#d4a84b">Español</b>: lectura, vocabulario y escritura</li>
    <li>🍃 <b style="color:#d4a84b">Ciencias</b>: experimentos y laboratorios virtuales (agua, insectos, germinación, clasificación de animales)</li>
    <li>🎮 <b style="color:#d4a84b">Juegos</b>: retos y minijuegos para reforzar lo aprendido</li>
  </ul>
</div>

<br/>

<div class="sk-card" style="animation-delay: 0.2s">
  <div class="sk-title">Características</div>
  <ul style="color: #e6edf3; font-size: 14px; line-height: 1.9; margin-top: 8px; padding-left: 20px">
    <li>📦 Funciona <b style="color:#d4a84b">sin conexión a internet</b> (PWA con service worker)</li>
    <li>🔍 Buscador integrado de contenido</li>
    <li>🎨 Diseño animado y amigable para niños</li>
    <li>🧪 Laboratorios de ciencias interactivos</li>
  </ul>
</div>

<br/>

<div class="sk-card" style="animation-delay: 0.3s">
  <div class="sk-title">Tecnologías</div>
  <p style="margin-top: 12px">
    <span class="sk-tag">HTML5</span><span class="sk-tag">CSS3</span><span class="sk-tag">JavaScript</span><span class="sk-tag">PWA / Service Worker</span><span class="sk-tag">Font Awesome</span><span class="sk-tag">GitHub Pages</span>
  </p>
</div>

<br/>

<div class="sk-card" style="animation-delay: 0.4s">
  <div class="sk-title">Ver en vivo</div>
  <p style="margin-top: 14px">
    <a class="sk-btn" href="https://samueldaza21.github.io/SciKids/">🌐 Abrir SciKids</a>
    <a class="sk-btn" href="https://samueldaza21.github.io/SciKids/ciencias.html">🧪 Ir a Ciencias</a>
    <a class="sk-btn" href="https://github.com/SamuelDaza21/SciKids">📦 Repositorio</a>
  </p>
</div>

<br/>

<div class="sk-card" style="animation-delay: 0.5s">
  <div class="sk-title">Estructura</div>
  <pre style="background:#0d1117; border:1px solid #21262d; border-radius:10px; padding:14px; color:#9da7b3; font-size:12px; line-height:1.6; margin-top:12px"><code>scikids/
├── index.html           # Página principal
├── matematicas.html     # Matemáticas
├── español.html         # Español y lectura
├── ciencias.html        # Ciencias naturales
├── juegos.html          # Zona de juegos
├── laboratorioCiencias/ # Laboratorios interactivos
├── assets/css/          # Estilos y animaciones
├── assets/js/           # Lógica (juegos, buscador, laboratorios)
├── src/                 # Imágenes, videos y audio
└── manifest.webmanifest # PWA</code></pre>
</div>

<br/>

<div class="sk-card" style="animation-delay: 0.6s">
  <div class="sk-title">Cómo ejecutar</div>
  <p style="color:#e6edf3; font-size: 14px; margin-top: 10px; line-height: 1.7">
    Abre <code style="background:#1b212c;padding:2px 6px;border-radius:6px;color:#d4a84b">index.html</code> directamente en tu navegador, o publica el contenido en GitHub Pages para acceder desde cualquier dispositivo.
  </p>
</div>

<hr/>

<p align="center" style="color:#8b949e; font-size: 13px">
  Plataforma educativa · Página web para escuela
</p>
