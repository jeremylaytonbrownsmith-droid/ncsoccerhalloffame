/* =========================================================================
   build-seo.js — generates one crawlable HTML page per Hall of Fame inductee
   from js/inductees-data.js, plus sitemap.xml, robots.txt, and a static
   crawlable inductee index injected into inductees/index.html.

   Run from the repo root:  node tools/build-seo.js
   Re-run any time the inductee data changes.
   ========================================================================= */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://ncsoccerhalloffame.org';

// ---- Load inductee data (plain script, not a module) --------------------
const dataSrc = fs.readFileSync(path.join(ROOT, 'js/inductees-data.js'), 'utf8');
eval(dataSrc + '\nglobal.__inductees = inductees;');
const inductees = global.__inductees;

// ---- Helpers ------------------------------------------------------------
function slugify(s) {
  return s.normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function escAttr(s) {
  return esc(s).replace(/"/g, '&quot;');
}
function metaDesc(s) {
  s = String(s).replace(/\s+/g, ' ').trim();
  return s.length > 158 ? s.slice(0, 155).replace(/\s+\S*$/, '') + '…' : s;
}

// ---- Assign unique slugs ------------------------------------------------
const used = {};
inductees.forEach(p => {
  let base = slugify(p.name);
  let slug = base;
  if (used[slug]) slug = base + '-' + p.year;
  let n = 2; while (used[slug]) slug = base + '-' + p.year + '-' + (n++);
  used[slug] = true;
  p._slug = slug;
  p._url = SITE + '/inductees/' + slug + '/';
});

// ---- Per-inductee page template -----------------------------------------
function pageHtml(p) {
  const desc = metaDesc(p.desc || (p.bio && p.bio[0]) || (p.name + ' — North Carolina Soccer Hall of Fame inductee.'));
  const bodyParas = (p.bio && p.bio.length ? p.bio : [p.desc || ''])
    .filter(Boolean).map(t => '<p>' + esc(t) + '</p>').join('\n');
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: p.name,
    image: p.img,
    description: metaDesc(p.desc || (p.bio && p.bio[0]) || p.name),
    award: 'North Carolina Soccer Hall of Fame — Class of ' + p.year,
    url: p._url
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="icon" type="image/gif" href="https://static.wixstatic.com/media/b61df5_2d78aa055ed941998b13bb85c7b266a7~mv2.gif">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escAttr(p.name)} | NC Soccer Hall of Fame (Class of ${p.year})</title>
<meta name="description" content="${escAttr(desc)}">
<link rel="canonical" href="${p._url}">
<meta property="og:type" content="profile">
<meta property="og:title" content="${escAttr(p.name)} — NC Soccer Hall of Fame">
<meta property="og:description" content="${escAttr(desc)}">
<meta property="og:image" content="${escAttr(p.img)}">
<meta property="og:url" content="${p._url}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/styles.css">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--navy:#0a1628;--deep:#0d1f3c;--gold:#c5a55a;--gold-d:#a68b3c;--cream:#f6f1e7;--white:#fff;--g200:#e8e4db;--g600:#6b6860}
html,body{margin:0;padding:0;width:100%;overflow-x:hidden}
body{font-family:'Crimson Pro',Georgia,serif;background:var(--cream);color:var(--navy);-webkit-font-smoothing:antialiased}
@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
.bio-hero{background:linear-gradient(160deg,var(--navy),var(--deep));padding:3rem 1rem 0;position:relative;overflow:hidden}
.bio-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 400px 200px at 70% 100%,rgba(197,165,90,.1),transparent);pointer-events:none}
.bio-hero-inner{max-width:1100px;margin:0 auto;display:flex;gap:2rem;align-items:flex-end;position:relative}
.bio-hero-photo{width:240px;min-width:240px;border-radius:8px 8px 0 0;overflow:hidden;box-shadow:0 -4px 20px rgba(0,0,0,.3);position:relative;z-index:2;margin-bottom:-3rem}
.bio-hero-photo img{width:100%;display:block}
.bio-hero-text{padding-bottom:1.5rem;animation:fadeUp .5s ease both;min-width:0}
.bio-class-tag{font-family:'Oswald',sans-serif;font-size:.7rem;font-weight:400;text-transform:uppercase;letter-spacing:.18em;color:var(--gold);margin-bottom:.3rem}
.bio-hero-text h1{font-family:'Oswald',sans-serif;font-size:clamp(1.4rem,4vw,2.4rem);font-weight:700;color:var(--white);line-height:1.1;margin-bottom:.4rem}
.short-desc{font-family:'Crimson Pro',serif;font-style:italic;font-weight:300;color:rgba(255,255,255,.55);font-size:.9rem;line-height:1.5;max-width:500px}
.container{max-width:1100px;margin:0 auto;padding:0 1rem}
.back-btn{display:inline-flex;align-items:center;gap:.5rem;font-family:'Oswald',sans-serif;font-size:.85rem;text-transform:uppercase;letter-spacing:.1em;color:var(--gold-d);text-decoration:none;padding:1rem .5rem .8rem;transition:gap .25s}
.back-btn:hover{gap:.7rem}
.back-btn svg{width:20px;height:20px;fill:currentColor}
.bio-body{max-width:1100px;margin:0 auto;padding:3.5rem 1rem 2.5rem}
.bio-body-text{max-width:750px}
.bio-body-text p{font-size:.95rem;line-height:1.8;color:var(--g600);margin-bottom:1rem}
@media(max-width:768px){
.bio-hero{padding:1.2rem 1rem 0}
.bio-hero-inner{flex-direction:column;align-items:center;text-align:center}
.bio-hero-photo{width:150px;min-width:150px;margin-bottom:-2rem}
.bio-body{padding:2.8rem 1rem 1.5rem}
}
</style>
</head>
<body data-page="inductees">

