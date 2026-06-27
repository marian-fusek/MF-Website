const originalTitle = document.title || "MF";

document.addEventListener("visibilitychange", () => {
  document.title = document.hidden
    ? "💭 MF — Still here"
    : originalTitle;
});

const loader = document.getElementById("mfLoader");

if (loader) {
  /* Force spans visible before CSS animation runs.
     Without a double-rAF the browser may skip the
     initial translateY(0) state and nothing shows. */
  const spans = loader.querySelectorAll("span");
  spans.forEach(s => { s.style.transform = "translateY(0)"; });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      spans.forEach(s => { s.style.transform = ""; });
    });
  });

  setTimeout(() => { loader.classList.add("done"); }, 1800);
}

/* -------------------------------------------------- */
/* SMOOTH SCROLL */
/* -------------------------------------------------- */

(function () {

  let targetY = window.scrollY;
  let currentY = window.scrollY;
  let ticking = false;

  const ease = 0.065;

  function tick() {

    const delta = targetY - currentY;

    if (Math.abs(delta) < 0.35) {
      currentY = targetY;
      window.scrollTo(0, currentY);
      ticking = false;
      return;
    }

    currentY += delta * ease;

    window.scrollTo(0, currentY);

    requestAnimationFrame(tick);

  }

  window.addEventListener("wheel", (e) => {

    e.preventDefault();

    targetY += e.deltaY * 1.4;

    targetY = Math.max(
      0,
      Math.min(
        targetY,
        document.body.scrollHeight - window.innerHeight
      )
    );

    if (!ticking) {
      ticking = true;
      requestAnimationFrame(tick);
    }

  }, { passive:false });

  let touchStart = 0;
  let lastTouch = 0;
  let lastTime = 0;
  let velocity = 0;

  window.addEventListener("touchstart",(e)=>{

    touchStart = lastTouch = e.touches[0].clientY;
    lastTime = Date.now();
    velocity = 0;

  },{passive:true});

  window.addEventListener("touchmove",(e)=>{

    const y = e.touches[0].clientY;
    const dt = Date.now() - lastTime || 1;

    velocity = ((lastTouch - y) / dt) * 16;

    lastTouch = y;
    lastTime = Date.now();

    targetY += touchStart - y;
    touchStart = y;

    targetY = Math.max(
      0,
      Math.min(
        targetY,
        document.body.scrollHeight - window.innerHeight
      )
    );

    if(!ticking){
      ticking = true;
      requestAnimationFrame(tick);
    }

  },{passive:true});

  window.addEventListener("touchend",()=>{

    targetY += velocity * 200;

    targetY = Math.max(
      0,
      Math.min(
        targetY,
        document.body.scrollHeight - window.innerHeight
      )
    );

    if(!ticking){
      ticking = true;
      requestAnimationFrame(tick);
    }

  },{passive:true});

  window._mfScroll = function(y){

    targetY = y;
    currentY = window.scrollY;

    if(!ticking){
      ticking = true;
      requestAnimationFrame(tick);
    }

  };

})();

/* -------------------------------------------------- */
/* NAV LINKS */
/* -------------------------------------------------- */

document
.querySelectorAll('a[href^="#"]')
.forEach(link=>{

  link.addEventListener("click",(e)=>{

    const id = link
      .getAttribute("href")
      .slice(1);

    const target = document.getElementById(id);

    if(!target) return;

    e.preventDefault();

    const y =
      target.getBoundingClientRect().top +
      window.scrollY;

    if(window._mfScroll){
      window._mfScroll(y);
    }else{
      window.scrollTo({
        top:y,
        behavior:"smooth"
      });
    }

  });

});

/* -------------------------------------------------- */
/* FOOTER TOP LINK */
/* -------------------------------------------------- */

const footerTop = document.getElementById("footerTop");

