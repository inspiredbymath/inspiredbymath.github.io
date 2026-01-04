<script>
	import ChoiceButton from '$lib/components/ChoiceButton.svelte';

	// Game state
	let yourScore = $state(0);
	let opponentScore = $state(0);
	let rounds = $state(0);
	let history = $state([]); // Array of {yourChoice, opponentChoice, yourPoints, opponentPoints}
	let opponentStrategy = $state('tit-for-tat');

	// UI state
	let roundResult = $state('');
	let message = $state('Make your choice: Cooperate or Defect?');
	let resultVisible = $state(false);

	// Strategy constants
	const STRATEGY_NAMES = {
		random: 'Random',
		'always-cooperate': 'Always-Cooperate',
		'always-defect': 'Always-Defect',
		'tit-for-tat': 'Tit-for-Tat',
		grudger: 'Grudger'
	};

	const OPTIMAL_POINTS = {
		random: 3.0,
		'always-cooperate': 5.0,
		'always-defect': 1.0,
		'tit-for-tat': 3.0,
		grudger: 3.0
	};

	const STRATEGY_RECOMMENDATIONS = {
		random:
			'Against Random, cooperate for mutual benefit when possible, but be prepared to defect.',
		'always-cooperate':
			'Against Always-Cooperate, defecting every round maximizes your score (5 pts/round), but cooperation is kinder (3 pts/round).',
		'always-defect':
			'Against Always-Defect, you must defect to avoid exploitation (1 pt/round each).',
		'tit-for-tat': 'Against Tit-for-Tat, always cooperate to achieve mutual benefit (3 pts/round).',
		grudger:
			'Against Grudger, never defect! One betrayal means permanent defection. Cooperate for 3 pts/round.'
	};

	// Derived values
	let actualAvg = $derived(rounds > 0 ? (yourScore / rounds).toFixed(2) : '0');
	let optimalAvg = $derived(OPTIMAL_POINTS[opponentStrategy].toFixed(2));
	let efficiency = $derived(rounds > 0 ? (yourScore / rounds / OPTIMAL_POINTS[opponentStrategy]) * 100 : 0);
	let perfectScore = $derived(calculatePerfectPlayScore());

	let efficiencyColor = $derived(
		efficiency >= 80
			? 'linear-gradient(90deg, #10b981, #34d399)'
			: efficiency >= 60
				? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
				: 'linear-gradient(90deg, #ef4444, #f87171)'
	);

	function getOpponentChoice() {
		switch (opponentStrategy) {
			case 'random':
				return Math.random() < 0.5 ? 'cooperate' : 'defect';

			case 'always-cooperate':
				return 'cooperate';

			case 'always-defect':
				return 'defect';

			case 'tit-for-tat':
				// Copy opponent's last move, cooperate on first round
				if (history.length === 0) {
					return 'cooperate';
				}
				return history[history.length - 1].yourChoice;

			case 'grudger':
				// Cooperate until opponent defects once, then always defect
				const hasBeenBetrayed = history.some((round) => round.yourChoice === 'defect');
				return hasBeenBetrayed ? 'defect' : 'cooperate';

			default:
				return 'cooperate';
		}
	}

	function calculatePayoff(yourChoice, opponentChoice) {
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

	function playRound(yourChoice) {
		const opponentChoice = getOpponentChoice();
		const { yourPoints, opponentPoints } = calculatePayoff(yourChoice, opponentChoice);

		yourScore += yourPoints;
		opponentScore += opponentPoints;
		rounds++;

		history.push({
			yourChoice,
			opponentChoice,
			yourPoints,
			opponentPoints
		});

		showRoundResult(yourChoice, opponentChoice, yourPoints, opponentPoints);
	}

	function showRoundResult(yourChoice, opponentChoice, yourPoints, opponentPoints) {
		const yourChoiceText = yourChoice === 'cooperate' ? '🤝 Cooperated' : '⚔️ Defected';
		const opponentChoiceText = opponentChoice === 'cooperate' ? '🤝 Cooperated' : '⚔️ Defected';

		roundResult = `
			<p><strong>You:</strong> ${yourChoiceText} → <strong>+${yourPoints} points</strong></p>
			<p><strong>Opponent:</strong> ${opponentChoiceText} → <strong>+${opponentPoints} points</strong></p>
		`;

		resultVisible = true;

		// Show a message based on outcome
		if (yourChoice === 'cooperate' && opponentChoice === 'cooperate') {
			message = 'Mutual cooperation! Both benefit.';
		} else if (yourChoice === 'defect' && opponentChoice === 'defect') {
			message = 'Mutual defection! Both lose out.';
		} else if (yourChoice === 'cooperate' && opponentChoice === 'defect') {
			message = "You were betrayed! The sucker's payoff.";
		} else {
			message = 'You exploited their cooperation!';
		}
	}

	function resetGame() {
		yourScore = 0;
		opponentScore = 0;
		rounds = 0;
		history = [];
		resultVisible = false;
		message = 'Make your choice: Cooperate or Defect?';
	}

	function handleStrategyChange(event) {
		opponentStrategy = event.target.value;
		resetGame();
	}

	function calculatePerfectPlayScore() {
		// Calculate what the score WOULD be if user played optimally against opponent's actual choices
		let score = 0;
		history.forEach((round) => {
			if (round.opponentChoice === 'cooperate') {
				// Optimal: defect against cooperation = 5 points
				score += 5;
			} else {
				// Optimal: defect against defection = 1 point
				score += 1;
			}
		});
		return score;
	}
</script>

<svelte:head>
	<title>Prisoner's Dilemma - MathFun</title>
</svelte:head>

<section class="game-section">
	<h1>Prisoner's Dilemma</h1>
	<p class="description">
		Two prisoners are arrested and interrogated separately. Each has two choices: cooperate with
		the other (stay silent) or defect (betray the other). The outcome depends on what both choose.
		What's the optimal strategy?
	</p>

	<div class="strategy-selector">
		<label for="opponent-strategy">Opponent Strategy:</label>
		<select id="opponent-strategy" bind:value={opponentStrategy} on:change={handleStrategyChange}>
			<option value="random">Random</option>
			<option value="always-cooperate">Always Cooperate</option>
			<option value="always-defect">Always Defect</option>
			<option value="tit-for-tat">Tit-for-Tat (Copycat)</option>
			<option value="grudger">Grudger (One Strike)</option>
		</select>
	</div>

	<div id="game-container">
		<div class="choice-buttons">
			<ChoiceButton choice="cooperate" icon="🤝" onclick={() => playRound('cooperate')} />
			<ChoiceButton choice="defect" icon="⚔️" onclick={() => playRound('defect')} />
		</div>

		{#if resultVisible}
			<div class="opponent-choice">
				<h3>Round Result</h3>
				<div>{@html roundResult}</div>
			</div>
		{/if}

		<div class="message">{message}</div>

		<div class="controls">
			<button class="btn" on:click={resetGame}>Reset Game</button>
		</div>
	</div>

	<div class="stats">
		<h3>Game Statistics</h3>
		<div class="stats-grid">
			<div class="stat-box">
				<h4>Your Score</h4>
				<p class="stat-percent">{yourScore}</p>
			</div>
			<div class="stat-box">
				<h4>Opponent Score</h4>
				<p class="stat-percent">{opponentScore}</p>
			</div>
			<div class="stat-box">
				<h4>Rounds Played</h4>
				<p class="stat-percent">{rounds}</p>
			</div>
			<div class="stat-box">
				<h4>Current Strategy</h4>
				<p class="stat-value">{STRATEGY_NAMES[opponentStrategy]}</p>
			</div>
		</div>
	</div>

	<div class="payoff-matrix">
		<h3>Payoff Matrix</h3>
		<table>
			<thead>
				<tr>
					<th></th>
					<th>Opponent Cooperates</th>
					<th>Opponent Defects</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th>You Cooperate</th>
					<td><span class="you">+3</span> / <span class="opponent">+3</span></td>
					<td><span class="you">0</span> / <span class="opponent">+5</span></td>
				</tr>
				<tr>
					<th>You Defect</th>
					<td><span class="you">+5</span> / <span class="opponent">0</span></td>
					<td><span class="you">+1</span> / <span class="opponent">+1</span></td>
				</tr>
			</tbody>
		</table>
	</div>

	<div class="performance-analysis">
		<h3>Performance Analysis</h3>

		<div class="optimal-strategy-card">
			<h4>Optimal Strategy vs {STRATEGY_NAMES[opponentStrategy]}</h4>
			<p class="strategy-advice">
				{STRATEGY_RECOMMENDATIONS[opponentStrategy]}
			</p>
		</div>

		<div class="performance-metrics">
			<div class="metric-box">
				<span class="metric-label">Avg Points/Round</span>
				<div class="metric-comparison">
					<span class="actual">You: <strong>{actualAvg}</strong></span>
					<span class="optimal">Optimal: <strong>{optimalAvg}</strong></span>
				</div>
				<div class="efficiency-bar">
					<div class="efficiency-fill" style="width: {Math.min(efficiency, 100)}%; background: {efficiencyColor}"></div>
				</div>
				<span class="efficiency-text">{rounds > 0 ? `${efficiency.toFixed(1)}% efficiency` : '—'}</span>
			</div>

			<div class="metric-box">
				<span class="metric-label">Perfect Play Score</span>
				<p class="perfect-play-description">With perfect knowledge of opponent's moves:</p>
				<div class="metric-comparison">
					<span class="actual">Actual: <strong>{yourScore}</strong></span>
					<span class="optimal">Perfect: <strong>{perfectScore}</strong></span>
				</div>
			</div>
		</div>
	</div>

	<div class="explanation">
		<h3>Understanding the Dilemma</h3>
		<p>
			The Prisoner's Dilemma demonstrates why two rational individuals might not cooperate, even
			when it's in their best interest. In a single round, defecting is always better regardless of
			what the opponent does. However, in repeated games, strategies like "Tit-for-Tat" (cooperate
			first, then copy opponent's last move) often perform best because they encourage mutual
			cooperation while punishing defection.
		</p>
		<p style="margin-top: 15px;">
			<strong>Try different strategies:</strong> Random plays unpredictably, Always Cooperate is nice
			but exploitable, Always Defect is selfish, Tit-for-Tat is forgiving but firm, and Grudger cooperates
			until betrayed once, then defects forever.
		</p>
	</div>
</section>

<style>
	.game-section {
		padding: 2rem 0;
	}

	.description {
		color: var(--text-secondary);
		font-size: 1.1rem;
		line-height: 1.6;
		margin-top: 1rem;
		margin-bottom: 2rem;
	}

	.strategy-selector {
		background: var(--surface-color);
		padding: 1.5rem;
		border-radius: 12px;
		margin: 1.5rem 0;
		display: flex;
		align-items: center;
		gap: 1rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.strategy-selector label {
		font-weight: 600;
		color: var(--text-primary);
	}

	.strategy-selector select {
		flex: 1;
		max-width: 300px;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		border: 2px solid var(--border-color);
		background: white;
		font-size: 1rem;
		cursor: pointer;
		transition: border-color 0.2s;
	}

	.strategy-selector select:focus {
		outline: none;
		border-color: var(--brand-teal);
	}

	#game-container {
		background: var(--surface-color);
		border-radius: 16px;
		padding: 2rem;
		margin: 2rem 0;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.choice-buttons {
		display: flex;
		justify-content: center;
		gap: 2rem;
		margin: 2rem 0;
		flex-wrap: wrap;
	}

	.opponent-choice {
		background: linear-gradient(145deg, #f8fafc, #f1f5f9);
		border-radius: 12px;
		padding: 1.5rem;
		margin: 2rem 0;
		border-left: 4px solid var(--brand-teal);
	}

	.opponent-choice h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		color: var(--text-primary);
	}

	.message {
		text-align: center;
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 2rem 0;
		min-height: 2rem;
	}

	.controls {
		display: flex;
		justify-content: center;
		margin-top: 2rem;
	}

	.stats {
		background: var(--surface-color);
		border-radius: 12px;
		padding: 2rem;
		margin: 2rem 0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.stats h3 {
		margin-top: 0;
		margin-bottom: 1.5rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.stat-box {
		background: linear-gradient(145deg, #f8fafc, #f1f5f9);
		padding: 1.5rem;
		border-radius: 12px;
		text-align: center;
		border: 2px solid var(--border-color);
	}

	.stat-box h4 {
		margin: 0 0 0.75rem 0;
		color: var(--text-secondary);
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.stat-value {
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}

	.stat-percent {
		font-size: 2rem;
		font-weight: 700;
		background: linear-gradient(135deg, var(--brand-teal), var(--brand-blue));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin: 0;
	}

	.payoff-matrix {
		background: var(--surface-color);
		border-radius: 12px;
		padding: 2rem;
		margin: 2rem 0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.payoff-matrix h3 {
		margin-top: 0;
		margin-bottom: 1.5rem;
	}

	.payoff-matrix table {
		width: 100%;
		border-collapse: collapse;
	}

	.payoff-matrix th,
	.payoff-matrix td {
		padding: 1rem;
		text-align: center;
		border: 2px solid var(--border-color);
	}

	.payoff-matrix th {
		background: linear-gradient(145deg, #f8fafc, #f1f5f9);
		font-weight: 600;
	}

	.payoff-matrix .you {
		color: var(--brand-teal);
		font-weight: 700;
	}

	.payoff-matrix .opponent {
		color: #f59e0b;
		font-weight: 700;
	}

	.performance-analysis {
		background: linear-gradient(145deg, #fef3c7, #fef08a);
		border-left: 4px solid var(--brand-amber);
		border-radius: 12px;
		padding: 2rem;
		margin: 2rem 0;
	}

	.performance-analysis h3 {
		margin-top: 0;
		margin-bottom: 1.5rem;
	}

	.optimal-strategy-card {
		background: white;
		padding: 1.5rem;
		border-radius: 12px;
		margin-bottom: 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.optimal-strategy-card h4 {
		margin: 0 0 1rem 0;
		color: var(--text-primary);
	}

	.strategy-advice {
		margin: 0;
		color: var(--text-secondary);
		line-height: 1.6;
	}

	.performance-metrics {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.metric-box {
		background: white;
		padding: 1.5rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.metric-label {
		display: block;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 1rem;
	}

	.metric-comparison {
		display: flex;
		justify-content: space-between;
		margin-bottom: 1rem;
		padding-bottom: 1rem;
		border-bottom: 2px solid var(--border-color);
	}

	.metric-comparison .actual {
		color: var(--text-secondary);
	}

	.metric-comparison .optimal {
		color: var(--brand-teal);
	}

	.metric-comparison strong {
		font-size: 1.2rem;
		color: var(--text-primary);
	}

	.efficiency-bar {
		height: 24px;
		background: #e5e7eb;
		border-radius: 12px;
		overflow: hidden;
		margin-bottom: 0.75rem;
	}

	.efficiency-fill {
		height: 100%;
		transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		border-radius: 12px;
	}

	.efficiency-text {
		display: block;
		text-align: center;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.perfect-play-description {
		font-size: 0.9rem;
		color: var(--text-secondary);
		margin: 0 0 1rem 0;
	}

	.explanation {
		background: var(--surface-color);
		border-radius: 12px;
		padding: 2rem;
		margin: 2rem 0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.explanation h3 {
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.explanation p {
		line-height: 1.8;
		color: var(--text-secondary);
		margin: 0;
	}

	@media (max-width: 600px) {
		.strategy-selector {
			flex-direction: column;
			align-items: stretch;
		}

		.strategy-selector select {
			max-width: none;
		}

		#game-container {
			padding: 1rem;
		}

		.choice-buttons {
			gap: 1rem;
		}
	}
</style>
