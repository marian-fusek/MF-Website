/* =========================================================================
   MARIAN FUSEK PORTFOLIO - ENGINE
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientNoise();
  initCustomScroll();
  initAutoscaleTitle();
  initAsciiCycler();
  initTypewriter();
  initScrollPaint();
  initGlitchEffects();
});

/* 1. AMBIENT NOISE OVERLAY COMPONENT */
function initAmbientNoise() {
  const canvas = document.getElementById('mf-noise-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let resizeTimeout;
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 150);
  });
  resize();

  function noise() {
    const w = canvas.width;
    const h = canvas.height;
    if (w === 0 || h === 0) return;
    
    const imgData = ctx.createImageData(w, h);
    const buffer = new Uint32Array(imgData.data.buffer);
    const len = buffer.length;
    
    for (let i = 0; i < len; i++) {
      if (Math.random() > 0.5) {
        buffer[i] = 0xff000000;
      }
    }
    
    ctx.putImageData(imgData, 0, 0);
    requestAnimationFrame(noise);
  }
  noise();
}

/* 2. CUSTOM INTERPOLATED LERPER SCROLL (SMOOTH KINETIC) */
let scrollYTarget = 0;
let scrollYCurrent = 0;
const scrollEase = 0.08;

function initCustomScroll() {
  const container = document.getElementById('mf-scroll-container');
  if (!container) return;

  function updateScrollBounds() {
    document.body.style.height = `${container.getBoundingClientRect().height}px`;
  }
  
  window.addEventListener('resize', updateScrollBounds);
  // Initial structural run plus slight delay to offset media loads
  updateScrollBounds();
  setTimeout(updateScrollBounds, 500);

  window.addEventListener('scroll', () => {
    scrollYTarget = window.scrollY;
  });

  function renderScroll() {
    scrollYCurrent += (scrollYTarget - scrollYCurrent) * scrollEase;
    
    // Prevent fractional rounding float sub-pixels
    if (Math.abs(scrollYTarget - scrollYCurrent) < 0.01) {
      scrollYCurrent = scrollYTarget;
    }
    
    container.style.transform = `translate3d(0, ${-scrollYCurrent}px, 0)`;
    
    // Connect dynamic painting calculations directly to current frame interpolation
    triggerPaintScrollUpdate(scrollYCurrent);
    
    requestAnimationFrame(renderScroll);
  }
  requestAnimationFrame(renderScroll);
}

/* 3. HERO SCALER ENGINE (FITS VIEWPORT EXACTLY) */
function initAutoscaleTitle() {
  const title = document.getElementById('mf-autoscale-title');
  if (!title) return;

  function rescale() {
    const width = window.innerWidth;
    // Dynamic fractional tuning based on string metrics width
    const calculatedFontSize = width / 7.6; 
    title.style.fontSize = `${calculatedFontSize}px`;
  }
  
  window.addEventListener('resize', rescale);
  rescale();
}

/* 4. RANDOM ASCII ART CYCLER GRAPHIC */
function initAsciiCycler() {
  const pre = document.getElementById('mf-ascii-cycler');
  if (!pre) return;

  const variations = [
    `   _ __ ___  \n  | '_ \` _ \\ \n  | | | | | |\n  |_| |_| |_|`,
    `   /\`\\_/\`\\    \n  |  _ _  |  \n  | | | | |  \n  |_| |_| |_|`,
    `   __    __  \n  /  \\  /  \\ \n | |\\ \\/ /| |\n |_| \\__/ |_|`,
    `   .---. .---.\n  / .-. .-. \\\n  | | | | | |\n  \`-\` \`-\` \`-\``
  ];

  let frame = 0;
  setInterval(() => {
    frame = (frame + 1) % variations.length;
    pre.textContent = variations[frame];
  }, 900);
}

/* 5. HERO TYPEWRITER MATRICES HOOK */
function initTypewriter() {
  const element = document.getElementById('mf-typewriter-text');
  if (!element) return;

  const sequences = [
    "DIGITAL PRODUCT DESIGNER & CREATIVE DIRECTOR",
    "REDUCING EMOTIONAL DECORATION TO SYSTEMATIC ZERO",
    "ENGINEERING INTEGRITY ACROSS INTERACTIVE SYSTEMS"
  ];

  let seqIndex = 0;
  let charIndex = 0;
  let currentString = "";
  let isDeleting = false;

  function tick() {
    const fullTarget = sequences[seqIndex];
    
    if (!isDeleting) {
      currentString = fullTarget.substring(0, charIndex + 1);
      charIndex++;
    } else {
      currentString = fullTarget.substring(0, charIndex - 1);
      charIndex--;
    }

    element.textContent = currentString;

    let delay = isDeleting ? 25 : 50;

    if (!isDeleting && currentString === fullTarget) {
      delay = 3000; // Hold full statement frame
      isDeleting = true;
    } else if (isDeleting && currentString === "") {
      isDeleting = false;
      seqIndex = (seqIndex + 1) % sequences.length;
      delay = 500;
    }

    setTimeout(tick, delay);
  }
  
  setTimeout(tick, 1000);
}

/* 6. MANIFESTO TEXT-PAINTING LAYER CONTROLLER */
let paintElement = null;
function initScrollPaint() {
  paintElement = document.querySelector('.mf-paint-text');
}

function triggerPaintScrollUpdate(currentScrollY) {
  if (!paintElement) return;
  
  const rect = paintElement.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  
  // Calculate element position relative to target scroll plane
  const elementTopGlobal = rect.top + currentScrollY;
  const triggerPointStart = elementTopGlobal - windowHeight + 100;
  const triggerPointEnd = elementTopGlobal + rect.height - 200;
  
  if (currentScrollY < triggerPointStart) {
    paintElement.style.color = '#111';
    return;
  }
  if (currentScrollY > triggerPointEnd) {
    paintElement.style.color = '#fff';
    return;
  }
  
  const progress = (currentScrollY - triggerPointStart) / (triggerPointEnd - triggerPointStart);
  
  // Clean hex value interpolation conversion logic loop
  const minVal = 17;  // #111
  const maxVal = 255; // #fff
  const currentHexVal = Math.floor(minVal + (maxVal - minVal) * progress);
  const finalHexStr = currentHexVal.toString(16).padStart(2, '0');
  
  paintElement.style.color = `#${finalHexStr}${finalHexStr}${finalHexStr}`;
}

/* 7. SECURE INTERFACES CRYPTO GLITCH INTERACTION */
function initGlitchEffects() {
  const textElements = document.querySelectorAll('.mf-glitch-text');
  
  textElements.forEach(el => {
    const original = el.getAttribute('data-text');
    const matrixChars = "ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789_#@*&";
    
    el.addEventListener('mouseenter', () => {
      let iteration = 0;
      const interval = setInterval(() => {
        el.textContent = original.split("")
          .map((char, index) => {
            if (index < iteration) return original[index];
            if (char === " ") return " ";
            return matrixChars[Math.floor(Math.random() * matrixChars.length)];
          })
          .join("");
          
        if (iteration >= original.length) {
          clearInterval(interval);
          el.textContent = original;
        }
        iteration += 1.5; // Controls glitch reveal speed
      }, 30);
    });
  });
}
