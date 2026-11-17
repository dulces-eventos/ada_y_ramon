/* ===== FUEGOS ARTIFICIALES VERDES (se usan en lugar de las fotos cuando INV.fotos está vacío) ===== */
function fuegos(cv){
  const ctx=cv.getContext('2d'),RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const COL=['127,227,255','150,240,200','235,255,225','160,230,120','190,245,255'];
  const rnd=(a,b)=>a+Math.random()*(b-a);
  let W=0,H=0,D=1,raf=0,last=0,T=0,next=0,bursts=[],motas=[];

  function medir(){
    const r=cv.getBoundingClientRect();if(!r.width)return;
    D=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;
    cv.width=Math.round(W*D);cv.height=Math.round(H*D);ctx.setTransform(D,0,0,D,0,0);
    motas=Array.from({length:22},()=>({x:rnd(0,W),y:rnd(0,H),r:rnd(1,3.2),v:rnd(4,12),f:rnd(0,6)}));
    bursts=[];nuevo(1.7);nuevo(.4);next=T+1.1;if(RM)pintar(0)}

  /* t0 = punto de la animación en que arranca (para que haya algo en pantalla desde el inicio) */
  function nuevo(t0){
    const n=Math.round(rnd(26,40));
    bursts.push({t:t0||0,x:rnd(W*.24,W*.76),y:rnd(H*.2,H*.58),R:Math.min(W,H)*rnd(.3,.46),
      rayos:Array.from({length:n},(_,i)=>({a:i/n*6.283+rnd(-.07,.07),l:rnd(.55,1),w:rnd(1.3,3.2),c:COL[Math.random()*COL.length|0]})),
      hilos:Array.from({length:n*2},()=>({a:rnd(0,6.283),l:rnd(.7,1.15)})),
      est:Array.from({length:70},()=>({a:rnd(0,6.283),d:rnd(.55,1.25),s:rnd(.8,2),f:rnd(0,6)}))})}

  function dibujar(b){
    const t=b.t,ca=Math.cos,sa=Math.sin;
    if(t<.7){ /* cohete subiendo */
      const p=t/.7,yy=H+10+(b.y-H-10)*(1-(1-p)*(1-p)),g=ctx.createLinearGradient(b.x,yy+34,b.x,yy);
      g.addColorStop(0,'rgba(255,220,120,0)');g.addColorStop(1,'rgba(255,240,190,.95)');
      ctx.strokeStyle=g;ctx.lineWidth=2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(b.x,yy+34);ctx.lineTo(b.x,yy);ctx.stroke();return}
    const e=t-.7,p=1-Math.pow(1-Math.min(e/1.4,1),3),fade=e>2.3?Math.max(0,1-(e-2.3)/1.1):1;
    if(fade<=0)return;
    /* resplandor central */
    const gr=b.R*(.3+.3*Math.min(e/.5,1)),k=(e<.25?e/.25:1)*fade;
    const gl=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,gr);
    gl.addColorStop(0,`rgba(255,255,255,${.95*k})`);gl.addColorStop(.25,`rgba(170,255,200,${.45*k})`);gl.addColorStop(1,'rgba(60,200,110,0)');
    ctx.fillStyle=gl;ctx.beginPath();ctx.arc(b.x,b.y,gr,0,6.283);ctx.fill();
    /* hilos finos */
    ctx.lineWidth=.6;ctx.lineCap='butt';
    b.hilos.forEach(h=>{const L=b.R*h.l*p;ctx.strokeStyle=`rgba(230,255,240,${.3*fade})`;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x+ca(h.a)*L,b.y+sa(h.a)*L);ctx.stroke()});
    /* rayos gruesos */
    ctx.lineCap='round';
    b.rayos.forEach(r=>{
      const s=b.R*.05*p,L=b.R*r.l*p,x0=b.x+ca(r.a)*s,y0=b.y+sa(r.a)*s,x1=b.x+ca(r.a)*L,y1=b.y+sa(r.a)*L,
      g=ctx.createLinearGradient(x0,y0,x1,y1);
      g.addColorStop(0,`rgba(255,255,255,${.95*fade})`);g.addColorStop(.4,`rgba(${r.c},${.85*fade})`);g.addColorStop(1,`rgba(${r.c},0)`);
      ctx.strokeStyle=g;ctx.lineWidth=r.w;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke()});
    /* estrellitas que centellean y caen un poco */
    b.est.forEach(s=>{
      const d=b.R*s.d*p,x=b.x+ca(s.a)*d,y=b.y+sa(s.a)*d+e*e*7,al=(.55+.45*Math.sin(e*9+s.f))*fade;
      ctx.fillStyle=`rgba(255,255,255,${al})`;ctx.beginPath();ctx.arc(x,y,s.s*.6,0,6.283);ctx.fill();
      ctx.strokeStyle=`rgba(255,255,255,${al*.6})`;ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(x-s.s*2.2,y);ctx.lineTo(x+s.s*2.2,y);ctx.moveTo(x,y-s.s*2.2);ctx.lineTo(x,y+s.s*2.2);ctx.stroke()})}

  function pintar(dt){
    ctx.clearRect(0,0,W,H);ctx.globalCompositeOperation='lighter';
    motas.forEach(m=>{m.y-=m.v*dt;if(m.y<-4){m.y=H+4;m.x=rnd(0,W)}
      ctx.fillStyle=`rgba(190,255,205,${.12+.12*Math.sin(T*1.3+m.f)})`;ctx.beginPath();ctx.arc(m.x,m.y,m.r,0,6.283);ctx.fill()});
    bursts.forEach(b=>{b.t+=dt;dibujar(b)});
    bursts=bursts.filter(b=>b.t<4.3);ctx.globalCompositeOperation='source-over'}

  function paso(ts){
    raf=requestAnimationFrame(paso);
    const dt=Math.min((ts-(last||ts))/1000,.1);last=ts;T+=dt;
    if(T>=next&&bursts.length<4){nuevo(0);next=T+rnd(.9,1.6)}
    pintar(dt)}

  medir();new ResizeObserver(medir).observe(cv);
  if(RM)return; /* con "reducir movimiento" queda una imagen fija */
  new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting&&!raf){last=0;raf=requestAnimationFrame(paso)}
    else if(!e.isIntersecting&&raf){cancelAnimationFrame(raf);raf=0}})).observe(cv)}
