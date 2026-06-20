const translations = {
    ru: {
        title: "Тестирование", 
        labelN: "Количество вопросов (20-100):", 
        start: "Начать тест",
        progress: (i, n) => `Вопрос ${i} из ${n}`, 
        next: "Далее", 
        finish: "Завершить",
        resTitle: "Отчёт о тестировании", 
        score: (c, n) => `Правильных ответов: ${c} из ${n}.`,
        restart: "Пройти заново", 
        errorQ: "Вопрос", 
        yourAns: "Ваш ответ", 
        corrAns: "Правильный ответ",
        langBtn: "RU",
        duaTitle: "Рабби йәссир уә лә туъассир. Рабби тәммим бил-хайр, зидни илман.",
        duaText: "Уа, Раббым! Бұл ісімді жеңілдете гөр, қиындатпа. Бұл ісімді қайырлы ете гөр, білімімді арттыра гөр.",
        modeTitle: "Выберите режим",
        btnTheory: "Теория (Тестирование)",
        btnPractice: "Практическое задание",
        practiceSelectTitle: "Выбор практического задания",
        btnBack: "Назад",
        btnExit: "Выйти",
        btnToTest: "Перейти к тесту",
        btnFinishTest: "Завершить тест",
        testInstruction: "Пронумеруйте действия в правильном порядке.",
        pracResTitle: "Результат практического задания"
    },
    kz: {
        title: "Тестілеу", 
        labelN: "Сұрақтар саны (20-100):", 
        start: "Тестті бастау",
        progress: (i, n) => `${n} сұрақтың ${i}-шісі`, 
        next: "Келесі", 
        finish: "Аяқтау",
        resTitle: "Тестілеу қорытындысы", 
        score: (c, n) => `Дұрыс жауаптар: ${n} сұрақтың ${c}.`,
        restart: "Қайтадан бастау", 
        errorQ: "Сұрақ", 
        yourAns: "Сіздің жауабыңыз", 
        corrAns: "Дұрыс жауап",
        langBtn: "KZ",
        duaTitle: "Рабби йәссир уә лә туъассир. Рабби тәммим бил-хайр, зидни илман.",
        duaText: "Уа, Раббым! Бұл ісімді жеңілдете гөр, қиындатпа. Бұл ісімді қайырлы ете гөр, білімімді арттыра гөр.",
        modeTitle: "Режимді таңдаңыз",
        btnTheory: "Теория (Тестілеу)",
        btnPractice: "Тәжірибелік тапсырма",
        practiceSelectTitle: "Тәжірибелік тапсырманы таңдау",
        btnBack: "Артқа",
        btnExit: "Шығу",
        btnToTest: "Тестке өту",
        btnFinishTest: "Тестті аяқтау",
        testInstruction: "Әрекеттерді дұрыс ретпен нөмірлеңіз.",
        pracResTitle: "Тәжірибелік тапсырма нәтижесі"
    }
};

// Загрузка сохраненных настроек или установка дефолтных значений
let currentLang = localStorage.getItem('quiz-lang') || 'ru';
if (localStorage.getItem('quiz-theme') === 'dark') {
    document.body.classList.add('dark-theme');
}
// Новые DOM элементы
const screenPracticeTest = document.getElementById('screen-practice-test');
const btnToPracticeTest = document.getElementById('btn-to-practice-test');
const btnFinishPracticeTest = document.getElementById('btn-finish-practice-test');
const btnPracticeTestExit = document.getElementById('btn-practice-test-exit');
const practiceTestListContainer = document.getElementById('practice-test-list-container');
const practiceTestTitle = document.getElementById('practice-test-title');

let testItems = [];
let currentStepNumber = 1;

let activeQuestions = [];
let currentIndex = 0;
let userAnswers = [];
let selectedOptionIndex = null;

