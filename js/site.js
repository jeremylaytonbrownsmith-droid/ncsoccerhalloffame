/* =========================================================
   Shared header + footer injection and nav behavior.
   Each page sets <body data-page="..."> and <body data-root="...">
   so links resolve from both the site root and the /pages folder.
   ========================================================= */
(function () {
  var body = document.body;
  var page = body.getAttribute('data-page') || '';
  var root = body.getAttribute('data-root') || ''; // '' at root, '../' inside /pages

  var nav = [
    { id: 'home',      label: 'Home',                            href: root + 'index.html' },
    { id: 'inductees', label: 'Inductees',                       href: root + 'pages/inductees.html' },
    { id: 'champions', label: 'National Champions Hall of Honor', href: root + 'pages/champions.html' },
    { id: 'about',     label: 'About the HOF',                   href: root + 'pages/about.html',
      children: [
        { label: 'Our Mission & History', href: root + 'pages/about.html' },
        { label: 'Board & Committee',     href: root + 'pages/about.html#board' },
      ]
    },
    { id: 'pictures',  label: 'NCSHOF Pictures', href: root + 'pages/pictures.html' },
    { id: 'submit',    label: 'Submit a Candidate', href: root + 'pages/submit.html' },
  ];

  // ---- Header ----
  var links = nav.map(function (item) {
    var active = item.id === page ? ' class="active"' : '';
    if (item.children) {
      var sub = item.children.map(function (c) {
        return '<li><a href="' + c.href + '">' + c.label + '</a></li>';
      }).join('');
      return '<li class="has-dropdown"><a href="' + item.href + '"' + active + '>' +
             item.label + '</a><ul class="dropdown">' + sub + '</ul></li>';
    }
    return '<li><a href="' + item.href + '"' + active + '>' + item.label + '</a></li>';
  }).join('');

  var crest =
    '<svg class="crest" viewBox="0 0 40 40" aria-hidden="true">' +
    '<circle cx="20" cy="20" r="19" fill="#D42426"/>' +
    '<circle cx="20" cy="20" r="19" fill="none" stroke="#FFD700" stroke-width="2"/>' +
    '<polygon fill="#fff" points="20,8 22.6,15.6 30.5,15.6 24.1,20.4 26.5,28 20,23.3 13.5,28 15.9,20.4 9.5,15.6 17.4,15.6"/>' +
    '</svg>';

  var header =
    '<header class="site-header"><nav class="nav-inner" aria-label="Primary">' +
      '<a class="brand" href="' + root + 'index.html">' + crest + 'NC Soccer Hall of Fame</a>' +
      '<button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false">&#9776;</button>' +
      '<ul class="nav-links">' + links + '</ul>' +
    '</nav></header>';

  // ---- Footer ----
  var partners = [
    { img: 'https://static.wixstatic.com/media/b61df5_fdb07a459a29429a9f559803307b8ff6~mv2.png', href: '' },
    { img: 'https://static.wixstatic.com/media/b61df5_a761ec36c86346d88ff9290cdad08bcf~mv2.png', href: 'https://www.northcarolinafc.com/' },
    { img: 'https://static.wixstatic.com/media/b61df5_74ed4cb049d74de28faf66a911b9c020~mv2.png', href: 'https://www.ncsoccer.org/' },
    { img: 'https://static.wixstatic.com/media/b61df5_60c4d8bcd8cc464e8518925313dc5317~mv2.jpg', href: 'https://www.soccer.com/' },
    { img: 'https://static.wixstatic.com/media/b61df5_9afd43b2ca2c48b6ad37c0fc40031d3f~mv2.png', href: 'https://www.ncsra.org/' },
    { img: 'https://static.wixstatic.com/media/b61df5_41dca55e78d54abcaebd86d20d195f57~mv2.png', href: 'https://www.nccourage.com/' },
    { img: 'https://static.wixstatic.com/media/b61df5_e7facbbd93524db89f00e63a8eb42e8b~mv2.png', href: 'https://www.ncsca.org/' },
  ];
  var partnerSlots = partners.map(function (p) {
    var img = '<img src="' + p.img + '" alt="HOF supporter" loading="lazy">';
    return p.href
      ? '<a href="' + p.href + '" target="_blank" rel="noopener">' + img + '</a>'
      : img;
  }).join('');
  var footer =
    '<footer class="site-footer">' +
      '<div class="footer-title">HOF Supporters &amp; Partners</div>' +
      '<div class="partners">' + partnerSlots + '</div>' +
      '<div class="footer-legal">' +
        '&copy; ' + new Date().getFullYear() + ' North Carolina Soccer Hall of Fame. All Rights Reserved.<br>' +
        'Promoting and supporting the game of soccer in the State of North Carolina.' +
      '</div>' +
    '</footer>';

  // ---- Inject ----
  body.insertAdjacentHTML('afterbegin', header);
  body.insertAdjacentHTML('beforeend', footer);

  // ---- Mobile toggle ----
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-links');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }
})();
