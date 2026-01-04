<script>
	import { base } from '$app/paths';
	import { DoorOpen, Handshake, TrendingUp } from 'lucide-svelte';

	const simulations = [
		{
			id: 'monty-hall',
			title: 'Monty Hall Problem',
			description:
				'Should you switch doors? Discover the counterintuitive probability that confuses even mathematicians.',
			Icon: DoorOpen,
			color: 'indigo'
		},
		{
			id: 'prisoners-dilemma',
			title: "Prisoner's Dilemma",
			description:
				'Explore game theory through the classic cooperation vs betrayal scenario. Can you find the optimal strategy?',
			Icon: Handshake,
			color: 'teal'
		},
		{
			id: 'staircase',
			title: 'Staircase Paths',
			description:
				'How many ways can you climb a staircase? Visualize the Fibonacci sequence in action.',
			Icon: TrendingUp,
			color: 'blue'
		}
	];
</script>

<svelte:head>
	<title>Simulations - MathFun</title>
</svelte:head>

<section class="simulations-section">
	<header class="section-header">
		<h1>Interactive Simulations</h1>
		<p class="subtitle">Experience mathematical concepts through hands-on exploration</p>
	</header>

	<div class="simulations-grid">
		{#each simulations as sim}
			<a href="{base}/{sim.id}" class="simulation-card glass-frosted glow-{sim.color}">
				<div class="card-icon">
					<svelte:component this={sim.Icon} size={48} strokeWidth={1.5} />
				</div>
				<h2>{sim.title}</h2>
				<p>{sim.description}</p>
				<span class="play-button">Play →</span>
			</a>
		{/each}
	</div>
</section>

<style>
	.simulations-section {
		padding: 2rem 0;
	}

	.section-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.section-header h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
		background: linear-gradient(135deg, var(--brand-teal), var(--brand-blue));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.subtitle {
		font-size: 1.2rem;
		color: var(--text-secondary);
	}

	.simulations-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 2rem;
		margin: 2rem 0;
	}

	.simulation-card {
		padding: 2rem;
		border-radius: 24px;
		text-decoration: none;
		color: var(--color-text-primary);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	.simulation-card:hover {
		transform: translateY(-8px) scale(1.02);
	}

	.card-icon {
		margin-bottom: 1.5rem;
		color: var(--indigo-500);
		transition: all 0.3s ease;
	}

	.simulation-card:hover .card-icon {
		transform: scale(1.1);
	}

:global([data-theme="dark"]) .card-icon {
		color: var(--indigo-400);
	}

	.simulation-card h2 {
		margin: 0 0 1rem 0;
		font-size: 1.5rem;
	}

	.simulation-card p {
		color: var(--text-secondary);
		line-height: 1.6;
		margin-bottom: 1.5rem;
		flex-grow: 1;
	}

	.play-button {
		color: var(--brand-teal);
		font-weight: 600;
		transition: color 0.2s;
	}

	.simulation-card:hover .play-button {
		color: var(--brand-blue);
	}
</style>
