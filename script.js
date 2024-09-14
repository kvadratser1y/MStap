// Инициализация переменных
let tapCount = localStorage.getItem('tapCount') ? parseInt(localStorage.getItem('tapCount')) : 0;
let energy = localStorage.getItem('energy') ? parseInt(localStorage.getItem('energy')) : 5000;
let lastEnergyRefill = localStorage.getItem('lastEnergyRefill') ? parseInt(localStorage.getItem('lastEnergyRefill')) : Date.now();
let lastTap = localStorage.getItem('lastTap') ? parseInt(localStorage.getItem('lastTap')) : Date.now();
let nickname = localStorage.getItem('nickname');
let dailyStreak = localStorage.getItem('dailyStreak') ? parseInt(localStorage.getItem('dailyStreak')) : 0;
let lastDailyReward = localStorage.getItem('lastDailyReward') ? parseInt(localStorage.getItem('lastDailyReward')) : 0;

// Элементы DOM
const tapCountElement = document.getElementById('tap-count');
const energyCountElement = document.getElementById('energy-count');
const nicknameDisplay = document.getElementById('nickname-display');
const tapButton = document.getElementById('tap-button');
const leaderboardTable = document.getElementById('leaderboard-table');
const nicknameForm = document.getElementById('nickname-form');
const nicknameInput = document.getElementById('nickname-input');
const errorMessage = document.getElementById('error-message');
const gameSection = document.getElementById('game-section');
const nicknameSection = document.getElementById('nickname-section');
const leaderboardSection = document.getElementById('leaderboard-section');
const timerCountElement = document.getElementById('timer-count');
const resetTimerElement = document.createElement('p'); // Новый элемент для таймера обнуления
const rankDisplayElement = document.getElementById('rank-display');

// Промокоды
const promoInput = document.getElementById('promo-input');
const promoButton = document.getElementById('promo-button');
const promoMessage = document.getElementById('promo-message');

// Добавляем таймер обнуления под ником
nicknameDisplay.insertAdjacentElement('afterend', resetTimerElement);

// Функция для отображения ранга на основе количества тапов
const getRank = (tapCount) => {
    if (tapCount >= 1000000000) {
        return { rank: 'Hellsteel', emoji: '🔥', next: 'Максимальный ранг', tapsForNext: 0 };
    } else if (tapCount >= 100000000) {
        return { rank: 'Алмаз', emoji: '💎', next: 'Hellsteel', tapsForNext: 1000000000 - tapCount };
    } else if (tapCount >= 1000000) {
        return { rank: 'Золото', emoji: '🥇', next: 'Алмаз', tapsForNext: 100000000 - tapCount };
    } else if (tapCount >= 100000) {
        return { rank: 'Железо', emoji: '🛠️', next: 'Золото', tapsForNext: 1000000 - tapCount };
    } else if (tapCount >= 10000) {
        return { rank: 'Медь', emoji: '🥉', next: 'Железо', tapsForNext: 100000 - tapCount };
    } else {
        return { rank: 'Бронза', emoji: '🟫', next: 'Медь', tapsForNext: 10000 - tapCount };
    }
};

// Функция для обновления отображения ранга
const updateRankDisplay = () => {
    const { rank, emoji, next, tapsForNext } = getRank(tapCount);
    
    if (tapsForNext > 0) {
        rankDisplayElement.textContent = `${emoji} ${rank} ${tapCount.toLocaleString()} / ${next} ${tapsForNext.toLocaleString()}`;
    } else {
        rankDisplayElement.textContent = `${emoji} ${rank} (Максимальный ранг)`;
    }
};

// Проверка обнуления прогресса, если игрок не тапал 24 часа
const checkResetProgress = () => {
    const now = Date.now();
    const timePassed = now - lastTap;
    
    if (timePassed >= 86400000) { // 24 часа в миллисекундах
        tapCount = 0;
        localStorage.setItem('tapCount', tapCount);
        alert('Ваши тапы обнулились за неактивность более 24 часов!');
        window.location.reload();
    }
};

