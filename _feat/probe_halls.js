const h = require('fs').readFileSync(__dirname + '/../index.html', 'utf8');
const s = h.indexOf('const HALLS');
const e = h.indexOf('\n];', s);
const seg = h.slice(s, e);
const keys = [...seg.matchAll(/key:'(\w+)'/g)];
keys.forEach((m, i) => {
  const from = m.index;
  const to = i + 1 < keys.length ? keys[i + 1].index : seg.length;
  const win = seg.slice(from, to);
  const vals = [...new Set([...win.matchAll(/s\d+:\s*'([a-z0-9]+)'/g)].map(x => x[1]))];
  console.log(m[1] + ' (' + vals.length + '): ' + vals.join(', '));
});
