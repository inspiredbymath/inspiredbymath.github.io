<script>
	import { base } from '$app/paths';

	let { data } = $props();
	const { post } = data;
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
			{#if post.game}
				<a href="{base}/{post.game}" class="game-link">
					Play the {post.game.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} →
				</a>
			{/if}
		</div>
	</header>

	<div class="post-content">
		{@html post.content}
	</div>

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

	.game-link {
		color: var(--brand-teal);
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}

	.game-link:hover {
		color: var(--brand-blue);
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
