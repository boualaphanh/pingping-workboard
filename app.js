(function(){
const {GENS,F,GROUPS,PHASES,PHASE_LABEL,PARENT_TABS,SCREENS,GAPS,DECISIONS}=window.PP;
const KEY='pingping-workboard-v1';
const $=s=>document.querySelector(s);
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
const LBL={Y:'ใช้ได้',A:'ปรับ',N:'ตัด'};
const NEXT={Y:'A',A:'N',N:'Y'};
let S=load();
function blank(){return{gen:'G3',view:'matrix',ptab:'Home',sel:null,ov:{},ph:{},gaps:{},dec:{},pain:{}};}
function load(){try{const j=JSON.parse(localStorage.getItem(KEY)||'null');return j?Object.assign(blank(),j):blank();}catch(e){return blank();}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
const fById=id=>F.find(f=>f.id===id);
const stOf=(f,g)=>S.ov[f.id+':'+g]||f.st[g][0];
const isOv=(f,g)=>!!S.ov[f.id+':'+g];
const phOf=f=>S.ph[f.id]||f.ph;
const genObj=()=>GENS.find(g=>g.id===S.gen);
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('on'),1600);}

/* gen selector */
function renderGens(){const n=$('#gens');n.innerHTML='';GENS.forEach(g=>{const b=el('button','gen',`<b>${g.id} · ${g.name}</b><span>${g.age} ปี · ${g.level}</span>`);b.setAttribute('aria-pressed',g.id===S.gen);b.onclick=()=>{S.gen=g.id;save();renderAll();};n.appendChild(b);});}
function renderRail(){const g=genObj();
  $('#genPanel').innerHTML=`<h3>Gen ที่เลือก</h3><div class="gennote"><strong>${g.name} · ${g.age} ปี</strong>${g.level} · ${g.device}<br>${g.note}</div>`;
  const c={Y:0,A:0,N:0};F.forEach(f=>c[stOf(f,S.gen)]++);
  const core=F.filter(f=>GENS.every(x=>stOf(f,x.id)==='Y')).length;
  $('#countPanel').innerHTML=`<h3>นับใน ${g.id}</h3>
   <div class="kv"><span style="color:var(--ok)">ใช้ได้</span><b>${c.Y}</b></div>
   <div class="kv"><span style="color:var(--adapt)">ปรับ</span><b>${c.A}</b></div>
   <div class="kv"><span style="color:var(--cut)">ตัด</span><b>${c.N}</b></div>
   <div class="kv"><span>รอดทุก Gen (core)</span><b>${core}</b></div>
   <div class="kv"><span>features ทั้งหมด</span><b>${F.length}</b></div>`;}

/* tabs */
$('#tabs').addEventListener('click',e=>{const b=e.target.closest('.tab');if(!b)return;S.view=b.dataset.v;save();renderTabs();});
function renderTabs(){document.querySelectorAll('.tab').forEach(t=>t.setAttribute('aria-selected',t.dataset.v===S.view));document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!=='v-'+S.view);}

/* matrix */
function renderMatrix(){const t=$('#matrix');t.innerHTML='';
  const th=el('tr');th.innerHTML='<th>#</th><th>Feature</th>'+GENS.map(g=>`<th class="gc${g.id===S.gen?' cur':''}">${g.id}<br><span style="font-weight:400;text-transform:none;letter-spacing:0">${g.age}</span></th>`).join('')+'<th>Phase</th>';
  const thead=el('thead');thead.appendChild(th);t.appendChild(thead);const tb=el('tbody');
  Object.keys(GROUPS).forEach(gk=>{const rows=F.filter(f=>f.g===gk);const gr=el('tr','grp');gr.innerHTML=`<td colspan="8">${gk==='X'?'':gk+'. '}${GROUPS[gk]}<span>${rows.length} features · ${rows.reduce((a,f)=>a+f.s,0)} sub-features</span></td>`;tb.appendChild(gr);
    rows.forEach(f=>{const tr=el('tr');if(S.sel===f.id)tr.className='cur';
      tr.innerHTML=`<td class="fid">${f.id}</td><td class="fname">${f.name}<small>${f.s} sub-features · score ${f.sc}/25</small></td>`;
      GENS.forEach(g=>{const st=stOf(f,g.id);const td=el('td','gc');const b=el('button',`cell ${st}${isOv(f,g.id)?' ov':''}`,`<b>${LBL[st]}</b><small>${f.st[g.id][1]||'&nbsp;'}</small>`);b.title=(f.st[g.id][1]||'')+' — คลิกเพื่อสลับ';b.onclick=()=>{const nv=NEXT[st];if(nv===f.st[g.id][0])delete S.ov[f.id+':'+g.id];else S.ov[f.id+':'+g.id]=nv;S.sel=f.id;save();renderAll();};td.appendChild(b);tr.appendChild(td);});
      const td=el('td');const sl=el('select','ph');PHASES.forEach(p=>{const o=el('option','',p);o.value=p;if(p===phOf(f))o.selected=true;sl.appendChild(o);});sl.id='ph-'+f.id;sl.onchange=()=>{if(sl.value===f.ph)delete S.ph[f.id];else S.ph[f.id]=sl.value;save();renderBoard();};td.appendChild(sl);tr.appendChild(td);tb.appendChild(tr);});});
  t.appendChild(tb);}

