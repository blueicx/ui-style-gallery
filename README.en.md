# UI Style Atlas · Interface Style Atlas Vol.02

🌐 **LIVE demo**: https://blueicx.github.io/ui-style-gallery/ ｜ 📦 GitHub: https://github.com/blueicx/ui-style-gallery
🌍 English ｜ [🈶 中文](README.md)

A "living museum" reference atlas of UI design styles: **100 UI design styles** rendered side by side on one identical component baseline (navigation / buttons / forms / cards), each with a nine-dimension design profile and a copy-ready AI prompt.

Single-file delivery · zero build dependencies · works offline · WCAG AA baseline. Maintainers, read [HANDOFF.md](HANDOFF.md) first.

## File inventory

| File | Description |
|------|-------------|
| `index.html` | The atlas itself (fully self-contained: styles + data + 13 render engines) |
| `verify.js` | Resident regression suite: `node verify.js` (or `npm test`) runs 46 assertions incl. bilingual README count guards; non-zero exit = regression |
| `README.md` | Authoritative feature list (Chinese, for users); `README.en.md` — this file |
| `HANDOFF.md` | Handoff doc (for maintainers): internals, checklists, pitfall list |
| `add_style.js` | Style scaffold: `node add_style.js --file _spec_sXX.json` (transactional — refuses to write if the result wouldn't compile) |
| `_spec_s75/76/77.json` … | Example spec files for the scaffold |
| `bento-demo.html` | Case study: full Bento-style personal homepage |
| `bento-dashboard.html` | Case study: Bento-style SaaS dashboard |
| `swiss-portfolio.html` | Case study: Swiss International Style portfolio site (12-col grid / 0px corners / single signal red) |
| `ui-style-atlas.svg` / `.ico` | Site icons |
| `og.svg` / `og.png` | Social share card 1200×630 (png rendered from svg via headless Chrome) |
| `package.json` | Script aliases (test/verify/add), zero npm dependencies |
| `atlas-v1-backup.html` | Vol.01 archive (30-style edition) |

## Collected styles (100)

**Classics & movements (01–14)**: Swiss International · Neo-Brutalism · Neumorphic Glass · Skeuomorph · GitHub Dark · Terminal Phosphor · Pastel Candy · Newspaper Editorial · Memphis · Bento Grid · Material You · Y2K · Wabi-Sabi · Neo-Brutal Toy

**Retro & tech aesthetics (15–28)**: Retro Arcade · Blueprint Tech · Artisan Craft · Dark Luxury · Dreamcore · Academia Prep · Pro Dark Panel · ASCII Retro-Futurism · Minimal Zen · Cyberpunk · Bauhaus · Constructivism · Acid Graphics · Swiss International (dark)

**Contemporary & cultural (29–36)**: Fluent 2 · Neo-Chinese · Liquid Glass · Vaporwave · Frutiger Aero · Dark Academia · Solarpunk · Art Nouveau

**Big-tech design languages (37–100)**: Apple HIG · IBM Carbon · Ant Design · WeUI · Spotify · Netflix · Linear · Vercel Geist · Stripe · Duolingo · Figma · Notion · Arc · Discord · TikTok · Slack · Airbnb · Douban · Steam · YouTube · Bilibili · Zhihu · Xiaohongshu · X · Reddit · Twitch · Pinterest · LinkedIn · WeChat Read · Pinduoduo · JD.com · Taobao · Weibo · Lark · Xianyu · DingTalk · Safari · Raycast · Claude · v0 · Perplexity · AI-native conversation flow · Conversations-as-UI · Linear dark engineering · Stripe fintech gradient · Japanese editorial magazine · Retro financial terminal · German functionalism · Instagram · NetEase Cloud Music · visionOS spatial glass · Telegram speed blue · Meituan · Alipay · Shopify Polaris · Atlassian Canvas · Salesforce Lightning · Adobe Spectrum · Uber · Revolut dark finance · Claymorphism · Risograph · Pixel Art 8-bit · Cassette Futurism · Webcore

Every exhibit ships with: **number / bilingual name / era / one-line philosophy / best-fit & risky contexts / reference anchors / live component stage / nine-dimension profile / English AI prompt**.

## Feature map

### Browse & learn
- **Live stages** — identical component baseline across styles; side-by-side comparison is instant
- **Nine-dimension profiles** — philosophy / type / palette / spacing / shape / shadow / hierarchy / icons / component specs
- **Lexicon** — 70 design concepts (profile terminology + **specimen language** + **motion patterns**: skeleton shimmer / odometer counters / magnetic hover / parallax layers, etc.): definition + AI keywords + reference cases + cross-links to exhibits and halls
- **Dimension halls ×7** — specimen-wall architecture: Color Hall = site-wide deduplicated color wall (**312 colors**, hex + usage counts, sort by frequency or hue wheel; detail sheet adds **hue-neighbor suggestions** + a **⚖ WCAG contrast checker** — live ratio for any fg/bg, AA/AAA verdicts, protan/deutan/tritan simulation). The other six halls (type/shape/icon/comp/motion/shadow) = **76 specimens** (all 24 motion personalities genuinely play and honor `prefers-reduced-motion`; shadow specimens copy CSS in one click). Click any swatch or specimen → a layer lists every style using it; classification is hand-curated per style
- **Deep links into halls** — `#/color?c=FFD166`, `#/shape?s=pill` open the detail layer directly; lexicon terms carry a "◈ see specimens" link; mashup prompts embed shape/shadow specimen jumps

### Choose
- **3-axis filter** — industry × base tone × mood dropdowns
- **Full-text search** — covers names/descriptions/prompts/profiles; `Esc` clears; **pinyin search** — type `douyin`, `weixin`, `taobao` to hit Chinese styles
- **⌘K command palette** — press `/`: one input reaches 100 styles / 18 views / 70 terms / common actions (theme toggle, mashup, wall, tuner); ↑↓ + Enter
- **Favorites** — persisted in localStorage, "favorites only" filter; plus a management panel (view all, jump, clear)
- **Recent views** — last 8 exhibits this session, one-click chips under the index bar
- **A/B compare** — pick 2–3 exhibits → live mini-stages + six-dimension specs side by side
- **▦ Wall mode** — density toggle: full profiles ⇄ thumbnail wall; click a card to dive back
- **🎴 Guess-the-style** — flashcard quiz on real stage renders, four options; scoring + streaks + a mistake bank (localStorage, 30% chance to re-serve mistakes)
- **🌌 Style galaxy** — force-directed universe from six-dimension genes: similar styles cluster (Swiss sits next to German functionalism; Y2K hugs Vaporwave). Drag-pan · wheel-zoom · hover name-tags · click to jump; color by palette or cluster
- **🎚 Scale generator** (inside Color Hall) — anchor base/accent/dark of any style, interpolate a full 50–950 eleven-step ramp, click to copy
- **✦ Feeling lucky** — random jump; once you have 4+ favorites it picks from those
- **Smart index bar** — active pill auto-centers while scrolling, edge fade hints horizontal scroll

### Use
- **Swatch strip** — 4 signature colors per exhibit, click to copy
- **CSS token export** — one-click `:root{}` block (type/shape comments included)
- **`</>` Starter export** — downloads a style-specific `index.html + :root tokens` template
- **🤖 AI tool deep links** — open v0.dev / ChatGPT with the prompt preloaded
- **✎ Private notes** — one local note per exhibit (auto-saved), appended to MD export
- **⧉ Copy MD profile** — the full nine-dimension profile as Markdown (era/fit/refs/prompt/colors)
- **📲 PWA offline install** — inlined manifest + Service Worker (on https/localhost); "Add to Home Screen" turns it into an offline style handbook
- **⎙ Print single card** — print one exhibit's profile (everything else hides)
- **♿ Palette health badges** — pairwise WCAG contrast over each exhibit's 4 colors → AAA/AA/AA-large/fail rating (hover for ratios)
- **🎚 Token tuner** — live sliders for radius/spacing/shadow on any stage; export the adjusted `:root`
- **🧭 Curated paths** (view `#/paths`) — 8 task-based tours (AI stack / Chinese e-commerce / glass lineage / keyboard-first…), focus mode per stop
- **🔥 Gene heat matrix** (DNA view) — 100×6 overview of all hall classifications; click a cell to jump to the specimen
- **Figma Tokens export** — Tokens Studio JSON, import straight into Figma
- **⤓ W3C Tokens export** — W3C Design Tokens format (`$value/$type/$description` + `$extensions`), Style Dictionary compatible
- **Lexicon filter** — instant client-side filtering of the 70 terms
- **AI prompts** — paste each exhibit's English prompt into Midjourney / Figma AI / v0 / Cursor
- **JSON outlet** — copy the entire dataset for downstream tooling
- **Mashup generator** — fuse two styles' tokens, **dual-stage live preview** (A's scene × B's skeleton side by side), English mashup prompt; lock either side and re-roll; **★ saved mixes** with share links (`?mix=s1+s43` reproduces)

### Reading experience
- **Distance-aware jumps** — targets over 1.5 screens teleport, close ones glide; all entry points share one engine
- **Vertical progress rail** — 100 numbered ticks on the right edge; current exhibit elongates, hover names, click jumps (hidden on narrow screens)
- **Term pill bar** — 70 term chips atop the lexicon; click scrolls + flash-highlights
- **Views** — gallery / lexicon / cases + 7 dimension halls + **🕰 timeline** (130 years of style evolution, decade clusters) + **📱 handheld zone** (100 **interactive mock phones**: in-screen nav really switches tabs, toggles toggle, ▶ actually plays, the pixel-unit D-pad moves the sprite; 5 body shapes × 15+ nav modes × 20 in-screen builders derived per style) + **📷 retro cameras** (7 fully CSS-crafted cameras — rangefinder/SLR/twin-lens/folding/8mm/point-and-shoot — each with a live viewfinder preview filtered by film stock) + DNA / desktop / anti-pattern / galaxy / paths; hash routing auto-detects view containers, new halls need zero config; `J/K` keyboard nav inside the gallery
- **URL state sync** — filters/search/favorites serialize into the link; sharing reproduces the view; `?focus=sXX` deep-links a phone
- **Social sharing** — og:image 1200×630 card (`og.png`) + full og/twitter meta
- **Light / dark themes** — follow system by default, manual choice persists (no first-paint flash)
- **Responsive** — three breakpoint tiers, mobile drawer index (☰)
- **Accessibility** — skip-link, aria-live announcements, focus rings, 44px targets, `prefers-reduced-motion`; modal focus traps (Tab cycling, focus return), specimen rows keyboard-activatable
- **Print friendly** — `Ctrl+P` produces a paper handbook (interactions hidden, color kept, no split cards; halls become chapters, Color Hall prints a 64px swatch grid)
- **Performance** — `content-visibility:auto` skips offscreen exhibits

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `/` | Open ⌘K command palette |
| `?` | Shortcut cheat sheet |
| `J` / `K` | Next / previous exhibit (respects filters, gallery only) |
| `X` | Toggle favorite on current exhibit |
| `Esc` | Close modals / clear search |

## Extending

Data-driven architecture: an exhibit = one `EXHIBITS[]` record + shared render templates. Adding a style:

1. Append to `EXHIBITS` (id/name/en/era/desc/use/avoid/refs/spec/prompt/demoHTML/stageClass/demoClass)
2. Add 4 palette colors to `PAL`, industry/base/mood tags to `META`
3. Add reverse links in the `SEE` lexicon index if relevant

Or just run `node add_style.js --file _spec_sNN.json` — the scaffold inserts everything and re-syncs doc counts. Run `node verify.js` afterwards; it must print ALL PASS.

---
*UI Style Atlas Vol.02 · single-file delivery · data-driven rendering · works offline*
