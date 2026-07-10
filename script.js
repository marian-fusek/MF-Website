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
(function(){const section=document.getElementById("xp"),track=document.getElementById("timelineItems");if(!section||!track)return;const cards=[...track.querySelectorAll(".mf-xp-card")];let started=false;const style=document.createElement("style");style.textContent=`.xp-char{display:inline-block;will-change:transform,opacity,filter,color,text-shadow;}.xp-cursor{display:inline-block;margin-left:0;animation:xpCursorBlink .72s steps(1) infinite;}@keyframes xpCursorBlink{50%{opacity:0;}}.xp-heart{display:inline-block;margin-left:.35em;color:#fff;filter:blur(.15px);transform-origin:center;animation:xpHeartBeat 1.05s cubic-bezier(.16,1,.3,1) infinite;}@keyframes xpHeartBeat{0%,100%{transform:scale(1);filter:blur(.15px);}12%{transform:scale(1.22);filter:blur(1.1px);}22%{transform:scale(.98);filter:blur(.25px);}34%{transform:scale(1.16);filter:blur(.9px);}48%{transform:scale(1);filter:blur(.15px);}}.xp-strv-red{color:var(--red,#e21b16)!important;text-shadow:0 0 14px rgba(226,27,22,.36);}.xp-symbio-word,.xp-symbio-digital{display:inline-block;white-space:pre;will-change:transform,opacity,letter-spacing;}`;document.head.appendChild(style);
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting||started)return;started=true;cards.forEach((card,i)=>setTimeout(()=>card.classList.add("show"),i*180));});},{threshold:.22});observer.observe(section);

cards.forEach(card=>{const title=card.querySelector(".mf-xp-title");if(!title)return;title.dataset.original=title.dataset.title||title.textContent;wrapTitle(title);let cleanup=null;card.addEventListener("mouseenter",()=>{if(cleanup)cleanup();cleanup=runTitleEffect(card,title);});card.addEventListener("mouseleave",()=>{if(cleanup)cleanup();cleanup=null;resetTitle(title);});});

function wrapTitle(title){const text=title.dataset.original;title.innerHTML="";for(const ch of text){const span=document.createElement("span");span.className="xp-char";span.textContent=ch===" "?"\u00A0":ch;title.appendChild(span);}}
function resetTitle(title){title.classList.remove("is-blood","is-symbio","xp-strv-red");title.style.opacity="";title.style.filter="";title.style.textShadow="";title.style.color="";title.innerHTML="";title.textContent=title.dataset.original;wrapTitle(title);}
function setPlain(title,text){title.classList.remove("is-blood","is-symbio","xp-strv-red");title.style.color="";title.style.textShadow="";title.innerHTML="";title.textContent=text;}
function setCursorText(title,text){title.innerHTML="";title.append(document.createTextNode(text));const cursor=document.createElement("span");cursor.className="xp-cursor";cursor.textContent="_";title.appendChild(cursor);}

function runTitleEffect(card,title){const type=card.dataset.xpEffect;const timers=[];let killed=false;const t=(fn,ms)=>{const id=setTimeout(()=>{if(!killed)fn()},ms);timers.push(id);return id};const clearAll=()=>timers.forEach(clearTimeout);resetTitle(title);

if(type==="independent"){setCursorText(title,"Independent");const steps=["Independen","Independe","Independ","Indepen","Indepe","Indep","Inde","Ind","In"];steps.forEach((txt,i)=>t(()=>setCursorText(title,txt),520+i*95));const phrase="In depths";[...phrase].forEach((_,i)=>t(()=>setCursorText(title,phrase.slice(0,i+1)),1520+i*85));t(()=>clearAll(),2350);}

if(type==="coach"){title.innerHTML='Coach <span class="xp-heart">♥</span>';}

if(type==="strv"){title.classList.add("xp-strv-red");}

if(type==="symbio"){
  title.innerHTML="";
  "SYMBIO".split("").forEach(ch=>{const s=document.createElement("span");s.className="xp-char";s.textContent=ch;s.style.display="inline-block";title.appendChild(s);});
  const sp=document.createElement("span");sp.textContent="\u00A0";title.appendChild(sp);
  const dig=document.createElement("span");dig.textContent="Digital";title.appendChild(dig);
  const symChars=[...title.querySelectorAll(".xp-char")].reverse();
  symChars.forEach((ch,i)=>t(()=>{ch.style.transition="opacity .1s linear,width .1s linear";ch.style.opacity="0";ch.style.width="0";ch.style.overflow="hidden";},i*65));
  t(()=>{if(killed)return;sp.remove();symChars.forEach(c=>c.remove());const sym=document.createElement("span");sym.style.cssText="display:inline-block;transform:rotate(45deg);margin-right:.2em;opacity:0;transition:opacity .3s linear;";sym.textContent="☯";title.insertBefore(sym,dig);requestAnimationFrame(()=>requestAnimationFrame(()=>{sym.style.opacity="1";}));},symChars.length*65+80);
}

if(type==="fg"){t(()=>setPlain(title,"FG 1"),300);t(()=>setPlain(title,"FG 2"),700);t(()=>setPlain(title,"FG 3"),1100);t(()=>setPlain(title,"FG 4"),1500);t(()=>{setPlain(title,"FG 4rest");clearAll();},1900);}

return ()=>{killed=true;clearAll();resetTitle(title);};}
})();

