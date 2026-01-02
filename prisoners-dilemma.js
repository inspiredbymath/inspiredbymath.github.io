// Prisoner's Dilemma Game Logic

class PrisonersDilemmaGame {
    constructor() {
        this.yourScore = 0;
        this.opponentScore = 0;
        this.rounds = 0;
        this.history = []; // Array of {yourChoice, opponentChoice, yourPoints, opponentPoints}
        this.opponentStrategy = 'tit-for-tat';

        this.setupEventListeners();
        this.updateDisplay();
    }

    setupEventListeners() {
        document.getElementById('cooperate-btn').addEventListener('click', () => {
            this.playRound('cooperate');
        });

        document.getElementById('defect-btn').addEventListener('click', () => {
            this.playRound('defect');
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetGame();
        });

        document.getElementById('opponent-strategy').addEventListener('change', (e) => {
            this.opponentStrategy = e.target.value;
            this.resetGame();
        });
    }

    getOpponentChoice() {
        switch (this.opponentStrategy) {
            case 'random':
                return Math.random() < 0.5 ? 'cooperate' : 'defect';

            case 'always-cooperate':
                return 'cooperate';

            case 'always-defect':
                return 'defect';

            case 'tit-for-tat':
                // Copy opponent's last move, cooperate on first round
                if (this.history.length === 0) {
                    return 'cooperate';
                }
                return this.history[this.history.length - 1].yourChoice;

            case 'grudger':
                // Cooperate until opponent defects once, then always defect
                const hasBeenBetrayed = this.history.some(round => round.yourChoice === 'defect');
                return hasBeenBetrayed ? 'defect' : 'cooperate';

            default:
                return 'cooperate';
        }
    }

    calculatePayoff(yourChoice, opponentChoice) {
        // Payoff matrix:
        // Both cooperate: 3, 3
        // You cooperate, opponent defects: 0, 5
        // You defect, opponent cooperates: 5, 0
        // Both defect: 1, 1

        if (yourChoice === 'cooperate' && opponentChoice === 'cooperate') {
            return { yourPoints: 3, opponentPoints: 3 };
        } else if (yourChoice === 'cooperate' && opponentChoice === 'defect') {
            return { yourPoints: 0, opponentPoints: 5 };
        } else if (yourChoice === 'defect' && opponentChoice === 'cooperate') {
            return { yourPoints: 5, opponentPoints: 0 };
        } else {
            // Both defect
            return { yourPoints: 1, opponentPoints: 1 };
        }
    }

    playRound(yourChoice) {
        const opponentChoice = this.getOpponentChoice();
        const { yourPoints, opponentPoints } = this.calculatePayoff(yourChoice, opponentChoice);

        this.yourScore += yourPoints;
        this.opponentScore += opponentPoints;
        this.rounds++;

        this.history.push({
            yourChoice,
            opponentChoice,
            yourPoints,
            opponentPoints
        });

        this.showRoundResult(yourChoice, opponentChoice, yourPoints, opponentPoints);
        this.updateDisplay();
    }

    showRoundResult(yourChoice, opponentChoice, yourPoints, opponentPoints) {
        const resultArea = document.getElementById('result-area');
        const resultDiv = document.getElementById('round-result');

        const yourChoiceText = yourChoice === 'cooperate' ? '🤝 Cooperated' : '⚔️ Defected';
        const opponentChoiceText = opponentChoice === 'cooperate' ? '🤝 Cooperated' : '⚔️ Defected';

        resultDiv.innerHTML = `
            <p><strong>You:</strong> ${yourChoiceText} → <strong>+${yourPoints} points</strong></p>
            <p><strong>Opponent:</strong> ${opponentChoiceText} → <strong>+${opponentPoints} points</strong></p>
        `;

        resultArea.style.display = 'block';

        // Show a message based on outcome
        let message = '';
        if (yourChoice === 'cooperate' && opponentChoice === 'cooperate') {
            message = 'Mutual cooperation! Both benefit.';
        } else if (yourChoice === 'defect' && opponentChoice === 'defect') {
            message = 'Mutual defection! Both lose out.';
        } else if (yourChoice === 'cooperate' && opponentChoice === 'defect') {
            message = 'You were betrayed! The sucker\'s payoff.';
        } else {
            message = 'You exploited their cooperation!';
        }

        document.getElementById('message').textContent = message;
    }

    updateDisplay() {
        document.getElementById('your-score').textContent = this.yourScore;
        document.getElementById('opponent-score').textContent = this.opponentScore;
        document.getElementById('rounds-played').textContent = this.rounds;

        const strategyNames = {
            'random': 'Random',
            'always-cooperate': 'Always Cooperate',
            'always-defect': 'Always Defect',
            'tit-for-tat': 'Tit-for-Tat',
            'grudger': 'Grudger'
        };

        document.getElementById('current-strategy').textContent = strategyNames[this.opponentStrategy];
    }

    resetGame() {
        this.yourScore = 0;
        this.opponentScore = 0;
        this.rounds = 0;
        this.history = [];

        document.getElementById('result-area').style.display = 'none';
        document.getElementById('message').textContent = 'Make your choice: Cooperate or Defect?';

        this.updateDisplay();
    }
}

// Initialize the game when the page loads
new PrisonersDilemmaGame();
