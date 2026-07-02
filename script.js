const originalTitle = document.title || "MF";
document.addEventListener("visibilitychange",()=>{document.title=document.hidden?"💭 MF — Still here":originalTitle;});

const loader=document.getElementById("mfLoader");
if(loader){const spans=loader.querySelectorAll("span");spans.forEach(s=>{s.style.transform="translateY(0)"});requestAnimationFrame(()=>requestAnimationFrame(()=>spans.forEach(s=>{s.style.transform=""})));setTimeout(()=>loader.classList.add("done"),1800);}

(function(){let targetY=window.scrollY,currentY=window.scrollY,ticking=false;const ease=.065;function tick(){const d=targetY-currentY;if(Math.abs(d)<.35){currentY=targetY;window.scrollTo(0,currentY);ticking=false;return}currentY+=d*ease;window.scrollTo(0,currentY);requestAnimationFrame(tick)}window.addEventListener("wheel",e=>{e.preventDefault();targetY+=e.deltaY*1.4;targetY=Math.max(0,Math.min(targetY,document.body.scrollHeight-window.innerHeight));if(!ticking){ticking=true;requestAnimationFrame(tick)}},{passive:false});let touchStart=0,lastTouch=0,lastTime=0,velocity=0;window.addEventListener("touchstart",e=>{touchStart=lastTouch=e.touches[0].clientY;lastTime=Date.now();velocity=0},{passive:true});window.addEventListener("touchmove",e=>{const y=e.touches[0].clientY,dt=Date.now()-lastTime||1;velocity=((lastTouch-y)/dt)*16;lastTouch=y;lastTime=Date.now();targetY+=touchStart-y;touchStart=y;targetY=Math.max(0,Math.min(targetY,document.body.scrollHeight-window.innerHeight));if(!ticking){ticking=true;requestAnimationFrame(tick)}},{passive:true});window.addEventListener("touchend",()=>{targetY+=velocity*200;targetY=Math.max(0,Math.min(targetY,document.body.scrollHeight-window.innerHeight));if(!ticking){ticking=true;requestAnimationFrame(tick)}},{passive:true});window._mfScroll=function(y){targetY=y;currentY=window.scrollY;if(!ticking){ticking=true;requestAnimationFrame(tick)}}})();

document.querySelectorAll('a[href^="#"]').forEach(link=>{link.addEventListener("click",e=>{const id=link.getAttribute("href").slice(1);if(!id){e.preventDefault();window._mfScroll?window._mfScroll(0):window.scrollTo({top:0,behavior:"smooth"});return}const target=document.getElementById(id);if(!target)return;e.preventDefault();const y=target.getBoundingClientRect().top+window.scrollY;if(window._mfScroll)window._mfScroll(y);else window.scrollTo({top:y,behavior:"smooth"});});});

const footerTop=document.getElementById("footerTop");if(footerTop){footerTop.addEventListener("click",e=>{e.preventDefault();window._mfScroll?window._mfScroll(0):window.scrollTo({top:0,behavior:"smooth"});});}

const grid=document.getElementById("mfGrid"),blur=document.getElementById("mfBlur"),footer=document.querySelector(".mf-footer");window.addEventListener("scroll",()=>{const y=window.scrollY,work=document.getElementById("work"),workTop=work?work.offsetTop:0,footerTop=footer?footer.offsetTop:0;if(grid){if(y<workTop-window.innerHeight*.8){grid.classList.remove("is-soft","is-gone")}else if(y<workTop){grid.classList.add("is-soft");grid.classList.remove("is-gone")}else{grid.classList.remove("is-soft");grid.classList.add("is-gone")}}if(blur){const onFooter=y>footerTop-window.innerHeight*.8,onHero=y<50;if(onHero||onFooter){blur.classList.remove("is-on");blur.classList.add("is-off")}else{blur.classList.add("is-on");blur.classList.remove("is-off")}}},{passive:true});

const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add("visible")})},{threshold:.1});document.querySelectorAll(".mf-reveal").forEach(el=>revealObserver.observe(el));

const marksWrap=document.querySelector(".mf-intersections");if(marksWrap){for(let i=0;i<8;i++){const mark=document.createElement("div");mark.className="mf-mark "+["dot","dot","dot","star","diamond"][Math.floor(Math.random()*5)];mark.style.left=[10,20,30,40,50,60,70,80,90][Math.floor(Math.random()*9)]+"%";mark.style.top=[33.333,66.666][i%2]+"%";mark.style.animationDelay=(Math.random()*24).toFixed(2)+"s";marksWrap.appendChild(mark)}}

