const STRATEGY_NAMES = {
    'random': 'Random',
    'always-cooperate': 'Always Cooperate',
    'always-defect': 'Always Defect',
    'tit-for-tat': 'Tit-for-Tat',
    'grudger': 'Grudger',
};

// Best average score per round achievable against each strategy.
const OPTIMAL_AVERAGE = {
    'random': 3,
    'always-cooperate': 5,
    'always-defect': 1,
    'tit-for-tat': 3,
    'grudger': 3,
};

const STRATEGY_ADVICE = {
    'random': 'Against Random, cooperate for mutual benefit when you can, but stay ready to defect.',
    'always-cooperate': 'Against Always-Cooperate, defecting every round maximizes your score (5/round) — though cooperating is kinder (3/round).',
    'always-defect': 'Against Always-Defect you must defect too, or you get exploited. Best you can manage is 1/round.',
    'tit-for-tat': 'Against Tit-for-Tat, always cooperate — it mirrors you, so mutual cooperation (3/round) is the stable outcome.',
    'grudger': 'Against Grudger, never defect. A single betrayal turns it hostile forever. Cooperate for 3/round.',
};

class PrisonersDilemma {
    constructor() {
        this.yourScore = 0;
        this.opponentScore = 0;
        this.rounds = 0;
        this.history = [];
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

        document.getElementById('opponent-strategy').addEventListener('change', (event) => {
            this.opponentStrategy = event.target.value;
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
                return this.history.length === 0
                    ? 'cooperate'
                    : this.history[this.history.length - 1].yourChoice;
            case 'grudger':
                return this.history.some((round) => round.yourChoice === 'defect')
                    ? 'defect'
                    : 'cooperate';
            default:
                return 'cooperate';
        }
    }

    calculatePayoff(yourChoice, opponentChoice) {
        if (yourChoice === 'cooperate' && opponentChoice === 'cooperate') {
            return { yourPoints: 3, opponentPoints: 3 };
        }
        if (yourChoice === 'cooperate' && opponentChoice === 'defect') {
            return { yourPoints: 0, opponentPoints: 5 };
        }
        if (yourChoice === 'defect' && opponentChoice === 'cooperate') {
            return { yourPoints: 5, opponentPoints: 0 };
        }
        return { yourPoints: 1, opponentPoints: 1 };
    }

    playRound(yourChoice) {
        const opponentChoice = this.getOpponentChoice();
        const { yourPoints, opponentPoints } = this.calculatePayoff(yourChoice, opponentChoice);

        this.yourScore += yourPoints;
        this.opponentScore += opponentPoints;
        this.rounds++;
        this.history.push({ yourChoice, opponentChoice, yourPoints, opponentPoints });

        this.showRoundResult(yourChoice, opponentChoice, yourPoints, opponentPoints);
        this.updateDisplay();
    }

    showRoundResult(yourChoice, opponentChoice, yourPoints, opponentPoints) {
        const resultArea = document.getElementById('result-area');
        const roundResult = document.getElementById('round-result');
        const label = (choice) => (choice === 'cooperate' ? 'Cooperated' : 'Defected');

        roundResult.innerHTML = `
            <div>YOU · ${label(yourChoice)} → <span class="pts-you">+${yourPoints}</span></div>
            <div>OPPONENT · ${label(opponentChoice)} → <span class="pts-opp">+${opponentPoints}</span></div>
        `;
        resultArea.style.display = 'block';

        let message;
        if (yourChoice === 'cooperate' && opponentChoice === 'cooperate') {
            message = 'Mutual cooperation — both benefit.';
        } else if (yourChoice === 'defect' && opponentChoice === 'defect') {
            message = 'Mutual defection — both lose out.';
        } else if (yourChoice === 'cooperate' && opponentChoice === 'defect') {
            message = "You were betrayed — the sucker's payoff.";
        } else {
            message = 'You exploited their cooperation.';
        }

        document.getElementById('message').textContent = message;
    }

    updateDisplay() {
        document.getElementById('your-score').textContent = this.yourScore;
        document.getElementById('opponent-score').textContent = this.opponentScore;
        document.getElementById('rounds-played').textContent = this.rounds;
        this.updatePerformanceAnalysis();
    }

    updatePerformanceAnalysis() {
        document.getElementById('current-opponent').textContent =
            STRATEGY_NAMES[this.opponentStrategy];
        document.getElementById('strategy-recommendation').textContent =
            STRATEGY_ADVICE[this.opponentStrategy];

        const optimal = OPTIMAL_AVERAGE[this.opponentStrategy];
        document.getElementById('optimal-avg').textContent = optimal.toFixed(2);

        if (this.rounds === 0) {
            document.getElementById('actual-avg').textContent = '0';
            document.getElementById('efficiency-fill').style.width = '0%';
            document.getElementById('efficiency-text').textContent = '—';
            return;
        }

        const actual = this.yourScore / this.rounds;
        document.getElementById('actual-avg').textContent = actual.toFixed(2);

        const efficiency = Math.min((actual / optimal) * 100, 100);
        document.getElementById('efficiency-fill').style.width = `${efficiency}%`;
        document.getElementById('efficiency-text').textContent = `${efficiency.toFixed(0)}% efficiency`;
    }

    resetGame() {
        this.yourScore = 0;
        this.opponentScore = 0;
        this.rounds = 0;
        this.history = [];

        document.getElementById('result-area').style.display = 'none';
        document.getElementById('message').textContent = 'Make your choice: cooperate or defect?';
        this.updateDisplay();
    }
}

new PrisonersDilemma();
