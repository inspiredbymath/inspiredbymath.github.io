import matter from 'gray-matter';
import { marked } from 'marked';
import { readdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

async function loadPostContents() {
	const postsDir = join(process.cwd(), 'src/posts');
	const files = await readdir(postsDir);
	const mdFiles = files.filter((file) => file.endsWith('.md'));
	return Promise.all(mdFiles.map((file) => readFile(join(postsDir, file), 'utf-8')));
}

/**
 * Load all blog posts from the posts directory
 * @returns {Promise<Array>} Array of post metadata
 */
export async function loadPosts() {
	try {
		const contents = await loadPostContents();
		const posts = contents.map((rawContent) => {
			const { data } = matter(rawContent);

			return {
				slug: data.slug,
				title: data.title,
				date: data.date,
				excerpt: data.excerpt,
				game: data.game || null,
				tags: data.tags || []
			};
		});

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
	try {
		const contents = await loadPostContents();
		for (const rawContent of contents) {
			const { data, content } = matter(rawContent);

			if (data.slug === slug) {
				return {
					slug: data.slug,
					title: data.title,
					date: data.date,
					excerpt: data.excerpt,
					game: data.game || null,
					tags: data.tags || [],
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
