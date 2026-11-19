/* 응원 한마디 — 닉네임 · 메시지는 공개(cheers), 실명 · 연락처는 비공개(cheers_private, 콘솔에서 본인만 열람) */
const cfg = window.YOLK_FIREBASE;
const $ = (s) => document.querySelector(s);
const form = $('#chr-form'), list = $('#chr-list'), total = $('#chr-total'), err = $('#chr-err');
const sec = document.getElementById('cheer');
if (form && (cfg || new URLSearchParams(location.search).has('cheer'))) {
  sec.hidden = false;
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (d) => d ? d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0') : '방금';
  const toast = (m) => { const t = document.querySelector('.toast'); if (t) { (t.querySelector('span') || t).textContent = m; t.classList.add('is-on'); setTimeout(() => t.classList.remove('is-on'), 2600); } };
  const count = form.querySelector('.chr__count');
  form.msg.addEventListener('input', () => { count.textContent = form.msg.value.length + ' / 300'; });
  const render = (items) => {
    total.textContent = items.length ? items.length + '개' : '';
    list.innerHTML = items.length ? items.map((x) => '<li class="chr__item"><div class="chr__meta"><b>' + esc(x.nick) + '</b><time>' + fmt(x.ts) + '</time></div><p>' + esc(x.msg).replace(/\n/g, '<br>') + '</p></li>').join('')
      : '<li class="chr__empty">아직 응원이 없어요. 첫 번째 응원을 남겨 주세요!</li>';
  };
  let db = null, fs = null, live = [], pending = [];
  const PKEY = 'yolk-cheer-preview';
  const draw = () => { const ids = new Set(live.map((x) => x.id)); pending = pending.filter((x) => !ids.has(x.id)); render(pending.concat(live)); };
  if (!cfg) {
    try { live = JSON.parse(localStorage.getItem(PKEY) || '[]').map((x) => ({ ...x, ts: x.ts ? new Date(x.ts) : null })); } catch (e) { live = []; }
    draw();
  } else {
    try {
      const [{ initializeApp }, F] = await Promise.all([
        import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
      ]);
      fs = F; db = F.getFirestore(initializeApp(cfg));
      F.onSnapshot(F.query(F.collection(db, 'cheers'), F.orderBy('ts', 'desc'), F.limit(50)), (snap) => {
        live = snap.docs.map((d) => { const v = d.data({ serverTimestamps: 'estimate' }); return { id: d.id, nick: v.nick, msg: v.msg, ts: v.ts && v.ts.toDate ? v.ts.toDate() : new Date() }; }); draw();
      }, () => { list.innerHTML = '<li class="chr__empty">응원을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</li>'; });
    } catch (e) { list.innerHTML = '<li class="chr__empty">응원을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</li>'; }
  }
  let sending = false;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    const nick = form.nick.value.trim(), msg = form.msg.value.trim(), name = form.name.value.trim(), phone = form.phone.value.trim();
    form.nick.setAttribute('aria-invalid', nick ? 'false' : 'true'); form.msg.setAttribute('aria-invalid', msg ? 'false' : 'true');
    if (!nick || !msg) { err.hidden = false; (nick ? form.msg : form.nick).focus(); return; }
    err.hidden = true;
    if (!db) {
      /* 저장소 연결 전 미리보기: 이 브라우저에만 바로 올라감 */
      const item = { id: 'p' + Date.now(), nick: nick.slice(0, 20), msg: msg.slice(0, 300), ts: new Date() };
      live = [item].concat(live); draw();
      try { localStorage.setItem(PKEY, JSON.stringify(live.slice(0, 50))); } catch (e) {}
      form.reset(); count.textContent = '0 / 300'; toast('응원이 올라갔어요. (미리보기 — 아직 이 브라우저에만 보여요)');
      return;
    }
    sending = true; const btn = form.querySelector('.chr__send'); btn.disabled = true; btn.textContent = '보내는 중…';
    try {
      const ref = fs.doc(fs.collection(db, 'cheers'));
      pending = [{ id: ref.id, nick: nick.slice(0, 20), msg: msg.slice(0, 300), ts: new Date() }].concat(pending); draw();
      const b = fs.writeBatch(db);
      b.set(ref, { nick: nick.slice(0, 20), msg: msg.slice(0, 300), ts: fs.serverTimestamp() });
      if (name || phone) b.set(fs.doc(db, 'cheers_private', ref.id), { nick: nick.slice(0, 20), name: name.slice(0, 30), phone: phone.slice(0, 20), ts: fs.serverTimestamp() });
      await b.commit();
      form.reset(); count.textContent = '0 / 300'; toast('응원이 전달되었어요. 고마워요!');
    } catch (e2) { pending = []; draw(); toast('보내지 못했어요. 잠시 후 다시 시도해 주세요.'); }
    sending = false; btn.disabled = false; btn.textContent = '응원 보내기';
  });
}
