import matter from 'gray-matter';
import { marked } from 'marked';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

/**
 * Load all blog posts from the posts directory
 * @returns {Promise<Array>} Array of post metadata
 */
export async function loadPosts() {
	const postsDir = join(process.cwd(), 'src/posts');

	try {
		const files = await readdir(postsDir);
		const mdFiles = files.filter((file) => file.endsWith('.md'));

		const posts = await Promise.all(
			mdFiles.map(async (file) => {
				const filePath = join(postsDir, file);
				const rawContent = await readFile(filePath, 'utf-8');
				const { data } = matter(rawContent);

				return {
					slug: data.slug,
					title: data.title,
					date: data.date,
					excerpt: data.excerpt,
					game: data.game || null
				};
			})
		);

		// Sort by date, newest first
		return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
	} catch (error) {
		console.error('Error loading posts:', error);
		return [];
	}
}

/**
 * Load a single post by slug
 * @param {string} slug - The post slug
 * @returns {Promise<Object|null>} Post data with HTML content
 */
export async function loadPost(slug) {
	const postsDir = join(process.cwd(), 'src/posts');

	try {
		const files = await readdir(postsDir);

		for (const file of files) {
			const filePath = join(postsDir, file);
			const rawContent = await readFile(filePath, 'utf-8');
			const { data, content } = matter(rawContent);

			if (data.slug === slug) {
				return {
					slug: data.slug,
					title: data.title,
					date: data.date,
					excerpt: data.excerpt,
					game: data.game || null,
					content: marked(content)
				};
			}
		}

		return null;
	} catch (error) {
		console.error('Error loading post:', error);
		return null;
	}
}

/**
 * Load posts related to a specific game
 * @param {string} gameName - The game identifier
 * @returns {Promise<Array>} Array of related posts
 */
export async function loadRelatedPosts(gameName) {
	const allPosts = await loadPosts();
	return allPosts.filter((post) => post.game === gameName);
}
