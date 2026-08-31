# UI 风格图鉴 · 交接文档（HANDOFF）

> 交接日期：2026-08-31 ｜ 仓库根：`E:\新建文件夹\ui-style-gallery`
> 一句话：单文件「活体博物馆」UI 风格图鉴——**87 种风格**在同一组件基线上横向对比，配 70 词专业词库、7 座维度分馆、17 个视图与 9 大工具区。
> 当前状态：**verify.js 43 项断言 ALL PASS**（2026-08-31 实跑，干净）。

---

## 1. 五分钟上手

```powershell
cd E:\新建文件夹\ui-style-gallery
node verify.js                 # 回归套件，必须输出 ALL PASS（退出码 0）
start index.html               # 浏览器直接打开即可，无构建、无依赖、离线可用
```

- 运行时只需 **Node.js**（跑 verify.js 和脚手架），无 npm 依赖、无打包器。
- 页面数据全部内联在 `index.html` 里（数据驱动渲染），改数据＝改 JS 常量。
- **铁律：任何改动后必须 `node verify.js` 至 ALL PASS 才算完成。**

## 2. 文件清单

| 文件 | 说明 |
|------|------|
| `index.html` | 主文件（~637 KB），全部自包含：样式 + 数据 + 13 个引擎 IIFE |
| `verify.js` | 44 项回归断言 + README 计数守卫；DOM 是「最小假环境」mock（见 §6 坑） |
| `README.md` | 权威功能清单，面向使用者；**11 处计数被 verify 守卫**，改数据必须同步 |
| `add_style.js` | 扩风格脚手架：`node add_style.js --file _spec_sXX.json`（事务式，编译不过不落盘） |
| `_spec_s75/76/77.json` | spec 格式示例（字段：id/name/en/era/industry/mood/desc/prompt/use/refs） |
| `bento-demo.html` | 实战案例：Bento 个人主页 |
| `bento-dashboard.html` | 实战案例：Bento SaaS 仪表盘（**未挂进 verify 断言**，README 文件清单也漏列——待补） |
| `swiss-portfolio.html` | 实战案例：瑞士国际主义作品集（verify 有挂接断言） |
| `og.svg` / `og.png` | 社交分享卡 1200×630（png 用无头 Chrome 截 svg 生成） |
| `ui-style-atlas.svg` / `.ico` | 站点图标 |
| `atlas-v1-backup.html` | Vol.01 存档（30 风格版），勿动 |

**无 git 仓库**。改坏时的兜底：改前复制一份 index.html，或依赖 `large-html-artifacts` 技能的 temp+rename 原子写入。

## 3. index.html 内部结构（必读）

### 3.1 五个顶层 `<script>` 块（顺序敏感）

| # | 块 | 作用 |
|---|----|------|
| 0 | PWA | manifest data-URL + Service Worker blob；仅 https/localhost 注册，file:// 静默跳过 |
| 1 | style-data | `EXHIBITS` / `PAL` / `META` / `GENE` / `LEXICON` / `SEE` / `PINYIN` / `HAY` 等数据常量 |
| 2 | **main-engine** | 渲染引擎 + 路由 + ⌘K + 分馆 + 混搭……verify 的探针就跑在这个块上 |
| 3 | err-sentinel | 错误哨兵 |
| 4 | tail-engines | 各新区 IIFE 引擎（见 3.3） |

> ⚠️ verify.js 有 `scripts.length !== 5` 精确守卫，且主引擎按**位置索引** `scripts[2]` 取。新增顶层 script 块必须同时改这两处。

### 3.2 数据层（风格 = 一条记录 × 多张表）

- `EXHIBITS[]`：87 条展台档案（id/name/en/era/desc/use/avoid/refs/spec/prompt/demoHTML/stageClass/demoClass）。
- `PAL`：`{s1:['#..','#..','#..','#..']}` 四色代表色，取 accent 用 `PAL[id][2]`。
- `META`：`['sXX','行业','light|dark','情绪'…]` 三维筛标签。
- `GENE`：`{sXX:['结构基因','导航模式'…]}` 手机区真机形态派生表。
- `LEXICON`：词库 70 词条（分组 items）；`SEE`：词条→展台反向互链（当前 139 条）。
- `HALLS[6]` 的归类映射 map（shape/type/icon/comp/motion/shadow 六馆逐风格人工策展）。

**新增一个风格的完整检查单（缺一即 verify FAIL）**：
EXHIBITS 档案 → PAL 四色 → META 行 → 六馆映射 ×6 → GENE 行 → README 6 处计数 → 展馆标签徽标 `<b>N</b>`（手工，不被守卫）→ verify.js 断言数字逐条 +1。

### 3.3 引擎 IIFE 清单（13 个，全在 tail 块内）

`cmdkInit`(⌘K面板) · `wccInit`(WCAG对比度检查器) · `rampInit`(色阶派生器) · `quizInit`(闪卡测验) · `galaxyInit`(星系力导向 canvas) · `noteInit`(私人笔记 MutationObserver) · `timelineInit`(年代时间轴) · `mobileInit`(手机真机区) · `camsInit`(复古相机区) · `dnaInit`(风格DNA雷达) · `pgInit`(分页/速览) · `deskInit`(桌面组件区) · `antiInit`(反例区)

### 3.4 视图与路由

17 个 `data-view` 标签 = gallery / lexicon / case / color / shape / type / icon / comp / motion / shadow / timeline / mobile / cams / dna / desktop / antipattern / galaxy。
路由按 DOM 中 `id="view-${key}"` 容器存在性自动识别，**新增视图零配置**，但要同步 verify 的「17 个视图标签」断言与 README ⌘K 计数（守卫是 87/17/70 三个数）。
深链：`#/color?c=FFD166`、`#/shape?s=pill`、手机区 `?focus=sXX`、混搭 `?mix=s1+s43`。

