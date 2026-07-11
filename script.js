const originalTitle = document.title || "MF";
document.addEventListener("visibilitychange",()=>{document.title=document.hidden?"💭 MF — Still here":originalTitle;});

const loader=document.getElementById("mfLoader");
if(loader){const spans=loader.querySelectorAll("span");spans.forEach(s=>{s.style.transform="translateY(0)"});requestAnimationFrame(()=>requestAnimationFrame(()=>spans.forEach(s=>{s.style.transform=""})));setTimeout(()=>loader.classList.add("done"),1800);}

(function(){let targetY=window.scrollY,currentY=window.scrollY,ticking=false;const ease=.065;function tick(){const d=targetY-currentY;if(Math.abs(d)<.35){currentY=targetY;window.scrollTo(0,currentY);ticking=false;return}currentY+=d*ease;window.scrollTo(0,currentY);requestAnimationFrame(tick)}window.addEventListener("wheel",e=>{if(document.body.classList.contains("project-open"))return;e.preventDefault();targetY+=e.deltaY*1.4;targetY=Math.max(0,Math.min(targetY,document.body.scrollHeight-window.innerHeight));if(!ticking){ticking=true;requestAnimationFrame(tick)}},{passive:false});let touchStart=0,lastTouch=0,lastTime=0,velocity=0;window.addEventListener("touchstart",e=>{touchStart=lastTouch=e.touches[0].clientY;lastTime=Date.now();velocity=0},{passive:true});window.addEventListener("touchmove",e=>{if(document.body.classList.contains("project-open"))return;const y=e.touches[0].clientY,dt=Date.now()-lastTime||1;velocity=((lastTouch-y)/dt)*16;lastTouch=y;lastTime=Date.now();targetY+=touchStart-y;touchStart=y;targetY=Math.max(0,Math.min(targetY,document.body.scrollHeight-window.innerHeight));if(!ticking){ticking=true;requestAnimationFrame(tick)}},{passive:true});window.addEventListener("touchend",()=>{if(document.body.classList.contains("project-open"))return;targetY+=velocity*200;targetY=Math.max(0,Math.min(targetY,document.body.scrollHeight-window.innerHeight));if(!ticking){ticking=true;requestAnimationFrame(tick)}},{passive:true});window._mfScroll=function(y){targetY=y;currentY=window.scrollY;if(!ticking){ticking=true;requestAnimationFrame(tick)}}})();

document.querySelectorAll('a[href^="#"]').forEach(link=>{link.addEventListener("click",e=>{const id=link.getAttribute("href").slice(1);if(!id){e.preventDefault();window._mfScroll?window._mfScroll(0):window.scrollTo({top:0,behavior:"smooth"});return}const target=document.getElementById(id);if(!target)return;e.preventDefault();const y=target.getBoundingClientRect().top+window.scrollY;if(window._mfScroll)window._mfScroll(y);else window.scrollTo({top:y,behavior:"smooth"});});});

const footerTop=document.getElementById("footerTop");if(footerTop){footerTop.addEventListener("click",e=>{e.preventDefault();window._mfScroll?window._mfScroll(0):window.scrollTo({top:0,behavior:"smooth"});});}

const grid=document.getElementById("mfGrid"),blur=document.getElementById("mfBlur"),footer=document.querySelector(".mf-footer");window.addEventListener("scroll",()=>{const y=window.scrollY,work=document.getElementById("work"),workTop=work?work.offsetTop:0,footerTop=footer?footer.offsetTop:0;if(grid){if(y<workTop-window.innerHeight*.8){grid.classList.remove("is-soft","is-gone")}else if(y<workTop){grid.classList.add("is-soft");grid.classList.remove("is-gone")}else{grid.classList.remove("is-soft");grid.classList.add("is-gone")}}if(blur){const onFooter=y>footerTop-window.innerHeight*.8,onHero=y<50;if(onHero||onFooter){blur.classList.remove("is-on");blur.classList.add("is-off")}else{blur.classList.add("is-on");blur.classList.remove("is-off")}}},{passive:true});

const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add("visible")})},{threshold:.1});document.querySelectorAll(".mf-reveal").forEach(el=>revealObserver.observe(el));

const marksWrap=document.querySelector(".mf-intersections");if(marksWrap){for(let i=0;i<8;i++){const mark=document.createElement("div");mark.className="mf-mark "+["dot","dot","dot","star","diamond"][Math.floor(Math.random()*5)];mark.style.left=[10,20,30,40,50,60,70,80,90][Math.floor(Math.random()*9)]+"%";mark.style.top=[33.333,66.666][i%2]+"%";mark.style.animationDelay=(Math.random()*24).toFixed(2)+"s";marksWrap.appendChild(mark)}}

const ascii=Array.from(document.querySelectorAll(".mf-ascii"));let asciiIndex=0;function cycleAscii(){if(!ascii.length)return;ascii.forEach(el=>el.classList.remove("show"));const current=ascii[asciiIndex%ascii.length];current.classList.add("show");asciiIndex++;setTimeout(()=>{current.classList.remove("show");setTimeout(cycleAscii,3000)},1500)}setTimeout(cycleAscii,1200);

