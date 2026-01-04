<script>
	import { base } from '$app/paths';
	import { Motion } from 'svelte-motion';
	import { ArrowRight, Brain, Zap, BookOpen } from 'lucide-svelte';
	import MagneticButton from '$lib/components/MagneticButton.svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();

	const fallbackTopics = [
		{ label: 'Probability', count: 0 },
		{ label: 'Algorithms', count: 0 }
	];

	const posts = $derived.by(() => data.posts ?? []);
	const topicsData = $derived.by(() => data.topics ?? []);
	const featuredSimulation = $derived.by(() => data.featuredSimulation ?? null);

	const buildTopicTiles = (topicsSource) => {
		const topics = topicsSource.length ? topicsSource : fallbackTopics;
		const selected = [...topics, ...fallbackTopics].slice(0, 2);
		const icons = [BookOpen, Brain];
		const colors = ['indigo', 'teal'];

		return selected.map((topic, index) => ({
			icon: icons[index],
			title: topic.label,
			kicker: `${topic.count} articles`,
			description: `Explore ${topic.label.toLowerCase()} through interactive essays and hands-on simulations.`,
			color: colors[index],
			href: `${base}/blog?tag=${encodeURIComponent(topic.label)}`
		}));
	};

	const tiles = $derived.by(() => {
		const simulation = featuredSimulation ?? {
			title: 'The Monty Hall Problem',
			description: 'Run the switch-or-stay experiment and watch the odds flip.',
			game: 'monty-hall'
		};

		const simulationTile = {
			icon: Zap,
			title: simulation.title,
			kicker: 'Featured simulation',
			description: simulation.description,
			color: 'amber',
			href: `${base}/${simulation.game}`
		};

		return [...buildTopicTiles(topicsData), simulationTile];
	});
</script>

<svelte:head>
	<title>Inspired By Math - Interactive Mathematics Journal</title>
</svelte:head>

<!-- Hero Section -->
<section class="hero-section">
	<div class="hero-content">
		<Motion
			let:motion
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<div use:motion>
				<span class="eyebrow">Inspired By Math</span>
				<h1 class="hero-title">
					The Beauty of <br />
					<span class="highlight">Mathematics</span> in Motion.
				</h1>
				<p class="hero-subtitle">
					A collection of interactive essays exploring probability, algorithms, and paradoxes.
				</p>

				<div class="hero-actions">
					<MagneticButton variant="primary" onclick={() => goto(`${base}/blog`)}>
						Start Reading
						<ArrowRight size={20} />
					</MagneticButton>
					<MagneticButton variant="secondary" onclick={() => goto(`${base}/simulations`)}>
						Browse Simulations
					</MagneticButton>
				</div>
			</div>
		</Motion>
	</div>
</section>

