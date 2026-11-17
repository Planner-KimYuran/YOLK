/* 노른자 봇 — 김유란을 소개하는 챗봇
   서버 없이 동작합니다. 답변은 이력서 · 자기소개서 · AI 페이지 · 프로젝트 데이터에 있는 내용만 씁니다. */
(function () {
  if (window.__yolkbot) return; window.__yolkbot = true;

  var L = function (href, text) { return '<a href="' + href + '">' + text + '</a>'; };

  /* ---------- 지식: 의도 · 키워드 · 답변 · 이어서 물어볼 것 ---------- */
  var KB = [
    { id: 'hi', label: '안녕!', keys: ['안녕', '하이', '반가', 'hello', 'hi', '헬로'],
      a: ['안녕하세요! 저는 <b>노른자 봇</b>이에요 🍳', '기획자 <b>김유란</b>에 대해서라면 뭐든 알려드릴게요. 아래에서 골라도 되고, 편하게 물어봐도 돼요.'],
      next: ['who', 'way', 'je', 'ai'] },

    { id: 'who', label: '김유란은 어떤 기획자야?', keys: ['누구', '소개', '어떤 기획자', '어떤 사람', '자기소개', '한마디', '노른자', '슬로건', '정체'],
      a: ['김유란은 <b>판을 계획하고, 핵심만 남기는 노른자 같은 기획자</b>예요.',
          '달걀은 겉모습이 다 비슷하지만, 깨 보면 전체를 지탱하는 노른자가 있죠. 유란은 겉으로 드러난 현상 안에서 서비스 전체를 지탱하는 <b>진짜 문제</b>를 찾는 데 집중해요.',
          '계원예술대학교 디지털미디어디자인과 <b>기획 세부전공</b>으로, UX/UI · 서비스 기획을 해요.'],
      next: ['way', 'je', 'strength', 'projects'] },

    { id: 'way', label: '일하는 방식이 궁금해', keys: ['방식', '일하', '일을', '작업 방식', '프로세스', '과정', '어떻게 일', '접근', '스타일로 일', '순서'],
      a: ['유란의 일은 네 단계로 흘러가요.',
          '<ol><li><b>PLAN · 판을 계획한다</b> — 목표와 범위부터 정해요. 쿠팡 로켓프레시 때는 화면을 고치기 전에 20대 모바일 사용자 50명 설문부터 설계했어요.</li>' +
          '<li><b>FIND · 핵심을 짚는다</b> — 현상에서 멈추지 않아요. Arc.Dot에선 실태조사를 한 겹 더 파서 문제를 \'정보의 사각지대\'로 다시 정의했어요.</li>' +
          '<li><b>KEEP · 핵심만 남긴다</b> — 담(DAM)에선 펼쳐진 기능을 평시 · 긴급 두 모드로 덜어냈어요.</li>' +
          '<li><b>TOGETHER · 함께, 꾸준히</b> — 팀원 각자의 강점을 찾아 역할을 맡겨요.</li></ol>'],
      next: ['je', 'ai', 'projects', 'lead'] },

    { id: 'je', label: '성격은 어때? (J + E)', keys: ['성격', 'mbti', '엠비티아이', '외향', '계획형', '성향', 'j+e', 'je', '팀워크', '협업', '사람', '분위기'],
      a: ['유란은 <b>J</b>와 <b>E</b>가 뚜렷한 기획자예요.',
          '<b>J · 계획형</b> — 움직이기 전에 목표 · 범위 · 일정 · 산출물부터 그려요. 계획을 "핵심을 찾을 자리를 먼저 마련하는 일"이라고 생각해요.',
          '<b>E · 외향형</b> — 앞에 서서 사람을 모으는 걸 두려워하지 않아요. 고등학교 3년 내내 반장, 대학에선 부과대표 · 동아리 팀장 · 멘토까지, 팀장 · 리드 경험이 <b>10회</b>예요.',
          '그렇다고 혼자 앞서가진 않아요. 의견이 부딪히면 <b>근거로 설득</b>하고, 다른 의견을 낸 사람이 소외되지 않게 끝까지 이유를 함께 짚어요.'],
      next: ['lead', 'way', 'strength'] },

    { id: 'ai', label: 'AI는 어떻게 써?', keys: ['ai', '에이아이', '인공지능', '클로드', 'claude', 'gpt', '지피티', '챗gpt', 'fable', '페이블', 'opus', '오퍼스', '활용', '자동화', '코드'],
      a: ['유란의 원칙은 하나예요. <b>"AI에게 맡기지 않고, AI와 판을 짠다."</b>',
          '주로 <b>Claude Code</b>(Claude Pro)를 쓰고, 모델은 <b>Fable</b>과 <b>Opus</b>를 나눠 써요. 긴 자료 구조화 · 큰 구현은 Fable, 짧은 정리 · 작은 수정 · 체크리스트 대조는 Opus.',
          '문제 정의와 판단은 유란이, 정리와 구현은 AI가 하고, 결과는 다시 유란이 검증해요. 자세한 건 ' + L('ai.html', 'AI 활용 페이지') + '에 있어요.'],
      next: ['prompt', 'token', 'site', 'noai'] },

    { id: 'prompt', label: '프롬프트는 어떻게 써?', keys: ['프롬프트', 'prompt', '지시', '요청', '명령', '질문하는'],
      a: ['프롬프트는 <b>짧게, 조건은 분명하게</b> 써요. 다섯 줄이 기본이에요.',
          '<ol><li><b>목표</b> — 무엇이 끝인지 한 문장</li><li><b>맥락</b> — 근거 자료를 직접 첨부</li><li><b>제약</b> — 하지 말 것을 먼저</li><li><b>출력</b> — 바뀐 부분만, 되돌릴 수 있게</li><li><b>검증</b> — 확인 방법까지 요청</li></ol>',
          '"예쁘게 만들어줘" 대신 "1920×1080 한 화면에, 내용 수정 금지, 스크린샷으로 보고"처럼요.'],
      next: ['token', 'noai', 'site'] },

    { id: 'token', label: '토큰은 어떻게 아껴?', keys: ['토큰', 'token', '비용', '사용량', '아껴', '절약', '한도'],
      a: ['토큰은 <b>아껴서, 필요한 곳에</b> 써요.',
          '<ol><li><b>작게 쪼개기</b> — 한 번에 하나의 화면, 하나의 변경</li><li><b>모델 나눠 쓰기</b> — 설계 · 대량 정리는 Fable, 문구 · 간격 수정은 Opus</li><li><b>다시 쓰지 않기</b> — 전체 재작성 대신 바뀐 부분만</li><li><b>맥락은 문서로</b> — 화면설계서 · 데이터 파일을 기준점으로, 대화가 길어지면 요약 후 새로 시작</li></ol>'],
      next: ['prompt', 'site', 'noai'] },

    { id: 'site', label: '이 사이트도 AI로 만들었어?', keys: ['사이트', '웹사이트', '이 페이지', '홈페이지', '만들었', '제작', '포트폴리오 사이트', '구현'],
      a: ['맞아요. 이 포트폴리오도 <b>Claude Code</b>와 함께 만들었어요. 대신 순서가 있어요.',
          '<ol><li><b>기획은 직접</b> — 정보구조도 · 화면설계서를 먼저 쓰고, 그 문서를 AI 작업의 기준으로 넘겼어요.</li><li><b>구현은 Claude Code</b> — 화면 단위로 구현하고, 문구는 데이터 파일 한곳에서 고쳐요.</li><li><b>피드백은 화면으로</b> — 행간 · 여백 · 색처럼 구체적으로 짚어 수십 번 작게 고쳤어요.</li><li><b>배포와 검증</b> — 실제 주소에서 다시 확인하고, 이력서 PDF는 원본과 글자를 대조했어요.</li></ol>',
          '지금 이야기하고 있는 저도 그렇게 만들어졌어요 🍳'],
      next: ['noai', 'prompt', 'ai'] },

    { id: 'noai', label: 'AI에게 안 맡기는 건?', keys: ['맡기지', '안 맡', '직접 하는', '검증', '사실 확인', '믿어', '신뢰', '한계', '위험'],
      a: ['유란이 AI에게 <b>절대 넘기지 않는 것</b>이 있어요.',
          '<ul><li>무엇이 문제인지 정하는 일</li><li>숫자와 출처의 사실 확인</li><li>무엇을 남기고 덜어낼지의 결정</li><li>개인정보와 팀원의 기여 표기</li></ul>',
          '예를 들어 크리에이티브X성수 제안서에선 AI 레드팀이 <b>57건</b>을 지적했는데, 유란 팀은 지적마다 원문을 열어 <b>수용 · 기각 · 보류</b>를 직접 판단해 표로 남겼어요.'],
      next: ['ai', 'projects', 'way'] },

    { id: 'projects', label: '핵심 프로젝트 알려줘', keys: ['프로젝트', '작업물', '대표', '핵심', '포폴', '결과물', '경험한', '뭐 했'],
      a: ['프로젝트는 모두 <b>8개</b>이고, 그중 핵심은 세 개예요.',
          '<ol><li>' + L('project.html?id=01', '<b>HAELON</b>') + ' — 공항 드론 테러 감지 · 대응 통합 관제 서비스 (ESG 우수작)</li>' +
          '<li>' + L('project.html?id=07', '<b>위버스 미디어 탐색 개선</b>') + ' — 사용자 5명 사용성 평가, 과업 성공률 55% → 92%</li>' +
          '<li>' + L('project.html?id=08', '<b>2026 크리에이티브X성수</b>') + ' — 주제전시 및 써밋 용역 제안서</li></ol>',
          '8개 모두 유란이 <b>팀장 · 발표</b>를 맡았어요. 전체는 ' + L('works.html', '프로젝트 페이지') + '에서 기획서 · 보고서 원본과 함께 볼 수 있어요.'],
      next: ['haelon', 'lead', 'awards'] },

    { id: 'haelon', label: 'HAELON은 뭐야?', keys: ['haelon', '헤일론', '드론', '공항', '관제', 'esg', '우수작'],
      a: ['<b>HAELON</b>은 공항 드론 테러 감지 · 대응 통합 관제 서비스예요. 유란이 <b>팀장</b>을 맡았어요.',
          '처음엔 드론을 어떻게 잡을지 봤는데, 사례를 모아 보니 잡는 장비는 이미 있었어요. 진짜 문제는 관제사가 확인한 정보가 기장 · 보안요원 · 시민에게 <b>한 명씩, 말로</b> 전달된다는 것.',
          '그래서 확정 버튼 한 번으로 네 개의 화면에 동시에 닿는 관제 흐름을 설계했어요.', '사람의 안전과 판단을 앞에 둔 설계로 <b>ESG 우수작</b>에 선정돼 <b>장학금 50만원</b>도 받았어요. ' + L('project.html?id=01', '자세히 보기 →')],
      next: ['projects', 'lead', 'way'] },

    { id: 'lead', label: '팀장 경험은?', keys: ['리더', '리더십', '팀장', '리드', '이끌', '반장', '과대', '부과대표', 'pm', '멘토', '주도'],
      a: ['포트폴리오의 <b>8개 프로젝트 모두</b>에서 유란이 <b>팀장</b>이었고, <b>발표도 전부 유란</b>이 맡았어요.',
          '<ul><li>HAELON · 위버스 · 크리에이티브X성수 · Arc.Dot · 쿠팡 · 블루독 · 이음선 · 의왕 ESG — 모두 <b>팀장 · 발표</b></li><li>기획동아리 \'초안\' 카드뉴스팀 <b>팀장</b>, 2A 기획반 <b>부과대표</b>, 선후배 멘토링 <b>멘토</b></li><li>고등학교 3년 내내 <b>반장</b></li></ul>',
          '유란에게 이끈다는 건 혼자 앞서는 게 아니라 <b>함께 걷는 속도를 맞추는 일</b>이에요. 팀원 각자의 강점, 곧 사람의 노른자를 찾아 역할을 맡겨요.'],
      next: ['je', 'awards', 'projects'] },

    { id: 'awards', label: '수상 경력은?', keys: ['수상', '어워드', '상 받', '장학', '성적', '입선', '대회'],
      a: ['<ul><li><b>ESG 우수작 · 장학금 50만원</b> — HAELON (2026)</li><li><b>제32회 커뮤니케이션디자인 국제 어워드 입선</b> — Arc.Dot (2026.07)</li><li>성적 우수 장학금 — 1학년 1학기 · 2학년 1학기</li><li>수원대 전국 학생 미술 실기대회 <b>최우수상</b> · 건국대 · 경희대 실기대회 <b>본상</b></li></ul>',
          '매 과제마다 부족한 부분을 돌아보고 다음에 반영해 온 결과예요. 유란은 <b>반복할수록 더 정확해지는 사람</b>이에요.'],
      next: ['projects', 'skills', 'lead'] },

    { id: 'skills', label: '어떤 역량이 있어?', keys: ['스킬', '역량', '툴', '도구', 'figma', '피그마', '노션', '할 수 있', '능력', '기술', '리서치'],
      a: ['<ul><li><b>UX 리서치</b> — 설문 설계 · 분석, 데스크 리서치, 사용자 니즈 분석, 문제 정의 · 가설 수립, 임팩트 검증</li><li><b>기획</b> — 서비스 기획 · PM, 정보구조(IA), User Flow, 화면설계서 · 스토리보드, 콘텐츠 기획</li><li><b>툴</b> — Figma · Notion · PowerPoint · Excel · Word</li><li><b>AI</b> — Claude · Claude Code · ChatGPT · Codex · Gemini · Copilot · Midjourney · Canva AI</li></ul>'],
      next: ['ai', 'strength', 'projects'] },

    { id: 'strength', label: '강점이 뭐야?', keys: ['강점', '장점', '잘하는', '차별', '특징', '왜 뽑', '매력'],
      a: ['한 줄로 말하면 <b>"겉이 아니라 핵심을 짚는 힘"</b>이에요.',
          '쿠팡 로켓프레시에서 "화면이 복잡하다"는 현상 안쪽을 파고들어, 원인이 <b>목적과 어긋난 카테고리</b>라는 걸 찾았어요. 개선안 9종도 모두 하나의 방향 — 목적 기반 카테고리 재구조화 — 을 향하게 정리했고요.',
          '여기에 계획형(J)의 실행력, 사람을 모으는 외향(E)의 에너지, 그리고 AI를 <b>근거 정리 도구</b>로 다루는 감각이 더해져요.'],
      next: ['way', 'je', 'ai'] },

    { id: 'edu', label: '학교 · 전공은?', keys: ['학교', '학력', '전공', '졸업', '계원', '대학', '학년'],
      a: ['<b>계원예술대학교 디지털미디어디자인과</b>에서 <b>기획 세부전공</b>을 하고 있어요.',
          '<ul><li>2025.03 입학</li><li>2026.03 기획 세부전공 선택</li><li>2027.02 졸업 예정</li></ul>'],
      next: ['skills', 'projects', 'contact'] },

    { id: 'contact', label: '연락하고 싶어', keys: ['연락', '메일', '이메일', '전화', '번호', '인스타', '이력서', '자기소개서', '자소서', '채용', '면접', '제안'],
      a: ['언제든 환영이에요!',
          '<ul><li>메일 — ' + L('mailto:knewrun25@gmail.com', 'knewrun25@gmail.com') + '</li><li>전화 — ' + L('tel:+821034526632', '010.3452.6632') + '</li><li>인스타그램 — <a href="https://www.instagram.com/nwrnnyo/" target="_blank" rel="noopener">@nwrnnyo ↗</a></li></ul>',
          '이력서는 ' + L('resume.pdf?v=7', '여기서 바로 받을 수 있어요 ↓') + ''],
      next: ['who', 'projects'] }
  ];
  var byId = {}; KB.forEach(function (k) { byId[k.id] = k; });
  var START = ['who', 'way', 'je', 'ai', 'projects', 'contact'];

  function match(q) {
    var s = q.toLowerCase().replace(/\s+/g, ' ');
    var best = null, score = 0;
    KB.forEach(function (k) {
      var sc = 0;
      k.keys.forEach(function (w) { if (s.indexOf(w) > -1) sc += w.length > 2 ? 2 : 1; });
      if (sc > score) { score = sc; best = k; }
    });
    return best;
  }

  /* ---------- 화면 ---------- */
  var yolk = '<span class="yb-yolk" aria-hidden="true"><i class="yb-eye"></i><i class="yb-eye"></i></span>';
  var root = document.createElement('div');
  root.className = 'yb';
  root.innerHTML =
    '<button type="button" class="yb-launch" aria-label="노른자 봇 열기 — 김유란에 대해 물어보기" aria-expanded="false" aria-controls="yb-panel">' +
      '<span class="yb-egg">' + yolk + '</span><span class="yb-tip">김유란이 궁금하다면?</span></button>' +
    '<section class="yb-panel" id="yb-panel" role="dialog" aria-label="노른자 봇" hidden>' +
      '<header class="yb-head"><span class="yb-egg yb-egg--sm">' + yolk + '</span>' +
        '<div class="yb-head__t"><b>노른자 봇</b><small><span class="en">YOLK BOT</span> · 김유란을 알려드려요</small></div>' +
        '<button type="button" class="yb-close" aria-label="닫기">✕</button></header>' +
      '<div class="yb-log" role="log" aria-live="polite"></div>' +
      '<div class="yb-chips"></div>' +
      '<form class="yb-form" autocomplete="off"><input class="yb-input" type="text" placeholder="김유란에 대해 물어보세요" aria-label="질문 입력" maxlength="80">' +
        '<button type="submit" class="yb-send" aria-label="보내기">↑</button></form>' +
    '</section>';
  document.body.appendChild(root);

  var launch = root.querySelector('.yb-launch'), panel = root.querySelector('.yb-panel'),
      log = root.querySelector('.yb-log'), chips = root.querySelector('.yb-chips'),
      form = root.querySelector('.yb-form'), input = root.querySelector('.yb-input');
  var started = false, busy = false;

  function scroll() { log.scrollTop = log.scrollHeight; }
  function addUser(t) {
    var d = document.createElement('div'); d.className = 'yb-msg yb-msg--me'; d.textContent = t; log.appendChild(d); scroll();
  }
  function addBot(parts, done) {
    busy = true; chips.innerHTML = '';
    var wrap = document.createElement('div'); wrap.className = 'yb-row';
    wrap.innerHTML = '<span class="yb-egg yb-egg--xs">' + yolk + '</span><div class="yb-stack"></div>';
    log.appendChild(wrap);
    var stack = wrap.querySelector('.yb-stack'), i = 0;
    (function nextPart() {
      if (i >= parts.length) { busy = false; if (done) done(); return; }
      var typing = document.createElement('div'); typing.className = 'yb-msg yb-typing'; typing.innerHTML = '<i></i><i></i><i></i>';
      stack.appendChild(typing); scroll();
      var html = parts[i++], wait = Math.min(900, 380 + html.replace(/<[^>]+>/g, '').length * 4);
      setTimeout(function () { typing.className = 'yb-msg'; typing.innerHTML = html; scroll(); setTimeout(nextPart, 160); }, wait);
    })();
  }
  function showChips(ids) {
    chips.innerHTML = ids.map(function (id) { return '<button type="button" class="yb-chip" data-q="' + id + '">' + byId[id].label + '</button>'; }).join('');
  }
  function answer(k) { addBot(k.a, function () { showChips(k.next); }); }
  function ask(text, k) {
    if (busy) return;
    addUser(text);
    k = k || match(text);
    if (k) answer(k);
    else addBot(['음, 그건 제가 아직 잘 모르는 질문이에요 🥚', '김유란의 <b>작업 방식 · 성격 · AI 활용 · 프로젝트 · 연락처</b>라면 자신 있어요! 아래에서 골라 볼래요?'], function () { showChips(START); });
  }

  function open() {
    panel.hidden = false; root.classList.add('is-open'); launch.setAttribute('aria-expanded', 'true');
    if (!started) { started = true; addBot(byId.hi.a, function () { showChips(START); }); }
    setTimeout(function () { if (window.matchMedia('(min-width: 641px)').matches) input.focus(); }, 60);
  }
  function close() { panel.hidden = true; root.classList.remove('is-open'); launch.setAttribute('aria-expanded', 'false'); launch.focus(); }

  launch.addEventListener('click', function () { panel.hidden ? open() : close(); });
  root.querySelector('.yb-close').addEventListener('click', close);
  chips.addEventListener('click', function (e) {
    var b = e.target.closest('.yb-chip'); if (!b) return; ask(byId[b.dataset.q].label, byId[b.dataset.q]);
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault(); var t = input.value.trim(); if (!t) return; input.value = ''; ask(t);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) close(); });
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-yolkbot]'); if (!t) return; e.preventDefault(); open();
  });

  /* 처음 한 번만 말풍선 */
  try {
    if (!sessionStorage.getItem('yolkbot-tip')) {
      setTimeout(function () { root.classList.add('tip-on'); }, 2600);
      setTimeout(function () { root.classList.remove('tip-on'); try { sessionStorage.setItem('yolkbot-tip', '1'); } catch (e) {} }, 8600);
    }
  } catch (e) {}
})();
