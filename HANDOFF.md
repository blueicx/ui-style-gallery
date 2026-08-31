# UI 风格图鉴 · 交接文档（HANDOFF）

> 交接日期：2026-08-31（批次 E 终版）｜ 仓库根：`E:\新建文件夹\ui-style-gallery`
> 一句话：单文件「活体博物馆」UI 风格图鉴——**100 种风格**在同一组件基线上横向对比，配 70 词专业词库、7 座维度分馆、18 个视图与 9 大工具区。
> 当前状态：**verify.js 全部断言 ALL PASS**（2026-08-31 批次 D 完成后实跑）；**已上传公开仓库** https://github.com/blueicx/ui-style-gallery （分支 main，2026-09-01 推送；本地 origin 已配置）；**GitHub Pages 已上线** https://blueicx.github.io/ui-style-gallery/ （HTTP 200 实测）；英文手册 `README.en.md` 与双语计数守卫同批落地。

---

## 1. 五分钟上手

```powershell
cd E:\新建文件夹\ui-style-gallery
node verify.js                 # 回归套件，必须输出 ALL PASS（退出码 0）
npm test                       # 等价别名（package.json）
start index.html               # 浏览器直接打开即可，无构建、无依赖、离线可用
```

- 运行时只需 **Node.js**（跑 verify.js 和脚手架），无 npm 依赖、无打包器（package.json 里 scripts 只是别名，`private:true`，永不需要 npm install）。
- 页面数据全部内联在 `index.html` 里（数据驱动渲染），改数据＝改 JS 常量。
- **铁律：任何改动后必须 `node verify.js` 至 ALL PASS 才算完成。**
- 版本控制：改坏用 `git checkout -- <file>` 回滚；提交前 verify 必须全绿。

## 2. 文件清单

| 文件 | 说明 |
|------|------|
| `index.html` | 主文件（~725 KB），全部自包含：样式 + 数据 + 13+ 引擎 IIFE |
| `verify.js` | 回归断言 + README 计数守卫；DOM 是「最小假环境」mock（见 §6 坑） |
| `README.md` | 权威功能清单，面向使用者；**11 处计数被 verify 守卫**，扩库脚手架会自动同步其中大部分 |
| `add_style.js` | 扩风格脚手架：`node add_style.js --file _spec_sXX.json`（事务式，编译不过不落盘；自动插 EXHIBITS/PAL/META/GENE/六馆映射/皮肤 CSS/README 计数） |
| `_spec_s88…s100.json` | 批次 D 的 13 份风格规格（s75-s87 同样在库，可当模板） |
| `_feat/` | 批次 C 功能片段与幂等安装器（feat.css/views.html/feat.js/install.js + probe_halls.js 探针）；**已安装进 index.html，保留作源码存档** |
| `bento-demo.html` / `bento-dashboard.html` / `swiss-portfolio.html` | 实战案例（verify 有挂接断言） |
| `og.svg` / `og.png` | 社交分享卡 1200×630（png 用无头 Chrome 截 svg 生成） |
| `ui-style-atlas.svg` / `.ico` | 站点图标 |
| `package.json` / `.gitattributes` | 工程元数据（无依赖）；`.gitattributes` 强制 LF |
| `atlas-v1-backup.html` | Vol.01 存档（30 风格版），勿动 |

## 3. index.html 内部结构（必读）

### 3.1 五个顶层 `<script>` 块（顺序敏感）

| # | 块 | 作用 |
|---|----|------|
| 0 | PWA | manifest data-URL + Service Worker blob；仅 https/localhost 注册，file:// 静默跳过 |
| 1 | style-data | `EXHIBITS` / `PAL` / `META` / `GENE` / `LEXICON` / `SEE` / `PINYIN` / `HAY` 等数据常量 |
| 2 | **main-engine** | 渲染引擎 + 路由 + ⌘K + 分馆 + 混搭……verify 的探针就跑在这个块上 |
| 3 | err-sentinel | 错误哨兵 |
| 4 | tail-engines | 各新区 IIFE 引擎（见 3.3）+ 批次 C 注入的 a11y/调律台/路径/热力图/`badgesInit` |

> ⚠️ verify.js 有 `scripts.length !== 5` 精确守卫，且主引擎按**位置索引** `scripts[2]` 取。新增顶层 script 块必须同时改这两处。批次 C 的功能全部注入既有块内，没有加新块。

### 3.2 数据层（风格 = 一条记录 × 多张表）

