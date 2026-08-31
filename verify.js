/* UI 风格图鉴 · 常驻校验套件
   运行：node verify.js   （退出码 0 = 全部通过）
   覆盖：数据完整性 / 分馆标本归类全覆盖零空桶 / 词库互链 / 路由 / 打印规则 / Figma tokens / README 计数同步 */
let captured = {};
const mkEl = () => ({ _html: '', set innerHTML(v) { if (typeof v !== 'string') throw new Error('innerHTML not string'); this._html = v; }, get innerHTML() { return this._html; }, addEventListener() {}, classList: { toggle() {}, add() {}, remove() {} }, setAttribute() {}, style: {}, dataset: {}, textContent: '', value: '', clientWidth: 800, clientHeight: 500, appendChild(c) { return c; }, getContext: () => ({ setTransform() {}, clearRect() {}, save() {}, restore() {}, translate() {}, scale() {}, beginPath() {}, arc() {}, fill() {}, stroke() {}, moveTo() {}, lineTo() {}, fillText() {} }), insertAdjacentHTML(pos, h) { if (typeof h !== 'string') throw new Error('bad html'); this._html += h; }, querySelector: () => null, querySelectorAll: () => [] });
global.document = {
  documentElement: { setAttribute() {} },
  getElementById: (id) => { captured[id] = captured[id] || mkEl(); return captured[id]; },
  createElement: () => mkEl(),
  querySelectorAll: () => [],
  addEventListener() {},
  querySelector: () => null,
  activeElement: null
};
global.navigator = { clipboard: { writeText: async () => {} } };
global.localStorage = { getItem: () => null, setItem: () => {} };
global.window = { addEventListener() {} };
global.location = { search: '', hash: '' };
global.history = { replaceState() {} };
global.CSS = { escape: s => s };
global.matchMedia = () => ({ matches: false });
global.IntersectionObserver = class { constructor() {} observe() {} unobserve() {} disconnect() {} };
global.requestAnimationFrame = fn => fn();
global.devicePixelRatio = 1;
const fs = require('fs');
const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const fails = [];
const expect = (name, cond, got) => { console.log((cond ? '  ok ' : 'FAIL ') + name + (cond ? '' : '  (got: ' + got + ')')); if (!cond) fails.push(name); };

if (scripts.length !== 5) { console.log('FAIL: expected 5 script blocks (pwa / style-data / main-engine / err-sentinel / tail-engines), got', scripts.length); process.exit(1); }
const js = scripts[2];
let compileOk = true;
scripts.forEach((s, i) => { try { new Function(s); } catch (e) { compileOk = false; console.log('FAIL compile block#' + i + ':', e.message); } });
if (compileOk) console.log('  ok all script blocks compile'); else process.exit(1);