const indexExtra=document.getElementById("indexExtra");
if(indexExtra){
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  async function runIndexLoop(){
    while(true){
      indexExtra.textContent="";
      await wait(1300);
      indexExtra.textContent="X";
      await wait(420);
      indexExtra.textContent="XX";
      await wait(520);
      for(let i=0;i<3;i++){
        indexExtra.style.opacity="0";
        await wait(180);
        indexExtra.style.opacity="1";
        await wait(180);
      }
      await wait(260);
      indexExtra.textContent="";
      await wait(900);
    }
  }
  runIndexLoop();
}


/* INDEX HOVER PREVIEWS */
(function(){
  const previewImages={
    "01":[
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=76",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=76",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=76",
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=76"
    ],
    "02":[
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=76",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=76",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=76",
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=900&q=76"
    ],
    "03":[
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=76",
      "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=900&q=76",
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=76",
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=76"
    ],
    "04":[
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=76",
      "https://images.unsplash.com/photo-1464820453369-31d2c0b651af?auto=format&fit=crop&w=900&q=76",
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=900&q=76",
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=900&q=76"
    ],
    "05":[
      "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=900&q=76",
      "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=900&q=76",
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=900&q=76",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=900&q=76"
    ]
  };
  const strips=[...document.querySelectorAll('.mf-strip')];
  const updateLeft=strip=>{
    const desc=strip.querySelector('.mf-strip-desc');
    if(!desc)return;
    const s=strip.getBoundingClientRect(),d=desc.getBoundingClientRect();
    strip.style.setProperty('--preview-left',Math.max(0,d.left-s.left)+'px');
  };
  strips.forEach(strip=>{
    const list=previewImages[strip.dataset.index]||[];
    const preview=document.createElement('div');
    preview.className='mf-strip-preview';
    list.slice(0,3).forEach((src,i)=>{
      const frame=document.createElement('div');
      frame.className='mf-strip-preview-frame';
      frame.style.setProperty('--preview-order',i);
      const img=document.createElement('img');
      img.src=src; img.alt=''; img.loading='lazy'; img.decoding='async';
      frame.appendChild(img); preview.appendChild(frame);
    });
    const more=Math.max(0,list.length-3);
    const moreCard=document.createElement('div');
    moreCard.className='mf-strip-preview-more';
    moreCard.style.setProperty('--preview-order',3);
    moreCard.textContent=`[+${more} MORE]`;
    preview.appendChild(moreCard);
    strip.appendChild(preview);
    updateLeft(strip);
  });
  window.addEventListener('resize',()=>strips.forEach(updateLeft));
})();