<div class="bio-hero">
<div class="bio-hero-inner">
<div class="bio-hero-photo"><img src="${escAttr(p.img)}" alt="${escAttr(p.name)}, NC Soccer Hall of Fame Class of ${p.year}"></div>
<div class="bio-hero-text">
<div class="bio-class-tag">Class of ${p.year}</div>
<h1>${esc(p.name)}</h1>
<p class="short-desc">${esc(p.desc || '')}</p>
</div>
</div>
</div>

<div class="container">
<a class="back-btn" href="/inductees/">
<svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
All Inductees
</a>
</div>

<article class="bio-body">
<div class="bio-body-text">
${bodyParas}
</div>
</article>

<script src="/js/site.js"></script>
</body>
</html>
`;
}

// ---- Write per-inductee pages -------------------------------------------
let written = 0;
inductees.forEach(p => {
  const dir = path.join(ROOT, 'inductees', p._slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), pageHtml(p));
  written++;
});

// ---- Build crawlable index, grouped by year (newest first) --------------
const byYear = {};
inductees.forEach(p => { (byYear[p.year] = byYear[p.year] || []).push(p); });
const years = Object.keys(byYear).sort((a, b) => b - a);
let indexHtml = '<section class="seo-index" aria-label="All inductees">\n' +
  '<h2>Browse Every Inductee</h2>\n' +
  '<p class="seo-sub">All ' + inductees.length + ' members of the North Carolina Soccer Hall of Fame</p>\n';
years.forEach(yr => {
  indexHtml += '<div class="seo-year"><h3>Class of ' + yr + '</h3><ul>\n';
  byYear[yr].forEach(p => {
    indexHtml += '<li><a href="/inductees/' + p._slug + '/">' + esc(p.name) + '</a></li>\n';
  });
  indexHtml += '</ul></div>\n';
});
indexHtml += '</section>';

const idxPath = path.join(ROOT, 'inductees', 'index.html');
let idx = fs.readFileSync(idxPath, 'utf8');
idx = idx.replace(
  /<!-- SEO_INDEX_START -->[\s\S]*?<!-- SEO_INDEX_END -->/,
  '<!-- SEO_INDEX_START -->\n' + indexHtml + '\n<!-- SEO_INDEX_END -->'
);
fs.writeFileSync(idxPath, idx);

// ---- Sitemap ------------------------------------------------------------
const staticPages = ['/', '/inductees/', '/champions/', '/about/', '/contact/', '/pictures/', '/submit/'];
const today = new Date().toISOString().slice(0, 10);
let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
staticPages.forEach(u => {
  sitemap += '  <url><loc>' + SITE + u + '</loc><lastmod>' + today +
    '</lastmod><priority>' + (u === '/' ? '1.0' : '0.8') + '</priority></url>\n';
});
inductees.forEach(p => {
  sitemap += '  <url><loc>' + p._url + '</loc><lastmod>' + today +
    '</lastmod><priority>0.6</priority></url>\n';
});
sitemap += '</urlset>\n';
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);

// ---- robots.txt ---------------------------------------------------------
fs.writeFileSync(path.join(ROOT, 'robots.txt'),
  'User-agent: *\nAllow: /\n\nSitemap: ' + SITE + '/sitemap.xml\n');

console.log('Generated ' + written + ' inductee pages.');
console.log('Sitemap URLs: ' + (staticPages.length + inductees.length));
console.log('robots.txt + crawlable index written.');
