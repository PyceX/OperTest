const translations = {
    ru: {
        title: "Тестирование", labelN: "Количество вопросов (20-100):", start: "Начать тест",
        progress: (i, n) => `Вопрос ${i} из ${n}`, next: "Далее", finish: "Завершить",
        resTitle: "Отчёт о тестировании", score: (c, n) => `Правильных ответов: ${c} из ${n}.`,
        restart: "Пройти заново", errorQ: "Вопрос", yourAns: "Ваш ответ", corrAns: "Правильный ответ"
    },
    kz: {
        title: "Тестілеу", labelN: "Сұрақтар саны (20-100):", start: "Тестті бастау",
        progress: (i, n) => `${n} сұрақтың ${i}-шісі`, next: "Келесі", finish: "Аяқтау",
        resTitle: "Тестілеу қорытындысы", score: (c, n) => `Дұрыс жауаптар: ${n} сұрақтың ${c}.`,
        restart: "Қайтадан бастау", errorQ: "Сұрақ", yourAns: "Сіздің жауабыңыз", corrAns: "Дұрыс жауап"
    }
};

let currentLang = 'ru';
let activeQuestions = [];
let currentIndex = 0;
let userAnswers = [];
let selectedOptionIndex = null;

const els = {
    langSwitch: document.getElementById('lang-switch'), headerTitle: document.getElementById('header-title'),
    screenSetup: document.getElementById('screen-setup'), screenQuiz: document.getElementById('screen-quiz'), screenResult: document.getElementById('screen-result'),
    inputN: document.getElementById('input-n'), btnStart: document.getElementById('btn-start'), labelN: document.getElementById('label-n'),
    progressText: document.getElementById('progress-text'), progressBar: document.getElementById('progress-bar'), 
    questionText: document.getElementById('question-text'), optionsContainer: document.getElementById('options-container'),
    btnNext: document.getElementById('btn-next'),
    resultTitle: document.getElementById('result-title'), scoreText: document.getElementById('score-text'), errorsContainer: document.getElementById('errors-container'), btnRestart: document.getElementById('btn-restart')
};

function updateTexts() {
    const t = translations[currentLang];
    els.headerTitle.textContent = t.title;
    els.labelN.textContent = t.labelN;
    els.btnStart.textContent = t.start;
    els.resultTitle.textContent = t.resTitle;
    els.btnRestart.textContent = t.restart;
    
    if (activeQuestions.length > 0 && !els.screenQuiz.classList.contains('hidden')) {
        els.progressText.textContent = t.progress(currentIndex + 1, activeQuestions.length);
        els.btnNext.textContent = currentIndex === activeQuestions.length - 1 ? t.finish : t.next;
        renderQuestionText();
    }
}

els.langSwitch.addEventListener('change', (e) => {
    currentLang = e.target.value;
    updateTexts();
});

function shuffleArray(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

els.btnStart.addEventListener('click', () => {
    let n = parseInt(els.inputN.value);
    if (isNaN(n) || n < 20) n = 20;
    if (n > questionsDb.length) n = questionsDb.length;
    
    activeQuestions = shuffleArray(questionsDb).slice(0, n);
    currentIndex = 0;
    userAnswers = [];
    
    els.screenSetup.classList.add('hidden');
    els.screenQuiz.classList.remove('hidden');
    
    renderQuestion();
});

function renderQuestion() {
    selectedOptionIndex = null;
    els.btnNext.disabled = true;

    const t = translations[currentLang];
    const total = activeQuestions.length;
    
    // Обновление прогресс-бара и текста
    els.progressText.textContent = t.progress(currentIndex + 1, total);
    els.progressBar.style.width = `${((currentIndex + 1) / total) * 100}%`;
    
    els.btnNext.textContent = currentIndex === total - 1 ? t.finish : t.next;
    
    renderQuestionText();
}

function renderQuestionText() {
    if (!activeQuestions[currentIndex]) return;
    const qData = activeQuestions[currentIndex];
    const langData = qData[currentLang];
    
    els.questionText.textContent = langData.q;
    els.optionsContainer.innerHTML = '';
    
    // Создаем массив объектов с привязкой к исходным индексам, чтобы после перемешивания знать, какой ответ был выбран
    let optionsWithIndices = langData.a.map((text, idx) => ({ text, originalIndex: idx }));
    optionsWithIndices = shuffleArray(optionsWithIndices);
    
    optionsWithIndices.forEach((opt) => {
        const label = document.createElement('label');
        label.className = "option-label";
        
        const radio = document.createElement('input');
        radio.type = "radio";
        radio.name = "quiz-option";
        radio.value = opt.originalIndex; // Значением input является исходный индекс
        radio.className = "option-input";
        
        if (selectedOptionIndex === opt.originalIndex) {
            radio.checked = true;
        }

        radio.addEventListener('change', () => {
            selectedOptionIndex = opt.originalIndex;
            els.btnNext.disabled = false;
        });

        const customRadio = document.createElement('div');
        customRadio.className = "option-custom-radio";

        const span = document.createElement('span');
        span.className = "option-text";
        span.textContent = opt.text;

        label.appendChild(radio);
        label.appendChild(customRadio);
        label.appendChild(span);
        els.optionsContainer.appendChild(label);
    });
}

els.btnNext.addEventListener('click', () => {
    userAnswers.push(selectedOptionIndex);
    
    if (currentIndex < activeQuestions.length - 1) {
        currentIndex++;
        renderQuestion();
    } else {
        showResults();
    }
});

function showResults() {
    els.screenQuiz.classList.add('hidden');
    els.screenResult.classList.remove('hidden');
    
    let correctCount = 0;
    const t = translations[currentLang];
    els.errorsContainer.innerHTML = '';
    
    activeQuestions.forEach((q, idx) => {
        const uAns = userAnswers[idx];
        const cAns = q.correct;
        
        if (uAns === cAns) {
            correctCount++;
        } else {
            const errDiv = document.createElement('div');
            errDiv.className = "error-card";
            errDiv.innerHTML = `
                <p class="error-q">${t.errorQ} ${q.id}: ${q[currentLang].q}</p>
                <p class="error-u"><strong>${t.yourAns}:</strong> ${q[currentLang].a[uAns]}</p>
                <p class="error-c"><strong>${t.corrAns}:</strong> ${q[currentLang].a[cAns]}</p>
            `;
            els.errorsContainer.appendChild(errDiv);
        }
    });

    els.scoreText.textContent = t.score(correctCount, activeQuestions.length);
    
    if(correctCount === activeQuestions.length) {
        els.errorsContainer.innerHTML = `<p style="color: var(--success-text); font-weight: 500;">Отличный результат, ошибок нет!</p>`;
    }
}

els.btnRestart.addEventListener('click', () => {
    els.screenResult.classList.add('hidden');
    els.screenSetup.classList.remove('hidden');
    els.progressBar.style.width = '0%'; // Сброс бара
});

updateTexts();