/* PROJECT OVERLAYS */
(function(){
  const overlay=document.getElementById("mfOverlay");
  const gallery=document.getElementById("projectGallery");
  const slides=document.getElementById("projectSlides");
  const closeButton=overlay?.querySelector(".mf-close");
  if(!overlay||!gallery||!slides||!closeButton)return;

  const projectData={
    "01":{
      title:"MIUNĀE",
      intro:"A natural skincare brand built around time, tactility and restraint. The system turns Eastern European botanical knowledge into a contemporary luxury world without sanding away its character.",
      scope:"Creative direction, brand system, packaging, digital art direction, campaign language and launch expression.",
      context:"MIUNĀE needed to enter a saturated skincare category without resembling another polished wellness brand. Its formulas carried real history, but the story had to feel immediate rather than nostalgic. The work needed enough discipline to feel premium and enough tension to remain alive.",
      approach:"I built the identity around time as both ingredient and attitude. Typography, material choices and imagery were reduced until every element felt deliberate. The resulting system moves between quiet control and botanical overgrowth while staying recognizably MIUNĀE.",
      images:[
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=88",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2200&q=88",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2200&q=88",
        "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=2200&q=88"
      ]
    },
    "02":{
      title:"GoBaller",
      intro:"A football coaching app for players of all ages. The product makes structured training feel clear, motivating and personal without turning the experience into another generic fitness interface.",
      scope:"Brand identity, product strategy, iOS application design, interaction system and visual direction.",
      context:"GoBaller had to work for ambitious young players, parents and experienced coaches at the same time. The product contained a deep training system, but the interface could not feel technical or intimidating. It needed credibility on the pitch and clarity in the hand.",
      approach:"I organized the product around progression, repetition and visible momentum. The identity borrows energy from sport without relying on predictable visual clichés. Every screen was shaped to keep the next useful action obvious while preserving a strong, ownable character.",
      images:[
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2200&q=88",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=88",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=88",
        "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=2200&q=88"
      ]
    },
    "03":{
      title:"AIMS",
      intro:"The most advanced AI search for music catalogs. AIMS translates complex machine-learning capability into a product story that music professionals can understand, trust and use.",
      scope:"Website, brand refresh, product narrative, sales deck, launch materials and interface direction.",
      context:"AIMS had technology with unusual depth, but its value was difficult to communicate outside technical conversations. Buyers needed to understand the advantage quickly while still believing the system could handle professional-scale catalogs. The brand had to bridge engineering precision and creative intuition.",
      approach:"I reframed the platform around the moments where search changes the work itself. Product language became more direct, the identity gained focus and the sales story moved from feature inventory to practical leverage. The system gives the technology room to feel sophisticated without becoming abstract.",
      images:[
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=2200&q=88",
        "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=2200&q=88",
        "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=2200&q=88",
        "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=2200&q=88"
      ]
    },
    "04":{
      title:"Mindset Coaching",
      intro:"One-to-one sessions, group work, mentoring and team audits for founders, leaders and creatives. The practice creates room for direct conversations that move past performance and into useful change.",
      scope:"Positioning, coaching framework, service design, session formats, communication and experience direction.",
      context:"Creative and technical leaders often arrive with a visible work problem and a less visible pattern underneath it. Standard coaching language can make those conversations feel distant or overly polished. The practice needed to feel rigorous, human and safe without becoming soft or formulaic.",
      approach:"I designed the experience around attention rather than templates. The language stays direct, the structure remains flexible and every format is built to surface what is actually blocking movement. The result is a practice that can hold both strategic decisions and the personal reality beneath them.",
      images:[
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2200&q=88",
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2200&q=88",
        "https://images.unsplash.com/photo-1497436072909-f5e4be1713c0?auto=format&fit=crop&w=2200&q=88",
        "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=2200&q=88"
      ]
    },
    "05":{
      title:"Team Leadership",
      intro:"Design and engineering leadership focused on empowering leaders of leaders. The work joins product quality, organizational clarity and the conditions people need to do their strongest work.",
      scope:"Executive leadership, design organization, engineering partnership, team systems, hiring and leadership development.",
      context:"Growing product organizations create pressure faster than they create shared judgment. Teams can add process while losing clarity, ownership and the standard that made the work valuable. Leadership needed to scale without turning the organization into a machine for meetings.",
      approach:"I treated structure as a tool for better decisions rather than control. Responsibilities, critique and communication were redesigned around trust, explicit standards and stronger leaders at every level. The organization could move faster because authority and quality no longer depended on one person.",
      images:[
        "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=2200&q=88",
        "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=2200&q=88",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2200&q=88",
        "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=2200&q=88"
      ]
    }
  };

  const fields={
    index:document.getElementById("projectIndex"),
    title:document.getElementById("projectTitle"),
    intro:document.getElementById("projectIntro"),
    scope:document.getElementById("projectScope"),
    context:document.getElementById("projectContext"),
    approach:document.getElementById("projectApproach"),
    counter:document.getElementById("projectCounter")
  };

  let activeIndex=0;
  let wheelLocked=false;
  let wheelTotal=0;
  let wheelReset=0;

  function renderProject(key){
    const project=projectData[key]||projectData["01"];
    fields.index.textContent=`PROJECT ${key}`;
    fields.title.textContent=project.title;
    fields.intro.textContent=project.intro;
    fields.scope.textContent=project.scope;
    fields.context.textContent=project.context;
    fields.approach.textContent=project.approach;
    slides.innerHTML=project.images.map((src,i)=>`<figure class="mf-project-slide" data-slide="${i}"><img src="${src}" alt="${project.title} project visual ${i+1}" loading="${i===0?'eager':'lazy'}"></figure>`).join("");
    activeIndex=0;
    gallery.scrollTop=0;
    updateCounter();
  }

  function updateCounter(){
    const total=slides.children.length||1;
    fields.counter.textContent=`${String(activeIndex+1).padStart(2,"0")} / ${String(total).padStart(2,"0")}`;
  }

  function openProject(strip){
    const key=strip.dataset.index||"01";
    renderProject(key);
    overlay.classList.remove("is-closing");
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden","false");
    document.body.classList.add("project-open");
    requestAnimationFrame(()=>requestAnimationFrame(()=>overlay.classList.add("is-visible")));
    setTimeout(()=>gallery.focus({preventScroll:true}),520);
  }

  function closeProject(){
    if(!overlay.classList.contains("active"))return;
    overlay.classList.add("is-closing");
    overlay.classList.remove("is-visible");
    setTimeout(()=>{
      overlay.classList.remove("active","is-closing");
      overlay.setAttribute("aria-hidden","true");
      document.body.classList.remove("project-open");
      slides.innerHTML="";
    },620);
  }

  function easeInOutCubic(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
  function scrollToSlide(next){
    const total=slides.children.length;
    next=Math.max(0,Math.min(total-1,next));
    if(next===activeIndex||wheelLocked)return;
    wheelLocked=true;
    const start=gallery.scrollTop;
    const target=next*gallery.clientHeight;
    const delta=target-start;
    const duration=760;
    const began=performance.now();
    function frame(now){
      const t=Math.min(1,(now-began)/duration);
      gallery.scrollTop=start+delta*easeInOutCubic(t);
      if(t<1)requestAnimationFrame(frame);
      else{
        activeIndex=next;
        updateCounter();
        wheelLocked=false;
      }
    }
    requestAnimationFrame(frame);
  }

  document.querySelectorAll(".mf-strip").forEach(strip=>strip.addEventListener("click",()=>openProject(strip)));
  closeButton.addEventListener("click",closeProject);
  document.addEventListener("keydown",e=>{
    if(!overlay.classList.contains("active"))return;
    if(e.key==="Escape")closeProject();
    if(e.key==="ArrowDown"||e.key==="PageDown"){e.preventDefault();scrollToSlide(activeIndex+1);}
    if(e.key==="ArrowUp"||e.key==="PageUp"){e.preventDefault();scrollToSlide(activeIndex-1);}
  });

  gallery.addEventListener("wheel",e=>{
    e.preventDefault();
    if(wheelLocked)return;
    wheelTotal+=e.deltaY;
    clearTimeout(wheelReset);
    wheelReset=setTimeout(()=>wheelTotal=0,140);
    if(Math.abs(wheelTotal)<34)return;
    const direction=wheelTotal>0?1:-1;
    wheelTotal=0;
    scrollToSlide(activeIndex+direction);
  },{passive:false});

  let touchStartY=0;
  gallery.addEventListener("touchstart",e=>{touchStartY=e.touches[0].clientY;},{passive:true});
  gallery.addEventListener("touchend",e=>{
    const endY=e.changedTouches[0].clientY;
    const delta=touchStartY-endY;
    if(Math.abs(delta)>40)scrollToSlide(activeIndex+(delta>0?1:-1));
  },{passive:true});
})();

function scaleHeroName(){const hero=document.getElementById("heroName"),wrap=document.getElementById("nameWrap"),info=document.querySelector(".mf-hero-info");if(!hero||!wrap)return;hero.style.fontSize="300px";wrap.style.transform="none";const width=wrap.scrollWidth,viewport=window.innerWidth,padding=viewport*.008,scale=(viewport-padding*2)/width,scaledWidth=width*scale,offset=(viewport-scaledWidth)/2;wrap.style.transform=`translateX(${offset}px) scale(${scale})`;wrap.style.transformOrigin="left bottom";if(info&&window.innerWidth>1000){const fChar=hero.querySelector(".n-f");if(fChar){const fRect=fChar.getBoundingClientRect();info.style.left=(fRect.left+20)+"px";info.style.right="auto";info.style.width=Math.min(560,(window.innerWidth-fRect.left)*.55)+"px";info.style.top="22%";info.style.bottom="auto"}}else if(info){info.style.left="";info.style.right="";info.style.width="";info.style.bottom="";info.style.top=""}}
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(scaleHeroName);else setTimeout(scaleHeroName,200);scaleHeroName();window.addEventListener("resize",scaleHeroName);

(function(){const hero=document.getElementById("heroName");if(!hero)return;const wait=ms=>new Promise(r=>setTimeout(r,ms));const chars=()=>Array.from(hero.querySelectorAll(".nc")).filter(c=>!c.classList.contains("n-sp"));async function accentA(){const a=hero.querySelector(".n-a2");if(!a)return;a.textContent="Á";await wait(600);a.textContent="A"}async function accentU(){const u=hero.querySelector(".n-u");if(!u)return;u.textContent="Ů";await wait(600);u.textContent="U"}async function disappear(){const list=["n-a1","n-r","n-i","n-a2","n-n","n-u","n-s","n-e","n-k"].map(c=>hero.querySelector("."+c)).filter(Boolean);list.forEach(el=>el.style.opacity="0");await wait(2100);list.forEach(el=>el.style.opacity="");await wait(400)}async function rgb(){const all=chars(),picks=[...all].sort(()=>Math.random()-.5).slice(0,3);let frame=0,total=120;const timer=setInterval(()=>{frame++;const t=frame/total,amp=Math.sin(t*Math.PI)*4,j=(Math.random()-.5)*.8,x=(amp+j).toFixed(2),nx=(-(amp+j*.7)).toFixed(2);picks.forEach(el=>{el.style.textShadow=`${x}px 0 3px rgba(226,27,22,.8),${nx}px 0 3px rgba(0,167,255,.8)`});if(frame>=total)clearInterval(timer)},16);await wait(2050);picks.forEach(el=>el.style.textShadow="")}async function blurFx(){const all=chars();all.forEach(el=>{el.style.transition=`filter .5s cubic-bezier(.16,1,.3,1)`;el.style.filter="blur(3px)"});await wait(1300);all.forEach(el=>{el.style.transition=`filter .8s cubic-bezier(.16,1,.3,1)`;el.style.filter="blur(0)"});await wait(900);all.forEach(el=>{el.style.transition="";el.style.filter=""})}const effects=[accentA,accentU,disappear,rgb,blurFx];function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}let queue=[];async function run(){await wait(2500);while(true){if(!queue.length)queue=shuffle(effects);await queue.shift()();await wait(2500)}}run();})();

