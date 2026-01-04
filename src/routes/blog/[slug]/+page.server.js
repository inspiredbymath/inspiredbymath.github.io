import { loadPost } from '$lib/utils/posts.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const post = await loadPost(params.slug);

	if (!post) {
		throw error(404, 'Post not found');
	}

	return {
		post
	};
}
