/* ===== LÓGICA DE LA INVITACIÓN (usa los datos de datos.js) ===== */
const $=s=>document.querySelector(s);
const g=p=>p.split('.').reduce((a,k)=>a&&a[k],INV);
document.querySelectorAll('[data-k]').forEach(e=>{e.textContent=g(e.dataset.k)||''});
document.querySelectorAll('[data-si]').forEach(e=>{if(!g(e.dataset.si))e.style.display='none'});
document.title='Boda de '+INV.novios.join(' y ');


let audio=null;
if(INV.musica){
  /* acepta el ID de un archivo de Google Drive, un enlace directo a un MP3 o una ruta local */
  const src=/^[\w-]{20,}$/.test(INV.musica)?'https://drive.google.com/uc?export=download&id='+INV.musica:INV.musica;
  audio=new Audio(src);audio.loop=true;audio.preload='auto';const b=$('#mus');b.style.display='grid';audio.addEventListener('error',()=>{b.style.display='none'});
  b.onclick=()=>{if(audio.paused){audio.play().catch(()=>{});b.classList.remove('off')}else{audio.pause();b.classList.add('off')}}}

/* PELÍCULA: duración de cada escena en ms (la última se queda) */
const DUR=[7500,9500,11000];
const esc=[...document.querySelectorAll('.esc')],N=esc.length,prog=$('.prog');
esc.forEach(()=>prog.insertAdjacentHTML('beforeend','<i><b></b></i>'));
const bars=[...prog.querySelectorAll('b')];
let idx=-1,t=0,pausa=false,last=0,vivo=false,entrado=false;

