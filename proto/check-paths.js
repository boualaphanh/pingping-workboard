// Every fixture path a screen names must resolve, or the screen renders ⟦path⟧.
const fs = require("fs"), path = require("path");
global.window = {};
new Function(fs.readFileSync("fixtures/seed.js", "utf8"))();
const SEED = global.window.PP_SEED;
const resolve = (p) => p.split(".").reduce((a, k) => (a == null ? a : a[/^\d+$/.test(k) ? +k : k]), SEED);

let bad = [];
for (const f of fs.readdirSync("screens").filter((n) => n.endsWith(".html"))) {
  const src = fs.readFileSync(path.join("screens", f), "utf8");
  const paths = new Set();
  for (const m of src.matchAll(/data-(?:val|avatar|nm|nm-initial)="([\w.]+)"/g)) paths.add(m[1]);
  for (const m of src.matchAll(/data-i18n-args="([^"]+)"/g)) {
    for (const pair of m[1].split(";")) {
      const v = pair.split(":").slice(1).join(":").trim();
      if (v.startsWith("@#")) paths.add(v.slice(2));
      else if (v.startsWith("@") || v.startsWith("~") || v.startsWith("#")) paths.add(v.slice(1));
    }
  }
  for (const p of paths) if (resolve(p) === undefined) bad.push(`${f}: ${p}`);
}
if (bad.length) { console.log("FAIL  fixture paths that do not resolve:"); bad.forEach((b) => console.log("      " + b)); process.exit(1); }
console.log("ok    every fixture path a screen names resolves");