// 三表键一致性（外层静态统计，对全文计数：展品 id 集合 vs 各表键集合）
const sset = a => [...new Set(a)].sort().join(',');
const exIds = [...html.matchAll(/\{id:['"](s\d{1,3})['"]/g)].map(m => m[1]);
const geneKeyList = [...html.matchAll(/(s\d{1,3}):\['[a-z]+','[a-z]+'/g)].map(m => m[1]);
const palKeyList = [...html.matchAll(/(s\d{1,3}):\['#/g)].map(m => m[1]);
const metaKeyList = [...html.matchAll(/\['(s\d{1,3})','[^']*','(?:light|dark)'/g)].map(m => m[1]);
const tablesOK = {
  gene: sset(geneKeyList) === sset(exIds) ? 'ok' : 'gene:' + sset(geneKeyList),
  pal: sset(palKeyList) === sset(exIds) ? 'ok' : 'pal:' + sset(palKeyList),
  meta: sset(metaKeyList) === sset(exIds) ? 'ok' : 'meta:' + sset(metaKeyList),
};

const probe = js + `;
return {
  exhibits: EXHIBITS.length,
  lexTerms: LEXICON.reduce((n,c)=>n+c.items.length,0),
  seelinks: (document.getElementById('lexwrap')._html.match(/class="seelink"/g)||[]).length,
  vrailDots: (document.getElementById('vrail')._html.match(/class="dot"/g)||[]).length,
  tchips: (document.getElementById('termrow')._html.match(/class="tchip"/g)||[]).length,
  halls: HALLS.length,
  hallKeys: HALLS.map(h=>h.key),
  chips: (document.getElementById('dimhalls')._html.match(/class="chip"/g)||[]).length,
  uniqueColors: HALLS[0].build().items.length,
  specimens: (document.getElementById('dimhalls')._html.match(/class="sp"/g)||[]).length,
  emptyBuckets: HALLS.filter(h=>h.classify)
    .flatMap(h=>h.build().items.filter(it=>!it.ref && !EXHIBITS.some(x=>h.classify(x)===it.id)).map(it=>h.key+'/'+it.id)),
  uncovered: HALLS.filter(h=>h.classify)
    .flatMap(h=>EXHIBITS.filter(x=>!h.build().items.some(it=>it.id===h.classify(x))).map(x=>h.key+'/'+x.id)),
  lexHallOK: Object.entries(LEX_HALL).every(([t,m])=>{
    const h=HALLS.find(x=>x.key===m.key);
    return h && h.build().items.some(i=>i.id===m.id);
  }),
  lexHallCount: Object.keys(LEX_HALL).length,
  mixHasLinks: (()=>{ try{ rollMix(); return document.getElementById('mix-out').value.includes('#/shape?s='); }catch(e){ return 'ERR:'+e.message; } })(),
  pfBtns: (document.getElementById('gallery')._html.match(/mini pf/g)||[]).length,
  mdBtns: (document.getElementById('gallery')._html.match(/mini md/g)||[]).length,
  favOK: typeof renderFavList==='function' && recents.length===0,
  figmaOK: (()=>{ try{ const t=JSON.parse(figmaTokens()); return Object.keys(t.uiStyleAtlas).length; }catch(e){ return 'ERR:'+e.message; } })(),
  vgWallCards: (document.getElementById('vg-wall')?document.getElementById('vg-wall')._html.match(/data-vgkey=/g)||[]:[]
).length,
  geneKeys: ${geneKeyList.length},
  palKeys: ${palKeyList.length},
  metaKeys: ${metaKeyList.length},
  mapMismatches: HALLS.filter(h=>h.classify).flatMap(h=>{
    const ids=new Set(EXHIBITS.map(x=>x.id));
    const ks=Object.keys(h.map);
    const missInMap=[...ids].filter(i=>!(i in h.map));
    const ghostKeys=ks.filter(k=>!ids.has(k));
    return missInMap.map(i=>h.key+'缺'+i).concat(ghostKeys.map(k=>h.key+'多余'+k));
  }),
  tableMismatch: ${JSON.stringify(tablesOK)}
};`;
let r;
try {
  r = new Function('document','navigator','localStorage','window','matchMedia','location','history','CSS', probe)(document, navigator, localStorage, window, matchMedia, global.location, global.history, global.CSS);
} catch (e) { console.log('EXEC ERROR:', e.message); process.exit(1); }

const tabs = (html.match(/data-view="/g)||[]).length;
expect('100 展品', r.exhibits===100, r.exhibits);
expect('70 词条', r.lexTerms===70, r.lexTerms);
expect('139 词库→展台互链', r.seelinks===139, r.seelinks);
expect('70 术语药丸', r.tchips===70, r.tchips);
expect('100 进度线刻度', r.vrailDots===100, r.vrailDots);
expect('Figma tokens 100 组', r.figmaOK===100, r.figmaOK);
expect('7 座分馆(顺序 color,shape,type,icon,comp,motion,shadow)', r.halls===7 && r.hallKeys.join(',')==='color,shape,type,icon,comp,motion,shadow', r.hallKeys.join(','));
expect('18 个视图标签', tabs===18, tabs);
expect('动效馆可路由(view-motion 容器 + 标签，无手工白名单拦截)', html.includes('id="view-${h.key}"') && html.includes('data-view="motion"') && !html.includes("VIEWS.includes(name)"), 'route');
expect('色卡墙渲染数 = 去重色数(>50)', r.chips===r.uniqueColors && r.uniqueColors>50, r.chips+'/'+r.uniqueColors);
expect('76 个标本', r.specimens===76, r.specimens);
expect('归类零空桶', r.emptyBuckets.length===0, JSON.stringify(r.emptyBuckets));
expect('归类全覆盖无遗漏', r.uncovered.length===0, JSON.stringify(r.uncovered));
expect('词库→分馆互链 14 条且目标有效', r.lexHallCount===14 && r.lexHallOK, r.lexHallCount);
expect('混搭提示词含分馆链接', r.mixHasLinks===true, r.mixHasLinks);
expect('打印展开全部视图', /\.view\{display:block !important\}/.test(html), 'css');
expect('动效关键帧存在', html.includes('@keyframes moSlide') && html.includes('@keyframes moFlip'), 'css');
expect('焦点陷阱已接入', html.includes("let lastFocusEl") && html.includes("e.key!=='Tab'"), 'js');
expect('100 展台 MD 按钮', r.mdBtns===100, r.mdBtns);
expect('MD 导出函数完整(九维标签齐全)', ['设计理念','字体逻辑','配色系统','间距规则','形状语言','阴影语言','卡片层级','图标风格','组件规范'].every(l=>html.includes(":'"+l+"'")), 'labels');
expect('100 展台打印按钮', r.pfBtns===100, r.pfBtns);
expect('单卡打印规则(print-one/print-target)', html.includes('body.print-one .exhibit.print-target') && html.includes('afterprint'), 'css');
expect('收藏夹面板(open-fav + fav-overlay + 清空)', html.includes('id="open-fav"') && html.includes('id="fav-overlay"') && html.includes("id='fav-clear'")===false && html.includes('fav-clear'), 'fav');
expect('最近浏览条(recentbar + sessionStorage)', html.includes('id="recentbar"') && html.includes('atlas-recents'), 'recents');
expect('混搭 A/B 锁定(lock-a/lock-b)', html.includes('id="lock-a"') && html.includes('id="lock-b"') && html.includes('lockBEl.checked'), 'locks');
expect('瑞士实战页已挂接(swiss-portfolio.html)', html.includes('swiss-portfolio.html') && fs.existsSync(__dirname+'/swiss-portfolio.html'), 'case');
expect('便当仪表盘实战已挂接(bento-dashboard.html)', html.includes('bento-dashboard.html') && fs.existsSync(__dirname+'/bento-dashboard.html'), 'case2');
expect('标签徽标运行时驱动(无硬编码计数)', html.includes('id="badge-gallery"') && html.includes('id="badge-lexicon"') && html.includes('id="badge-cams"') && !/展馆 <b>\d+<\/b>/.test(html), 'badges');
expect('交接文档在库(HANDOFF.md)', fs.existsSync(__dirname+'/HANDOFF.md') && fs.readFileSync(__dirname+'/README.md','utf8').includes('HANDOFF.md'), 'handoff');
expect('距离感知跳转(jumpTo+统一锚点拦截)', html.includes('function jumpTo(') && html.includes('统一锚点拦截'), 'js');
expect('无残留无条件平滑 scrollIntoView', html.split("scrollIntoView({behavior:'smooth'").length-1===0, html.split("scrollIntoView({behavior:'smooth'").length-1);
expect('全局 CSS 平滑已禁用', /html\{scroll-behavior:auto\}/.test(html), 'css');
expect('动效标本容器已块级化(.mo-demo 样式)', html.includes('.mo-demo{display:flex') && html.includes('.mo-demo i{display:inline-block}'), 'css');
expect('VSGo 板块已完全移除', !html.includes('vsgo') && !html.includes('VG_ICONS') && !html.includes('vg-'), 'removed');
expect('⌘K 命令面板(cmdk 引擎 + / ? 键)', html.includes('cmdk-overlay') && html.includes('cmdkFilter') && html.includes("e.key==='?'"), 'cmdk');
expect('WCAG 对比度检查器(色馆内嵌+色盲滤镜)', html.includes('id="wcc"') && html.includes('cvd-prot') && html.includes('AAA 正文'), 'wcc');
expect('年代时间轴(timeline 视图)', html.includes('view-timeline') && html.includes('timelineInit'), 'tl');
expect('手机专属区(100台真机壳·结构基因各不相同+双模式)', html.includes('view-mobile') && html.includes('mb-sea') && html.includes('ph-notch') && html.includes('mobileInit') && !html.includes('mb-wall') && (html.match(/s\d{1,3}:\['[a-z]+','[a-z]+'/g) || []).length === 100, 'mb');
expect('混搭收藏夹(保存/载入/分享/删除)', html.includes('mix-save') && html.includes('data-mixshare') && html.includes("'mix'").toString()==='true' ? (html.includes('atlas-mixfavs')&&html.includes('?mix=')) : false, 'mixfav');
expect('GENE 表键数=展品数', r.geneKeys===r.exhibits, r.geneKeys+'/'+r.exhibits);
expect('PAL 表键数=展品数', r.palKeys===r.exhibits, r.palKeys+'/'+r.exhibits);
expect('META 表键数=展品数', r.metaKeys===r.exhibits, r.metaKeys+'/'+r.exhibits);
expect('六馆 map 键集合=展品 id 集合(双向零差异)', r.mapMismatches.length===0, JSON.stringify(r.mapMismatches));
expect('三表与展品 id 双向一致(GENE/PAL/META)', r.tableMismatch.gene==='ok' && r.tableMismatch.pal==='ok' && r.tableMismatch.meta==='ok', JSON.stringify(r.tableMismatch));

// —— README 计数守卫（doc-count-sync 结构性加固）：文档计数必须等于数据层探针真值 ——
const readme = fs.readFileSync(__dirname + '/README.md', 'utf8');
const rdNum = re => { const m = readme.match(re); return m ? +m[1] : null; };
const kCmd = readme.match(/直达 (\d+) 风格 \/ (\d+) 视图 \/ (\d+) 词条/);
const docClaims = [
  ['简介种数',      rdNum(/(\d+) 种设计风格/),          r.exhibits],
  ['收录风格标题',  rdNum(/收录风格（(\d+)）/),          r.exhibits],
  ['色卡墙色数',    rdNum(/\*\*(\d+) 色\*\*/),           r.uniqueColors],
  ['词库概念数',    rdNum(/(\d+) 个设计概念/),           r.lexTerms],
  ['类型标本数',    rdNum(/(\d+) 个可视化类型标本/),     r.specimens],
  ['进度线刻度',    rdNum(/右缘 (\d+) 个序号刻度/),      r.vrailDots],
  ['术语药丸数',    rdNum(/顶部 (\d+) 枚术语药丸/),      r.tchips],
  ['手机区风格数',  rdNum(/手机专属区\D*?(\d+) 台/),      r.exhibits],
];
if (kCmd) docClaims.push(['⌘K风格数', +kCmd[1], r.exhibits], ['⌘K视图数', +kCmd[2], tabs], ['⌘K词条数', +kCmd[3], r.lexTerms]);
const docDrift = docClaims
  .filter(c => c[1] === null || c[1] !== c[2])
  .map(c => c[0] + (c[1] === null ? ':正则未命中(README 措辞变了,需同步守卫)' : ':doc=' + c[1] + '/data=' + c[2]));
expect('README 计数守卫(11 处文档数字=数据真值)', docClaims.length === 11 && docDrift.length === 0, docDrift.join('; ') || ('claims=' + docClaims.length));

console.log(fails.length ? '\n✗ '+fails.length+' 项未通过' : '\nALL PASS');
process.exit(fails.length ? 1 : 0);
