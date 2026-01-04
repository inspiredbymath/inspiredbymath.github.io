import './polyfills.js';
import matter from 'gray-matter';
import { marked } from 'marked';

// Vite feature to import all markdown files from a directory
const postFiles = import.meta.glob('./src/posts/*.md', { as: 'raw' });

const postContentContainer = document.getElementById('post-content');

async function loadPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    let postFound = false;

    if (!slug) {
        displayError("No post specified.");
        return;
    }

    try {
        for (const path in postFiles) {
            const rawContent = await postFiles[path]();
            const { data, content } = matter(rawContent);

            if (data.slug === slug) {
                postFound = true;
                document.title = `${data.title} - MathFun`;
                displayPost(data, content);
                break; // Exit loop once post is found
            }
        }

        if (!postFound) {
            displayError(`Post not found: ${slug}`);
        }
    } catch (err) {
        console.error("Error during post loading:", err);
        displayError(`An error occurred while loading the post. Check the browser console for details. <br><br>Error: ${err.message}`);
    }
}
function displayPost(metadata, markdownContent) {
    // Clear loading spinner
    postContentContainer.innerHTML = '';

    const tagsHtml = (metadata.tags || []).map(tag => `<span class="post-tag">${tag}</span>`).join(' ');
    const renderedContent = marked(markdownContent);

    // Create Game CTA if a game is linked
    let ctaHtml = '';
    if (metadata.game) {
        const gameUrl = `./${metadata.game}.html`;
        ctaHtml = `
            <div class="game-cta-box">
                <h3>Try the Simulation</h3>
                <p>Don't just take our word for it. Experience the math firsthand with our interactive simulation.</p>
                <a href="${gameUrl}" class="cta-button">Launch Simulation →</a>
            </div>
        `;
    }

    postContentContainer.innerHTML = `
        <header class="post-header">
            <h1>${metadata.title}</h1>
            <div class="post-meta">
                <span>${metadata.author}</span>
                <span>&bull;</span>
                <span>${new Date(metadata.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
        </header>
        <div class="post-body">
            ${renderedContent}
            ${ctaHtml}
        </div>
        <div class="post-tags" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border-color);">
            ${tagsHtml}
        </div>
    `;
}

function displayError(message) {
    postContentContainer.innerHTML = `<p style="color: red; text-align: center;">${message}</p>`;
}

loadPost();