/* XP structural reveal + title effects */
(function(){const section=document.getElementById("xp"),track=document.getElementById("timelineItems");if(!section||!track)return;const cards=[...track.querySelectorAll(".mf-xp-card")];let started=false;const style=document.createElement("style");style.textContent=`.xp-char{display:inline-block;will-change:transform,opacity,filter,color,text-shadow;}.xp-cursor{display:inline-block;margin-left:0;animation:xpCursorBlink .72s steps(1) infinite;}@keyframes xpCursorBlink{50%{opacity:0;}}.xp-heart{display:inline-block;margin-left:.35em;color:#fff;filter:blur(.15px);transform-origin:center;animation:xpHeartBeat 1.05s cubic-bezier(.16,1,.3,1) infinite;}@keyframes xpHeartBeat{0%,100%{transform:scale(1);filter:blur(.15px);}12%{transform:scale(1.22);filter:blur(1.1px);}22%{transform:scale(.98);filter:blur(.25px);}34%{transform:scale(1.16);filter:blur(.9px);}48%{transform:scale(1);filter:blur(.15px);}}.xp-strv-red{color:var(--red,#e21b16)!important;text-shadow:0 0 14px rgba(226,27,22,.36);}.xp-symbio-word,.xp-symbio-digital{display:inline-block;white-space:pre;will-change:transform,opacity,letter-spacing;}`;document.head.appendChild(style);
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting||started)return;started=true;cards.forEach((card,i)=>setTimeout(()=>card.classList.add("show"),i*180));});},{threshold:.22});observer.observe(section);