/* preview */
function screenOn(sc){const f=fById(sc.f);if(!sc.gens.split(' ').includes(S.gen))return false;return stOf(f,S.gen)!=='N';}
function phone(title,sub,list,cls){const p=el('div','phone');p.innerHTML=`<h3>${title}<span>${sub}</span></h3>`;const fr=el('div','frame'+(cls?' '+cls:''));fr.appendChild(el('div','sb'));const sc=el('div','scr');
  const vis=list.filter(screenOn);
  if(!vis.length)sc.appendChild(el('div','empty','ไม่มีหน้าจอสำหรับ Gen นี้'));
  list.forEach(s=>{const on=screenOn(s);if(!on&&!s.gens.split(' ').includes(S.gen))return;const f=fById(s.f);const st=stOf(f,S.gen);const b=el('button',(on?'':'off')+(S.sel===s.f?' sel':''),`<span>${s.name}</span><small>${s.id} · ${LBL[st]}</small>`);b.onclick=()=>{S.sel=s.f;save();renderPreview();renderMatrix();};sc.appendChild(b);});
  fr.appendChild(sc);p.appendChild(fr);return {p,fr,vis:vis.length};}
function renderPreview(){const n=$('#phones');n.innerHTML='';const g=S.gen;
  const tabsAvail=PARENT_TABS.filter(t=>SCREENS.parent.some(s=>s.tab===t&&screenOn(s)));if(!tabsAvail.includes(S.ptab))S.ptab=tabsAvail[0]||'Home';
  const pl=SCREENS.parent.filter(s=>s.tab===S.ptab);
  const totalP=SCREENS.parent.filter(screenOn).length;
  const P=phone('PingPing Parent',`${totalP} หน้าใน ${g}`,pl);
  const pt=el('div','ptabs');PARENT_TABS.forEach(t=>{const b=el('button','',t);b.setAttribute('aria-selected',t===S.ptab);b.disabled=!tabsAvail.includes(t);b.onclick=()=>{S.ptab=t;save();renderPreview();};pt.appendChild(b);});P.fr.appendChild(pt);n.appendChild(P.p);
  const kOn=stOf(fById('B1'),g)!=='N';const K=phone('PingPing Kids',kOn?`${SCREENS.kids.filter(screenOn).length} หน้าใน ${g}`:'ไม่มีแอพเด็กใน '+g,kOn?SCREENS.kids:[]);n.appendChild(K.p);
  const wOn=stOf(fById('B2'),g)!=='N';const W=phone('Watch',wOn?`${SCREENS.watch.filter(screenOn).length} หน้าจอ`:'ไม่ใช้ watch ใน '+g,wOn?SCREENS.watch:[],'watch');n.appendChild(W.p);
  const d=$('#detail');if(!S.sel){d.hidden=true;return;}const f=fById(S.sel);const st=stOf(f,g);
  d.hidden=false;d.innerHTML=`<div><h3>${f.id} · ${f.name}</h3><p>${GROUPS[f.g]} · ${f.s} sub-features · phase <b>${phOf(f)}</b> · score ${f.sc}/25</p><p>ใน ${g}: <b>${LBL[st]}</b> ${f.st[g][1]?'— '+f.st[g][1]:''}</p><p>ทุก Gen: ${GENS.map(x=>`${x.id} <span class="pill ${stOf(f,x.id)}">${LBL[stOf(f,x.id)]}</span>`).join(' ')}</p></div><span class="pill ${st}">${LBL[st]} ใน ${g}</span>`;}