const els = {
    langToggle: document.getElementById('lang-toggle'),
    themeToggle: document.getElementById('theme-toggle'),
    headerTitle: document.getElementById('header-title'),
    screenSetup: document.getElementById('screen-setup'), 
    screenQuiz: document.getElementById('screen-quiz'), 
    screenResult: document.getElementById('screen-result'),
    inputN: document.getElementById('input-n'), 
    btnStart: document.getElementById('btn-start'), 
    labelN: document.getElementById('label-n'),
    progressText: document.getElementById('progress-text'), 
    progressBar: document.getElementById('progress-bar'), 
    questionText: document.getElementById('question-text'), 
    optionsContainer: document.getElementById('options-container'),
    btnNext: document.getElementById('btn-next'),
    resultTitle: document.getElementById('result-title'), 
    scoreText: document.getElementById('score-text'), 
    errorsContainer: document.getElementById('errors-container'), 
    btnRestart: document.getElementById('btn-restart'),
    duaTitle: document.getElementById('dua-title'),
    duaText: document.getElementById('dua-text')
};

// Логика переключения и сохранения темы
els.themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('quiz-theme', isDark ? 'dark' : 'light');
});

// Логика переключения и сохранения языка
els.langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'ru' ? 'kz' : 'ru';
    localStorage.setItem('quiz-lang', currentLang);
    updateTexts();
});

function updateTexts() {
    const t = translations[currentLang];
    els.headerTitle.textContent = t.title;
    els.labelN.textContent = t.labelN;
    els.btnStart.textContent = t.start;
    els.resultTitle.textContent = t.resTitle;
    els.btnRestart.textContent = t.restart;
    els.langToggle.textContent = t.langBtn;
    els.duaTitle.textContent = t.duaTitle;
    els.duaText.textContent = t.duaText;
    
    // Новые элементы
    if(document.getElementById('mode-title')) document.getElementById('mode-title').textContent = t.modeTitle;
    if(document.getElementById('btn-mode-theory')) document.getElementById('btn-mode-theory').textContent = t.btnTheory;
    if(document.getElementById('btn-mode-practice')) document.getElementById('btn-mode-practice').textContent = t.btnPractice;
    if(document.getElementById('practice-select-title')) document.getElementById('practice-select-title').textContent = t.practiceSelectTitle;
    if(document.getElementById('btn-back-to-mode')) document.getElementById('btn-back-to-mode').textContent = t.btnBack;
    if(document.getElementById('btn-practice-exit')) document.getElementById('btn-practice-exit').textContent = t.btnExit;
    if(document.getElementById('btn-to-practice-test')) document.getElementById('btn-to-practice-test').textContent = t.btnToTest;
    if(document.getElementById('btn-practice-test-exit')) document.getElementById('btn-practice-test-exit').textContent = t.btnExit;
    if(document.getElementById('btn-finish-practice-test')) document.getElementById('btn-finish-practice-test').textContent = t.btnFinishTest;
    if(document.getElementById('practice-test-instruction')) document.getElementById('practice-test-instruction').textContent = t.testInstruction;
    
    if (activeQuestions.length > 0 && !els.screenQuiz.classList.contains('hidden')) {
        els.progressText.textContent = t.progress(currentIndex + 1, activeQuestions.length);
        els.btnNext.textContent = currentIndex === activeQuestions.length - 1 ? t.finish : t.next;
        renderQuestionText();
    }
}

// Вспомогательная функция перемешивания
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

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
    
    let optionsWithIndices = langData.a.map((text, idx) => ({ text, originalIndex: idx }));
    optionsWithIndices = shuffleArray(optionsWithIndices);
    
    optionsWithIndices.forEach((opt) => {
        const label = document.createElement('label');
        label.className = "option-label";
        
        const radio = document.createElement('input');
        radio.type = "radio";
        radio.name = "quiz-option";
        radio.value = opt.originalIndex;
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
    //els.screenSetup.classList.remove('hidden');
    document.getElementById('screen-mode-selection').classList.remove('hidden');
    els.progressBar.style.width = '0%';
});

// Элементы DOM для практики
const screenModeSelection = document.getElementById('screen-mode-selection');
const screenPracticeSelection = document.getElementById('screen-practice-selection');
const screenPracticeTask = document.getElementById('screen-practice-task');
const screenSetup = document.getElementById('screen-setup');

