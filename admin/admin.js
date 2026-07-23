(function () {
  'use strict';

  var loginView = document.getElementById('loginView');
  var dashboardView = document.getElementById('dashboardView');
  var loginForm = document.getElementById('loginForm');
  var loginError = document.getElementById('loginError');
  var toastEl = document.getElementById('toast');
  var toastTimer = null;

  var state = { content: null };

  function toast(msg, isError) {
    toastEl.textContent = msg;
    toastEl.classList.toggle('is-error', !!isError);
    toastEl.hidden = false;
    requestAnimationFrame(function () { toastEl.classList.add('is-visible'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
      setTimeout(function () { toastEl.hidden = true; }, 250);
    }, 2600);
  }

  function api(method, path, body) {
    var opts = { method: method, headers: {}, credentials: 'same-origin' };
    if (body instanceof FormData) {
      opts.body = body;
    } else if (body !== undefined) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    return fetch(path, opts).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) throw new Error(data.error || ('Error ' + res.status));
        return data;
      });
    });
  }

  // ---------------- auth ----------------
  function showLogin() {
    loginView.hidden = false;
    dashboardView.hidden = true;
  }

  function showDashboard() {
    loginView.hidden = true;
    dashboardView.hidden = false;
    loadContent();
  }

  api('GET', '/api/session').then(function (r) {
    if (r.authenticated) showDashboard(); else showLogin();
  }).catch(showLogin);

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    loginError.hidden = true;
    var fd = new FormData(loginForm);
    api('POST', '/api/login', { email: fd.get('email'), password: fd.get('password') })
      .then(function () { showDashboard(); })
      .catch(function (err) {
        loginError.textContent = err.message;
        loginError.hidden = false;
      });
  });

  document.getElementById('logoutBtn').addEventListener('click', function () {
    api('POST', '/api/logout').then(showLogin);
  });

  // ---------------- tabs ----------------
  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('is-active'); });
      document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('is-active'); });
      btn.classList.add('is-active');
      document.querySelector('.tab-panel[data-panel="' + btn.dataset.tab + '"]').classList.add('is-active');
    });
  });

  // ---------------- content load/render ----------------
  function loadContent() {
    api('GET', '/api/content').then(function (data) {
      state.content = data;
      renderPortfolioAdmin();
      renderServicesAdmin();
      renderContactAdmin();
      renderAboutAdmin();
    }).catch(function (err) { toast(err.message, true); });
  }

  // ---------------- portfolio ----------------
  var portfolioModal = document.getElementById('portfolioModal');
  var portfolioForm = document.getElementById('portfolioForm');
  var portfolioImagePreview = document.getElementById('portfolioImagePreview');
  var editingPortfolioId = null;
  var editingPortfolioImage = null;

  function renderPortfolioAdmin() {
    var list = document.getElementById('portfolioList');
    list.innerHTML = '';
    (state.content.portfolio || []).forEach(function (p) {
      var card = document.createElement('div');
      card.className = 'portfolio-admin-card';

      var thumb = document.createElement('div');
      thumb.className = 'portfolio-admin-thumb';
      thumb.style.background = p.image ? ('url("' + p.image + '") center/cover') : (p.grad || 'linear-gradient(135deg,#1E3A8A,#6366F1)');
      card.appendChild(thumb);

      var body = document.createElement('div');
      body.className = 'portfolio-admin-body';

      var tag = document.createElement('span');
      tag.className = 'portfolio-admin-tag';
      tag.textContent = p.tag;
      body.appendChild(tag);

      var h3 = document.createElement('h3');
      h3.textContent = p.title;
      body.appendChild(h3);

      var desc = document.createElement('p');
      desc.textContent = p.desc;
      body.appendChild(desc);

      var actions = document.createElement('div');
      actions.className = 'portfolio-admin-actions';

      var editBtn = document.createElement('button');
      editBtn.className = 'btn-icon';
      editBtn.title = 'Editar';
      editBtn.textContent = '✎';
      editBtn.addEventListener('click', function () { openPortfolioModal(p); });
      actions.appendChild(editBtn);

      var delBtn = document.createElement('button');
      delBtn.className = 'btn-icon danger';
      delBtn.title = 'Eliminar';
      delBtn.textContent = '🗑';
      delBtn.addEventListener('click', function () { deletePortfolioItem(p.id); });
      actions.appendChild(delBtn);

      body.appendChild(actions);
      card.appendChild(body);
      list.appendChild(card);
    });
  }

  function openPortfolioModal(item) {
    editingPortfolioId = item ? item.id : null;
    editingPortfolioImage = item ? item.image : null;
    document.getElementById('portfolioModalTitle').textContent = item ? 'Editar caso' : 'Nuevo caso';
    portfolioForm.reset();
    portfolioImagePreview.hidden = true;
    if (item) {
      portfolioForm.title.value = item.title || '';
      portfolioForm.tag.value = item.tag || '';
      portfolioForm.desc.value = item.desc || '';
      var m = item.metrics || [];
      portfolioForm.metric1Value.value = (m[0] && m[0].value) || '';
      portfolioForm.metric1Label.value = (m[0] && m[0].label) || '';
      portfolioForm.metric2Value.value = (m[1] && m[1].value) || '';
      portfolioForm.metric2Label.value = (m[1] && m[1].label) || '';
      if (item.image) {
        portfolioImagePreview.hidden = false;
        portfolioImagePreview.querySelector('img').src = item.image;
      }
    }
    portfolioModal.hidden = false;
  }

  document.getElementById('addPortfolioBtn').addEventListener('click', function () { openPortfolioModal(null); });
  document.getElementById('portfolioModalCancel').addEventListener('click', function () { portfolioModal.hidden = true; });

  portfolioForm.querySelector('input[name="image"]').addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      portfolioImagePreview.hidden = false;
      portfolioImagePreview.querySelector('img').src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  portfolioForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(portfolioForm);
    var file = fd.get('image');
    var payload = {
      title: fd.get('title'),
      tag: fd.get('tag'),
      desc: fd.get('desc'),
      metrics: [
        { value: fd.get('metric1Value') || '', label: fd.get('metric1Label') || '' },
        { value: fd.get('metric2Value') || '', label: fd.get('metric2Label') || '' }
      ].filter(function (m) { return m.value || m.label; }),
      image: editingPortfolioImage || null
    };

    var uploadPromise = (file && file.size > 0)
      ? (function () {
          var uploadFd = new FormData();
          uploadFd.append('image', file);
          return api('POST', '/api/admin/upload', uploadFd).then(function (r) { payload.image = r.url; });
        })()
      : Promise.resolve();

    uploadPromise
      .then(function () {
        return editingPortfolioId
          ? api('PUT', '/api/admin/portfolio/' + editingPortfolioId, payload)
          : api('POST', '/api/admin/portfolio', payload);
      })
      .then(function () {
        portfolioModal.hidden = true;
        toast('Caso guardado.');
        loadContent();
      })
      .catch(function (err) { toast(err.message, true); });
  });

  function deletePortfolioItem(id) {
    if (!confirm('¿Eliminar este caso de portafolio?')) return;
    api('DELETE', '/api/admin/portfolio/' + id)
      .then(function () { toast('Caso eliminado.'); loadContent(); })
      .catch(function (err) { toast(err.message, true); });
  }

  // ---------------- services ----------------
  function renderServicesAdmin() {
    var list = document.getElementById('servicesList');
    list.innerHTML = '';
    (state.content.services || []).forEach(function (svc, idx) {
      var card = document.createElement('div');
      card.className = 'service-admin-card';
      card.dataset.index = idx;

      var h3 = document.createElement('h3');
      h3.textContent = svc.title || svc.id;
      card.appendChild(h3);

      var titleField = fieldEl('Título', 'text', svc.title, 'svc-title');
      card.appendChild(titleField);

      var descLabel = document.createElement('label');
      descLabel.className = 'field';
      descLabel.innerHTML = '<span>Descripción</span>';
      var descArea = document.createElement('textarea');
      descArea.rows = 3;
      descArea.className = 'svc-desc';
      descArea.value = svc.desc || '';
      descLabel.appendChild(descArea);
      card.appendChild(descLabel);

      var pointsWrap = document.createElement('div');
      pointsWrap.className = 'points-editor';
      var pointsLabel = document.createElement('span');
      pointsLabel.textContent = 'Checklist (3 puntos)';
      pointsLabel.style.fontSize = '13px';
      pointsLabel.style.fontWeight = '700';
      pointsLabel.style.color = '#475569';
      pointsWrap.appendChild(pointsLabel);
      for (var i = 0; i < 3; i++) {
        var input = document.createElement('input');
        input.type = 'text';
        input.className = 'svc-point';
        input.value = (svc.points && svc.points[i]) || '';
        pointsWrap.appendChild(input);
      }
      card.appendChild(pointsWrap);

      list.appendChild(card);
    });
  }

  function fieldEl(labelText, type, value) {
    var label = document.createElement('label');
    label.className = 'field';
    var span = document.createElement('span');
    span.textContent = labelText;
    label.appendChild(span);
    var input = document.createElement('input');
    input.type = type;
    input.className = 'svc-title';
    input.value = value || '';
    label.appendChild(input);
    return label;
  }

  document.getElementById('saveServicesBtn').addEventListener('click', function () {
    var cards = document.querySelectorAll('#servicesList .service-admin-card');
    var services = [];
    cards.forEach(function (card, idx) {
      var original = state.content.services[idx];
      var points = Array.prototype.map.call(card.querySelectorAll('.svc-point'), function (i) { return i.value; })
        .filter(function (v) { return v.trim() !== ''; });
      services.push({
        id: original.id,
        title: card.querySelector('.svc-title').value,
        desc: card.querySelector('.svc-desc').value,
        points: points
      });
    });
    api('PUT', '/api/admin/services', services)
      .then(function () { toast('Servicios guardados.'); loadContent(); })
      .catch(function (err) { toast(err.message, true); });
  });

  // ---------------- contact / whatsapp ----------------
  function renderContactAdmin() {
    var form = document.getElementById('contactForm');
    var wa = state.content.whatsapp || {};
    var c = state.content.contact || {};
    form.whatsappNumber.value = wa.number || '';
    form.whatsappMessage.value = wa.message || '';
    form.email.value = c.email || '';
    form.phone.value = c.phone || '';
    form.social.value = c.social || '';
  }

  document.getElementById('saveContactBtn').addEventListener('click', function () {
    var form = document.getElementById('contactForm');
    var whatsappPayload = { number: form.whatsappNumber.value.trim(), message: form.whatsappMessage.value.trim() };
    var contactPayload = { email: form.email.value.trim(), phone: form.phone.value.trim(), social: form.social.value.trim() };
    Promise.all([
      api('PUT', '/api/admin/whatsapp', whatsappPayload),
      api('PUT', '/api/admin/contact', contactPayload)
    ]).then(function () { toast('Contacto guardado.'); loadContent(); })
      .catch(function (err) { toast(err.message, true); });
  });

  // ---------------- about (skills + stats) ----------------
  function renderAboutAdmin() {
    var skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = '';
    (state.content.skills || []).forEach(function (sk) {
      var row = document.createElement('div');
      row.className = 'skill-admin-row';
      row.appendChild(labeledInput('Nombre', 'text', sk.name, 'sk-name'));
      row.appendChild(labeledInput('Porcentaje', 'number', sk.pct, 'sk-pct'));
      skillsList.appendChild(row);
    });

    var statsList = document.getElementById('statsList');
    statsList.innerHTML = '';
    (state.content.stats || []).forEach(function (st) {
      var row = document.createElement('div');
      row.className = 'stat-admin-row';
      row.appendChild(labeledInput('Valor', 'number', st.target, 'st-target'));
      row.appendChild(labeledInput('Sufijo', 'text', st.suffix, 'st-suffix'));
      row.appendChild(labeledInput('Etiqueta', 'text', st.label, 'st-label'));
      statsList.appendChild(row);
    });
  }

  function labeledInput(labelText, type, value, cls) {
    var label = document.createElement('label');
    label.className = 'field';
    var span = document.createElement('span');
    span.textContent = labelText;
    label.appendChild(span);
    var input = document.createElement('input');
    input.type = type;
    input.className = cls;
    input.value = value === undefined || value === null ? '' : value;
    label.appendChild(input);
    return label;
  }

  document.getElementById('saveAboutBtn').addEventListener('click', function () {
    var skills = [];
    document.querySelectorAll('#skillsList .skill-admin-row').forEach(function (row) {
      skills.push({
        name: row.querySelector('.sk-name').value,
        pct: parseFloat(row.querySelector('.sk-pct').value) || 0
      });
    });
    var stats = [];
    document.querySelectorAll('#statsList .stat-admin-row').forEach(function (row) {
      stats.push({
        target: parseFloat(row.querySelector('.st-target').value) || 0,
        suffix: row.querySelector('.st-suffix').value,
        label: row.querySelector('.st-label').value
      });
    });
    Promise.all([
      api('PUT', '/api/admin/skills', skills),
      api('PUT', '/api/admin/stats', stats)
    ]).then(function () { toast('Nosotros guardado.'); loadContent(); })
      .catch(function (err) { toast(err.message, true); });
  });
})();
