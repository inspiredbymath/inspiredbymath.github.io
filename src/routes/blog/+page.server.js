import { loadPosts } from '$lib/utils/posts.js';

export async function load() {
	const posts = await loadPosts();
	return {
		posts
	};
}
