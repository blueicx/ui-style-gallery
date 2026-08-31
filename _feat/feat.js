
// ══ 批次C 引擎：色板体检徽章 + Token调律台 + 策展路径 + 基因热力矩阵 ══
function _a11ylum(h){const c=[1,3,5].map(i=>{let v=parseInt(h.slice(i,i+2),16)/255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);});return .2126*c[0]+.7152*c[1]+.0722*c[2];}
function _a11ycr(a,b){const l1=_a11ylum(a),l2=_a11ylum(b);return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);}

// ── 1. a11yBadgesInit：每展台 PAL 四色两两 WCAG 体检徽章 ──
(function a11yBadgesInit(){
  function grade(x){
    const p=PAL[x.id];if(!p||p.length<4)return null;
    const [accent,bg,ink,aux]=p.map(s=>s.toUpperCase());
    const cr=(a,b)=>Math.round(_a11ycr(a,b)*100)/100;
    const main=cr(ink,bg),acc=cr(accent,bg),paper2=cr(ink,aux);
    let g='fail',tip='';
    if(main>=7&&acc>=4.5){g='aaa';tip=`正文/底 ${main}:1 AAA · 主色/底 ${acc}:1`;}
    else if(main>=4.5){g='aa';tip=`正文/底 ${main}:1 AA · 主色/底 ${acc}:1 · 正文/辅底 ${paper2}:1`;}
    else if(main>=3){g='big';tip=`正文/底仅 ${main}:1 —— 适合大字/标题场景`;}
    else{g='fail';tip=`正文/底 ${main}:1 不达标 —— 该风格以氛围优先，落地时需加深文字色`;}
    return {g,tip,main,acc};
  }
  window.__a11yGrade=grade;
  const done=new WeakSet();
  function inject(){
    document.querySelectorAll('.exhibit').forEach(el=>{
      if(done.has(el))return;
      const x=EXHIBITS.find(e=>e.id===el.id);if(!x)return;
      const r=grade(x);if(!r)return;
      const act=el.querySelector('.actrow');if(!act||act.querySelector('.a11y-chip'))return;
      const lab={aaa:'AAA',aa:'AA',big:'AA·大字',fail:'✕ 不达标'}[r.g];
      act.insertAdjacentHTML('beforeend',
        `<span class="a11y-chip g-${r.g}" title="${r.tip}" aria-label="色板无障碍评级 ${lab}">♿ 色板 ${lab}</span>`);
      done.add(el);
    });
  }
  new MutationObserver(inject).observe(document.getElementById('gallery'),{childList:true,subtree:true});
  inject();
})();

