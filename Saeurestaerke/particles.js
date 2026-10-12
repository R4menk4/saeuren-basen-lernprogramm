/* Schematic proton transfer; positions and time scale are didactic, not kinetics. */
window.ParticleModel = class {
  constructor(host, {target=2, initial=0, report=()=>{}}={}) {
    this.host=host; this.target=target; this.report=report; this.time=0; this.running=false; this.job=null; this.last=0; this.destroyed=false;
    this.acids=Array.from({length:10},(_,i)=>this.make(i, i<initial, false));
    this.waters=Array.from({length:10},(_,i)=>this.make(i, i<initial, true));
    host.className='molecule-vessel';
    host.innerHTML='<svg viewBox="0 0 480 420" role="img" aria-label="Bewegliche Kugelteilchen von Säure und Wasser"><defs><radialGradient id="'+host.id+'-a"><stop stop-color="#a3dcde" offset="0"/><stop stop-color="#287c89" offset="1"/></radialGradient><radialGradient id="'+host.id+'-o"><stop stop-color="#ffc1ad" offset="0"/><stop stop-color="#d95237" offset="1"/></radialGradient></defs><g class="molecules"></g></svg>';
    this.layer=host.querySelector('.molecules'); this.draw();this.status('Bereit. Starte eine Protonenübertragung.');
    this.frame=requestAnimationFrame(t=>this.loop(t));
  }
  make(i,ion,water){const col=i%5,row=Math.floor(i/5);return {x:48+col*94+(water?16:0),y:55+row*195+(water?85:0),ion,water,phase:i*2.3+(water?1:0)};}
  pos(p){return{x:p.x+Math.sin(this.time*.0006+p.phase)*10,y:p.y+Math.cos(this.time*.0005+p.phase)*9};}
  count(){return this.acids.filter(p=>p.ion).length;}
  status(message){this.report(this.count(),message);}
  start(){if(this.job)return;const count=this.count();const forward=count<this.target || (count===this.target&&Math.random()<.5);const pick=xs=>xs[Math.floor(Math.random()*xs.length)];const a=pick(this.acids.filter(p=>p.ion!==forward)),w=pick(this.waters.filter(p=>p.ion!==forward));if(!a||!w)return;
    this.job={a,w,forward,elapsed:0,ap:this.pos(a),wp:this.pos(w)};
    this.status(forward?'AH und H₂O nähern sich: Das Wasser nimmt das Proton auf.':'A⁻ und H₃O⁺ nähern sich: A⁻ nimmt das Proton zurück.');
  }
  advance(){this.running=false;if(!this.job)this.start();this.single=true;}
  play(value){this.running=value;this.single=false;if(value&&!this.job)this.start();}
  destroy(){this.destroyed=true;cancelAnimationFrame(this.frame);}
  loop(t){if(this.destroyed)return;const dt=this.last?Math.min(t-this.last,60):0;this.last=t;const active=this.running||this.single;
    if(active){this.time+=dt;if(!this.job&&this.running)this.start();if(this.job){this.job.elapsed+=dt;const j=this.job;if(j.elapsed>=3600){j.a.ion=j.forward;j.w.ion=j.forward;this.job=null;this.single=false;this.status(j.forward?'Proton übertragen: A⁻ und H₃O⁺ bewegen sich getrennt in der Lösung.':'Proton zurückübertragen: AH und H₂O bewegen sich wieder in der Lösung.');}}}
    if(active)this.draw();this.frame=requestAnimationFrame(v=>this.loop(v));
  }
  sphere(x,y,r,fill,label,cls=''){return `<g class="${cls}"><circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="#264653" stroke-width="1.2"/><text x="${x}" y="${y+4}" text-anchor="middle" class="atom-letter">${label}</text></g>`;}
  molecule(p,position,ion,missing=false,highlight=false){const {x,y}=position;let s=highlight?`<circle cx="${x}" cy="${y}" r="34" fill="#fff3cd" stroke="#b77922" stroke-dasharray="4 4"/>`:'';
    s+=this.sphere(x,y,18,`url(#${this.host.id}-${p.water?'o':'a'})`,p.water?'O':'A');
    if(p.water){s+=this.sphere(x-20,y-12,10,'#fff','H')+this.sphere(x+20,y-12,10,'#fff','H');if(ion&&!missing)s+=this.sphere(x-23,y+15,10,'#fff1ad','H');}
    else if(!ion&&!missing)s+=this.sphere(x+24,y+3,10,'#fff1ad','H');
    const name=p.water?(ion?'H₃O⁺':'H₂O'):(ion?'A⁻':'AH');
    s+=`<text x="${x}" y="${y+43}" text-anchor="middle" class="molecule-name">${name}</text>`;
    if(ion)s+=`<text x="${x+24}" y="${y-23}" class="ion-charge">${p.water?'+':'−'}</text>`;
    return s;
  }
  draw(){const j=this.job,progress=j?Math.min(j.elapsed/3600,1):0;const approach=Math.min(progress/.3,1),depart=Math.max(0,(progress-.72)/.28);const ease=x=>x*x*(3-2*x);const lerp=(p,q,v)=>({x:p.x+(q.x-p.x)*v,y:p.y+(q.y-p.y)*v});
    let s='';let ap,wp;
    if(j){ap=lerp(j.ap,{x:205,y:210},ease(approach));wp=lerp(j.wp,{x:277,y:210},ease(approach));if(depart){ap=lerp(ap,this.pos(j.a),ease(depart));wp=lerp(wp,this.pos(j.w),ease(depart));}}
    for(const p of [...this.acids,...this.waters]){let ion=p.ion,missing=false;const active=j&&(p===j.a||p===j.w);if(active&&progress>=.3){if(progress>=.65)ion=j.forward;else if(j.forward&&p===j.a)ion=true;else if(!j.forward&&p===j.w)ion=false;}
      s+=this.molecule(p,active?(p===j.a?ap:wp):this.pos(p),ion,missing,active&&progress<.72);}
    if(j&&progress>=.3&&progress<.65){const from=j.forward?{x:ap.x+24,y:ap.y+3}:{x:wp.x-23,y:wp.y+15},to=j.forward?{x:wp.x-23,y:wp.y+15}:{x:ap.x+24,y:ap.y+3},v=(progress-.3)/.35;const p=lerp(from,to,ease(v));p.y-=Math.sin(v*Math.PI)*25;s+=this.sphere(p.x,p.y,11,'#ffe18d','H');s+=`<text x="${p.x+9}" y="${p.y-10}" class="ion-charge">+</text>`;}
    this.layer.innerHTML=s;
  }
};