<!-- Features Grid (Bento Style) -->
<section class="features-section">
	<div class="container">
		<div class="features-header">
			<h2>Start with a path</h2>
			<p>Two popular topics plus a featured simulation, refreshed as new posts land.</p>
		</div>
		<div class="features-grid">
			{#each tiles as feature, i}
				{@const Icon = feature.icon}
				<Motion
					let:motion
					initial={{ opacity: 0, y: 20 }}
					whileHover={{ y: -5 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: i * 0.1 }}
				>
					<a use:motion class="feature-card" href={feature.href}>
						<div class="feature-icon bg-{feature.color}">
							<Icon size={28} strokeWidth={2} />
						</div>
						<span class="feature-kicker">{feature.kicker}</span>
						<h3>{feature.title}</h3>
						<p>{feature.description}</p>
						<span class="feature-action">
							Explore
							<ArrowRight size={18} />
						</span>
					</a>
				</Motion>
			{/each}
		</div>
	</div>
</section>

<!-- Latest Articles -->
<section class="latest-posts">
	<div class="container">
		<div class="section-header">
			<h2>Latest Entries</h2>
			<a href="{base}/blog" class="view-all">
				View Archive
				<ArrowRight size={18} />
			</a>
		</div>

		<div class="articles-list">
			{#each posts as post, i}
				<Motion
					let:motion
					initial={{ opacity: 0, x: -20 }}
					whileHover={{ x: 10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
				>
					<article use:motion class="article-item">
						<a href="{base}/blog/{post.slug}" class="article-link">
							<div class="article-meta">
								<time>
									{new Date(post.date).toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric'
									})}
								</time>
								<span class="category-tag">Mathematics</span>
							</div>
							<div class="article-content">
								<h3>{post.title}</h3>
								<p>{post.excerpt}</p>
							</div>
							<div class="article-arrow">
								<ArrowRight size={24} />
							</div>
						</a>
					</article>
				</Motion>
			{/each}
		</div>
	</div>
</section>

<style>
	/* Hero Section */
	.hero-section {
		min-height: 80vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 4rem 2rem;
		text-align: center;
		background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 50%);
	}

	.hero-content {
		max-width: 800px;
		margin: 0 auto;
	}

	.eyebrow {
		display: inline-block;
		font-family: var(--font-family-sans);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-size: 0.875rem;
		color: var(--indigo-600);
		margin-bottom: 1.5rem;
		background: var(--indigo-50);
		padding: 0.5rem 1rem;
		border-radius: 99px;
	}

	:global([data-theme="dark"]) .eyebrow {
		background: var(--indigo-900);
		color: var(--indigo-200);
	}

	.hero-title {
		font-size: clamp(3rem, 6vw, 5rem);
		font-weight: 800;
		line-height: 1.1;
		margin-bottom: 1.5rem;
		letter-spacing: -0.02em;
		color: var(--gray-900);
	}

	.highlight {
		color: var(--indigo-600);
		font-style: italic;
		font-family: var(--font-family-serif);
	}

	:global([data-theme="dark"]) .highlight {
		color: var(--indigo-400);
	}

	.hero-subtitle {
		font-family: var(--font-family-serif);
		font-size: 1.25rem;
		color: var(--gray-600);
		line-height: 1.8;
		margin-bottom: 3rem;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	:global([data-theme="dark"]) .hero-subtitle {
		color: var(--gray-400);
	}

	.hero-actions {
		display: flex;
		gap: 1.5rem;
		justify-content: center;
	}

	/* Features Section */
	.features-section {
		padding: 4rem 0;
	}

	.features-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 2rem;
		margin-bottom: 2.5rem;
	}

	.features-header h2 {
		font-size: 2.25rem;
		margin: 0;
	}

	.features-header p {
		color: var(--gray-600);
		max-width: 420px;
		margin: 0;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.feature-card {
		background: var(--color-surface);
		border: 1px solid var(--gray-200);
		padding: 2.5rem;
		border-radius: 16px;
		box-shadow: var(--shadow-sm);
		transition: border-color 0.3s ease;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		text-decoration: none;
		color: inherit;
	}

	:global([data-theme="dark"]) .feature-card {
		border-color: var(--gray-800);
	}

	.feature-card:hover {
		border-color: var(--indigo-500);
	}

	.feature-icon {
		width: 56px;
		height: 56px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 12px;
		margin-bottom: 1.5rem;
		color: white;
	}

	.bg-indigo { background: var(--indigo-600); }
	.bg-teal { background: var(--teal-600); }
	.bg-amber { background: var(--amber-500); }

	.feature-kicker {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-weight: 700;
		color: var(--gray-500);
	}

	.feature-card h3 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		font-family: var(--font-family-sans);
	}

	.feature-card p {
		color: var(--gray-600);
		line-height: 1.6;
	}

	:global([data-theme="dark"]) .feature-card p {
		color: var(--gray-400);
	}

	.feature-action {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
		color: var(--indigo-600);
		margin-top: auto;
	}

	/* Latest Posts Section */
	.latest-posts {
		padding: 6rem 0;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 3rem;
		border-bottom: 2px solid var(--gray-200);
		padding-bottom: 1rem;
	}

	:global([data-theme="dark"]) .section-header {
		border-color: var(--gray-800);
	}

	.section-header h2 {
		font-size: 2.5rem;
		margin: 0;
	}

	.view-all {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--indigo-600);
		font-weight: 600;
		transition: gap 0.2s ease;
	}

	.view-all:hover {
		gap: 0.75rem;
	}

	.articles-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.article-item {
		border-bottom: 1px solid var(--gray-200);
	}

	:global([data-theme="dark"]) .article-item {
		border-color: var(--gray-800);
	}

	.article-link {
		display: grid;
		grid-template-columns: 150px 1fr auto;
		gap: 2rem;
		padding: 2rem 0;
		align-items: center;
		transition: opacity 0.2s ease;
	}

	.article-link:hover {
		opacity: 0.8;
	}

	.article-meta {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.article-meta time {
		font-family: var(--font-family-mono);
		font-size: 0.875rem;
		color: var(--gray-500);
	}

	.category-tag {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--indigo-600);
	}

	.article-content h3 {
		font-size: 1.75rem;
		margin-bottom: 0.5rem;
	}

	.article-content p {
		color: var(--gray-600);
		font-size: 1.1rem;
		max-width: 600px;
	}

	:global([data-theme="dark"]) .article-content p {
		color: var(--gray-400);
	}

	.article-arrow {
		color: var(--gray-400);
		opacity: 0;
		transform: translateX(-10px);
		transition: all 0.3s ease;
	}

	.article-link:hover .article-arrow {
		opacity: 1;
		transform: translateX(0);
		color: var(--indigo-600);
	}

	@media (max-width: 768px) {
		.hero-actions {
			flex-direction: column;
		}

		.features-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.article-link {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.article-arrow {
			display: none;
		}
	}
</style>
