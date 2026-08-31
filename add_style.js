#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════
   UI 风格图鉴 · 新风格脚手架
   用法:  node add_style.js --file s78.json
   JSON 字段:
     id,name,en,era,desc,demoHTML,
     spec:{idea,font,color,space,shape,shadow,card,icon,comp},
     use,avoid,refs[],prompt,
     pal[4], meta:"行业|底色|情绪", gene:[form,nav,builder,icon],
     maps:{shape,type,icon,comp,motion,shadow},
     skin:"#s78 …CSS…", readmeEntry:"名字 标语"(可选)
   ═══════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');

const fi = process.argv.indexOf('--file');
if (fi < 0 || !process.argv[fi + 1]) {
  console.log('用法: node add_style.js --file <spec.json>'); process.exit(1);
}
const S = JSON.parse(fs.readFileSync(path.resolve(process.argv[fi + 1]), 'utf8').replace(/^\uFEFF/, ''));
const id = S.id;
if (!/^s\d+$/.test(id)) { console.log('FAIL: id 须形如 s78'); process.exit(1); }
const num = parseInt(id.slice(1));
const prev = 's' + (num - 1);
let edits = 0;
const fail = m => { console.log('FAIL:', m); process.exit(1); };

let html = fs.readFileSync(__dirname + '/index.html', 'utf8');
if (new RegExp(`id:['"]${id}['"]`).test(html)) fail(id + ' 已存在（幂等保护·兼容单/双引号）');

// ── 1. 展品条目：插在 /*DATA8*/ 前，前驱补尾逗号 ──
{
  const d = html.indexOf('/*DATA8*/'); if (d < 0) fail('DATA8 标记缺失');
  let cut = d;
  while (cut > 0 && /\s/.test(html[cut - 1])) cut--;
  const joiner = html[cut - 1] === ',' ? '\n' : ',\n';
  html = html.slice(0, cut) + joiner + buildItem(S) + '\n' + html.slice(d);
  edits++;
}
// ── 2. PAL 尾 ──
insertBeforeClose({
  start: html.indexOf('const PAL={'),
  endMark: '// 风格元信息',
  closePat: '};',
  ins: `\n${id}:['${S.pal.join("','")}']`,
  tag: 'PAL',
});
// ── 3. META 尾 ──
{
  const mi = html.indexOf('const META={};'); if (mi < 0) fail('META 缺失');
  const ci = html.indexOf(']]', mi);
  if (ci < 0 || ci - mi > 6000) fail('META 闭合缺失');
  const [mind, mbase, mmood] = String(S.meta).split(',');
  if (!mbase || !mmood) fail('meta 格式应为 "行业,底色,情绪"');
  // 插在两个 ] 之间：保留前驱行的闭合 ]
  html = html.slice(0, ci + 1) + `,['${id}','${mind}','${mbase}','${mmood}']` + html.slice(ci + 1);
  edits++;
}
// ── 4. 六馆 map 尾（锚定各馆 s71 片段后局部搜索，杜绝跨馆误伤）──
const HALLS = [
  ['shape', "s71:'squircle'", S.maps.shape],
  ['type', "s71:'round'", S.maps.type],
  ['icon', "s71:'duo'", S.maps.icon],
  ['comp', "s71:'pillb'", S.maps.comp],
  ['motion', "s71:'floaty'", S.maps.motion],
  ['shadow', "s71:'soft'", S.maps.shadow],
];
for (const [hall, anchor, val] of HALLS) {
  if (!val) fail('maps.' + hall + ' 缺失');
  const ai = html.indexOf(anchor); if (ai < 0) fail('map 锚点缺失: ' + hall);
  const win = html.slice(ai, ai + 900);
  if (win.includes(`${id}:'`)) continue; // 幂等
  const ci = win.indexOf('classify'); if (ci < 0) fail(hall + ' classify 未找到');
  const bi = win.lastIndexOf('}', ci); if (bi < 0) fail(hall + ' 闭合未找到');
  const ins = `,${id}:'${val}'`;
  const abs = ai + bi;
  html = html.slice(0, abs) + ins + html.slice(abs);
  edits++;
}
// ── 5. GENE 尾（锚定 prev 条目数组的闭合 ]，防尾行带 `},` 时插到对象外）──
{
  const gi = html.indexOf('const GENE={'); if (gi < 0) fail('GENE 缺失');
  const iico = html.indexOf('const ICO={', gi); if (iico < 0) fail('ICO 缺失');
  const li = html.lastIndexOf(prev + ":['", iico); if (li < 0) fail('GENE 前驱缺失');
  const cb = html.indexOf(']', li + prev.length + 3); if (cb < 0 || cb > iico) fail('GENE 数组闭合缺失');
  const geneArr = S.gene.map(x => "'" + x + "'").join(',');
  html = html.slice(0, cb + 1) + `,\n   ${id}:[${geneArr}]` + html.slice(cb + 1);
  edits++;
}
// ── 6. 皮肤 CSS ──
{
  const si = html.indexOf('/* ── 大厂皮肤'); if (si < 0) fail('皮肤锚点缺失');
  html = html.slice(0, si) + S.skin.trimEnd() + '\n\n' + html.slice(si);
  edits++;
}
// ── 7. 计数同步（index.html）── 正则容错：任何旧数字都能归一，防止历史漂移卡死
html = html
  .replace(/(\d+) 种 UI 设计风格活体博物馆/g, `${num} 种 UI 设计风格活体博物馆`)
  .replace(/<b>\d+ 种主流 UI 设计风格<\/b>/g, `<b>${num} 种主流 UI 设计风格</b>`)
  .replace(/>(\d+) 种风格全部归档完成</g, `>${num} 种风格全部归档完成<`);