if(footerTop){
  footerTop.addEventListener("click", (e) => {
    e.preventDefault();
    if(window._mfScroll){
      window._mfScroll(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

/* -------------------------------------------------- */
/* GRID + BLUR */
/* -------------------------------------------------- */

const grid =
document.getElementById("mfGrid");

const blur =
document.getElementById("mfBlur");

const footer =
document.querySelector(".mf-footer");

window.addEventListener("scroll",()=>{

  const y = window.scrollY;

  const work =
    document.getElementById("work");

  const workTop =
    work ? work.offsetTop : 0;

  const footerOffsetTop =
    footer ? footer.offsetTop : 0;

  if(y < workTop - window.innerHeight * .8){

    grid.classList.remove(
      "is-soft",
      "is-gone"
    );

  }else if(y < workTop){

    grid.classList.add("is-soft");
    grid.classList.remove("is-gone");

  }else{

    grid.classList.remove("is-soft");
    grid.classList.add("is-gone");

  }

  const onFooter =
    y > footerOffsetTop - window.innerHeight * .8;  /* earlier cutoff = no fog edge */

  const onHero =
    y < 50;

  if(onHero || onFooter){

    blur.classList.remove("is-on");
    blur.classList.add("is-off");

  }else{

    blur.classList.add("is-on");
    blur.classList.remove("is-off");

  }

},{passive:true});

/* -------------------------------------------------- */
/* REVEALS */
/* -------------------------------------------------- */

const revealObserver =
new IntersectionObserver(entries=>{

  entries.forEach(entry=>{

    if(entry.isIntersecting){
      entry.target.classList.add("visible");
    }

  });

},{
  threshold:.1
});

document
.querySelectorAll(".mf-reveal")
.forEach(el=>revealObserver.observe(el));

/* -------------------------------------------------- */
/* INTERSECTION MARKERS */
/* -------------------------------------------------- */

const marksWrap =
document.querySelector(".mf-intersections");

for(let i=0;i<8;i++){

  const mark =
  document.createElement("div");

  mark.className =
    "mf-mark " +
    ["dot","dot","dot","star","diamond"][
      Math.floor(Math.random()*5)
    ];

  mark.style.left =
    [10,20,30,40,50,60,70,80,90][
      Math.floor(Math.random()*9)
    ] + "%";

  mark.style.top =
    [33.333,66.666][i%2] + "%";

  mark.style.animationDelay =
    (Math.random()*24).toFixed(2) + "s";

  marksWrap.appendChild(mark);

}

/* -------------------------------------------------- */
/* ASCII */
/* -------------------------------------------------- */

const ascii = Array.from(document.querySelectorAll(".mf-ascii"));

let asciiIndex = 0;

/* 1.5s visible → 3s dark gap → next */
function cycleAscii() {
  ascii.forEach(el => el.classList.remove("show"));
  const current = ascii[asciiIndex % ascii.length];
  current.classList.add("show");
  asciiIndex++;
  setTimeout(() => {
    current.classList.remove("show");
    setTimeout(cycleAscii, 3000);
  }, 1500);
}

setTimeout(cycleAscii, 1200);

/* -------------------------------------------------- */
/* INDEX XX */
/* -------------------------------------------------- */

const indexExtra =
document.getElementById("indexExtra");

if(indexExtra){

  setInterval(()=>{

    indexExtra.textContent =
      indexExtra.textContent==="X"
      ? "XX"
      : "X";

  },2800);

}

/* -------------------------------------------------- */
/* OVERLAY */
/* -------------------------------------------------- */

const overlay =
document.getElementById("mfOverlay");

const overlayImage =
overlay.querySelector(".mf-overlay-img");

const overlayTitle =
overlay.querySelector(".mf-overlay-top-left");

const overlayIndex =
overlay.querySelector(".mf-overlay-top-right");

const overlayClose =
overlay.querySelector(".mf-close");

document
.querySelectorAll(".mf-strip")
.forEach(strip=>{

  strip.addEventListener("click",()=>{

    overlayImage.style.backgroundImage =
      `url('${strip.dataset.img}')`;

    overlayTitle.textContent =
      strip.dataset.title;

    overlayIndex.textContent =
      `Project ${strip.dataset.index}`;

    overlay.classList.add("active");

    document.body.style.overflow="hidden";

  });

});

overlayClose.addEventListener("click",closeOverlay);

document.addEventListener("keydown",e=>{

  if(e.key==="Escape"){
    closeOverlay();
  }

});

function closeOverlay(){

  overlay.classList.remove("active");
  document.body.style.overflow="";

}

/* -------------------------------------------------- */
/* HERO SCALE */
/* -------------------------------------------------- */

function scaleHeroName(){

  const hero =
    document.getElementById("heroName");

  const wrap =
    document.getElementById("nameWrap");

  if(!hero || !wrap) return;

  hero.style.fontSize = "200px";
  wrap.style.transform = "none";
  wrap.style.transformOrigin = "left bottom";

  const width =
    wrap.scrollWidth;

  const viewport =
    window.innerWidth;

  const sidePadding =
    viewport * .008;

  const scale =
    (viewport - sidePadding * 2) / width;

  wrap.style.transform =
    `translateX(${sidePadding}px) scale(${scale})`;

}

if(document.fonts && document.fonts.ready){

  document.fonts.ready.then(scaleHeroName);

}else{

  setTimeout(scaleHeroName,200);

}

scaleHeroName();

window.addEventListener(
  "resize",
  scaleHeroName
);

/* -------------------------------------------------- */
/* HERO GLITCH EFFECTS */
/* -------------------------------------------------- */

(function(){

  const hero =
  document.getElementById("heroName");

  if(!hero) return;

  const wait =
  ms=>new Promise(r=>setTimeout(r,ms));

  const chars=()=>
    Array.from(
      hero.querySelectorAll(".nc")
    ).filter(c=>!c.classList.contains("n-sp"));

  function fadeOut(list,ms=100){

    list.forEach(el=>{
      el.style.transition=`opacity ${ms}ms linear`;
      el.style.opacity="0";
    });

  }

  function fadeIn(list,ms=350){

    list.forEach(el=>{
      el.style.transition=`opacity ${ms}ms linear`;
      el.style.opacity="";
    });

    setTimeout(()=>{
      list.forEach(el=>{
        el.style.transition="";
      });
    },ms+50);

  }

  async function accentA(){

    const a=
    hero.querySelector(".n-a2");

    if(!a) return;

    a.textContent="Á";

    await wait(600);

    a.textContent="A";

  }

  async function accentU(){

    const u=
    hero.querySelector(".n-u");

    if(!u) return;

    u.textContent="Ů";

    await wait(600);

    u.textContent="U";

  }

  async function disappear(){

    const list=[
      "n-a1",
      "n-r",
      "n-i",
      "n-a2",
      "n-n",
      "n-u",
      "n-s",
      "n-e",
      "n-k"
    ]
    .map(c=>hero.querySelector("."+c))
    .filter(Boolean);

    fadeOut(list,100);

    await wait(2100);

    fadeIn(list,350);

    await wait(400);

  }

  async function rgb(){

    const all=chars();

    const picks=
    [...all]
    .sort(()=>Math.random()-.5)
    .slice(0,3);

    let frame=0;

    const total=120;

    const timer=
    setInterval(()=>{

      frame++;

      const t=frame/total;

      const amp=Math.sin(t*Math.PI)*4;

      const j=(Math.random()-.5)*.8;

      const x=(amp+j).toFixed(2);

      const nx=(-(amp+j*.7)).toFixed(2);

      picks.forEach(el=>{

        el.style.textShadow=
        `${x}px 0 3px rgba(226,27,22,.8),
         ${nx}px 0 3px rgba(0,167,255,.8)`;

      });

      if(frame>=total){

        clearInterval(timer);

      }

    },16);

    await wait(2050);

    picks.forEach(el=>{

      el.style.textShadow="";

    });

  }

  async function blur(){

    const all=chars();
    const ease="cubic-bezier(.16,1,.3,1)";
    const steps=[
      {v:"blur(3px)", d:.5},
      {v:"blur(3px)", d:.7},   /* hold at peak */
      {v:"blur(0)",   d:.8},
    ];

    /* ramp up */
    all.forEach(el=>{
      el.style.transition=`filter ${steps[0].d}s ${ease}`;
      el.style.filter=steps[0].v;
    });

    await wait(steps[0].d*1000+100);

    /* hold — no transition change needed, filter stays */
    await wait(steps[1].d*1000);

    /* ramp down */
    all.forEach(el=>{
      el.style.transition=`filter ${steps[2].d}s ${ease}`;
      el.style.filter=steps[2].v;
    });

    await wait(steps[2].d*1000+100);

    all.forEach(el=>{
      el.style.transition="";
      el.style.filter="";
    });

  }

  const effects=[
    accentA,
    accentU,
    disappear,
    rgb,
    blur
  ];

  function shuffle(arr){

    const a=[...arr];

    for(let i=a.length-1;i>0;i--){

      const j=
      Math.floor(Math.random()*(i+1));

      [a[i],a[j]]=[a[j],a[i]];

    }

    return a;

  }

  let queue=[];

  async function run(){

    await wait(2500);

    while(true){

      if(!queue.length){

        queue=shuffle(effects);

      }

      await queue.shift()();

      await wait(2500);

    }

  }

  run();

})();

/* -------------------------------------------------- */
/* XP */
/* -------------------------------------------------- */

(function(){

  const section =
  document.getElementById("xp");

  const timeline =
  document.getElementById("timelineItems");

  if(!section || !timeline) return;

  const items =
  [...timeline.querySelectorAll(".mf-time-item")];

  let started=false;

  const observer =
  new IntersectionObserver(entries=>{

    entries.forEach(entry=>{

      if(!entry.isIntersecting || started) return;

      started=true;

      section.classList.add("visible");

      animateTimeline();

    });

  },{threshold:.1});

  observer.observe(section);

  function animateTimeline(){

    const STEP=700;

    items.forEach((item,index)=>{

      const delay=index*(STEP+200);

      const year=item.querySelector(".mf-time-year");
      const dot=item.querySelector(".mf-time-dot");
      const copy=item.querySelector(".mf-time-copy");

      if(year){ setTimeout(()=>{ year.classList.add("show"); },delay); }
      if(dot){  setTimeout(()=>{ dot.classList.add("visible"); },delay+100); }
      if(copy){ setTimeout(()=>{ copy.classList.add("show"); },delay+200); }

    });

    /* Center XP label vertically with first row's midpoint */
    alignXPLabel();

  }

  function alignXPLabel(){

    const label=section.querySelector(".mf-timeline-label");
    const firstItem=items[0];

    if(!label || !firstItem) return;

    /* Align to the role title element specifically, not the whole copy block */
    const roleEl=firstItem.querySelector(".mf-time-role");
    const dotEl=firstItem.querySelector(".mf-time-dot");
    const yearEl=firstItem.querySelector(".mf-time-year");

    /* Use whichever is visible */
    const refEl=roleEl || dotEl || yearEl;
    if(!refEl) return;

    const labelRect=label.getBoundingClientRect();
    const refRect=refEl.getBoundingClientRect();

    const refMid=refRect.top+refRect.height/2;
    const labelMid=labelRect.top+labelRect.height/2;
    const offset=refMid-labelMid;

    label.style.transform=`translateY(${offset}px)`;
    label.style.transition="transform .8s cubic-bezier(.16,1,.3,1)";

  }

  /* Re-align on resize */
  window.addEventListener("resize",alignXPLabel,{passive:true});

  /* Ripple blur on role title hover */
  items.forEach(item=>{

    item.addEventListener("mouseenter",()=>{

      const chars=Array.from(
        item.querySelectorAll(".mf-time-role-char")
      );

      chars.forEach((ch,i)=>{

        setTimeout(()=>{

          ch.classList.add("rippling");

          setTimeout(()=>{
            ch.classList.remove("rippling");
          },280);

        },i*35);  /* stagger: 35ms per character */

      });

    });

  });

})();

/* -------------------------------------------------- */
/* XP +1 */
/* -------------------------------------------------- */

const xpPlus =
document.getElementById("xpPlus");

if(xpPlus){

  function popXP(){

    xpPlus.classList.remove("pop");

    void xpPlus.offsetWidth;

    xpPlus.classList.add("pop");

  }

  setInterval(popXP,4000);

}

/* -------------------------------------------------- */
/* BIO PAINT */
/* -------------------------------------------------- */

(function(){

  const paragraphs =
  document.querySelectorAll(".mf-about-text p");

  if(!paragraphs.length) return;

  function paint(){

    const vh=window.innerHeight;

    paragraphs.forEach(p=>{

      const rect=p.getBoundingClientRect();

      if(rect.top < vh*.70){

        p.classList.add("painted");
        p.classList.remove("unpainted");

      }else{

        p.classList.remove("painted");
        p.classList.add("unpainted");

      }

    });

  }

  window.addEventListener("scroll",paint,{passive:true});

  paint();

})();

/* -------------------------------------------------- */
/* BIO LETTERS */
/* -------------------------------------------------- */

(function(){

  const b=document.querySelector(".bio-b");
  const i=document.querySelector(".bio-i");
  const o=document.querySelector(".bio-o");

  if(!b || !i || !o) return;

  setInterval(()=>{

    b.classList.add("is-off");
    i.classList.remove("is-off");
    o.classList.add("is-off");

    setTimeout(()=>{

      i.classList.add("is-off");
      o.classList.remove("is-off");

    },900);

    setTimeout(()=>{

      b.classList.remove("is-off");
      i.classList.remove("is-off");
      o.classList.remove("is-off");

    },1900);

  },5000);

})();

/* -------------------------------------------------- */
/* TYPEWRITERS */
/* -------------------------------------------------- */

typewriter(
  "metaText",
  [
    "20+ YEARS OF XP",
    "COACHED 70+ 1–ON–1S",
    "LED LEADERS",
    "LED TEAMS",
    "LED DESIGNERS",
    "LED GROUP TALKS",
    "LED MEANS \"ICE\" IN MY NATIVE LANGUAGE"
  ],
  2000
);

typewriter(
  "twText",
  [
    "“You met me at a very strange time in my life.”",
    "“There is no spoon.”",
    "“Just be a rock.”",
    "“Devour feculence.”",
    "“Majestical.”"
  ],
  2800
);

function typewriter(id,list,startDelay){

  const el=document.getElementById(id);

  if(!el) return;

  const wait=
  ms=>new Promise(r=>setTimeout(r,ms));

  async function type(text){

    for(const c of text){

      el.textContent+=c;

      await wait(55+Math.random()*30);

    }

  }

  async function erase(text){

    for(let i=text.length;i>0;i--){

      el.textContent=text.slice(0,i-1);

      await wait(30);

    }

  }

  (async()=>{

    let index=0;

    await wait(startDelay);

    while(true){

      await wait(2300);   /* +1s pause before each new line */

      const text=list[index++%list.length];

      await type(text);

      await wait(1200);

      await erase(text);

      await wait(250);

    }

  })();

}

/* -------------------------------------------------- */
/* PRACTICE COPY POSITION */
/* -------------------------------------------------- */

function positionRollCopies(){

  document
  .querySelectorAll(".mf-roll")
  .forEach(row=>{

    const left=
    row.querySelector(".mf-roll-left");

    const right=
    row.querySelector(".mf-roll-right");

    if(!left || !right) return;

    const rowRect=
    row.getBoundingClientRect();

    const leftRect=
    left.getBoundingClientRect();

    const rightRect=
    right.getBoundingClientRect();

    const center=
    ((leftRect.right+rightRect.left)/2)
    -rowRect.left;

    row.style.setProperty(
      "--copy-x",
      center+"px"
    );

  });

}

positionRollCopies();

window.addEventListener(
  "resize",
  positionRollCopies
);

document
.querySelectorAll(".mf-roll")
.forEach(row=>{

  ["mouseenter","mouseleave"]
  .forEach(event=>{

    row.addEventListener(event,()=>{

      requestAnimationFrame(positionRollCopies);

      setTimeout(positionRollCopies,450);
      setTimeout(positionRollCopies,920);

    });

  });

});
