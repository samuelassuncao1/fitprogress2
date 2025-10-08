// Dados dos treinos
const workouts = {
    A: {
        name: "Pernas e Ombros",
        exercises: [
            {
                name: "Agachamento Livre",
                sets: 4,
                reps: 8,
                setsData: [
                    { weight: 60, reps: 8 },
                    { weight: 70, reps: 8 },
                    { weight: 80, reps: 8 },
                    { weight: 85, reps: 8 }
                ]
            },
            {
                name: "Desenvolvimento Militar",
                sets: 4,
                reps: 8,
                setsData: [
                    { weight: 30, reps: 8 },
                    { weight: 35, reps: 8 },
                    { weight: 40, reps: 8 },
                    { weight: 40, reps: 8 }
                ]
            },
            {
                name: "Elevação Lateral",
                sets: 4,
                reps: 8,
                setsData: [
                    { weight: 10, reps: 8 },
                    { weight: 12, reps: 8 },
                    { weight: 12, reps: 8 },
                    { weight: 10, reps: 8 }
                ]
            }
        ]
    },
    B: {
        name: "Peito e Tríceps",
        exercises: [
            {
                name: "Supino Reto",
                sets: 4,
                reps: 8,
                setsData: [
                    { weight: 50, reps: 8 },
                    { weight: 60, reps: 8 },
                    { weight: 70, reps: 8 },
                    { weight: 75, reps: 8 }
                ]
            },
            {
                name: "Crucifixo Inclinado",
                sets: 4,
                reps: 8,
                setsData: [
                    { weight: 12, reps: 8 },
                    { weight: 14, reps: 8 },
                    { weight: 16, reps: 8 },
                    { weight: 16, reps: 8 }
                ]
            },
            {
                name: "Tríceps Pulley",
                sets: 4,
                reps: 8,
                setsData: [
                    { weight: 20, reps: 8 },
                    { weight: 25, reps: 8 },
                    { weight: 30, reps: 8 },
                    { weight: 30, reps: 8 }
                ]
            }
        ]
    },
    C: {
        name: "Costas e Bíceps",
        exercises: [
            {
                name: "Barra Fixa com Peso",
                sets: 4,
                reps: 8,
                setsData: [
                    { weight: 10, reps: 8 },
                    { weight: 10, reps: 8 },
                    { weight: 12, reps: 8 },
                    { weight: 12, reps: 8 }
                ]
            },
            {
                name: "Remada Curvada com Barra",
                sets: 4,
                reps: 8,
                setsData: [
                    { weight: 40, reps: 8 },
                    { weight: 40, reps: 8 },
                    { weight: 45, reps: 8 },
                    { weight: 45, reps: 8 }
                ]
            },
            {
                name: "Rosca Direta com Barra W",
                sets: 4,
                reps: 8,
                setsData: [
                    { weight: 20, reps: 8 },
                    { weight: 25, reps: 8 },
                    { weight: 25, reps: 8 },
                    { weight: 30, reps: 8 }
                ]
            },
            {
                name: "Rosca Scott com Halter",
                sets: 4,
                reps: 8,
                setsData: [
                    { weight: 10, reps: 8 },
                    { weight: 12, reps: 8 },
                    { weight: 12, reps: 8 },
                    { weight: 14, reps: 8 }
                ]
            }
        ]
    }
};

// Histórico de treinos (armazenado no localStorage)
let workoutHistory = JSON.parse(localStorage.getItem('workoutHistory')) || [];

// Funções para converter datas
function toBrazilianDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function fromBrazilianDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    if (parts.length !== 3) return '';
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);
    const date = new Date(year, month, day);
    return date.toISOString().split('T')[0];
}

function getTodayBrazilian() {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
}

// Sistema de abas
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove a classe active de todas as abas e conteúdos
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Adiciona a classe active à aba clicada
        tab.classList.add('active');
        
        // Mostra o conteúdo correspondente
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
        
        // Se for a aba de histórico, atualiza o histórico
        if (tabId === 'history') {
            updateHistory();
        }
    });
});

// Iniciar um treino
document.querySelectorAll('.btn-start').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const workoutId = e.target.getAttribute('data-workout');
        startWorkout(workoutId);
    });
});

// Editar um treino
document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const workoutId = e.target.getAttribute('data-workout');
        openEditWorkoutModal(workoutId);
    });
});

