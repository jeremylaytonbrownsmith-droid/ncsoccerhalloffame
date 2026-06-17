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
        { label: 'Contact Us',            href: root + 'pages/contact.html' },
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

  var igSvg =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="2" y="2" width="20" height="20" rx="5"/>' +
    '<circle cx="12" cy="12" r="4"/>' +
    '<circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>';
  var igLink = 'https://www.ncsoccerhalloffame.org/ncshof-social';

  var header =
    '<header class="site-header"><nav class="nav-inner" aria-label="Primary">' +
      '<a class="brand" href="' + root + 'index.html">' + crest + 'NC Soccer Hall of Fame</a>' +
      '<button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false">&#9776;</button>' +
      '<ul class="nav-links">' + links + '</ul>' +
      '<a class="nav-ig" href="' + igLink + '" target="_blank" rel="noopener" aria-label="Instagram">' + igSvg + '</a>' +
    '</nav></header>';

  // ---- Footer ----
  var partners = [
    { img: 'https://static.wixstatic.com/media/b61df5_fdb07a459a29429a9f559803307b8ff6~mv2.png', href: '' },
    { img: 'https://static.wixstatic.com/media/b61df5_a761ec36c86346d88ff9290cdad08bcf~mv2.png', href: 'https://www.northcarolinafc.com/' },
    { img: 'https://static.wixstatic.com/media/b61df5_74ed4cb049d74de28faf66a911b9c020~mv2.png', href: 'https://www.ncsoccer.org/' },
    { img: 'https://static.wixstatic.com/media/b61df5_d3785870bb324973b0bfaca656742bcf~mv2.png', href: 'https://www.soccer.com/' },
    { img: 'https://static.wixstatic.com/media/b61df5_9afd43b2ca2c48b6ad37c0fc40031d3f~mv2.png', href: 'https://www.ncsra.org/' },
    { img: 'https://static.wixstatic.com/media/b61df5_41dca55e78d54abcaebd86d20d195f57~mv2.png', href: 'https://www.nccourage.com/' },
    { img: 'https://static.wixstatic.com/media/b61df5_e7facbbd93524db89f00e63a8eb42e8b~mv2.png', href: 'https://www.ncsca.org/' },
  ];
  function sponsorBlock(p) {
    var img = '<img src="' + p.img + '" alt="HOF recognition game sponsor" loading="lazy">';
    var media = p.href
      ? '<a href="' + p.href + '" target="_blank" rel="noopener">' + img + '</a>'
      : img;
    return '<div class="footer-sponsor">' + media +
           '<span>Sponsor of the HOF Recognition Game</span></div>';
  }

  var rowLogos = partners.slice(1, 6).map(function (p) {
    var img = '<img src="' + p.img + '" alt="HOF partner" loading="lazy">';
    return p.href
      ? '<a href="' + p.href + '" target="_blank" rel="noopener">' + img + '</a>'
      : img;
  }).join('');

  var footer =
    '<footer class="site-footer">' +
      '<div class="footer-main">' +
        sponsorBlock(partners[0]) +
        '<div class="footer-center">' +
          '<div class="footer-title">HOF Supporters &amp; Partners</div>' +
          '<a class="footer-ig" href="' + igLink + '" target="_blank" rel="noopener" aria-label="Instagram">' + igSvg + '</a>' +
          '<div class="footer-legal">' +
            '&copy; ' + new Date().getFullYear() + ' North Carolina Soccer Hall of Fame. All Rights Reserved.<br>' +
            'Sponsor of the HOF Dinner reception.' +
          '</div>' +
        '</div>' +
        sponsorBlock(partners[6]) +
      '</div>' +
      '<div class="partners">' + rowLogos + '</div>' +
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

  // ---- Back-to-top button ----
  var toTop = document.createElement('button');
  toTop.className = 'to-top';
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.innerHTML = '&#8593;';
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  body.appendChild(toTop);

  // ---- Header elevation + back-to-top visibility on scroll ----
  var header = document.querySelector('.site-header');
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', y > 24);
    toTop.classList.toggle('show', y > 480);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Scroll reveal -------------------------------------------------
  // Auto-tag a curated set of static content blocks (pages that already
  // animate their own cards on load are intentionally excluded).
  var reduce = window.matchMedia &&
               window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var autoSelectors = [
    '.info-card', '.board-card', '.officer-card', '.dl-card',
    '.deadline-banner', '.gallery-card', '.form-card',
    '.section-heading', '.about-section'
  ].join(',');
  document.querySelectorAll(autoSelectors).forEach(function (el) {
    if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', '');
  });

  var targets = [].slice.call(document.querySelectorAll('[data-reveal]'));

  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    // Gentle stagger: cascade siblings that share a parent.
    var seen = [];
    targets.forEach(function (el) {
      var p = el.parentNode;
      var idx = seen.indexOf(p);
      var count;
      if (idx === -1) { seen.push(p); count = 0; p.__revealCount = 1; }
      else { count = p.__revealCount++; }
      el.style.transitionDelay = Math.min(count * 90, 360) + 'ms';
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(function (el) { io.observe(el); });
  }

  // ---- Count-up stats ------------------------------------------------
  var counters = [].slice.call(document.querySelectorAll('[data-count]'));
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toString();
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  // ---- Subtle hero parallax -----------------------------------------
  var para = [].slice.call(document.querySelectorAll('[data-parallax]'));
  if (para.length && !reduce) {
    var ticking = false;
    var applyParallax = function () {
      para.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.12;
        var offset = (r.top + r.height / 2 - window.innerHeight / 2) * -speed;
        el.style.transform = 'scale(1.15) translateY(' + offset.toFixed(1) + 'px)';
      });
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(applyParallax); ticking = true; }
    }, { passive: true });
    applyParallax();
  }

  // ---- Carousel: arrows + drag-to-scroll for .gallery rows ----------
  document.querySelectorAll('.gallery').forEach(function (g) {
    var track = g.querySelector('.gallery-track');
    if (!track) return;

    var prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'gallery-arrow prev';
    prev.setAttribute('aria-label', 'Scroll left');
    prev.innerHTML = '&#8249;';
    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'gallery-arrow next';
    next.setAttribute('aria-label', 'Scroll right');
    next.innerHTML = '&#8250;';
    g.appendChild(prev);
    g.appendChild(next);

    function amount() { return Math.max(track.clientWidth * 0.8, 320); }
    prev.addEventListener('click', function () { track.scrollBy({ left: -amount(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { track.scrollBy({ left: amount(), behavior: 'smooth' }); });

    function updateArrows() {
      var maxScroll = track.scrollWidth - track.clientWidth - 2;
      prev.classList.toggle('hidden', track.scrollLeft <= 2);
      next.classList.toggle('hidden', track.scrollLeft >= maxScroll);
    }
    track.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    updateArrows();

    // Drag / swipe to scroll
    var down = false, startX = 0, startLeft = 0, moved = false;
    track.addEventListener('pointerdown', function (e) {
      down = true; moved = false;
      startX = e.clientX; startLeft = track.scrollLeft;
      track.classList.add('dragging');
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', function () {
      down = false;
      track.classList.remove('dragging');
    });
    // Don't trigger a link click at the end of a drag
    track.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  });
})();
