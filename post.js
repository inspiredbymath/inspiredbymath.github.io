import './polyfills.js';
import matter from 'gray-matter';
import { marked } from 'marked';

// Vite feature to import all markdown files from a directory
const postFiles = import.meta.glob('./posts/*.md', { as: 'raw' });

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

    postContentContainer.innerHTML = `
        <header class="post-header">
            <h1>${metadata.title}</h1>
            <div class="post-meta">
                <span>By ${metadata.author}</span> | <span>${new Date(metadata.date).toLocaleDateString()}</span>
            </div>
            <div class="post-tags" style="margin-top: 15px;">
                ${tagsHtml}
            </div>
        </header>
        <div class="post-body">
            ${renderedContent}
        </div>
    `;
}

function displayError(message) {
    postContentContainer.innerHTML = `<p style="color: red; text-align: center;">${message}</p>`;
}

loadPost();
