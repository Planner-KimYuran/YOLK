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
    var bar = $('.gnb__bar i'); if (bar) { var max = document.documentElement.scrollHeight - window.innerHeight; bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')'; }
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  function setActive(key) {
    $$('[data-nav]').forEach(function (a) { a.setAttribute('aria-current', a.getAttribute('data-nav') === key ? 'true' : 'false'); });
  }
  setActive(page === 'home' ? '' : page === 'ai' ? 'ai' : 'projects');

  /* 온보딩 로딩 — 노른자 점 5개 (페이지를 열거나 새로고침할 때마다) */
  var loader = document.getElementById('loader');
  if (loader && document.documentElement.classList.contains('no-loader')) {
    loader.parentNode.removeChild(loader); loader = null;
    setTimeout(function () { document.dispatchEvent(new Event('yolk:ready')); }, 0);
  }
  /* GNB — 메뉴는 새로고침·온보딩 없이 이동, 로고만 처음부터(온보딩 포함) 다시 */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    var url; try { url = new URL(a.getAttribute('href'), location.href); } catch (er) { return; }
    if (url.origin !== location.origin) return;
    var file = function (p) { var f = p.split('/').pop(); return f === '' ? 'index.html' : f; };
    if (a.classList.contains('gnb__logo')) {
      e.preventDefault();
      try { sessionStorage.removeItem('yolk-nav'); } catch (er) {}
      var home = url.pathname.replace(/[^\/]*$/, '');
      if (file(location.pathname) === 'index.html' && !location.search) { history.replaceState(null, '', home); location.reload(); }
      else location.href = home;
      return;
    }
    var samePage = file(url.pathname) === file(location.pathname) && url.search === location.search;
    if (samePage && url.hash) {
      var t = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (t) {
        e.preventDefault();
        var g = document.querySelector('.gnb'); var gh = g ? g.getBoundingClientRect().height : 0;
        window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - gh, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        history.replaceState(null, '', url.hash);
        var burger = document.querySelector('.gnb__burger');
        if (burger && burger.getAttribute('aria-expanded') === 'true') burger.click();
        return;
      }
    }
    if (/\.html$/.test(file(url.pathname))) { try { sessionStorage.setItem('yolk-nav', '1'); } catch (er) {} }
  }, true);
  if (loader) {
    var t0 = Date.now();
    var hide = function () {
      setTimeout(function () {
        /* 1) 로딩 점과 문구가 먼저 조용히 사라지고 2) 로더가 걷힌 뒤 3) 메인이 순서대로 떠오름 — 두 화면이 겹치지 않음 */
        loader.classList.add('is-leaving');
        setTimeout(function () {
          if (!location.hash) window.scrollTo(0, 0);
          if (loader.parentNode) loader.parentNode.removeChild(loader);
          var r = document.documentElement; r.classList.add('is-enter'); r.classList.remove('is-intro');
          document.dispatchEvent(new Event('yolk:ready'));
          setTimeout(function () { r.classList.remove('is-enter'); }, 1800);
        }, 520);
      }, Math.max(0, 3000 - (Date.now() - t0)));
    };
    if (document.readyState === 'complete') hide(); else window.addEventListener('load', hide);
  }

  /* 노른자 토글 — 옐로우 포인트 컬러 켜기 · 끄기 */
  var egg = $('.egg');
  function setYolk(on, save) {
    var root = document.documentElement;
    if (on) root.setAttribute('data-accent', 'yolk'); else root.removeAttribute('data-accent');
    if (egg) { egg.setAttribute('aria-checked', on ? 'true' : 'false'); egg.setAttribute('aria-label', on ? '제작 과정 보기 끄기' : '이 웹사이트를 만든 과정 보기'); }
    if (save) { try { localStorage.setItem('yolk-accent', on ? 'on' : 'off'); } catch (e) {} }
  }
  setYolk(document.documentElement.getAttribute('data-accent') === 'yolk', false);
  if (egg) egg.addEventListener('click', function () { var on = document.documentElement.getAttribute('data-accent') !== 'yolk'; setYolk(on, true); document.dispatchEvent(new CustomEvent(on ? 'yolk:tour' : 'yolk:tour-off')); });

  /* 모바일 메뉴 (햄버거) */
  var burger = $('.gnb__burger'), navEl = $('#gnb-links');
  function setMenu(open) {
    if (!burger || !navEl) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    document.body.classList.toggle('is-menu', open);
  }
  if (burger) burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('.gnb__links a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && document.body.classList.contains('is-menu')) { setMenu(false); burger.focus(); } });

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
    modal.classList.remove('is-doc');
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
    if (!modal.classList.contains('is-doc')) lastFocus = document.activeElement;
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
  /* 이력서 · 자기소개서 — 문서 보기 (쪽을 이어서 스크롤 · 탭 전환 · 바로 다운로드) */
  function collectDocs() { return $$('[data-pages]').reduce(function (acc, b) {
    var f = b.getAttribute('data-file');
    if (!acc.some(function (d) { return d.file === f; })) acc.push({ title: b.getAttribute('data-pdf'), file: f, name: b.getAttribute('data-dl') || f, pages: b.getAttribute('data-pages').split(',') });
    return acc;
  }, []); }
  var DOCS = collectDocs();
  function openDoc(b) {
    DOCS = collectDocs();
    if (!modal) return;
    lastFocus = document.activeElement;
    galList = null;
    modal.classList.add('is-doc');
    showDoc(b.getAttribute('data-file'));
    modal.hidden = false; document.body.classList.add('is-locked');
    $('.modal__close', modal).focus();
  }
  function showDoc(file) {
    var d = DOCS.filter(function (x) { return x.file === file; })[0]; if (!d) return;
    var head = $('.modal__head', modal), bar = $('.modal__docbar', modal);
    if (!bar) {
      bar = document.createElement('div'); bar.className = 'modal__docbar';
      head.insertBefore(bar, $('.modal__acts', modal));
      var dl = document.createElement('a'); dl.className = 'modal__dl'; dl.innerHTML = '<span aria-hidden="true">↓</span> PDF<span class="modal__dl-t"> 다운로드</span>'; dl.setAttribute('aria-label', 'PDF 다운로드');
      $('.modal__acts', modal).insertBefore(dl, $('.modal__close', modal));
    }
    bar.innerHTML = '<div class="modal__tabs" role="tablist" aria-label="문서 선택">' + DOCS.map(function (x) {
      var on = x.file === d.file;
      return '<button type="button" role="tab" aria-selected="' + on + '" data-doc="' + esc(x.file) + '">' + esc(x.label || x.title.replace(/^김유란 · /, '').split(' · ').pop()) + '</button>';
    }).join('') + '</div><span class="modal__count">' + d.pages.length + '쪽</span>';
    $$('[data-doc]', bar).forEach(function (t) { t.addEventListener('click', function () { showDoc(t.getAttribute('data-doc')); }); });
    $('.modal__title', modal).textContent = d.title;
    var dla = $('.modal__dl', modal); dla.href = d.file; dla.setAttribute('download', d.name);
    var mv = $('.modal__view', modal);
    mv.innerHTML = '<div class="docpages">' + d.pages.map(function (src, i) {
      return '<figure class="docpage"><img src="' + esc(src) + '" alt="' + esc(d.title) + ' ' + (i + 1) + '쪽" loading="' + (i ? 'lazy' : 'eager') + '"><figcaption class="en">' + two(i + 1) + ' / ' + two(d.pages.length) + '</figcaption></figure>';
    }).join('') + '</div>';
    mv.scrollTop = 0;
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
    if (pages && modal) { openDoc(b); return; }
    modal && modal.classList.remove('is-doc');
    openPdf(b.getAttribute('data-pdf'), b.getAttribute('data-file') || null);
  });
  function shortName(p) { return p.cardTitle; }
  function pdfBtn(p, type, cls) {
    var doc = typeof type === 'object' ? type : (p.docs.filter(function (d) { return d.type === type; })[0] || {});
    if (typeof type === 'object') type = doc.type;
    var lab = doc.label || type;
    var attrs = ' data-pdf="' + esc(shortName(p) + ' · ' + lab) + '"' + (doc.file ? ' data-file="' + esc(doc.file) + '"' : '');
    if (doc.file && doc.pages) {
      var list = [], st = doc.pages.start || 1; for (var i = st; i < st + doc.pages.count; i++) list.push(doc.pages.prefix + ('00' + i).slice(-3) + '.jpg');
      attrs += ' data-dl="' + esc(doc.dl || doc.file) + '" data-pages="' + esc(list.join(',')) + '"';
    }
    return '<button type="button" class="' + cls + '"' + attrs + '>' + esc(lab) + ' 보기 ↗</button>' +
      (doc.file ? '<a class="' + cls + ' btn--line d-dl" href="' + esc(doc.file) + '" download="' + esc(doc.dl || doc.file) + '">' + esc(lab) + ' PDF ↓</a>' : '');
  }
  function docsSorted(p) { var seen = {}; return p.docs.map(function (d) { return d.type; }).filter(function (t) { if (seen[t]) return false; seen[t] = 1; return true; }); }
  function thumb(p, cls) {
    if (p.thumb && p.thumb.src) return '<div class="ph ph--img th-mood' + (cls ? ' ' + cls : '') + '"><img loading="lazy" src="' + esc(p.thumb.thumb || p.thumb.src) + '" alt="' + esc(p.cardTitle) + ' 대표 이미지">' + (p.short ? '<span class="th-name">' + esc(p.short) + '</span>' : '') + '</div>';
    var h = ph('THUMBNAIL', typeof p.cover === 'string' ? p.cover : '').replace('class="ph"', 'class="ph th-mood th-empty' + (cls ? ' ' + cls : '') + '"');
    return p.short ? h.replace(/<\/div>$/, '<span class="th-name">' + esc(p.short) + '</span></div>') : h;
  }
  function ph(label, sub) { return '<div class="ph" role="img" aria-label="' + esc(label + (sub ? ' — ' + sub : '') + ' 이미지 자리') + '"><span class="ph__label">' + esc(label) + (sub ? '<span class="ph__sub">' + esc(sub) + '</span>' : '') + '</span></div>'; }

  /* =========================================================
     HOME
     ========================================================= */
  /* =========================================================
     HOME — 히어로 · 대표 프로젝트 카드 · 프로필 요약
     ========================================================= */
  /* AI 페이지 — 단계 탭 · 프롬프트 비교 */
  if (page === 'ai') {
    var stabs = $$('.ai-steps [role="tab"]');
    var pick = function (t) { stabs.forEach(function (b) { var on = b === t; b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; document.getElementById(b.getAttribute('aria-controls')).hidden = !on; }); };
    stabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pick(t); });
      t.addEventListener('keydown', function (e) { var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!k) return; var n = stabs[(i + k + stabs.length) % stabs.length]; pick(n); n.focus(); e.preventDefault(); });
    });
    $$('[data-pr]').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-pr');
        $$('[data-pr]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        $$('[data-pr-view]').forEach(function (x) { x.hidden = x.getAttribute('data-pr-view') !== v; });
      });
    });
  }

  if (page === 'home') {
    var now = new Date(), nowYM = now.getFullYear() * 100 + now.getMonth() + 1;
    var isLive = function (p) { var m = String(p.period).match(/(\d{4})\.(\d{2})(?:\s*[—–-]\s*(\d{2}))?/); return m ? (+m[1] * 100 + +(m[3] || m[2])) > nowYM : false; };

    /* 대표 프로젝트 카드 */
    var pc = $('#pcards');
    if (pc) pc.innerHTML = D.mainOrder.map(function (id) {
      var p = D.projects[id], docs = docsSorted(p);
      return '<li><a class="pcard" href="project.html?id=' + id + '">' +
        '<div class="pcard__img">' + thumb(p) + '<span class="pcard__badge">' + esc(docs[0] || '프로젝트') + '</span></div>' +
        '<div class="pcard__body">' +
          '<ul class="chips">' + (p.homeTags || p.tags).map(function (t) { return '<li>' + esc(String(t).replace(/^#/, '')) + '</li>'; }).join('') + '</ul>' +
          '<h3 class="pcard__title">' + esc(p.cardTitle) + '</h3>' +
          '<p class="pcard__core">' + esc(p.core) + '</p>' +
          '<p class="pcard__sum">' + esc(p.summary || p.homeSummary) + '</p>' +
          '<p class="pcard__meta"><span><i class="ic ic--cal" aria-hidden="true"></i>' + esc(String(p.period).replace(/\s*—\s*/, ' ~ ')) + '</span><span><i class="ic ic--team" aria-hidden="true"></i>' + esc((p.homeInfo && p.homeInfo.role) || p.role) + '</span></p>' +
        '</div></a></li>';
    }).join('');

    /* 나의 이력 — 한 화면 요약 */
    var row = function (d, t, sub, lead) {
      return '<li><span class="xb__d en">' + esc(d) + '</span><span class="xb__t">' + esc(t) + (lead ? '<i class="xb__lead">리드</i>' : '') + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span></li>';
    };
    var fill = function (sel, html) { var el = $(sel); if (el) el.innerHTML = html; };
    fill('#xb-exp', D.experience.map(function (e) { return row(e.when.split(' · ')[0].split(/\s*—\s*/)[0], e.name, e.role, e.lead); }).join(''));
    fill('#xb-edu', D.education.map(function (r) { return row(r[0], r[1]); }).join(''));
    fill('#xb-award', D.awards.map(function (r) { var t = r[1].split(' · '); return row(r[0], t[0], t.slice(1).join(' · ')); }).join(''));
    fill('#xb-cert', D.certificates.map(function (r) { return row(r[0], r[1], r[2]); }).join(''));

    /* 나의 역량 */
    var kc = $('#kcard');
    if (kc) kc.innerHTML = '<h3 class="kcard__h">Main Skills</h3>' +
      D.skills.map(function (g, i) {
        return '<div class="krow"><p class="krow__k en"><span>' + two(i + 1) + '</span>' + esc(g[0]) + '</p><p class="krow__v">' + g[1].map(esc).join('<span class="krow__sep" aria-hidden="true"> · </span>') + '</p></div>';
      }).join('');
    var ka = $('#kai'); if (ka) ka.textContent = D.aiNote;
    var ks = $('#kstats');
    if (ks) {
      var lead = D.profile.leadCount || D.experience.filter(function (e) { return e.lead; }).length;
      ks.innerHTML = [[Object.keys(D.projects).length, '기획 프로젝트'], [D.awards.length, '수상 · 장학'], [lead, '팀장 · 리드 경험']].map(function (s) {
        return '<li><b class="en">' + s[0] + '</b><span>' + s[1] + '</span></li>';
      }).join('');
    }

    /* 메뉴 위치 표시 */
    var secs = ['experience', 'projects', 'skills', 'ai-intro', 'contact'].map(function (k) { return document.getElementById(k); }).filter(Boolean);
    var spy = function () {
      var cur = '', mid = window.innerHeight * 0.35;
      secs.forEach(function (sec) { if (sec.getBoundingClientRect().top <= mid) cur = sec.id; });
      setActive(cur === 'ai-intro' ? 'ai' : cur);
    };
    window.addEventListener('scroll', spy, { passive: true }); spy();
  }

  /* ---------- 모든 페이지 공통: 메일 · 놀이터 · 구역 맞춤 ---------- */
  (function () {
    /* 연락하기 — 폼 없이 메일 쓰기 창으로 바로 이동 (Gmail · 네이버 · 기본 메일 앱) */
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-mail]'); if (!a) return;
      var to = (D.profile && D.profile.email) || 'knewrun25@gmail.com', kind = a.getAttribute('data-mail');
      var sub = '[포트폴리오] 김유란 님께 드리는 연락';
      if (kind === 'app') return; // mailto 그대로
      e.preventDefault();
      if (kind === 'gmail') {
        window.open('https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(to) + '&su=' + encodeURIComponent(sub), '_blank', 'noopener');
      } else if (kind === 'naver') {
        try { navigator.clipboard && navigator.clipboard.writeText(to).catch(function () {}); } catch (err) {}
        window.open('https://mail.naver.com/v2/new', '_blank', 'noopener');
        toast('받는 사람 주소가 복사되었습니다. 받는 사람 칸에 붙여넣어 주세요.');
      }
    });

    /* 놀이터 입장 — 비밀번호 확인 → 로딩 → 놀이터로 이동 (지인 전용, 정식 보안이 아닌 가벼운 잠금) */
    (function () {
      var H = 'd2967f9c27227eca434ed735fbdee3743864f8578e9204429c351bab91a67b2f';
      var gate = null, inp, boxes, err, pin;
      function sha(t) { return crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)).then(function (b) { return [].map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }); }
      function build() {
        gate = document.createElement('div'); gate.className = 'pgate'; gate.hidden = true;
        gate.innerHTML = '<div class="pgate__card" role="dialog" aria-modal="true" aria-labelledby="pg-t"><button type="button" class="pgate__x" aria-label="닫기">✕</button>' +
          '<p class="pgate__en">PLAYGROUND</p><h2 id="pg-t">지인 전용 놀이터</h2><p>비밀번호 네 자리를 입력하면 들어갈 수 있어요.</p>' +
          '<form novalidate><div class="pgate__pin"><span></span><span></span><span></span><span></span><input inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" aria-label="비밀번호 네 자리"></div>' +
          '<p class="pgate__err" role="alert"></p><button type="submit" class="pgate__go">입장하기</button></form></div>';
        document.body.appendChild(gate);
        inp = gate.querySelector('input'); boxes = gate.querySelectorAll('.pgate__pin span'); err = gate.querySelector('.pgate__err'); pin = gate.querySelector('.pgate__pin');
        function paint() { var v = inp.value; [].forEach.call(boxes, function (b, i) { b.textContent = v[i] ? '●' : ''; b.classList.toggle('on', !!v[i]); b.classList.toggle('cur', i === v.length); }); }
        inp.addEventListener('input', function () { inp.value = inp.value.replace(/\D/g, '').slice(0, 4); err.textContent = ''; paint(); if (inp.value.length === 4) check(); });
        gate.querySelector('form').addEventListener('submit', function (e) { e.preventDefault(); check(); });
        gate.querySelector('.pgate__x').addEventListener('click', close);
        gate.addEventListener('click', function (e) { if (e.target === gate) close(); });
        gate.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
        paint(); paintPin = paint;
      }
      var paintPin = function () {};
      function check() {
        if (inp.value.length < 4) { err.textContent = '네 자리를 모두 입력해 주세요.'; return; }
        sha('yolk-play:' + inp.value).then(function (h) {
          if (h !== H) { err.textContent = '비밀번호가 달라요. 다시 입력해 주세요.'; pin.classList.remove('shake'); void pin.offsetWidth; pin.classList.add('shake'); inp.value = ''; paintPin(); inp.focus(); return; }
          try { sessionStorage.setItem('yolk-play', '1'); } catch (e) {}
          gate.hidden = true;
          var ld = document.createElement('div'); ld.className = 'loader'; ld.setAttribute('role', 'status'); ld.setAttribute('aria-label', '놀이터로 이동하는 중');
          ld.innerHTML = '<div class="loader__dots"><i></i><i></i><i></i><i></i><i></i></div><p class="loader__t">김유란의 놀이터</p>';
          document.body.appendChild(ld);
          setTimeout(function () { location.href = 'play/'; }, 1600);
        });
      }
      function open() { if (!gate) build(); gate.hidden = false; inp.value = ''; paintPin(); err.textContent = ''; setTimeout(function () { inp.focus(); }, 30); }
      function close() { gate.hidden = true; }
      document.addEventListener('click', function (e) { if (e.target.closest('[data-play]')) { e.preventDefault(); open(); } });
    })();

    /* HOME 구역 맞춤 — 한 구역의 내용이 화면(GNB 아래)보다 길면 그 구역만 살짝 축소해 한 화면 안에 담음 */
    (function () {
      var root = document.documentElement, main = document.getElementById('main');
      if (!main || !(document.getElementById('home') || main.classList.contains('ax'))) return;
      var secs = [].slice.call(main.querySelectorAll(':scope > .sx'));
      function fit() {
        var on = innerWidth >= 1024 && innerHeight >= 560;
        root.classList.toggle('home-fit', on);
        secs.forEach(function (s) {
          var w = s.querySelector(':scope > .wrap'); if (!w) return;
          var kids = [].slice.call(w.children); kids.forEach(function (k) { k.style.zoom = ''; });
          if (!on || s.hidden) return;
          var g = (document.querySelector('.gnb') || {}).offsetHeight || 0, cs = getComputedStyle(s);
          var avail = innerHeight - g - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
          var z = 1, h = w.getBoundingClientRect().height;
          /* 좌우 여백은 그대로 두고 안쪽 내용만 줄임 → 모든 구역의 양옆 마진이 같음 */
          for (var k = 0; k < 6 && h > avail + 1 && z > 0.8; k++) { z = Math.max(0.8, z * (avail / h) - 0.003); kids.forEach(function (c) { c.style.zoom = z.toFixed(3); }); h = w.getBoundingClientRect().height; }
        });
      }
      fit(); addEventListener('resize', function () { clearTimeout(fit.t); fit.t = setTimeout(fit, 120); });
      if (window.ResizeObserver) { var ro = new ResizeObserver(function () { clearTimeout(fit.r); fit.r = setTimeout(fit, 150); }); secs.forEach(function (s) { var w = s.querySelector(':scope > .wrap'); if (w) ro.observe(w); }); }
      [].forEach.call(document.querySelectorAll('#main img'), function (im) { if (!im.complete) im.addEventListener('load', function () { clearTimeout(fit.r); fit.r = setTimeout(fit, 150); }); });
      addEventListener('load', fit); if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    })();

  })();


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
    var typeCodes = { plan: '기획서', report: '보고서', wire: '화면설계서', proposal: '제안서', vibe: '바이브코딩' };
    var typeCode = function (t) { for (var k in typeCodes) if (typeCodes[k] === t) return k; };
    var saved = store.get('yolk-works') || {};
    var q = new URLSearchParams(location.search);
    var state = { type: typeCodes[q.get('type')] || (q.get('type') ? 'ALL' : saved.type) || 'ALL', sort: saved.sort || 'NEWEST' };
    var ids = Object.keys(D.projects);
    var gridEl = $('#grid'), countEl = $('#count');
    var sortLabels = { NEWEST: '최신순', OLDEST: '오래된순', NAME: '이름순' };
    function ordered() {
      var cur = D.curatedOrder;
      var list = ids.filter(function (id) { var pj = D.projects[id]; return state.type === 'ALL' || (state.type === '바이브코딩' ? !!pj.vibe : pj.docs.some(function (d) { return d.type === state.type; })); });
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
            '<span class="card__docs">' + docsSorted(p).map(function (t) { var n = p.docs.filter(function (d) { return d.type === t && d.file; }).length; return '<span class="tag-doc">' + t + (n > 1 ? ' <b>' + n + '</b>' : '') + '</span>'; }).join('') + (p.vibe ? '<span class="tag-doc tag-doc--vibe">바이브코딩</span>' : '') + '</span>' +
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
    (function () {
      var cnt = {}, all = 0; ids.forEach(function (id) { D.projects[id].docs.forEach(function (d) { if (!d.file) return; cnt[d.type] = (cnt[d.type] || 0) + 1; all++; }); if (D.projects[id].vibe) cnt['바이브코딩'] = (cnt['바이브코딩'] || 0) + 1; });
      $$('.fchip[data-type]').forEach(function (b) { var t = b.getAttribute('data-type'); var n = t === 'ALL' ? 0 : (cnt[t] || 0); if (t === 'ALL') return; if (!n) { b.hidden = true; return; } b.insertAdjacentHTML('beforeend', ' <em class="fchip__n">' + n + '</em>'); });
      var sum = $('#doc-sum'); if (sum) sum.innerHTML = D.docTypes.filter(function (t) { return cnt[t]; }).map(function (t) { return '<span><b>' + cnt[t] + '</b>' + t + '</span>'; }).join('');
    })();
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
    var P = D.projects[id], keys = (D.curatedOrder || []).filter(function (k) { return D.projects[k]; }), idx = keys.indexOf(id);
    if (idx < 0) { keys = Object.keys(D.projects).sort(); idx = keys.indexOf(id); }
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
        '<div class="d-nav"><a class="tlink" href="works.html" id="back-top">← BACK TO PROJECTS</a><span>(PROJECT ' + two(idx + 1) + ' / ' + two(keys.length) + ')</span></div>' +
        (P.question ? '<div class="d-q"><p class="d-q__eyebrow">(' + esc(P.tagline || '') + ')</p><p class="d-q__line">' + P.question.join('<br>') + '</p></div>' : '') +
        coverHtml +
        '<p class="d-tags">' + P.tags.map(esc).join(' ') + '</p>' +
        '<h1 class="d-title" id="d-title">' + esc(P.title) + '</h1>' +
        '<p class="d-sum">' + esc(P.summary) + '</p>' +
        '<div class="the-core"><i class="dot" aria-hidden="true"></i><div><small>THE CORE · 이 프로젝트에서 찾아낸 핵심</small><p>' + esc(P.core) + '</p></div></div>' +
        '<dl class="d-info"><div><dt>PERIOD</dt><dd>' + esc(P.period) + '</dd></div><div><dt>TEAM</dt><dd>' + esc(P.team) + '</dd></div><div><dt>MY ROLE</dt><dd>' + esc(P.role) + '</dd></div><div><dt>DELIVERABLE</dt><dd>' + esc(P.deliverable) + '</dd></div>' +
          (P.course ? '<div><dt>COURSE</dt><dd>' + esc(P.course) + '</dd></div>' : '') + '</dl>' +
        '<div class="d-docs">' + P.docs.filter(function (d) { return d.file; }).map(function (d, i) { return '<span class="d-doc">' + pdfBtn(P, d, 'btn' + (i ? ' btn--line' : '')) + '</span>'; }).join('') + '</div>' +
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
        case 'gallery': var gset = gallery.push(b.items) - 1;
          var fig = function (it, gi) { return '<figure><button type="button" class="g-open" data-g="' + gset + ':' + gi + '" aria-label="' + esc(it.cap) + ' 크게 보기"><img loading="lazy" src="' + esc(it.thumb || it.src) + '" alt="' + esc(it.cap) + '"><span class="g-zoom" aria-hidden="true">크게 보기 ⤢</span></button><figcaption>' + esc(it.cap) + '</figcaption></figure>'; };
          var LIM = 8, cls = 'b gal' + (b.grid ? ' gal--grid' : '');
          if (b.items.length <= LIM + 2) return '<div class="' + cls + '">' + b.items.map(fig).join('') + '</div>';
          return '<div class="' + cls + '">' + b.items.slice(0, LIM).map(fig).join('') + '</div>' +
            '<details class="dmore dmore--gal"><summary><span class="dmore__t">나머지 ' + (b.items.length - LIM) + '장 더 보기</span><i aria-hidden="true"></i></summary><div class="' + cls + '">' + b.items.slice(LIM).map(function (it, k) { return fig(it, k + LIM); }).join('') + '</div></details>';
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
        case 'vibe': return '<div class="b vibe">' + lab(b.title) +
          '<ol class="vibe__flow" style="--n:' + b.flow.length + '">' + b.flow.map(function (f, i) { return '<li><span class="en">' + two(i + 1) + '</span><b>' + esc(f[0]) + '</b><p>' + esc(f[1]) + '</p></li>'; }).join('') + '</ol>' +
          (b.log ? '<div class="vibe__log"><p class="vibe__h en">' + esc(b.logTitle || 'VERSION LOG') + '</p>' + b.log.map(function (r) { return '<div class="vibe__row"><span class="en">' + esc(r[0]) + '</span><p>' + esc(r[1]) + '</p></div>'; }).join('') + '</div>' : '') +
          (b.ask ? '<figure class="vibe__ask"><figcaption class="en">' + esc(b.askTitle || 'HOW I ASK') + '</figcaption><pre>' + esc(b.ask) + '</pre></figure>' : '') +
          note(b.note) + '</div>';
        case 'learned': return '<div class="b learned"><small>LEARNED</small><p>' + esc(b.text) + '</p></div>';
        case 'video': return '<div class="b">' + lab(b.title) + '<figure class="vid"><video controls playsinline preload="none" poster="' + esc(b.poster) + '"><source src="' + esc(b.src) + '" type="video/mp4"></video>' + (b.cap ? '<figcaption>' + esc(b.cap) + '</figcaption>' : '') + '</figure></div>';
        case 'proto': return '<div class="b">' + lab(b.title) + '<div class="protos">' + b.items.map(function (it) {
            return '<article class="proto"><button type="button" class="proto__shot" data-proto="' + esc(it.src) + '" data-title="' + esc(it.name) + '" aria-label="' + esc(it.name) + ' 직접 체험하기"><img loading="lazy" src="' + esc(it.img) + '" alt=""><span class="proto__play">▶ 직접 체험하기</span></button>' +
              '<div class="proto__body"><small>' + esc(it.kicker) + '</small><h4>' + esc(it.name) + '</h4><p>' + esc(it.desc) + '</p>' +
              '<div class="proto__acts"><button type="button" class="btn btn--sm" data-proto="' + esc(it.src) + '" data-title="' + esc(it.name) + '">체험하기 ▶</button><a class="btn btn--sm btn--line" href="' + esc(it.src) + '" target="_blank" rel="noopener">새 창에서 크게 ↗</a></div>' +
              (it.note ? '<p class="proto__note">' + esc(it.note) + '</p>' : '') + '</div></article>';
          }).join('') + '</div>' + note(b.note) + '</div>';
        case 'versus':
          var mx = b.max || Math.max.apply(null, b.rows.map(function (r) { return Math.max(r[1], r[2]); }));
          return '<div class="b">' + lab(b.title) + '<div class="vs"><p class="vs__legend"><span><i class="vs__a"></i>' + esc(b.a || '1차') + '</span><span><i class="vs__b"></i>' + esc(b.b || '2차') + '</span></p>' +
            b.rows.map(function (r) { return '<div class="vs__row"><span class="vs__name">' + esc(r[0]) + '</span><div class="vs__bars"><span class="vs__bar vs__bar--a" style="width:' + (r[1] / mx * 100) + '%"><em>' + r[1] + (b.unit || '') + '</em></span><span class="vs__bar vs__bar--b" style="width:' + (r[2] / mx * 100) + '%"><em>' + r[2] + (b.unit || '') + '</em></span></div></div>'; }).join('') +
            '</div>' + note(b.note) + '</div>';
        case 'kpi': return '<div class="b">' + lab(b.label) + '<div class="kpis">' + b.items.map(function (k) { return '<div class="kpi"><small>' + esc(k[0]) + '</small><p><span class="kpi__a">' + esc(k[1]) + '</span><span class="kpi__arr" aria-hidden="true">→</span><b class="kpi__b">' + esc(k[2]) + '</b></p><span class="kpi__d">' + esc(k[3] || '') + '</span></div>'; }).join('') + '</div>' + note(b.note) + '</div>';
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
        /* 간결하게: 핵심(첫 블록 · 숫자 · 강조 · 이미지 · 체험)은 바로 보이고, 표 · 긴 설명 같은 근거는 '자세히 보기' 안으로 */
        var KEEP = { visual: 1, gallery: 1, video: 1, proto: 1, kpi: 1, versus: 1, stats: 1, callout: 1, learned: 1, vibe: 1 };
        var prim = [], more = [];
        sc.blocks.forEach(function (b, bi) { (bi === 0 || KEEP[b.t] ? prim : more).push(b); });
        if (more.length === 1 && more[0].t === 'chips') { prim.push(more[0]); more = []; }
        return { id: sc.id, name: sc.name, html: '<section class="dsec" id="' + sc.id + '" data-scene="' + sc.name.toUpperCase() + '">' + head(no, sc.title, sc.lead) +
          '<div class="dsec__content dsec__stack">' + prim.map(block).join('') +
          (more.length ? '<details class="dmore"><summary><span class="dmore__t">근거 · 과정 자세히 보기</span><span class="dmore__n">' + more.length + '</span><i aria-hidden="true"></i></summary><div class="dsec__stack dmore__body">' + more.map(block).join('') + '</div></details>' : '') +
          '</div></section>' };
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

/* 푸터 BACK TO TOP */
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('.ft__top');
  if (!a) return; e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* 프로토타입 직접 체험 (전체 화면) */
(function () {
  var box = null;
  function close() { if (!box) return; box.remove(); box = null; document.documentElement.style.overflow = ''; }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-proto]'); if (!b) return;
    e.preventDefault();
    var src = b.getAttribute('data-proto'), title = b.getAttribute('data-title') || '';
    box = document.createElement('div'); box.className = 'pmodal'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', title + ' 프로토타입');
    box.innerHTML = '<div class="pmodal__bar"><b>' + title.replace(/</g, '&lt;') + '</b><span class="pmodal__hint">화면 안을 직접 눌러 보세요</span><a href="' + src + '" target="_blank" rel="noopener">새 창 ↗</a><button type="button" class="pmodal__x" aria-label="닫기">✕</button></div>' +
      '<div class="pmodal__load">프로토타입을 불러오는 중…</div><iframe src="' + src + '" title="' + title.replace(/"/g, '') + '" allow="fullscreen" allowfullscreen></iframe>';
    document.body.appendChild(box); document.documentElement.style.overflow = 'hidden';
    box.querySelector('iframe').addEventListener('load', function () { var l = box && box.querySelector('.pmodal__load'); if (l) l.remove(); });
    box.querySelector('.pmodal__x').addEventListener('click', close); box.querySelector('.pmodal__x').focus();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();

/* 문서 유형별 개수 (홈 · 프로젝트) */
(function () {
  var D = window.YOLK; if (!D) return;
  var cnt = {}, pj = 0;
  Object.keys(D.projects).forEach(function (id) { pj++; D.projects[id].docs.forEach(function (d) { if (d.file) cnt[d.type] = (cnt[d.type] || 0) + 1; }); });
  var html = '<span class="doc-sum__pj"><b>' + pj + '</b>프로젝트</span>' + D.docTypes.filter(function (t) { return cnt[t]; }).map(function (t) { return '<a href="works.html?type=' + ({ '기획서': 'plan', '보고서': 'report', '화면설계서': 'wire', '제안서': 'proposal', '발표자료': 'deck' })[t] + '"><b>' + cnt[t] + '</b>' + t + '</a>'; }).join('');
  document.querySelectorAll('[data-doc-sum], #doc-sum').forEach(function (el) { el.innerHTML = html; });
})();

/* 제작 과정 투어 — 노른자 토글을 켜면 시작 · 반투명 · 자동 진행 */
(function () {
  var page = document.body.getAttribute('data-page');
  var STEPS = {
    home: [
      ['#home', '한 문장으로 나를 정의했어요', '‘판을 계획하고, 핵심만 남기는 노른자 같은 기획자’. 첫 화면엔 이 한 문장만 두어, 처음 보는 사람도 몇 초 안에 저를 기억하게 했어요.'],
      ['#experience', '많이보다, 한눈에', '이력을 길게 늘어놓지 않고 한 화면에 담았어요. 많이 담기보다 핵심만 남기는 제 방식을 이력 구성 자체로 보여주고 싶었어요.'],
      ['#projects', '결과보다 판단의 과정', '프로젝트마다 ‘제가 찾은 핵심’ 한 줄과 원본 문서를 붙였어요. 예쁜 결과물보다 어떻게 판단했는지를 보여주는 기획자이고 싶어서요.'],
      ['#skills', '증거로 말하기', '할 줄 아는 것을 나열하지 않고, 실제로 어디에 썼는지로 연결했어요.'],
      ['#ai-intro', 'AI와 함께, 판단은 제가', '기획 문서는 직접 쓰고 구현은 AI와 함께했어요. 무엇을 맡기고 무엇을 지켰는지까지 저를 설명하는 일부라고 생각했어요.'],
      ['.yb-launch', '저를 대신 소개하는 노른자', '궁금한 것부터 물어볼 수 있게 노른자 봇을 만들었어요. 제 이력서 · 자기소개서 · 프로젝트에 있는 내용으로만 답해요.'],
      ['#contact', '흰 바탕, 노른자 하나', '색은 흰 바탕과 노른자 포인트만 썼어요. 군더더기 없는 화면 자체가 ‘핵심만 남긴다’는 제 태도예요.']
    ],
    works: [
      ['.page-head', '문서로 증명하는 사람', '말보다 문서로 보여주고 싶었어요. 기획서 · 보고서 · 화면설계서 원본을 그대로 열고 받을 수 있게 했어요.'],
      ['#grid', '카드마다 핵심 한 줄', '프로젝트를 고를 때도 제가 찾은 핵심이 먼저 보이도록 카드마다 한 줄을 적었어요.']
    ],
    detail: [
      ['.d-top', '질문에서 시작하는 기획자', '모든 프로젝트를 제가 던진 질문 하나로 시작했어요. 저는 답보다 좋은 질문을 먼저 찾는 사람이에요.'],
      ['.d-docs', '과정을 숨기지 않기', '완성본만이 아니라 기획서 · 화면설계서 원본을 함께 열어 두었어요.'],
      ['.dsec', '현상 → 핵심 → 해결', '배경에서 핵심 문제를 거쳐 결과까지, 제가 생각하는 순서 그대로 읽히게 구성했어요.']
    ],
    ai: [
      ['.ai-hero', 'AI를 다루는 방식도 나', 'AI에게 맡기지 않고 AI와 판을 짠다 — 이 페이지는 제 일하는 방식을 그대로 보여주는 기록이에요.'],
      ['.ai-sec', '맡기는 것과 지키는 것', '단계마다 제가 하는 일과 AI에게 맡기는 일을 나눠, 판단은 끝까지 제가 한다는 걸 보여주고 싶었어요.']
    ]
  };
  var steps = STEPS[page] || STEPS.home, i = 0, box = null, lit = null, timer = null, t0 = 0, paused = false, DUR = 6500, raf = 0;
  function q(sel) { return document.querySelector(sel); }
  function clear() { if (lit) lit.classList.remove('tour-lit'); lit = null; }
  function tick() {
    if (!box) return;
    var el = box.querySelector('.tour__bar i');
    if (!paused) { var p = Math.min(1, (Date.now() - t0) / DUR); el.style.width = (p * 100) + '%'; if (p >= 1) { if (i < steps.length - 1) { i++; show(); } else { paused = true; setPlay(); } } }
    else t0 = Date.now() - (parseFloat(el.style.width) || 0) / 100 * DUR;
    raf = requestAnimationFrame(tick);
  }
  function setPlay() { var b = box && box.querySelector('[data-t="play"]'); if (b) { b.textContent = paused ? '▶' : '❚❚'; b.setAttribute('aria-label', paused ? '자동 진행 재생' : '자동 진행 일시정지'); } }
  function show() {
    clear();
    var st = steps[i], el = q(st[0]);
    if (el) { el.classList.add('tour-lit'); lit = el; el.scrollIntoView({ behavior: 'smooth', block: el.classList.contains('yb-launch') ? 'nearest' : 'start' }); }
    box.querySelector('h3').textContent = st[1];
    box.querySelector('p').textContent = st[2];
    box.querySelector('.tour__step').textContent = ('0' + (i + 1)).slice(-2) + ' / ' + ('0' + steps.length).slice(-2);
    box.querySelector('.tour__bar i').style.width = '0%';
    t0 = Date.now();
  }
  function end() { clear(); cancelAnimationFrame(raf); if (box) { box.remove(); box = null; } }
  function start() {
    end(); i = 0; paused = false;
    box = document.createElement('section'); box.className = 'tour'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', '이 웹사이트로 나를 표현한 방식');
    box.innerHTML = '<div class="tour__top"><span class="tour__k">MAKING OF · 나를 표현한 방식</span><button type="button" class="tour__x" data-t="close" aria-label="닫기">✕</button></div><h3></h3><p aria-live="polite"></p><div class="tour__bar" aria-hidden="true"><i></i></div><div class="tour__acts"><span class="tour__step"></span><button type="button" data-t="prev" aria-label="이전">←</button><button type="button" data-t="play"></button><button type="button" data-t="next" aria-label="다음">→</button></div>';
    document.body.appendChild(box); setPlay();
    box.addEventListener('mouseenter', function () { box.dataset.hover = '1'; paused = true; });
    box.addEventListener('mouseleave', function () { if (box.dataset.hover) { delete box.dataset.hover; if (!box.dataset.user) paused = false; } });
    box.addEventListener('click', function (e) {
      var t = e.target.closest('[data-t]'); if (!t) return;
      var a = t.getAttribute('data-t');
      if (a === 'close') { end(); return; }
      if (a === 'prev' && i > 0) { i--; show(); }
      if (a === 'next') { if (i < steps.length - 1) { i++; show(); } }
      if (a === 'play') { paused = !paused; if (paused) box.dataset.user = '1'; else { delete box.dataset.user; if (i === steps.length - 1 && box.querySelector('.tour__bar i').style.width === '100%') { i = 0; show(); } } setPlay(); }
    });
    show(); raf = requestAnimationFrame(tick);
  }
  document.addEventListener('yolk:tour', start);
  document.addEventListener('yolk:tour-off', end);
  document.addEventListener('keydown', function (e) { if (!box) return; if (e.key === 'Escape') end(); if (e.key === 'ArrowRight' && i < steps.length - 1) { i++; show(); } if (e.key === 'ArrowLeft' && i > 0) { i--; show(); } });
})();

/* 메인 첫 화면 — '핵심'에 얇은 밑줄이 그어지는 모션 */
(function () {
  var core = document.getElementById('hx-core'); if (!core) return;
  var done = false;
  function go() { if (done) return; done = true; core.classList.add('is-drawn'); }
  document.addEventListener('yolk:ready', function () { setTimeout(go, 150); });
  if (!document.getElementById('loader')) {
    if (document.readyState === 'complete') setTimeout(go, 400); else addEventListener('load', function () { setTimeout(go, 400); });
  }
})();