- `EXHIBITS[]`：100 条展台档案（id/name/en/era/desc/use/avoid/refs/spec/prompt/demoHTML）。
- `PAL`：`{s1:['#..','#..','#..','#..']}` 四色代表色，取 accent 用 `PAL[id][2]`。
- `META`：`['sXX','行业','light|dark','情绪'…]` 三维筛标签。
- `GENE`：`{sXX:['结构基因','导航模式'…]}` 手机区真机形态派生表（**注意条目行尾可能带 `},`，插入锚点必须是数组闭合 `]`**，add_style.js 已修）。
- `LEXICON`：词库 70 词条（分组 items）；`SEE`：词条→展台反向互链。
- `HALLS[7]` 归类映射 map（shape/type/icon/comp/motion/shadow 六馆逐风格人工策展 + 色彩馆去重）。**合法枚举值用 `node _feat/probe_halls.js` 现查**（动效馆无 `spin`，旋转用 `orbit`）。

**新增一个风格的标准动作＝写 spec JSON + 跑 add_style.js**（12 处编辑全自动：EXHIBITS/PAL/META/GENE/六馆/皮肤 CSS/README 计数/…），之后 `node verify.js` 终验。手工补漏只在脚手架 FAIL 时需要。

### 3.3 引擎清单

tail 块 13 个 IIFE：`cmdkInit`(⌘K面板) · `wccInit`(WCAG对比度检查器) · `rampInit`(色阶派生器) · `quizInit`(闪卡测验) · `galaxyInit`(星系力导向 canvas) · `noteInit`(私人笔记) · `timelineInit`(年代时间轴) · `mobileInit`(手机真机区) · `camsInit`(复古相机区，**内部导出 `window.__camTotal`**) · `dnaInit`(风格DNA雷达) · `pgInit`(分页/速览) · `deskInit`(桌面组件区) · `antiInit`(反例区)。

批次 C 注入（同在第 4 块尾部）：`a11yInit`(展台 ♿ 色板体检徽章) · `tunerInit`(🎚 Token 调律台，`window.__tuner`) · `pathsInit`(🧭 策展路径) · `heatInit`(🔥 基因热力矩阵) · `badgesInit`(顶栏三徽标运行时驱动)。

### 3.4 视图、徽标与路由

18 个 `data-view` 标签 = gallery / lexicon / case / color / shape / type / icon / comp / motion / shadow / timeline / mobile / cams / dna / desktop / antipattern / galaxy / **paths**。
路由按 `id="view-${key}"` 容器存在性自动识别，**新增视图零配置**，但要同步 verify「18 个视图标签」断言与 README ⌘K 句式计数。
**顶栏徽标已运行时驱动**：`badge-gallery`←EXHIBITS.length、`badge-lexicon`←LEXICON 计数、`badge-cams`←`window.__camTotal`——**不要再手写死数字**。
深链：`#/color?c=FFD166`、`#/shape?s=pill`、`#/paths`、手机区 `?focus=sXX`、混搭 `?mix=s1+s43`。

## 4. verify.js 断言地图

- 5 块守卫 + 编译检查（改脚本块结构先动这里）。
- 功能/结构断言逐条，**数字是真值快照**——视图标签 18、词库 70、标本 76、Figma tokens 94……改之前先看断言现值，别按记忆覆盖。展品 id 正则已扩为 `s\d{1,3}`（支持 s100+）。
- README 计数守卫（11 处 doc 数字 = 探针真值；正则因 README 措辞改变不命中会报「正则未命中」——保持句式：`(N) 种设计风格`、`收录风格（N）`、`**N 色**`、`N 个设计概念`、`N 个可视化类型标本`、`右缘 N 个序号刻度`、`顶部 N 枚术语药丸`、`手机专属区…N 台`、`直达 N 风格 / N 视图 / N 词条`）。
- 另有 bento-dashboard / swiss-portfolio / HANDOFF 存在性断言。

## 5. 常用开发动作

### 新增展台风格（推荐路径）
```powershell
# 1. 抄 _spec_s90.json 写 _spec_s101.json（注意 maps 值必须是 §3.2 合法枚举）
node add_style.js --file _spec_s101.json
node verify.js
```
脚手架防重复（兼容单/双引号 id）、防 BOM、事务式（编译不过不落盘）。

### 新增视图
`<section class="wrap view" id="view-XXX">` + 标签 `<a href="#/xxx" data-view="xxx">` → verify 视图数断言 +1 → README ⌘K 视图数 → 跑 verify。