cards.forEach(card=>{const title=card.querySelector(".mf-xp-title");if(!title)return;title.dataset.original=title.dataset.title||title.textContent;wrapTitle(title);let cleanup=null;card.addEventListener("mouseenter",()=>{if(cleanup)cleanup();cleanup=runTitleEffect(card,title);});card.addEventListener("mouseleave",()=>{if(cleanup)cleanup();cleanup=null;resetTitle(title);});});

function wrapTitle(title){const text=title.dataset.original;title.innerHTML="";for(const ch of text){const span=document.createElement("span");span.className="xp-char";span.textContent=ch===" "?"\u00A0":ch;title.appendChild(span);}}
function resetTitle(title){title.classList.remove("is-blood","is-symbio","xp-strv-red");title.style.opacity="";title.style.filter="";title.style.textShadow="";title.style.color="";title.style.width="";title.style.minWidth="";title.style.display="";title.style.alignItems="";title.innerHTML="";title.textContent=title.dataset.original;wrapTitle(title);}
function setPlain(title,text){title.classList.remove("is-blood","is-symbio","xp-strv-red");title.style.color="";title.style.textShadow="";title.innerHTML="";title.textContent=text;}
function setCursorText(title,text){title.innerHTML="";title.append(document.createTextNode(text));const cursor=document.createElement("span");cursor.className="xp-cursor";cursor.textContent="_";title.appendChild(cursor);}

function runTitleEffect(card,title){const type=card.dataset.xpEffect;const timers=[];let killed=false;const t=(fn,ms)=>{const id=setTimeout(()=>{if(!killed)fn()},ms);timers.push(id);return id};const clearAll=()=>timers.forEach(clearTimeout);resetTitle(title);

if(type==="independent"){setCursorText(title,"Independent");const steps=["Independen","Independe","Independ","Indepen","Indepe","Indep","Inde","Ind","In"];steps.forEach((txt,i)=>t(()=>setCursorText(title,txt),520+i*95));const phrase="In depth";[...phrase].forEach((_,i)=>t(()=>setCursorText(title,phrase.slice(0,i+1)),1520+i*85));t(()=>clearAll(),2350);}

if(type==="coach"){title.innerHTML='Coach <span class="xp-heart">♥</span>';}

if(type==="strv"){title.classList.add("xp-strv-red");}

if(type==="symbio"){
  const originalWidth=title.getBoundingClientRect().width;
  title.style.width=originalWidth+"px";
  title.style.minWidth=originalWidth+"px";
  title.style.display="inline-flex";
  title.style.alignItems="baseline";
  title.innerHTML="";
  const sym=document.createElement("span");
  sym.className="xp-symbio-word";
  sym.textContent="SYMBIO";
  const gap=document.createElement("span");
  gap.className="xp-symbio-gap";
  gap.textContent=" ";
  const dig=document.createElement("span");
  dig.className="xp-symbio-digital";
  dig.textContent="Digital";
  title.append(sym,gap,dig);
  const letters=[...sym.textContent].map(ch=>{const s=document.createElement("span");s.className="xp-char";s.textContent=ch;return s;});
  sym.replaceChildren(...letters);
  [...letters].reverse().forEach((ch,i)=>t(()=>{
    ch.style.transition="opacity .1s linear, transform .1s linear";
    ch.style.opacity="0";
    ch.style.transform="scaleX(0)";
  },i*65));
  t(()=>{
    if(killed)return;
    sym.replaceChildren();
    sym.style.width="1.15em";
    sym.style.flex="0 0 1.15em";
    sym.style.textAlign="left";
    sym.style.transform="rotate(45deg)";
    sym.style.transformOrigin="center";
    sym.textContent="☯";
  },letters.length*65+80);
}

if(type==="fg"){t(()=>setPlain(title,"FG 1"),300);t(()=>setPlain(title,"FG 2"),700);t(()=>setPlain(title,"FG 3"),1100);t(()=>setPlain(title,"FG 4"),1500);t(()=>{setPlain(title,"FG 4rest");clearAll();},1900);}

return ()=>{killed=true;clearAll();resetTitle(title);};}
})();

const xpPlus=document.getElementById("xpPlus");if(xpPlus){function popXP(){xpPlus.classList.remove("pop");void xpPlus.offsetWidth;xpPlus.classList.add("pop")}setInterval(popXP,4000)}




/* HERO EXPERIENCE TYPEWRITER */
(function(){
  const target=document.getElementById("metaText");
  if(!target)return;
  const lines=[
    "20+ YEARS OF XP",
    "DESIGN, LEADERSHIP, COACHING",
    "SUPERPOWER: FINDING YOUR SUPERPOWER"
  ];
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  async function loop(){
    while(true){
      for(const line of lines){
        target.textContent="";
        for(const ch of line){target.textContent+=ch;await wait(42);}
        await wait(1250);
        while(target.textContent.length){target.textContent=target.textContent.slice(0,-1);await wait(20);}
        await wait(260);
      }
    }
  }
  setTimeout(loop,2200);
})();

/* BIO LETTER LOOP */
(function(){
  const b=document.querySelector(".bio-b"),i=document.querySelector(".bio-i"),o=document.querySelector(".bio-o");
  if(!b||!i||!o)return;
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  async function loop(){
    while(true){
      b.classList.remove("is-off");i.classList.remove("is-off");o.classList.remove("is-off");
      await wait(1600);
      b.classList.add("is-off");
      await wait(300);
      o.classList.add("is-off");
      await wait(180);
      for(let n=0;n<3;n++){
        i.classList.add("is-off");o.classList.remove("is-off");
        await wait(300);
        i.classList.remove("is-off");o.classList.add("is-off");
        await wait(300);
      }
      i.classList.remove("is-off");o.classList.remove("is-off");
      await wait(250);
      b.classList.remove("is-off");
      await wait(1500);
    }
  }
  loop();
})();