function go(i){
  i=Math.max(0,Math.min(N-1,i));
  esc.forEach((e,k)=>{
    if(k===i){e.classList.remove('out');e.classList.add('on')}
    else if(e.classList.contains('on')){e.classList.remove('on');e.classList.add('out');setTimeout(()=>e.classList.remove('out'),1100)}
  });
  bars.forEach((b,k)=>{b.style.width=k<i?'100%':'0'});
  if(i===N-1)bars[i].style.width='100%';
  t=0;idx=i;entrado=false;document.body.classList.toggle('cerrado',i<N-1);
}
function entrar(){document.body.classList.remove('cerrado');$('#guia').scrollIntoView({behavior:'smooth'})}
function loop(ts){
  const dt=Math.min(ts-(last||ts),100);last=ts;
  if(vivo&&!pausa&&idx>=0){
    t+=dt;
    if(idx<N-1){bars[idx].style.width=Math.min(t/DUR[idx],1)*100+'%';if(t>=DUR[idx])go(idx+1)}
    else if(t>=DUR[idx]&&!entrado&&scrollY<10){entrado=true;entrar()}
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

$('#film').addEventListener('click',e=>{
  if(!vivo||scrollY>10||e.target.closest('a,button'))return;
  const r=e.currentTarget.getBoundingClientRect();
  go(e.clientX-r.left<r.width*.3?idx-1:idx+1);
});
$('#pau').onclick=()=>{pausa=!pausa;$('#pau').textContent=pausa?'▶':'❚❚'};

let abierta=false;
$('#abrir').addEventListener('click',()=>{
  if(abierta)return;abierta=true;
  $('#abrir').classList.add('abre');$('.hint').style.opacity=0;
  if(audio){audio.volume=0;audio.play().then(()=>{let v=0;const f=setInterval(()=>{v=Math.min(1,v+.05);audio.volume=v;if(v>=1)clearInterval(f)},120)}).catch(()=>{})}
  setTimeout(()=>{$('#intro').classList.add('fuera');vivo=true;go(0)},3500);
  setTimeout(()=>{$('#intro').style.display='none'},4500);
});

/* SEGUNDA PARTE: invitación con scroll */
$('.sig').onclick=e=>{e.preventDefault();entrar()};
const mapa=q=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);
const lista=a=>a.map(n=>'<p>'+n+'</p>').join('');
$('#pn').innerHTML=lista(INV.padres.novia);$('#pv').innerHTML=lista(INV.padres.novio);$('#pp').innerHTML=lista(INV.padrinos);
const vi=a=>a.map(x=>'<div class="vi"><svg class="vic"><use href="#i-'+x[0]+'"/></svg><span>'+x[1]+'</span></div>').join('');
if(INV.dress){$('#vh').innerHTML=vi(INV.dress.caballeros);$('#vm').innerHTML=vi(INV.dress.damas);
$('#paleta').innerHTML=INV.dress.colores.map(([n,c])=>{const k=parseInt(c.slice(1,3),16)*.3+parseInt(c.slice(3,5),16)*.59+parseInt(c.slice(5,7),16)*.11;return '<div><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="'+c+'" stroke="#b99c7c"/><path d="M12 12l16 16M28 12L12 28" stroke="'+(k<80?'#ffffff':'#3b2a22')+'" stroke-width="2" stroke-linecap="round"/></svg>'+n+'</div>'}).join('')}
const num=(()=>{let n=String(INV.whatsapp).replace(/\D/g,'');if(n.startsWith('0'))n=(INV.codigoPais||'595')+n.slice(1);return n})();
$('#wa').href='https://wa.me/'+num+'?text='+encodeURIComponent('Hola, confirmo mi asistencia a la boda de '+INV.novios.join(' y ')+'.');
$('#m1').href=INV.ceremonia.mapa||mapa(INV.ceremonia.lugar+' '+INV.ceremonia.direccion);
const ini=new Date(INV.fecha.iso);

const cajas=[...document.querySelectorAll('.cuenta b')],CIRC=263.9;
const RG='<svg class="rg" viewBox="0 0 100 100" aria-hidden="true"><circle class="gira" cx="50" cy="50" r="48"/><circle class="pi" cx="50" cy="50" r="42"/><circle class="pr" cx="50" cy="50" r="42" transform="rotate(-90 50 50)"/><g class="orb"><circle cx="50" cy="8" r="3"/></g></svg>';
document.querySelectorAll('.cuenta>div').forEach((d,i)=>{d.insertAdjacentHTML('afterbegin',RG);d.style.setProperty('--sp',[40,26,14,6][i]+'s')});
const prs=[...document.querySelectorAll('.cuenta .pr')],prev=[1,1,1,1];
const total=Math.max(30,Math.ceil((ini.getTime()-Date.now())/864e5));
function tick(){const r=Math.max(0,ini.getTime()-Date.now());
  const n=[Math.floor(r/864e5),Math.floor(r%864e5/36e5),Math.floor(r%36e5/6e4),Math.floor(r%6e4/1e3)];
  n.forEach((v,i)=>{cajas[i].textContent=String(v).padStart(2,'0')});
  [Math.min(r/864e5/total,1),(r%864e5)/864e5,(r%36e5)/36e5,(r%6e4)/6e4].forEach((v,i)=>{
    const c=prs[i];c.style.transition=v>prev[i]+.02?'none':'stroke-dashoffset 1s linear';c.style.strokeDashoffset=CIRC*(1-v);prev[i]=v})}
if(INV.fecha.iso){tick();setInterval(tick,1000)}

/* Divisores animados antes de cada título azul */
const DV='<div class="dv" aria-hidden="true"><svg viewBox="0 0 280 28"><path class="ln" pathLength="1" d="M112 14H8" stroke="url(#gdl)"/><path class="ln" pathLength="1" d="M168 14H272" stroke="url(#gdr)"/><path class="sp" pathLength="1" d="M112 14H8"/><path class="sp" pathLength="1" d="M168 14H272"/><circle class="pt" cx="4" cy="14" r="2"/><circle class="pt" cx="276" cy="14" r="2"/><circle class="pt p2" cx="121" cy="14" r="1.6"/><circle class="pt p2" cx="159" cy="14" r="1.6"/><g class="ro"><g class="g1"><path d="M140 1L144 10L153 14L144 18L140 27L136 18L127 14L136 10Z" fill="#3f8173"/></g><g class="g2"><path transform="rotate(45 140 14) translate(140 14) scale(.62) translate(-140 -14)" d="M140 1L144 10L153 14L144 18L140 27L136 18L127 14L136 10Z" fill="none" stroke="#b8923f" stroke-width="1.4"/></g><circle cx="140" cy="14" r="2.4" fill="#b8923f"/></g></svg></div>';
document.querySelectorAll('.guia h3').forEach(h=>{const p=h.previousElementSibling,t=p&&(p.matches('.iglesia,svg.ico'))?p:h;t.insertAdjacentHTML('beforebegin',DV)});
const io2=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('v');io2.unobserve(e.target)}}),{threshold:.8});
document.querySelectorAll('.dv').forEach(d=>io2.observe(d));

/* Bordes de papel rasgado (arriba y abajo), cada foto con un rasgado distinto */
function rasgado(s,base,amp){
  const n=110,R=k=>Math.abs(Math.sin(k*12.9898+s*78.233)*43758.5453)%1,
  ruido=(i,t)=>(.5+.3*Math.sin(i/n*8+s+t)+.2*Math.sin(i/n*21+s*2+t*3))*amp+R(i+t*97)*amp*.5,p=[];
  for(let i=0;i<=n;i++)p.push((i/n*100).toFixed(2)+'% '+(base+ruido(i,0)).toFixed(2)+'%');
  for(let i=n;i>=0;i--)p.push((i/n*100).toFixed(2)+'% '+(100-base-ruido(i,5)).toFixed(2)+'%');
  return 'polygon('+p.join(',')+')'}
document.querySelectorAll('.foto').forEach((f,i)=>{const u=INV.fotos[i];
  if(u){f.style.backgroundImage='url("'+u+'")';f.textContent=''}
  else fuegos(f.querySelector('canvas'))});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('v')}),{threshold:.2});
document.querySelectorAll('.rv').forEach(s=>io.observe(s));