### 实机渲染验证（无头 Chrome）
```powershell
Start-Process -FilePath 'C:\Program Files\Google\Chrome\Application\chrome.exe' -ArgumentList '--headless=new','--disable-gpu','--enable-logging=stderr','--virtual-time-budget=9000','--dump-dom','file:///E:/新建文件夹/ui-style-gallery/index.html' -Wait -NoNewWindow -RedirectStandardOutput _dom.txt -RedirectStandardError _err.txt
# 探针统计后务必删掉 _dom.txt/_err.txt，别提交进 git
```
批次 C 交付就是这么验的（a11y-chip/hm-row/徽标实值 + `_err.txt` 搜 `Uncaught|ReferenceError`）。

### 重新生成 og.png
无头 Chrome 截 og.svg（`--window-size=1200,630`）；本机无 sharp。扩库后 og 图如需更新再截。

## 6. 已知坑（全部真实踩过，别再踩）

1. **展品引号两种写法并存**：s1–s74 单引号，s75+ 双引号。扫描展品的正则一律 `id:['"](s\d+)` 兼容双写法。
2. **verify 的 DOM mock 是最小假环境**：新引擎用 canvas `getContext`/`createElement`/`devicePixelRatio`，要给 `mkEl()` 补空实现，否则探针 EXEC ERROR。
3. **六馆 map 只认已有枚举值**，写错三条归类断言连爆；现查用 `node _feat/probe_halls.js`。
4. **重复事件委托会打架**：加 `data-*` 委托前 `search_files` 查重。
5. **时间轴 1890s–2020s 每格必渲染**，空年代显示灰刻度+占位，不能 continue。
6. **手机卡片**：编号徽标与名称同一 flex 行，防窄屏错行。
7. **`scene()` 类返回 HTML 的函数不能插进 style 属性**；`top = previewScreen() + top` 必须在 top 原赋值之后。
8. **大 patch 易串相邻 section 的 id**：patch 后 read_file 回看现场再跑 verify。
9. 视图显隐类是 `.view.on`，`.onn` 只有相机 toast 用。
10. 新增顶层 script 块 → verify `scripts.length` 与 `scripts[2]` 两处都要改。
11. **PowerShell `Set-Content -Encoding UTF8` 写 BOM**：JSON.parse 直接崩；add_style.js 已做 BOM 剥离，自己写解析器时记得 `.replace(/^\uFEFF/,'')`。
12. **终端工具会误判 `&` 调用符**：启动 GUI/外部程序一律 `Start-Process -Wait -NoNewWindow`。
13. **中文路径 + Select-String 中文正则**经常 exit 1 假阴性——用 `search_files` 或 Node 探针替代。
14. **并发编辑者**：本仓库曾有外部进程改动（README 徽标 17→18 自动补齐事件）；patch 遇 `_warning: modified since you last read` 先重读再改。

## 7. 用户偏好（本项目约定）

- 全程中文交流；交付全量高完整度版本（「多多益善」），设计类附英文 AI 提示词（spec.prompt 字段）。
- 拟物区要真实造型 + 大预览屏（DAZZ/Hipstamatic 逻辑）。
- 「继续」＝自主挑高价值增强连做数批、实机验证、压缩篇幅汇报，不逐项请示。
- 扩库节奏：批次 D 完成 87→100（整数关口）。再扩（s101+）需用户发话。

## 8. 遗留事项与建议下一步（按优先级）

1. ~~og 分享图~~ 已重截为 100 风格版（2026-09-01，含 LIVE 地址行）。
2. `_feat/` 已完成使命，feat.js 与主文件存在双源——如需改功能，改主文件即可，`_feat/` 只作存档（README/HANDOFF 已注明）。
3. 英文站全量 i18n、在线取色（需服务端，违背无依赖铁律）——长期方向，暂缓；README.en.md 已覆盖手册层英文。
4. ~~GitHub Pages 发布~~ 已上线 https://blueicx.github.io/ui-style-gallery/ （REST 开启，push 自动重建；PWA SW 在 https 下注册）。
5. 展品类风格（s90-s93 设计系统类）的 refs 均为官网域名，公开仓库注意时效性。

## 9. 相关技能（Hermes）

- `creative/ui-style-gallery`——本项目维护工作流与坑清单（以本文件 + README 为准，技能为准流程）。
- `creative/ui-style-atlas` / `large-html-artifacts`（大文件安全写入）/ `creative/popular-web-designs`（风格参照系）。
- 续工/监工 cron 已应用户要求删除（2026-08-26），当前**无任何定时任务**；若重建，批量编辑前先 pause。

---
*接手检查单：① `node verify.js` = ALL PASS ② 浏览器开 index.html 逛 18 个视图 ③ 读本文 §3、§6 再动手。*
