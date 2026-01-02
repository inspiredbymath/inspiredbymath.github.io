import{m as l,_ as n}from"./index-BJmpHkU4.js";/* empty css              */import"./polyfills-D4hzpeY6.js";const i=Object.assign({"./posts/01-intro-to-monty-hall.md":()=>n(()=>import("./01-intro-to-monty-hall-D3KeI0wJ.js"),[]).then(t=>t.default),"./posts/02-prisoners-dilemma-strategies.md":()=>n(()=>import("./02-prisoners-dilemma-strategies-Dz3hZ4T1.js"),[]).then(t=>t.default),"./posts/03-staircase-fibonacci.md":()=>n(()=>import("./03-staircase-fibonacci-BvkO1jfw.js"),[]).then(t=>t.default)}),a=document.getElementById("posts-container");async function p(){const t=[];for(const e in i){const o=await i[e](),{data:s,content:r}=l(o);if(!s.slug||!s.title){console.warn(`Skipping post with path: ${e} due to missing slug or title.`);continue}t.push({slug:s.slug,title:s.title,date:s.date,author:s.author,excerpt:s.excerpt,tags:s.tags||[],game:s.game})}t.sort((e,o)=>new Date(o.date)-new Date(e.date)),c(t)}function c(t){if(a.innerHTML="",t.length===0){a.innerHTML="<p>No blog posts found.</p>";return}t.forEach(e=>{const o=document.createElement("a");o.href=`./post.html?slug=${e.slug}`,o.className="post-card";const s=e.tags.map(r=>`<span class="post-tag">${r}</span>`).join(" ");o.innerHTML=`
            <h2>${e.title}</h2>
            <div class="post-meta">
                <span>By ${e.author}</span> | <span>${new Date(e.date).toLocaleDateString()}</span>
            </div>
            <p class="post-excerpt">${e.excerpt}</p>
            <div class="post-tags">
                ${s}
            </div>
        `,a.appendChild(o)})}p().catch(t=>{console.error("Failed to load blog posts:",t),a.innerHTML=`<p style="color: red;">Error loading blog posts. Check the browser console for details. <br><br>Error: ${t.message}</p>`});
