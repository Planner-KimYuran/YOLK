/* 김유란 포트폴리오 — 공통 UI + 화면별 동작 (바닐라 JS) */
(function () {
  'use strict';
  var D = window.YOLK;
  var page = document.body.getAttribute('data-page');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var two = function (n) { return (n < 10 ? '0' : '') + n; };
  var store = {
    get: function (k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 공통 : GNB ---------- */
  var gnb = $('.gnb');
  function onScroll() {
    var y = window.scrollY;
    if (gnb) gnb.classList.toggle('is-scrolled', y > 4);
    var top = $('.to-top'); if (top) top.classList.toggle('is-on', y > 700);
    var hint = $('.hero__scroll'); if (hint) hint.classList.toggle('is-hidden', y > 40);
    var pct = $('.gnb__pct'); if (pct) { var max = document.documentElement.scrollHeight - window.innerHeight; pct.textContent = (max > 0 ? Math.round(y / max * 100) : 0) + '%'; }
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  function setActive(key) {
    $$('[data-nav]').forEach(function (a) { a.setAttribute('aria-current', a.getAttribute('data-nav') === key ? 'true' : 'false'); });
  }
  setActive(page === 'about' ? 'about' : page === 'home' ? '' : 'works');

  /* 모바일 전체 화면 메뉴 */
  var mm = $('.mmenu'), mmOpen = $('.gnb__toggle'), mmClose = $('.mmenu__close');
  function closeMenu() { if (!mm) return; mm.hidden = true; document.body.classList.remove('is-locked'); mmOpen && mmOpen.setAttribute('aria-expanded', 'false'); }
  if (mmOpen) mmOpen.addEventListener('click', function () { mm.hidden = false; document.body.classList.add('is-locked'); mmOpen.setAttribute('aria-expanded', 'true'); mmClose.focus(); });
  if (mmClose) mmClose.addEventListener('click', function () { closeMenu(); mmOpen.focus(); });
  $$('.mmenu a').forEach(function (a) { a.addEventListener('click', closeMenu); });

  /* TOP */
  var topBtn = $('.to-top');
  if (topBtn) topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    var skip = $('.gnb__logo'); if (skip) skip.focus({ preventScroll: true });
  });

  /* ---------- 공통 : 복사 · 토스트 ---------- */
  var toastEl = $('.toast'), toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.querySelector('span').textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 1600);
  }
  function selectText(el) { try { var r = document.createRange(); r.selectNodeContents(el); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); } catch (e) {} }
  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.getElementById(btn.getAttribute('data-copy'));
      var text = target.textContent.trim();
      var ok = function () { toast(btn.getAttribute('data-msg')); };
      var fail = function () { selectText(target); toast('COPY FAILED — 선택된 글자를 직접 복사해 주세요.'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fail); else fail();
    });
  });

  /* ---------- 공통 : PDF 미리보기 팝업 (DETAIL-03) ---------- */
  var modal = $('#pdf'), lastFocus = null;
  function openPdf(title, file) {
    if (!modal) return;
    galList = null;
    lastFocus = document.activeElement;
    $('.modal__title', modal).textContent = title;
    var view = $('.modal__view', modal), ext = $('.modal__ext', modal);
    if (file) {
      view.innerHTML = '<iframe title="' + esc(title) + '" src="' + esc(file) + '#toolbar=0"></iframe>';
      ext.href = file; ext.removeAttribute('aria-disabled'); ext.tabIndex = 0;
    } else {
      view.innerHTML = '<div class="modal__empty"><strong>PDF DOCUMENT PREVIEW</strong><span>원본 문서는 등록 후 이곳에서 바로 볼 수 있습니다.</span></div>';
      ext.removeAttribute('href'); ext.setAttribute('aria-disabled', 'true'); ext.tabIndex = -1;
    }
    $('.modal__page', modal).textContent = file ? '01 / —' : '00 / 00';
    $$('.modal__foot button', modal).forEach(function (b) { b.disabled = true; });
    modal.hidden = false; document.body.classList.add('is-locked');
    $('.modal__close', modal).focus();
  }
  var galList = null, galIdx = 0;
  function galShow() {
    var it = galList[galIdx];
    $('.modal__title', modal).textContent = it.cap;
    var mv = $('.modal__view', modal); mv.innerHTML = '<img class="modal__img" src="' + esc(it.src) + '" alt="' + esc(it.cap) + '">'; mv.scrollTop = 0;
    var ext = $('.modal__ext', modal); ext.href = it.file || it.src; ext.removeAttribute('aria-disabled'); ext.tabIndex = 0;
    $('.modal__page', modal).textContent = two(galIdx + 1) + ' / ' + two(galList.length);
    var btns = $$('.modal__foot button', modal);
    btns[0].disabled = galIdx === 0; btns[1].disabled = galIdx === galList.length - 1;
  }
  function openGallery(list, i) {
    if (!modal) return;
    lastFocus = document.activeElement;
    galList = list; galIdx = i; galShow();
    modal.hidden = false; document.body.classList.add('is-locked');
    $('.modal__close', modal).focus();
  }
  if (modal) {
    var fb = $$('.modal__foot button', modal);
    fb[0].addEventListener('click', function () { if (galList && galIdx > 0) { galIdx--; galShow(); } });
    fb[1].addEventListener('click', function () { if (galList && galIdx < galList.length - 1) { galIdx++; galShow(); } });
    modal.addEventListener('keydown', function (e) {
      if (!galList) return;
      if (e.key === 'ArrowLeft') fb[0].click();
      if (e.key === 'ArrowRight') fb[1].click();
    });
  }
  function closePdf() {
    if (!modal || modal.hidden) return;
    modal.hidden = true; modal.classList.remove('is-doc'); document.body.classList.remove('is-locked'); galList = null;
    $('.modal__view', modal).innerHTML = '';
    if (lastFocus) lastFocus.focus();
  }
  if (modal) {
    $('.modal__close', modal).addEventListener('click', closePdf);
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closePdf(); }
      if (e.key === 'Tab') {
        var f = $$('a[href], button:not([disabled])', modal).filter(function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-pdf]');
    if (!b) return;
    e.preventDefault();
    var pages = b.getAttribute('data-pages');
    if (pages && modal) {
      var t = b.getAttribute('data-pdf'), f = b.getAttribute('data-file'), list = pages.split(',');
      modal.classList.add('is-doc');
      openGallery(list.map(function (src, i) { return { src: src, file: f, cap: t + ' · ' + (i + 1) + '쪽' }; }), 0);
      return;
    }
    modal && modal.classList.remove('is-doc');
    openPdf(b.getAttribute('data-pdf'), b.getAttribute('data-file') || null);
  });
  function shortName(p) { return p.cardTitle; }
  function pdfBtn(p, type, cls) {
    var doc = p.docs.filter(function (d) { return d.type === type; })[0] || {};
    return '<button type="button" class="' + cls + '" data-pdf="' + esc(shortName(p) + ' · ' + type + ' PDF') + '"' + (doc.file ? ' data-file="' + esc(doc.file) + '"' : '') + '>' + esc(type) + ' 보기 ↗</button>';
  }
  function docsSorted(p) { return D.docTypes.filter(function (t) { return p.docs.some(function (d) { return d.type === t; }); }); }
  function thumb(p, cls) {
    if (p.thumb && p.thumb.src) return '<div class="ph ph--img' + (cls ? ' ' + cls : '') + '"><img loading="lazy" src="' + esc(p.thumb.thumb || p.thumb.src) + '" alt="' + esc(p.cardTitle) + ' 대표 이미지"></div>';
    return ph('THUMBNAIL', typeof p.cover === 'string' ? p.cover : '').replace('class="ph"', 'class="ph' + (cls ? ' ' + cls : '') + '"');
  }
  function ph(label, sub) { return '<div class="ph" role="img" aria-label="' + esc(label + (sub ? ' — ' + sub : '') + ' 이미지 자리') + '"><span class="ph__label">' + esc(label) + (sub ? '<span class="ph__sub">' + esc(sub) + '</span>' : '') + '</span></div>'; }

  /* =========================================================
     HOME
     ========================================================= */
  /* =========================================================
     HOME — 히어로 · 대표 프로젝트 카드 · 프로필 요약
     ========================================================= */
  if (page === 'home') {
    var now = new Date(), nowYM = now.getFullYear() * 100 + now.getMonth() + 1;
    var fc = $('#fcards');
    if (fc) fc.innerHTML = D.mainOrder.map(function (id) {
      var p = D.projects[id], pm = String(p.period).match(/(\d{4})\.(\d{2})(?:\s*[—–-]\s*(\d{2}))?/), live = pm ? (+pm[1] * 100 + +(pm[3] || pm[2])) > nowYM : false;
      var award = (D.awards || []).filter(function (a) { return a[2] === id; })[0];
      var meta = ['대표'].concat(docsSorted(p)).concat(award ? [award[1].split(' · ')[0]] : []);
      return '<li><a class="fcard" href="project.html?id=' + id + '">' +
        '<div class="fcard__img">' + thumb(p) + (live ? '<span class="fcard__badge">진행 중</span>' : '') + '</div>' +
        '<h3 class="fcard__title">' + esc(p.cardTitle) + '</h3>' +
        '<p class="fcard__sum">' + esc(p.summary || p.homeSummary) + '</p>' +
        '<p class="fcard__meta">' + meta.map(esc).join(' <span aria-hidden="true">|</span> ') + '</p>' +
        '<p class="fcard__date">' + esc(String(p.period).replace(/\s*—\s*/, '–')) + (live ? ' · 진행 중' : '') + '</p></a></li>';
    }).join('');
    var bt = $('.backtop__btn');
    if (bt) bt.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      var l = $('.gnb__logo'); if (l) l.focus({ preventScroll: true });
    });
  }

  if (page === 'about') {
    /* ABOUT-02 Experience */
    var expList = $('#exp-list'), expFilter = 'ALL';
    function renderExp() {
      expList.innerHTML = D.experience.filter(function (x) { return expFilter === 'ALL' || x.type === expFilter; }).map(function (x, i) {
        var id = 'exp-' + i + '-' + x.type;
        return '<li class="' + (x.open ? 'is-open' : '') + '"><button type="button" class="exp__row" aria-expanded="' + (x.open ? 'true' : 'false') + '" aria-controls="' + id + '">' +
          '<span class="exp__year">' + x.year + '</span><span class="exp__type">' + x.type + '</span>' +
          '<span class="exp__name">' + esc(x.name) + (x.lead ? ' <span class="lead-badge"><i class="dot" aria-hidden="true"></i>LEAD</span>' : '') + '</span>' +
          '<span class="exp__role">' + esc(x.role) + '</span><span class="exp__pm" aria-hidden="true">' + (x.open ? '−' : '＋') + '</span></button>' +
          '<div class="exp__detail" id="' + id + '"><div><p><small>' + esc(x.when) + '</small>' + esc(x.text) + '</p></div></div></li>';
      }).join('');
    }
    renderExp();
    expList.addEventListener('click', function (e) {
      var row = e.target.closest('.exp__row'); if (!row) return;
      var li = row.parentNode, open = !li.classList.contains('is-open');
      li.classList.toggle('is-open', open); row.setAttribute('aria-expanded', open); row.querySelector('.exp__pm').textContent = open ? '−' : '＋';
    });
    $$('[data-exp]').forEach(function (b) {
      b.addEventListener('click', function () {
        expFilter = b.getAttribute('data-exp');
        $$('[data-exp]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        renderExp();
      });
    });

    /* HOME-03 문서 미리보기 */
    var codes = { plan: '기획서', report: '보고서', wire: '화면설계서', proposal: '제안서' };
    var codeOf = function (t) { for (var k in codes) if (codes[k] === t) return k; };
    var tabs = $('#doc-tabs'), dlist = $('#doc-list'), dprev = $('#doc-preview');
    var params = new URLSearchParams(location.search);
    var curType = codes[params.get('doc')] || '기획서';
    tabs.innerHTML = D.docTypes.map(function (t, i) {
      var n = (D.documents[t] || []).length;
      return '<button type="button" role="tab" class="tab" id="tab-' + codeOf(t) + '" aria-controls="doc-panel" aria-selected="' + (t === curType) + '" tabindex="' + (t === curType ? 0 : -1) + '"' + (n ? '' : ' aria-disabled="true"') + ' data-type="' + t + '">' +
        '<span class="tab__no">' + two(i + 1) + '</span><span class="tab__name">' + t + '</span><span class="tab__count">' + two(n) + '</span></button>';
    }).join('');
    function previewFor(item) {
      dprev.innerHTML = ph('FIRST PAGE PREVIEW', item ? item.name + ' — 표지' : '') + '<figcaption>' + (item ? esc(item.name) + ' — 표지' : '') + '</figcaption>';
    }
    function renderDocs() {
      var items = D.documents[curType] || [];
      dlist.innerHTML = items.map(function (it, i) {
        var p = D.projects[it.id], doc = p.docs.filter(function (d) { return d.type === curType; })[0] || {};
        return '<li data-i="' + i + '"' + (i === 0 ? ' class="is-active"' : '') + '><span class="dlist__no">#' + two(i + 1) + '</span>' +
          '<span class="dlist__name">' + esc(it.name) + '<span class="dlist__meta">2026 · ' + (doc.pages ? doc.pages + 'p' : 'PDF 등록 예정') + '</span></span>' +
          '<span class="dlist__acts"><button type="button" class="btn btn--sm btn--line" data-pdf="' + esc(p.cardTitle + ' · ' + curType + ' PDF') + '"' + (doc.file ? ' data-file="' + esc(doc.file) + '"' : '') + '>미리보기</button>' +
          '<a class="tlink" href="project.html?id=' + it.id + '">상세보기 →</a></span></li>';
      }).join('');
      previewFor(items[0]);
      $$('li', dlist).forEach(function (li) {
        var on = function () { $$('li', dlist).forEach(function (x) { x.classList.toggle('is-active', x === li); }); previewFor(items[+li.getAttribute('data-i')]); };
        li.addEventListener('mouseenter', on); li.addEventListener('focusin', on);
      });
    }
    function selectTab(btn, focus) {
      curType = btn.getAttribute('data-type');
      $$('.tab', tabs).forEach(function (t) { var on = t === btn; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
      if (focus) btn.focus();
      var u = new URL(location.href); u.searchParams.set('doc', codeOf(curType)); history.replaceState(null, '', u.pathname + u.search + u.hash);
      renderDocs();
    }
    tabs.addEventListener('click', function (e) { var b = e.target.closest('.tab'); if (b) selectTab(b); });
    tabs.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var list = $$('.tab:not([aria-disabled="true"])', tabs), i = list.indexOf(document.activeElement);
      if (i < 0) return; e.preventDefault();
      selectTab(list[(i + (e.key === 'ArrowRight' ? 1 : -1) + list.length) % list.length], true);
    });
    renderDocs();
    if (params.get('doc')) { var dsec = $('#documents'); if (dsec) setTimeout(function () { dsec.scrollIntoView(); }, 50); }
  }

  /* =========================================================
     CORE WORKS — 전체 목록 (PROJECT-01 · 02)
     ========================================================= */
  if (page === 'works') {
    var typeCodes = { plan: '기획서', report: '보고서', wire: '화면설계서', proposal: '제안서' };
    var typeCode = function (t) { for (var k in typeCodes) if (typeCodes[k] === t) return k; };
    var saved = store.get('yolk-works') || {};
    var q = new URLSearchParams(location.search);
    var state = { type: typeCodes[q.get('type')] || (q.get('type') ? 'ALL' : saved.type) || 'ALL', sort: saved.sort || 'NEWEST' };
    var ids = Object.keys(D.projects);
    var gridEl = $('#grid'), countEl = $('#count');
    var sortLabels = { NEWEST: 'NEWEST', OLDEST: 'OLDEST', NAME: 'NAME 가–하' };
    function ordered() {
      var cur = D.curatedOrder;
      var list = ids.filter(function (id) { return state.type === 'ALL' || D.projects[id].docs.some(function (d) { return d.type === state.type; }); });
      list.sort(function (a, b) {
        var A = D.projects[a], B = D.projects[b];
        if (state.sort === 'NAME') return A.cardTitle.localeCompare(B.cardTitle, 'ko');
        var ea = A.end || 0, eb = B.end || 0;
        if (ea !== eb) {
          if (!ea) return 1; if (!eb) return -1;
          return state.sort === 'NEWEST' ? eb - ea : ea - eb;
        }
        return cur.indexOf(a) - cur.indexOf(b);
      });
      return list;
    }
    function render() {
      var list = ordered();
      countEl.textContent = two(list.length) + ' PROJECTS';
      if (!list.length) {
        gridEl.innerHTML = '<div class="empty"><p>선택한 조건에 해당하는 프로젝트가 없습니다.</p><button type="button" class="tlink" data-reset>전체 프로젝트 보기 →</button></div>';
      } else {
        gridEl.innerHTML = list.map(function (id, i) {
          var p = D.projects[id];
          return '<a class="card" href="project.html?id=' + id + '" aria-label="' + esc(p.cardTitle) + ' 프로젝트 보기">' +
            '<div class="card__thumb">' + thumb(p, 'ph--fill') + '<span class="card__bar" aria-hidden="true">VIEW PROJECT ↗</span></div>' +
            '<div class="card__body"><span class="card__no">#' + two(i + 1) + '</span><h2 class="card__title">' + esc(p.cardTitle) + '</h2>' +
            '<p class="core-line"><span class="core-label"><i class="dot" aria-hidden="true"></i>CORE</span><span>' + esc(p.core) + '</span></p>' +
            '<span class="card__docs">' + docsSorted(p).map(function (t) { return '<span class="tag-doc">' + t + '</span>'; }).join('') + '</span>' +
            '<span class="card__meta">' + esc(p.cardMeta) + '</span></div></a>';
        }).join('');
      }
      $$('[data-type]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-type') === state.type ? 'true' : 'false'); });
      $('#sort-btn .sort__cur').textContent = sortLabels[state.sort];
      $$('#sort-list button').forEach(function (b) { var on = b.getAttribute('data-sort') === state.sort; b.setAttribute('aria-checked', on); b.querySelector('i').textContent = on ? '✓' : ''; });
      store.set('yolk-works', state);
      var u = new URL(location.href);
      if (state.type === 'ALL') u.searchParams.delete('type'); else u.searchParams.set('type', typeCode(state.type));
      history.replaceState(null, '', u.pathname + u.search);
    }
    $$('[data-type]').forEach(function (b) { b.addEventListener('click', function () { state.type = b.getAttribute('data-type'); render(); }); });
    gridEl.addEventListener('click', function (e) { if (e.target.closest('[data-reset]')) { state.type = 'ALL'; render(); } });
    var sBtn = $('#sort-btn'), sList = $('#sort-list');
    function sortOpen(open) { sList.hidden = !open; sBtn.setAttribute('aria-expanded', open); sBtn.querySelector('.sort__arr').textContent = open ? '∧' : '∨'; }
    sBtn.addEventListener('click', function () { sortOpen(sList.hidden); if (!sList.hidden) $('button[aria-checked="true"]', sList).focus(); });
    $$('button', sList).forEach(function (b) { b.addEventListener('click', function () { state.sort = b.getAttribute('data-sort'); sortOpen(false); sBtn.focus(); render(); }); });
    document.addEventListener('click', function (e) { if (!e.target.closest('.sort')) sortOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sList.hidden) { sortOpen(false); sBtn.focus(); } });
    render();
    var sy = store.get('yolk-works-y');
    if (sy && document.referrer.indexOf('project.html') > -1) window.scrollTo(0, sy);
    window.addEventListener('pagehide', function () { store.set('yolk-works-y', window.scrollY); });
  }

  /* =========================================================
     PROJECT DETAIL (DETAIL-01 · 02 / PJ01~08)
     ========================================================= */
  if (page === 'detail') {
    var id = new URLSearchParams(location.search).get('id');
    if (!D.projects[id]) id = '01';
    var P = D.projects[id], keys = Object.keys(D.projects).sort(), idx = keys.indexOf(id);
    var prevId = keys[(idx - 1 + keys.length) % keys.length], nextId = keys[(idx + 1) % keys.length];
    document.title = P.title + ' — 김유란';
    var docs = docsSorted(P);
    var root = $('#detail');

    function visual(v) {
      if (!v) return '';
      var arrow = '<span class="flow__arrow" aria-hidden="true">→</span>';
      if (v.kind === 'flow') return '<h3>' + esc(v.title) + '</h3><div class="flow">' + v.steps.map(function (s) { return '<span class="flow__step">' + esc(s) + '</span>'; }).join(arrow) + '</div>' + (v.note ? '<p class="r-note">※ ' + esc(v.note) + '</p>' : '');
      if (v.kind === 'bars') return '<h3>' + esc(v.title) + '</h3><div class="bars">' + v.rows.map(function (r) { return '<div class="bar"><span>' + esc(r[0]) + '</span><span class="bar__track" aria-hidden="true"><span class="bar__fill" style="width:' + r[1] + '%"></span></span><span class="bar__val">' + r[1] + '%</span></div>'; }).join('') + '</div>' + (v.note ? '<p class="r-note">— ' + esc(v.note) + '</p>' : '');
      if (v.kind === 'fan') return '<h3>' + esc(v.title) + '</h3><div class="fan">' +
        '<div class="box"><b>' + esc(v.from[0][0]) + '</b><span>' + esc(v.from[0][1]) + '</span></div><span class="arrow" aria-hidden="true">→</span>' +
        '<div class="box box--dark"><b>' + esc(v.from[1][0]) + '</b><span>' + esc(v.from[1][1]) + '</span></div><span class="arrow" aria-hidden="true">→</span>' +
        '<div class="fan__to">' + v.to.map(function (t) { return '<div class="box"><b>' + esc(t[0]) + '</b><span>' + esc(t[1]) + '</span></div>'; }).join('') + '</div></div>' + (v.note ? '<p class="r-note">※ ' + esc(v.note) + '</p>' : '');
      if (v.kind === 'columns') return '<h3>' + esc(v.title) + '</h3><div class="cols" style="--n:' + v.cols.length + '">' + v.cols.map(function (c) { return '<section><h4>' + esc(c[0]) + '</h4><ul>' + c[1].map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></section>'; }).join('') + '</div>' + (v.note ? '<p class="r-note">' + esc(v.note) + '</p>' : '');
      if (v.kind === 'beforeAfter') return '<h3>' + esc(v.title) + '</h3><div class="ba">' +
        '<div class="ba__row ba__row--before"><b>BEFORE</b><div class="flow">' + v.before.map(function (s) { return '<span class="flow__step">' + esc(s) + '</span>'; }).join(arrow) + '</div></div>' +
        '<div class="ba__row ba__row--after"><b>AFTER</b><div class="flow">' + v.after.map(function (s) { return '<span class="flow__step">' + esc(s) + '</span>'; }).join(arrow) + '</div></div></div>' + (v.note ? '<p class="r-note">※ ' + esc(v.note) + '</p>' : '');
      if (v.kind === 'stations') { var hi = v.hi === undefined ? 3 : v.hi; return '<h3>' + esc(v.title) + '</h3><ol class="stations" style="--n:' + v.stops.length + '">' + v.stops.map(function (s, i) { return '<li class="station' + (i === hi ? ' is-hi' : '') + '"><i aria-hidden="true"></i><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span>' + (v.stamps === false || v.hi !== undefined ? '' : '<em>STAMP ' + two(i + 1) + '</em>') + '</li>'; }).join('') + '</ol>'; }
      if (v.kind === 'frames') return '<h3>' + esc(v.title) + '</h3><div class="frames">' + v.frames.map(function (f, i) { return '<figure>' + ph('#' + two(i + 1)) + '<figcaption><b>#' + two(i + 1) + '</b>' + esc(f) + '</figcaption></figure>'; }).join('') + '</div>';
      return '';
    }
    function head(no, title, lead) { return '<div class="dsec__head"><span class="dsec__no">' + no + '</span><h2 class="dsec__title">' + title + '</h2>' + (lead ? '<p class="dsec__lead">' + esc(lead) + '</p>' : '') + '</div>'; }
    function stats(arr) { return '<ul class="stats">' + arr.map(function (s) { return '<li><strong>' + esc(s[0]) + '</strong><span>' + esc(s[1]) + '</span></li>'; }).join('') + '</ul>'; }

    /* ---------- 상단 (DETAIL-01) ---------- */
    var coverHtml = (P.cover && P.cover.src)
      ? '<figure class="d-cover d-cover--img"><button type="button" class="g-open" data-g="cover" aria-label="표지 크게 보기"><img src="' + esc(P.cover.src) + '" alt="' + esc(P.cardTitle) + ' 표지"></button></figure>'
      : ph('PROJECT COVER / KEY VISUAL', P.cover).replace('class="ph"', 'class="ph d-cover"');
    var topHtml =
      '<section class="d-top wrap" data-scene="OVERVIEW" aria-labelledby="d-title">' +
        '<div class="d-nav"><a class="tlink" href="works.html" id="back-top">← BACK TO PROJECTS</a><span>(PROJECT #' + id + ')</span></div>' +
        (P.question ? '<div class="d-q"><p class="d-q__eyebrow">(' + esc(P.tagline || '') + ')</p><p class="d-q__line">' + P.question.join('<br>') + '</p></div>' : '') +
        coverHtml +
        '<p class="d-tags">' + P.tags.map(esc).join(' ') + '</p>' +
        '<h1 class="d-title" id="d-title">' + esc(P.title) + '</h1>' +
        '<p class="d-sum">' + esc(P.summary) + '</p>' +
        '<div class="the-core"><i class="dot" aria-hidden="true"></i><div><small>THE CORE · 이 프로젝트에서 찾아낸 핵심</small><p>' + esc(P.core) + '</p></div></div>' +
        '<dl class="d-info"><div><dt>PERIOD</dt><dd>' + esc(P.period) + '</dd></div><div><dt>TEAM</dt><dd>' + esc(P.team) + '</dd></div><div><dt>MY ROLE</dt><dd>' + esc(P.role) + '</dd></div><div><dt>DELIVERABLE</dt><dd>' + esc(P.deliverable) + '</dd></div>' +
          (P.course ? '<div><dt>COURSE</dt><dd>' + esc(P.course) + '</dd></div>' : '') + '</dl>' +
        '<div class="d-docs">' + docs.map(function (t, i) { return pdfBtn(P, t, 'btn' + (i ? ' btn--line' : '')); }).join('') + '</div>' +
        '<dl class="pao"><div><dt>PROBLEM</dt><dd>' + esc(P.pao[0]) + '</dd></div><div><dt>APPROACH</dt><dd>' + esc(P.pao[1]) + '</dd></div><div><dt>OUTCOME</dt><dd>' + esc(P.pao[2]) + '</dd></div></dl>' +
        '<p class="d-scroll" aria-hidden="true">SCROLL ↓</p>' +
      '</section>';

    /* ---------- 장면형 본문 (story 데이터가 있는 프로젝트) ---------- */
    var gallery = [];
    if (P.cover && P.cover.src) gallery.cover = { src: P.cover.src, cap: P.cardTitle + ' — 표지' };
    function block(b) {
      var lab = function (t) { return t ? '<h3 class="b-label">' + esc(t) + '</h3>' : ''; };
      var note = function (t) { return t ? '<p class="r-note">※ ' + esc(t) + '</p>' : ''; };
      switch (b.t) {
        case 'text': return '<div class="b b-text">' + b.paras.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>';
        case 'stats': return '<div class="b">' + lab(b.label) + stats(b.items) + note(b.note) + '</div>';
        case 'callout': return '<div class="b b-callout"><p>' + esc(b.text) + '</p>' + (b.sub ? '<span>' + esc(b.sub) + '</span>' : '') + '</div>';
        case 'chips': return '<div class="b methods">' + b.items.map(function (m) { return '<span class="chip">' + esc(m) + '</span>'; }).join('') + '</div>';
        case 'visual': return '<div class="b s-visual s-visual--wide">' + visual(b.v) + '</div>';
        case 'cards': return '<div class="b">' + lab(b.label) + '<div class="scards" style="--n:' + (b.cols || b.items.length) + '">' + b.items.map(function (c, i) { return '<div class="scard"><small>' + two(i + 1) + '</small><h4>' + esc(c[0]) + '</h4><p>' + esc(c[1]) + '</p></div>'; }).join('') + '</div></div>';
        case 'compare':
          var col = function (side, cls) { return '<div class="cmp__col ' + cls + '"><small>' + esc(side.label) + '</small><div class="flow">' + side.items.map(function (x) { return '<span class="flow__step">' + esc(x) + '</span>'; }).join('<span class="flow__arrow" aria-hidden="true">→</span>') + '</div></div>'; };
          return '<div class="b">' + lab(b.title) + '<div class="cmp">' + col(b.before, 'cmp__col--before') + '<span class="arrow" aria-hidden="true">→</span>' + col(b.after, 'cmp__col--after') + '</div>' + note(b.note) + '</div>';
        case 'table': return '<div class="b">' + lab(b.title) + '<div class="tbl-wrap"><table class="dtable"><thead><tr>' + b.head.map(function (h) { return '<th scope="col">' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
          b.rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return i === 0 ? '<th scope="row">' + esc(c) + '</th>' : '<td>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>' + note(b.note) + '</div>';
        case 'gallery': var gset = gallery.push(b.items) - 1; return '<div class="b gal' + (b.grid ? ' gal--grid' : '') + '">' + b.items.map(function (it, gi) {
            return '<figure><button type="button" class="g-open" data-g="' + gset + ':' + gi + '" aria-label="' + esc(it.cap) + ' 크게 보기"><img loading="lazy" src="' + esc(it.thumb || it.src) + '" alt="' + esc(it.cap) + '"></button><figcaption>' + esc(it.cap) + '</figcaption></figure>';
          }).join('') + '</div>';
        case 'decision': return '<div class="b">' + lab(b.label) + '<div class="decision">' +
          '<div><small>처음 판단</small><p>' + esc(b.steps[0]) + '</p></div><span class="arrow" aria-hidden="true">→</span>' +
          '<div><small>확인한 근거</small><p>' + esc(b.steps[1]) + '</p></div><span class="arrow" aria-hidden="true">→</span>' +
          '<div><small>바꾼 방향</small><p>' + esc(b.steps[2]) + '</p></div></div></div>';
        case 'bars':
          var row = function (r, tot) { return '<div class="sbar' + (tot ? ' sbar--tot' : '') + '"><span class="sbar__name">' + esc(r[0]) + '</span>' +
            '<span class="sbar__track" aria-hidden="true"><i class="sbar__goal" style="width:' + (r[3] / r[1] * 100) + '%"></i><i class="sbar__now" style="width:' + (r[2] / r[1] * 100) + '%"></i></span>' +
            '<span class="sbar__val"><b>' + r[2] + '</b> → <b>' + r[3] + '</b> <em>/ ' + r[1] + '</em></span></div>'; };
          return '<div class="b">' + lab(b.title) + '<div class="sbars"><p class="sbars__legend"><span><i class="sbar__now"></i>보완 전</span><span><i class="sbar__goal"></i>보완 후 목표</span><span>배점 대비 길이</span></p>' + b.rows.map(function (r) { return row(r); }).join('') + (b.total ? row(b.total, true) : '') + '</div>' + note(b.note) + '</div>';
        case 'retro': return '<div class="b retro"><small>' + esc(b.title) + '</small><p>' + esc(b.text) + '</p></div>';
        case 'journey': return '<div class="b">' + lab(b.title) + '<div class="tbl-wrap"><div class="jny" style="--n:' + b.stages.length + '">' + b.stages.map(function (st, i) {
            var cut = (b.cut || []).indexOf(i) > -1;
            return '<div class="jny__col' + (cut ? ' is-cut' : '') + '"><small>' + two(i + 1) + '</small><h4>' + esc(st[0]) + '</h4><p>' + esc(st[1]) + '</p><div class="jny__track"><span class="jny__dot" style="--lv:' + st[2] + '"></span></div><em>' + esc(st[3]) + '</em></div>';
          }).join('') + '</div></div></div>';
        case 'colors': return '<div class="b">' + lab(b.title) + '<div class="clr">' + b.items.map(function (c) {
            var bg = c[1] ? c[1] : 'linear-gradient(90deg, ' + b.items[0][1] + ', ' + b.items[b.items.length - 1][1] + ')';
            return '<div class="clr__item"><span class="clr__sw" style="background:' + bg + '"></span><h4>' + esc(c[0]) + (c[1] ? ' <code>' + esc(c[1]) + '</code>' : '') + '</h4><p>' + esc(c[2]) + '</p></div>';
          }).join('') + '</div></div>';
        case 'learned': return '<div class="b learned"><small>LEARNED</small><p>' + esc(b.text) + '</p></div>';
      }
      return '';
    }
    var sections;
    if (P.story) {
      sections = P.story.map(function (sc, i) {
        var no = two(i + 1);
        if (sc.kind === 'core') return { id: sc.id, name: sc.name, html: '<section class="dsec" id="' + sc.id + '" data-scene="' + sc.name.toUpperCase() + '"><div class="cp"><p class="cp__label"><i class="dot" aria-hidden="true"></i>' + no + ' · CORE PROBLEM</p>' +
          '<h2 class="cp__line"><s>' + esc(sc.phen) + '</s><span class="arr" aria-hidden="true">→</span>' + esc(sc.core) + '</h2><p class="cp__next">' + esc(sc.next) + '</p>' +
          '<p class="cp__go">↓ ' + two(i + 2) + ' ' + esc(P.story[i + 1] ? P.story[i + 1].name : '') + '으로 이어짐</p></div></section>' };
        return { id: sc.id, name: sc.name, html: '<section class="dsec" id="' + sc.id + '" data-scene="' + sc.name.toUpperCase() + '">' + head(no, sc.title, sc.lead) +
          '<div class="dsec__content dsec__stack">' + sc.blocks.map(block).join('') + '</div></section>' };
      });
    } else {
      var r = P.research, s = P.solution;
      sections = [
        { id: 'bg', name: 'Background', html: '<section class="dsec" id="bg" data-scene="BACKGROUND">' + head('01', 'Background', P.background.lead) +
          '<div class="dsec__content bg-grid"><div class="bg-text">' + P.background.body.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>' + stats(P.background.stats) + '</div></section>' },
        { id: 'research', name: 'Research', html: '<section class="dsec" id="research" data-scene="RESEARCH">' + head('02', 'Research &amp; Insight', r.lead) +
          '<div class="dsec__content"><div class="methods">' + r.methods.map(function (m) { return '<span class="chip">' + esc(m) + '</span>'; }).join('') + '</div>' +
          '<div class="r-grid"><div class="r-visual">' + visual(r.visual) + '</div>' +
          '<figure class="quote"><small>' + esc(r.quote.label) + '</small><blockquote>“' + esc(r.quote.text) + '”</blockquote><cite>— ' + esc(r.quote.by) + '</cite></figure></div>' +
          '<div class="findings">' + r.findings.map(function (f, i) { return '<div class="finding"><small>FINDING ' + two(i + 1) + '</small><p>' + esc(f) + '</p></div>'; }).join('') + '</div></div></section>' },
        { id: 'core', name: 'Core Problem', html: '<section class="dsec" id="core" data-scene="CORE PROBLEM"><div class="cp"><p class="cp__label"><i class="dot" aria-hidden="true"></i>03 · CORE PROBLEM</p>' +
          '<h2 class="cp__line"><s>' + esc(P.coreProblem.phen) + '</s><span class="arr" aria-hidden="true">→</span>' + esc(P.coreProblem.core) + '</h2>' +
          '<p class="cp__next">' + esc(P.coreProblem.next) + '</p><p class="cp__go">↓ 04 Solution으로 이어짐</p></div></section>' },
        { id: 'solution', name: 'Solution', html: '<section class="dsec" id="solution" data-scene="SOLUTION">' + head('04', 'Solution', s.lead) +
          '<div class="dsec__content"><div class="s-visual">' + visual(s.visual) + '</div>' +
          '<div class="scards">' + s.cards.map(function (c, i) { return '<div class="scard"><small>' + two(i + 1) + '</small><h4>' + esc(c[0]) + '</h4><p>' + esc(c[1]) + '</p></div>'; }).join('') + '</div></div></section>' },
        { id: 'decision', name: 'Decision', html: '<section class="dsec" id="decision" data-scene="DECISION">' + head('05', 'Decision', '처음 판단 → 확인한 근거 → 바꾼 방향') +
          '<div class="dsec__content decision">' +
          '<div><small>처음 판단</small><p>' + esc(P.decision[0]) + '</p></div><span class="arrow" aria-hidden="true">→</span>' +
          '<div><small>확인한 근거</small><p>' + esc(P.decision[1]) + '</p></div><span class="arrow" aria-hidden="true">→</span>' +
          '<div><small>바꾼 방향</small><p>' + esc(P.decision[2]) + '</p></div></div></section>' },
        { id: 'result', name: 'Result', html: '<section class="dsec" id="result" data-scene="RESULT">' + head('06', 'Result', '') +
          '<div class="dsec__content res-grid">' + stats(P.result.stats) + '<div class="learned"><small>LEARNED</small><p>' + esc(P.result.learned) + '</p></div></div></section>' }
      ];
    }
    var tail = '<nav class="pager" aria-label="이전 · 다음 프로젝트"><a href="project.html?id=' + prevId + '"><small>← PREVIOUS PROJECT</small><span>' + esc(D.projects[prevId].title) + '</span></a>' +
      '<a href="project.html?id=' + nextId + '"><small>NEXT PROJECT →</small><span>' + esc(D.projects[nextId].title) + '</span></a></nav>' +
      '<p class="back-list"><a class="tlink" href="works.html">프로젝트 목록으로 돌아가기</a></p>';

    root.innerHTML = topHtml +
      '<div class="wrap"><div class="d-body">' +
        '<nav class="pindex" aria-label="PROJECT INDEX"><h2>PROJECT INDEX</h2><ol>' +
          sections.map(function (x, i) { return '<li><a href="#' + x.id + '" data-sec="' + x.id + '"><b>' + two(i + 1) + '</b>' + x.name + '<i class="dot" aria-hidden="true"></i></a></li>'; }).join('') +
        '</ol></nav>' +
        '<div class="d-main">' + sections.map(function (x) { return x.html; }).join('') + tail + '</div>' +
      '</div></div>';

    /* 이미지 크게 보기 */
    root.addEventListener('click', function (e) {
      var b = e.target.closest('.g-open'); if (!b) return;
      var k = b.getAttribute('data-g');
      if (k === 'cover') openGallery([gallery.cover], 0); else { var kk = k.split(':'); openGallery(gallery[+kk[0]], +kk[1]); }
    });

    /* PROJECT INDEX 스크롤 스파이 */
    var links = $$('.pindex a'), secs = links.map(function (a) { return document.getElementById(a.getAttribute('data-sec')); });
    function idxSpy() {
      var y = window.innerHeight * 0.3, cur = secs[0].id;
      secs.forEach(function (sec) { if (sec.getBoundingClientRect().top <= y) cur = sec.id; });
      links.forEach(function (a) { a.setAttribute('aria-current', a.getAttribute('data-sec') === cur ? 'true' : 'false'); });
    }
    window.addEventListener('scroll', idxSpy, { passive: true }); idxSpy();
  }
  /* =========================================================
     섹션 진행 표시 — 왼쪽 아래 '03 / 06 장면 이름' + 하단 구간 막대
     (data-scene 이 붙은 섹션이 있는 페이지에서만 동작)
     ========================================================= */
  function initScenes() {
    var scenes = $$('[data-scene]');
    if (scenes.length < 2) return;
    var total = scenes.length;
    var wrap = document.createElement('div');
    wrap.className = 'scene';
    wrap.innerHTML = '<a class="scene__pill" href="#"><b class="scene__no">01</b><span class="scene__total">/ ' + two(total) + '</span><span class="scene__name"></span></a>' +
      '<div class="scene__bar" aria-hidden="true">' + scenes.map(function () { return '<span><i></i></span>'; }).join('') + '</div>';
    document.body.appendChild(wrap);
    var pill = $('.scene__pill', wrap), noEl = $('.scene__no', wrap), nameEl = $('.scene__name', wrap), segs = $$('.scene__bar i', wrap);
    pill.setAttribute('aria-label', '지금 보는 장면');
    function run() {
      var line = window.innerHeight * 0.4, cur = 0;
      scenes.forEach(function (sc, i) { if (sc.getBoundingClientRect().top <= line) cur = i; });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = total - 1;
      noEl.textContent = two(cur + 1);
      nameEl.textContent = scenes[cur].getAttribute('data-scene');
      pill.setAttribute('href', '#' + (scenes[cur].id || ''));
      segs.forEach(function (seg, i) {
        var r = scenes[i].getBoundingClientRect(), h = Math.max(r.height, 1);
        var f = i < cur ? 1 : i > cur ? 0 : Math.min(1, Math.max(0, (line - r.top) / h));
        seg.style.transform = 'scaleX(' + f + ')';
      });
      wrap.classList.toggle('is-on', window.scrollY > 40);
    }
    pill.addEventListener('click', function (e) {
      e.preventDefault();
      var line = window.innerHeight * 0.4, cur = 0;
      scenes.forEach(function (sc, i) { if (sc.getBoundingClientRect().top <= line) cur = i; });
      var next = scenes[Math.min(cur + 1, total - 1)];
      next.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
    window.addEventListener('scroll', run, { passive: true });
    window.addEventListener('resize', run);
    run();
  }
  initScenes();
})();
