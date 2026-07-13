import { Renderer, Program, Triangle, Mesh } from 'https://cdn.jsdelivr.net/npm/ogl@1.0.11/dist/ogl.mjs';

const container = document.getElementById('mfLightRays');
if (container) {
  const hexToRgb = hex => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? [parseInt(m[1],16)/255, parseInt(m[2],16)/255, parseInt(m[3],16)/255] : [1,1,1];
  };
  const renderer = new Renderer({ dpr: Math.min(devicePixelRatio, 2), alpha: true });
  const gl = renderer.gl;
  container.appendChild(gl.canvas);

  const vert = `attribute vec2 position; varying vec2 vUv; void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
  const frag = `precision highp float;
  uniform float iTime; uniform vec2 iResolution; uniform vec2 rayPos; uniform vec2 rayDir;
  uniform vec3 raysColor; uniform float raysSpeed; uniform float lightSpread; uniform float rayLength;
  uniform float fadeDistance; uniform float saturation; uniform vec2 mousePos; uniform float mouseInfluence;
  uniform float noiseAmount; uniform float distortion; varying vec2 vUv;
  float noise(vec2 st){return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);}
  float rayStrength(vec2 source,vec2 refDir,vec2 coord,float a,float b,float speed){
    vec2 d=coord-source; vec2 n=normalize(d); float c=dot(n,refDir);
    float dc=c+distortion*sin(iTime*2.+length(d)*.01)*.2;
    float spread=pow(max(dc,0.),1./max(lightSpread,.001));
    float dist=length(d); float maxDist=iResolution.x*rayLength;
    float len=clamp((maxDist-dist)/maxDist,0.,1.);
    float fade=clamp((iResolution.x*fadeDistance-dist)/(iResolution.x*fadeDistance),.5,1.);
    float base=clamp((.45+.15*sin(dc*a+iTime*speed))+(.3+.2*cos(-dc*b+iTime*speed)),0.,1.);
    return base*len*fade*spread;
  }
  void main(){
    vec2 coord=vec2(gl_FragCoord.x,iResolution.y-gl_FragCoord.y);
    vec2 mouseDir=normalize(mousePos*iResolution.xy-rayPos);
    vec2 finalDir=normalize(mix(rayDir,mouseDir,mouseInfluence));
    vec4 c=vec4(1.)*rayStrength(rayPos,finalDir,coord,36.2214,21.11349,1.5*raysSpeed)*.5;
    c+=vec4(1.)*rayStrength(rayPos,finalDir,coord,22.3991,18.0234,1.1*raysSpeed)*.4;
    float n=noise(coord*.01+iTime*.1); c.rgb*=1.-noiseAmount+noiseAmount*n;
    float br=1.-coord.y/iResolution.y; c.r*=.1+br*.8; c.g*=.3+br*.6; c.b*=.5+br*.5;
    float gray=dot(c.rgb,vec3(.299,.587,.114)); c.rgb=mix(vec3(gray),c.rgb,saturation); c.rgb*=raysColor;
    gl_FragColor=c;
  }`;
  const uniforms = {
    iTime:{value:0}, iResolution:{value:[1,1]}, rayPos:{value:[0,0]}, rayDir:{value:[0,1]},
    raysColor:{value:hexToRgb('#ffffff')}, raysSpeed:{value:.5}, lightSpread:{value:.3},
    rayLength:{value:1.2}, fadeDistance:{value:1.0}, saturation:{value:.4},
    mousePos:{value:[.5,.5]}, mouseInfluence:{value:.1}, noiseAmount:{value:.1}, distortion:{value:.05}
  };
  const program = new Program(gl,{vertex:vert,fragment:frag,uniforms,transparent:true});
  const mesh = new Mesh(gl,{geometry:new Triangle(gl),program});
  let target={x:.5,y:.5}, smooth={x:.5,y:.5}, raf=0, visible=true;
  const resize=()=>{
    const w=container.clientWidth,h=container.clientHeight; renderer.setSize(w,h);
    const d=renderer.dpr; uniforms.iResolution.value=[w*d,h*d];
    uniforms.rayPos.value=[w*d*.5,-h*d*.2]; uniforms.rayDir.value=[0,1];
  };
  const move=e=>{const r=container.getBoundingClientRect();target.x=(e.clientX-r.left)/r.width;target.y=(e.clientY-r.top)/r.height;};
  const loop=t=>{if(!visible)return; uniforms.iTime.value=t*.001; smooth.x=smooth.x*.92+target.x*.08; smooth.y=smooth.y*.92+target.y*.08; uniforms.mousePos.value=[smooth.x,smooth.y]; renderer.render({scene:mesh}); raf=requestAnimationFrame(loop);};
  const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible&&!raf)raf=requestAnimationFrame(loop);if(!visible&&raf){cancelAnimationFrame(raf);raf=0;}},{threshold:.05});
  io.observe(container); window.addEventListener('resize',resize); window.addEventListener('mousemove',move,{passive:true}); resize(); raf=requestAnimationFrame(loop);
}