const btnModeTheory = document.getElementById('btn-mode-theory');
const btnModePractice = document.getElementById('btn-mode-practice');
const btnBackToMode = document.getElementById('btn-back-to-mode');
const btnPracticeExit = document.getElementById('btn-practice-exit');
const btnFinishPractice = document.getElementById('btn-finish-practice');

const practiceTitle = document.getElementById('practice-title');
const practiceListContainer = document.getElementById('practice-list-container');

let currentPracticeModule = null;

// Навигация
btnModeTheory.addEventListener('click', () => {
    screenModeSelection.classList.add('hidden');
    screenSetup.classList.remove('hidden');
});

btnModePractice.addEventListener('click', () => {
    screenModeSelection.classList.add('hidden');
    screenPracticeSelection.classList.remove('hidden');
});

btnBackToMode.addEventListener('click', () => {
    screenPracticeSelection.classList.add('hidden');
    screenModeSelection.classList.remove('hidden');
});

btnPracticeExit.addEventListener('click', () => {
    screenPracticeTask.classList.add('hidden');
    screenPracticeSelection.classList.remove('hidden');
});

// Выбор модуля
document.querySelectorAll('.btn-practice-select').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const moduleId = e.target.getAttribute('data-module');
        startPractice(moduleId);
    });
});

// Запуск и рендер практики
function startPractice(moduleId) {
    currentPracticeModule = practiceDb.modules[moduleId];
    screenPracticeSelection.classList.add('hidden');
    screenPracticeTask.classList.remove('hidden');
    //btnFinishPractice.disabled = true;
    btnToPracticeTest.disabled = false;
    
    practiceTitle.textContent = currentPracticeModule[currentLang].title;
    practiceListContainer.innerHTML = '';

    // Сборка упорядоченного массива: СИЗ (p) -> Инструменты (t/m) -> Шаги (s)
    const validItems = currentPracticeModule.validItems;
    const ppe = validItems.filter(item => item.id.startsWith('p'));
    const tools = validItems.filter(item => item.id.startsWith('t') || item.id.startsWith('m'));
    const steps = currentPracticeModule.steps;
    
    const combinedList = [...ppe, ...tools, ...steps];

    combinedList.forEach((item, index) => {
        const isFirst = index === 0;
        const label = document.createElement('label');
        label.className = `practice-item ${isFirst ? '' : 'locked'}`;
        label.id = `practice-item-${index}`;
        
        label.innerHTML = `
            <input type="checkbox" class="practice-checkbox" id="check-${index}">
            <div class="practice-number">${index + 1}</div>
            <div class="practice-text">${item[currentLang]}</div>
        `;
        
        practiceListContainer.appendChild(label);
        
        const checkbox = label.querySelector('.practice-checkbox');
        
        // Логика жесткой последовательности и блокировки ввода
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                label.classList.add('completed');
                
                // Разблокировка следующего элемента
                if (index + 1 < combinedList.length) {
                    const nextLabel = document.getElementById(`practice-item-${index + 1}`);
                    nextLabel.classList.remove('locked');
                } else {
                    btnFinishPractice.disabled = false; // Все выполнено
                }
            } else {
                label.classList.remove('completed');
                btnFinishPractice.disabled = true;
                
                // Каскадная блокировка всех последующих элементов при снятии галочки
                for (let i = index + 1; i < combinedList.length; i++) {
                    const subsequentLabel = document.getElementById(`practice-item-${i}`);
                    const subsequentCheckbox = document.getElementById(`check-${i}`);
                    subsequentLabel.classList.add('locked');
                    subsequentLabel.classList.remove('completed');
                    subsequentCheckbox.checked = false;
                }
            }
        });
    });
}

btnToPracticeTest.addEventListener('click', () => {
    document.getElementById('screen-practice-task').classList.add('hidden');
    startPracticeTest();
});

btnPracticeTestExit.addEventListener('click', () => {
    screenPracticeTest.classList.add('hidden');
    document.getElementById('screen-practice-selection').classList.remove('hidden');
});