// ── 2. tunerInit：Token 调律台（圆角/间距/阴影实时调 + 导出调后 token）──
(function tunerInit(){
  const stage=document.getElementById('tuner-stage'),sty=document.getElementById('tuner-style'),
        out=document.getElementById('tuner-out'),who=document.getElementById('tuner-who'),
        rI=document.getElementById('tu-r'),gI=document.getElementById('tu-g'),sI=document.getElementById('tu-s'),
        rV=document.getElementById('tu-rv'),gV=document.getElementById('tu-gv'),sV=document.getElementById('tu-sv');
  if(!stage)return;
  let cur=null;
  function paint(){
    if(!cur)return;
    const R=+rI.value,G=+gI.value,S=+sI.value;
    rV.textContent=R+'px';gV.textContent=G+'px';sV.textContent=S+'px';
    sty.textContent=`#tuner-stage .stage{border-radius:${R}px}#tuner-stage .demo{gap:${G}px}`+
      (S?`#tuner-stage .demo .d-card,#tuner-stage .demo .d-btn{box-shadow:0 ${Math.round(S/3)}px ${S}px rgba(0,0,0,${(S/200+.06).toFixed(2)})}`:
        `#tuner-stage .demo .d-card,#tuner-stage .demo .d-btn{box-shadow:none}`);
    const p=PAL[cur.id]||[];
    out.textContent=`/* ${cur.name} · 调律后 */\n:root{\n  --radius: ${R}px;\n  --gap: ${G}px;\n  --shadow: ${S?`0 ${Math.round(S/3)}px ${S}px rgba(0,0,0,${(S/200+.06).toFixed(2)})`:'none'};\n  --accent: ${(p[0]||'#888').toUpperCase()};\n  --bg: ${(p[1]||'#fff').toUpperCase()};\n  --ink: ${(p[2]||'#111').toUpperCase()};\n}`;
  }
  function open(id){
    cur=EXHIBITS.find(e=>e.id===id);if(!cur)return;
    who.textContent='#'+cur.num+' '+cur.name+' · '+cur.en;
    stage.innerHTML=`<div class="stage ${cur.stageClass}"><div class="demo ${cur.demoClass}">${cur.demoHTML}</div></div>`;
    paint();openOverlay('tuner-overlay');announce('打开调律台：'+cur.name);
  }
  [rI,gI,sI].forEach(i=>i.addEventListener('input',paint));
  document.getElementById('tuner-copy')?.addEventListener('click',e=>{copyText(out.textContent,'调后 Token 已复制');e.target.textContent='✓ 已复制';setTimeout(()=>e.target.textContent='⧉ 复制调后 Token',1200);});
  // 每个展台 actrow 注入 🎚 按钮
  const done=new WeakSet();
  function inj(){document.querySelectorAll('.exhibit').forEach(el=>{
    const act=el.querySelector('.actrow');if(!act||act.querySelector('.tune-btn'))return;
    act.insertAdjacentHTML('beforeend','<button class="mini tune-btn" data-tune="'+el.id+'" title="在调律台里微调这个风格的 Token">🎚 调律</button>');});}
  new MutationObserver(inj).observe(document.getElementById('gallery'),{childList:true,subtree:true});inj();
  document.addEventListener('click',e=>{const b=e.target.closest('[data-tune]');if(b)open(b.dataset.tune);});
  window.__tunerOpen=open;
})();

// ── 3. pathsInit：策展学习路径 + 底部巡展条 ──
(function pathsInit(){
  const list=document.getElementById('paths-list');if(!list)return;
  const PATHS=[
    {icon:'🚀',name:'AI 产品五件套',desc:'做 AI 对话/Agent 产品：从 Claude 的温度到 v0 的黑盒、Perplexity 的可信——看大厂如何把「不确定」包进界面。',ids:['s75','s78','s80','s79','s77']},
    {icon:'🛒',name:'国潮电商修罗场',desc:'砍一刀、种草、鱼塘、万能淘宝——同一块红海七种界面性格，转化与克制的光谱全收录。',ids:['s65','s63','s66','s70','s69']},
    {icon:'🧊',name:'玻璃与深度的谱系',desc:'从新拟态到 visionOS 空间玻璃、液态玻璃、Safari 的安静玻璃——透明度、模糊与阴影的 40 年演化。',ids:['s3','s86','s39','s74','s72']},
    {icon:'📚',name:'编辑排版之魂',desc:'报纸编辑、日系杂志、瑞士国际主义——文字如何不靠图片撑起版面。',ids:['s8','s81','s1','s83','s84']},
    {icon:'🎮',name:'夜店与暗面',desc:'暗夜奢华、蒸汽波、赛博、街机、Discord——深色界面的五种「夜性格」。',ids:['s24','s38','s30','s15','s48']},
    {icon:'⌨️',name:'键盘至上主义者',desc:'Linear、Raycast、终端磷光、复古金融终端——为每分钟 120 次按键的人设计的界面。',ids:['s43','s73','s6','s82','s79']},
    {icon:'🧘',name:'治愈系暖场',desc:'多邻国、小红书、新中式、侘寂、太阳朋克——圆润、暖色、低攻击性的安慰剂设计。',ids:['s45','s63','s37','s13','s35']},
    {icon:'🏢',name:'企业套件四大家族',desc:'Carbon、Ant Design、Fluent、飞书——B 端如何统一一百种表格。',ids:['s39','s41','s29','s67','s42']}
  ];
  list.innerHTML=PATHS.map((p,pi)=>{
    const chips=p.ids.map((id,i)=>{const x=EXHIBITS.find(e=>e.id===id);if(!x)return '';
      return `<button class="mini pchip" data-jump="${id}"><span class="pn">${i+1}</span>${x.num} ${x.name}</button>`;}).join('');
    return `<div class="path-card"><h3>${p.icon} ${p.name}</h3><p class="pdesc">${p.desc}</p><div>${chips}</div><div style="margin-top:10px"><button class="mini path-go" data-tour="${pi}">▶ 开始巡展（${p.ids.length} 台）</button></div></div>`;
  }).join('');
  // 巡展条
  const bar=document.getElementById('path-tour');let tour=null;
  function show(){
    if(!tour){bar.hidden=true;return;}
    const x=EXHIBITS.find(e=>e.id===tour.ids[tour.i]);
    bar.hidden=false;
    bar.innerHTML=`<span style="opacity:.65">${PATHS[tour.pi].icon} ${PATHS[tour.pi].name}</span><b>${tour.i+1}/${tour.ids.length} · ${x?x.name:''}</b>`+
      `<button data-tour="prev" ${tour.i?'':'disabled'}>← 上一台</button><button data-tour="next">${tour.i+1<tour.ids.length?'下一台 →':'✓ 完成'}</button><button data-tour="exit">✕</button>`;
  }
  bar.addEventListener('click',e=>{const b=e.target.closest('[data-tour]');if(!b||!tour)return;
    const k=b.dataset.tour;
    if(k==='exit'){tour=null;show();return;}
    if(k==='prev')tour.i--;
    if(k==='next'){if(++tour.i>=tour.ids.length){tour=null;show();announce('巡展完成 🎉');return;}}
    show();const id=tour.ids[tour.i];showView('gallery');jumpTo(id);
  });
  list.addEventListener('click',e=>{
    const g=e.target.closest('[data-tour]');
    if(g){tour={pi:+g.dataset.tour,i:0};show();showView('gallery');jumpTo(PATHS[tour.pi].ids[0]);return;}
  });
  window.__tourNext=()=>{if(tour){const n=bar.querySelector('[data-tour=next]');if(n)n.click();}};
})();

