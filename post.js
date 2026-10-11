import { marked } from 'marked';
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css';
import { loadAllPosts, formatDate, categoryColor } from './content.js';

const GAME_CALLOUTS = {
    'monty-hall': {
        title: 'Play the Monty Hall Problem yourself',
        desc: 'Pick a door, watch the host reveal a goat, and see whether switching really doubles your odds.',
        cta: 'Play the simulation →',
    },
    'prisoners-dilemma': {
        title: 'Play a few rounds of the Dilemma',
        desc: 'Try each strategy yourself and see how close you can get to optimal play.',
        cta: 'Play the simulation →',
    },
    'staircase': {
        title: 'Watch the Staircase build itself',
        desc: 'The same "one layer at a time" idea powers our dynamic-programming simulation. Watch the counts grow.',
        cta: 'Open the simulation →',
    },
};

const postContainer = document.getElementById('post-content');

// Markdown and KaTeX fight over $…$, so hold the math aside while marked runs.
function stashMath(markdown) {
    const stash = [];
    const withPlaceholders = markdown.replace(
        /\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$/g,
        (match) => {
            const placeholder = `@@MATH${stash.length}@@`;
            stash.push(match);
            return placeholder;
        }
    );
    return { withPlaceholders, stash };
}

function restoreMath(html, stash) {
    return html.replace(/@@MATH(\d+)@@/g, (_, index) => stash[Number(index)]);
}

function renderIssueTag(posts) {
    const element = document.getElementById('issue-tag');
    if (!element) return;

    const issue = String(posts.length).padStart(2, '0');
    const date = posts.length ? new Date(posts[0].date) : new Date();
    const month = date
        .toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
        .toUpperCase();

    element.textContent = `ISSUE Nº ${issue} · ${month} ${date.getUTCFullYear()}`;
}

function renderPost(post) {
    const tags = post.tags.map((tag) => `<span class="category-label">${tag}</span>`).join('');
    const { withPlaceholders, stash } = stashMath(post.content);
    const body = restoreMath(marked.parse(withPlaceholders), stash);

    const callout = GAME_CALLOUTS[post.game];
    const calloutHtml = callout
        ? `
        <div class="related-game">
            <div class="kicker">See it in motion</div>
            <h3>${callout.title}</h3>
            <p>${callout.desc}</p>
            <a href="./${post.game}.html" class="btn-primary">${callout.cta}</a>
        </div>
    `
        : '';

    postContainer.innerHTML = `
        <a href="./blog.html" class="post-back">← Back to the Journal</a>
        <header class="post-header">
            <div class="category-label" style="color: ${categoryColor(post.tags[0])};">${post.tags.slice(0, 2).join(' · ')}</div>
            <h1>${post.title}</h1>
            <div class="post-byline">BY ${(post.author || '').toUpperCase()} · ${formatDate(post.date)} · ${post.minutes} MIN READ</div>
        </header>
        <div class="post-body">${body}</div>
        <div class="post-tags">${tags}</div>
        ${calloutHtml}
    `;

    renderMathInElement(postContainer.querySelector('.post-body'), {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
        ],
        throwOnError: false,
    });
}

function showError(message) {
    postContainer.innerHTML = `<p class="loading-spinner">${message}</p>`;
}

async function init() {
    const slug = new URLSearchParams(window.location.search).get('slug');

    if (!slug) {
        showError('No post specified.');
        return;
    }

    try {
        const posts = await loadAllPosts();
        renderIssueTag(posts);

        const post = posts.find((candidate) => candidate.slug === slug);
        if (!post) {
            showError(`Post not found: ${slug}`);
            return;
        }

        document.title = `${post.title} — Inspired by Math`;
        renderPost(post);
    } catch (error) {
        console.error('Error during post loading:', error);
        showError(
            `An error occurred while loading the post. Check the browser console for details.<br><br>Error: ${error.message}`
        );
    }
}

init();
