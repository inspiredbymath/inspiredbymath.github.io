import './polyfills.js';
import matter from 'gray-matter';

// Vite feature to import all markdown files from a directory
const postFiles = import.meta.glob('./posts/*.md', { as: 'raw' });

const postsContainer = document.getElementById('posts-container');

async function loadPosts() {
    const posts = [];

    for (const path in postFiles) {
        const rawContent = await postFiles[path]();
        const { data, content } = matter(rawContent);

        // Skip if essential data is missing
        if (!data.slug || !data.title) {
            console.warn(`Skipping post with path: ${path} due to missing slug or title.`);
            continue;
        }

        posts.push({
            slug: data.slug,
            title: data.title,
            date: data.date,
            author: data.author,
            excerpt: data.excerpt,
            tags: data.tags || [],
            game: data.game
        });
    }

    // Sort posts by date, newest first
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    displayPosts(posts);
}

function displayPosts(posts) {
    // Clear loading spinner
    postsContainer.innerHTML = '';

    if (posts.length === 0) {
        postsContainer.innerHTML = '<p>No blog posts found.</p>';
        return;
    }

    posts.forEach(post => {
        const postCard = document.createElement('a');
        postCard.href = `./post.html?slug=${post.slug}`;
        postCard.className = 'post-card';

        const tagsHtml = (post.tags || []).map(tag => `<span class="post-tag">${tag}</span>`).join(' ');

        postCard.innerHTML = `
            <div class="post-card-content">
                <h2>${post.title}</h2>
                <div class="post-meta">
                    <span>${new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span>&bull;</span>
                    <span>${post.author}</span>
                </div>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-tags">
                    ${tagsHtml}
                </div>
            </div>
        `;

        postsContainer.appendChild(postCard);
    });
}

loadPosts().catch(err => {
    console.error("Failed to load blog posts:", err);
    postsContainer.innerHTML = `<p style="color: red;">Error loading blog posts. Check the browser console for details. <br><br>Error: ${err.message}</p>`;
});