const xpPlus=document.getElementById("xpPlus");if(xpPlus){function popXP(){xpPlus.classList.remove("pop");void xpPlus.offsetWidth;xpPlus.classList.add("pop")}setInterval(popXP,4000)}

(function(){const paragraphs=document.querySelectorAll(".mf-about-text p");if(!paragraphs.length)return;function paint(){const vh=window.innerHeight;paragraphs.forEach(p=>{const rect=p.getBoundingClientRect();if(rect.top<vh*.70)p.style.color="#fff";else p.style.color="rgba(255,255,255,.22)";});}window.addEventListener("scroll",paint,{passive:true});paint();})();

/* PRACTICE ROLL */
function positionRollCopies(){document.querySelectorAll(".mf-roll").forEach(row=>{const left=row.querySelector(".mf-roll-left"),right=row.querySelector(".mf-roll-right");if(!left||!right)return;const rowRect=row.getBoundingClientRect(),leftRect=left.getBoundingClientRect(),rightRect=right.getBoundingClientRect();const center=((leftRect.right+rightRect.left)/2)-rowRect.left;row.style.setProperty("--copy-x",center+"px");});}
positionRollCopies();
window.addEventListener("resize",positionRollCopies);
document.querySelectorAll(".mf-roll").forEach(row=>{["mouseenter","mouseleave"].forEach(event=>{row.addEventListener(event,()=>{requestAnimationFrame(positionRollCopies);[100,200,300,400,500,600,700].forEach(ms=>setTimeout(positionRollCopies,ms));});});});

