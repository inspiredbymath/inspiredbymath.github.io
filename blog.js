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

    const isVerticalList = postsContainer.classList.contains('posts-list-vertical');

    posts.forEach(post => {
        const postCard = document.createElement('a');
        postCard.href = `./post.html?slug=${post.slug}`;
        
        // Define tags HTML safely
        const tagsHtml = (post.tags || []).map(tag => {
            // Assign class based on tag content for coloring
            let tagClass = 'post-tag';
            if (tag.toLowerCase().includes('probability')) tagClass += ' tag-probability';
            else if (tag.toLowerCase().includes('game')) tagClass += ' tag-game-theory';
            else if (tag.toLowerCase().includes('dynamic')) tagClass += ' tag-dynamic-programming';
            
            return `<span class="${tagClass}">${tag}</span>`;
        }).join(' ');

        if (isVerticalList) {
            // Classic Blog List Layout
            postCard.className = 'post-list-item';
            
            // Map game to emoji for list view
            let icon = '📝';
            if (post.game === 'monty-hall') icon = '🚗';
            if (post.game === 'prisoners-dilemma') icon = '⚔️';
            if (post.game === 'staircase') icon = '🪜';

            postCard.innerHTML = `
                <div class="post-list-image">${icon}</div>
                <div class="post-list-content">
                    <h2>${post.title}</h2>
                    <div class="post-meta">
                        <span>${new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span>&bull;</span>
                        <span>${post.author}</span>
                    </div>
                    <p>${post.excerpt}</p>
                    <div class="tags-container" style="margin-top: 15px;">
                        ${tagsHtml}
                    </div>
                </div>
            `;
        } else {
            // Card Grid Layout (Homepage/Related)
            postCard.className = 'post-card';
            
            // Apply top border color based on first tag
            let borderColor = 'var(--brand-blue)';
            if (post.tags && post.tags.length > 0) {
                const firstTag = post.tags[0].toLowerCase();
                if (firstTag.includes('probability')) borderColor = 'var(--brand-teal)';
                else if (firstTag.includes('game')) borderColor = 'var(--brand-indigo)';
                else if (firstTag.includes('dynamic')) borderColor = 'var(--brand-rose)';
            }
            postCard.style.setProperty('--border-color', borderColor);
            
            // Add custom style for the ::after element color override
            postCard.setAttribute('style', `--border-color: ${borderColor}`); // This relies on the CSS utilizing this var or us manually setting it. 
            // Better approach for CSS pseudo-element: we set a class or inline style won't reach ::after easily without CSS vars.
            // Let's use the CSS Variable approach which is clean.
            
            postCard.innerHTML = `
                <div class="card-content">
                    <h2>${post.title}</h2>
                    <div class="post-meta">
                        <span>${new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <p>${post.excerpt}</p>
                    <div class="tags-container">
                        ${tagsHtml}
                    </div>
                </div>
                <style>
                    .post-card[href$="${post.slug}"]:after { background: ${borderColor} !important; }
                </style>
            `;
        }

        postsContainer.appendChild(postCard);
    });
}

loadPosts().catch(err => {
    console.error("Failed to load blog posts:", err);
    postsContainer.innerHTML = `<p style="color: red;">Error loading blog posts. Check the browser console for details. <br><br>Error: ${err.message}</p>`;
});
