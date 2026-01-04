<script>
	import { base } from '$app/paths';
	import { Motion } from 'svelte-motion';
	import { ArrowRight, Sparkles, Brain, Zap, BookOpen } from 'lucide-svelte';
	import MagneticButton from '$lib/components/MagneticButton.svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();

	const features = [
		{
			icon: Brain,
			title: 'Interactive Learning',
			description: 'Don\'t just read equations. Manipulate variables and watch the logic unfold in real-time.',
			color: 'indigo'
		},
		{
			icon: Sparkles,
			title: 'Visual Intuition',
			description: 'Build deep understanding through carefully crafted data visualizations and animations.',
			color: 'teal'
		},
		{
			icon: Zap,
			title: 'Game Theory',
			description: 'Explore the mathematics of decision making through playable scenarios.',
			color: 'amber'
		}
	];
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
		<div class="features-grid">
			{#each features as feature, i}
				<Motion
					let:motion
					initial={{ opacity: 0, y: 20 }}
					whileHover={{ y: -5 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: i * 0.1 }}
				>
					<div use:motion class="feature-card">
						<div class="feature-icon bg-{feature.color}">
							<svelte:component this={feature.icon} size={28} strokeWidth={2} />
						</div>
						<h3>{feature.title}</h3>
						<p>{feature.description}</p>
					</div>
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
			{#each data.posts as post, i}
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

	[data-theme="dark"] .eyebrow {
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

	[data-theme="dark"] .highlight {
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

	[data-theme="dark"] .hero-subtitle {
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
	}

	[data-theme="dark"] .feature-card {
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

	.feature-card h3 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		font-family: var(--font-family-sans);
	}

	.feature-card p {
		color: var(--gray-600);
		line-height: 1.6;
	}

	[data-theme="dark"] .feature-card p {
		color: var(--gray-400);
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

	[data-theme="dark"] .section-header {
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

	[data-theme="dark"] .article-item {
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

	[data-theme="dark"] .article-content p {
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

		.article-link {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.article-arrow {
			display: none;
		}
	}
</style>