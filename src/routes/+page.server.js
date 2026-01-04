import { loadPosts } from '$lib/utils/posts.js';

export async function load() {
	const allPosts = await loadPosts();
	// Get first 3 posts for homepage
	const posts = allPosts.slice(0, 3);

	const tagCounts = new Map();
	allPosts.forEach((post) => {
		(post.tags || []).forEach((tag) => {
			const label = String(tag || '').trim();
			if (!label) return;
			const key = label.toLowerCase();
			const entry = tagCounts.get(key) || { label, count: 0 };
			entry.count += 1;
			tagCounts.set(key, entry);
		});
	});

	const topics = Array.from(tagCounts.values())
		.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
		.slice(0, 2);

	const simulationMeta = {
		'monty-hall': {
			title: 'The Monty Hall Problem',
			description: 'Run the switch-or-stay experiment and watch the odds flip.'
		},
		'prisoners-dilemma': {
			title: "Prisoner's Dilemma",
			description: 'Test cooperation strategies across repeated rounds.'
		},
		staircase: {
			title: 'The Staircase Problem',
			description: 'See Fibonacci patterns emerge from step counts.'
		}
	};

	const featuredPost = allPosts.find((post) => post.game);
	const featuredSimulation = featuredPost
		? {
				game: featuredPost.game,
				...(simulationMeta[featuredPost.game] || {
					title: featuredPost.title,
					description: featuredPost.excerpt
				})
			}
		: simulationMeta['monty-hall'];

	return {
		posts,
		topics,
		featuredSimulation
	};
}