// Função para iniciar um treino
function startWorkout(workoutId) {
    const workout = workouts[workoutId];
    const titleElement = document.getElementById('active-workout-title');
    const exercisesElement = document.getElementById('active-workout-exercises');
    const finishButton = document.getElementById('finish-workout-btn');
    
    // Data atual no formato brasileiro como padrão
    const todayBrazilian = getTodayBrazilian();
    
    titleElement.innerHTML = `
        <div>
            <div>Treino ${workoutId} - ${workout.name}</div>
            <div class="workout-date">
                <span class="date-label">Data:</span>
                <input type="text" id="workout-date" class="date-input date-input-br" 
                       placeholder="dd/mm/aaaa" value="${todayBrazilian}"
                       maxlength="10">
            </div>
        </div>
    `;
    
    // Adicionar máscara para data brasileira
    const dateInput = document.getElementById('workout-date');
    dateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        if (value.length > 5) {
            value = value.substring(0, 5) + '/' + value.substring(5, 9);
        }
        
        e.target.value = value;
    });
    
    exercisesElement.innerHTML = '';
    
    workout.exercises.forEach((exercise, exerciseIndex) => {
        const exerciseElement = document.createElement('div');
        exerciseElement.className = 'exercise-item';
        
        const exerciseHeader = document.createElement('div');
        exerciseHeader.className = 'exercise-header';
        
        const exerciseName = document.createElement('div');
        exerciseName.className = 'exercise-name';
        exerciseName.textContent = exercise.name;
        
        const exerciseSets = document.createElement('div');
        exerciseSets.textContent = `${exercise.sets}x${exercise.reps}`;
        
        exerciseHeader.appendChild(exerciseName);
        exerciseHeader.appendChild(exerciseSets);
        
        const setsElement = document.createElement('div');
        setsElement.className = 'sets';
        
        for (let i = 0; i < exercise.sets; i++) {
            const setElement = document.createElement('div');
            setElement.className = 'set';
            
            const setNumber = document.createElement('div');
            setNumber.className = 'set-number';
            setNumber.textContent = i + 1;
            
            const setInputs = document.createElement('div');
            setInputs.className = 'set-inputs';
            
            const weightGroup = document.createElement('div');
            weightGroup.className = 'input-group';
            
            const weightLabel = document.createElement('label');
            weightLabel.textContent = 'Peso (kg)';
            
            const weightInput = document.createElement('input');
            weightInput.type = 'number';
            weightInput.value = exercise.setsData[i].weight;
            
            weightGroup.appendChild(weightLabel);
            weightGroup.appendChild(weightInput);
            
            const repsGroup = document.createElement('div');
            repsGroup.className = 'input-group';
            
            const repsLabel = document.createElement('label');
            repsLabel.textContent = 'Reps';
            
            const repsInput = document.createElement('input');
            repsInput.type = 'number';
            repsInput.value = exercise.setsData[i].reps;
            
            repsGroup.appendChild(repsLabel);
            repsGroup.appendChild(repsInput);
            
            setInputs.appendChild(weightGroup);
            setInputs.appendChild(repsGroup);
            
            setElement.appendChild(setNumber);
            setElement.appendChild(setInputs);
            
            setsElement.appendChild(setElement);
            
            // Marcar série como completa ao clicar
            setElement.addEventListener('click', (e) => {
                if (e.target.tagName !== 'INPUT') {
                    setElement.classList.toggle('completed');
                }
            });
        }
        
        // Temporizador de descanso para cada exercício
        const restTimer = document.createElement('div');
        restTimer.className = 'rest-timer-small';
        restTimer.innerHTML = `
            <span class="rest-label">Tempo de Descanso:</span>
            <div class="timer-display-small" id="timer-${exerciseIndex}">01:30</div>
            <div class="timer-controls-small">
                <button class="timer-btn-small start-timer" data-exercise="${exerciseIndex}">▶</button>
                <button class="timer-btn-small pause-timer" data-exercise="${exerciseIndex}">⏸</button>
                <button class="timer-btn-small reset-timer" data-exercise="${exerciseIndex}">↺</button>
            </div>
            <div class="timer-settings-small">
                <input type="number" class="timer-input-small minutes-input" data-exercise="${exerciseIndex}" min="0" max="10" value="1">
                <span>min</span>
                <input type="number" class="timer-input-small seconds-input" data-exercise="${exerciseIndex}" min="0" max="59" value="30">
                <span>seg</span>
            </div>
        `;
        
        exerciseElement.appendChild(exerciseHeader);
        exerciseElement.appendChild(setsElement);
        exerciseElement.appendChild(restTimer);
        
        exercisesElement.appendChild(exerciseElement);
    });
    
    finishButton.style.display = 'block';
    finishButton.setAttribute('data-workout-id', workoutId);
    
    // Inicializar temporizadores para cada exercício
    initializeTimers(workout.exercises.length);
    
    // Atualizar o destaque do treino ativo
    document.querySelectorAll('.workout-item').forEach(item => {
        item.classList.remove('active-workout');
    });
    
    document.querySelector(`.btn-start[data-workout="${workoutId}"]`).closest('.workout-item').classList.add('active-workout');
}

// Sistema de temporizadores individuais
let timerIntervals = {};
let timerSeconds = {};