## 4. verify.js 断言地图

- L31-35：5 块守卫 + 编译检查（改脚本块结构先动这里）。
- L95-135：功能/结构断言逐条，**数字是真值快照**——词条 70、互链 139、标本 76、视图标签 17、色卡 274……改之前先看断言现值，别按记忆覆盖。
- L137-155：README 计数守卫（11 处 doc 数字 = 探针真值；正则若因 README 措辞改变而不命中会报「正则未命中，需同步守卫」——改 README 文案时保持这些句式：`(N) 种设计风格`、`收录风格（N）`、`**N 色**`、`N 个设计概念`、`N 个可视化类型标本`、`右缘 N 个序号刻度`、`顶部 N 枚术语药丸`、`手机专属区…N 台`、`直达 N 风格 / N 视图 / N 词条`）。

## 5. 常用开发动作

### 新增展台风格
```powershell
node add_style.js --file _spec_s88.json   # 脚手架插 META；demoHTML/spec/PAL/GENE 需手工补
node verify.js
```
之后按 §3.2 检查单补齐六馆映射（值只能用现有枚举，动效馆无 `spin`，旋转用 `orbit`）。

### 新增视图
`<section class="wrap view" id="view-XXX">` + 标签 `<a href="#/xxx" data-view="xxx">` → 改 verify 视图数断言 +1 → 改 README ⌘K 视图数 → `node verify.js`。

### 新增词库词条
LEXICON 加条目 + SEE 加反向互链 → verify 三处数字（词条/药丸/互链）+ README 两处 → 跑 verify。

### 重新生成 og.png
```powershell
& chrome --headless=new --screenshot=... \path\og.png --window-size=1200,630 file:///...\og.svg
```
（本机无 sharp；视觉校验兜底：PIL 统计非背景像素占比。）

## 6. 已知坑（全部真实踩过，别再踩）

1. **展品引号两种写法并存**：s1–s74 单引号 `{id:'s74'}`，s75+ 双引号 `{id:"s75"}`。任何扫描展品的正则必须 `id:['\"](s\d)` 兼容双写法——曾因此误删 s75–s83 映射。
2. **verify 的 DOM mock 是最小假环境**：新引擎若用 canvas `getContext`/`createElement`/`devicePixelRatio`，要同步给 `mkEl()` 补空实现方法，否则探针 EXEC ERROR。这是环境问题不是业务 bug。
3. **六馆 map 只认已有枚举值**，写错触发三条归类断言连爆。
4. **重复事件委托会打架**：加 `data-*` 委托前先 `search_files` 查重（历史上 data-jump 有过双监听）。
5. **时间轴 1890s–2020s 每格必渲染**：空年代显示灰刻度+占位，不能 continue 跳过。
6. **手机卡片**：编号徽标与名称必须同一 flex 行（否则窄屏错行）。
7. **`scene()` 类返回 HTML 片段的函数不能插进 style 属性**（整段泄漏成文字）；`top = previewScreen() + top` 必须写在 top 原赋值之后。
8. **大 patch 易串相邻 section 的 id**：patch 后 read_file 回看现场再跑 verify。
9. 视图显隐类是 `.view.on`（display:block），`.onn` 只有相机 toast 用。
10. 新增顶层 script 块 → verify `scripts.length` 与 `scripts[2]` 索引两处都要改。

## 7. 用户偏好（本项目约定）

- 全程中文交流；交付全量高完整度版本（「多多益善」），设计类附英文 AI 提示词。
- 拟物区要真实造型 + 大预览屏（DAZZ/Hipstamatic 逻辑）。
- 「继续」＝自主挑高价值增强连做数批、实机验证、压缩篇幅汇报，不逐项请示。
- 曾要求「持续扩库直到叫停」——当前 **87 风格为稳定态**，扩库需用户再发话。

## 8. 遗留事项与建议下一步（按优先级）

1. **README 文件清单漏列** `bento-dashboard.html`、`og.svg/og.png`、`_spec_s7x.json`、`add_style.js`（正文未提脚手架）——补表，verify 不会拦，纯文档债。
2. **词库标签徽标 `<b>55</b>` 过时**（index.html L1916，真值 70）：该徽标不在任何守卫内，建议改为运行时由 LEXICON 计数驱动，一劳永逸。
3. `bento-dashboard.html` 无 verify 挂接断言（swiss 有）——补一条存在性+链接断言对称守卫。
4. **建议 git init**：项目无版本控制，单文件 637 KB 改坏不可回滚，是当前最大风险。
5. README 二次开发章节（L92-100）与实际检查单（§3.2）已不同步——可直接把本文 §3.2 检查单搬过去。
6. `_spec_s75/76/77.json` 是脚手架示例，若扩库完成可归档进 references。

## 9. 相关技能（Hermes）

- `creative/ui-style-gallery`——本项目的维护工作流与坑清单（与本文互为冗余，以本文件+README 为准，技能为准流程）。
- `creative/ui-style-atlas` / `large-html-artifacts`（大文件安全写入）/ `creative/popular-web-designs`（风格参照系）。
- 续工/监工 cron 已应用户要求删除（2026-08-26），当前**无任何定时任务**；若重建，批量编辑前先 pause。

---
*接手检查单：① `node verify.js` = ALL PASS ② 浏览器开 index.html 逛 17 个视图 ③ 读本文 §3、§6 再动手。*