// ── 4. heatInit：基因热力矩阵（87×6 六馆归类一览）──
(function heatInit(){
  let host=document.getElementById('dna-heat');
  if(!host){const dv=document.getElementById('view-dna');if(!dv)return;host=document.createElement('div');host.id='dna-heat';dv.appendChild(host);}
  if(host.dataset.built)return;
  host.dataset.built='1';
  const halls=HALLS.filter(h=>h.key!=='color');
  const palOf=(hall,v)=>{const ids=Object.values(hall.map);const k=ids.indexOf(v);return `hsl(${(k*47+hall.key.length*23)%360} 62% ${hall.key==='motion'?56:62}%)`;};
  const nameOf=(hall,v)=>{const it=(hall.build().items||[]).find(i=>i.id===v);return it?it.name:v;};
  host.innerHTML=`<h2 style="font-size:16px;margin:34px 0 4px">🔥 基因热力矩阵</h2>
  <p class="dhlead" style="font-size:12px;color:var(--muted);margin-bottom:12px">行=风格（按星系聚簇顺序），列=六馆归类。同色块≈同类基因——竖看一列横比一族，悬停看标本名，点击色块直达该分馆标本明细。</p>
  <div class="hm-wrap"><div class="hm-head"><span>风格 ＼ 维度</span>${halls.map(h=>'<span>'+h.name.replace(/馆$/,'')+'</span>').join('')}</div>
  ${EXHIBITS.map(x=>`<div class="hm-row"><span class="hm-lab"><b>${x.num}</b> ${x.name}</span>${halls.map(h=>{const v=h.map[x.id];return `<span class="hm-cell" data-hall="${h.key}" data-sp="${v}" style="background:${palOf(h,v)}" title="${x.name} · ${h.name}：${nameOf(h,v)}"></span>`;}).join('')}</div>`).join('')}
  </div><p class="hm-foot">配色仅用于区分同类基因，不代表品牌色。与 🌌 星系图互为表里：星系看远近，矩阵看列族。</p>`;
  host.addEventListener('click',e=>{const c=e.target.closest('.hm-cell');if(!c)return;
    showView(c.dataset.hall);const h=HALLS.find(x=>x.key===c.dataset.hall);const it=h.build().items.find(i=>i.id===c.dataset.sp);
    if(it)openHallDeepLink(c.dataset.hall,new URLSearchParams('s='+c.dataset.sp));});
})();
