import{i as e,n as t,t as n}from"./preload-helper-Bgavk1X0.js";import"./polyfills-DU5b9FoQ.js";var r=e(t(),1),i=Object.assign({"./posts/01-intro-to-monty-hall.md":()=>n(()=>import(`./01-intro-to-monty-hall-0r4uSB9j.js`).then(e=>e.default),[]),"./posts/02-prisoners-dilemma-strategies.md":()=>n(()=>import(`./02-prisoners-dilemma-strategies-JtO47a0t.js`).then(e=>e.default),[]),"./posts/03-staircase-fibonacci.md":()=>n(()=>import(`./03-staircase-fibonacci-BZYz-sY-.js`).then(e=>e.default),[]),"./posts/04-my-competition-math-journey.md":()=>n(()=>import(`./04-my-competition-math-journey-xlV-seUo.js`).then(e=>e.default),[]),"./posts/05-conducting-research-in-high-school.md":()=>n(()=>import(`./05-conducting-research-in-high-school-BiXgmvf2.js`).then(e=>e.default),[]),"./posts/06-using-ai-responsibly-in-math.md":()=>n(()=>import(`./06-using-ai-responsibly-in-math-DkxozFSo.js`).then(e=>e.default),[]),"./posts/07-sum-of-cubes-identity.md":()=>n(()=>import(`./07-sum-of-cubes-identity-CsGHxdW-.js`).then(e=>e.default),[])}),a=document.getElementById(`posts-container`);async function o(){let e=[];for(let t in i){let{data:n,content:a}=(0,r.default)(await i[t]());if(!n.slug||!n.title){console.warn(`Skipping post with path: ${t} due to missing slug or title.`);continue}e.push({slug:n.slug,title:n.title,date:n.date,author:n.author,excerpt:n.excerpt,tags:n.tags||[],game:n.game})}e.sort((e,t)=>new Date(t.date)-new Date(e.date)),s(e)}function s(e){if(a.innerHTML=``,e.length===0){a.innerHTML=`<p>No blog posts found.</p>`;return}let t=a.classList.contains(`posts-list-vertical`);e.forEach(e=>{let n=document.createElement(`a`);n.href=`./post.html?slug=${e.slug}`;let r=(e.tags||[]).map(e=>{let t=`post-tag`,n=e.toLowerCase();return n.includes(`probability`)?t+=` tag-probability`:n.includes(`game`)?t+=` tag-game-theory`:n.includes(`dynamic`)?t+=` tag-dynamic-programming`:n.includes(`competition`)||n.includes(`olympiad`)?t+=` tag-competition`:n.includes(`research`)?t+=` tag-research`:n.includes(`ai`)?t+=` tag-ai`:n.includes(`problem`)&&(t+=` tag-problems`),`<span class="${t}">${e}</span>`}).join(` `);if(t){n.className=`post-list-item`;let t=`📝`;e.game===`monty-hall`&&(t=`🚗`),e.game===`prisoners-dilemma`&&(t=`⚔️`),e.game===`staircase`&&(t=`🪜`),n.innerHTML=`
                <div class="post-list-image">${t}</div>
                <div class="post-list-content">
                    <h2>${e.title}</h2>
                    <div class="post-meta">
                        <span>${new Date(e.date).toLocaleDateString(void 0,{year:`numeric`,month:`long`,day:`numeric`})}</span>
                        <span>&bull;</span>
                        <span>${e.author}</span>
                    </div>
                    <p>${e.excerpt}</p>
                    <div class="tags-container" style="margin-top: 15px;">
                        ${r}
                    </div>
                </div>
            `}else{n.className=`post-card`;let t=`var(--brand-blue)`;if(e.tags&&e.tags.length>0){let n=e.tags[0].toLowerCase();n.includes(`probability`)?t=`var(--brand-teal)`:n.includes(`game`)?t=`var(--brand-indigo)`:n.includes(`dynamic`)?t=`var(--brand-rose)`:n.includes(`competition`)||n.includes(`olympiad`)?t=`var(--brand-amber)`:n.includes(`research`)?t=`var(--brand-green)`:n.includes(`ai`)?t=`var(--brand-violet)`:n.includes(`problem`)&&(t=`var(--brand-cyan)`)}n.style.setProperty(`--border-color`,t),n.setAttribute(`style`,`--border-color: ${t}`),n.innerHTML=`
                <div class="card-content">
                    <h2>${e.title}</h2>
                    <div class="post-meta">
                        <span>${new Date(e.date).toLocaleDateString(void 0,{year:`numeric`,month:`long`,day:`numeric`})}</span>
                    </div>
                    <p>${e.excerpt}</p>
                    <div class="tags-container">
                        ${r}
                    </div>
                </div>
                <style>
                    .post-card[href$="${e.slug}"]:after { background: ${t} !important; }
                </style>
            `}a.appendChild(n)})}o().catch(e=>{console.error(`Failed to load blog posts:`,e),a.innerHTML=`<p style="color: red;">Error loading blog posts. Check the browser console for details. <br><br>Error: ${e.message}</p>`});