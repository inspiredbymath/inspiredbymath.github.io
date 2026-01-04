<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import Door from '$lib/components/Door.svelte';

	// Game state
	let carDoor = $state(null);
	let selectedDoor = $state(null);
	let revealedDoor = $state(null);
	let gamePhase = $state('initial'); // initial, revealed, finished
	let message = $state('Pick a door!');

	// Statistics
	let stats = $state({
		stayWins: 0,
		stayTotal: 0,
		switchWins: 0,
		switchTotal: 0
	});

	// Related posts
	let relatedPosts = $state([]);

	// Derived statistics
	let stayPercent = $derived(
		stats.stayTotal > 0 ? Math.round((stats.stayWins / stats.stayTotal) * 100) : 0
	);
	let switchPercent = $derived(
		stats.switchTotal > 0 ? Math.round((stats.switchWins / stats.switchTotal) * 100) : 0
	);
	let stayRate = $derived(stats.stayTotal > 0 ? (stats.stayWins / stats.stayTotal) * 100 : 0);
	let switchRate = $derived(
		stats.switchTotal > 0 ? (stats.switchWins / stats.switchTotal) * 100 : 0
	);
	let stayVariance = $derived(stayRate - 33.3);
	let switchVariance = $derived(switchRate - 66.7);

	// Load stats from localStorage on mount
	onMount(() => {
		const saved = localStorage.getItem('montyHallStats');
		if (saved) {
			stats = JSON.parse(saved);
		}
	});

	// Save stats whenever they change
	$effect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('montyHallStats', JSON.stringify(stats));
		}
	});

	function initializeGame() {
		carDoor = Math.floor(Math.random() * 3);
		selectedDoor = null;
		revealedDoor = null;
		gamePhase = 'initial';
		message = 'Pick a door!';
	}

	function handleDoorClick(doorNumber) {
		if (gamePhase === 'initial') {
			selectDoor(doorNumber);
		} else if (gamePhase === 'revealed') {
			makeFinalChoice(doorNumber);
		}
	}

	function selectDoor(doorNumber) {
		selectedDoor = doorNumber;

		// Host reveals a door with a goat
		const availableDoors = [0, 1, 2].filter(
			(door) => door !== selectedDoor && door !== carDoor
		);
		revealedDoor = availableDoors[Math.floor(Math.random() * availableDoors.length)];

		gamePhase = 'revealed';
		message = 'A goat is revealed! Do you want to switch or stay with your choice?';
	}

	function makeFinalChoice(doorNumber) {
		// Can't pick the revealed door
		if (doorNumber === revealedDoor) {
			return;
		}

		const switched = doorNumber !== selectedDoor;
		const won = doorNumber === carDoor;

		// Update statistics
		if (switched) {
			stats.switchTotal++;
			if (won) stats.switchWins++;
		} else {
			stats.stayTotal++;
			if (won) stats.stayWins++;
		}

		// Update final selection
		selectedDoor = doorNumber;

		const action = switched ? 'switched' : 'stayed';
		const result = won ? 'won' : 'lost';
		const emoji = won ? '🎉' : '😞';

		message = `You ${action} and ${result}! ${emoji}`;
		gamePhase = 'finished';
	}

	function resetGame() {
		initializeGame();
	}

	function resetStats() {
		if (confirm('Are you sure you want to reset all statistics?')) {
			stats = {
				stayWins: 0,
				stayTotal: 0,
				switchWins: 0,
				switchTotal: 0
			};
		}
	}

	function getVarianceClass(variance, sampleSize) {
		if (sampleSize === 0) return '';
		const absVariance = Math.abs(variance);
		if (absVariance < 5) return 'good';
		if (absVariance < 15) return 'okay';
		return 'poor';
	}

	function formatVariance(variance, sampleSize) {
		if (sampleSize === 0) return '—';
		const sign = variance >= 0 ? '+' : '';
		return `${sign}${variance.toFixed(1)}%`;
	}

	// Initialize game on load
	initializeGame();
</script>

<svelte:head>
	<title>Monty Hall Problem - MathFun</title>
</svelte:head>

