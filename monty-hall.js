class MontyHallGame {
    constructor() {
        this.carDoor = null;
        this.selectedDoor = null;
        this.revealedDoor = null;
        this.gamePhase = 'initial';
        this.stats = this.loadStats();

        this.initializeGame();
        this.setupEventListeners();
        this.updateStatsDisplay();
    }

    loadStats() {
        const saved = localStorage.getItem('montyHallStats');
        return saved
            ? JSON.parse(saved)
            : { stayWins: 0, stayTotal: 0, switchWins: 0, switchTotal: 0 };
    }

    saveStats() {
        localStorage.setItem('montyHallStats', JSON.stringify(this.stats));
    }

    initializeGame() {
        this.carDoor = Math.floor(Math.random() * 3);
        this.selectedDoor = null;
        this.revealedDoor = null;
        this.gamePhase = 'initial';

        document.querySelectorAll('.door').forEach((door) => {
            door.className = 'door';
            door.querySelector('.door-mark').textContent = '';
        });

        this.updateMessage('Pick a door.');
    }

    setupEventListeners() {
        document.querySelectorAll('.door').forEach((door) => {
            door.addEventListener('click', () =>
                this.handleDoorClick(parseInt(door.dataset.door, 10))
            );
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.initializeGame();
        });

        document.getElementById('reset-stats').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all statistics?')) {
                this.resetStats();
            }
        });
    }

    handleDoorClick(doorIndex) {
        if (this.gamePhase === 'initial') {
            this.selectDoor(doorIndex);
        } else if (this.gamePhase === 'revealed') {
            this.makeFinalChoice(doorIndex);
        }
    }

    selectDoor(doorIndex) {
        this.selectedDoor = doorIndex;
        document.querySelectorAll('.door')[doorIndex].classList.add('is-selected');
        this.revealGoatDoor();
        this.gamePhase = 'revealed';
        this.updateMessage('A goat! Switch to the other door, or stay?');
    }

    revealGoatDoor() {
        const candidates = [0, 1, 2].filter(
            (door) => door !== this.selectedDoor && door !== this.carDoor
        );
        this.revealedDoor = candidates[Math.floor(Math.random() * candidates.length)];

        const doors = document.querySelectorAll('.door');
        doors[this.revealedDoor].classList.add('is-revealed');
        doors[this.revealedDoor].querySelector('.door-mark').textContent = '🐐';
    }

    makeFinalChoice(doorIndex) {
        if (doorIndex === this.revealedDoor) return;

        const switched = doorIndex !== this.selectedDoor;
        const won = doorIndex === this.carDoor;

        if (switched) {
            this.stats.switchTotal++;
            if (won) this.stats.switchWins++;
        } else {
            this.stats.stayTotal++;
            if (won) this.stats.stayWins++;
        }

        this.saveStats();
        this.updateStatsDisplay();
        this.revealAllDoors();
        this.gamePhase = 'finished';

        const action = switched ? 'switched' : 'stayed';
        this.updateMessage(
            won ? `You ${action} and won the car.` : `You ${action} and got a goat.`
        );
    }

    revealAllDoors() {
        document.querySelectorAll('.door').forEach((door) => {
            const index = parseInt(door.dataset.door, 10);
            door.classList.remove('is-selected', 'is-revealed');

            if (index === this.carDoor) {
                door.classList.add('is-car');
                door.querySelector('.door-mark').textContent = '🚗';
            } else {
                door.classList.add('is-goat');
                door.querySelector('.door-mark').textContent = '🐐';
            }
        });
    }

    updateMessage(text) {
        document.getElementById('message').textContent = text;
    }

    updateStatsDisplay() {
        document.getElementById('stay-wins').textContent = this.stats.stayWins;
        document.getElementById('stay-total').textContent = this.stats.stayTotal;
        document.getElementById('switch-wins').textContent = this.stats.switchWins;
        document.getElementById('switch-total').textContent = this.stats.switchTotal;

        const stayPct = this.pct(this.stats.stayWins, this.stats.stayTotal);
        const switchPct = this.pct(this.stats.switchWins, this.stats.switchTotal);

        document.getElementById('stay-percent').innerHTML = `${stayPct}<span class="unit">%</span>`;
        document.getElementById('switch-percent').innerHTML = `${switchPct}<span class="unit">%</span>`;
    }

    pct(wins, total) {
        return total > 0 ? Math.round((wins / total) * 100) : 0;
    }

    resetStats() {
        this.stats = { stayWins: 0, stayTotal: 0, switchWins: 0, switchTotal: 0 };
        this.saveStats();
        this.updateStatsDisplay();
    }
}

new MontyHallGame();
