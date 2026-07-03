/* ---- chart engine ---- */
const Chart=(()=>{
function fmt(v){const a=Math.abs(v);if(a>=1e6)return(v/1e6).toFixed(1)+'M';if(a>=1000)return(v/1000).toFixed(a>=10000?0:1)+'k';if(a>0&&a<1)return v.toFixed(2);if(!Number.isInteger(v))return v.toFixed(1);return''+v;}
function draw(cv,series,opts={}){
  const dpr=window.devicePixelRatio||1,W=cv.clientWidth||cv.width,H=W*(opts.ratio||0.52);
  cv.width=W*dpr;cv.height=H*dpr;const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);
  const m={l:60,r:18,t:16,b:44};g.clearRect(0,0,W,H);
  let xs=[],ys=[];series.forEach(s=>s.data.forEach(p=>{xs.push(p[0]);ys.push(p[1]);}));
  if(!xs.length){g.fillStyle='#9aa3b2';g.font='15px Segoe UI';g.textAlign='center';g.fillText('Press "Run" to see results',W/2,H/2);cv._series=null;cv._map=null;return;}
  let xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(0,...ys),ymax=Math.max(...ys);
  if(opts.ymin!=null)ymin=opts.ymin;if(xmax===xmin)xmax=xmin+1;if(ymax===ymin)ymax=ymin+1;ymax+=(ymax-ymin)*0.08;
  const X=x=>m.l+(x-xmin)/(xmax-xmin)*(W-m.l-m.r);const Y=y=>H-m.b-(y-ymin)/(ymax-ymin)*(H-m.t-m.b);
  g.font='12px Segoe UI';const nT=6;
  for(let i=0;i<=nT;i++){const gy=ymin+(ymax-ymin)*i/nT;g.strokeStyle='#eef1f6';g.beginPath();g.moveTo(m.l,Y(gy));g.lineTo(W-m.r,Y(gy));g.stroke();g.fillStyle='#7b8494';g.textAlign='right';g.textBaseline='middle';g.fillText(fmt(gy),m.l-8,Y(gy));}
  for(let i=0;i<=nT;i++){const gx=xmin+(xmax-xmin)*i/nT;g.strokeStyle='#f4f6fa';g.beginPath();g.moveTo(X(gx),m.t);g.lineTo(X(gx),H-m.b);g.stroke();g.fillStyle='#7b8494';g.textAlign='center';g.textBaseline='top';g.fillText(fmt(gx),X(gx),H-m.b+6);}
  g.strokeStyle='#c7ccd6';g.beginPath();g.moveTo(m.l,m.t);g.lineTo(m.l,H-m.b);g.lineTo(W-m.r,H-m.b);g.stroke();
  g.fillStyle='#4a5261';g.font='13px Segoe UI';
  if(opts.xlabel){g.textAlign='center';g.fillText(opts.xlabel,(m.l+W-m.r)/2,H-10);}
  if(opts.ylabel){g.save();g.translate(15,(m.t+H-m.b)/2);g.rotate(-Math.PI/2);g.textAlign='center';g.fillText(opts.ylabel,0,0);g.restore();}
  series.forEach(s=>{if(!s.data.length)return;g.strokeStyle=s.color;g.lineWidth=2.4;g.beginPath();s.data.forEach((p,i)=>{const px=X(p[0]),py=Y(p[1]);i?g.lineTo(px,py):g.moveTo(px,py);});g.stroke();if(s.points){g.fillStyle=s.color;s.data.forEach(p=>{g.beginPath();g.arc(X(p[0]),Y(p[1]),2.3,0,7);g.fill();});}});
  cv._series=series;cv._map={xmin,xmax,ymin,ymax,m,W,H};
}
return{draw};})();
/* ---- helpers ---- */
function toast(m){var t=document.getElementById('toast');if(!t)return;t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(function(){t.classList.remove('show');},2200);}
function dl(t,n,ty){var b=new Blob([t],{type:ty});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n;a.click();URL.revokeObjectURL(a.href);}
function downloadPNG(name){var cv=document.getElementById('chart');if(!cv||!cv._series){toast('Run first');return;}var o=document.createElement('canvas');o.width=cv.width;o.height=cv.height;var c=o.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,o.width,o.height);c.drawImage(cv,0,0);var a=document.createElement('a');a.download=name;a.href=o.toDataURL();a.click();toast('PNG downloaded');}
function setLegend(series){var el=document.getElementById('legend');if(el)el.innerHTML=series.map(function(s){return '<span><i style="background:'+s.color+'"></i>'+(s.name||'')+'</span>';}).join('');}
var _POS=[];(function(){for(var i=0;i<800;i++)_POS.push([Math.random(),Math.random()]);})();
function renderField(canvasId,groups){var cv=document.getElementById(canvasId);if(!cv)return;var dpr=window.devicePixelRatio||1,W=cv.clientWidth,H=W*0.30;cv.width=W*dpr;cv.height=H*dpr;var c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,W,H);c.font='15px serif';c.textAlign='center';c.textBaseline='middle';var idx=0;groups.forEach(function(gp){for(var k=0;k<gp.count;k++){var p=_POS[idx%_POS.length];idx++;c.fillText(gp.emoji,10+p[0]*(W-20),10+p[1]*(H-20));}});}
function toggleFS(){var el=document.getElementById('simbox');var fsEl=document.fullscreenElement||document.webkitFullscreenElement;if(!fsEl){var rq=el.requestFullscreen||el.webkitRequestFullscreen;if(rq)rq.call(el);}else{var ex=document.exitFullscreen||document.webkitExitFullscreen;if(ex)ex.call(document);}}
function _fsSync(){var b=document.getElementById('fsBtn');var on=document.fullscreenElement||document.webkitFullscreenElement;if(b)b.textContent=on?'✕':'⛶';setTimeout(function(){window.dispatchEvent(new Event('resize'));},70);}
document.addEventListener('fullscreenchange',_fsSync);document.addEventListener('webkitfullscreenchange',_fsSync);
window.addEventListener('load',function(){var cv=document.getElementById('chart');if(!cv)return;cv.addEventListener('pointermove',function(e){var M=cv._map;if(!M)return;var r=cv.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;if(mx<M.m.l||mx>M.W-M.m.r||my<M.m.t||my>M.H-M.m.b)return;var xv=M.xmin+(mx-M.m.l)/(M.W-M.m.l-M.m.r)*(M.xmax-M.xmin);var yv=M.ymin+(M.H-M.m.b-my)/(M.H-M.m.b-M.m.t)*(M.ymax-M.ymin);var rx=document.getElementById('rx'),ry=document.getElementById('ry');if(rx)rx.textContent=xv.toFixed(2);if(ry)ry.textContent=yv.toFixed(1);});});
/* ---- model: exponential growth (continuous vs discrete) ---- */
let sim=null,anim=null,frame=0;
function g(id){return +document.getElementById(id).value;}
function mode(){return document.getElementById('mode').value;}
function build(){
  const N0=g('n0'),r=g('r'),B=g('b'),D=g('d'),T=g('t'),n=Math.round(g('steps')),Rd=1+(B-D);
  const cont=[],dis=[];
  for(let i=0;i<=n;i++){const t=T*i/n;cont.push([+t.toFixed(3),N0*Math.exp(r*t)]);dis.push([+t.toFixed(3),N0*Math.pow(Rd,t)]);}
  return {cont,dis,T,n,Rd};
}
const chart=()=>document.getElementById('chart');
function drawChart(){
  if(!sim){Chart.draw(chart(),[]);return;}
  const m=mode(),t=document.getElementById('plotTitle');
  if(m==='cont'){Chart.draw(chart(),[{color:'#b50246',data:sim.cont}],{xlabel:'Time',ylabel:'Population size',ratio:0.5});setLegend([{color:'#b50246',name:'Continuous P = N₀·e^(rt)'}]);t.textContent='Continuous (exponential) growth';}
  else if(m==='dis'){Chart.draw(chart(),[{color:'#0e7c86',data:sim.dis,points:true}],{xlabel:'Time (generations)',ylabel:'Population size',ratio:0.5});setLegend([{color:'#0e7c86',name:'Discrete P = N₀·Rᵗ (R='+sim.Rd.toFixed(2)+')'}]);t.textContent='Discrete (geometric) growth';}
  else{Chart.draw(chart(),[{color:'#b50246',data:sim.cont},{color:'#0e7c86',data:sim.dis}],{xlabel:'Time',ylabel:'Population size',ratio:0.5});setLegend([{color:'#b50246',name:'Continuous e^(rt)'},{color:'#0e7c86',name:'Discrete Rᵗ (R='+sim.Rd.toFixed(2)+')'}]);t.textContent='Continuous vs discrete growth';}
}
function seriesNow(){return mode()==='dis'?sim.dis:sim.cont;}
function drawField(i){if(!sim)return;const s=seriesNow();const mx=s[s.length-1][1];const nN=Math.min(180,Math.round(s[i][1]/mx*160));renderField('field',[{emoji:'🐇',count:nN}]);}
function info(i){if(!sim)return;const c=Math.round(sim.cont[i][1]),d=Math.round(sim.dis[i][1]);document.getElementById('counts').innerHTML=(mode()==='dis'?('Population: <b>'+d+'</b>'):(mode()==='cont'?('Population: <b>'+c+'</b>'):('Continuous: <b>'+c+'</b> &nbsp; Discrete: <b>'+d+'</b>')))+' &nbsp; t = <b>'+sim.cont[i][0]+'</b>';}
function run(){stopAnim();sim=build();frame=sim.n;drawChart();drawField(frame);info(frame);toast('Computed');}
function play(){if(!sim)run();if(anim){stopAnim();return;}document.getElementById('playBtn').textContent='Pause ⏸';let i=(frame>=sim.n)?0:frame;anim=setInterval(function(){if(i>sim.n){stopAnim();return;}frame=i;drawField(i);info(i);i++;},90);}
function stopAnim(){if(anim){clearInterval(anim);anim=null;}document.getElementById('playBtn').textContent='Play ▶';}
function step(){if(!sim)run();stopAnim();frame=(frame>=sim.n)?0:frame+1;drawField(frame);info(frame);}
function sync(){document.querySelectorAll('#simbox .val').forEach(function(v){var el=document.getElementById(v.id.slice(2));if(el)v.textContent=el.value;});}
const D={n0:50,r:0.3,b:0.45,d:0.1,t:30,steps:60};
function resetSim(){stopAnim();for(const k in D)document.getElementById(k).value=D[k];document.getElementById('mode').value='cont';sync();sim=null;frame=0;Chart.draw(chart(),[]);document.getElementById('legend').innerHTML='';document.getElementById('counts').textContent='';renderField('field',[]);toast('Reset');}
function downloadCSV(){if(!sim){toast('Run first');return;}let csv='time,continuous,discrete\n';for(let i=0;i<sim.cont.length;i++)csv+=sim.cont[i][0]+','+sim.cont[i][1]+','+sim.dis[i][1]+'\n';dl(csv,'population-growth.csv','text/csv');toast('CSV downloaded');}
sync();run();window.addEventListener('resize',function(){if(sim){drawChart();drawField(frame);}});
