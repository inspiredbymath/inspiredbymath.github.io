// Monty Hall Game Logic

class MontyHallGame {
    constructor() {
        this.carDoor = null;
        this.selectedDoor = null;
        this.revealedDoor = null;
        this.gamePhase = 'initial'; // initial, revealed, finished

        // Statistics
        this.stats = this.loadStats();

        this.initializeGame();
        this.setupEventListeners();
        this.updateStatsDisplay();
    }

    loadStats() {
        const saved = localStorage.getItem('montyHallStats');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            stayWins: 0,
            stayTotal: 0,
            switchWins: 0,
            switchTotal: 0
        };
    }

    saveStats() {
        localStorage.setItem('montyHallStats', JSON.stringify(this.stats));
    }

    initializeGame() {
        // Randomly place the car behind one of the three doors
        this.carDoor = Math.floor(Math.random() * 3);
        this.selectedDoor = null;
        this.revealedDoor = null;
        this.gamePhase = 'initial';

        // Reset door appearances
        const doors = document.querySelectorAll('.door');
        doors.forEach(door => {
            door.className = 'door';
            door.querySelector('.door-face').textContent = `Door ${parseInt(door.dataset.door) + 1}`;
        });

        this.updateMessage("Pick a door!");
    }

    setupEventListeners() {
        const doors = document.querySelectorAll('.door');
        doors.forEach(door => {
            door.addEventListener('click', () => this.handleDoorClick(parseInt(door.dataset.door)));
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

    handleDoorClick(doorNumber) {
        if (this.gamePhase === 'initial') {
            this.selectDoor(doorNumber);
        } else if (this.gamePhase === 'revealed') {
            this.makeFinalChoice(doorNumber);
        }
    }

    selectDoor(doorNumber) {
        this.selectedDoor = doorNumber;

        // Update visual
        const doors = document.querySelectorAll('.door');
        doors[doorNumber].classList.add('selected');

        // Host reveals a door with a goat
        this.revealGoatDoor();

        this.gamePhase = 'revealed';
        this.updateMessage("A goat is revealed! Do you want to switch or stay with your choice?");
    }

    revealGoatDoor() {
        // Find a door that is not the selected door and not the car door
        const availableDoors = [0, 1, 2].filter(door =>
            door !== this.selectedDoor && door !== this.carDoor
        );

        // Randomly pick one of the available doors to reveal
        this.revealedDoor = availableDoors[Math.floor(Math.random() * availableDoors.length)];

        // Update visual
        const doors = document.querySelectorAll('.door');
        doors[this.revealedDoor].classList.add('opened');
        doors[this.revealedDoor].classList.add('disabled');
    }

    makeFinalChoice(doorNumber) {
        // Can't pick the revealed door
        if (doorNumber === this.revealedDoor) {
            return;
        }

        const switched = doorNumber !== this.selectedDoor;
        const won = doorNumber === this.carDoor;

        // Update statistics
        if (switched) {
            this.stats.switchTotal++;
            if (won) this.stats.switchWins++;
        } else {
            this.stats.stayTotal++;
            if (won) this.stats.stayWins++;
        }

        this.saveStats();
        this.updateStatsDisplay();

        // Show results
        this.revealAllDoors(won, switched);

        this.gamePhase = 'finished';
    }

    revealAllDoors(won, switched) {
        const doors = document.querySelectorAll('.door');

        doors.forEach((door) => {
            const doorNumber = parseInt(door.dataset.door);
            door.classList.remove('selected', 'disabled');

            if (doorNumber === this.carDoor) {
                door.classList.add('winner');
            } else {
                door.classList.add('loser');
            }
        });

        const action = switched ? 'switched' : 'stayed';
        const result = won ? 'won' : 'lost';
        const emoji = won ? '🎉' : '😞';

        this.updateMessage(`You ${action} and ${result}! ${emoji}`);
    }

    updateMessage(text) {
        document.getElementById('message').textContent = text;
    }

    updateStatsDisplay() {
        document.getElementById('stay-wins').textContent = this.stats.stayWins;
        document.getElementById('stay-total').textContent = this.stats.stayTotal;
        document.getElementById('switch-wins').textContent = this.stats.switchWins;
        document.getElementById('switch-total').textContent = this.stats.switchTotal;

        const stayPercent = this.stats.stayTotal > 0
            ? Math.round((this.stats.stayWins / this.stats.stayTotal) * 100)
            : 0;
        const switchPercent = this.stats.switchTotal > 0
            ? Math.round((this.stats.switchWins / this.stats.switchTotal) * 100)
            : 0;

        document.getElementById('stay-percent').textContent = `${stayPercent}%`;
        document.getElementById('switch-percent').textContent = `${switchPercent}%`;
    }

    resetStats() {
        this.stats = {
            stayWins: 0,
            stayTotal: 0,
            switchWins: 0,
            switchTotal: 0
        };
        this.saveStats();
        this.updateStatsDisplay();
    }
}

// Initialize the game when the page loads
new MontyHallGame();
