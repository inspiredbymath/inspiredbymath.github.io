<script>
	import { base } from '$app/paths';
	import { ArrowRight } from 'lucide-svelte';

	let { data } = $props();
	let post = $derived.by(() => data.post);
</script>

<svelte:head>
	<title>{post.title} - MathFun</title>
	<meta name="description" content={post.excerpt} />
</svelte:head>

<article class="blog-post">
	<header class="post-header">
		<h1>{post.title}</h1>
		<div class="post-meta">
			<time class="post-date">
				{new Date(post.date).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})}
			</time>
		</div>
	</header>

	<div class="post-content">
		{@html post.content}
	</div>

	{#if post.game}
		<a href="{base}/{post.game}" class="game-cta">
			<span class="game-cta-label">Interactive simulation</span>
			<span class="game-cta-title">
				Play the {post.game.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
			</span>
			<span class="game-cta-action">
				Launch game
				<ArrowRight size={18} />
			</span>
		</a>
	{/if}

	<footer class="post-footer">
		<a href="{base}/blog" class="back-link">← Back to Journal</a>
	</footer>
</article>

<style>
	.blog-post {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 0;
	}

	.post-header {
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: 2px solid var(--border-color);
	}

	.post-header h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
		color: var(--text-primary);
	}

	.post-meta {
		display: flex;
		gap: 1.5rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.post-date {
		color: var(--text-secondary);
		font-size: 0.95rem;
	}

	.game-cta {
		margin-top: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1.25rem 1.5rem;
		border-radius: 16px;
		border: 1px solid rgba(79, 70, 229, 0.25);
		background: linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(13, 148, 136, 0.08));
		text-decoration: none;
		color: var(--text-primary);
		box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
		transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
	}

	.game-cta:hover {
		transform: translateY(-2px);
		border-color: rgba(79, 70, 229, 0.45);
		box-shadow: 0 18px 30px rgba(15, 23, 42, 0.12);
	}

	.game-cta-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--brand-indigo);
		font-weight: 700;
	}

	.game-cta-title {
		font-size: 1.4rem;
		font-weight: 700;
	}

	.game-cta-action {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--brand-indigo);
		font-weight: 600;
	}

	.post-content {
		line-height: 1.8;
		color: var(--text-primary);
	}

	.post-content :global(h2) {
		margin-top: 2rem;
		margin-bottom: 1rem;
		color: var(--text-primary);
	}

	.post-content :global(h3) {
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
		color: var(--text-primary);
	}

	.post-content :global(p) {
		margin-bottom: 1.25rem;
	}

	.post-content :global(code) {
		background: var(--surface-color);
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-size: 0.9em;
	}

	.post-content :global(pre) {
		background: var(--surface-color);
		padding: 1rem;
		border-radius: 8px;
		overflow-x: auto;
		margin: 1.5rem 0;
	}

	.post-content :global(a) {
		color: var(--brand-teal);
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: border-color 0.2s;
	}

	.post-content :global(a:hover) {
		border-bottom-color: var(--brand-teal);
	}

	.post-footer {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 2px solid var(--border-color);
	}

	.back-link {
		color: var(--brand-teal);
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}

	.back-link:hover {
		color: var(--brand-blue);
	}
</style>