/* VARIABLE PROXIMITY — word-safe BIO copy */
(function(){
  const container=document.querySelector(".mf-about-text");
  if(!container)return;
  const radius=120;
  const texts=[...container.querySelectorAll("p, .mf-about-note")];

  texts.forEach(el=>{
    const label=el.textContent;
    el.setAttribute("aria-label",label);
    el.textContent="";
    const words=label.split(" ");
    words.forEach((word,wordIndex)=>{
      const wordSpan=document.createElement("span");
      wordSpan.className="vp-word";
      [...word].forEach(ch=>{
        const span=document.createElement("span");
        span.className="vp-char";
        span.setAttribute("aria-hidden","true");
        span.textContent=ch;
        wordSpan.appendChild(span);
      });
      el.appendChild(wordSpan);
      if(wordIndex<words.length-1)el.appendChild(document.createTextNode(" "));
    });
  });

  let mouse={x:-9999,y:-9999},raf=0,inside=false;
  function update(){
    raf=0;
    container.querySelectorAll(".vp-char").forEach(char=>{
      const r=char.getBoundingClientRect();
      const dx=mouse.x-(r.left+r.width/2),dy=mouse.y-(r.top+r.height/2);
      const d=Math.sqrt(dx*dx+dy*dy);
      const n=Math.max(0,Math.min(1,1-d/radius));
      const wght=400+(850-400)*n;
      char.style.fontVariationSettings=`'wght' ${wght}, 'opsz' ${9+(40-9)*n}`;
      char.style.fontWeight=String(Math.round(wght));
      char.style.opacity=String(.5+(.5*n));
    });
  }
  container.addEventListener("pointermove",e=>{inside=true;mouse={x:e.clientX,y:e.clientY};if(!raf)raf=requestAnimationFrame(update);});
  container.addEventListener("pointerleave",()=>{inside=false;mouse={x:-9999,y:-9999};if(!raf)raf=requestAnimationFrame(update);});
})();

/* PRACTICE ROLL */
function positionRollCopies(){document.querySelectorAll(".mf-roll").forEach(row=>{const left=row.querySelector(".mf-roll-left"),right=row.querySelector(".mf-roll-right");if(!left||!right)return;const rowRect=row.getBoundingClientRect(),leftRect=left.getBoundingClientRect(),rightRect=right.getBoundingClientRect();const center=((leftRect.right+rightRect.left)/2)-rowRect.left;row.style.setProperty("--copy-x",center+"px");});}
positionRollCopies();
window.addEventListener("resize",positionRollCopies);
document.querySelectorAll(".mf-roll").forEach(row=>{["mouseenter","mouseleave"].forEach(event=>{row.addEventListener(event,()=>{requestAnimationFrame(positionRollCopies);[100,200,300,400,500,600,700].forEach(ms=>setTimeout(positionRollCopies,ms));});});});

