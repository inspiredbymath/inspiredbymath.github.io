import './polyfills.js';
import matter from 'gray-matter';
import { marked } from 'marked';
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css';

// Vite feature to import all markdown files from a directory
const postFiles = import.meta.glob('./posts/*.md', { query: '?raw', import: 'default' });

/**
 * marked (and Markdown in general) will happily mangle LaTeX, since
 * underscores/asterisks inside math ($x_1$, $2*3$, etc.) look like
 * emphasis syntax to it. To avoid that, we pull every math segment out
 * of the raw markdown *before* handing it to marked, replace it with a
 * plain-text placeholder token, then swap the original LaTeX back into
 * the rendered HTML afterwards (untouched by markdown parsing). KaTeX's
 * auto-render extension then finds the $...$ / $$...$$ delimiters in the
 * final DOM and typesets them.
 */
function protectMath(markdownContent) {
    const stash = [];
    const withPlaceholders = markdownContent.replace(
        /\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$/g,
        (match) => {
            const token = `@@MATH${stash.length}@@`;
            stash.push(match);
            return token;
        }
    );
    return { withPlaceholders, stash };
}

function restoreMath(html, stash) {
    return html.replace(/@@MATH(\d+)@@/g, (_, i) => stash[Number(i)]);
}

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
    const { withPlaceholders, stash } = protectMath(markdownContent);
    const renderedContent = restoreMath(marked(withPlaceholders), stash);

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

    // Typeset any LaTeX ($...$ inline, $$...$$ display) now that the
    // content is in the DOM.
    renderMathInElement(postContentContainer, {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
        ],
        throwOnError: false,
    });
}

function displayError(message) {
    postContentContainer.innerHTML = `<p style="color: red; text-align: center;">${message}</p>`;
}

loadPost();
