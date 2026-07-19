const originalTitle = document.title || "MF";
document.addEventListener("visibilitychange",()=>{document.title=document.hidden?"💭 MF — Still here":originalTitle;});

/* Let the browser own mobile scroll restoration. The previous delayed series
   of scrollTo calls could fire during normal use and looked like a reload. */

const loader=document.getElementById("mfLoader");
function startMfSite(){
  document.body.classList.remove("mf-preload-locked");
  document.body.classList.add("mf-site-entered");
  runMfSiteLoader();
}

const mfLoaderBits=loader?{
  progress:loader.querySelector('#mfLoaderProgress'),
  bar:loader.querySelector('#mfLoaderBar'),
  ascii:loader.querySelector('#mfLoaderAscii'),
  reveal:loader.querySelector('#mfLoaderReveal')
}:null;
let mfSiteLoaderStarted=false;
function runMfSiteLoader(){
  if(!loader||mfSiteLoaderStarted){ if(loader) setTimeout(()=>loader.classList.add('done'),50); return; }
  mfSiteLoaderStarted=true;
  const progressEl=mfLoaderBits?.progress;
  const barEl=mfLoaderBits?.bar;
  const asciiEl=mfLoaderBits?.ascii;
  const syncLoaderNameHeight=()=>{
    loader.style.setProperty('--mf-loader-name-height',`${Math.max(90,window.innerHeight/3-20).toFixed(1)}px`);
  };
  requestAnimationFrame(syncLoaderNameHeight);
  document.fonts?.ready?.then(syncLoaderNameHeight);
  window.addEventListener('resize',syncLoaderNameHeight,{passive:true});
  const withTimeout=(promise,ms=4200)=>Promise.race([Promise.resolve(promise),new Promise(resolve=>setTimeout(resolve,ms))]);
  const resources=[];
  const imgs=[...document.images].filter(img=>{
    if(img.closest('#mfArtOverlay, #mfArtMiniWorld, #mfArtWorld, #mfArtPreview, #mfLoader'))return false;
    if(img.loading==='lazy')return false;
    return Boolean(img.currentSrc||img.getAttribute('src'));
  });
  imgs.forEach(img=>resources.push(withTimeout(new Promise(resolve=>{
    if(img.complete)return resolve();
    const done=()=>resolve();
    img.addEventListener('load',done,{once:true});
    img.addEventListener('error',done,{once:true});
  }))));
  resources.push(withTimeout(document.fonts?.ready||Promise.resolve()));
  resources.push(withTimeout(new Promise(resolve=>{
    if(document.readyState==='complete')return resolve();
    window.addEventListener('load',()=>resolve(),{once:true});
  })));
  let target=1,display=1,raf=0,finished=false,completionRequested=false;
  let settled=0;
  const total=Math.max(1,resources.length);
  const minDelay=450;
  const simulatedDuration=850;
  const startTime=performance.now();
  function paintFrontier(value){
    const ratio=Math.max(0,Math.min(1,value/100));
    if(progressEl){
      const txt=`${String(Math.round(value)).padStart(2,'0')}%`;
      progressEl.textContent=txt;
      progressEl.dataset.glitch=txt;
      progressEl.style.setProperty('font-variation-settings',`'wght' ${Math.round(100+ratio*900)}, 'opsz' ${Math.round(8+ratio*136)}`,'important');
      progressEl.style.setProperty('font-weight',String(Math.round(100+ratio*800)),'important');
    }
    if(barEl)barEl.style.width=`${ratio*100}%`;
    if(asciiEl&&Math.random()>.92)asciiEl.textContent=['// assembling experience','<> signal acquired','[] loading intent','++ almost human'][Math.floor(Math.random()*4)];
  }
  const render=()=>{
    raf=0;
    const elapsed=performance.now()-startTime;
    const simulatedCap=Math.min(100,1+(elapsed/simulatedDuration)*99);
    const effectiveTarget=Math.min(target,simulatedCap);
    display += (effectiveTarget-display) * (effectiveTarget>=99 ? 0.14 : 0.12);
    if(target===100 && display>99.55) display=100;
    paintFrontier(display);
    if(target===100&&display===100){beginCompletion();return;}
    if(Math.abs(target-display)>.04||effectiveTarget<target)raf=requestAnimationFrame(render);
  };
  const setTarget=v=>{
    target=Math.max(target,Math.min(100,v));
    if(!raf) raf=requestAnimationFrame(render);
  };
  resources.forEach(p=>Promise.resolve(p).then(()=>{ settled++; setTarget(3+(settled/total)*89); }));
  paintFrontier(1);
  const beginCompletion=()=>{
    if(finished)return;
    finished=true;
    setTimeout(()=>{
      loader.classList.add('is-completing');
      progressEl?.classList.add('is-final-glitch');
      if(asciiEl)asciiEl.textContent='// signal released';
      setTimeout(()=>{
        document.body.classList.add('mf-loader-revealing','mf-page-revealed');
        loader.classList.add('is-revealing');
        setTimeout(()=>document.body.classList.add('mf-name-revealed'),950);
        setTimeout(()=>loader.classList.add('done'),1500);
      },720);
    },1000);
  };
  const requestCompletion=()=>{
    if(completionRequested)return;
    completionRequested=true;
    target=100;
    if(!raf)raf=requestAnimationFrame(render);
  };
  Promise.allSettled(resources).then(()=>{
    const elapsed=performance.now()-startTime;
    setTimeout(requestCompletion,Math.max(0,minDelay-elapsed));
  });
  setTimeout(requestCompletion,6500);
}

startMfSite();

(function(){
  const mobileLayout=window.matchMedia("(max-width: 1024px), (pointer: coarse)");

  function nativeScroll(y){
    window.scrollTo({top:y,behavior:"smooth"});
  }

  if(mobileLayout.matches){
    /* Mobile uses the browser's native touch physics. The old custom touch
       momentum ran alongside native scrolling and made the page accelerate. */
    window._mfScroll=nativeScroll;
    return;
  }

  let targetY=window.scrollY,currentY=window.scrollY,ticking=false;
  const ease=.065;
  function tick(){
    const d=targetY-currentY;
    if(Math.abs(d)<.35){
      currentY=targetY;
      window.scrollTo(0,currentY);
      ticking=false;
      return;
    }
    currentY+=d*ease;
    window.scrollTo(0,currentY);
    requestAnimationFrame(tick);
  }
  window.addEventListener("wheel",e=>{
    if(document.body.classList.contains("project-open"))return;
    e.preventDefault();
    targetY+=e.deltaY*1.4;
    targetY=Math.max(0,Math.min(targetY,document.body.scrollHeight-window.innerHeight));
    if(!ticking){ticking=true;requestAnimationFrame(tick);}
  },{passive:false});
  window._mfScroll=function(y){
    targetY=y;
    currentY=window.scrollY;
    if(!ticking){ticking=true;requestAnimationFrame(tick);}
  };
})();

document.querySelectorAll('a[href^="#"]').forEach(link=>{link.addEventListener("click",e=>{const id=link.getAttribute("href").slice(1);if(!id){e.preventDefault();window._mfScroll?window._mfScroll(0):window.scrollTo({top:0,behavior:"smooth"});return}const target=document.getElementById(id);if(!target)return;e.preventDefault();const y=target.getBoundingClientRect().top+window.scrollY;if(window._mfScroll)window._mfScroll(y);else window.scrollTo({top:y,behavior:"smooth"});});});

const footerTop=document.getElementById("footerTop");if(footerTop){footerTop.addEventListener("click",e=>{e.preventDefault();window._mfScroll?window._mfScroll(0):window.scrollTo({top:0,behavior:"smooth"});});}

const grid=document.getElementById("mfGrid"),blur=document.getElementById("mfBlur"),footer=document.querySelector(".mf-footer");window.addEventListener("scroll",()=>{const y=window.scrollY,work=document.getElementById("work"),workTop=work?work.offsetTop:0,footerTop=footer?footer.offsetTop:0;if(grid){if(y<workTop-window.innerHeight*.8){grid.classList.remove("is-soft","is-gone")}else if(y<workTop){grid.classList.add("is-soft");grid.classList.remove("is-gone")}else{grid.classList.remove("is-soft");grid.classList.add("is-gone")}}if(blur){const onFooter=y>footerTop-window.innerHeight*.8,onHero=y<50;if(onHero||onFooter){blur.classList.remove("is-on");blur.classList.add("is-off")}else{blur.classList.add("is-on");blur.classList.remove("is-off")}}},{passive:true});

const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add("visible")})},{threshold:.1});document.querySelectorAll(".mf-reveal").forEach(el=>revealObserver.observe(el));

