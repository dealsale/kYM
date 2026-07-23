(function () {
  'use strict';

  var ICON = {
    branding: '<circle cx="12" cy="12" r="9"/><path d="M8 12a4 4 0 0 1 8 0M12 3v3M12 18v3"/>',
    social: '<path d="M4 4h16v12H5.2L4 19V4z"/><path d="M8 9h8M8 12h5"/>',
    web: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18M7 14h4"/>'
  };

  function iconSpan(paths) {
    var span = document.createElement('span');
    span.style.display = 'flex';
    span.style.alignItems = 'center';
    span.style.justifyContent = 'center';
    span.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
    return span;
  }

  var DATA = {
    marquee: ['Branding', 'Redes Sociales', 'Desarrollo Web', 'Estrategia Digital', 'Contenido', 'SEO', 'Campañas', 'Diseño UX'],
    services: [
      {
        title: 'Branding', grad: 'linear-gradient(135deg,#1E3A8A,#6366F1)', icon: ICON.branding,
        desc: 'Construimos identidades memorables: logotipo, sistema visual y voz de marca coherente en cada punto de contacto.',
        points: ['Identidad visual completa', 'Manual de marca', 'Naming y tono de voz']
      },
      {
        title: 'Manejo de Redes Sociales', grad: 'linear-gradient(135deg,#6366F1,#FF6B6B)', icon: ICON.social,
        desc: 'Contenido que conecta y comunidades que crecen. Planificamos, creamos y medimos cada publicación.',
        points: ['Calendario de contenido', 'Diseño y copywriting', 'Reportes de métricas']
      },
      {
        title: 'Servicios Web', grad: 'linear-gradient(135deg,#0F172A,#1E3A8A)', icon: ICON.web,
        desc: 'Sitios web rápidos, responsive y optimizados para convertir visitantes en clientes.',
        points: ['Diseño UX/UI', 'Desarrollo responsive', 'Optimización y SEO']
      }
    ],
    portfolio: [
      {
        tag: 'Branding', title: 'Océano Café', grad: 'linear-gradient(135deg,#1E3A8A,#6366F1)',
        desc: 'Rebranding completo para una cadena de cafeterías de especialidad.',
        metrics: [{ value: '+180%', label: 'Reconocimiento' }, { value: '3', label: 'Meses' }]
      },
      {
        tag: 'Redes Sociales', title: 'Marea Fitness', grad: 'linear-gradient(135deg,#6366F1,#FF6B6B)',
        desc: 'Estrategia de contenido y comunidad para un estudio de entrenamiento.',
        metrics: [{ value: '+42K', label: 'Seguidores' }, { value: '8.5%', label: 'Engagement' }]
      },
      {
        tag: 'Desarrollo Web', title: 'Coral Realty', grad: 'linear-gradient(135deg,#0F172A,#1E3A8A)',
        desc: 'Plataforma inmobiliaria con buscador avanzado y agenda de citas.',
        metrics: [{ value: '+65%', label: 'Conversión' }, { value: '1.2s', label: 'Carga' }]
      },
      {
        tag: 'Campaña 360°', title: 'Sal & Sol Resort', grad: 'linear-gradient(135deg,#FF6B6B,#1E3A8A)',
        desc: 'Lanzamiento integral de temporada: branding, redes y landing.',
        metrics: [{ value: '+3.2x', label: 'Reservas' }, { value: '2M', label: 'Alcance' }]
      }
    ],
    skills: [
      { name: 'Branding & Diseño', pct: 96, pctLabel: '96%' },
      { name: 'Redes Sociales', pct: 92, pctLabel: '92%' },
      { name: 'Desarrollo Web', pct: 89, pctLabel: '89%' }
    ],
    stats: [
      { target: 120, suffix: '+', label: 'Proyectos entregados', bg: 'linear-gradient(135deg,#1E3A8A,#152C6B)', border: '#1E3A8A', color: '#fff' },
      { target: 98, suffix: '%', label: 'Clientes satisfechos', bg: '#fff', border: '#E2E8F0', color: '#1E3A8A' },
      { target: 8, suffix: ' años', label: 'De experiencia', bg: '#fff', border: '#E2E8F0', color: '#6366F1' },
      { target: 45, suffix: 'M', label: 'De impresiones', bg: 'linear-gradient(135deg,#6366F1,#4F46E5)', border: '#6366F1', color: '#fff' }
    ],
    contactInfo: [
      { icon: '✉', value: 'hola@koralmarea.com' },
      { icon: '☎', value: '+00 000 000 000' },
      { icon: '◈', value: '@koralmarea' }
    ]
  };

  function renderMarquee() {
    var track = document.getElementById('marqueeTrack');
    // duplicated so the animation loop is seamless
    for (var rep = 0; rep < 2; rep++) {
      DATA.marquee.forEach(function (word) {
        var span = document.createElement('span');
        span.className = 'marquee-word';
        span.textContent = word;
        var diamond = document.createElement('span');
        diamond.textContent = '◆';
        span.appendChild(diamond);
        track.appendChild(span);
      });
    }
  }

  function renderServices() {
    var grid = document.getElementById('servicesGrid');
    DATA.services.forEach(function (svc) {
      var card = document.createElement('div');
      card.className = 'service-card';
      card.setAttribute('data-reveal', '');

      var iconWrap = document.createElement('div');
      iconWrap.className = 'service-icon';
      iconWrap.style.background = svc.grad;
      iconWrap.appendChild(iconSpan(svc.icon));
      card.appendChild(iconWrap);

      var h3 = document.createElement('h3');
      h3.textContent = svc.title;
      card.appendChild(h3);

      var p = document.createElement('p');
      p.textContent = svc.desc;
      card.appendChild(p);

      var points = document.createElement('div');
      points.className = 'service-points';
      svc.points.forEach(function (pt) {
        var row = document.createElement('div');
        var check = document.createElement('span');
        check.textContent = '✓';
        row.appendChild(check);
        row.appendChild(document.createTextNode(pt));
        points.appendChild(row);
      });
      card.appendChild(points);

      grid.appendChild(card);
    });
  }

  function renderPortfolio() {
    var grid = document.getElementById('portfolioGrid');
    DATA.portfolio.forEach(function (p) {
      var card = document.createElement('div');
      card.className = 'portfolio-card';
      card.setAttribute('data-reveal', '');
      card.style.background = p.grad;

      var content = document.createElement('div');
      content.className = 'portfolio-card-content';

      var tag = document.createElement('span');
      tag.className = 'portfolio-tag';
      tag.textContent = p.tag;
      content.appendChild(tag);

      var h3 = document.createElement('h3');
      h3.textContent = p.title;
      content.appendChild(h3);

      var desc = document.createElement('p');
      desc.textContent = p.desc;
      content.appendChild(desc);

      var metrics = document.createElement('div');
      metrics.className = 'portfolio-metrics';
      p.metrics.forEach(function (m) {
        var mDiv = document.createElement('div');
        var val = document.createElement('div');
        val.className = 'portfolio-metric-value';
        val.textContent = m.value;
        var lbl = document.createElement('div');
        lbl.className = 'portfolio-metric-label';
        lbl.textContent = m.label;
        mDiv.appendChild(val);
        mDiv.appendChild(lbl);
        metrics.appendChild(mDiv);
      });
      content.appendChild(metrics);

      card.appendChild(content);
      grid.appendChild(card);
    });
  }

  function renderSkills() {
    var list = document.getElementById('skillsList');
    DATA.skills.forEach(function (sk) {
      var row = document.createElement('div');

      var head = document.createElement('div');
      head.className = 'skill-row-head';
      var name = document.createElement('span');
      name.className = 'skill-name';
      name.textContent = sk.name;
      var pct = document.createElement('span');
      pct.className = 'skill-pct';
      pct.textContent = sk.pctLabel;
      head.appendChild(name);
      head.appendChild(pct);
      row.appendChild(head);

      var track = document.createElement('div');
      track.className = 'skill-track';
      var bar = document.createElement('div');
      bar.className = 'skill-bar';
      bar.setAttribute('data-bar', sk.pct);
      track.appendChild(bar);
      row.appendChild(track);

      list.appendChild(row);
    });
  }

  function renderStats() {
    var grid = document.getElementById('statsGrid');
    DATA.stats.forEach(function (st) {
      var card = document.createElement('div');
      card.className = 'stat-card';
      card.style.background = st.bg;
      card.style.border = '1px solid ' + st.border;

      var value = document.createElement('div');
      value.className = 'stat-value';
      value.style.color = st.color;
      var count = document.createElement('span');
      count.setAttribute('data-count', st.target);
      count.textContent = '0';
      value.appendChild(count);
      value.appendChild(document.createTextNode(st.suffix));
      card.appendChild(value);

      var label = document.createElement('div');
      label.className = 'stat-label';
      label.textContent = st.label;
      card.appendChild(label);

      grid.appendChild(card);
    });
  }

  function renderContactInfo() {
    var wrap = document.getElementById('contactInfo');
    DATA.contactInfo.forEach(function (ci) {
      var item = document.createElement('div');
      item.className = 'contact-info-item';
      var icon = document.createElement('span');
      icon.textContent = ci.icon;
      item.appendChild(icon);
      item.appendChild(document.createTextNode(ci.value));
      wrap.appendChild(item);
    });
  }

  renderMarquee();
  renderServices();
  renderPortfolio();
  renderSkills();
  renderStats();
  renderContactInfo();

  // ---- nav scroll state + hero parallax ----
  var nav = document.getElementById('nav');
  var parallaxA = document.getElementById('parallaxA');
  var parallaxB = document.getElementById('parallaxB');

  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    if (parallaxA) parallaxA.style.transform = 'translateY(' + (y * -0.08) + 'px)';
    if (parallaxB) parallaxB.style.transform = 'translateY(' + (y * 0.06) + 'px)';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- scroll reveal + counters + bars ----
  var reveals = document.querySelectorAll('[data-reveal]');

  function reveal(el) { el.classList.add('is-visible'); }

  function runCounters(el) {
    el.querySelectorAll('[data-count]').forEach(function (c) {
      if (c.dataset.done) return;
      c.dataset.done = '1';
      var target = parseFloat(c.getAttribute('data-count'));
      var dur = 1600;
      var start = performance.now();
      function tick(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        c.textContent = Math.round(target * eased).toLocaleString('es');
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
    el.querySelectorAll('[data-bar]').forEach(function (b) {
      if (b.dataset.done) return;
      b.dataset.done = '1';
      requestAnimationFrame(function () { b.style.width = b.getAttribute('data-bar') + '%'; });
    });
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        reveal(e.target);
        runCounters(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach(function (el) { io.observe(el); });

  // fallback: reveal anything not yet shown after 3.5s
  setTimeout(function () { reveals.forEach(reveal); }, 3500);

  // counters/bars live inside #nosotros and #contacto; observe those too as a safety net
  document.querySelectorAll('#nosotros, #contacto').forEach(function (sec) { io.observe(sec); });
})();