function initializeTimers(exerciseCount) {
    for (let i = 0; i < exerciseCount; i++) {
        timerSeconds[i] = 90; // 1 minuto e 30 segundos padrão
        updateTimerDisplay(i);
        
        // Configurar eventos dos botões para cada temporizador
        document.querySelector(`.start-timer[data-exercise="${i}"]`).addEventListener('click', () => startTimer(i));
        document.querySelector(`.pause-timer[data-exercise="${i}"]`).addEventListener('click', () => pauseTimer(i));
        document.querySelector(`.reset-timer[data-exercise="${i}"]`).addEventListener('click', () => resetTimer(i));
        
        // Configurar eventos dos inputs de tempo
        document.querySelector(`.minutes-input[data-exercise="${i}"]`).addEventListener('change', () => updateTimerFromInputs(i));
        document.querySelector(`.seconds-input[data-exercise="${i}"]`).addEventListener('change', () => updateTimerFromInputs(i));
    }
}

function updateTimerDisplay(exerciseIndex) {
    const minutes = Math.floor(timerSeconds[exerciseIndex] / 60);
    const seconds = timerSeconds[exerciseIndex] % 60;
    document.getElementById(`timer-${exerciseIndex}`).textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateTimerFromInputs(exerciseIndex) {
    const minutes = parseInt(document.querySelector(`.minutes-input[data-exercise="${exerciseIndex}"]`).value) || 0;
    const seconds = parseInt(document.querySelector(`.seconds-input[data-exercise="${exerciseIndex}"]`).value) || 0;
    timerSeconds[exerciseIndex] = minutes * 60 + seconds;
    updateTimerDisplay(exerciseIndex);
}

function startTimer(exerciseIndex) {
    clearInterval(timerIntervals[exerciseIndex]);
    timerIntervals[exerciseIndex] = setInterval(() => {
        if (timerSeconds[exerciseIndex] > 0) {
            timerSeconds[exerciseIndex]--;
            updateTimerDisplay(exerciseIndex);
        } else {
            clearInterval(timerIntervals[exerciseIndex]);
            // Tocar som de alarme (não implementado)
        }
    }, 1000);
}

function pauseTimer(exerciseIndex) {
    clearInterval(timerIntervals[exerciseIndex]);
}

function resetTimer(exerciseIndex) {
    clearInterval(timerIntervals[exerciseIndex]);
    updateTimerFromInputs(exerciseIndex);
}

// Função para abrir o modal de edição de treino
function openEditWorkoutModal(workoutId) {
    const workout = workouts[workoutId];
    const modal = document.getElementById('edit-workout-modal');
    const titleElement = document.getElementById('edit-workout-title');
    const contentElement = document.getElementById('edit-workout-content');
    
    titleElement.textContent = `Editar Treino ${workoutId} - ${workout.name}`;
    contentElement.innerHTML = '';
    
    workout.exercises.forEach((exercise, exerciseIndex) => {
        const exerciseEditor = document.createElement('div');
        exerciseEditor.className = 'exercise-editor';
        
        const exerciseHeader = document.createElement('div');
        exerciseHeader.className = 'exercise-editor-header';
        
        const exerciseName = document.createElement('input');
        exerciseName.type = 'text';
        exerciseName.value = exercise.name;
        exerciseName.style.flex = '1';
        exerciseName.style.marginRight = '10px';
        
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-exercise';
        removeButton.textContent = '×';
        removeButton.addEventListener('click', () => {
            exerciseEditor.remove();
        });
        
        exerciseHeader.appendChild(exerciseName);
        exerciseHeader.appendChild(removeButton);
        
        const setsRepsContainer = document.createElement('div');
        setsRepsContainer.style.display = 'flex';
        setsRepsContainer.style.gap = '10px';
        setsRepsContainer.style.marginTop = '10px';
        
        const setsGroup = document.createElement('div');
        setsGroup.className = 'input-group';
        
        const setsLabel = document.createElement('label');
        setsLabel.textContent = 'Séries';
        
        const setsInput = document.createElement('input');
        setsInput.type = 'number';
        setsInput.value = exercise.sets;
        setsInput.min = 1;
        setsInput.max = 10;
        
        setsGroup.appendChild(setsLabel);
        setsGroup.appendChild(setsInput);
        
        const repsGroup = document.createElement('div');
        repsGroup.className = 'input-group';
        
        const repsLabel = document.createElement('label');
        repsLabel.textContent = 'Repetições';
        
        const repsInput = document.createElement('input');
        repsInput.type = 'number';
        repsInput.value = exercise.reps;
        repsInput.min = 1;
        repsInput.max = 20;
        
        repsGroup.appendChild(repsLabel);
        repsGroup.appendChild(repsInput);
        
        setsRepsContainer.appendChild(setsGroup);
        setsRepsContainer.appendChild(repsGroup);
        
        exerciseEditor.appendChild(exerciseHeader