function startPracticeTest() {
    screenPracticeTest.classList.remove('hidden');
    btnFinishPracticeTest.disabled = true;
    currentStepNumber = 1;
    practiceTestListContainer.innerHTML = '';
    
    practiceTestTitle.textContent = currentPracticeModule[currentLang].title;

    // Сборка массива
    const validItems = currentPracticeModule.validItems;
    const ppe = validItems.filter(item => item.id.startsWith('p'));
    const tools = validItems.filter(item => item.id.startsWith('t') || item.id.startsWith('m'));
    const steps = currentPracticeModule.steps;
    
    const originalList = [...ppe, ...tools, ...steps];
    
    // Сохраняем оригинальный индекс для проверки
    testItems = originalList.map((item, idx) => ({ ...item, originalIndex: idx, userAnswer: null }));
    testItems = shuffle(testItems);

    testItems.forEach((item, index) => {
        const label = document.createElement('div');
        label.className = 'practice-item';
        
        const circle = document.createElement('div');
        circle.className = 'practice-test-circle';
        circle.dataset.index = index;
        
        const text = document.createElement('div');
        text.className = 'practice-text';
        text.textContent = item[currentLang];

        label.appendChild(circle);
        label.appendChild(text);
        practiceTestListContainer.appendChild(label);

        label.addEventListener('click', () => {
            const currentVal = parseInt(circle.textContent);
            
            if (!isNaN(currentVal)) {
                // Если кликнули по заполненному кружку — сбрасываем его и все последующие
                currentStepNumber = currentVal;
                document.querySelectorAll('.practice-test-circle').forEach(c => {
                    const val = parseInt(c.textContent);
                    if (!isNaN(val) && val >= currentVal) {
                        c.textContent = '';
                        c.classList.remove('numbered');
                        testItems[c.dataset.index].userAnswer = null;
                    }
                });
                btnFinishPracticeTest.disabled = true;
            } else {
                // Назначаем текущий номер
                circle.textContent = currentStepNumber;
                circle.classList.add('numbered');
                testItems[index].userAnswer = currentStepNumber - 1; // 0-index
                currentStepNumber++;

                if (currentStepNumber > testItems.length) {
                    btnFinishPracticeTest.disabled = false;
                }
            }
        });
    });
}

btnFinishPracticeTest.addEventListener('click', () => {
    screenPracticeTest.classList.add('hidden');
    showPracticeResults();
});

function showPracticeResults() {
    const screenResult = document.getElementById('screen-result');
    screenResult.classList.remove('hidden');
    
    const t = translations[currentLang];
    document.getElementById('result-title').textContent = t.pracResTitle;
    const errorsContainer = document.getElementById('errors-container');
    errorsContainer.innerHTML = '';
    
    let correctCount = 0;
    
    // Сортируем то, как ответил пользователь
    const userSequence = [...testItems].sort((a, b) => a.userAnswer - b.userAnswer);

    userSequence.forEach((item, idx) => {
        if (item.originalIndex === idx) {
            correctCount++;
        } else {
            const errDiv = document.createElement('div');
            errDiv.className = "error-card";
            // Ищем, что на самом деле должно быть на этом шаге
            const correctItem = testItems.find(i => i.originalIndex === idx);
            errDiv.innerHTML = `
                <p class="error-q">Шаг ${idx + 1}:</p>
                <p class="error-u"><strong>Ваш выбор:</strong> ${item[currentLang]}</p>
                <p class="error-c"><strong>Должно быть:</strong> ${correctItem ? correctItem[currentLang] : 'Ошибка'}</p>
            `;
            errorsContainer.appendChild(errDiv);
        }
    });

    document.getElementById('score-text').textContent = t.score(correctCount, testItems.length);
    
    if(correctCount === testItems.length) {
        errorsContainer.innerHTML = `<p style="color: var(--success-text); font-weight: 500;">Отличный результат, ошибок нет!</p>`;
    }
}

// Инициализация текстов с учетом сохраненного языка
updateTexts();