<section class="game-section">
	<h1>The Monty Hall Problem</h1>
	<p class="description">
		You're on a game show with 3 doors. Behind one is a car, behind the others are goats. You pick
		a door, then the host opens one of the other doors revealing a goat. Should you switch your
		choice or stay with your original pick?
	</p>

	<div id="game-container">
		<div class="doors">
			{#each [0, 1, 2] as doorNum}
				<Door
					doorNumber={doorNum}
					isSelected={selectedDoor === doorNum && gamePhase !== 'finished'}
					isOpened={revealedDoor === doorNum || gamePhase === 'finished'}
					isWinner={doorNum === carDoor}
					isDisabled={revealedDoor === doorNum && gamePhase === 'revealed'}
					onclick={() => handleDoorClick(doorNum)}
				/>
			{/each}
		</div>

		<div class="message">{message}</div>

		<div class="controls">
			<button class="btn" on:click={resetGame}>New Game</button>
		</div>
	</div>

	<div class="stats">
		<h3>Statistics</h3>
		<div class="stats-grid">
			<div class="stat-box">
				<h4>Stayed</h4>
				<p class="stat-value">
					<span>{stats.stayWins}</span> / <span>{stats.stayTotal}</span>
				</p>
				<p class="stat-percent">{stayPercent}%</p>
			</div>
			<div class="stat-box">
				<h4>Switched</h4>
				<p class="stat-value">
					<span>{stats.switchWins}</span> / <span>{stats.switchTotal}</span>
				</p>
				<p class="stat-percent">{switchPercent}%</p>
			</div>
		</div>
		<button class="btn btn-secondary" on:click={resetStats}>Reset Statistics</button>
	</div>

	<div class="strategy-analysis">
		<h3>Strategy Analysis</h3>
		<div class="analysis-grid">
			<div class="analysis-card">
				<h4>Staying Strategy</h4>
				<div class="stat-comparison">
					<span class="label">Your Win Rate:</span>
					<span class="value">{stayRate.toFixed(1)}%</span>
				</div>
				<div class="stat-comparison">
					<span class="label">Optimal Win Rate:</span>
					<span class="value optimal">33.3%</span>
				</div>
				<div class="variance">
					<span class="variance-label">Variance:</span>
					<span class="variance-value {getVarianceClass(stayVariance, stats.stayTotal)}">
						{formatVariance(stayVariance, stats.stayTotal)}
					</span>
				</div>
			</div>

			<div class="analysis-card">
				<h4>Switching Strategy</h4>
				<div class="stat-comparison">
					<span class="label">Your Win Rate:</span>
					<span class="value">{switchRate.toFixed(1)}%</span>
				</div>
				<div class="stat-comparison">
					<span class="label">Optimal Win Rate:</span>
					<span class="value optimal">66.7%</span>
				</div>
				<div class="variance">
					<span class="variance-label">Variance:</span>
					<span class="variance-value {getVarianceClass(switchVariance, stats.switchTotal)}">
						{formatVariance(switchVariance, stats.switchTotal)}
					</span>
				</div>
			</div>
		</div>
		<p class="analysis-note">
			The Monty Hall paradox shows switching gives you twice the chance of winning!
		</p>
	</div>

	<div class="explanation">
		<h3>Why Switching Works</h3>
		<p>
			Counterintuitively, switching gives you a 2/3 chance of winning! Here's why: When you first
			pick, you have a 1/3 chance of choosing the car and a 2/3 chance of choosing a goat. The host
			always opens a goat door from the remaining doors. If you picked a goat initially (2/3
			probability), switching will always win. If you picked the car (1/3 probability), switching
			loses. So switching wins 2/3 of the time!
		</p>
	</div>

	{#if relatedPosts.length > 0}
		<div class="related-posts">
			<h3>Related Articles</h3>
			<div class="related-posts-list">
				{#each relatedPosts as post}
					<a href="{base}/blog/{post.slug}" class="related-post-card">
						<h4>{post.title}</h4>
						<p>{post.excerpt}</p>
					</a>
				{/each}
			</div>
		</div>
	{/if}
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

	#game-container {
		background: var(--surface-color);
		border-radius: 16px;
		padding: 2rem;
		margin: 2rem 0;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.doors {
		display: flex;
		justify-content: center;
		gap: 2rem;
		margin: 2rem 0;
		flex-wrap: wrap;
	}

	.message {
		text-align: center;
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 2rem 0;
		min-height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
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
		margin-bottom: 1.5rem;
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
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0.5rem 0;
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

	.strategy-analysis {
		background: linear-gradient(145deg, #fef3c7, #fef08a);
		border-left: 4px solid var(--brand-amber);
		border-radius: 12px;
		padding: 2rem;
		margin: 2rem 0;
	}

	.strategy-analysis h3 {
		margin-top: 0;
		margin-bottom: 1.5rem;
	}

	.analysis-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.analysis-card {
		background: white;
		padding: 1.5rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.analysis-card h4 {
		margin: 0 0 1rem 0;
		color: var(--text-primary);
	}

	.stat-comparison {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.75rem;
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--border-color);
	}

	.stat-comparison:last-of-type {
		border-bottom: 2px solid var(--border-color);
		margin-bottom: 1rem;
	}

	.stat-comparison .label {
		color: var(--text-secondary);
		font-size: 0.9rem;
	}

	.stat-comparison .value {
		font-weight: 600;
		color: var(--text-primary);
	}

	.stat-comparison .optimal {
		color: var(--brand-teal);
	}

	.variance {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem;
		background: #f8fafc;
		border-radius: 8px;
	}

	.variance-label {
		font-size: 0.9rem;
		color: var(--text-secondary);
	}

	.variance-value {
		font-weight: 700;
		font-size: 1.1rem;
	}

	.variance-value.good {
		color: #10b981;
	}

	.variance-value.okay {
		color: #f59e0b;
	}

	.variance-value.poor {
		color: #ef4444;
	}

	.analysis-note {
		text-align: center;
		font-style: italic;
		color: var(--text-secondary);
		margin: 0;
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

	.related-posts {
		margin: 3rem 0;
	}

	.related-posts h3 {
		margin-bottom: 1.5rem;
	}

	.related-posts-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.related-post-card {
		background: var(--surface-color);
		border-radius: 12px;
		padding: 1.5rem;
		text-decoration: none;
		color: var(--text-primary);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.related-post-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	}

	.related-post-card h4 {
		margin: 0 0 0.75rem 0;
		color: var(--brand-teal);
	}

	.related-post-card p {
		margin: 0;
		color: var(--text-secondary);
		font-size: 0.9rem;
		line-height: 1.5;
	}

	@media (max-width: 600px) {
		#game-container {
			padding: 1rem;
		}

		.doors {
			gap: 1rem;
		}

		.message {
			font-size: 1rem;
		}
	}
</style>
