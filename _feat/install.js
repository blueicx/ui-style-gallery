#!/usr/bin/env node
/* 批次C 特性安装器：把 _feat/ 片段幂等注入 index.html（重跑安全） */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const P = f => ROOT + '/' + f;
let html = fs.readFileSync(P('index.html'), 'utf8');
const css = fs.readFileSync(P('_feat/feat.css'), 'utf8').trim();
const views = fs.readFileSync(P('_feat/views.html'), 'utf8').trim();
const js = fs.readFileSync(P('_feat/feat.js'), 'utf8').trim();
let n = 0;
const step = (mark, doIt, desc) => {
  if (html.includes(mark)) { console.log('skip(已装): ' + desc); return; }
  doIt(); n++; console.log('✓ ' + desc);
};

// 1. CSS → head 主 style 块尾
step('/*FEAT_C*/', () => {
  const i = html.indexOf('</style>'); if (i < 0) throw Error('style 锚点缺失');
  html = html.slice(0, i) + '\n/*FEAT_C*/\n' + css + html.slice(i);
}, 'CSS 注入');

// 2. 视图片段 → lexicon 视图前
step('id="tuner-overlay"', () => {
  const a = '<section class="wrap view" id="view-lexicon"';
  const i = html.indexOf(a); if (i < 0) throw Error('lexicon 锚点缺失');
  html = html.slice(0, i) + views + '\n' + html.slice(i);
}, '调律台弹层 + 策展路径视图注入');

// 3. 标签栏：星系后追加策展路径
step('data-view="paths"', () => {
  const a = '<a href="#/galaxy" data-view="galaxy" role="tab" aria-selected="false">🌌 星系</a>';
  if (!html.includes(a)) throw Error('galaxy 标签锚点缺失');
  html = html.replace(a, a + '\n  <a href="#/paths" data-view="paths" role="tab" aria-selected="false">🧭 策展路径</a>');
}, '标签栏注入');

// 4. JS → 最后一个 script 块尾
step('/*FEAT_J*/', () => {
  const i = html.lastIndexOf('</script>'); if (i < 0) throw Error('script 尾锚点缺失');
  html = html.slice(0, i) + '\n/*FEAT_J*/\n' + js + '\n' + html.slice(i);
}, '引擎 JS 注入');

// 5. ⌘K：视图数组 + 动作
step("'paths','策展路径'", () => {
  const a = "[['gallery','展馆']";
  if (!html.includes(a)) throw Error('cmdk 视图数组锚点缺失');
  html = html.replace(a, "[['gallery','展馆'],['paths','策展路径']");
}, 'cmdk 视图数组');
if (!html.includes('打开调律台（当前展台）')) {
  html = html.replace(
    "items.push({t:'★ 收藏夹面板',hint:'动作',run:()=>renderFavList()||openOverlay('fav-overlay')});",
    "items.push({t:'★ 收藏夹面板',hint:'动作',run:()=>renderFavList()||openOverlay('fav-overlay')});\n  items.push({t:'🎚 打开调律台（当前展台）',hint:'动作',run:()=>{const x=EXHIBITS.find(e=>document.getElementById(e.id))||EXHIBITS[0];window.__tunerOpen(x.id);}});");
  console.log('✓ cmdk 调律动作'); 
}

// 6. 词条跳转带 id（供 ⌘K 聚焦）——LEXICON 条目无 id 字段，此步跳过

// 7. hero 与 bento 归档数字归一（旧 83 漂移修复）
const fixed = html
  .replace(/<b>\d+ 种主流 UI 设计风格<\/b>/, `<b>${(html.match(/\{id:["']s\d+["']/g) || []).length} 种主流 UI 设计风格</b>`)
  .replace(/>(\d+) 种风格全部归档完成</, (m, d) => '>' + d + ' 种风格全部归档完成<');
if (fixed !== html) { html = fixed; console.log('✓ hero 数字检查'); }

// —— 事务式编译自检 ——
const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
try {
  blocks.forEach((b, i) => { try { new Function(b); } catch (e) { throw new Error('block#' + i + ': ' + e.message); } });
} catch (e) { console.log('COMPILE FAIL:', e.message, '\n— 已中止，index.html 未改动'); process.exit(1); }
fs.writeFileSync(P('index.html'), html);
console.log(`✓ 安装完成（${n} 步，编译 OK）— 下一步：跑 node verify.js 终验`);
