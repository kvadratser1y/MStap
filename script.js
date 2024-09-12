// Инициализация переменных
let tapCount = localStorage.getItem('tapCount') ? parseInt(localStorage.getItem('tapCount')) : 0;
let energy = localStorage.getItem('energy') ? parseInt(localStorage.getItem('energy')) : 5000;
let lastEnergyRefill = localStorage.getItem('lastEnergyRefill') ? parseInt(localStorage.getItem('lastEnergyRefill')) : Date.now();
let lastTap = localStorage.getItem('lastTap') ? parseInt(localStorage.getItem('lastTap')) : Date.now();
let nickname = localStorage.getItem('nickname');
let dailyStreak = localStorage.getItem('dailyStreak') ? parseInt(localStorage.getItem('dailyStreak')) : 0;
let lastDailyReward = localStorage.getItem('lastDailyReward') ? parseInt(localStorage.getItem('lastDailyReward')) : 0;
let rebirthCount = localStorage.getItem('rebirthCount') ? parseInt(localStorage.getItem('rebirthCount')) : 0;
let tapMultiplier = localStorage.getItem('tapMultiplier') ? parseInt(localStorage.getItem('tapMultiplier')) : 1;
let coinsPerHour = localStorage.getItem('coinsPerHour') ? parseInt(localStorage.getItem('coinsPerHour')) : 0;
let coins = localStorage.getItem('coins') ? parseInt(localStorage.getItem('coins')) : 0;
let currentRank = localStorage.getItem('currentRank') || "Бронза";

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
const rewardsTable = document.getElementById('rewards-tbody');

// Добавляем таймер обнуления под ником
nicknameDisplay.insertAdjacentElement('afterend', resetTimerElement);

// Функция для отображения нужной секции
const showSection = (sectionId) => {
    document.getElementById('nickname-section').style.display = 'none';
    document.getElementById('game-section').style.display = 'none';
    document.getElementById('leaderboard-section').style.display = 'none';
    document.getElementById(sectionId).style.display = 'block';
};

// Проверка на наличие ника и отображение соответствующих секций
if (nickname) {
    showSection('game-section');
    nicknameDisplay.textContent = `Привет, ${nickname}!`;
} else {
    showSection('nickname-section');
}

// Отображение таблицы лидеров
const updateLeaderboard = () => {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || {};
    leaderboardTable.innerHTML = '';

    // Сортируем таблицу по количеству тапов
    const sortedLeaderboard = Object.entries(leaderboard).sort((a, b) => b[1] - a[1]);

    // Ограничиваем отображение до топ-10
    sortedLeaderboard.slice(0, 10).forEach(([nickname, taps]) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${nickname}</td><td>${taps}</td>`;
        leaderboardTable.appendChild(row);
    });
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
        // Функция для обновления таймера до обнуления прогресса
const updateResetTimer = () => {
    const now = Date.now();
    const timePassed = now - lastTap;
    const timeLeft = 86400000 - timePassed; // 24 часа в миллисекундах

    // Если время вышло, сбрасываем прогресс и перезапускаем таймер
    if (timeLeft <= 0) {
        tapCount = 0;
        localStorage.setItem('tapCount', tapCount);
        lastTap = Date.now(); // Обновляем время последнего тапа, чтобы запустить новый цикл
        localStorage.setItem('lastTap', lastTap);
        alert('Ваши тапы обнулились за неактивность более 24 часов!');
        window.location.reload(); // Обновляем страницу
    } else {
        // Обновляем таймер на странице
        const hours = Math.floor(timeLeft / 3600000);
        const minutes = Math.floor((timeLeft % 3600000) / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        resetTimerElement.textContent = `Обнуление прогресса через: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
};

// Проверка обнуления прогресса каждые 10 секунд
setInterval(updateResetTimer, 10000);

// Вызов таймера сразу при загрузке страницы
updateResetTimer();

    }
};

