import { loadPosts } from '$lib/utils/posts.js';

export async function load() {
	const allPosts = await loadPosts();
	// Get first 3 posts for homepage
	const posts = allPosts.slice(0, 3);
	return {
		posts
	};
}