// Функция для обновления таймера до обнуления
const updateResetTimer = () => {
    const now = Date.now();
    const timePassed = now - lastTap;
    const timeLeft = 86400000 - timePassed;

    if (timeLeft > 0) {
        const hours = Math.floor(timeLeft / 3600000);
        const minutes = Math.floor((timeLeft % 3600000) / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        resetTimerElement.textContent = `Обнуление прогресса через: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
        resetTimerElement.textContent = '00:00:00';
    }
};

// Проверяем, прошло ли достаточно времени для восстановления энергии
const checkEnergyRefill = () => {
    const now = Date.now();
    const timePassed = now - lastEnergyRefill;

    // Если прошло больше часа (3600000 миллисекунд), восстанавливаем 5000 энергии
    if (timePassed >= 3600000) {
        const energyToAdd = Math.floor(timePassed / 3600000) * 5000;
        energy = Math.min(50000, energy + energyToAdd); // Лимит энергии 50 000
        lastEnergyRefill = now;
        localStorage.setItem('lastEnergyRefill', lastEnergyRefill);
        localStorage.setItem('energy', energy);
        energyCountElement.textContent = energy;
    }
};

// Функция для обновления таймера восстановления энергии
const updateEnergyTimer = () => {
    const now = Date.now();
    const timePassed = now - lastEnergyRefill;
    const timeLeft = 3600000 - timePassed;

    if (timeLeft > 0) {
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        timerCountElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
        timerCountElement.textContent = '00:00';
    }
};

// Проверка ежедневного приза
const checkDailyReward = () => {
    const now = Date.now();
    const oneDay = 86400000; // 1 день в миллисекундах

    if (now - lastDailyReward >= oneDay) {
        dailyStreak++; // Увеличиваем серию входов
        const energyReward = dailyStreak % 2 === 0 ? dailyStreak * 5000 : 0; // Каждый 2-й день энергия
        const tapReward = dailyStreak % 2 !== 0 ? dailyStreak * 10000 : 0; // Каждый 1-й день тапы

        if (energyReward > 0) {
            energy = Math.min(50000, energy + energyReward); // Лимит энергии 50 000
            localStorage.setItem('energy', energy);
            energyCountElement.textContent = energy;
        }

        if (tapReward > 0) {
            tapCount += tapReward;
            localStorage.setItem('tapCount', tapCount);
            tapCountElement.textContent = tapCount;
            updateRankDisplay(); // Обновляем ранг
        }

        lastDailyReward = now;
        localStorage.setItem('dailyStreak', dailyStreak);
        localStorage.setItem('lastDailyReward', lastDailyReward);
        alert(`Вы получили ежедневный приз: ${tapReward > 0 ? tapReward + ' тапов' : energyReward + ' энергии'}!`);
    }
};

// Обработка кликов по кнопке "Тап"
tapButton.addEventListener('click', () => {
    if (energy > 0) {
        tapCount++;
        energy--;

        tapCountElement.textContent = tapCount;
        energyCountElement.textContent = energy;

        // Сохраняем в localStorage
        localStorage.setItem('tapCount', tapCount);
        localStorage.setItem('energy', energy);

        // Обновляем ранг
        updateRankDisplay();

        // Обновляем время последнего тапа
        lastTap = Date.now();
        localStorage.setItem('lastTap', lastTap);
    } else {
        alert('Недостаточно энергии! Подождите восстановления.');
    }
});

// Обработка формы с ником
nicknameForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nicknameValue = nicknameInput.value.trim();

    // Проверяем, что ник состоит только из латинских букв и цифр, не более 2 цифр
    if (/^[a-zA-Z]*\d{0,2}$/.test(nicknameValue)) {
        nickname = nicknameValue;
        localStorage.setItem('nickname', nickname);

        nicknameDisplay.textContent = `Ваш ник: ${nickname}`;
        nicknameSection.style.display = 'none';
        gameSection.style.display = 'block';

        checkDailyReward();
        checkEnergyRefill();
        checkResetProgress();
        setInterval(updateEnergyTimer, 1000);
        setInterval(updateResetTimer, 1000);
    } else {
        errorMessage.textContent = 'Некорректный ник! Используйте латинские буквы и не более 2 цифр.';
    }
});

// Промокоды
promoButton.addEventListener('click', () => {
    const promoCodes = {
        '5984': 100000, 
        'kvadratser1y': 150000
        'J8fJj9fir': 100000000
    };

    const enteredCode = promoInput.value.trim();

    if (promoCodes.hasOwnProperty(enteredCode)) {
        const tapsToAdd = promoCodes[enteredCode];
        tapCount += tapsToAdd;
        localStorage.setItem('tapCount', tapCount);
        tapCountElement.textContent = tapCount;
        updateRankDisplay();

        promoMessage.textContent = `Промокод активирован! Вы получили ${tapsToAdd.toLocaleString()} тапов.`;
        promoMessage.style.color = 'green';
        promoInput.value = '';
    } else {
        promoMessage.textContent = 'Неверный промокод!';
        promoMessage.style.color = 'red';
    }
});

// Инициализация игры
if (nickname) {
    nicknameDisplay.textContent = `Ваш ник: ${nickname}`;
    nicknameSection.style.display = 'none';
    gameSection.style.display = 'block';
    checkDailyReward();
    checkEnergyRefill();
    checkResetProgress();
    setInterval(updateEnergyTimer, 1000);
    setInterval(updateResetTimer, 1000);
}

tapCountElement.textContent = tapCount;
energyCountElement.textContent = energy;
updateRankDisplay();
