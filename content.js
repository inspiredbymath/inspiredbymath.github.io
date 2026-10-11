import matter from 'gray-matter';

const postFiles = import.meta.glob('./posts/*.md', { query: '?raw', import: 'default' });

const CATEGORY_COLORS = {
    'fascinating problems': 'var(--cat-fascinating)',
    'dynamic programming': 'var(--cat-dp)',
    'competition math': 'var(--cat-competition)',
    'research': 'var(--cat-research)',
    'ai': 'var(--cat-ai)',
    'probability': 'var(--cat-probability)',
    'game theory': 'var(--cat-game-theory)',
};

export function categoryColor(tag) {
    return (tag && CATEGORY_COLORS[tag.toLowerCase()]) || 'var(--ink-2)';
}

export function readingTime(text) {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
}

export function formatDate(date) {
    return new Date(date)
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
        .toUpperCase();
}

export async function loadAllPosts() {
    const posts = [];

    for (const path in postFiles) {
        const { data, content } = matter(await postFiles[path]());

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
            game: data.game,
            content,
            minutes: readingTime(content),
            path,
        });
    }

    posts.sort((a, b) => new Date(b.date) - new Date(a.date) || b.path.localeCompare(a.path));
    return posts;
}

export async function loadPostsForGame(game) {
    return (await loadAllPosts()).filter((post) => post.game === game);
}
