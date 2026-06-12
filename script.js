/* CANVAS */
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;
const mouse = {x:W/2, y:H/2};
const particles = [];
const COUNT = window.innerWidth < 600 ? 60 : 130;

class Particle{
  constructor(){
    this.x = Math.random()*W; this.y = Math.random()*H;
    this.size = Math.random()*2+0.5;
    this.sx = (Math.random()-.5)*.65; this.sy = (Math.random()-.5)*.65;
    this.hue = Math.random()>.6?195:262;
    this.op = Math.random()*.55+.18;
  }
  update(){
    const dx=this.x-mouse.x, dy=this.y-mouse.y;
    const d=Math.sqrt(dx*dx+dy*dy);
    if(d<85){this.x+=dx/d*.6;this.y+=dy/d*.6;}
    this.x+=this.sx; this.y+=this.sy;
    if(this.x<0||this.x>W) this.sx*=-1;
    if(this.y<0||this.y>H) this.sy*=-1;
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fillStyle=`hsla(${this.hue},100%,70%,${this.op})`;
    ctx.fill();
  }
}

for(let i=0;i<COUNT;i++) particles.push(new Particle());

function connect(){
  for(let a=0;a<particles.length;a++){
    for(let b=a+1;b<particles.length;b++){
      const dx=particles[a].x-particles[b].x, dy=particles[a].y-particles[b].y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<105){
        ctx.beginPath();
        ctx.strokeStyle=`rgba(0,200,255,${(1-d/105)*.3})`;
        ctx.lineWidth=.5;
        ctx.moveTo(particles[a].x,particles[a].y);
        ctx.lineTo(particles[b].x,particles[b].y);
        ctx.stroke();
      }
    }
  }
}

(function animate(){
  ctx.clearRect(0,0,W,H);
  particles.forEach(p=>{p.update();p.draw();});
  connect();
  requestAnimationFrame(animate);
})();

window.addEventListener("mousemove",e=>{mouse.x=e.clientX;mouse.y=e.clientY;});
window.addEventListener("touchmove",e=>{
  mouse.x=e.touches[0].clientX;mouse.y=e.touches[0].clientY;
},{passive:true});
window.addEventListener("resize",()=>{
  W=canvas.width=window.innerWidth;
  H=canvas.height=window.innerHeight;
});

/* NAVBAR */
const menuBtn  = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
menuBtn.addEventListener("click",e=>{
  e.stopPropagation();
  navLinks.classList.toggle("active");
  menuBtn.innerHTML = navLinks.classList.contains("active")?"✕":"☰";
});
document.querySelectorAll(".nav-links a").forEach(l=>l.addEventListener("click",()=>{
  navLinks.classList.remove("active"); menuBtn.innerHTML="☰";
}));
document.addEventListener("click",e=>{
  if(navLinks.classList.contains("active")&&!navLinks.contains(e.target)&&e.target!==menuBtn){
    navLinks.classList.remove("active"); menuBtn.innerHTML="☰";
  }
});
window.addEventListener("resize",()=>{
  if(window.innerWidth>768){navLinks.classList.remove("active");menuBtn.innerHTML="☰";}
});

/* SCROLL FADE */
const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add("visible"); });
},{threshold:0.1});
document.querySelectorAll(".fade-up").forEach(el=>obs.observe(el));
setTimeout(()=>document.querySelectorAll("#home .fade-up").forEach(el=>el.classList.add("visible")),80);