/* XP SHAPE — p5.js particle shapes */
(function(){
  const container=document.getElementById("xpShape");
  if(!container||typeof p5==="undefined")return;
  const COUNT=450,IDLE_SPEED=0.6,SEEK_SPEED=5.0,IDLE_FORCE=0.015,SEEK_FORCE=0.22,MORPH_DUR=35;
  const SHAPE_MAP={independent:"triangle",coach:"star",strv:"heart",symbio:"circle",fg:"arrow"};
  let currentShape="circle",targetShape="circle",morphFrame=0,isMorphing=false,isHovering=false;
  const sketch=(p)=>{
    let particles=[],R;
    p.setup=()=>{const cnv=p.createCanvas(container.offsetWidth,container.offsetHeight);cnv.parent(container);p.colorMode(p.HSB,360,100,100,1);p.background(0,0,0,0);R=Math.min(p.width,p.height)*.3;for(let i=0;i<COUNT;i++){particles.push({pos:p.createVector(p.random(-p.width/2,p.width/2),p.random(-p.height/2,p.height/2)),vel:p.createVector(p.random(-.5,.5),p.random(-.5,.5)),acc:p.createVector(0,0),sz:p.random(1.5,3.5)});}};
    p.draw=()=>{p.background(0,0,0,.18);p.translate(p.width/2,p.height/2);if(isMorphing){morphFrame++;if(morphFrame>=MORPH_DUR){isMorphing=false;morphFrame=0;currentShape=targetShape;}}const spd=isHovering?SEEK_SPEED:IDLE_SPEED,frc=isHovering?SEEK_FORCE:IDLE_FORCE;for(let i=0;i<particles.length;i++){const pt=particles[i],angle=p.map(i,0,COUNT,0,p.TWO_PI);const from=shapePos(p,currentShape,angle,R);let to;if(isMorphing){const toP=shapePos(p,targetShape,angle,R);const e=easeInOut(morphFrame/MORPH_DUR);to=p5.Vector.lerp(from,toP,e);}else{to=from;}const desired=p5.Vector.sub(to,pt.pos);desired.setMag(spd);const steer=p5.Vector.sub(desired,pt.vel);steer.limit(frc);pt.acc.add(steer);pt.vel.add(pt.acc);pt.vel.limit(spd);pt.pos.add(pt.vel);pt.acc.mult(0);const s=pt.vel.mag(),br=p.map(s,0,spd,55,100),al=p.map(s,0,spd,.1,.8),sz=p.map(s,0,spd,pt.sz*.4,pt.sz);p.noStroke();p.fill(0,0,br,al);p.circle(pt.pos.x,pt.pos.y,sz);}};
    p.windowResized=()=>{p.resizeCanvas(container.offsetWidth,container.offsetHeight);R=Math.min(p.width,p.height)*.3;};
    window._xpMorph=(shape,hovering)=>{isHovering=hovering;if(shape===currentShape&&!isMorphing)return;targetShape=shape;morphFrame=0;isMorphing=true;};
  };
  new p5(sketch,container);
  const track=document.getElementById("timelineItems");if(!track)return;
  track.querySelectorAll(".mf-xp-card").forEach(card=>{const shape=SHAPE_MAP[card.dataset.xpEffect]||"circle";card.addEventListener("mouseenter",()=>{if(window._xpMorph)window._xpMorph(shape,true);});card.addEventListener("mouseleave",()=>{if(window._xpMorph)window._xpMorph("circle",false);});});
  function shapePos(p,shape,angle,r){switch(shape){case"circle":return p.createVector(p.cos(angle)*r,p.sin(angle)*r);case"triangle":{angle-=p.PI/2;let a=((angle%p.TWO_PI)+p.TWO_PI)%p.TWO_PI;const side=Math.floor(a/(p.TWO_PI/3)),t=(a%(p.TWO_PI/3))/(p.TWO_PI/3),p1=p.createVector(p.cos(side*p.TWO_PI/3)*r,p.sin(side*p.TWO_PI/3)*r),p2=p.createVector(p.cos((side+1)*p.TWO_PI/3)*r,p.sin((side+1)*p.TWO_PI/3)*r);return p5.Vector.lerp(p1,p2,t);}case"star":{const outer=r,inner=r*.45,step=p.TWO_PI/10;let a=angle-p.PI/2;const seg=Math.floor(a/step),r1=seg%2===0?outer:inner,r2=seg%2===0?inner:outer,t=(a-seg*step)/step,p1=p.createVector(p.cos(seg*step)*r1,p.sin(seg*step)*r1),p2=p.createVector(p.cos((seg+1)*step)*r2,p.sin((seg+1)*step)*r2);return p5.Vector.lerp(p1,p2,t);}case"heart":{const t=angle-p.PI/2,sc=r/17,x=16*Math.pow(Math.sin(t),3),y=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));return p.createVector(x*sc,y*sc);}case"arrow":{let a=((angle%p.TWO_PI)+p.TWO_PI)%p.TWO_PI;const pts=[p.createVector(0,-r),p.createVector(r*.55,-r*.25),p.createVector(r*.25,-r*.25),p.createVector(r*.25,r*.75),p.createVector(-r*.25,r*.75),p.createVector(-r*.25,-r*.25),p.createVector(-r*.55,-r*.25)];const segLen=p.TWO_PI/pts.length,seg=Math.floor(a/segLen),t=(a-seg*segLen)/segLen;return p5.Vector.lerp(pts[seg%pts.length],pts[(seg+1)%pts.length],t);}default:return p.createVector(0,0);}}
  function easeInOut(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
})();
