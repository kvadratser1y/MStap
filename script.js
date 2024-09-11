document.addEventListener('DOMContentLoaded', () => {
    const tapArea = document.getElementById('tapArea');
    const tapCountElem = document.getElementById('tapCount');
    const energyCountElem = document.getElementById('energyCount');
    const timerCountElem = document.getElementById('timerCount');
    const subscribeBtn = document.getElementById('subscribeBtn');

    let tapCount = 0;
    let energy = 5000;
    const energyRegenTime = 3600; // seconds
    let lastTapTime = Date.now();
    let regenerationTimer = null;

    const updateDisplay = () => {
        tapCountElem.textContent = tapCount;
        energyCountElem.textContent = energy;
        const timeLeft = Math.max(0, Math.floor((lastTapTime + energyRegenTime * 1000 - Date.now()) / 1000));
        timerCountElem.textContent = timeLeft;
        if (timeLeft <= 0 && regenerationTimer === null) {
            regenerateEnergy();
        }
    };

    const regenerateEnergy = () => {
        regenerationTimer = setInterval(() => {
            energy = Math.min(5000, energy + 100); // Regenerate 100 energy per second
            if (energy >= 5000) {
                clearInterval(regenerationTimer);
                regenerationTimer = null;
            }
            updateDisplay();
        }, 1000);
    };

    tapArea.addEventListener('click', () => {
        const now = Date.now();
        if (energy > 0) {
            tapCount++;
            energy--;
            lastTapTime = now;
            updateDisplay();
        } else if (regenerationTimer === null) {
            updateDisplay();
        }
    });

    subscribeBtn.addEventListener('click', () => {
        window.location.href = 'https://www.paypal.com';
    });

    updateDisplay();
});