edits++;

// ── 8. 编译自检（事务式：通过才落盘）──
const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
try {
  blocks.forEach((b, bi) => {
    try { new Function(b); } catch (e) {
      const ln = (/:(\d+)/.exec(e.stack) || [])[1];
      const ctx = ln ? b.split('\n').slice(Math.max(0, ln - 3), ln + 2).map((l, i) => (ln - 2 + i) + ': ' + l.slice(0, 140)).join('\n') : '';
      throw new Error('block#' + bi + ' ' + e.message + '\n' + ctx);
    }
  });
} catch (e) { console.log('COMPILE FAIL:', e.message, '\n— 已中止，index.html 未改动'); process.exit(1); }
fs.writeFileSync(__dirname + '/index.html', html);

let v = fs.readFileSync(__dirname + '/verify.js', 'utf8');
v = v.replace(/r\.exhibits===\d+/g, `r.exhibits===${num}`)
     .replace(/r\.vrailDots===\d+/g, `r.vrailDots===${num}`)
     .replace(/r\.figmaOK===\d+/g, `r.figmaOK===${num}`)
     .replace(/r\.mdBtns===\d+/g, `r.mdBtns===${num}`)
     .replace(/r\.pfBtns===\d+/g, `r.pfBtns===${num}`)
     .replace(/\.length === \d+, 'mb'/g, `.length === ${num}, 'mb'`)
     .replace(/'\d+ 展品'/g, `'${num} 展品'`)
     .replace(/\d+ 进度线刻度/g, `${num} 进度线刻度`)
     .replace(/Figma tokens \d+ 组/g, `Figma tokens ${num} 组`)
     .replace(/\d+ 展台 MD 按钮/g, `${num} 展台 MD 按钮`)
     .replace(/\d+ 展台打印按钮/g, `${num} 展台打印按钮`)
     .replace(/手机专属区\(\d+台/g, `手机专属区(${num}台`);
fs.writeFileSync(__dirname + '/verify.js', v);

const rp = __dirname + '/README.md';
let rd = fs.readFileSync(rp, 'utf8');
rd = rd.replace(`**${num - 1} 种设计风格**`, `**${num} 种设计风格**`)
       .replace(/## 收录风格（\d+）/, `## 收录风格（${num}）`)
       .replace(/\*\*大厂设计语言（37–\d+）\*\*/, `**大厂设计语言（37–${num}）**`)
       .replace(`直达 ${num - 1} 风格`, `直达 ${num} 风格`)
       .replace(`右缘 ${num - 1} 个序号刻度`, `右缘 ${num} 个序号刻度`)
       .replace(`（${num - 1} 台**可交互真机**`, `（${num} 台**可交互真机**`);
if (S.readmeEntry) {
  const bi = rd.indexOf('**大厂设计语言（');
  if (bi >= 0) {
    const le2 = rd.indexOf('\n', bi);
    rd = rd.slice(0, le2) + ` · **${S.readmeEntry}**` + rd.slice(le2);
  }
}
fs.writeFileSync(rp, rd);

// ── 8b. 尾部自检（落盘后再验一次，双保险）──
const blocks2 = [...fs.readFileSync(__dirname + '/index.html', 'utf8').matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
try { blocks2.forEach(b => new Function(b)); }
catch (e) { console.log('POST-WRITE COMPILE FAIL:', e.message); process.exit(1); }
console.log(`✓ ${id} installed (${edits} edits, compile OK) — 运行 node verify.js 终验`);

// ═══ helpers ═══
function q(s) { return JSON.stringify(String(s)); }
function insertBeforeClose({ start, endMark, closePat, ins, tag }) {
  if (start < 0) fail(tag + ' 起点缺失');
  const ei = endMark ? html.indexOf(endMark, start) : html.length;
  if (ei < 0) fail(tag + ' 终点缺失');
  const ci = html.lastIndexOf(closePat, ei);
  if (ci < start || ci > ei) fail(tag + ' 闭合缺失');
  html = html.slice(0, ci) + ',' + ins + html.slice(ci);
  edits++;
}
function buildItem(s) {
  const sp = s.spec || {};
  return `{id:${q(s.id)},num:${q(String(num).padStart(2, '0'))},name:${q(s.name)},en:${q(s.en)},era:${q(s.era)},
 desc:${q(s.desc)},
 stageClass:'',demoClass:'',demoHTML:\`${String(s.demoHTML).replace(/[\\`$]/g, ch => '\\' + ch)}\`,
 spec:{
 idea:${q(sp.idea)},
 font:${q(sp.font)},
 color:${q(sp.color)},
 space:${q(sp.space)},
 shape:${q(sp.shape)},
 shadow:${q(sp.shadow)},
 card:${q(sp.card)},
 icon:${q(sp.icon)},
 comp:${q(sp.comp)}},
 use:${q(s.use)},
 avoid:${q(s.avoid)},
 refs:${JSON.stringify(s.refs)},
 prompt:${q(s.prompt)}}`;
}