/* board */
function renderBoard(){const n=$('#board');n.innerHTML='';
  PHASES.forEach(p=>{const col=el('div','col'+(p.startsWith('MVP')?' mvp':''));col.dataset.ph=p;const items=F.filter(f=>phOf(f)===p).sort((a,b)=>b.sc-a.sc);
    col.innerHTML=`<h3>${PHASE_LABEL[p]}<span>${items.length} · ${items.reduce((a,f)=>a+f.s,0) } sub</span></h3>`;
    items.forEach(f=>{const st=stOf(f,S.gen);const c=el('div','card'+(st==='N'?' off':''),`<b>${f.id} ${f.name}</b><div class="m"><span>${GROUPS[f.g].split(' ')[0]}</span><span><i>${f.sc}</i>/25 · ${f.s} sub</span></div>`);c.draggable=true;c.dataset.id=f.id;c.title=`ใน ${S.gen}: ${LBL[st]}`;
      c.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',f.id);c.classList.add('drag');});c.addEventListener('dragend',()=>c.classList.remove('drag'));col.appendChild(c);});
    col.addEventListener('dragover',e=>{e.preventDefault();col.classList.add('over');});col.addEventListener('dragleave',()=>col.classList.remove('over'));
    col.addEventListener('drop',e=>{e.preventDefault();col.classList.remove('over');const id=e.dataTransfer.getData('text/plain');const f=fById(id);if(!f)return;if(p===f.ph)delete S.ph[id];else S.ph[id]=p;save();renderBoard();renderMatrix();toast(`${id} → ${p}`);});
    n.appendChild(col);});}

/* gaps + decisions */
function renderGaps(){const n=$('#gaps');n.innerHTML='';GAPS.forEach(g=>{const on=!!S.gaps[g.id];const it=el('div','item'+(on?' done':''));it.innerHTML=`<input type="checkbox" id="gap-${g.id}" ${on?'checked':''} aria-label="รับ ${g.t}"><label for="gap-${g.id}"><span class="id">${g.id}</span> <b>${g.t}</b><small>${g.w}</small></label>${g.ad?`<span class="r">→ ${g.ad} ${fById(g.ad)?fById(g.ad).name:''}</span>`:'<span></span>'}`;
    it.querySelector('input').onchange=e=>{if(e.target.checked)S.gaps[g.id]=1;else delete S.gaps[g.id];save();renderGaps();};n.appendChild(it);});
  const d=$('#decisions');d.innerHTML='';DECISIONS.forEach(x=>{const on=!!S.dec[x.id];const it=el('div','item'+(on?' done':''));it.innerHTML=`<input type="checkbox" id="dec-${x.id}" ${on?'checked':''} aria-label="ตัดสินใจ ${x.t}"><label for="dec-${x.id}"><span class="id">${x.id}</span> <b>${x.t}</b><small>ตัวเลือก: ${x.o}</small></label><span class="r">เสนอ: ${x.r}</span>`;
    it.querySelector('input').onchange=e=>{if(e.target.checked)S.dec[x.id]=1;else delete S.dec[x.id];save();renderGaps();};d.appendChild(it);});}

/* sitemap */
const isAddon=f=>f&&f.g==='X';
function smNode(s,lvl){const f=s.f?fById(s.f):null;const st=f?stOf(f,S.gen):null;const gOk=!s.gens||s.gens.split(' ').includes(S.gen);const on=gOk&&st!=='N';
  const e=el(f?'button':'div','node l'+lvl+(isAddon(f)?' addon':'')+(on?'':' off')+(f&&S.sel===f.id?' sel':''),`${s.name}<small>${s.id||''}${f?' · '+f.id+(st?' · '+LBL[st]:''):''}</small>`);
  if(f){e.title=`${f.name} — ใน ${S.gen}: ${LBL[st]} · phase ${phOf(f)}`;e.onclick=()=>{S.sel=f.id;save();renderMind();renderMatrix();renderPreview();};}return e;}
function smApp(title,sub,groups){const app=el('div','app');app.appendChild(el('div','node l0',`${title}<small>${sub}</small>`));const lv=el('div','lvl');
  groups.forEach(gp=>{const c=el('div','col2');c.appendChild(el('div','node l1'+(gp.addon?' addon':''),`${gp.name}<small>${gp.items.filter(s=>{const f=s.f?fById(s.f):null;return (!s.gens||s.gens.split(' ').includes(S.gen))&&(!f||stOf(f,S.gen)!=='N');}).length}/${gp.items.length} หน้าใน ${S.gen}</small>`));
    const lf=el('div','leafs');gp.items.forEach(s=>lf.appendChild(smNode(s,2)));c.appendChild(lf);lv.appendChild(c);});
  app.appendChild(lv);return app;}
function renderMind(){const n=$('#mind');n.innerHTML='';const g=S.gen;
  const pg=[{name:'Onboarding',items:window.PP.ONBOARD}].concat(PARENT_TABS.map(t=>({name:t,items:SCREENS.parent.filter(s=>s.tab===t)})));
  n.appendChild(smApp('PingPing Parent',`${SCREENS.parent.filter(screenOn).length+window.PP.ONBOARD.length} หน้าใน ${g}`,pg));
  const kOn=stOf(fById('B1'),g)!=='N';
  n.appendChild(smApp('PingPing Kids',kOn?`${SCREENS.kids.filter(screenOn).length} หน้าใน ${g}`:'ไม่มีแอพเด็กใน '+g,[{name:'Kids app',items:SCREENS.kids}]));
  const wOn=stOf(fById('B2'),g)!=='N';
  n.appendChild(smApp('Watch / Band',wOn?`${SCREENS.watch.filter(screenOn).length} หน้าจอ`:'ไม่ใช้ใน '+g,[{name:'Watch',items:SCREENS.watch}]));}

/* research table */
function renderResearch(){const t=$('#research');t.innerHTML='<thead><tr><th>#</th><th>รายการ survey & research · เหตุผลที่ต้องรู้</th><th>กลุ่มคน / เรื่อง</th><th>ผลที่ได้</th><th>Reference</th></tr></thead>';const tb=el('tbody');
  window.PP.RESEARCH.forEach(r=>{const tr=el('tr');tr.innerHTML=`<td class="n">${r.id}</td><td class="t"><b>${r.t}</b><small>ทำไม: ${r.why}</small></td><td class="who">${r.who}</td><td class="res">${r.res}</td><td class="ref"><a href="${r.url}" target="_blank" rel="noopener">${r.ref}</a></td>`;tb.appendChild(tr);});t.appendChild(tb);}

/* painpoint table */
S.pain=S.pain||{};
function renderPain(){const t=$('#pain');t.innerHTML='<thead><tr><th>ใช้</th><th>#</th><th>รายการ painpoint</th><th>จากกลุ่มไหน / เรื่องไหน</th><th>วิธีแก้ที่ได้จาก survey</th><th>Feature</th><th>Ref</th></tr></thead>';const tb=el('tbody');
  window.PP.PAINTBL.forEach(gp=>{const gr=el('tr','grp');gr.innerHTML=`<td colspan="7" class="${gp.addon?'addon':'mine'}">${gp.g}<span>${gp.rows.length} ข้อ</span></td>`;tb.appendChild(gr);
    gp.rows.forEach(p=>{const on=!!S.pain[p.id];const tr=el('tr',on?'done':'');tr.innerHTML=`<td><input type="checkbox" id="pain-${p.id}" ${on?'checked':''} aria-label="ใช้ ${p.id}"></td><td class="n">${p.id}</td><td class="t"><b>${p.t}</b></td><td class="who">${p.from}</td><td class="res">${p.fix}</td><td class="f">${p.f.split(' ').map(x=>`<span>${x}</span>`).join('')}</td><td class="ref">${p.ref}</td>`;
      tr.querySelector('input').onchange=e=>{if(e.target.checked)S.pain[p.id]=1;else delete S.pain[p.id];save();renderPain();};tb.appendChild(tr);});});t.appendChild(tb);}

/* actions */
$('#btnReset').onclick=()=>{if(!confirm('ล้างการแก้ไขทั้งหมด กลับเป็นค่าจากเอกสารวิเคราะห์?'))return;const g=S.gen;S=blank();S.gen=g;save();renderAll();toast('รีเซ็ตแล้ว');};
$('#btnCopy').onclick=async()=>{const out={gen:S.gen,overrides:S.ov,phases:S.ph,gapsAccepted:Object.keys(S.gaps),decided:Object.keys(S.dec),painpointsSelected:Object.keys(S.pain||{}),matrix:F.map(f=>({id:f.id,name:f.name,phase:phOf(f),status:Object.fromEntries(GENS.map(g=>[g.id,stOf(f,g.id)]))}))};
  const txt=JSON.stringify(out,null,2);try{await navigator.clipboard.writeText(txt);toast('คัดลอกแล้ว');}catch(e){prompt('คัดลอกข้อความนี้',txt);}};

function renderAll(){renderGens();renderRail();renderTabs();renderMatrix();renderPreview();renderBoard();renderGaps();renderMind();renderResearch();renderPain();}
renderAll();
})();
