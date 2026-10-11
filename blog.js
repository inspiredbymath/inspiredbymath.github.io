import katex from 'katex';
import { loadAllPosts, formatDate, categoryColor } from './content.js';

// Pull the first display-math block out of a post so the home page can show it.
function featuredMath(post) {
    const match = post.content.match(/\$\$([\s\S]+?)\$\$/);
    if (!match) return null;

    try {
        return katex.renderToString(match[1].trim(), { throwOnError: false, displayMode: true });
    } catch {
        return null;
    }
}

function renderHomeBand(posts) {
    const container = document.getElementById('home-band');
    if (!container) return;

    const [featured, ...rest] = posts;
    const latest = rest.slice(0, 4);
    const math = featuredMath(featured);

    container.innerHTML = `
        <div class="home-featured">
            <div class="kicker">Featured</div>
            ${math ? `<div class="featured-box">${math}</div>` : ''}
            <a href="./post.html?slug=${featured.slug}" class="featured-post">
                <span class="category-label" style="color: ${categoryColor(featured.tags[0])};">${featured.tags[0] || ''}</span>
                <h2>${featured.title}</h2>
                <p>${featured.excerpt}</p>
                <div class="meta-mono">${formatDate(featured.date)} · ${featured.minutes} MIN READ</div>
            </a>
        </div>
        <div class="home-latest">
            <div class="kicker">Latest</div>
            ${latest
                .map(
                    (post) => `
                <a href="./post.html?slug=${post.slug}" class="latest-post">
                    <span class="category-label" style="color: ${categoryColor(post.tags[0])};">${post.tags[0] || ''}</span>
                    <h3>${post.title}</h3>
                </a>
            `
                )
                .join('')}
        </div>
    `;
}

function renderJournalList(posts) {
    const container = document.getElementById('journal-list');
    if (!container) return;

    if (posts.length === 0) {
        container.innerHTML = '<p class="loading-spinner">No posts yet.</p>';
        return;
    }

    container.innerHTML = posts
        .map(
            (post, index) => `
        <a href="./post.html?slug=${post.slug}" class="journal-row">
            <span class="row-number">${String(index + 1).padStart(2, '0')}</span>
            <div class="row-body">
                <span class="category-label" style="color: ${categoryColor(post.tags[0])};">${post.tags.slice(0, 2).join(' · ')}</span>
                <h2>${post.title}</h2>
                <p>${post.excerpt}</p>
            </div>
            <div class="row-meta">${formatDate(post.date)}<br>${post.minutes} MIN READ</div>
        </a>
    `
        )
        .join('');
}

const NUMBER_WORDS = [
    'zero', 'one', 'two', 'three', 'four', 'five',
    'six', 'seven', 'eight', 'nine', 'ten',
];

function renderJournalCount(posts) {
    const element = document.getElementById('journal-count');
    if (!element) return;

    const count = posts.length;
    const word = NUMBER_WORDS[count] || String(count);
    element.textContent = `${word.charAt(0).toUpperCase()}${word.slice(1)} piece${count === 1 ? '' : 's'} so far.`;
}

export function renderIssueTag(posts) {
    const element = document.getElementById('issue-tag');
    if (!element) return;

    const issue = String(posts.length).padStart(2, '0');
    const date = posts.length ? new Date(posts[0].date) : new Date();
    const month = date
        .toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
        .toUpperCase();

    element.textContent = `ISSUE Nº ${issue} · ${month} ${date.getUTCFullYear()}`;
}

async function init() {
    try {
        const posts = await loadAllPosts();
        renderIssueTag(posts);
        renderJournalCount(posts);
        renderHomeBand(posts);
        renderJournalList(posts);
    } catch (error) {
        console.error('Failed to load blog posts:', error);
        const container =
            document.getElementById('home-band') || document.getElementById('journal-list');
        if (container) {
            container.innerHTML = `<p class="loading-spinner">Error loading posts. Check the console for details.<br><br>${error.message}</p>`;
        }
    }
}

init();