const ascii=Array.from(document.querySelectorAll(".mf-ascii"));let asciiIndex=0;function cycleAscii(){if(!ascii.length)return;ascii.forEach(el=>el.classList.remove("show"));const current=ascii[asciiIndex%ascii.length];current.classList.add("show");asciiIndex++;setTimeout(()=>{current.classList.remove("show");setTimeout(cycleAscii,3000)},1500)}setTimeout(cycleAscii,1200);

const indexExtra=document.getElementById("indexExtra");if(indexExtra){setInterval(()=>{indexExtra.textContent=indexExtra.textContent==="X"?"XX":"X"},2800)}

const overlay=document.getElementById("mfOverlay");if(overlay){const overlayImage=overlay.querySelector(".mf-overlay-img"),overlayTitle=overlay.querySelector(".mf-overlay-top-left"),overlayIndex=overlay.querySelector(".mf-overlay-top-right"),overlayClose=overlay.querySelector(".mf-close");document.querySelectorAll(".mf-strip").forEach(strip=>{strip.addEventListener("click",()=>{if(overlayImage)overlayImage.style.backgroundImage=`url('${strip.dataset.img}')`;if(overlayTitle)overlayTitle.textContent=strip.dataset.title||"";if(overlayIndex)overlayIndex.textContent=`Project ${strip.dataset.index||""}`;overlay.classList.add("active");document.body.style.overflow="hidden";});});function closeOverlay(){overlay.classList.remove("active");document.body.style.overflow=""}if(overlayClose)overlayClose.addEventListener("click",closeOverlay);document.addEventListener("keydown",e=>{if(e.key==="Escape")closeOverlay()});}

function scaleHeroName(){const hero=document.getElementById("heroName"),wrap=document.getElementById("nameWrap"),info=document.querySelector(".mf-hero-info");if(!hero||!wrap)return;hero.style.fontSize="300px";wrap.style.transform="none";const width=wrap.scrollWidth,viewport=window.innerWidth,padding=viewport*.008,scale=(viewport-padding*2)/width,scaledWidth=width*scale,offset=(viewport-scaledWidth)/2;wrap.style.transform=`translateX(${offset}px) scale(${scale})`;wrap.style.transformOrigin="left bottom";if(info&&window.innerWidth>1000){const fChar=hero.querySelector(".n-f");if(fChar){const fRect=fChar.getBoundingClientRect();info.style.left=(fRect.left+20)+"px";info.style.right="auto";info.style.width=Math.min(560,(window.innerWidth-fRect.left)*.55)+"px";info.style.top="22%";info.style.bottom="auto"}}else if(info){info.style.left="";info.style.right="";info.style.width="";info.style.bottom="";info.style.top=""}}
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(scaleHeroName);else setTimeout(scaleHeroName,200);scaleHeroName();window.addEventListener("resize",scaleHeroName);

(function(){const hero=document.getElementById("heroName");if(!hero)return;const wait=ms=>new Promise(r=>setTimeout(r,ms));const chars=()=>Array.from(hero.querySelectorAll(".nc")).filter(c=>!c.classList.contains("n-sp"));async function accentA(){const a=hero.querySelector(".n-a2");if(!a)return;a.textContent="Á";await wait(600);a.textContent="A"}async function accentU(){const u=hero.querySelector(".n-u");if(!u)return;u.textContent="Ů";await wait(600);u.textContent="U"}async function disappear(){const list=["n-a1","n-r","n-i","n-a2","n-n","n-u","n-s","n-e","n-k"].map(c=>hero.querySelector("."+c)).filter(Boolean);list.forEach(el=>el.style.opacity="0");await wait(2100);list.forEach(el=>el.style.opacity="");await wait(400)}async function rgb(){const all=chars(),picks=[...all].sort(()=>Math.random()-.5).slice(0,3);let frame=0,total=120;const timer=setInterval(()=>{frame++;const t=frame/total,amp=Math.sin(t*Math.PI)*4,j=(Math.random()-.5)*.8,x=(amp+j).toFixed(2),nx=(-(amp+j*.7)).toFixed(2);picks.forEach(el=>{el.style.textShadow=`${x}px 0 3px rgba(226,27,22,.8),${nx}px 0 3px rgba(0,167,255,.8)`});if(frame>=total)clearInterval(timer)},16);await wait(2050);picks.forEach(el=>el.style.textShadow="")}async function blurFx(){const all=chars();all.forEach(el=>{el.style.transition=`filter .5s cubic-bezier(.16,1,.3,1)`;el.style.filter="blur(3px)"});await wait(1300);all.forEach(el=>{el.style.transition=`filter .8s cubic-bezier(.16,1,.3,1)`;el.style.filter="blur(0)"});await wait(900);all.forEach(el=>{el.style.transition="";el.style.filter=""})}const effects=[accentA,accentU,disappear,rgb,blurFx];function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}let queue=[];async function run(){await wait(2500);while(true){if(!queue.length)queue=shuffle(effects);await queue.shift()();await wait(2500)}}run();})();

