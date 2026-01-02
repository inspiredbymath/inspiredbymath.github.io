import{m as d,_ as l}from"./index-pHnGcn-R.js";import"./polyfills-DnxsSoM1.js";const c=Object.assign({"./posts/01-intro-to-monty-hall.md":()=>l(()=>import("./01-intro-to-monty-hall-D3KeI0wJ.js"),[]).then(s=>s.default),"./posts/02-prisoners-dilemma-strategies.md":()=>l(()=>import("./02-prisoners-dilemma-strategies-Dz3hZ4T1.js"),[]).then(s=>s.default),"./posts/03-staircase-fibonacci.md":()=>l(()=>import("./03-staircase-fibonacci-BvkO1jfw.js"),[]).then(s=>s.default)}),o=document.getElementById("posts-container");async function m(){const s=[];for(const n in c){const t=await c[n](),{data:e,content:r}=d(t);if(!e.slug||!e.title){console.warn(`Skipping post with path: ${n} due to missing slug or title.`);continue}s.push({slug:e.slug,title:e.title,date:e.date,author:e.author,excerpt:e.excerpt,tags:e.tags||[],game:e.game})}s.sort((n,t)=>new Date(t.date)-new Date(n.date)),p(s)}function p(s){if(o.innerHTML="",s.length===0){o.innerHTML="<p>No blog posts found.</p>";return}const n=o.classList.contains("posts-list-vertical");s.forEach(t=>{const e=document.createElement("a");e.href=`./post.html?slug=${t.slug}`;const r=(t.tags||[]).map(a=>{let i="post-tag";return a.toLowerCase().includes("probability")?i+=" tag-probability":a.toLowerCase().includes("game")?i+=" tag-game-theory":a.toLowerCase().includes("dynamic")&&(i+=" tag-dynamic-programming"),`<span class="${i}">${a}</span>`}).join(" ");if(n){e.className="post-list-item";let a="📝";t.game==="monty-hall"&&(a="🚗"),t.game==="prisoners-dilemma"&&(a="⚔️"),t.game==="staircase"&&(a="🪜"),e.innerHTML=`
                <div class="post-list-image">${a}</div>
                <div class="post-list-content">
                    <h2>${t.title}</h2>
                    <div class="post-meta">
                        <span>${new Date(t.date).toLocaleDateString(void 0,{year:"numeric",month:"long",day:"numeric"})}</span>
                        <span>&bull;</span>
                        <span>${t.author}</span>
                    </div>
                    <p>${t.excerpt}</p>
                    <div class="tags-container" style="margin-top: 15px;">
                        ${r}
                    </div>
                </div>
            `}else{e.className="post-card";let a="var(--brand-blue)";if(t.tags&&t.tags.length>0){const i=t.tags[0].toLowerCase();i.includes("probability")?a="var(--brand-teal)":i.includes("game")?a="var(--brand-indigo)":i.includes("dynamic")&&(a="var(--brand-rose)")}e.style.setProperty("--border-color",a),e.setAttribute("style",`--border-color: ${a}`),e.innerHTML=`
                <div class="card-content">
                    <h2>${t.title}</h2>
                    <div class="post-meta">
                        <span>${new Date(t.date).toLocaleDateString(void 0,{year:"numeric",month:"long",day:"numeric"})}</span>
                    </div>
                    <p>${t.excerpt}</p>
                    <div class="tags-container">
                        ${r}
                    </div>
                </div>
                <style>
                    .post-card[href$="${t.slug}"]:after { background: ${a} !important; }
                </style>
            `}o.appendChild(e)})}m().catch(s=>{console.error("Failed to load blog posts:",s),o.innerHTML=`<p style="color: red;">Error loading blog posts. Check the browser console for details. <br><br>Error: ${s.message}</p>`});