/* HERO GRID — preserve segmented touch behavior; only shorten the peak pause */
(function(){
  const grid=document.getElementById("mfGrid");
  const hero=document.getElementById("heroSection");
  if(!grid||!hero)return;

  const mobileGrid=window.matchMedia("(max-width: 1024px)").matches;
  const vertical=mobileGrid?[1/3,2/3]:Array.from({length:9},(_,i)=>(i+1)/10);
  const horizontal=[1/3,2/3];
  const SEGMENT=93;
  const HIT=17;
  const HOLD=115;

  function sparkLine(axis,ratio,x,y){
    const segment=document.createElement("span");
    segment.className=`mf-grid-segment is-${axis}`;
    if(axis==="v"){
      segment.style.left=`${ratio*100}%`;
      segment.style.top=`${Math.max(0,Math.min(innerHeight-SEGMENT,y-SEGMENT/2))}px`;
      segment.style.height=SEGMENT+"px";
    }else{
      segment.style.top=`${ratio*100}%`;
      segment.style.left=`${Math.max(0,Math.min(innerWidth-SEGMENT,x-SEGMENT/2))}px`;
      segment.style.width=SEGMENT+"px";
    }
    grid.appendChild(segment);
    requestAnimationFrame(()=>segment.classList.add("is-on"));
    setTimeout(()=>segment.classList.remove("is-on"),HOLD);
    setTimeout(()=>segment.remove(),HOLD+700);
  }

  let previous={x:null,y:null};
  window.addEventListener("pointermove",e=>{
    if(window.scrollY>hero.offsetHeight)return;
    const points=[];
    if(previous.x!==null){
      const distance=Math.hypot(e.clientX-previous.x,e.clientY-previous.y);
      const steps=Math.max(1,Math.ceil(distance/12));
      for(let i=1;i<=steps;i++)points.push({
        x:previous.x+(e.clientX-previous.x)*i/steps,
        y:previous.y+(e.clientY-previous.y)*i/steps
      });
    }else points.push({x:e.clientX,y:e.clientY});
    previous={x:e.clientX,y:e.clientY};

    points.forEach(point=>{
      vertical.forEach(r=>{if(Math.abs(point.x-innerWidth*r)<HIT)sparkLine("v",r,point.x,point.y);});
      horizontal.forEach(r=>{if(Math.abs(point.y-innerHeight*r)<HIT)sparkLine("h",r,point.x,point.y);});
    });
  },{passive:true});
  window.addEventListener("pointerleave",()=>{previous={x:null,y:null};});
})();

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
      "/media/projects/miunae/01-miunae-logo.jpg",
      "/media/projects/miunae/02-miunae-web.jpg",
      "/media/projects/miunae/03-miunae-insta.jpg",
      "/media/projects/miunae/04-miunae-all.jpg",
      "/media/projects/miunae/05-miunae-brandkit.jpg"
    ],
    "02":[
      "/media/projects/goballer/01-goballer-logo.jpg",
      "/media/projects/goballer/02-goballer-brand.jpg",
      "/media/projects/goballer/03-goballer-app.jpg",
      "/media/projects/goballer/app/03-goballer-ios-1.jpg",
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
      img.src=src; img.alt=''; img.loading='eager'; img.decoding='async'; img.onerror=()=>{img.onerror=null;img.src=src.startsWith('/')?'.'+src:src;};
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
  const shell=overlay?.querySelector(".mf-project-shell");
  const gallery=document.getElementById("projectGallery");
  const slides=document.getElementById("projectSlides");
  const closeButton=overlay?.querySelector(".mf-close");
  const controlsHint=document.getElementById("projectControlsHint");
  if(!overlay||!shell||!gallery||!slides||!closeButton)return;

  const goballerCards=[
    "01-0.jpg","01-1.jpg","01-2.jpg",
    "02-0.jpg","02-1.jpg","02-2.jpg","02-3.jpg","02-4.jpg","02-5.jpg","02-6.jpg","02-7.jpg","02-8.jpg",
    "03-0.jpg","03-1.jpg","03-2.jpg",
    "04-0.jpg","04-1.jpg","04-2.jpg","04-3.jpg","04-4.jpg","04-5.jpg",
    "05-0.jpg"
  ].map(name=>`/media/projects/goballer/brand/${name}`);

  const goballerAppCards=[
    {type:"image",src:"/media/projects/goballer/app/03-goballer-ios-1.jpg",title:"GoBaller iOS screen 1"},
    {type:"image",src:"/media/projects/goballer/app/03-goballer-ios-2.jpg",title:"GoBaller iOS screen 2"},
    {type:"image",src:"/media/projects/goballer/app/03-goballer-ios-3.jpg",title:"GoBaller iOS screen 3"}
  ];

  const projectData={
    "01":{
      title:"MIUNĀE",
      intro:"A natural skincare brand built around time, tactility and restraint. The system turns Eastern European botanical knowledge into a contemporary luxury world without sanding away its character.",
      scope:"Creative direction, brand system, packaging, digital art direction, campaign language and launch expression.",
      context:"MIUNĀE needed to enter a saturated skincare category without resembling another polished wellness brand. Its formulas carried real history, but the story had to feel immediate rather than nostalgic. The work needed enough discipline to feel premium and enough tension to remain alive.",
      approach:"I built the identity around time as both ingredient and attitude. Typography, material choices and imagery were reduced until every element felt deliberate. The resulting system moves between quiet control and botanical overgrowth while staying recognizably MIUNĀE.",
      images:[
        "/media/projects/miunae/01-miunae-logo.jpg",
        {type:"iframe",src:"https://www.miunae.com/",title:"MIUNĀE live website",liveKey:"website"},
        {type:"curator",src:"https://cdn.curator.io/published/8bcd46ff-7c2b-4fd0-baa3-8d3df4db1ee3.js",title:"@miunae.beauty live feed",liveKey:"instagram"},
        "/media/projects/miunae/04-miunae-all.jpg",
        {type:"iframe",src:"https://www.miunae.com/brand-kit",title:"MIUNĀE live brand kit",liveKey:"brandKit"}
      ]
    },
    "02":{
      title:"GoBaller",
      intro:"A football coaching app for players of all ages. The product makes structured training feel clear, motivating and personal without turning the experience into another generic fitness interface.",
      scope:"Brand identity, product strategy, iOS application design, interaction system and visual direction.",
      context:"GoBaller had to work for ambitious young players, parents and experienced coaches at the same time. The product contained a deep training system, but the interface could not feel technical or intimidating. It needed credibility on the pitch and clarity in the hand.",
      approach:"I organized the product around progression, repetition and visible momentum. The identity borrows energy from sport without relying on predictable visual clichés. Every screen was shaped to keep the next useful action obvious while preserving a strong, ownable character.",
      images:[
        {type:"video",src:"/media/projects/goballer/logo/01-goballer-logo.mp4",title:"GoBaller product film"},
        {type:"carousel",background:"/media/projects/goballer/brand/01-goballer-field.jpg",cards:goballerCards,title:"GoBaller brand system"},
        {type:"video",src:"/media/projects/goballer/app-vid/03-goballer-ios-1.mp4",title:"GoBaller iOS application film"},
        {type:"mediaCarousel",cards:goballerAppCards,title:"GoBaller iOS application gallery"},
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

  const projectOrder=Object.keys(projectData);
  const fields={
    index:document.getElementById("projectIndex"),
    title:document.getElementById("projectTitle"),
    intro:document.getElementById("projectIntro"),
    scope:document.getElementById("projectScope"),
    context:document.getElementById("projectContext"),
    approach:document.getElementById("projectApproach"),
    counter:document.getElementById("projectCounter")
  };

  let currentProjectKey="01";
  let activeIndex=0;
  let wheelLocked=false;
  let wheelTotal=0;
  let wheelReset=0;
  let projectSwitching=false;
  let currentCarousel=null;
  const liveStates={website:false,instagram:false,brandKit:false};
  const mobileProjectLayout=window.matchMedia("(max-width: 1024px)");

  const esc=s=>String(s).replace(/[&<>'"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[ch]));

  function liveLabel(key,active){
    if(key==="instagram"){
      return active
        ? '<span class="mf-live-toggle-label">EXIT THE INSTA</span>'
        : '<span class="mf-live-toggle-label">BROWSE <em>[LIVE]</em> <span class="mf-live-handle">@miunae.beauty</span></span>';
    }
    if(key==="brandKit"){
      return active
        ? '<span class="mf-live-toggle-label">EXIT THE WEB</span>'
        : '<span class="mf-live-toggle-label">BROWSE <em>[LIVE]</em> MIUNĀE.COM / BRAND-KIT</span>';
    }
    return active
      ? '<span class="mf-live-toggle-label">EXIT THE WEB</span>'
      : '<span class="mf-live-toggle-label">BROWSE <em>[LIVE]</em> MIUNĀE.COM</span>';
  }

  function renderEndCard(key,slideIndex){
    const remaining=projectOrder.filter(other=>other!==key);
    return `<figure class="mf-project-slide mf-project-end-slide" data-slide="${slideIndex}">
      <div class="mf-project-end-card">
        <div class="mf-project-end-list" aria-label="More projects">
          ${remaining.map(other=>`<button class="mf-project-end-link" type="button" data-project-key="${other}">${esc(projectData[other].title)}</button>`).join("")}
        </div>
        <div class="mf-project-end-arrow mf-project-end-arrow-left" aria-hidden="true">→</div>
        <div class="mf-project-end-arrow mf-project-end-arrow-right" aria-hidden="true">→</div>
        <button class="mf-project-exit-button" type="button"><span>Get me outta here!</span><span>[Screaming noises]</span></button>
      </div>
    </figure>`;
  }

  function projectMediaCurtain(){
    return "";
  }

  function projectVideoLoader(copy="LOADING VIDEO"){
    return `<div class="mf-project-video-loader" aria-hidden="true"><div class="mf-project-video-loader-copy"><span>${esc(copy)}<i>_</i></span><b class="mf-project-video-loader-percent">01%</b></div><div class="mf-project-video-loader-bars"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>`;
  }

  function carouselItemMarkup(item,index){
    const normalized=typeof item==="string"?{type:"image",src:item}:item;
    if(normalized?.type==="video"){
      return `<video src="${esc(normalized.src)}" title="${esc(normalized.title||`Carousel video ${index+1}`)}" autoplay muted loop playsinline preload="metadata"></video>`;
    }
    return `<img src="${esc(normalized?.src||"")}" alt="${esc(normalized?.title||`Carousel visual ${index+1}`)}" draggable="false">`;
  }

  function renderMedia(project,media,i){
    if(media&&typeof media==="object"&&media.type==="iframe"){
      const key=media.liveKey||"website";
      const active=!!liveStates[key];
      const loaderCopy=key==="brandKit"?"LOADING MIUNĀE BRAND KIT":"LOADING MIUNĀE.COM";
      return `<figure class="mf-project-slide mf-project-slide-live" data-slide="${i}" data-live-key="${key}">
        <div class="mf-live-site">
          <div class="mf-live-loader" aria-hidden="true"><div class="mf-live-loader-copy">${loaderCopy}<span>_</span></div><div class="mf-live-loader-bars"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
          <iframe src="${esc(media.src)}" title="${esc(media.title||project.title+' live website')}" loading="eager" allow="fullscreen" referrerpolicy="strict-origin-when-cross-origin"></iframe>
          <div class="mf-live-shield" aria-hidden="true"></div>
          <button class="mf-live-toggle" type="button" aria-pressed="${active?'true':'false'}">${liveLabel(key,active)}</button>
        </div>
        ${projectMediaCurtain()}
      </figure>`;
    }
    if(media&&typeof media==="object"&&media.type==="curator"){
      const key=media.liveKey||"instagram";
      const active=!!liveStates[key];
      return `<figure class="mf-project-slide mf-project-slide-live mf-project-slide-instagram" data-slide="${i}" data-live-key="${key}" data-curator-src="${esc(media.src)}">
        <div class="mf-live-site mf-instagram-live-site">
          <div class="mf-live-loader" aria-hidden="true"><div class="mf-live-loader-copy">LOADING @MIUNAE.BEAUTY<span>_</span></div><div class="mf-live-loader-bars"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
          <div class="mf-instagram-embed-host" aria-label="${esc(media.title||'MIUNĀE Instagram feed')}"><div id="curator-feed-default-feed-layout" class="mf-curator-feed"><a href="https://curator.io" target="_blank" rel="noopener" class="crt-logo crt-tag">Powered by Curator.io</a></div></div>
          <div class="mf-live-shield" aria-hidden="true"></div>
          <button class="mf-live-toggle" type="button" aria-pressed="${active?'true':'false'}">${liveLabel(key,active)}</button>
        </div>
        ${projectMediaCurtain()}
      </figure>`;
    }
    if(media&&typeof media==="object"&&media.type==="video"){
      const fallback=media.fallbackSrc?` data-fallback-src="${esc(media.fallbackSrc)}"`:"";
      return `<figure class="mf-project-slide mf-project-slide-image mf-project-slide-video" data-slide="${i}"><div class="mf-project-image-viewport mf-project-video-viewport"><video src="${esc(media.src)}"${fallback} title="${esc(media.title||project.title+' project video')}" autoplay muted loop playsinline preload="metadata" aria-label="${esc(media.title||project.title+' project video')}"></video>${projectVideoLoader()}</div>${projectMediaCurtain()}</figure>`;
    }
    if(media&&typeof media==="object"&&(media.type==="carousel"||media.type==="mediaCarousel")){
      const mixed=media.type==="mediaCarousel";
      const first=media.cards[0];
      const second=media.cards[1]||first;
      return `<figure class="mf-project-slide mf-project-slide-carousel${mixed?' mf-project-slide-media-carousel':''}" data-slide="${i}" data-carousel="true">
        <div class="mf-goballer-carousel${mixed?' mf-goballer-app-carousel mf-carousel-fullframe':''}" aria-label="${esc(media.title||'Project carousel')}">
          ${media.background?`<img class="mf-carousel-background" src="${esc(media.background)}" alt="" draggable="false">`:''}
          <div class="mf-carousel-stage">
            ${mixed?`<div class="mf-carousel-card mf-carousel-media-card mf-carousel-card-current">${carouselItemMarkup(first,0)}</div><div class="mf-carousel-card mf-carousel-media-card mf-carousel-card-next" aria-hidden="true">${carouselItemMarkup(second,1)}</div>`:`<img class="mf-carousel-card mf-carousel-card-current" src="${esc(first)}" alt="GoBaller visual 1" draggable="false"><img class="mf-carousel-card mf-carousel-card-next" src="${esc(second)}" alt="" draggable="false" aria-hidden="true">`}
          </div>
          <div class="mf-carousel-runtime-loader" aria-hidden="true"><div class="mf-carousel-runtime-loader-copy"><span>LOADING VIDEO<i>_</i></span><b class="mf-carousel-runtime-loader-percent">01%</b></div><div class="mf-carousel-runtime-loader-bars"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
          <button class="mf-carousel-zone mf-carousel-zone-left" type="button" aria-label="Previous carousel image"></button>
          <button class="mf-carousel-zone mf-carousel-zone-right" type="button" aria-label="Next carousel image"></button>
          <div class="mf-carousel-cursor" aria-hidden="true"><div class="mf-carousel-cursor-inner"><b>→</b><span># 02</span></div></div>
          <div class="mf-carousel-swipe-hint" aria-hidden="true"><span class="mf-carousel-swipe-arrow">←</span><span class="mf-carousel-swipe-copy"><b class="mf-carousel-swipe-count">01 / ${String(media.cards.length).padStart(2,'0')}</b><em>SWIPE</em></span><span class="mf-carousel-swipe-arrow">→</span></div>
        </div>
        ${projectMediaCurtain()}
      </figure>`;
    }
    return `<figure class="mf-project-slide mf-project-slide-image" data-slide="${i}"><div class="mf-project-image-viewport"><img src="${esc(media)}" alt="${esc(project.title)} project visual ${i+1}" loading="${i===0?'eager':'lazy'}" draggable="false"></div>${projectMediaCurtain()}</figure>`;
  }

  function renderProject(key){
    currentProjectKey=key;
    const project=projectData[key]||projectData["01"];
    fields.index.textContent=`PROJECT ${key}`;
    fields.title.textContent=project.title;
    fields.intro.textContent=project.intro;
    fields.scope.textContent=project.scope;
    fields.context.textContent=project.context;
    fields.approach.textContent=project.approach;
    slides.innerHTML=project.images.map((media,i)=>renderMedia(project,media,i)).join("")+renderEndCard(key,project.images.length);

    setupLiveSlides();
    setupCurator();
    setupProjectVideoLoaders();
    setupStaticImageSlides();
    setupCarousels(project);
    setupEndCard();

    activeIndex=0;
    currentCarousel=null;
    gallery.scrollTop=0;
    overlay.scrollTop=0;
    updateCounter();
    updateActiveExtras();
  }

  function setupProjectVideoLoaders(){
    slides.querySelectorAll('.mf-project-slide-video').forEach(slide=>{
      const video=slide.querySelector(':scope .mf-project-video-viewport > video');
      if(!video)return;
      let fallbackUsed=false;
      let done=false;
      let loaderShown=false,progress=1,progressTimer=0;
      const percent=slide.querySelector('.mf-project-video-loader-percent');
      const setProgress=value=>{progress=Math.max(progress,Math.min(100,value));if(percent)percent.textContent=`${String(Math.round(progress)).padStart(2,'0')}%`;};
      const timer=setTimeout(()=>{
        if(done)return;
        loaderShown=true;
        slide.classList.add('is-video-loading');
        setProgress(1);
        progressTimer=setInterval(()=>setProgress(Math.min(92,progress+1+Math.random()*3)),120);
      },1000);
      const finish=()=>{
        if(done)return;
        done=true;
        clearTimeout(timer);
        clearInterval(progressTimer);
        if(loaderShown){setProgress(100);setTimeout(()=>slide.classList.remove('is-video-loading'),180);}
        else slide.classList.remove('is-video-loading');
        slide.classList.add('is-video-ready');
        video.muted=true;
        video.playsInline=true;
        video.play().catch(()=>{});
      };
      const tryFallback=()=>{
        const fallback=video.dataset.fallbackSrc;
        if(fallback&&!fallbackUsed){
          fallbackUsed=true;
          done=false;
          video.src=fallback;
          video.load();
          return;
        }
        finish();
      };
      if(video.readyState>=2)finish();
      else{
        video.addEventListener('loadeddata',finish,{once:true});
        video.addEventListener('canplay',finish,{once:true});
        video.addEventListener('error',tryFallback,{once:true});
        setTimeout(finish,8000);
      }
    });
  }

  function setupProjectMediaReveals(){}
  function revealProjectSlide(){}

  function applyLiveState(slide,active){
    const key=slide.dataset.liveKey||"website";
    const frame=slide.querySelector("iframe");
    const host=slide.querySelector(".mf-instagram-embed-host");
    const toggle=slide.querySelector(".mf-live-toggle");
    liveStates[key]=active;
    slide.classList.toggle("is-browsing",active);
    slide.classList.toggle("is-paused",!active);
    if(frame)frame.style.pointerEvents=active?"auto":"none";
    if(host)host.style.pointerEvents=active?"auto":"none";
    if(toggle){toggle.setAttribute("aria-pressed",active?"true":"false");toggle.innerHTML=liveLabel(key,active);}
  }

  function setupLiveSlides(){
    slides.querySelectorAll(".mf-project-slide-live").forEach(slide=>{
      const key=slide.dataset.liveKey||"website";
      const frame=slide.querySelector("iframe");
      const toggle=slide.querySelector(".mf-live-toggle");
      if(frame)frame.addEventListener("load",()=>slide.classList.add("is-loaded"),{once:true});
      toggle?.addEventListener("click",event=>{event.preventDefault();event.stopPropagation();applyLiveState(slide,!slide.classList.contains("is-browsing"));});
      applyLiveState(slide,!!liveStates[key]);
    });
  }

  function setupCurator(){
    const instagramSlide=slides.querySelector('.mf-project-slide-instagram');
    if(!instagramSlide)return;
    const curatorHost=instagramSlide.querySelector('#curator-feed-default-feed-layout');
    const scriptSrc=instagramSlide.dataset.curatorSrc;
    let finished=false;
    const finish=()=>{if(finished)return;finished=true;instagramSlide.classList.add('is-loaded');applyLiveState(instagramSlide,!!liveStates.instagram);};
    if(!curatorHost||!scriptSrc){finish();return;}
    const observer=new MutationObserver(()=>{const rendered=curatorHost.querySelector('.crt-feed, .crt-post, .crt-grid-post, iframe')||curatorHost.children.length>1;if(rendered){observer.disconnect();finish();}});
    observer.observe(curatorHost,{childList:true,subtree:true});
    document.querySelectorAll('script[data-mf-curator-runtime]').forEach(node=>node.remove());
    const curatorScript=document.createElement('script');
    curatorScript.async=true;curatorScript.charset='UTF-8';curatorScript.src=scriptSrc;curatorScript.dataset.mfCuratorRuntime='true';
    curatorScript.addEventListener('load',()=>setTimeout(finish,900),{once:true});curatorScript.addEventListener('error',finish,{once:true});
    const firstScript=document.getElementsByTagName('script')[0];firstScript.parentNode.insertBefore(curatorScript,firstScript);
    setTimeout(()=>{observer.disconnect();finish();},5200);
  }

  function setupStaticImageSlides(){
    if(!mobileProjectLayout.matches)return;
    slides.querySelectorAll('.mf-project-slide-image .mf-project-image-viewport').forEach(viewport=>{
      const media=viewport.querySelector('img, video');
      if(!media)return;

      /* V49's contain-first state applies only to still images. Videos keep
         their established V48 presentation and interaction unchanged. */
      const isStillImage=media.tagName==='IMG';
      if(isStillImage){
        viewport.classList.add('is-fit');
        viewport.dataset.position='50';
        viewport.style.setProperty('--image-x','50%');
        media.addEventListener('dragstart',event=>event.preventDefault());
        return;
      }else{
        viewport.classList.remove('is-fit');
      }

      media.addEventListener('dragstart',event=>event.preventDefault());
      if(media.tagName==='VIDEO'){
        media.muted=true;
        media.playsInline=true;
        media.play().catch(()=>{});
      }
    });
  }

  function setupCarousels(project){
    slides.querySelectorAll('.mf-project-slide-carousel').forEach(slide=>{
      const media=project.images[Number(slide.dataset.slide)];
      if(!media||!(media.type==="carousel"||media.type==="mediaCarousel"))return;
      const root=slide.querySelector('.mf-goballer-carousel');
      let current=root.querySelector('.mf-carousel-card-current');
      let nextCard=root.querySelector('.mf-carousel-card-next');
      const leftZone=root.querySelector('.mf-carousel-zone-left');
      const rightZone=root.querySelector('.mf-carousel-zone-right');
      const cursor=root.querySelector('.mf-carousel-cursor');
      const cursorInner=cursor.querySelector('.mf-carousel-cursor-inner');
      const arrowEl=cursorInner.querySelector('b');
      const numberEl=cursorInner.querySelector('span');
      const swipeCountEl=root.querySelector('.mf-carousel-swipe-count');
      let index=0,animating=false,isDown=false,startX=0,startY=0,moved=false,panStart=0;
      const cards=media.cards;
      const mixed=media.type==="mediaCarousel";
      const wrap=n=>(n%cards.length+cards.length)%cards.length;
      const label=n=>`# ${String(wrap(n)+1).padStart(2,'0')}`;
      const normalizeItem=item=>typeof item==="string"?{type:"image",src:item}:item;
      const itemAt=n=>normalizeItem(cards[wrap(n)]);
      const syncCurrentMediaType=()=>{
        if(!mixed)return;
        const type=itemAt(index).type==='video'?'video':'image';
        root.classList.toggle('is-current-image',type==='image');
        root.classList.toggle('is-current-video',type==='video');
        if(type==='video'){
          root.classList.remove('is-expanded');
          root.dataset.panX='0';
          root.style.setProperty('--carousel-pan-x','0px');
        }
      };
      syncCurrentMediaType();
      const preloadOne=item=>{
        const normalized=normalizeItem(item);
        if(normalized.type==="video")return;
        const preload=new Image();preload.decoding='async';preload.src=normalized.src;
      };
      const preloadAround=at=>{[at-1,at,at+1].forEach(n=>preloadOne(cards[wrap(n)]));};
      if(mobileProjectLayout.matches)preloadAround(index);
      else cards.forEach(preloadOne);

      function mountCard(card,item,itemIndex,showLoader=false){
        const normalized=normalizeItem(item);
        if(!mixed){
          card.src=normalized.src;
          card.alt=`GoBaller visual ${itemIndex+1}`;
          card._mfReady=card.decode?.().catch(()=>{})||Promise.resolve();
          return card._mfReady;
        }
        card.replaceChildren();
        if(normalized.type==="video"){
          const video=document.createElement('video');
          video.src=normalized.src;
          if(normalized.fallbackSrc)video.dataset.fallbackSrc=normalized.fallbackSrc;
          video.title=normalized.title||`Carousel video ${itemIndex+1}`;
          video.muted=true;video.loop=true;video.playsInline=true;video.preload='auto';
          video.autoplay=true;
          card.appendChild(video);
          card._mfReady=new Promise(resolve=>{
            let finished=false;
            let fallbackUsed=false;
            let loaderShown=false,progress=1,progressTimer=0;
            const percent=root.querySelector('.mf-carousel-runtime-loader-percent');
            const setProgress=value=>{progress=Math.max(progress,Math.min(100,value));if(percent)percent.textContent=`${String(Math.round(progress)).padStart(2,'0')}%`;};
            const loaderTimer=showLoader?setTimeout(()=>{
              if(finished)return;
              loaderShown=true;
              root.classList.add('is-loading-media');
              setProgress(1);
              progressTimer=setInterval(()=>setProgress(Math.min(92,progress+1+Math.random()*3)),120);
            },1000):0;
            const finish=()=>{
              if(finished)return;finished=true;
              if(loaderTimer)clearTimeout(loaderTimer);
              clearInterval(progressTimer);
              if(loaderShown){setProgress(100);setTimeout(()=>root.classList.remove('is-loading-media'),180);}
              else root.classList.remove('is-loading-media');
              video.play().catch(()=>{});
              resolve();
            };
            const fail=()=>{
              const fallback=video.dataset.fallbackSrc;
              if(fallback&&!fallbackUsed){
                fallbackUsed=true;
                video.src=fallback;
                video.load();
                return;
              }
              finish();
            };
            if(video.readyState>=2)finish();
            else{
              video.addEventListener('loadeddata',finish,{once:true});
              video.addEventListener('canplay',finish,{once:true});
              video.addEventListener('error',fail,{once:true});
              setTimeout(finish,8000);
            }
          });
          return card._mfReady;
        }
        const img=document.createElement('img');
        img.src=normalized.src;img.alt=normalized.title||`Carousel visual ${itemIndex+1}`;img.draggable=false;
        if(mixed&&mobileProjectLayout.matches){
          card.style.background='#000';
          img.style.width='100%';
          img.style.height='100%';
          img.style.objectFit='contain';
          img.style.objectPosition='center';
        }
        card.appendChild(img);
        card._mfReady=img.decode?.().catch(()=>{})||Promise.resolve();
        return card._mfReady;
      }

      /* Frame three now begins with video, so initialize it through the same
         delayed-loader path used when a video is reached later in the deck. */
      if(mixed&&itemAt(index).type==='video')mountCard(current,cards[index],index,true);

      function updateCursorLabel(){
        const zone=cursor.dataset.zone||'right';
        arrowEl.textContent=zone==='left'?'←':'→';
        numberEl.textContent=zone==='left'?label(index-1):label(index+1);
        if(swipeCountEl)swipeCountEl.textContent=`${String(index+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
      }

      function emitCursorGhost(direction){
        if(mobileProjectLayout.matches||!cursor.classList.contains('is-visible'))return;
        const ghost=document.createElement('b');
        ghost.className='mf-carousel-cursor-ghost';
        ghost.textContent=arrowEl.textContent;
        cursorInner.appendChild(ghost);
        const drift=direction>0?15:-15;
        ghost.animate([
          {opacity:1,transform:'translate3d(-50%,0,0)'},
          {opacity:0,transform:`translate3d(calc(-50% + ${drift}px),0,0)`}
        ],{duration:420,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'}).finished
          .catch(()=>{})
          .then(()=>ghost.remove());
      }

      function prepareIncoming(target){
        nextCard.style.opacity='0';
        nextCard.style.transform='translate3d(0,0,0) scale(.96)';
        nextCard.style.filter='none';
        return mountCard(nextCard,cards[target],target,mixed&&itemAt(target).type==="video");
      }

      async function move(direction,fromGesture=false){
        if(animating)return;
        animating=true;
        root.classList.remove('is-expanded','is-dragging');
        root.dataset.panX='0';
        root.style.setProperty('--carousel-pan-x','0px');
        const target=wrap(index+direction);
        emitCursorGhost(direction);
        const oldCurrent=current;
        const incoming=nextCard;
        oldCurrent.getAnimations().forEach(animation=>animation.cancel());
        incoming.getAnimations().forEach(animation=>animation.cancel());

        const enterFrom=direction>0?30:-30;
        const exitTo=direction>0?-30:30;
        const ready=fromGesture
          ? (incoming._mfReady||incoming.decode?.().catch(()=>{})||Promise.resolve())
          : prepareIncoming(target);
        const outgoingFromTransform=fromGesture&&oldCurrent.style.transform
          ? oldCurrent.style.transform
          : 'translate3d(0,0,0) scale(1)';
        const outgoingFromOpacity=fromGesture&&oldCurrent.style.opacity
          ? Number(oldCurrent.style.opacity)
          : 1;
        const incomingFromTransform=fromGesture&&incoming.style.transform
          ? incoming.style.transform
          : `translate3d(${enterFrom}px,0,0) scale(.955)`;
        const incomingFromOpacity=fromGesture&&incoming.style.opacity
          ? Number(incoming.style.opacity)
          : 0;

        /* The current card reacts immediately and only drifts symbolically.
           The replacement enters from the matching side after it is decoded.
           Swapping the two DOM buffers prevents the old source from flashing
           back while the browser decodes the next image. */
        const outgoing=oldCurrent.animate([
          {transform:outgoingFromTransform,opacity:outgoingFromOpacity},
          {transform:`translate3d(${exitTo}px,0,0) scale(.955)`,opacity:0}
        ],{
          duration:620,
          easing:'cubic-bezier(.32,.72,0,1)',
          fill:'forwards'
        });

        await ready;
        const incomingAnimation=incoming.animate([
          {transform:incomingFromTransform,opacity:incomingFromOpacity},
          {transform:'translate3d(0,0,0) scale(1)',opacity:1}
        ],{
          duration:820,
          easing:'cubic-bezier(.16,1,.3,1)',
          fill:'forwards'
        });

        await Promise.allSettled([outgoing.finished,incomingAnimation.finished]);
        index=target;
        syncCurrentMediaType();

        oldCurrent.classList.remove('mf-carousel-card-current');
        oldCurrent.classList.add('mf-carousel-card-next');
        incoming.classList.remove('mf-carousel-card-next');
        incoming.classList.add('mf-carousel-card-current');

        current=incoming;
        nextCard=oldCurrent;
        current.getAnimations().forEach(animation=>animation.cancel());
        nextCard.getAnimations().forEach(animation=>animation.cancel());
        current.removeAttribute('style');
        nextCard.removeAttribute('style');
        mountCard(nextCard,cards[wrap(index+direction)],wrap(index+direction),false);

        updateCursorLabel();
        if(mobileProjectLayout.matches)preloadAround(index);
        animating=false;
      }

      updateCursorLabel();
      const api={root,slide,move,get index(){return index;}};
      root._mfCarousel=api;
      leftZone.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();move(-1);});
      rightZone.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();move(1);});
      root.addEventListener('pointermove',event=>{
        if(mobileProjectLayout.matches)return;
        const r=root.getBoundingClientRect();
        cursor.dataset.zone=event.clientX-r.left<r.width*.5?'left':'right';
        updateCursorLabel();
        cursor.style.transform=`translate3d(${event.clientX-r.left}px,${event.clientY-r.top}px,0)`;
        cursor.classList.add('is-visible');
      });
      root.addEventListener('pointerleave',()=>cursor.classList.remove('is-visible'));

      if(mobileProjectLayout.matches){
        root.style.setProperty('--carousel-pan-x','0px');
        let swipeDirection=0,swipeTarget=-1;
        const clearSwipePreview=()=>{
          root.classList.remove('is-dragging');
          current.style.transform='';
          current.style.opacity='';
          nextCard.style.transform='';
          nextCard.style.opacity='';
          nextCard.style.pointerEvents='';
          swipeDirection=0;
          swipeTarget=-1;
        };
        let touchLock=null,touchX=0,touchY=0;
        root.addEventListener('touchstart',event=>{
          const touch=event.touches[0];
          if(!touch)return;
          touchX=touch.clientX;touchY=touch.clientY;touchLock=null;
        },{passive:true});
        root.addEventListener('touchmove',event=>{
          const touch=event.touches[0];
          if(!touch)return;
          const dx=touch.clientX-touchX,dy=touch.clientY-touchY;
          if(!touchLock&&Math.max(Math.abs(dx),Math.abs(dy))>7){
            touchLock=Math.abs(dx)>Math.abs(dy)*1.05?'x':'y';
          }
          if(touchLock==='x')event.preventDefault();
        },{passive:false});
        root.addEventListener('touchend',()=>{touchLock=null;},{passive:true});
        root.addEventListener('touchcancel',()=>{touchLock=null;},{passive:true});

        root.addEventListener('pointerdown',event=>{
          if(animating)return;
          isDown=true;moved=false;startX=event.clientX;startY=event.clientY;
          panStart=Number(root.dataset.panX||0);
          root.setPointerCapture?.(event.pointerId);
        });
        root.addEventListener('pointermove',event=>{
          if(!isDown||animating)return;
          const dx=event.clientX-startX,dy=event.clientY-startY;
          if(Math.abs(dx)+Math.abs(dy)>10)moved=true;
          if(Math.abs(dx)<=Math.abs(dy)+5)return;
          event.preventDefault();
          const direction=dx<0?1:-1;
          const target=wrap(index+direction);
          if(direction!==swipeDirection||target!==swipeTarget){
            swipeDirection=direction;swipeTarget=target;
            mountCard(nextCard,cards[target],target,mixed&&itemAt(target).type==="video");
          }
          const width=Math.max(1,root.clientWidth);
          const progress=Math.min(1,Math.abs(dx)/(width*.72));
          const restrained=dx*.62;
          const incomingStart=(direction>0?1:-1)*Math.min(width*.32,120);
          root.classList.add('is-dragging');
          current.style.transform=`translate3d(${restrained}px,0,0) scale(${1-progress*.035})`;
          current.style.opacity=String(1-progress*.58);
          nextCard.style.opacity=String(progress);
          nextCard.style.transform=`translate3d(${incomingStart*(1-progress)}px,0,0) scale(${.965+progress*.035})`;
          nextCard.style.pointerEvents='none';
        },{passive:false});
        const endPointer=event=>{
          if(!isDown)return;
          isDown=false;
          const dx=event.clientX-startX,dy=event.clientY-startY;
          try{root.releasePointerCapture?.(event.pointerId);}catch(_){ }
          const shouldMove=Math.abs(dx)>44&&Math.abs(dx)>Math.abs(dy)+8;
          if(shouldMove){
            root.classList.remove('is-dragging');
            swipeDirection=0;swipeTarget=-1;
            move(dx<0?1:-1,true);
          }else clearSwipePreview();
        };
        root.addEventListener('pointerup',endPointer);
        root.addEventListener('pointercancel',()=>{isDown=false;clearSwipePreview();});
      }
    });
  }

  function setupEndCard(){
    const endCard=slides.querySelector('.mf-project-end-card');
    if(!endCard)return;
    const arrows=[...endCard.querySelectorAll('.mf-project-end-arrow')];
    let targetX=0,currentX=0,targetY=0,currentY=0,arrowFrame=0,hovering=false;

    function animateArrows(){
      currentX+=(targetX-currentX)*.16;
      currentY+=(targetY-currentY)*.18;
      arrows.forEach(arrow=>{
        arrow.style.setProperty('--arrow-shift-x',`${currentX.toFixed(2)}px`);
        arrow.style.setProperty('--arrow-shift-y',`${currentY.toFixed(2)}px`);
      });
      if(hovering||Math.abs(targetX-currentX)>.05||Math.abs(targetY-currentY)>.05){
        arrowFrame=requestAnimationFrame(animateArrows);
      }else arrowFrame=0;
    }
    function queueArrows(){if(!arrowFrame)arrowFrame=requestAnimationFrame(animateArrows);}

    endCard.querySelectorAll('.mf-project-end-link').forEach(link=>{
      const labelText=link.textContent.trim();
      link.textContent='';
      const chars=[];
      labelText.split(' ').forEach((word,wordIndex)=>{
        const wordSpan=document.createElement('span');
        wordSpan.className='mf-project-end-word';
        [...word].forEach(character=>{
          const char=document.createElement('span');
          char.className='mf-project-end-char';
          char.textContent=character;
          wordSpan.appendChild(char);chars.push(char);
        });
        link.appendChild(wordSpan);
        if(wordIndex<labelText.split(' ').length-1)link.appendChild(document.createTextNode(' '));
      });
      let textFrame=0,px=-9999,py=-9999,inside=false;
      const renderText=()=>{
        textFrame=0;
        const radius=135;
        chars.forEach(char=>{
          const rect=char.getBoundingClientRect();
          const n=inside?Math.max(0,1-Math.hypot(px-rect.left-rect.width/2,py-rect.top-rect.height/2)/radius):0;
          const weight=400+450*n;
          char.style.fontVariationSettings=`'wght' ${weight.toFixed(0)}, 'opsz' ${(9+31*n).toFixed(1)}`;
          char.style.fontWeight=String(Math.round(weight));
          char.style.opacity=String(.5+.5*n);
        });
      };
      const queueText=()=>{if(!textFrame)textFrame=requestAnimationFrame(renderText);};

      link.addEventListener('click',()=>switchProject(link.dataset.projectKey));
      link.addEventListener('pointerenter',event=>{
        if(mobileProjectLayout.matches)return;
        inside=true;px=event.clientX;py=event.clientY;queueText();
        const cardRect=endCard.getBoundingClientRect(),linkRect=link.getBoundingClientRect();
        endCard.style.setProperty('--end-arrow-y',`${linkRect.top-cardRect.top+linkRect.height/2}px`);
        endCard.classList.add('is-project-hovered');
        hovering=true;targetX=0;targetY=0;queueArrows();
      });
      link.addEventListener('pointermove',event=>{
        if(mobileProjectLayout.matches)return;
        px=event.clientX;py=event.clientY;queueText();
        const r=link.getBoundingClientRect();
        targetX=(event.clientX-r.left-r.width/2)*.055;
        targetY=(event.clientY-r.top-r.height/2)*.10;
        queueArrows();
      });
      link.addEventListener('pointerleave',()=>{
        inside=false;queueText();
        endCard.classList.remove('is-project-hovered');
        hovering=false;targetX=0;targetY=0;queueArrows();
      });
    });
    endCard.querySelector('.mf-project-exit-button')?.addEventListener('click',()=>closeProject(()=>{
      const work=document.getElementById('work');
      if(work){const y=work.getBoundingClientRect().top+window.scrollY;window._mfScroll?window._mfScroll(y):window.scrollTo({top:y,behavior:'smooth'});}
    }));
  }

  function updateCounter(){
    const total=slides.children.length||1;
    fields.counter.textContent=`${String(activeIndex+1).padStart(2,"0")} / ${String(total).padStart(2,"0")}`;
  }

  function updateActiveExtras(){
    const activeSlide=slides.children[activeIndex];
    currentCarousel=activeSlide?.querySelector('.mf-goballer-carousel')?._mfCarousel||null;
    if(controlsHint){
      controlsHint.innerHTML=currentCarousel?'↑ ↓ ← → [ESC]&nbsp;&nbsp;–&nbsp;&nbsp;And telekinesis':'↑ ↓ [ESC]&nbsp;&nbsp;–&nbsp;&nbsp;And your free will';
      controlsHint.classList.toggle('is-carousel',!!currentCarousel);
    }
  }

  function openProject(stripOrKey){
    const key=typeof stripOrKey==='string'?stripOrKey:(stripOrKey?.dataset.index||'01');
    Object.keys(liveStates).forEach(liveKey=>{liveStates[liveKey]=false;});
    renderProject(key);
    overlay.classList.remove("is-closing");
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden","false");
    document.body.classList.add("project-open");
    overlay.scrollTop=0;
    requestAnimationFrame(()=>requestAnimationFrame(()=>overlay.classList.add("is-visible")));
    setTimeout(()=>gallery.focus({preventScroll:true}),520);
  }

  function switchProject(nextKey){
    if(projectSwitching||nextKey===currentProjectKey||!projectData[nextKey])return;
    projectSwitching=true;
    shell.classList.add('is-switching-out');
    setTimeout(()=>{
      Object.keys(liveStates).forEach(liveKey=>{liveStates[liveKey]=false;});
      renderProject(nextKey);
      shell.classList.remove('is-switching-out');
      shell.classList.add('is-switching-in');
      void shell.offsetWidth;
      requestAnimationFrame(()=>requestAnimationFrame(()=>shell.classList.remove('is-switching-in')));
      setTimeout(()=>{projectSwitching=false;},760);
    },520);
  }

  function closeProject(afterClose){
    if(!overlay.classList.contains("active"))return;
    overlay.classList.add("is-closing");
    overlay.classList.remove("is-visible");
    setTimeout(()=>{
      overlay.classList.remove("active","is-closing");
      overlay.setAttribute("aria-hidden","true");
      document.body.classList.remove("project-open");
      slides.innerHTML="";
      currentCarousel=null;
      if(typeof afterClose==='function')afterClose();
    },620);
  }

  function easeInOutCubic(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
  function scrollToSlide(next){
    const total=slides.children.length;
    next=Math.max(0,Math.min(total-1,next));
    if(next===activeIndex||wheelLocked)return;
    if(mobileProjectLayout.matches){
      const targetSlide=slides.children[next];
      if(!targetSlide)return;
      activeIndex=next;updateCounter();updateActiveExtras();
      targetSlide.scrollIntoView({behavior:"smooth",block:"start"});
      return;
    }
    wheelLocked=true;
    const start=gallery.scrollTop,target=next*gallery.clientHeight,delta=target-start,duration=760,began=performance.now();
    function frame(now){
      const t=Math.min(1,(now-began)/duration);
      gallery.scrollTop=start+delta*easeInOutCubic(t);
      if(t<1)requestAnimationFrame(frame);
      else{activeIndex=next;updateCounter();updateActiveExtras();wheelLocked=false;}
    }
    requestAnimationFrame(frame);
  }

  document.querySelectorAll(".mf-strip").forEach(strip=>strip.addEventListener("click",()=>openProject(strip)));
  closeButton.addEventListener("click",()=>closeProject());
  document.addEventListener("keydown",event=>{
    if(!overlay.classList.contains("active"))return;
    if(event.key==="Escape"){closeProject();return;}
    if(currentCarousel&&(event.key==="ArrowLeft"||event.key==="ArrowRight")){
      event.preventDefault();currentCarousel.move(event.key==="ArrowRight"?1:-1);return;
    }
    if(event.key==="ArrowDown"||event.key==="PageDown"){event.preventDefault();scrollToSlide(activeIndex+1);}
    if(event.key==="ArrowUp"||event.key==="PageUp"){event.preventDefault();scrollToSlide(activeIndex-1);}
  });

  gallery.addEventListener("wheel",event=>{
    if(mobileProjectLayout.matches)return;
    if(event.target.closest?.(".mf-project-slide-instagram.is-browsing .mf-instagram-embed-host"))return;
    if(event.target.closest?.(".mf-project-slide-live.is-browsing iframe"))return;
    event.preventDefault();
    if(wheelLocked)return;
    wheelTotal+=event.deltaY;
    clearTimeout(wheelReset);wheelReset=setTimeout(()=>wheelTotal=0,140);
    if(Math.abs(wheelTotal)<34)return;
    const direction=wheelTotal>0?1:-1;wheelTotal=0;scrollToSlide(activeIndex+direction);
  },{passive:false});

  let touchStartY=0,touchStartedInInteractive=false;
  gallery.addEventListener("touchstart",event=>{
    if(mobileProjectLayout.matches)return;
    touchStartY=event.touches[0].clientY;
    touchStartedInInteractive=!!event.target.closest?.(".mf-project-slide-live.is-browsing");
  },{passive:true});
  gallery.addEventListener("touchend",event=>{
    if(mobileProjectLayout.matches)return;
    if(touchStartedInInteractive){touchStartedInInteractive=false;return;}
    const delta=touchStartY-event.changedTouches[0].clientY;
    if(Math.abs(delta)>40)scrollToSlide(activeIndex+(delta>0?1:-1));
  },{passive:true});

  let mobileProjectScrollFrame=0;
  overlay.addEventListener("scroll",()=>{
    if(!mobileProjectLayout.matches||!overlay.classList.contains("active"))return;
    if(mobileProjectScrollFrame)return;
    mobileProjectScrollFrame=requestAnimationFrame(()=>{
      mobileProjectScrollFrame=0;
      const viewportMid=overlay.scrollTop+overlay.clientHeight*.55;
      const slideList=[...slides.children];
      let closest=0,distance=Infinity;
      slideList.forEach((slide,index)=>{const mid=slide.offsetTop+slide.offsetHeight/2,nextDistance=Math.abs(mid-viewportMid);if(nextDistance<distance){distance=nextDistance;closest=index;}});
      if(activeIndex!==closest){activeIndex=closest;updateCounter();updateActiveExtras();}
    });
  },{passive:true});

  window._mfOpenProject=openProject;
})();
function scaleHeroName(){const hero=document.getElementById("heroName"),wrap=document.getElementById("nameWrap"),info=document.querySelector(".mf-hero-info");if(!hero||!wrap)return;hero.style.fontSize="300px";wrap.style.transform="none";const width=wrap.scrollWidth,viewport=window.innerWidth,isMobile=viewport<=1024,leftPad=isMobile?8:-22,rightPad=isMobile?8:30,scale=(viewport-leftPad-rightPad)/width,offset=leftPad;wrap.style.transform=`translateX(${offset}px) scale(${scale})`;wrap.style.transformOrigin="left bottom";if(info&&window.innerWidth>1000){const fChar=hero.querySelector(".n-f");if(fChar){const fRect=fChar.getBoundingClientRect();info.style.left=(fRect.left+20)+"px";info.style.right="auto";info.style.width=Math.min(560,(window.innerWidth-fRect.left)*.55)+"px";info.style.top="22%";info.style.bottom="auto"}}else if(info){info.style.left="";info.style.right="";info.style.width="";info.style.bottom="";info.style.top=""}}
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(scaleHeroName);else setTimeout(scaleHeroName,200);scaleHeroName();window.addEventListener("resize",scaleHeroName);

(function(){const hero=document.getElementById("heroName");if(!hero)return;const wait=ms=>new Promise(r=>setTimeout(r,ms));const chars=()=>Array.from(hero.querySelectorAll(".nc")).filter(c=>!c.classList.contains("n-sp"));async function accentA(){const a=hero.querySelector(".n-a2");if(!a)return;a.textContent="Á";await wait(600);a.textContent="A"}async function accentU(){const u=hero.querySelector(".n-u");if(!u)return;u.textContent="Ů";await wait(600);u.textContent="U"}async function disappear(){const list=["n-a1","n-r","n-i","n-a2","n-n","n-u","n-s","n-e","n-k"].map(c=>hero.querySelector("."+c)).filter(Boolean);list.forEach(el=>el.style.opacity="0");await wait(2100);list.forEach(el=>el.style.opacity="");await wait(400)}async function rgb(){const all=chars(),picks=[...all].sort(()=>Math.random()-.5).slice(0,3);let frame=0,total=120;const timer=setInterval(()=>{frame++;const t=frame/total,amp=Math.sin(t*Math.PI)*4,j=(Math.random()-.5)*.8,x=(amp+j).toFixed(2),nx=(-(amp+j*.7)).toFixed(2);picks.forEach(el=>{el.style.textShadow=`${x}px 0 3px rgba(226,27,22,.8),${nx}px 0 3px rgba(0,167,255,.8)`});if(frame>=total)clearInterval(timer)},16);await wait(2050);picks.forEach(el=>el.style.textShadow="")}async function blurFx(){const all=chars();all.forEach(el=>{el.style.transition=`filter .5s cubic-bezier(.16,1,.3,1)`;el.style.filter="blur(3px)"});await wait(1300);all.forEach(el=>{el.style.transition=`filter .8s cubic-bezier(.16,1,.3,1)`;el.style.filter="blur(0)"});await wait(900);all.forEach(el=>{el.style.transition="";el.style.filter=""})}const effects=[accentA,accentU,disappear,rgb,blurFx];function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}let queue=[];async function run(){while(!document.body.classList.contains("mf-page-revealed"))await wait(100);await wait(2500);while(true){if(!queue.length)queue=shuffle(effects);await queue.shift()();await wait(2500)}}run();})();

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

/* BIO TABS — slower sequential fade, stable on desktop and mobile */
(function(){
  const menu=document.querySelector('.mf-bio-menu');
  const wrapper=document.getElementById('mfBioPanels');
  if(!menu||!wrapper)return;

  const buttons=[...menu.querySelectorAll('[data-bio-tab]')];
  const panels=[...wrapper.querySelectorAll('[data-bio-panel]')];
  let active=wrapper.querySelector('.mf-bio-panel.is-active')||panels[0];
  let switching=false;

  panels.forEach(panel=>{
    const selected=panel===active;
    panel.setAttribute('aria-hidden',selected?'false':'true');
    panel.inert=!selected;
  });

  function setMenu(key){
    buttons.forEach(button=>{
      const selected=button.dataset.bioTab===key;
      button.classList.toggle('is-active',selected);
      button.setAttribute('aria-selected',selected?'true':'false');
    });
  }

  const nextFrame=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));

  async function showPanel(key){
    const next=wrapper.querySelector(`[data-bio-panel="${key}"]`);
    if(!next||next===active||switching)return;
    switching=true;
    setMenu(key);

    const outgoing=active;
    const outAnimation=outgoing.animate(
      [{opacity:1},{opacity:0}],
      {duration:330,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'}
    );
    await outAnimation.finished.catch(()=>{});
    outAnimation.cancel();

    outgoing.classList.remove('is-active');
    outgoing.setAttribute('aria-hidden','true');
    outgoing.inert=true;

    next.style.opacity='0';
    next.classList.add('is-active');
    next.setAttribute('aria-hidden','false');
    next.inert=false;
    await nextFrame();

    const inAnimation=next.animate(
      [{opacity:0},{opacity:1}],
      {duration:620,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'}
    );
    await inAnimation.finished.catch(()=>{});
    inAnimation.cancel();
    next.style.opacity='';

    active=next;
    switching=false;
  }

  buttons.forEach(button=>button.addEventListener('click',()=>showPanel(button.dataset.bioTab)));
})();

/* VARIABLE PROXIMITY — word-safe, link-safe BIO copy */
(function(){
  const container=document.querySelector('.mf-about-text');
  if(!container)return;
  const radius=120;

  function wrapTextNode(node){
    const text=node.nodeValue;
    if(!text||!text.trim())return;
    const fragment=document.createDocumentFragment();
    const tokens=text.split(/(\s+)/);
    tokens.forEach(token=>{
      if(!token)return;
      if(/^\s+$/.test(token)){fragment.appendChild(document.createTextNode(token));return;}
      const word=document.createElement('span');
      word.className='vp-word';
      [...token].forEach(ch=>{
        const span=document.createElement('span');
        span.className='vp-char';
        span.setAttribute('aria-hidden','true');
        span.textContent=ch;
        word.appendChild(span);
      });
      fragment.appendChild(word);
    });
    node.replaceWith(fragment);
  }

  container.querySelectorAll('.mf-bio-panel p, .mf-bio-panel .mf-about-note').forEach(el=>{
    el.setAttribute('aria-label',el.textContent.trim());
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode(node){
      return node.parentElement?.closest('.vp-word')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT;
    }});
    const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(wrapTextNode);
  });

  let mouse={x:-9999,y:-9999},raf=0;
  function update(){
    raf=0;
    container.querySelectorAll('.mf-bio-panel.is-active .vp-char').forEach(char=>{
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
  container.addEventListener('pointermove',event=>{mouse={x:event.clientX,y:event.clientY};if(!raf)raf=requestAnimationFrame(update);});
  container.addEventListener('pointerleave',()=>{mouse={x:-9999,y:-9999};if(!raf)raf=requestAnimationFrame(update);});
})();

/* Mobile practice titles are rendered as one literal line so normal word
   spacing is preserved instead of stretching two independent flex items. */
(function(){
  document.querySelectorAll('.mf-roll').forEach(row=>{
    if(row.querySelector('.mf-roll-mobile-label'))return;
    const left=row.querySelector('.mf-roll-left')?.textContent.trim()||'';
    const right=row.querySelector('.mf-roll-right')?.textContent.trim()||'';
    const label=document.createElement('span');
    label.className='mf-roll-mobile-label';
    label.textContent=`${left} ${right}`.trim();
    row.appendChild(label);
  });
})();

/* PRACTICE ROLL */
function positionRollCopies(){
  if(window.matchMedia("(max-width: 1024px), (pointer: coarse)").matches)return;
  document.querySelectorAll(".mf-roll").forEach(row=>{const left=row.querySelector(".mf-roll-left"),right=row.querySelector(".mf-roll-right");if(!left||!right)return;const rowRect=row.getBoundingClientRect(),leftRect=left.getBoundingClientRect(),rightRect=right.getBoundingClientRect();const center=((leftRect.right+rightRect.left)/2)-rowRect.left;row.style.setProperty("--copy-x",center+"px");});
}
positionRollCopies();
window.addEventListener("resize",positionRollCopies);
document.querySelectorAll(".mf-roll").forEach(row=>{["mouseenter","mouseleave"].forEach(event=>{row.addEventListener(event,()=>{requestAnimationFrame(positionRollCopies);[100,200,300,400,500,600,700].forEach(ms=>setTimeout(positionRollCopies,ms));});});});

/* Mobile / small-tablet expertise rows open by tap. The selected explanation
   appears above its own large type and naturally pushes the rows below down. */
(function(){
  const mobileRolls=window.matchMedia("(max-width: 1024px)");
  const rows=[...document.querySelectorAll(".mf-roll")];
  if(!rows.length)return;
  rows.forEach(row=>{
    row.setAttribute("tabindex","0");
    row.setAttribute("role","button");
    row.setAttribute("aria-expanded","false");
    const toggle=()=>{
      if(!mobileRolls.matches)return;
      const opening=!row.classList.contains("is-mobile-open");
      rows.forEach(other=>{
        other.classList.remove("is-mobile-open");
        other.setAttribute("aria-expanded","false");
      });
      if(opening){
        row.classList.add("is-mobile-open");
        row.setAttribute("aria-expanded","true");
      }
    };
    row.addEventListener("click",toggle);
    row.addEventListener("keydown",event=>{
      if(event.key==="Enter"||event.key===" "){
        event.preventDefault();
        toggle();
      }
    });
  });
  mobileRolls.addEventListener?.("change",event=>{
    if(event.matches)return;
    rows.forEach(row=>{
      row.classList.remove("is-mobile-open");
      row.setAttribute("aria-expanded","false");
    });
  });
})();

/* Mobile big-type fitting: one stable shared size measured from the literal
   longest title. It only recalculates when viewport width changes, so Safari's
   address-bar height animation cannot resize or clip the rows mid-scroll. */
(function(){
  const mobile=window.matchMedia("(max-width: 1024px)");
  const rows=[...document.querySelectorAll(".mf-roll")];
  if(!rows.length)return;
  let resizeTimer=0,lastWidth=0;
  const measurer=document.createElement('span');
  measurer.setAttribute('aria-hidden','true');
  measurer.style.cssText='position:fixed;left:-99999px;top:0;display:block;width:max-content;white-space:nowrap;visibility:hidden;pointer-events:none;font-family:Geist,Arial,sans-serif;font-weight:850;line-height:.74;letter-spacing:-.08em;text-transform:uppercase;';
  document.body.appendChild(measurer);
  function fit(force=false){
    if(!mobile.matches){rows.forEach(row=>row.style.removeProperty("--mobile-roll-size"));return;}
    const width=Math.round(document.documentElement.clientWidth||window.innerWidth);
    if(!force&&Math.abs(width-lastWidth)<3)return;
    lastWidth=width;
    const available=Math.max(240,width-28);
    const labels=rows.map(row=>row.querySelector('.mf-roll-mobile-label')).filter(Boolean);
    let widest=1;
    measurer.style.fontSize='100px';
    labels.forEach(label=>{
      measurer.textContent=label.textContent;
      widest=Math.max(widest,measurer.getBoundingClientRect().width);
    });
    const shared=Math.max(27,Math.min(96,100*available/widest));
    rows.forEach(row=>row.style.setProperty('--mobile-roll-size',`${shared.toFixed(2)}px`));
  }
  const queue=()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>fit(false),100);};
  if(document.fonts?.ready)document.fonts.ready.then(()=>fit(true));else setTimeout(()=>fit(true),220);
  window.addEventListener('resize',queue,{passive:true});
  mobile.addEventListener?.('change',()=>fit(true));
})();

/* XP SHAPE — fast particles, two-second hover morphs, lively breathing */
(function(){
  const container=document.getElementById("xpShape");
  if(!container||typeof p5==="undefined")return;
  const COUNT=window.matchMedia("(max-width: 1024px)").matches?360:760;
  const SHAPE_MAP={independent:"triangle",coach:"heart",strv:"fourStar",symbio:"sinusoid",fg:"spiral"};
  let currentShape="circle",targetShape="circle",morphFrom="circle";
  let morphStarted=0,morphDuration=2000,isMorphing=false,isHovering=false;

  const sketch=p=>{
    let particles=[],R=0;
    let lastCanvasWidth=0;
    p.setup=()=>{
      p.pixelDensity(window.matchMedia('(max-width: 1024px)').matches?1:Math.min(window.devicePixelRatio||1,2));
      lastCanvasWidth=container.offsetWidth;
      const cnv=p.createCanvas(container.offsetWidth,container.offsetHeight);
      cnv.parent(container);
      p.colorMode(p.HSB,360,100,100,1);
      R=Math.min(p.width,p.height)*.351;
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
      const nextWidth=container.offsetWidth;
      if(Math.abs(nextWidth-lastCanvasWidth)<4)return;
      lastCanvasWidth=nextWidth;
      p.resizeCanvas(nextWidth,container.offsetHeight);
      R=Math.min(p.width,p.height)*.351;
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

  const xpCanvas=new p5(sketch,container);
  const xpSection=document.getElementById("xp");
  let xpVisible=true;
  const syncXpLoop=()=>{
    if(xpVisible&&!document.hidden)xpCanvas.loop();
    else xpCanvas.noLoop();
  };
  if(xpSection){
    const xpObserver=new IntersectionObserver(entries=>{
      xpVisible=!!entries[0]?.isIntersecting;
      syncXpLoop();
    },{rootMargin:"20% 0px",threshold:0});
    xpObserver.observe(xpSection);
  }
  document.addEventListener("visibilitychange",syncXpLoop);
  const track=document.getElementById("timelineItems");
  if(track)track.querySelectorAll(".mf-xp-card").forEach(card=>{
    const shape=SHAPE_MAP[card.dataset.xpEffect]||"circle";
    card.addEventListener("mouseenter",()=>window._xpMorph&&window._xpMorph(shape,true));
    card.addEventListener("mouseleave",()=>window._xpMorph&&window._xpMorph("circle",false));
  });

  function shapePos(p,shape,angle,r){
    switch(shape){
      case"circle":return p.createVector(p.cos(angle)*r*.8,p.sin(angle)*r*.8);
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
          const rr=k%2===0?r:r*.32;
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
  const miniWorld=document.getElementById("mfArtMiniWorld");
  const close=document.getElementById("mfArtClose");
  const intro=document.getElementById("mfArtIntro");
  const particleHost=document.getElementById("mfArtParticles");
  const artLoader=document.getElementById("mfArtRuntimeLoader");
  const houseButton=document.getElementById("mfHouseButton");
  const donation=document.getElementById("mfDonationOverlay");
  const donationClose=document.getElementById("mfDonationClose");
  const donationParticles=document.getElementById("mfDonationParticles");
  if(!button||!overlay||!world||!close)return;

  const files=[
    "01-konnichiwawa.png","02-perefction.png","03-flawr.png","04-mattress.png","05-egg.png",
    "06-huh.png","07-hotdog.png","08-jail.png","09-box.png","10-ufo.png","11-claude.png",
    "12-hay.png","13-spaghet.png","14-doctor.png","15-cher.png","16-pantalones.png","17-tuli.png",
    "18-wave.png","19-bean.png","20-accept.png","21-violins.png","22-holy.png","23-tiktok.png",
    "24-ai.png","25-blushies.png","26-arse.png","27-glow.png","28-smash.png","29-stairs.png","30-orange.png"
  ];
  const strength=0;
  const moveButton=(x,y,duration=.4,ease="power2.out")=>{
    if(window.gsap)gsap.to(button,{x,y,duration,ease,overwrite:true});
    else button.style.transform=`translate(${x}px,${y}px)`;
  };
  if(zone){
    zone.addEventListener("mousemove",e=>{
      const rect=zone.getBoundingClientRect();
      const x=((e.clientX-rect.left)/rect.width-.5)*rect.width;
      const y=((e.clientY-rect.top)/rect.height-.5)*rect.height;
      moveButton(x*strength,y*strength);
    });
    zone.addEventListener("mouseleave",()=>moveButton(0,0,.7,"elastic.out(1, 0.4)"));
  }

  let pieces=[];
  let miniPieces=[];
  let artReady=false;
  let artPreviewReady=false;
  let artInitPromise=null;
  let offsetX=0,offsetY=0;
  let dragging=false,lastX=0,lastY=0,dragDistance=0,downFigure=null;
  let velocityX=0,velocityY=0,lastMoveTime=0,inertiaFrame=0;
  let expanded=null;
  const preview=document.getElementById("mfArtPreview");
  const previewImage=document.getElementById("mfArtPreviewImage");
  const previewClose=document.getElementById("mfArtPreviewClose");
  const seeded=i=>{const x=Math.sin(i*12.9898)*43758.5453;return x-Math.floor(x);};

  function build(){
    if(pieces.length)return;
    world.innerHTML="";
    if(miniWorld)miniWorld.innerHTML="";
    const vw=window.innerWidth,vh=window.innerHeight;
    const mobileArt=vw<=1024;
    const fieldW=vw*(mobileArt?2.9:2.45),fieldH=vh*(mobileArt?2.7:2.25);
    const cols=6,rows=5,cellW=fieldW/cols,cellH=fieldH/rows;
    pieces=files.map((name,i)=>{
      const figure=document.createElement("figure");
      figure.className="mf-art-piece";
      figure.style.setProperty("--float-delay",`${-(seeded(i+11)*7).toFixed(2)}s`);
      figure.style.setProperty("--float-duration",`${(6.5+seeded(i+19)*7.5).toFixed(2)}s`);
      figure.style.setProperty("--float-x",`${(-12+seeded(i+27)*24).toFixed(1)}px`);
      figure.style.setProperty("--float-y",`${(-14+seeded(i+35)*28).toFixed(1)}px`);
      figure.style.setProperty("--tilt",`${(-1+seeded(i+43)*2).toFixed(2)}deg`);
      figure.style.setProperty("--tilt-x",`${(-1+seeded(i+47)*2).toFixed(2)}deg`);
      figure.style.setProperty("--tilt-y",`${(-1+seeded(i+53)*2).toFixed(2)}deg`);
      const size=mobileArt
        ? Math.round(88+seeded(i+2)*128)
        : Math.round(160+seeded(i+2)*252);
      const ratio=.72+seeded(i+31)*.62;
      const depth=.55+seeded(i+68)*.95;
      figure.style.width=size+"px";
      figure.style.height=Math.round(size*ratio)+"px";
      figure.style.zIndex=String(1+Math.floor(depth*10));
      figure.style.setProperty("--depth",depth.toFixed(3));
      const depthNorm=Math.max(0,Math.min(1,(depth-.55)/.95));
      figure.style.setProperty("--depth-brightness",(0.8+depthNorm*.2).toFixed(3));
      figure.style.setProperty("--depth-blur",((1-depthNorm)*1.45).toFixed(2)+"px");
      const artSrc=`/media/art/${name}`;
      const img=document.createElement("img");
      img.alt="";
      img.draggable=false;
      img.dataset.src=artSrc;
      img.dataset.fallback=`./media/art/${name}`;
      img.onerror=()=>{ if(img.dataset.fallback&&img.src!==img.dataset.fallback){ img.src=img.dataset.fallback; return; } img.onerror=null; };
      figure.appendChild(img);
      world.appendChild(figure);

      let miniEl=null,miniImg=null;
      if(miniWorld){
        miniEl=document.createElement("figure");
        miniEl.className="mf-art-piece mf-art-piece--mini";
        miniEl.style.zIndex=figure.style.zIndex;
        miniEl.style.setProperty("--depth-brightness",figure.style.getPropertyValue("--depth-brightness"));
        miniEl.style.setProperty("--depth-blur",figure.style.getPropertyValue("--depth-blur"));
        miniImg=document.createElement("img");
        miniImg.alt="";
        miniImg.draggable=false;
        miniImg.dataset.src=artSrc;
        miniImg.dataset.fallback=`./media/art/${name}`;
        miniImg.onerror=()=>{ if(miniImg.dataset.fallback&&miniImg.src!==miniImg.dataset.fallback){miniImg.src=miniImg.dataset.fallback;return;} miniImg.onerror=null; };
        miniEl.appendChild(miniImg);
        miniWorld.appendChild(miniEl);
      }

      const x=((i%cols)+.5)*cellW-fieldW/2+(seeded(i+90)-.5)*cellW*.32;
      const y=(Math.floor(i/cols)+.5)*cellH-fieldH/2+(seeded(i+150)-.5)*cellH*.28;
      return {
        el:figure,img,miniEl,miniImg,
        x,y,nx:x/fieldW,ny:y/fieldH,
        w:size,h:Math.round(size*ratio),depth,
        driftX:(seeded(i+210)-.5)*10,
        driftY:(seeded(i+260)-.5)*8,
        phase:seeded(i+310)*Math.PI*2
      };
    });
    pieces.forEach(piece=>{
      piece.el.addEventListener("click",e=>{
        e.preventDefault();
        e.stopPropagation();
      });
    });
    render(performance.now());
  }
  function wrap(value,span){return ((value+span/2)%span+span)%span-span/2;}
  function render(now=performance.now()){
    if(expanded)return;
    const vw=window.innerWidth,vh=window.innerHeight;
    const mobileArt=vw<=1024;
    const spanX=vw*(mobileArt?2.9:2.45),spanY=vh*(mobileArt?2.7:2.25);
    const t=now*.00012;
    const wholeX=Math.sin(t)*22;
    const wholeY=Math.cos(t*.82)*16;
    const miniRect=miniWorld?.getBoundingClientRect();
    const mw=miniRect?.width||0,mh=miniRect?.height||0;
    const miniSpanX=mw*(mobileArt?2.9:2.45),miniSpanY=mh*(mobileArt?2.7:2.25);
    const scale=mw&&mh?Math.min(mw/vw,mh/vh):0;
    pieces.forEach(piece=>{
      const localX=Math.sin(t*(.7+piece.depth*.45)+piece.phase)*piece.driftX;
      const localY=Math.cos(t*(.65+piece.depth*.38)+piece.phase)*piece.driftY;
      const x=wrap(piece.nx*spanX+(offsetX+wholeX)*piece.depth+localX,spanX)+vw/2-piece.w/2;
      const y=wrap(piece.ny*spanY+(offsetY+wholeY)*piece.depth+localY,spanY)+vh/2-piece.h/2;
      piece.el.style.setProperty("--base-transform",`translate3d(${x}px,${y}px,0)`);

      if(piece.miniEl&&mw&&mh){
        const miniW=Math.max(42,piece.w*scale);
        const miniH=Math.max(32,piece.h*scale);
        const miniOffsetX=(offsetX+wholeX)*scale;
        const miniOffsetY=(offsetY+wholeY)*scale;
        const mx=wrap(piece.nx*miniSpanX+miniOffsetX*piece.depth+localX*scale,miniSpanX)+mw/2-miniW/2;
        const my=wrap(piece.ny*miniSpanY+miniOffsetY*piece.depth+localY*scale,miniSpanY)+mh/2-miniH/2;
        piece.miniEl.style.width=`${miniW}px`;
        piece.miniEl.style.height=`${miniH}px`;
        piece.miniEl.style.setProperty("--base-transform",`translate3d(${mx}px,${my}px,0)`);
      }
    });
  }
  let artMotionFrame=0;
  let miniVisible=!miniWorld;
  if(miniWorld){
    const miniObserver=new IntersectionObserver(entries=>{
      miniVisible=!!entries[0]?.isIntersecting;
    },{rootMargin:"15% 0px",threshold:0});
    miniObserver.observe(miniWorld);
  }
  function animateArt(now){
    if(!document.hidden&&!expanded&&(miniVisible||overlay.classList.contains("active")))render(now);
    artMotionFrame=requestAnimationFrame(animateArt);
  }
  function ensureArtBuilt(){
    if(artInitPromise)return artInitPromise;
    artInitPromise=Promise.resolve().then(()=>{
      build();
      render(performance.now());
    });
    return artInitPromise;
  }
  function loadImg(el){
    return new Promise(resolve=>{
      if(!el)return resolve();
      if(el.getAttribute('src')){
        if(el.complete&&el.naturalWidth>0)return resolve();
      } else if(el.dataset.src){
        el.src=el.dataset.src;
      }
      const done=()=>resolve();
      if(el.complete&&el.naturalWidth>0)return resolve();
      el.addEventListener('load',done,{once:true});
      el.addEventListener('error',done,{once:true});
    });
  }
  function ensureArtPreview(){
    return ensureArtBuilt().then(async()=>{
      if(artPreviewReady)return;
      const mobilePreview=window.matchMedia('(max-width: 1024px), (pointer: coarse)').matches;
      const previewPieces=mobilePreview?pieces.slice(0,12):pieces;
      if(mobilePreview)pieces.slice(12).forEach(piece=>piece.miniEl?.remove());
      await Promise.allSettled(previewPieces.map(piece=>loadImg(piece.miniImg)));
      artPreviewReady=true;
      render(performance.now());
    });
  }
  function setArtLoaderProgress(value,copy){
    if(!artLoader)return;
    const progress=artLoader.querySelector('.mf-loader-progress');
    const bar=artLoader.querySelector('.mf-loader-bar-fill');
    const ascii=artLoader.querySelector('.mf-loader-ascii');
    const txt=`${String(Math.round(value)).padStart(2,'0')}%`;
    if(progress){ progress.textContent=txt; progress.dataset.glitch=txt; progress.classList.toggle('is-glitch', value<100); }
    if(bar) bar.style.width=`${value}%`;
    if(copy&&ascii) ascii.textContent=copy;
  }
  async function ensureArtWorldLoaded(){
    await ensureArtBuilt();
    if(artReady)return;
    let loaderVisible=false;
    const loaderTimer=setTimeout(()=>{ if(artLoader){ artLoader.classList.add('is-visible'); artLoader.setAttribute('aria-hidden','false'); setArtLoaderProgress(6,'// loading MF art'); loaderVisible=true; } },1000);
    await ensureArtPreview();
    let done=0;
    const total=Math.max(1,pieces.length);
    await Promise.allSettled(pieces.map(async piece=>{ await loadImg(piece.img); done++; if(loaderVisible) setArtLoaderProgress(6 + (done/total)*94); }));
    clearTimeout(loaderTimer);
    artReady=true;
    if(loaderVisible){
      setArtLoaderProgress(100,'// art unlocked');
      setTimeout(()=>{ if(artLoader){ artLoader.classList.remove('is-visible'); artLoader.setAttribute('aria-hidden','true'); } },260);
    }
  }
  const artPreviewTrigger=zone||button||miniWorld;
  if(artPreviewTrigger&&'IntersectionObserver' in window){
    const obs=new IntersectionObserver(entries=>{
      if(entries[0]?.isIntersecting){ ensureArtPreview(); obs.disconnect(); }
    },{rootMargin:'260px 0px',threshold:0});
    obs.observe(artPreviewTrigger);
  }
  artMotionFrame=requestAnimationFrame(animateArt);
  function expandPiece(piece){
    if(expanded)return;
    expanded=piece;
    overlay.classList.add("is-image-open");
    pieces.forEach(p=>p.el.classList.toggle("is-expanded",p===piece));
  }
  function collapsePiece(){
    if(!expanded)return;
    expanded=null;
    overlay.classList.remove("is-image-open");
    pieces.forEach(p=>p.el.classList.remove("is-expanded"));
    render();
  }
  function openPreview(piece){
    if(!preview||!previewImage||!piece)return;
    previewImage.src=piece.img.currentSrc||piece.img.src;
    preview.classList.add("active");
    preview.setAttribute("aria-hidden","false");
  }
  function closePreview(){
    if(!preview)return;
    preview.classList.remove("active");
    preview.setAttribute("aria-hidden","true");
    setTimeout(()=>{if(previewImage)previewImage.removeAttribute("src");},560);
  }
  preview?.addEventListener("click",closePreview);
  previewClose?.addEventListener("click",e=>{e.stopPropagation();closePreview();});

  function createAmbientParticles(host){
    if(!host||host.childElementCount)return;
    for(let i=0;i<40;i++){
      const particle=document.createElement("span");
      const comet=i<4;
      particle.className=comet?"mf-art-particle is-comet":"mf-art-particle";
      particle.style.setProperty("--px",`${seeded(i+410)*100}%`);
      particle.style.setProperty("--py",`${seeded(i+460)*100}%`);
      particle.style.setProperty("--ps",`${2+Math.floor(seeded(i+510)*2)}px`);
      particle.style.setProperty("--pd",`${7+seeded(i+560)*13}s`);
      particle.style.setProperty("--pdelay",`${-seeded(i+610)*18}s`);
      particle.style.setProperty("--pdx",`${-50+seeded(i+660)*100}px`);
      particle.style.setProperty("--pdy",`${-40+seeded(i+710)*80}px`);
      particle.style.setProperty("--pa",`${.18+seeded(i+760)*.62}`);
      if(comet){
        const travelsRight=seeded(i+860)>.5;
        const startX=travelsRight?-18:118;
        const endX=travelsRight?118:-18;
        const startY=18+seeded(i+910)*68;
        const endY=Math.max(4,Math.min(96,startY+(-28+seeded(i+960)*56)));
        const dx=endX-startX;
        const dy=endY-startY;
        const angle=Math.atan2(dy,dx)*180/Math.PI;
        particle.style.setProperty("--comet-start-x",`${startX}vw`);
        particle.style.setProperty("--comet-start-y",`${startY}vh`);
        particle.style.setProperty("--comet-end-x",`${endX}vw`);
        particle.style.setProperty("--comet-end-y",`${endY}vh`);
        particle.style.setProperty("--comet-angle",`${angle}deg`);
        particle.style.setProperty("--comet-length",`${34+seeded(i+1010)*52}px`);
      }
      if(seeded(i+810)>.72)particle.classList.add("is-glow");
      host.appendChild(particle);
    }
  }
  async function openArt(){
    createAmbientParticles(particleHost);
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden","false");
    document.body.classList.add("art-open");
    requestAnimationFrame(()=>requestAnimationFrame(()=>overlay.classList.add("is-visible")));
    await ensureArtWorldLoaded();
  }
  function closeArt(){
    collapsePiece();
    overlay.classList.remove("is-visible");
    setTimeout(()=>{
      overlay.classList.remove("active","is-dragging");
      overlay.setAttribute("aria-hidden","true");
      document.body.classList.remove("art-open");
    },720);
  }
  button.addEventListener("click",openArt);
  close.addEventListener("click",e=>{e.stopPropagation();closeArt();});

  overlay.addEventListener("click",e=>{
    if(e.target.closest(".mf-art-close"))return;
    if(expanded){collapsePiece();return;}
  });
  overlay.addEventListener("pointerdown",e=>{
    if(expanded||e.target.closest(".mf-art-close, .mf-art-intro, .mf-art-cta"))return;
    downFigure=e.target.closest?.(".mf-art-piece")||null;
    cancelAnimationFrame(inertiaFrame);
    dragging=true;dragDistance=0;lastX=e.clientX;lastY=e.clientY;lastMoveTime=performance.now();velocityX=0;velocityY=0;
    overlay.classList.add("is-dragging");
    overlay.setPointerCapture?.(e.pointerId);
  });
  overlay.addEventListener("pointermove",e=>{
    if(!dragging)return;
    const now=performance.now();
    const dx=e.clientX-lastX,dy=e.clientY-lastY;
    const dt=Math.max(16,now-lastMoveTime);
    dragDistance+=Math.abs(dx)+Math.abs(dy);
    velocityX=dx/(dt/16);velocityY=dy/(dt/16);
    offsetX+=dx;offsetY+=dy;lastX=e.clientX;lastY=e.clientY;lastMoveTime=now;render();
  });
  const stopDrag=e=>{
    if(!dragging)return;
    const clickedFigure=downFigure;
    const wasClick=!!clickedFigure&&dragDistance<7;
    dragging=false;overlay.classList.remove("is-dragging");try{overlay.releasePointerCapture?.(e.pointerId)}catch(_){}
    downFigure=null;
    if(wasClick){
      const piece=pieces.find(p=>p.el===clickedFigure);
      if(piece){openPreview(piece);return;}
    }
    const drift=()=>{
      velocityX*=.93;velocityY*=.93;
      offsetX+=velocityX;offsetY+=velocityY;render();
      if(Math.abs(velocityX)+Math.abs(velocityY)>.08)inertiaFrame=requestAnimationFrame(drift);
    };
    inertiaFrame=requestAnimationFrame(drift);
  };
  overlay.addEventListener("pointerup",stopDrag);
  overlay.addEventListener("pointercancel",stopDrag);

  function addMagnetic(target,strength=.18){
    if(!target)return;
    target.addEventListener("pointermove",e=>{
      const r=target.getBoundingClientRect();
      const x=(e.clientX-r.left-r.width/2)*strength;
      const y=(e.clientY-r.top-r.height/2)*strength;
      if(window.gsap)gsap.to(target,{x,y,duration:.35,ease:"power2.out",overwrite:true});
    });
    target.addEventListener("pointerleave",()=>window.gsap&&gsap.to(target,{x:0,y:0,duration:.65,ease:"elastic.out(1,.4)",overwrite:true}));
  }
  document.querySelectorAll(".mf-art-cta").forEach(btn=>addMagnetic(btn));
  function openDonation(){
    if(!donation)return;
    createAmbientParticles(donationParticles);
    donation.classList.add("active");
    donation.setAttribute("aria-hidden","false");
    requestAnimationFrame(()=>requestAnimationFrame(()=>donation.classList.add("is-visible")));
  }
  function closeDonation(){
    if(!donation)return;
    donation.classList.remove("is-visible");
    setTimeout(()=>{donation.classList.remove("active");donation.setAttribute("aria-hidden","true");},600);
  }
  houseButton?.addEventListener("click",openDonation);
  donationClose?.addEventListener("click",closeDonation);
  donation?.addEventListener("click",e=>{if(e.target===donation)closeDonation();});

  window.addEventListener("resize",render);
  document.addEventListener("keydown",e=>{
    if(e.key!=="Escape")return;
    if(preview?.classList.contains("active")){closePreview();return;}
    if(donation?.classList.contains("active")){closeDonation();return;}
    if(!overlay.classList.contains("active"))return;
    if(expanded)collapsePiece();else closeArt();
  });
})();


/* BIO PHOTO — smooth, demand-driven mouse parallax + periodic ASCII glitches */
(function(){
  const section=document.getElementById("about");
  const photo=document.querySelector(".mf-photo-card");
  if(!section||!photo)return;

  let targetX=0,targetY=0,currentX=0,currentY=0,raf=0;
  const animate=()=>{
    raf=0;
    currentX+=(targetX-currentX)*.22;
    currentY+=(targetY-currentY)*.22;
    photo.style.transform=`translate3d(${currentX.toFixed(2)}px,${currentY.toFixed(2)}px,0)`;
    if(Math.abs(targetX-currentX)>.02||Math.abs(targetY-currentY)>.02){
      raf=requestAnimationFrame(animate);
    }
  };
  const queue=()=>{if(!raf)raf=requestAnimationFrame(animate);};

  section.addEventListener("pointermove",event=>{
    const rect=section.getBoundingClientRect();
    targetX=((event.clientX-rect.left)/rect.width-.5)*12;
    targetY=((event.clientY-rect.top)/rect.height-.5)*10;
    queue();
  },{passive:true});
  section.addEventListener("pointerleave",()=>{targetX=0;targetY=0;queue();},{passive:true});

  const chars=["+ +","001101","// MF","[ERR]","<>_","0xFF","::: ","* * *"];
  setInterval(()=>{
    const host=photo.parentElement;
    if(!host)return;
    const glitch=document.createElement("span");
    glitch.className="mf-photo-glitch";
    glitch.textContent=chars[Math.floor(Math.random()*chars.length)];
    glitch.style.left=(photo.offsetLeft+6+Math.random()*Math.max(10,photo.offsetWidth-46))+"px";
    glitch.style.top=(photo.offsetTop+8+Math.random()*Math.max(10,photo.offsetHeight-28))+"px";
    host.appendChild(glitch);
    requestAnimationFrame(()=>glitch.classList.add("show"));
    setTimeout(()=>glitch.remove(),850);
  },5000);
})();

/* HERO NAME — cursor-triggered ASCII fragmentation */
(function(){
  const hero=document.getElementById("heroName");
  if(!hero)return;
  const glyphs="01<>[]{}#%+*=:/\\_~";
  let lastEmit=0;
  const clearTouch=el=>{clearTimeout(el._asciiTimer);el._asciiTimer=setTimeout(()=>el.classList.remove("is-ascii-touched"),110);};
  hero.addEventListener("pointermove",e=>{
    const letter=e.target.closest?.(".nc:not(.n-sp)");
    if(!letter)return;
    letter.classList.add("is-ascii-touched");
    clearTouch(letter);
    const now=performance.now();
    if(now-lastEmit<38)return;
    lastEmit=now;
    const count=2+Math.floor(Math.random()*3);
    for(let i=0;i<count;i++){
      const fragment=document.createElement("span");
      fragment.className="mf-hero-ascii-fragment";
      fragment.textContent=glyphs[Math.floor(Math.random()*glyphs.length)];
      fragment.style.left=(e.clientX+(Math.random()-.5)*18)+"px";
      fragment.style.top=(e.clientY+(Math.random()-.5)*20)+"px";
      fragment.style.setProperty("--ascii-x",((Math.random()-.5)*70).toFixed(1)+"px");
      fragment.style.setProperty("--ascii-y",((Math.random()-.5)*62).toFixed(1)+"px");
      fragment.style.setProperty("--ascii-r",((Math.random()-.5)*24).toFixed(1)+"deg");
      document.body.appendChild(fragment);
      setTimeout(()=>fragment.remove(),560);
    }
  });
})();

/* FOOTER NAME — original variable expansion, RAF-throttled to remove lag */
(function(){
  const name=document.getElementById("footerName");
  if(!name)return;
  const label="MARIAN FUSEK";
  name.textContent="";
  const chars=[...label].map(ch=>{
    const el=document.createElement("span");
    el.className="footer-vp-char";
    el.textContent=ch===" "?"\u00A0":ch;
    name.appendChild(el);
    return el;
  });
  const radius=130;
  let x=-9999,y=-9999,raf=0,inside=false;
  function render(){
    raf=0;
    chars.forEach(ch=>{
      const r=ch.getBoundingClientRect();
      const n=inside?Math.max(0,1-Math.hypot(x-r.left-r.width/2,y-r.top-r.height/2)/radius):0;
      const weight=400+450*n;
      ch.style.fontVariationSettings=`'wght' ${weight.toFixed(0)}, 'opsz' ${(12+27*n).toFixed(1)}`;
      ch.style.fontWeight=String(Math.round(weight));
    });
  }
  function queue(){if(!raf)raf=requestAnimationFrame(render);}
  name.addEventListener("pointerenter",e=>{inside=true;x=e.clientX;y=e.clientY;queue();});
  name.addEventListener("pointermove",e=>{x=e.clientX;y=e.clientY;queue();});
  name.addEventListener("pointerleave",()=>{inside=false;queue();});
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

/* V24 — click-and-hold a hero grid cell to illuminate all four edges. */
(function(){
  const grid=document.getElementById("mfGrid");
  const hero=document.getElementById("heroSection");
  if(!grid||!hero)return;
  let active=[];
  const clear=()=>{
    active.forEach(line=>line.classList.remove("is-on"));
    const old=active;active=[];
    setTimeout(()=>old.forEach(line=>line.remove()),760);
  };
  const make=(cls,styles)=>{
    const line=document.createElement("span");
    line.className=`mf-grid-cell-line ${cls}`;
    Object.assign(line.style,styles);
    grid.appendChild(line);
    requestAnimationFrame(()=>line.classList.add("is-on"));
    active.push(line);
  };
  hero.addEventListener("pointerdown",e=>{
    if(e.button!==0)return;
    clear();
    const cols=window.matchMedia("(max-width: 1024px)").matches?3:10;
    const col=Math.max(0,Math.min(cols-1,Math.floor(e.clientX/(innerWidth/cols))));
    const row=Math.max(0,Math.min(2,Math.floor(e.clientY/(innerHeight/3))));
    const left=col*innerWidth/cols,right=(col+1)*innerWidth/cols;
    const top=row*innerHeight/3,bottom=(row+1)*innerHeight/3;
    make("is-v",{left:`${left}px`,top:`${top}px`,height:`${bottom-top}px`});
    make("is-v",{left:`${right}px`,top:`${top}px`,height:`${bottom-top}px`});
    make("is-h",{left:`${left}px`,top:`${top}px`,width:`${right-left}px`});
    make("is-h",{left:`${left}px`,top:`${bottom}px`,width:`${right-left}px`});
  });
  window.addEventListener("pointerup",clear);
  window.addEventListener("pointercancel",clear);
})();

/* ART preview uses the exact same renderer and state as the full gallery.
   It remains non-interactive; clicking the frame opens the full overlay. */

/* V24 — keep BIO glitches inside the portrait and add a small RGB split every 3s. */
(function(){
  const wrap=document.querySelector(".mf-photo-wrap");
  const photo=wrap?.querySelector(".mf-photo-card");
  if(!wrap||!photo)return;
  const chars=["+ +","001101","// MF","[ERR]","<>_","0xFF","::: ","* * *"];
  setInterval(()=>{
    wrap.classList.add("is-rgb-glitch");
    setTimeout(()=>wrap.classList.remove("is-rgb-glitch"),180);
    const glitch=document.createElement("span");
    glitch.className="mf-photo-glitch";
    glitch.textContent=chars[Math.floor(Math.random()*chars.length)];
    const photoRect={left:photo.offsetLeft,top:photo.offsetTop,width:photo.offsetWidth,height:photo.offsetHeight};
    glitch.style.left=(photoRect.left+6+Math.random()*Math.max(10,photoRect.width-46))+"px";
    glitch.style.top=(photoRect.top+8+Math.random()*Math.max(10,photoRect.height-28))+"px";
    wrap.appendChild(glitch);
    requestAnimationFrame(()=>glitch.classList.add("show"));
    setTimeout(()=>glitch.remove(),850);
  },3000);
})();


/* MF ART section title — the base title stays fixed while suffixes animate. */
(function(){
  const title=document.querySelector('.mf-art-showcase-copy h2');
  if(!title)return;
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  title.innerHTML='<span class="mf-art-title-base">MF ART</span><span class="mf-art-title-suffix">!</span>';
  const suffix=title.querySelector('.mf-art-title-suffix');
  const set=value=>{suffix.textContent=value;};
  const fadeTo=async(value)=>{
    suffix.style.opacity='0';
    suffix.style.transform='translateY(-3px)';
    await wait(180);
    set(value);
    suffix.style.transform='translateY(3px)';
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      suffix.style.opacity='1';
      suffix.style.transform='translateY(0)';
    }));
    await wait(260);
  };
  async function loop(){
    while(true){
      set('!');suffix.style.opacity='1';suffix.style.transform='translateY(0)';
      await wait(1500);
      for(let i=0;i<3;i++){suffix.style.opacity='0';await wait(105);suffix.style.opacity='1';await wait(105);}
      await fadeTo('?');
      await wait(1500);
      let text='?';
      for(const ch of ' HUH?!'){text+=ch;set(text);await wait(62);}
      await wait(1350);
      await fadeTo('');
      for(let count=1;count<=3;count++){set('.'.repeat(count));await wait(170);}
      await wait(500);
      for(let count=2;count>=0;count--){set('.'.repeat(count));await wait(120);}
      for(let count=1;count<=3;count++){set('.'.repeat(count));await wait(170);}
      await wait(2000);
      await fadeTo('!');
    }
  }
  loop();
})();