/* XP structural reveal + title effects */
(function(){const section=document.getElementById("xp"),track=document.getElementById("timelineItems");if(!section||!track)return;const cards=[...track.querySelectorAll(".mf-xp-card")];let started=false;const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting||started)return;started=true;cards.forEach((card,i)=>setTimeout(()=>card.classList.add("show"),i*180));});},{threshold:.22});observer.observe(section);

cards.forEach(card=>{const title=card.querySelector(".mf-xp-title");if(!title)return;title.dataset.original=title.dataset.title||title.textContent;wrapTitle(title);let cleanup=null;card.addEventListener("mouseenter",()=>{if(cleanup)cleanup();cleanup=runTitleEffect(card,title);});card.addEventListener("mouseleave",()=>{if(cleanup)cleanup();cleanup=null;resetTitle(title);});});

function wrapTitle(title){const text=title.dataset.original;title.innerHTML="";for(const ch of text){const span=document.createElement("span");span.className="xp-char";span.textContent=ch===" "?"\u00A0":ch;title.appendChild(span);}}
function resetTitle(title){title.classList.remove("is-blood","is-symbio");title.style.opacity="";title.style.filter="";title.style.textShadow="";title.innerHTML="";title.textContent=title.dataset.original;wrapTitle(title);}
function setPlain(title,text){title.classList.remove("is-blood","is-symbio");title.innerHTML="";title.textContent=text;}
function runTitleEffect(card,title){const type=card.dataset.xpEffect;const timers=[];const intervals=[];let killed=false;const t=(fn,ms)=>{const id=setTimeout(()=>{if(!killed)fn()},ms);timers.push(id);return id};const every=(fn,ms)=>{const id=setInterval(()=>{if(!killed)fn()},ms);intervals.push(id);return id};resetTitle(title);

if(type==="independent"){
  const chars=()=>title.querySelectorAll(".xp-char");
  const flicker=()=>{const c=chars();[0,1].forEach(i=>{if(c[i]){c[i].style.opacity=Math.random()>.48?"1":".08";c[i].style.filter=Math.random()>.6?"blur(1px)":"";}})};
  every(flicker,90);
  t(()=>{const c=chars();[0,1].forEach(i=>{if(c[i])c[i].style.opacity="0"});},3000);
  t(()=>{const c=chars();[0,1].forEach(i=>{if(c[i])c[i].style.opacity="1"});},3420);
}

if(type==="coach"){
  const original="Coach";
  every(()=>{const arr=original.split("").sort(()=>Math.random()-.5);setPlain(title,arr.join(""));},115);
  t(()=>setPlain(title,"Co-"),4200);
}

if(type==="strv"){
  t(()=>title.classList.add("is-blood"),80);
  t(()=>title.classList.remove("is-blood"),2080);
}

if(type==="symbio"){
  every(()=>{title.classList.toggle("is-symbio");const chars=title.querySelectorAll(".xp-char");chars.forEach((ch,i)=>{if(Math.random()>.68){ch.style.transform=`translate(${(Math.random()-.5)*6}px,${(Math.random()-.5)*4}px)`}else{ch.style.transform=""}});},130);
}

if(type==="fg"){
  t(()=>setPlain(title,"FG 1"),500);
  t(()=>setPlain(title,"FG 2"),1400);
  t(()=>setPlain(title,"FG 3"),2300);
  t(()=>setPlain(title,"FG 4"),3200);
  t(()=>setPlain(title,"FG 4rest"),4100);
}

const stop=setTimeout(()=>{if(!killed){killed=true;intervals.forEach(clearInterval);timers.forEach(clearTimeout);if(type!=="coach"&&type!=="fg")resetTitle(title);}},5200);timers.push(stop);
return ()=>{killed=true;intervals.forEach(clearInterval);timers.forEach(clearTimeout);resetTitle(title);};}
})();

const xpPlus=document.getElementById("xpPlus");if(xpPlus){function popXP(){xpPlus.classList.remove("pop");void xpPlus.offsetWidth;xpPlus.classList.add("pop")}setInterval(popXP,4000)}

(function(){const paragraphs=document.querySelectorAll(".mf-about-text p");if(!paragraphs.length)return;function paint(){const vh=window.innerHeight;paragraphs.forEach(p=>{const rect=p.getBoundingClientRect();if(rect.top<vh*.70)p.style.color="#fff";else p.style.color="rgba(255,255,255,.22)";});}window.addEventListener("scroll",paint,{passive:true});paint();})();