/* XP SHAPE — fast particles, two-second hover morphs, lively breathing */
(function(){
  const container=document.getElementById("xpShape");
  if(!container||typeof p5==="undefined")return;
  const COUNT=760;
  const SHAPE_MAP={independent:"triangle",coach:"heart",strv:"fourStar",symbio:"sinusoid",fg:"spiral"};
  let currentShape="circle",targetShape="circle",morphFrom="circle";
  let morphStarted=0,morphDuration=2000,isMorphing=false,isHovering=false;

  const sketch=p=>{
    let particles=[],R=0;
    p.setup=()=>{
      const cnv=p.createCanvas(container.offsetWidth,container.offsetHeight);
      cnv.parent(container);
      p.colorMode(p.HSB,360,100,100,1);
      R=Math.min(p.width,p.height)*.39;
      for(let i=0;i<COUNT;i++)particles.push({
        pos:p.createVector(p.random(-R,R),p.random(-R,R)),
        vel:p.createVector(p.random(-1.2,1.2),p.random(-1.2,1.2)),
        acc:p.createVector(0,0),
        sz:p.random(.55,2.35),
        alpha:p.random(.18,.82),
        trail:p.random(1.8,5.8),
        phase:p.random(p.TWO_PI),
        phase2:p.random(p.TWO_PI)
      });
    };

    p.draw=()=>{
      p.clear();
      p.translate(p.width/2,p.height/2);

      let morphT=1;
      if(isMorphing){
        morphT=Math.min(1,(p.millis()-morphStarted)/morphDuration);
        if(morphT>=1){isMorphing=false;currentShape=targetShape;morphFrom=targetShape;}
      }
      const eased=easeInOut(morphT);
      const breathe=1+Math.sin(p.frameCount*.045)*.032;
      const speed=isHovering?18:8.5;
      const force=isHovering?1.35:.58;
      const damping=isHovering?.86:.9;

      particles.forEach((pt,i)=>{
        const angle=p.map(i,0,COUNT,0,p.TWO_PI);
        const from=shapePos(p,isMorphing?morphFrom:currentShape,angle,R*breathe);
        const to=shapePos(p,isMorphing?targetShape:currentShape,angle,R*breathe);
        const target=isMorphing?p5.Vector.lerp(from,to,eased):to;

        /* Visible, fluid wiggle: alive rather than jittery. */
        const driftAmp=isHovering?7.5:10.5;
        target.x+=Math.sin(p.frameCount*.052+pt.phase)*driftAmp;
        target.y+=Math.cos(p.frameCount*.044+pt.phase2)*driftAmp;

        const desired=p5.Vector.sub(target,pt.pos);
        const dist=desired.mag();
        if(dist>.01)desired.setMag(Math.min(speed,Math.max(.75,dist*.48)));
        const steer=p5.Vector.sub(desired,pt.vel).limit(force);
        pt.acc.add(steer);
        pt.vel.add(pt.acc).mult(damping).limit(speed);
        pt.pos.add(pt.vel);
        pt.acc.mult(0);

        const motion=Math.min(1,pt.vel.mag()/Math.max(speed,.01));

        /* Fine motion trail: only becomes visible while particles travel. */
        if(motion>.06){
          p.stroke(0,0,98,pt.alpha*motion*.34);
          p.strokeWeight(Math.max(.28,pt.sz*.42));
          p.line(
            pt.pos.x-pt.vel.x*pt.trail,
            pt.pos.y-pt.vel.y*pt.trail,
            pt.pos.x,
            pt.pos.y
          );
        }

        p.noStroke();
        p.fill(0,0,98,Math.min(.94,pt.alpha+motion*.16));
        p.circle(pt.pos.x,pt.pos.y,pt.sz*(1+motion*.14));
      });
    };

    p.windowResized=()=>{
      p.resizeCanvas(container.offsetWidth,container.offsetHeight);
      R=Math.min(p.width,p.height)*.39;
    };

    window._xpMorph=(shape,hovering)=>{
      isHovering=hovering;
      morphFrom=currentShape;
      targetShape=shape;
      morphStarted=p.millis();
      morphDuration=hovering?900:650;
      isMorphing=true;
    };
  };

  new p5(sketch,container);
  const track=document.getElementById("timelineItems");
  if(track)track.querySelectorAll(".mf-xp-card").forEach(card=>{
    const shape=SHAPE_MAP[card.dataset.xpEffect]||"circle";
    card.addEventListener("mouseenter",()=>window._xpMorph&&window._xpMorph(shape,true));
    card.addEventListener("mouseleave",()=>window._xpMorph&&window._xpMorph("circle",false));
  });

  function shapePos(p,shape,angle,r){
    switch(shape){
      case"circle":return p.createVector(p.cos(angle)*r,p.sin(angle)*r);
      case"triangle":{
        const a=((angle-p.PI/2)%p.TWO_PI+p.TWO_PI)%p.TWO_PI,side=Math.floor(a/(p.TWO_PI/3)),t=(a%(p.TWO_PI/3))/(p.TWO_PI/3);
        return p5.Vector.lerp(p.createVector(p.cos(side*p.TWO_PI/3-p.PI/2)*r,p.sin(side*p.TWO_PI/3-p.PI/2)*r),p.createVector(p.cos((side+1)*p.TWO_PI/3-p.PI/2)*r,p.sin((side+1)*p.TWO_PI/3-p.PI/2)*r),t);
      }
      case"heart":{
        const u=((angle%p.TWO_PI)+p.TWO_PI)%p.TWO_PI/p.TWO_PI;
        const pts=[
          p.createVector(0,r*.68),p.createVector(-r*.78,r*.08),p.createVector(-r*.82,-r*.42),
          p.createVector(-r*.48,-r*.72),p.createVector(0,-r*.38),p.createVector(r*.48,-r*.72),
          p.createVector(r*.82,-r*.42),p.createVector(r*.78,r*.08)
        ];
        const pos=u*pts.length,seg=Math.floor(pos)%pts.length,t=pos-Math.floor(pos);
        return p5.Vector.lerp(pts[seg],pts[(seg+1)%pts.length],t);
      }
      case"fourStar":{
        const u=((angle%p.TWO_PI)+p.TWO_PI)%p.TWO_PI/p.TWO_PI;
        const points=[];
        for(let k=0;k<8;k++){
          const a=-p.PI/2+k*p.PI/4;
          const rr=k%2===0?r:r*.18;
          points.push(p.createVector(p.cos(a)*rr,p.sin(a)*rr));
        }
        const pos=u*points.length,seg=Math.floor(pos)%points.length,t=pos-Math.floor(pos);
        return p5.Vector.lerp(points[seg],points[(seg+1)%points.length],t);
      }
      case"sinusoid":{
        const u=((angle%p.TWO_PI)+p.TWO_PI)%p.TWO_PI/p.TWO_PI;
        const x=(u-.5)*2*r;
        const y=Math.sin(u*p.TWO_PI*2)*r*.48;
        return p.createVector(x,y);
      }
      case"spiral":{
        const u=((angle%p.TWO_PI)+p.TWO_PI)%p.TWO_PI/p.TWO_PI;
        const turns=3.15;
        const rr=r*(.08+.90*u);
        const a=-p.PI/2+u*p.TWO_PI*turns;
        return p.createVector(p.cos(a)*rr,p.sin(a)*rr);
      }
      default:return p.createVector(0,0);
    }
  }
  function easeInOut(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
})();


/* MF ART — magnetic button + infinitely wrapping draggable field */
(function(){
  const zone=document.getElementById("mfArtZone");
  const button=document.getElementById("mfArtButton");
  const overlay=document.getElementById("mfArtOverlay");
  const world=document.getElementById("mfArtWorld");
  const close=document.getElementById("mfArtClose");
  if(!zone||!button||!overlay||!world||!close)return;

  const files=[
    "01-konnichiwawa.png","02-perefction.png","03-flawr.png","04-mattress.png","05-egg.png",
    "06-huh.png","07-hotdog.png","08-jail.png","09-box.png","10-ufo.png","11-claude.png",
    "12-hay.png","13-spaghet.png","14-doctor.png","15-cher.png","16-pantalones.png","17-tuli.png",
    "18-wave.png","19-bean.png","20-accept.png","21-violins.png","22-holy.png","23-tiktok.png",
    "24-ai.png","25-blushies.png","26-arse.png","27-glow.png","28-smash.png","29-stairs.png","30-orange.png"
  ];
  const strength=.34;
  const moveButton=(x,y,duration=.4,ease="power2.out")=>{
    if(window.gsap)gsap.to(button,{x,y,duration,ease,overwrite:true});
    else button.style.transform=`translate(${x}px,${y}px)`;
  };
  zone.addEventListener("mousemove",e=>{
    const rect=zone.getBoundingClientRect();
    const x=((e.clientX-rect.left)/rect.width-.5)*rect.width;
    const y=((e.clientY-rect.top)/rect.height-.5)*rect.height;
    moveButton(x*strength,y*strength);
  });
  zone.addEventListener("mouseleave",()=>moveButton(0,0,.7,"elastic.out(1, 0.4)"));

  let pieces=[];
  let offsetX=0,offsetY=0;
  let dragging=false,lastX=0,lastY=0;
  const seeded=i=>{
    const x=Math.sin(i*12.9898)*43758.5453;
    return x-Math.floor(x);
  };
  function build(){
    if(pieces.length)return;
    world.innerHTML="";
    const vw=window.innerWidth,vh=window.innerHeight;
    const fieldW=vw*3.6,fieldH=vh*3.2;
    pieces=files.map((name,i)=>{
      const figure=document.createElement("figure");
      figure.className="mf-art-piece";
      const size=Math.round(120+seeded(i+2)*220);
      const ratio=.72+seeded(i+31)*.62;
      figure.style.width=size+"px";
      figure.style.height=Math.round(size*ratio)+"px";
      figure.style.zIndex=String(1+Math.floor(seeded(i+68)*8));
      const img=document.createElement("img");
      img.src=`/images/art/${name}`;
      img.alt="";
      img.draggable=false;
      figure.appendChild(img);
      world.appendChild(figure);
      return {
        el:figure,
        x:(seeded(i+90)-.5)*fieldW,
        y:(seeded(i+150)-.5)*fieldH,
        w:size,h:Math.round(size*ratio)
      };
    });
    render();
  }
  function wrap(value,span){ return ((value+span/2)%span+span)%span-span/2; }
  function render(){
    const vw=window.innerWidth,vh=window.innerHeight;
    const spanX=vw*3.6,spanY=vh*3.2;
    pieces.forEach(piece=>{
      const x=wrap(piece.x+offsetX,spanX)+vw/2-piece.w/2;
      const y=wrap(piece.y+offsetY,spanY)+vh/2-piece.h/2;
      piece.el.style.transform=`translate3d(${x}px,${y}px,0)`;
    });
  }
  function openArt(){
    build();
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden","false");
    document.body.classList.add("art-open");
    requestAnimationFrame(()=>requestAnimationFrame(()=>overlay.classList.add("is-visible")));
  }
  function closeArt(){
    overlay.classList.remove("is-visible");
    setTimeout(()=>{
      overlay.classList.remove("active","is-dragging");
      overlay.setAttribute("aria-hidden","true");
      document.body.classList.remove("art-open");
    },720);
  }
  button.addEventListener("click",openArt);
  close.addEventListener("click",closeArt);
  overlay.addEventListener("pointerdown",e=>{
    if(e.target.closest(".mf-art-close"))return;
    dragging=true;lastX=e.clientX;lastY=e.clientY;
    overlay.classList.add("is-dragging");
    overlay.setPointerCapture?.(e.pointerId);
  });
  overlay.addEventListener("pointermove",e=>{
    if(!dragging)return;
    offsetX+=e.clientX-lastX;offsetY+=e.clientY-lastY;
    lastX=e.clientX;lastY=e.clientY;render();
  });
  const stopDrag=e=>{
    dragging=false;overlay.classList.remove("is-dragging");
    try{overlay.releasePointerCapture?.(e.pointerId)}catch(_){}
  };
  overlay.addEventListener("pointerup",stopDrag);
  overlay.addEventListener("pointercancel",stopDrag);
  window.addEventListener("resize",render);
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&overlay.classList.contains("active"))closeArt();});
})();

/* FOOTER TYPEWRITER */
(function(){
  const target=document.getElementById("twText");
  if(!target)return;
  const sentences = [
    "“You met me at a very strange time in my life.”",
    "“There is no spoon.”",
    "“Just be a rock.”",
    "“Devour feculence.”",
    "“Majestical.”"
  ];
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  async function loop(){
    while(true){
      for(const sentence of sentences){
        target.textContent="";
        for(const ch of sentence){target.textContent+=ch;await wait(42);}
        await wait(5000);
        while(target.textContent.length){target.textContent=target.textContent.slice(0,-1);await wait(18);}
        await wait(320);
      }
    }
  }
  loop();
})();
