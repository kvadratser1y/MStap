document.addEventListener('DOMContentLoaded', () => {
    const gameSection = document.getElementById('game-section');
    const rewardsSection = document.getElementById('rewards-section');
    const leaderboardSection = document.getElementById('leaderboard-section');
    const promocodesSection = document.getElementById('promocodes-section');
    const rebirthSection = document.getElementById('rebirth-section');
    const nicknameSection = document.getElementById('nickname-section');

    const mainBtn = document.getElementById('main-btn');
    const dailyRewardsBtn = document.getElementById('daily-rewards-btn');
    const leaderboardBtn = document.getElementById('leaderboard-btn');
    const promocodesBtn = document.getElementById('promocodes-btn');
    const rebirthBtn = document.getElementById('rebirth-btn');

    const referralLink = document.getElementById('referral-link');
    const shareReferralBtn = document.getElementById('share-referral');

    const nicknameForm = document.getElementById('nickname-form');
    const nicknameInput = document.getElementById('nickname-input');
    const nicknameDisplay = document.getElementById('nickname-display');
    const errorMessage = document.getElementById('error-message');

    const tapCountElement = document.getElementById('tap-count');
    const tapButton = document.getElementById('tap-button');
    const energyElement = document.getElementById('energy-count');
    const timerCountElement = document.getElementById('timer-count');

    const promoInput = document.getElementById('promo-code-input');
    const applyPromoBtn = document.getElementById('apply-promo');
    const promoMessage = document.getElementById('promo-message');

    const rebirthButton = document.getElementById('rebirth-button');

    let tapCount = 0;
    let energy = 5000;
    let nickname = '';
    let timer = 3600; // 1 час восстановления энергии
    let referralCode = Math.random().toString(36).substring(2, 10); // генерируем случайный реферальный код
    referralLink.innerHTML = `https://t.me/bmjcoinbot?start=${referralCode}`;

    // Функция для обновления отображения энергии
    function updateEnergy() {
        energyElement.innerText = energy;
    }

    // Таймер для восстановления энергии
    function startEnergyRecovery() {
        setInterval(() => {
            if (energy < 5000) {
                energy += 10; // Восстанавливаем по 10 единиц энергии каждые 10 секунд
                updateEnergy();
            }
        }, 10000);
    }

    // Таймер обратного отсчета
    function startTimer() {
        setInterval(() => {
            if (timer > 0) {
                timer--;
                const hours = String(Math.floor(timer / 3600)).padStart(2, '0');
                const minutes = String(Math.floor((timer % 3600) / 60)).padStart(2, '0');
                const seconds = String(timer % 60).padStart(2, '0');
                timerCountElement.innerText = `${hours}:${minutes}:${seconds}`;
            }
        }, 1000);
    }

    // Переключение между разделами
    function showSection(section) {
        gameSection.style.display = 'none';
        rewardsSection.style.display = 'none';
        leaderboardSection.style.display = 'none';
        promocodesSection.style.display = 'none';
        rebirthSection.style.display = 'none';

        section.style.display = 'block';
    }

    // Нажатие кнопок навигации
    mainBtn.addEventListener('click', () => showSection(gameSection));
    dailyRewardsBtn.addEventListener('click', () => showSection(rewardsSection));
    leaderboardBtn.addEventListener('click', () => showSection(leaderboardSection));
    promocodesBtn.addEventListener('click', () => showSection(promocodesSection));
    rebirthBtn.addEventListener('click', () => showSection(rebirthSection));

    // Форма ввода ника
    nicknameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        nickname = nicknameInput.value.trim();
        if (/^[a-zA-Z]+[0-9]{0,2}$/.test(nickname)) {
            nicknameDisplay.innerText = `Привет, ${nickname}!`;
            nicknameSection.style.display = 'none';
            gameSection.style.display = 'block';
        } else {
            errorMessage.innerText = 'Неверный формат ника!';
        }
    });

    // Нажатие на кнопку тапов
    tapButton.addEventListener('click', () => {
        if (energy > 0) {
            tapCount++;
            tapCountElement.innerText = tapCount;
            energy--;
            updateEnergy();
        }
    });

    // Применение промокода
    applyPromoBtn.addEventListener('click', () => {
        const promoCode = promoInput.value.trim();
        if (promoCode === 'DhInfirIlfo33') {
            tapCount += 100000000; // 100 миллионов тапов
            tapCountElement.innerText = tapCount;
            promoMessage.innerText = 'Промокод применён! Вы получили 100 миллионов тапов.';
        } else {
            promoMessage.innerText = 'Неверный промокод!';
        }
    });

    // Реферальная программа
    shareReferralBtn.addEventListener('click', () => {
        const shareText = `Играй со мной! Стань самым крутым диджеем в крипто-тусовке и получи токены через аирдроп!\n\nССЫЛКА: https://t.me/bmjcoinbot?start=${referralCode}\n\nБонус за друга: 1 000 000 ТАПОВ!`;
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Реферальная ссылка скопирована в буфер обмена!');
        });
    });

    // Перерождение
    rebirthButton.addEventListener('click', () => {
        let rebirthLevel = 0;
        if (tapCount >= 1000000000) {
            alert('Ты достиг последнего уровня перерождений!');
            rebirthLevel = 6;
        } else if (tapCount >= 100000000) {
            alert('Поздравляем с 5-м перерождением! +10000 тапов за тап и +10кк тапов в час');
            tapCount = 0;
            energy = 5000;
            rebirthLevel = 5;
        } else if (tapCount >= 10000000) {
            alert('Поздравляем с 4-м перерождением! +1000 тапов за тап и +1кк тапов в час');
            tapCount = 0;
            energy = 5000;
            rebirthLevel = 4;
        } else if (tapCount >= 1000000) {
            alert('Поздравляем с 3-м перерождением! +100 тапов за тап и +100к тапов в час');
            tapCount = 0;
            energy = 5000;
            rebirthLevel = 3;
        } else if (tapCount >= 100000) {
            alert('Поздравляем со 2-м перерождением! +10 тапов за тап и +10к тапов в час');
            tapCount = 0;
            energy = 5000;
            rebirthLevel = 2;
        } else if (tapCount >= 10000) {
            alert('Поздравляем с 1-м перерождением! +2 тапа за тап и +1к тапов в час');
            tapCount = 0;
            energy = 5000;
            rebirthLevel = 1;
        } else {
            alert('Недостаточно тапов для перерождения.');
        }
        tapCountElement.innerText = tapCount;
        updateEnergy();
    });

    // Запуск таймера восстановления энергии и обратного отсчета
    startEnergyRecovery();
    startTimer();
});

