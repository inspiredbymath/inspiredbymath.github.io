<script>
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let { data } = $props();

	const buildTagOptions = (posts) => {
		const counts = new Map();
		posts.forEach((post) => {
			(post.tags || []).forEach((tag) => {
				const label = String(tag || '').trim();
				if (!label) return;
				const key = label.toLowerCase();
				const entry = counts.get(key) || { label, count: 0 };
				entry.count += 1;
				counts.set(key, entry);
			});
		});

		return Array.from(counts.values()).sort(
			(a, b) => b.count - a.count || a.label.localeCompare(b.label)
		);
	};

	const tagOptions = $derived.by(() => buildTagOptions(data.posts));
	const selectedTag = $derived.by(() =>
		browser ? $page.url.searchParams.get('tag') : null
	);
	const normalizedTag = $derived.by(() => (selectedTag ? selectedTag.toLowerCase() : ''));
	const filteredPosts = $derived.by(() => {
		if (!normalizedTag) return data.posts;
		const matches = data.posts.filter((post) =>
			(post.tags || []).some((tag) => tag.toLowerCase() === normalizedTag)
		);
		return matches.length ? matches : data.posts;
	});

	const handleTagChange = (event) => {
		const value = event.target.value;
		const target = value ? `${base}/blog?tag=${encodeURIComponent(value)}` : `${base}/blog`;
		goto(target);
	};
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

	{#if tagOptions.length}
		<div class="filter-bar">
			<label for="topic-filter">Filter by topic</label>
			<div class="filter-control">
				<select id="topic-filter" value={selectedTag ?? ''} onchange={handleTagChange}>
					<option value="">All topics</option>
					{#each tagOptions as tag}
						<option value={tag.label}>{tag.label} ({tag.count})</option>
					{/each}
				</select>
			</div>
		</div>
	{/if}

	<div class="article-list">
		{#if filteredPosts.length === 0}
			<p class="empty-state">No posts match this topic yet. Try another tag.</p>
		{:else}
			{#each filteredPosts as post}
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
		{/if}
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

	.filter-bar {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		margin-bottom: 2.5rem;
		flex-wrap: wrap;
	}

	.filter-bar label {
		font-weight: 600;
		color: var(--text-primary);
	}

	.filter-control select {
		min-width: 240px;
		padding: 0.6rem 1rem;
		border-radius: 999px;
		border: 1px solid var(--border-color);
		background: var(--surface-color);
		color: var(--text-primary);
		font-size: 0.95rem;
		cursor: pointer;
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
	}

	.filter-control select:focus {
		outline: none;
		border-color: var(--brand-teal);
		box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.2);
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

	.empty-state {
		text-align: center;
		color: var(--text-secondary);
		font-style: italic;
	}
</style>
