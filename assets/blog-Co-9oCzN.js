import{n as e,r as t,t as n}from"./content-Df8tUZl-.js";import{t as r}from"./katex.min-CYJG-A9F.js";function i(e){let t=e.content.match(/\$\$([\s\S]+?)\$\$/);if(!t)return null;try{return r.renderToString(t[1].trim(),{throwOnError:!1,displayMode:!0})}catch{return null}}function a(t){let r=document.getElementById(`home-band`);if(!r)return;let[a,...o]=t,s=o.slice(0,4),c=i(a);r.innerHTML=`
        <div class="home-featured">
            <div class="kicker">Featured</div>
            ${c?`<div class="featured-box">${c}</div>`:``}
            <a href="./post.html?slug=${a.slug}" class="featured-post">
                <span class="category-label" style="color: ${n(a.tags[0])};">${a.tags[0]||``}</span>
                <h2>${a.title}</h2>
                <p>${a.excerpt}</p>
                <div class="meta-mono">${e(a.date)} · ${a.minutes} MIN READ</div>
            </a>
        </div>
        <div class="home-latest">
            <div class="kicker">Latest</div>
            ${s.map(e=>`
                <a href="./post.html?slug=${e.slug}" class="latest-post">
                    <span class="category-label" style="color: ${n(e.tags[0])};">${e.tags[0]||``}</span>
                    <h3>${e.title}</h3>
                </a>
            `).join(``)}
        </div>
    `}function o(t){let r=document.getElementById(`journal-list`);if(r){if(t.length===0){r.innerHTML=`<p class="loading-spinner">No posts yet.</p>`;return}r.innerHTML=t.map((t,r)=>`
        <a href="./post.html?slug=${t.slug}" class="journal-row">
            <span class="row-number">${String(r+1).padStart(2,`0`)}</span>
            <div class="row-body">
                <span class="category-label" style="color: ${n(t.tags[0])};">${t.tags.slice(0,2).join(` · `)}</span>
                <h2>${t.title}</h2>
                <p>${t.excerpt}</p>
            </div>
            <div class="row-meta">${e(t.date)}<br>${t.minutes} MIN READ</div>
        </a>
    `).join(``)}}var s=[`zero`,`one`,`two`,`three`,`four`,`five`,`six`,`seven`,`eight`,`nine`,`ten`];function c(e){let t=document.getElementById(`journal-count`);if(!t)return;let n=e.length,r=s[n]||String(n);t.textContent=`${r.charAt(0).toUpperCase()}${r.slice(1)} piece${n===1?``:`s`} so far.`}function l(e){let t=document.getElementById(`issue-tag`);if(!t)return;let n=String(e.length).padStart(2,`0`),r=e.length?new Date(e[0].date):new Date;t.textContent=`ISSUE Nº ${n} · ${r.toLocaleDateString(`en-US`,{month:`short`,timeZone:`UTC`}).toUpperCase()} ${r.getUTCFullYear()}`}async function u(){try{let e=await t();l(e),c(e),a(e),o(e)}catch(e){console.error(`Failed to load blog posts:`,e);let t=document.getElementById(`home-band`)||document.getElementById(`journal-list`);t&&(t.innerHTML=`<p class="loading-spinner">Error loading posts. Check the console for details.<br><br>${e.message}</p>`)}}u();