// Функция для обновления таймера восстановления энергии
const updateEnergyTimer = () => {
    const now = Date.now();
    const timePassed = now - lastEnergyRefill;
    const timeLeft = 3600000 - timePassed; // Время до следующего восстановления (1 час)

    if (timeLeft > 0) {
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        timerCountElement.textContent = `Восстановление энергии через: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
        timerCountElement.textContent = '00:00:00';
    }
};

// Функция для ежедневных призов
const checkDailyReward = () => {
    const now = Date.now();
    const oneDay = 86400000; // 1 день в миллисекундах

    if (now - lastDailyReward >= oneDay) {
        dailyStreak++; // Увеличиваем серию входов
        let bonus;
        let rewardType;

        if (dailyStreak % 2 === 1) { // Если день нечетный
            bonus = 10000 + (dailyStreak / 2) * 5000; // Ежедневный приз в виде тапов
            tapCount += bonus;
            tapCountElement.textContent = tapCount;
            rewardType = 'Тапы';
        } else { // Если день четный
            bonus = 15000 + (dailyStreak / 2 - 1) * 5000; // Ежедневный приз в виде энергии
            energy = Math.min(energy + bonus, 50000); // Увеличиваем энергию, не превышая лимит
            energyCountElement.textContent = energy;
            rewardType = 'Энергия';
        }

        // Награда за 30-й день
        if (dailyStreak >= 30) {
            tapCount += 1000000;
            alert("Поздравляем! Вы получили 1 миллион тапов!");
        }

        // Обновляем и сохраняем
        localStorage.setItem('dailyStreak', dailyStreak);
        localStorage.setItem('tapCount', tapCount);
        localStorage.setItem('energy', energy);
        localStorage.setItem('lastDailyReward', now);

        // Добавляем запись о награде в таблицу
        const rewardDate = new Date(now).toLocaleDateString();
        const row = document.createElement('tr');
        row.innerHTML = `<td>${rewardDate}</td><td>${rewardType}</td><td>${bonus}</td>`;
        rewardsTable.appendChild(row);
    }
};

// Проверка восстановления энергии
const checkEnergyRefill = () => {
    const now = Date.now();
    const timePassed = now - lastEnergyRefill;

    if (timePassed >= 3600000) { // 1 час в миллисекундах
        const refillAmount = 5000;
        energy = Math.min(energy + refillAmount, 50000); // Добавляем энергию, не превышая лимит
        lastEnergyRefill = now;
        localStorage.setItem('energy', energy);
        localStorage.setItem('lastEnergyRefill', lastEnergyRefill);
        energyCountElement.textContent = energy;
    }
};

// Обработчик клика по кнопке тапов
tapButton.addEventListener('click', () => {
    checkResetProgress();
    checkEnergyRefill();

    if (energy > 0) {
        tapCount += tapMultiplier;
        tapCountElement.textContent = tapCount;
        energy -= 1; // Отнимаем одну единицу энергии за тап
        localStorage.setItem('tapCount', tapCount);
        localStorage.setItem('energy', energy);
        energyCountElement.textContent = energy;
        lastTap = Date.now();
        localStorage.setItem('lastTap', lastTap);
        updateRank();
    } else {
        alert('Недостаточно энергии для тапов!');
    }
});

// Обработчик формы для ввода ника
nicknameForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const inputNickname = nicknameInput.value.trim();

    // Проверяем валидность ника
    if (/^[a-zA-Z]{1,10}\d{0,2}$/.test(inputNickname)) {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || {};

        if (leaderboard[inputNickname]) {
            errorMessage.textContent = 'Ник уже существует. Пожалуйста, выберите другой.';
        } else {
            // Сохраняем ник, если он уникален
            localStorage.setItem('nickname', inputNickname);
            localStorage.setItem('tapCount', 0); // Обнуляем счетчик для нового пользователя
            localStorage.setItem('energy', 5000); // Восстанавливаем энергию
            showSection('game-section'); // Переходим к секции игры
            nicknameDisplay.textContent = `Привет, ${inputNickname}!`;
            nicknameInput.value = ''; // Очищаем поле ввода
            errorMessage.textContent = ''; // Очищаем сообщение об ошибке
            window.location.reload(); // Перезагружаем страницу, чтобы ник обновился
        }
    } else {
        errorMessage.textContent = 'Ник должен состоять из латинских букв и содержать максимум 2 цифры.';
    }
});

// Функция возрождения
const handleRebirth = () => {
    if (tapCount >= 10000) {
        const confirmation = confirm("Вы уверены, что хотите возродиться? Вы получите 2 тапа за 1 тап, 1000 монет в час, но все ваши монеты будут удалены.");
        if (confirmation) {
            tapMultiplier = 2;
            coinsPerHour = 1000;
            coins = 0;
            rebirthCount++;
            localStorage.setItem('rebirthCount', rebirthCount);
            localStorage.setItem('tapMultiplier', tapMultiplier);
            localStorage.setItem('coinsPerHour', coinsPerHour);
            localStorage.setItem('coins', coins);
            tapCount = 0;
            localStorage.setItem('tapCount', tapCount);
            alert("Вы возродились и теперь получаете 2 тапа за 1 тап, 1000 монет в час!");
        }
    } else {
        alert('Для возрождения вам нужно 10000 тапов.');
    }
};

// Проверка возрождения
const rebirthButton = document.createElement('button');
rebirthButton.textContent = 'Возродиться';
rebirthButton.className = 'subscribe-button';
rebirthButton.style.display = 'none';
gameSection.appendChild(rebirthButton);

if (tapCount >= 10000) {
    rebirthButton.style.display = 'block';
    rebirthButton.addEventListener('click', handleRebirth);
}

// Обновление ранга
const updateRank = () => {
    let rankText = '';
    let progress = '';

    if (tapCount >= 1000000000) { // 1 миллиард тапов
        currentRank = "Hellsteel 🟪";
    } else if (tapCount >= 100000000) { // 100 миллионов тапов
        currentRank = "Алмаз 🟦";
    } else if (tapCount >= 1000000) { // 1 миллион тапов
        currentRank = "Золото 🟨";
    } else if (tapCount >= 10000) { // 10 тысяч тапов
        currentRank = "Серебро ⬜";
    } else {
        currentRank = "Бронза 🟫";
    }

    // Определение прогресса до следующего ранга
    if (tapCount < 10000) {
        progress = `🟫 Bronze ${tapCount} / 10000`;
    } else if (tapCount < 1000000) {
        progress = `⬜ Silver ${tapCount - 10000} / 1000000`;
    } else if (tapCount < 100000000) {
        progress = `🟨 Gold ${tapCount - 1000000} / 100000000`;
    } else {
        progress = `🟦 Diamond ${tapCount - 100000000} / 1000000000`;
    }

    localStorage.setItem('currentRank', currentRank);
    document.getElementById('rank-display').textContent = `Ранг: ${currentRank} ${progress}`;
};

// Обновляем таймеры и ранк каждую секунду
setInterval(() => {
    updateResetTimer();
    updateEnergyTimer();
    checkDailyReward();
}, 1000);

// Инициализация
updateRank();
updateResetTimer();
updateEnergyTimer();
