import matter from 'gray-matter';

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
        this.loadRelatedPosts();
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
            this.updatePerformanceAnalysis();
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

        // Update performance analysis
        this.updatePerformanceAnalysis();
    }

    getOptimalPointsPerRound(strategy) {
        const optimal = {
            'random': 3.0, // Mixed strategy average
            'always-cooperate': 5.0, // Always defect
            'always-defect': 1.0, // Always defect
            'tit-for-tat': 3.0, // Always cooperate
            'grudger': 3.0 // Always cooperate
        };
        return optimal[strategy] || 3.0;
    }

    getStrategyRecommendation(strategy) {
        const recommendations = {
            'random': 'Against Random, cooperate for mutual benefit when possible, but be prepared to defect.',
            'always-cooperate': 'Against Always-Cooperate, defecting every round maximizes your score (5 pts/round), but cooperation is kinder (3 pts/round).',
            'always-defect': 'Against Always-Defect, you must defect to avoid exploitation (1 pt/round each).',
            'tit-for-tat': 'Against Tit-for-Tat, always cooperate to achieve mutual benefit (3 pts/round).',
            'grudger': 'Against Grudger, never defect! One betrayal means permanent defection. Cooperate for 3 pts/round.'
        };
        return recommendations[strategy] || 'Play cooperatively for mutual benefit.';
    }

    calculatePerfectPlayScore() {
        // Calculate what the score WOULD be if user played optimally against opponent's actual choices
        let perfectScore = 0;
        this.history.forEach(round => {
            if (round.opponentChoice === 'cooperate') {
                // Optimal: defect against cooperation = 5 points
                perfectScore += 5;
            } else {
                // Optimal: defect against defection = 1 point
                perfectScore += 1;
            }
        });
        return perfectScore;
    }

    updatePerformanceAnalysis() {
        // Update opponent name and strategy recommendation (always show these)
        const strategyNames = {
            'random': 'Random',
            'always-cooperate': 'Always-Cooperate',
            'always-defect': 'Always-Defect',
            'tit-for-tat': 'Tit-for-Tat',
            'grudger': 'Grudger'
        };
        document.getElementById('current-opponent').textContent = strategyNames[this.opponentStrategy];

        // Update strategy recommendation
        document.getElementById('strategy-recommendation').textContent =
            this.getStrategyRecommendation(this.opponentStrategy);

        // Only update performance metrics if rounds have been played
        if (this.rounds === 0) {
            // Reset to defaults when no rounds played
            document.getElementById('actual-avg').textContent = '0';
            document.getElementById('optimal-avg').textContent = this.getOptimalPointsPerRound(this.opponentStrategy).toFixed(2);
            document.getElementById('efficiency-fill').style.width = '0%';
            document.getElementById('efficiency-text').textContent = '—';
            document.getElementById('actual-score').textContent = '0';
            document.getElementById('perfect-score').textContent = '0';
            return;
        }

        // Calculate averages
        const actualAvg = (this.yourScore / this.rounds).toFixed(2);
        const optimalAvg = this.getOptimalPointsPerRound(this.opponentStrategy).toFixed(2);

        document.getElementById('actual-avg').textContent = actualAvg;
        document.getElementById('optimal-avg').textContent = optimalAvg;

        // Calculate efficiency
        const efficiency = (actualAvg / optimalAvg * 100);
        document.getElementById('efficiency-fill').style.width = `${Math.min(efficiency, 100)}%`;
        document.getElementById('efficiency-text').textContent = `${efficiency.toFixed(1)}% efficiency`;

        // Update efficiency bar color
        const fillBar = document.getElementById('efficiency-fill');
        if (efficiency >= 80) {
            fillBar.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
        } else if (efficiency >= 60) {
            fillBar.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
        } else {
            fillBar.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
        }

        // Perfect play score
        const perfectScore = this.calculatePerfectPlayScore();
        document.getElementById('actual-score').textContent = this.yourScore;
        document.getElementById('perfect-score').textContent = perfectScore;
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

    async loadRelatedPosts() {
        const postFiles = import.meta.glob('./posts/*.md', { as: 'raw' });
        const container = document.getElementById('related-posts-container');
        const relatedPosts = [];

        for (const path in postFiles) {
            const rawContent = await postFiles[path]();
            const { data } = matter(rawContent);

            if (data.game === 'prisoners-dilemma') {
                relatedPosts.push({
                    slug: data.slug,
                    title: data.title,
                    excerpt: data.excerpt,
                });
            }
        }

        if (relatedPosts.length > 0) {
            container.innerHTML = '<h3>Related Articles</h3>';
            const list = document.createElement('div');
            list.className = 'related-posts-list';

            relatedPosts.forEach(post => {
                const postLink = document.createElement('a');
                postLink.href = `./post.html?slug=${post.slug}`;
                postLink.className = 'related-post-card';
                postLink.innerHTML = `
                    <h4>${post.title}</h4>
                    <p>${post.excerpt}</p>
                `;
                list.appendChild(postLink);
            });

            container.appendChild(list);
        }
    }
}

// Initialize the game when the page loads
new PrisonersDilemmaGame();
