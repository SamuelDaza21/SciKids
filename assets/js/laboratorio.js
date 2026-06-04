// ========== LABORATORIO: GERMINACIÓN - VERSIÓN ESPECTACULAR ==========
let germinationStep = 0;
let germinationDays = 0;
let germinationWatered = false;
let germinationPlantSize = 0;

function initGerminationLab() {
    const labDiv = document.getElementById('germinationLab');
    if (!labDiv) return;
    
    germinationStep = 0;
    germinationDays = 0;
    germinationWatered = false;
    germinationPlantSize = 0;
    
    renderGerminationLab(labDiv);
}

function renderGerminationLab(container) {
    const porcentajeCrecimiento = (germinationStep / 5) * 100;
    
    container.innerHTML = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 30px; padding: 25px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
            
            <!-- Título llamativo -->
            <div style="text-align: center; margin-bottom: 25px;">
                <div style="font-size: 3rem; display: inline-block; background: rgba(255,255,255,0.2); padding: 10px 30px; border-radius: 60px;">
                    🌱🌿 ¡GERMINA TU PLANTA! 🌻🌸
                </div>
            </div>
            
            <!-- Maceta animada -->
            <div style="background: linear-gradient(135deg, #8B4513, #A0522D); border-radius: 20px 20px 50px 50px; padding: 20px; margin-bottom: 20px; position: relative; box-shadow: 0 10px 20px rgba(0,0,0,0.3);">
                <div style="background: #5D4037; border-radius: 15px; padding: 20px; min-height: 180px; display: flex; justify-content: center; align-items: center;">
                    <div style="font-size: 6rem; transform-origin: bottom; animation: bounce 2s ease-in-out infinite;">
                        ${getPlantaAnimada()}
                    </div>
                </div>
                
                <!-- Tierra decorativa -->
                <div style="position: absolute; bottom: 15px; left: 20px; right: 20px; height: 15px; background: #5D4037; border-radius: 10px;"></div>
                <div style="position: absolute; bottom: 8px; left: 30px; right: 30px; height: 8px; background: #4E342E; border-radius: 10px;"></div>
            </div>
            
            <!-- Barra de crecimiento -->
            <div style="margin: 20px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: white; font-weight: bold;">🌱 Crecimiento</span>
                    <span style="color: #ffd700; font-weight: bold;">${Math.floor(porcentajeCrecimiento)}%</span>
                </div>
                <div style="background: rgba(0,0,0,0.3); border-radius: 20px; height: 20px; overflow: hidden;">
                    <div style="width: ${porcentajeCrecimiento}%; height: 100%; background: linear-gradient(90deg, #ffd700, #4CAF50); transition: width 0.5s ease; border-radius: 20px;"></div>
                </div>
            </div>
            
            <!-- Estadísticas divertidas -->
            <div style="display: flex; gap: 20px; justify-content: center; margin: 20px 0;">
                <div style="background: rgba(255,255,255,0.2); border-radius: 20px; padding: 10px 20px; text-align: center;">
                    <div style="font-size: 2rem;">📅</div>
                    <div style="font-weight: bold;">Día ${germinationDays}</div>
                </div>
                <div style="background: rgba(255,255,255,0.2); border-radius: 20px; padding: 10px 20px; text-align: center;">
                    <div style="font-size: 2rem;">💧</div>
                    <div style="font-weight: bold;">${germinationWatered ? 'Regada ✅' : 'Necesita agua 💦'}</div>
                </div>
                <div style="background: rgba(255,255,255,0.2); border-radius: 20px; padding: 10px 20px; text-align: center;">
                    <div style="font-size: 2rem;">⭐</div>
                    <div style="font-weight: bold;">+${germinationStep * 5} pts</div>
                </div>
            </div>
            
            <!-- Tarjeta de misión -->
            <div style="background: rgba(255,255,255,0.15); border-radius: 20px; padding: 20px; margin: 20px 0; backdrop-filter: blur(10px);">
                <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                    <div style="font-size: 3rem;">${getMisionIcono()}</div>
                    <div style="flex: 1;">
                        <div style="font-size: 1.3rem; font-weight: bold; margin-bottom: 8px;">${getMisionTitulo()}</div>
                        <div style="opacity: 0.9;">${getMisionDescripcion()}</div>
                    </div>
                    <button onclick="advanceGerminationStep()" style="background: linear-gradient(135deg, #ffd700, #ff9800); border: none; padding: 12px 25px; border-radius: 30px; font-weight: bold; cursor: pointer; transition: transform 0.2s; font-size: 1rem; box-shadow: 0 5px 15px rgba(0,0,0,0.2);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        ${getMisionBoton()}
                    </button>
                </div>
            </div>
            
            <div id="germinationFeedback" style="margin-top: 15px;"></div>
            
            <button onclick="initGerminationLab()" style="background: rgba(255,255,255,0.2); border: 2px solid white; padding: 10px 20px; border-radius: 30px; cursor: pointer; width: 100%; font-weight: bold; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                🔄 REINICIAR EXPERIMENTO
            </button>
        </div>
        
        <style>
            @keyframes bounce {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            @keyframes slideIn {
                from { opacity: 0; transform: translateX(-30px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes grow {
                from { transform: scale(0); }
                to { transform: scale(1); }
            }
        </style>
    `;
}

function getPlantaAnimada() {
    const etapas = ['🌰', '🫘', '🌱', '🌿', '🌻', '🌸'];
    return etapas[Math.min(germinationStep, 5)];
}

function getMisionIcono() {
    const iconos = ['🌰', '🫘', '💧', '🔬', '🎉'];
    return iconos[Math.min(germinationStep, 4)];
}

function getMisionTitulo() {
    const titulos = [
        '🎯 MISIÓN 1: ¡Prepara la casa de la semilla!',
        '🎯 MISIÓN 2: ¡Planta el frijol mágico!',
        '🎯 MISIÓN 3: ¡Dale amor y agua!',
        '🎯 MISIÓN 4: ¡Observa el milagro!',
        '🎯 MISIÓN 5: ¡Celebra tu logro!'
    ];
    return titulos[Math.min(germinationStep, 4)];
}

function getMisionDescripcion() {
    const descripciones = [
        'Coloca algodón húmedo en un frasco. ¡Así la semilla tendrá una cama suave! 🛏️',
        'Introduce el frijol entre el algodón y el vidrio. ¡Podrás ver cómo crece! 👀',
        'Mantén el algodón siempre húmedo. ¡Las plantas también tienen sed! 💦',
        '¿Ya ves la raíz? ¡Está buscando nutrientes! ¡La ciencia es increíble! 🔬',
        '¡FELICIDADES! Tu planta ha nacido. ¡Eres todo un científico! 🎓'
    ];
    return descripciones[Math.min(germinationStep, 4)];
}

function getMisionBoton() {
    const botones = ['✅ ¡Listo!', '🌱 Sembrar', '💧 Regar', '🔍 Observar', '🏆 Completar'];
    return botones[Math.min(germinationStep, 4)];
}

function advanceGerminationStep() {
    const feedback = document.getElementById('germinationFeedback');
    
    if (germinationStep === 0) {
        showGerminationMessage('✨ ¡Excelente! Has preparado el hogar de tu semilla +10 PUNTOS ✨', 'success');
        addPoints(10, 'Laboratorio: Preparación de germinación');
        germinationStep = 1;
        renderGerminationLab(document.getElementById('germinationLab'));
        
    } else if (germinationStep === 1) {
        showGerminationMessage('🌱 ¡La semilla ya tiene hogar! +15 PUNTOS por sembrar 🌱', 'success');
        addPoints(15, 'Laboratorio: Siembra de frijol');
        germinationStep = 2;
        renderGerminationLab(document.getElementById('germinationLab'));
        
    } else if (germinationStep === 2) {
        if (!germinationWatered) {
            germinationWatered = true;
            germinationDays++;
            showGerminationMessage(`💧 ¡PLOP! Has regado tu planta. Día ${germinationDays} +10 PUNTOS 💧`, 'success');
            addPoints(10, 'Laboratorio: Riego de planta');
            
            if (germinationDays >= 2) {
                germinationStep = 3;
            }
            renderGerminationLab(document.getElementById('germinationLab'));
        } else {
            showGerminationMessage('⚠️ ¡Ya regaste hoy! Espera al próximo día para volver a regar ⚠️', 'warning');
        }
        
    } else if (germinationStep === 3) {
        showGerminationMessage('🔬 ¡MIRA! ¡Apareció una raíz! La ciencia es mágica +20 PUNTOS 🔬', 'success');
        addPoints(20, 'Laboratorio: Observación de germinación');
        germinationStep = 4;
        renderGerminationLab(document.getElementById('germinationLab'));
        
    } else if (germinationStep === 4) {
        showGerminationMessage('🎉🎊 ¡FELICIDADES! Tu planta ha germinado. ¡Eres un científico increíble! +50 PUNTOS 🎊🎉', 'success');
        addPoints(50, 'Laboratorio: Germinación completada');
        if(typeof playSound === 'function') playSound('win');
        
        const container = document.getElementById('germinationLab');
        if (container) {
            container.innerHTML = `
                <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 30px; padding: 40px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.3); animation: grow 0.5s ease;">
                    <div style="font-size: 6rem;">🌻🏆🌸</div>
                    <h2 style="color: white; margin: 20px 0;">¡EXPERIMENTO COMPLETADO!</h2>
                    <p style="color: white; font-size: 1.2rem;">¡Tu frijol germinó exitosamente! Ahora eres todo un científico.</p>
                    <button onclick="initGerminationLab()" style="background: white; border: none; padding: 15px 30px; border-radius: 40px; font-weight: bold; cursor: pointer; margin-top: 20px; font-size: 1.1rem;">🌱 NUEVO EXPERIMENTO 🌱</button>
                </div>
            `;
        }
    }
}

function showGerminationMessage(message, type) {
    const feedbackDiv = document.getElementById('germinationFeedback');
    if (!feedbackDiv) return;
    
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196F3'
    };
    
    feedbackDiv.innerHTML = `<div style="color: ${colors[type]}; padding: 15px; border-radius: 15px; background: rgba(0,0,0,0.2); text-align: center; font-weight: bold; font-size: 1.1rem; animation: slideIn 0.3s ease;">${message}</div>`;
    
    setTimeout(() => {
        if (feedbackDiv.innerHTML === `<div style="color: ${colors[type]}; padding: 15px; border-radius: 15px; background: rgba(0,0,0,0.2); text-align: center; font-weight: bold; font-size: 1.1rem; animation: slideIn 0.3s ease;">${message}</div>`) {
            feedbackDiv.innerHTML = '';
        }
    }, 4000);
}

// ========== LABORATORIO: ESTADOS DEL AGUA - VERSIÓN ESPECTACULAR ==========
let waterTemperature = 25;
let waterState = "liquid";
let waterExperiments = [];

function initWaterLab() {
    const waterDiv = document.getElementById('waterLab');
    if (!waterDiv) return;
    
    waterTemperature = 25;
    waterState = "liquid";
    waterExperiments = [];
    
    renderWaterLab(waterDiv);
}

function renderWaterLab(container) {
    const tempColor = getWaterTempColor(waterTemperature);
    
    container.innerHTML = `
        <div style="background: linear-gradient(135deg, #00b4db 0%, #0083b0 100%); border-radius: 30px; padding: 25px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
            
            <!-- Título llamativo -->
            <div style="text-align: center; margin-bottom: 25px;">
                <div style="font-size: 3rem; display: inline-block; background: rgba(255,255,255,0.2); padding: 10px 30px; border-radius: 60px;">
                    💧🌡️ ¡LABORATORIO DEL AGUA! 🌊💨
                </div>
            </div>
            
            <!-- Termómetro gigante -->
            <div style="background: rgba(0,0,0,0.2); border-radius: 60px; padding: 20px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
                    <button onclick="changeWaterTemp(-10)" style="background: #00bcd4; border: none; width: 60px; height: 60px; border-radius: 30px; font-size: 1.5rem; cursor: pointer; box-shadow: 0 5px 10px rgba(0,0,0,0.2); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">❄️❄️</button>
                    <button onclick="changeWaterTemp(-1)" style="background: #2196F3; border: none; width: 60px; height: 60px; border-radius: 30px; font-size: 1.5rem; cursor: pointer; box-shadow: 0 5px 10px rgba(0,0,0,0.2); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">❄️</button>
                    <div style="background: white; border-radius: 40px; padding: 5px 25px; text-align: center; min-width: 150px;">
                        <div style="font-size: 3rem; font-weight: bold; color: #333;">${waterTemperature}°</div>
                        <div style="font-size: 0.8rem; color: #666;">Temperatura</div>
                    </div>
                    <button onclick="changeWaterTemp(1)" style="background: #FF9800; border: none; width: 60px; height: 60px; border-radius: 30px; font-size: 1.5rem; cursor: pointer; box-shadow: 0 5px 10px rgba(0,0,0,0.2); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">🔥</button>
                    <button onclick="changeWaterTemp(10)" style="background: #f44336; border: none; width: 60px; height: 60px; border-radius: 30px; font-size: 1.5rem; cursor: pointer; box-shadow: 0 5px 10px rgba(0,0,0,0.2); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">🔥🔥</button>
                </div>
                
                <!-- Barra de temperatura -->
                <div style="margin-top: 20px;">
                    <div style="background: rgba(0,0,0,0.3); border-radius: 30px; height: 30px; overflow: hidden;">
                        <div style="width: ${(waterTemperature + 50) / 150 * 100}%; height: 100%; background: linear-gradient(90deg, #00bcd4, #FF9800, #f44336); transition: width 0.3s ease; display: flex; align-items: center; justify-content: flex-end; padding-right: 10px; color: white; font-weight: bold;">
                            ${waterTemperature}°C
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 0.8rem;">
                        <span>❄️ -50°C (Hielo)</span>
                        <span>💧 0°C (Fusión)</span>
                        <span>🔥 100°C (Ebullición)</span>
                    </div>
                </div>
            </div>
            
            <!-- Agua animada -->
            <div style="background: rgba(0,0,0,0.2); border-radius: 30px; padding: 30px; text-align: center; margin-bottom: 20px;">
                <div style="font-size: 8rem; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));">
                    ${getWaterIconAnimado()}
                </div>
                <div style="font-size: 1.5rem; font-weight: bold; margin-top: 10px;">${getEstadoNombre()}</div>
                <div style="opacity: 0.9;">${getEstadoDescripcion()}</div>
            </div>
            
            <!-- Título de experimentos -->
            <div style="text-align: center; margin: 20px 0;">
                <div style="font-size: 1.5rem; font-weight: bold;">🧪 ¡EXPERIMENTA ARRASTRANDO! 🧪</div>
                <div style="font-size: 0.9rem;">Arrastra los estados a las zonas correctas</div>
            </div>
            
            <!-- Elementos arrastrables -->
            <div style="display: flex; gap: 15px; justify-content: center; margin: 20px 0; flex-wrap: wrap;">
                <div draggable="true" data-estado="solid" data-name="Hielo" ondragstart="dragWaterState(event)" style="background: linear-gradient(135deg, #00bcd4, #0097a7); padding: 15px 25px; border-radius: 20px; text-align: center; cursor: grab; font-weight: bold; font-size: 1.2rem; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    🧊 HIELO (Sólido)
                </div>
                <div draggable="true" data-estado="liquid" data-name="Agua" ondragstart="dragWaterState(event)" style="background: linear-gradient(135deg, #2196F3, #1976D2); padding: 15px 25px; border-radius: 20px; text-align: center; cursor: grab; font-weight: bold; font-size: 1.2rem; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    💧 AGUA (Líquido)
                </div>
                <div draggable="true" data-estado="gas" data-name="Vapor" ondragstart="dragWaterState(event)" style="background: linear-gradient(135deg, #9C27B0, #7B1FA2); padding: 15px 25px; border-radius: 20px; text-align: center; cursor: grab; font-weight: bold; font-size: 1.2rem; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    💨 VAPOR (Gas)
                </div>
            </div>
            
            <!-- Zonas de destino -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
                ${createDropZone('derretir', '🧊→💧', '¿Qué se derrite con calor?', 'solid')}
                ${createDropZone('congelar', '💧→🧊', '¿Qué se congela con frío?', 'liquid')}
                ${createDropZone('evaporar', '💧→💨', '¿Qué se evapora con calor?', 'liquid')}
                ${createDropZone('condensar', '💨→💧', '¿Qué se condensa con frío?', 'gas')}
            </div>
            
            <!-- Historial de experimentos -->
            <div style="background: rgba(0,0,0,0.2); border-radius: 20px; padding: 15px; margin: 20px 0;">
                <div style="font-weight: bold; margin-bottom: 10px;">📋 BITÁCORA DE CIENCIA 📋</div>
                <div id="waterHistoryList" style="max-height: 150px; overflow-y: auto;">
                    ${waterExperiments.length === 0 ? 
                        '<div style="text-align: center; opacity: 0.7;">✨ Arrastra respuestas para ganar puntos ✨</div>' : 
                        waterExperiments.map(exp => `
                            <div style="background: rgba(255,255,255,0.1); padding: 8px; margin: 5px 0; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
                                <span>${exp.icono}</span>
                                <span>${exp.texto}</span>
                                <span style="color: #ffd700; font-weight: bold;">+${exp.puntos} pts</span>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
            
            <div id="waterFeedback" style="margin-bottom: 15px;"></div>
            
            <button onclick="initWaterLab()" style="background: linear-gradient(135deg, #ffd700, #ff9800); border: none; padding: 12px 25px; border-radius: 30px; font-weight: bold; cursor: pointer; width: 100%; font-size: 1rem; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                🔄 REINICIAR LABORATORIO 🔄
            </button>
        </div>
    `;
}

function createDropZone(cambio, icono, pregunta, estadoEsperado) {
    return `
        <div data-cambio="${cambio}" style="background: rgba(255,255,255,0.1); border-radius: 20px; padding: 15px; text-align: center; backdrop-filter: blur(10px);">
            <div style="font-size: 2rem;">${icono}</div>
            <div style="font-weight: bold; margin: 8px 0;">${pregunta}</div>
            <div id="drop-${cambio}" ondragover="allowDrop(event)" ondrop="dropWaterState(event, '${cambio}', '${estadoEsperado}')" style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 12px; margin-top: 10px; border: 2px dashed rgba(255,255,255,0.5); transition: all 0.2s;">
                📦 Arrastra aquí
            </div>
            <div id="feedback-${cambio}" style="margin-top: 8px; font-size: 0.8rem;"></div>
        </div>
    `;
}

function dragWaterState(event) {
    event.dataTransfer.setData('text/plain', event.target.getAttribute('data-estado'));
    event.dataTransfer.setData('text/name', event.target.getAttribute('data-name'));
    event.target.style.opacity = '0.5';
    event.target.addEventListener('dragend', function() {
        this.style.opacity = '1';
    });
}

function allowDrop(event) {
    event.preventDefault();
}

function dropWaterState(event, cambio, estadoEsperado) {
    event.preventDefault();
    const estadoArrastrado = event.dataTransfer.getData('text/plain');
    const nombreArrastrado = event.dataTransfer.getData('text/name');
    const dropZone = document.getElementById(`drop-${cambio}`);
    const feedbackDiv = document.getElementById(`feedback-${cambio}`);
    
    let puntos = 0;
    let icono = '';
    let mensaje = '';
    
    if (estadoArrastrado === estadoEsperado) {
        switch(cambio) {
            case 'derretir':
                puntos = 15;
                icono = '🧊→💧';
                mensaje = '✅ ¡EXCELENTE! El hielo se derrite con calor';
                break;
            case 'congelar':
                puntos = 15;
                icono = '💧→🧊';
                mensaje = '✅ ¡CORRECTO! El agua se congela con frío';
                break;
            case 'evaporar':
                puntos = 20;
                icono = '💧→💨';
                mensaje = '✅ ¡INCREÍBLE! El agua se evapora con calor';
                break;
            case 'condensar':
                puntos = 20;
                icono = '💨→💧';
                mensaje = '✅ ¡GENIAL! El vapor se condensa con frío';
                break;
        }
        
        feedbackDiv.innerHTML = `<span style="color: #4CAF50; font-weight: bold;">${mensaje} +${puntos} PUNTOS 🎉</span>`;
        dropZone.style.background = 'rgba(76, 175, 80, 0.3)';
        dropZone.style.borderColor = '#4CAF50';
        
        addPoints(puntos, `Laboratorio: ${cambio}`);
        if(typeof playSound === 'function') playSound('correcto');
        
        waterExperiments.unshift({
            texto: `${nombreArrastrado} → ${cambio}`,
            puntos: puntos,
            icono: icono
        });
        
        if (waterExperiments.length > 6) waterExperiments.pop();
        
        const historyDiv = document.getElementById('waterHistoryList');
        if (historyDiv) {
            historyDiv.innerHTML = waterExperiments.map(exp => `
                <div style="background: rgba(255,255,255,0.1); padding: 8px; margin: 5px 0; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
                    <span>${exp.icono}</span>
                    <span>${exp.texto}</span>
                    <span style="color: #ffd700; font-weight: bold;">+${exp.puntos} pts</span>
                </div>
            `).join('');
        }
        
        setTimeout(() => {
            feedbackDiv.innerHTML = '';
            dropZone.style.background = 'rgba(0,0,0,0.3)';
            dropZone.style.borderColor = 'rgba(255,255,255,0.5)';
        }, 3000);
        
    } else {
        feedbackDiv.innerHTML = `<span style="color: #f44336;">❌ ¡UPS! ${nombreArrastrado} no es correcto para este cambio ❌</span>`;
        dropZone.style.background = 'rgba(244, 67, 54, 0.3)';
        dropZone.style.borderColor = '#f44336';
        if(typeof playSound === 'function') playSound('incorrecto');
        
        setTimeout(() => {
            feedbackDiv.innerHTML = '';
            dropZone.style.background = 'rgba(0,0,0,0.3)';
            dropZone.style.borderColor = 'rgba(255,255,255,0.5)';
        }, 2000);
    }
}

function changeWaterTemp(cambio) {
    let nuevaTemp = waterTemperature + cambio;
    nuevaTemp = Math.max(-50, Math.min(150, nuevaTemp));
    
    if (nuevaTemp !== waterTemperature) {
        waterTemperature = nuevaTemp;
        
        if (waterTemperature <= 0) {
            waterState = "solid";
        } else if (waterTemperature >= 100) {
            waterState = "gas";
        } else {
            waterState = "liquid";
        }
        
        renderWaterLab(document.getElementById('waterLab'));
        
        const feedback = document.getElementById('waterFeedback');
        if (feedback) {
            let mensaje = cambio > 0 ? `🌡️ ¡CALENTANDO! Ahora está a ${waterTemperature}°C` : `🌡️ ¡ENFRIANDO! Ahora está a ${waterTemperature}°C`;
            feedback.innerHTML = `<div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 15px; text-align: center; animation: slideIn 0.3s ease;">${mensaje}</div>`;
            setTimeout(() => {
                if (feedback.innerHTML === `<div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 15px; text-align: center; animation: slideIn 0.3s ease;">${mensaje}</div>`) {
                    feedback.innerHTML = '';
                }
            }, 2000);
        }
    }
}

function getWaterTempColor(temp) {
    if (temp <= 0) return '#00bcd4';
    if (temp >= 100) return '#f44336';
    const ratio = temp / 100;
    return `rgb(255, ${Math.floor(200 - ratio * 150)}, 100)`;
}

function getWaterIconAnimado() {
    if (waterState === 'solid') return '🧊❄️🧊';
    if (waterState === 'liquid') return '💧🌊💧';
    return '💨💨💨';
}

function getEstadoNombre() {
    if (waterState === 'solid') return '🧊 ESTADO SÓLIDO (Hielo) 🧊';
    if (waterState === 'liquid') return '💧 ESTADO LÍQUIDO (Agua) 💧';
    return '💨 ESTADO GASEOSO (Vapor) 💨';
}

function getEstadoDescripcion() {
    if (waterState === 'solid') return 'Las moléculas están muy juntas. ¡El agua se pone dura como una roca! 🪨';
    if (waterState === 'liquid') return 'Las moléculas se deslizan. ¡El agua fluye como magia! ✨';
    return 'Las moléculas vuelan por todos lados. ¡El vapor sube al cielo! ☁️';
}