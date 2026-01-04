<script>
	import { base } from '$app/paths';

	let { data } = $props();
</script>

<svelte:head>
	<title>Journal - MathFun</title>
</svelte:head>

<section class="blog-section">
	<header class="section-header">
		<h1>MathFun Journal</h1>
		<p class="subtitle">
			Exploring the beauty of mathematics through interactive simulations and visual storytelling.
		</p>
	</header>

	<div class="article-list">
		{#each data.posts as post}
			<article class="article-card">
				<div class="article-header">
					<h2>
						<a href="{base}/blog/{post.slug}">{post.title}</a>
					</h2>
					<time class="article-date">{new Date(post.date).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}</time>
				</div>
				<p class="article-excerpt">{post.excerpt}</p>
				<a href="{base}/blog/{post.slug}" class="read-more">Read more →</a>
			</article>
		{/each}
	</div>
</section>

<style>
	.blog-section {
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

	.article-list {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.article-card {
		background: var(--surface-color);
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.article-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	}

	.article-header h2 {
		margin: 0 0 0.5rem 0;
	}

	.article-header h2 a {
		color: var(--text-primary);
		text-decoration: none;
		transition: color 0.2s;
	}

	.article-header h2 a:hover {
		color: var(--brand-teal);
	}

	.article-date {
		color: var(--text-secondary);
		font-size: 0.9rem;
	}

	.article-excerpt {
		margin: 1rem 0;
		color: var(--text-secondary);
		line-height: 1.6;
	}

	.read-more {
		color: var(--brand-teal);
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}

	.read-more:hover {
		color: var(--brand-blue);
	}
</style>
