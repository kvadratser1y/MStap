// Инициализация переменных
let tapCount = localStorage.getItem('tapCount') ? parseInt(localStorage.getItem('tapCount')) : 0;
let energy = localStorage.getItem('energy') ? parseInt(localStorage.getItem('energy')) : 5000;
let lastEnergyRefill = localStorage.getItem('lastEnergyRefill') ? parseInt(localStorage.getItem('lastEnergyRefill')) : Date.now();
let nickname = localStorage.getItem('nickname');
let rebirthCount = 0;

// Элементы DOM
const tapCountElement = document.getElementById('tap-count');
const energyCountElement = document.getElementById('energy-count');
const nicknameDisplay = document.getElementById('nickname-display');
const tapButton = document.getElementById('tap-button');
const nicknameForm = document.getElementById('nickname-form');
const nicknameInput = document.getElementById('nickname-input');
const errorMessage = document.getElementById('error-message');
const gameSection = document.getElementById('game-section');
const nicknameSection = document.getElementById('nickname-section');
const resetTimerElement = document.createElement('p');
const rankDisplayElement = document.getElementById('rank-display');
const timerCountElement = document.getElementById('timer-count');

// Добавляем таймер обнуления под ником
nicknameDisplay.insertAdjacentElement('afterend', resetTimerElement);

// Функция для отображения ранга на основе количества тапов
const getRank = (tapCount) => {
    if (tapCount < 10000) return 'Новичок';
    if (tapCount < 100000) return 'Ученик';
    if (tapCount < 1000000) return 'Мастер';
    return 'Гуру';
};

// Функция для обновления отображения ранга
const updateRankDisplay = () => {
    rankDisplayElement.textContent = `Ранг: ${getRank(tapCount)}`;
};

// Проверка восстановления энергии
const checkEnergyRefill = () => {
    const currentTime = Date.now();
    const timeElapsed = currentTime - lastEnergyRefill;

    if (timeElapsed >= 3600000) { // 1 час
        energy = Math.min(energy + Math.floor(timeElapsed / 3600000) * 1000, 5000);
        lastEnergyRefill = currentTime;
        localStorage.setItem('energy', energy);
        localStorage.setItem('lastEnergyRefill', lastEnergyRefill);
    }
};

// Обновление информации при загрузке страницы
checkEnergyRefill();
updateRankDisplay();

// Обработка кликов по кнопке "Тап"
tapButton.addEventListener('click', () => {
    if (energy > 0) {
        tapCount++;
        energy--;

        tapCountElement.textContent = tapCount;
        energyCountElement.textContent = energy;

        localStorage.setItem('tapCount', tapCount);
        localStorage.setItem('energy', energy);
        updateRankDisplay();
    } else {
        alert('Недостаточно энергии! Подождите или купите подписку.');
    }
});

// Обработка формы ввода ника
nicknameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nicknameValue = nicknameInput.value.trim();

    if (/^[a-zA-Z]{1,8}[0-9]{0,2}$/.test(nicknameValue)) {
        nickname = nicknameValue;
        localStorage.setItem('nickname', nickname);
        nicknameDisplay.textContent = nickname;
        nicknameSection.style.display = 'none';
        gameSection.style.display = 'block';
    } else {
        errorMessage.textContent = 'Некорректный ник! Только латинские символы и максимум 2 цифры.';
    }
});

// Проверка наличия ника
if (nickname) {
    nicknameDisplay.textContent = nickname;
    nicknameSection.style.display = 'none';
    gameSection.style.display = 'block';
} else {
    nicknameSection.style.display = 'block';
    gameSection.style.display = 'none';
}

// Обработка событий для нижней панели
document.getElementById('daily-bonus-button').addEventListener('click', () => {
    // Логика для отображения ежедневных бонусов
});

document.getElementById('leaderboard-button').addEventListener('click', () => {
    // Логика для отображения таблицы лидеров
});

document.getElementById('main-button').addEventListener('click', () => {
    // Логика для возвращения на главную страницу
});

document.getElementById('promo-code-button').addEventListener('click', () => {
    // Логика для отображения ввода промокодов
});

document.getElementById('rebirth-button').addEventListener('click', () => {
    // Логика для перерождения
});
