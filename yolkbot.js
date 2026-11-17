/* 노른자 봇 — 김유란을 소개하는 챗봇
   서버 없이 동작합니다. 답변은 이력서 · 자기소개서 · 프로젝트 문서 · AI 활용 페이지에 있는 내용만 씁니다. */
(function () {
  if (window.__yolkbot) return; window.__yolkbot = true;

  var L = function (href, text) { return '<a href="' + href + '">' + text + '</a>'; };
  var PJ = function (id, text) { return L('project.html?id=' + id, text); };

  /* ---------- 질문 카테고리 ---------- */
  var CATS = [
    ['소개', ['who', 'slogan', 'role', 'vision']],
    ['일하는 방식', ['way', 'research', 'define', 'ia', 'usability', 'data', 'record', 'plan']],
    ['협업 · 리더십', ['lead', 'conflict', 'feedback', 'present', 'teamrole', 'mentor']],
    ['성격 · 강점', ['je', 'strength', 'weakness', 'failure', 'why']],
    ['프로젝트', ['projects', 'haelon', 'kiosk', 'weverse', 'seongsu', 'arcdot', 'coupang', 'bluedog', 'ieumline', 'portfolio', 'dam']],
    ['AI 활용', ['ai', 'prompt', 'token', 'site', 'noai', 'aitools']],
    ['이력 · 스펙', ['edu', 'awards', 'certs', 'skills', 'work', 'activities']],
    ['채용 정보', ['available', 'location', 'contact', 'docs', 'salary']]
  ];

  /* ---------- 지식 ---------- */
  var KB = [
    { id: 'hi', label: '안녕!', keys: ['안녕', '하이', '반가', 'hello', 'hi', '헬로', '처음'],
      a: ['안녕하세요! 저는 <b>노른자 봇</b>이에요 🍳', '기획자 <b>김유란</b>에 대해서라면 일하는 방식부터 프로젝트, 채용 정보까지 다 알려드릴게요. 궁금한 걸 바로 물어보거나, <b>질문 목록</b>에서 골라 보세요.'],
      next: ['who', 'why', 'projects', 'menu'] },

    /* ── 소개 ── */
    { id: 'who', label: '김유란은 어떤 기획자야?', keys: ['누구', '소개', '어떤 기획자', '어떤 사람', '자기소개', '한마디', '정체', '1분', '간단히'],
      a: ['김유란은 <b>판을 계획하고, 핵심만 남기는 노른자 같은 기획자</b>예요.',
          '겉으로 드러난 현상보다 그 안에서 서비스 전체를 지탱하는 <b>진짜 문제</b>를 먼저 찾고, 근거로 방향을 세워 끝까지 핵심만 남겨요.',
          '계원예술대학교 디지털미디어디자인과 <b>기획 세부전공</b>(2027.02 졸업 예정)이고, 직무는 <b>UX/UI · Service Planner</b>예요.'],
      next: ['way', 'why', 'projects'] },
    { id: 'slogan', label: '왜 하필 ‘노른자’야?', keys: ['노른자', '슬로건', '달걀', '컨셉', '왜 노른자', '키워드'],
      a: ['달걀은 겉모습만 보면 다 비슷하지만, 깨 보면 전체를 지탱하는 <b>노른자</b>가 있죠.',
          '서비스도 같아요. 겉의 현상은 비슷해 보여도 그 안에는 전체를 지탱하는 진짜 문제가 있어요. 유란은 그 노른자, 곧 <b>핵심</b>을 찾는 사람이라는 뜻이에요.',
          '이 사이트도 같은 구조예요. 첫 화면은 <b>달걀(첫인상)</b>, 이력은 <b>흰자(지탱하는 기록)</b>, 프로젝트는 <b>노른자(핵심)</b>.'],
      next: ['way', 'portfolio', 'who'] },
    { id: 'role', label: '희망 직무는?', keys: ['직무', '희망 직무', '포지션', '어떤 일', '하고 싶은 일', '직군', '분야', 'ux', 'ui', '서비스 기획', 'pm'],
      a: ['<b>UX/UI · 서비스 기획</b>이에요.',
          '사용자 리서치로 문제를 정의하고, 정보구조(IA) · 사용자 흐름 · 화면설계서로 서비스를 구체화하는 일을 해 왔어요. 웹 · 앱 · 키오스크 · 웨어러블까지 화면이 놓이는 기기에 맞춰 설계해 본 경험이 있어요.',
          '팀 프로젝트에서는 늘 <b>팀장 · PM</b> 역할로 일정과 방향을 함께 이끌었어요.'],
      next: ['skills', 'way', 'projects'] },
    { id: 'vision', label: '앞으로 어떤 기획자가 되고 싶어?', keys: ['앞으로', '목표', '비전', '꿈', '성장', '미래', '포부', '되고 싶', '5년', '커리어'],
      a: ['자기소개서의 마지막 다짐을 그대로 옮기면요.',
          '<b>"앞으로도 판을 계획적으로 준비하고, 그 안에서 가장 중요한 것을 짚어내며, 끝까지 핵심만 남기는 기획자로 성장하겠습니다."</b>',
          '어떤 서비스를 만나든 겉모습에 머무르지 않고, 사용자와 팀 모두를 지탱하는 진짜 문제를 찾고, 그 과정을 함께하는 사람들과 나누며 더 단단한 결과로 이어가는 게 목표예요.'],
      next: ['why', 'strength', 'contact'] },

    /* ── 일하는 방식 ── */
    { id: 'way', label: '일하는 방식이 궁금해', keys: ['방식', '일하', '작업 방식', '프로세스', '과정', '어떻게 일', '접근', '순서', '스타일'],
      a: ['유란의 일은 네 단계로 흘러가요.',
          '<ol><li><b>PLAN · 판을 계획한다</b> — 목표와 범위부터. 쿠팡 로켓프레시 때는 화면을 고치기 전에 20대 · 모바일 사용자 50명 설문부터 설계했어요.</li>' +
          '<li><b>FIND · 핵심을 짚는다</b> — 현상에서 멈추지 않아요. Arc.Dot에선 실태조사로 한 겹 더 파서 문제를 ‘정보의 사각지대’로 다시 정의했어요.</li>' +
          '<li><b>KEEP · 핵심만 남긴다</b> — 펼쳐진 기능을 덜어내요. 담(DAM)은 평시 · 긴급 두 모드로 정리했어요.</li>' +
          '<li><b>TOGETHER · 함께, 꾸준히</b> — 팀원 각자의 강점을 찾아 역할을 맡겨요.</li></ol>'],
      next: ['research', 'define', 'lead'] },
    { id: 'research', label: '리서치는 어떻게 해?', keys: ['리서치', '조사', '인터뷰', '설문', '현장', '필드', '관찰', '데스크', '사용자 조사'],
      a: ['책상과 현장을 같이 써요. 프로젝트마다 실제로 한 리서치는 이래요.',
          '<ul><li><b>설문</b> — 쿠팡: 20대 · 모바일 사용자 50명</li><li><b>현장 인터뷰 · 관찰</b> — 블루독: 산책로 · 공원 · 애견카페를 직접 찾아가 시민 · 보호자 · 관계자 인터뷰, 쉐도우 트래킹</li><li><b>현장 관찰</b> — 크리에이티브X성수: 행사장을 7시간 직접 걸으며 기록</li><li><b>아이트래킹 · 사용성 테스트</b> — 위버스: 사용자 5명</li><li><b>데스크 리서치</b> — Arc.Dot: 「2024 장애체육인 인권침해 · 비리 실태조사」 분석</li><li><b>필드리서치</b> — HAELON: 공항 구조와 실제 조종석 환경 확인</li></ul>',
          '숫자는 원문을 찾아 하나씩 직접 확인해요.'],
      next: ['define', 'usability', 'data'] },
    { id: 'define', label: '문제 정의는 어떻게 해?', keys: ['문제 정의', '문제정의', '핵심 문제', '재정의', '원인', '인사이트', '본질'],
      a: ['"현상이 아니라 핵심" 한 문장으로 바꿔 보는 게 습관이에요. 프로젝트마다 이렇게 다시 정의했어요.',
          '<ul><li><b>HAELON</b> — 탐지가 아니라 관제사 · 기장 · 보안요원 사이의 <b>전달</b></li><li><b>위버스</b> — 콘텐츠 양이 아니라 <b>기준이 불분명한 카테고리 · 필터</b></li><li><b>Arc.Dot</b> — 참여 부족이 아니라 <b>정보의 사각지대</b></li><li><b>쿠팡</b> — 화면이 아니라 <b>목적과 어긋난 카테고리</b></li><li><b>이음선</b> — 볼거리가 아니라 <b>이어지지 않은 동선</b></li></ul>'],
      next: ['research', 'haelon', 'weverse'] },
    { id: 'ia', label: '정보구조 · 화면설계서도 해?', keys: ['정보구조', 'ia', '화면설계', '화면 설계', '와이어', '스토리보드', '설계서', '플로우', 'user flow'],
      a: ['네, 기획의 기본 산출물로 늘 직접 만들어요.',
          '<ul><li><b>쿠팡</b> — PC · 태블릿 · 모바일 화면설계서를 전부 직접 제작</li><li><b>HAELON</b> — 보안요원 디바이스 화면설계서, 가로형 관제 키오스크 설계</li><li><b>포트폴리오 사이트</b> — 웹사이트 화면설계서 42쪽을 먼저 쓰고 그대로 구현</li><li><b>위버스</b> — AS-IS → TO-BE 화면설계서</li></ul>',
          '모두 ' + L('works.html?type=wire', '프로젝트 페이지 → 화면설계서') + '에서 원본을 볼 수 있어요.'],
      next: ['portfolio', 'coupang', 'skills'] },
    { id: 'usability', label: '사용성 평가 해봤어?', keys: ['사용성', '테스트', '아이트래킹', 'usability', '검증', '평가', 'ut'],
      a: ['위버스 프로젝트에서 <b>1차 · 2차 사용성 평가</b>를 직접 설계했어요.',
          '사용자 5명에게 같은 과업(세븐틴 미디어 탭에서 특정 사진 찾기)을 주고 아이트래킹(Heatmap · Gaze Plot · Cluster)과 과업 성공률 · 시간을 쟀어요.',
          '1차에서 성공률 <b>55%</b>, 상단 카테고리 영역 체류 <b>40% 이상</b>으로 문제를 검증 → 벤치마킹 6개사로 원칙을 세워 개선 → 2차에서 성공률 <b>92%</b>, 과업 시간도 크게 줄었어요. ' + PJ('07', '자세히 보기 →')],
      next: ['weverse', 'data', 'research'] },
    { id: 'data', label: '데이터 · 수치는 어떻게 써?', keys: ['데이터', '수치', '숫자', '근거', '통계', '정량', '지표', '성과'],
      a: ['"어렵다"는 느낌을 숫자로 바꿔야 팀의 판단이 빨라진다고 생각해요.',
          '<ul><li>위버스 — 과업 성공률 55% → 92%</li><li>쿠팡 — 불편 1위 ‘많은 정보량’(55%), 기대 요인 ‘직관적인 구조’(37.5%)</li><li>Arc.Dot — 선수들의 가장 큰 어려움 ‘기록 증명 불가’(19.1%)</li><li>HAELON — 목표 지표를 ‘확정부터 마지막 한 명이 확인할 때까지의 시간’ 하나로</li></ul>',
          '그리고 발표에 쓰는 숫자는 반드시 원문을 찾아 직접 확인해요.'],
      next: ['usability', 'define', 'record'] },
    { id: 'record', label: '기록은 어떻게 해?', keys: ['기록', '문서화', '회의록', '정리', '남기', '로그', '아카이브'],
      a: ['결정과 그 이유를 남기는 걸 중요하게 생각해요.',
          '<ul><li><b>원문 대조</b> — 숫자는 원문 기사로 하나씩 확인하고, 사실 확인이 필요한 곳은 따로 표시</li><li><b>결정 로그</b> — 무엇을 왜 바꿨는지(HAELON 첫 설계 폐기, 기기 변경)</li><li><b>AI 분업표</b> — AI에 맡긴 일과 팀이 직접 한 일을 표로</li><li><b>개정 이력</b> — 화면설계서는 버전과 수정 내용을 관리(포트폴리오 화면설계서 v1.2)</li><li><b>레드팀 대응표</b> — 성수 제안서 지적 57건을 수용 · 기각 · 보류로 정리</li></ul>'],
      next: ['plan', 'seongsu', 'haelon'] },
    { id: 'plan', label: '일정 관리는?', keys: ['일정', '마감', '데드라인', '스케줄', '시간 관리', '계획', '관리', '우선순위'],
      a: ['판부터 짜는 J라서, 시작할 때 <b>목표 · 범위 · 일정 · 산출물</b>을 먼저 정해요.',
          '포트폴리오 사이트도 ‘구조 세우기 → 화면 완성 → 검증 · 공개’ 3단계로 나눠 진행했고, 크리에이티브X성수 제안서는 보완 계획표에 기간과 목표 점수까지 정해 두고 움직였어요.',
          '긴 일은 번호를 붙여 작게 쪼개고, 하나씩 끝내요.'],
      next: ['je', 'record', 'lead'] },

    /* ── 협업 · 리더십 ── */
    { id: 'lead', label: '팀장 경험은?', keys: ['리더', '리더십', '팀장', '리드', '이끌', '반장', '과대', '부과대표', '주도'],
      a: ['팀장 · 리드 경험은 <b>10회</b>예요. 포트폴리오의 <b>팀 프로젝트 7개 모두</b> 유란이 팀장이자 발표자였어요.',
          '<ul><li>HAELON · 위버스 · 크리에이티브X성수 · Arc.Dot · 쿠팡 · 블루독 · 이음선 — <b>팀장 · 발표</b></li><li>기획동아리 ‘초안’ 카드뉴스팀 · 의왕 ESG 카드뉴스팀 <b>팀장</b></li><li>2A 기획반 <b>부과대표</b>, 선후배 멘토링 <b>멘토</b>, 고등학교 3년 <b>반장</b></li></ul>',
          '유란에게 이끈다는 건 혼자 앞서는 게 아니라 <b>함께 걷는 속도를 맞추는 일</b>이에요.'],
      next: ['conflict', 'teamrole', 'je'] },
    { id: 'conflict', label: '의견이 부딪히면?', keys: ['갈등', '충돌', '부딪', '의견 차이', '반대', '설득', '다툼', '이견'],
      a: ['판단을 밀어붙이지 않고 <b>근거로 설득</b>해요.',
          '다른 의견을 낸 사람이 소외되지 않도록, 왜 그렇게 생각했는지 끝까지 이유를 함께 짚어요. HAELON에서도 ‘확인을 누르면 끝’이던 첫 설계를 두고, 역할 시뮬레이션에서 나온 질문을 근거로 팀이 함께 구조를 바꿨어요.'],
      next: ['lead', 'feedback', 'teamrole'] },
    { id: 'feedback', label: '피드백은 어떻게 받아들여?', keys: ['피드백', '비판', '지적', '수정 요청', '받아들', '코멘트', '레드팀'],
      a: ['지적은 감정이 아니라 <b>원문</b>으로 판단해요.',
          '크리에이티브X성수 제안서에서는 평가위원 시점의 레드팀 검토로 57건의 지적을 받았는데, 하나하나 원문을 열어 <b>수용 · 기각 · 보류</b>를 정하고 보완 계획표로 만들었어요.',
          '매 과제마다 부족한 부분을 돌아보고 다음에 반영해 온 습관이 성적 우수 장학금 2회로도 이어졌어요.'],
      next: ['seongsu', 'failure', 'record'] },
    { id: 'present', label: '발표 경험은?', keys: ['발표', '프레젠테이션', 'pt', '스피치', '말하기', '청중'],
      a: ['포트폴리오의 <b>팀 프로젝트 7개 모두 발표를 맡았어요.</b>',
          'HAELON 최종 발표는 청중을 ‘이륙이 멈춘 비행기 승객’으로 설정하고, 기장 안내 음성 · 화면 · 질문으로 4분 57초를 구성했어요. 마지막에 확정 버튼을 누르면 다섯 곳이 동시에 알림을 받는 걸 직접 보여주며, 처음 던진 질문에 답하는 구조였어요.'],
      next: ['haelon', 'lead', 'seongsu'] },
    { id: 'teamrole', label: '팀에서 주로 맡는 역할은?', keys: ['역할', '맡은', '포지션', '팀에서', '담당', '기여'],
      a: ['주로 <b>팀장 · PM · 기획 총괄</b>이에요. 문제 정의와 방향을 잡고, 일정을 나누고, 최종 문서와 발표를 책임져요.',
          '동시에 직접 만드는 사람이기도 해요. 쿠팡에서는 화면설계서를 전부 직접 만들었고, 크리에이티브X성수에서는 RFP · 평가 기준 분석과 제안 논리 · 본문을 맡았어요.',
          '역할을 나눌 땐 팀원 각자의 강점, 곧 <b>사람의 노른자</b>를 찾아 맡겨요.'],
      next: ['lead', 'conflict', 'projects'] },
    { id: 'mentor', label: '멘토링 · 동아리 활동은?', keys: ['멘토', '멘토링', '동아리', '초안', '카드뉴스', '학생회'],
      a: ['<ul><li>기획동아리 <b>‘초안’</b> — 기획부원으로 시작해 카드뉴스팀 <b>팀장</b>, 학과 홍보 콘텐츠를 정기적으로 기획 · 제작</li><li><b>의왕 ESG 카드뉴스팀 팀장</b> — 2026 혁신지원사업 동아리 연계 ESG 프로젝트, 결과발표회까지</li><li>디지털미디어디자인과 선후배 교류 멘토링 5팀 <b>멘토</b></li><li>2A 기획반 <b>부과대표</b>(1 · 2학기 연속)</li><li>졸업전시준비위원회 <b>전시배치팀</b></li></ul>'],
      next: ['activities', 'lead', 'work'] },

    /* ── 성격 · 강점 ── */
    { id: 'je', label: '성격은 어때? (J + E)', keys: ['성격', 'mbti', '엠비티아이', '외향', '계획형', '성향', 'j+e', 'je', '분위기', '사람'],
      a: ['유란은 <b>J</b>와 <b>E</b>가 뚜렷한 기획자예요.',
          '<b>J · 계획형</b> — 움직이기 전에 목표 · 범위 · 일정 · 산출물부터 그려요. 계획을 ‘핵심을 찾을 자리를 먼저 마련하는 일’이라고 생각해요.',
          '<b>E · 외향형</b> — 앞에 서서 사람을 모으는 걸 두려워하지 않아요. 팀장 · 리드 경험만 10회예요. 그렇다고 혼자 앞서진 않고, 다른 의견도 끝까지 함께 짚어요.'],
      next: ['lead', 'strength', 'plan'] },
    { id: 'strength', label: '강점이 뭐야?', keys: ['강점', '장점', '잘하는', '차별', '특징', '매력', '무기'],
      a: ['한 줄로 말하면 <b>"겉이 아니라 핵심을 짚는 힘"</b>이에요.',
          '쿠팡에서 ‘화면이 복잡하다’는 현상 안쪽을 파고들어 원인이 <b>목적과 어긋난 카테고리</b>라는 걸 찾았고, 개선안 9종을 모두 하나의 방향으로 묶었어요.',
          '여기에 J의 실행력, E의 에너지, 그리고 AI를 <b>근거 정리 도구</b>로 다루는 감각이 더해져요.'],
      next: ['why', 'weakness', 'way'] },
    { id: 'weakness', label: '보완하고 싶은 점은?', keys: ['약점', '단점', '부족', '보완', '아쉬', '개선할 점', '한계'],
      a: ['유란이 스스로 꼽는 아쉬움은 <b>실제 사용 현장과의 검증을 더 일찍, 더 많이</b> 하는 거예요.',
          'HAELON 회고에서도 "다시 한다면 현장을 더 일찍 만나고, 전달 시간이 실제로 얼마나 줄어드는지 직접 재 보겠다"고 정리했어요. 그래서 위버스처럼 1차 · 2차로 직접 검증하는 방식을 계속 늘려 가고 있어요.'],
      next: ['failure', 'usability', 'strength'] },
    { id: 'failure', label: '실패 · 방향을 바꾼 경험은?', keys: ['실패', '실수', '바꾼', '버린', '전환', '어려웠', '위기', '극복', '시행착오'],
      a: ['HAELON에서 <b>첫 설계를 두 번 버렸어요.</b>',
          '<ol><li>‘받은 사람이 확인을 누르면 끝’인 알림 — 역할 시뮬레이션에서 "확인했다고 조치까지 끝난 거냐"는 질문이 반복돼, 상황 · 읽음 확인 · 조치 진행을 따로 남기는 구조로 바꿨어요.</li><li>보안요원 기기를 폴더블 폰으로 정했다가 — 두 손은 통제선에, 눈은 현장에 있어야 한다는 걸 깨닫고 ‘손은 자유롭게, 시선은 현장에’라는 조건으로 스마트 글래스 · 손목 기기로 바꿨어요.</li></ol>',
          '틀린 걸 빨리 인정하고, 조건을 다시 세우는 게 유란의 방식이에요.'],
      next: ['haelon', 'conflict', 'weakness'] },
    { id: 'why', label: '왜 김유란을 뽑아야 해?', keys: ['왜 뽑', '뽑아야', '채용해야', '왜 너', '왜 김유란', '어필', '경쟁력', '이유'],
      a: ['세 가지로 말할게요.',
          '<ol><li><b>핵심을 찾는다</b> — 프로젝트마다 현상을 한 겹 더 파서 진짜 문제를 다시 정의했어요.</li><li><b>끝까지 만든다</b> — 리서치에서 끝나지 않고 화면설계서 · 프로토타입 · 웹사이트까지 직접 완성해요. 이 사이트도 화면설계서 42쪽을 쓰고 직접 구현했어요.</li><li><b>함께 끌고 간다</b> — 팀 프로젝트 7개 모두 팀장 · 발표, 어워드 입선과 우수작 선정까지 이어졌어요.</li></ol>',
          '그리고 AI를 대신 쓰게 하지 않고, 판단은 직접 하면서 속도를 내는 법을 알아요.'],
      next: ['strength', 'awards', 'contact'] },

    /* ── 프로젝트 ── */
    { id: 'projects', w: .5, label: '프로젝트 전체 보여줘', keys: ['프로젝트', '작업물', '대표', '핵심 프로젝트', '포폴', '결과물', '어떤 프로젝트', '프로젝트 목록'],
      a: ['프로젝트는 모두 <b>8개</b>예요. 핵심은 세 개!',
          '<ol><li>' + PJ('01', '<b>HAELON</b>') + ' — 공항 드론 테러 통합 관제 서비스 (가로형 관제 키오스크)</li><li>' + PJ('07', '<b>위버스</b>') + ' — 사용성 평가 1차 · 2차, 성공률 55% → 92%</li><li>' + PJ('08', '<b>크리에이티브X성수</b>') + ' — 주제전시 · 써밋 용역 제안서</li></ol>',
          '그 밖에 ' + PJ('02', 'Arc.Dot') + ' · ' + PJ('03', '쿠팡 로켓프레시') + ' · ' + PJ('05', '블루독') + ' · ' + PJ('04', '이음선') + ' · ' + PJ('10', '포트폴리오 웹사이트 기획서') + '가 있어요. 전체는 ' + L('works.html', '프로젝트 페이지') + '에서 원본 문서와 함께 볼 수 있어요.'],
      next: ['haelon', 'weverse', 'seongsu'] },
    { id: 'haelon', label: 'HAELON은 뭐야?', keys: ['haelon', '헤일론', '드론', '공항', '관제', '공중도덕', '캡스톤'],
      a: ['<b>HAELON</b>은 공항 드론 테러 감지 · 대응 통합 관제 서비스예요. 팀 공중도덕의 <b>팀장 · 발표</b>를 맡았어요.',
          '사례를 모아 보니 잡는 장비는 이미 있었어요. 진짜 문제는 관제사가 확인한 정보가 기장 · 보안요원 · 시민에게 <b>한 명씩, 말로</b> 전달된다는 것. 그래서 문제를 ‘탐지’가 아니라 ‘전달’로 다시 정의했어요.',
          '관제사용 <b>가로형 통합 관제 키오스크</b>를 중심으로, 확정 한 번이면 네 화면에 동시에 닿는 관제 흐름을 만들었어요. 사람의 안전과 판단을 앞에 둔 설계로 ESG 우수작에도 선정됐어요. ' + PJ('01', '직접 체험해 보기 →')],
      next: ['kiosk', 'failure', 'present'] },
    { id: 'kiosk', label: '가로형 관제 키오스크는?', keys: ['키오스크', '가로형', '관제사', '3d', '뉴미디어', '디지털 트윈', '시뮬레이션'],
      a: ['HAELON의 <b>메인 기기</b>예요. 관제사가 확정해야 모두에게 정보가 가니까, 관제사의 화면부터 설계했어요.',
          '<ul><li><b>가로형인 이유</b> — 레이더 · CCTV · 정찰드론 영상 · 운항 정보를 하나의 공항 위에 겹쳐 보고, 출동 · 출발 정지 · 대피를 한 곳에서 승인하기 위해</li><li><b>뉴미디어</b> — 인천공항을 3D 공간으로, 새벽~밤 시간대, 관제탑 · 전망대 · 추적 · 조종석 시점 전환</li><li><b>40초 시나리오</b> — 침입 탐지부터 상황 종료까지 실제로 흘러가며 체험</li><li><b>기준</b> — 정보량은 레이어로, 같은 위험은 같은 색, 결정은 사람에게</li></ul>',
          PJ('01', '사이트 안에서 직접 눌러 볼 수 있어요 →')],
      next: ['haelon', 'ia', 'ai'] },
    { id: 'weverse', label: '위버스 프로젝트는?', keys: ['위버스', 'weverse', '미디어 탐색', '미디어 프로토', '세븐틴', '팬'],
      a: ['<b>사용성 평가를 통한 위버스 미디어 탐색 경로 개선 보고서</b>예요. 3인 팀의 <b>팀장 · 발표</b>.',
          '미디어 탭에서 원하는 콘텐츠를 찾기 어려운 원인을, 사용자 5명의 아이트래킹 · 사용성 테스트로 직접 검증했어요. 원인은 콘텐츠 양이 아니라 <b>기준이 불분명한 카테고리 · 필터</b>.',
          '카테고리를 3가지 유형으로 압축하고, 카테고리-게시물 통합 뷰 · 조합 필터 · 실시간 결과 수 안내를 설계한 뒤 2차 평가로 확인하니 성공률이 <b>55% → 92%</b>. ' + PJ('07', '자세히 보기 →')],
      next: ['usability', 'data', 'projects'] },
    { id: 'seongsu', label: '크리에이티브X성수 제안서는?', keys: ['성수', '크리에이티브', '제안서', '용역', '전시', '써밋', 'rfp', '성동'],
      a: ['성동문화재단 발주 ‘2026 크리에이티브X성수 주제전시 및 써밋’ 용역의 학습용 모의 <b>제안서</b>예요. 2인 팀의 <b>팀장 · 발표</b>로 RFP · 평가 기준 분석과 제안 논리 · 본문을 맡았어요.',
          '행사장을 <b>7시간</b> 직접 걸으며 관찰해 보니, 스탬프는 매장으로 흩어지고 1층 전시와 3층 써밋은 따로 열리고 있었어요. 그래서 작품을 체험한 사람이 네트워킹과 성수동 축제까지 이어지는 행사를 제안했어요.',
          '핵심은 아이디어 수가 아니라 <b>평가자가 읽는 순서에 맞춘 구조</b>. AI 레드팀으로 57건의 지적을 받아 직접 판단하며 보완했어요. ' + PJ('08', '자세히 보기 →')],
      next: ['feedback', 'record', 'projects'] },
    { id: 'arcdot', label: 'Arc.Dot은 뭐야?', keys: ['arc', '아크닷', 'arcdot', '장애인', '스포츠', '오륜기세', '어워드'],
      a: ['<b>데이터 기반 장애인 스포츠 매니지먼트 서비스 Arc.Dot</b>이에요. 3인 팀 오륜기세의 <b>팀장 · PM · 발표</b>.',
          '장애인 선수들이 꼽은 가장 큰 어려움은 ‘기록 증명 불가’(19.1%)와 ‘훈련 보조 인력 부족’(10.8%). 실태조사를 한 겹 더 파서 문제를 <b>‘정보의 사각지대’</b>로 다시 정의했어요.',
          '훈련 기록 · AI 코칭 · 스카우팅을 잇는 정보구조를 설계했고, <b>제32회 커뮤니케이션디자인 국제 어워드 입선</b>. ' + PJ('02', '자세히 보기 →')],
      next: ['define', 'awards', 'projects'] },
    { id: 'coupang', label: '쿠팡 로켓프레시는?', keys: ['쿠팡', '로켓프레시', '로켓', '신선', '장보기', '이커머스'],
      a: ['<b>쿠팡 로켓프레시 메인페이지 리뉴얼 기획서</b>예요. 5인 팀의 <b>팀장 · 발표</b>이고, <b>PC · 태블릿 · 모바일 화면설계서를 전부 직접</b> 만들었어요.',
          '20대 · 모바일 사용자 50명 설문에서 불편 1위가 ‘많은 정보량’(55%). 그런데 원인은 화면이 아니라 <b>목적과 어긋난 카테고리</b>였어요.',
          '목적 기반 카테고리 재구조화를 중심에 두고 개선안 9종을 하나의 방향으로 묶었어요. ' + PJ('03', '자세히 보기 →')],
      next: ['ia', 'data', 'projects'] },
    { id: 'bluedog', label: '블루독은?', keys: ['블루독', 'bluedog', '은퇴견', '경찰견', '과천', '반려견'],
      a: ['<b>과천 은퇴견 × 시민 상생 플랫폼 블루독</b>이에요. 3인 팀의 <b>팀장 · 발표</b>로 현장 인터뷰 · 설문 · 프로젝트 브리프를 맡았어요.',
          '산책로 · 공원 · 애견카페를 직접 찾아가 시민 · 은퇴견 보호자 · 렛츠런파크 관계자 · 애견카페 점장을 인터뷰했고, 2차 필드 리서치에서 ‘산책 전 돌발 대처 교육’ 같은 안전망이 먼저 필요하다는 걸 확인해 서비스 방향을 바꿨어요. ' + PJ('05', '자세히 보기 →')],
      next: ['research', 'projects', 'way'] },
    { id: 'ieumline', label: '이음선은?', keys: ['이음선', '철도', '박물관', '의왕', '공간', '굴다리', '동선'],
      a: ['<b>한국철도박물관 재구조화 사업 ‘이음선’ 기획서</b>예요. 6인 팀의 <b>팀장 · 발표</b>.',
          '박물관과 생태습지가 굴다리 하나를 사이에 두고 따로 이용되고 있었어요. 원인은 볼거리가 아니라 <b>이어지지 않은 동선</b>.',
          '권역을 아홉 개 역의 노선으로 묶고, 굴다리를 ‘이음터널’로 바꿔 관람 전체를 하나의 기차 여행처럼 만들었어요. ' + PJ('04', '자세히 보기 →')],
      next: ['define', 'projects', 'research'] },
    { id: 'portfolio', label: '이 포트폴리오 사이트는?', keys: ['포트폴리오 사이트', '포트폴리오 기획', '이 사이트', '웹사이트 기획', 'yolk planner', '사이트 기획'],
      a: ['이 사이트도 하나의 <b>기획 프로젝트</b>예요.',
          '‘판을 계획하고, 핵심만 남기는 노른자 같은 기획자’라는 한 문장에서 출발해 컨셉 · 브랜드 규칙 · 정보구조를 정하고, <b>화면설계서 42쪽</b>을 먼저 쓴 다음 그 문서를 기준으로 직접 구현했어요.',
          '이력서 · 자기소개서 · 웹사이트가 같은 문장, 같은 순서로 말하도록 맞췄어요. ' + PJ('10', '기획서 보기 →')],
      next: ['site', 'ia', 'slogan'] },
    { id: 'dam', label: '담(DAM)은?', keys: ['담 프로젝트', '담(dam)', 'dam', '학교 안전', '교권', '학교폭력', '초중고'],
      a: ['<b>담(DAM) — 초 · 중 · 고 통합 안전 · 생활지원 플랫폼</b>이에요. 2026 캡스톤디자인 <b>팀장 · 서비스 기획</b>.',
          '교권침해 · 학교폭력 · 화재 · 외부인 침입 같은 위기에 통합 대응 체계가 없다는 문제에서 출발했어요. 기능을 펼쳐 두면 위기 순간에 무엇을 눌러야 할지 모르니까, <b>평시(학교생활 지원) ↔ 긴급(위기 대응)</b> 두 모드로 덜어냈어요.',
          '세부 기능 10개 카테고리, 키오스크 · 모바일 · 웹 정보구조를 설계했고, 졸업전시에서 43인치 키오스크로 시연할 예정이에요.'],
      next: ['way', 'haelon', 'projects'] },

    /* ── AI 활용 ── */
    { id: 'ai', label: 'AI는 어떻게 써?', keys: ['ai', '에이아이', '인공지능', '클로드', 'claude', 'fable', '페이블', 'opus', '오퍼스', '활용'],
      a: ['원칙은 하나예요. <b>"AI에게 맡기지 않고, AI와 판을 짠다."</b>',
          '주로 <b>Claude Code</b>(Claude Pro)를 쓰고, 긴 자료 구조화 · 큰 구현은 <b>Fable</b>, 짧은 정리 · 작은 수정 · 체크리스트 대조는 <b>Opus</b>로 나눠 써요.',
          '문제 정의와 판단은 유란이, 정리와 구현은 AI가, 결과 검증은 다시 유란이. 자세한 건 ' + L('ai.html', 'AI 활용 페이지') + '에 있어요.'],
      next: ['prompt', 'noai', 'site'] },
    { id: 'prompt', label: '프롬프트는 어떻게 써?', keys: ['프롬프트', 'prompt', '지시문', '명령어', 'rgc'],
      a: ['짧게, 조건은 분명하게. 다섯 줄이 기본이에요.',
          '<ol><li><b>목표</b> — 무엇이 끝인지 한 문장</li><li><b>맥락</b> — 근거 자료를 직접 첨부</li><li><b>제약</b> — 하지 말 것을 먼저</li><li><b>출력</b> — 바뀐 부분만, 되돌릴 수 있게</li><li><b>검증</b> — 확인 방법까지 요청</li></ol>',
          '"예쁘게 만들어줘" 대신 "1920×1080 한 화면에, 내용 수정 금지, 스크린샷으로 보고"처럼요.'],
      next: ['token', 'noai', 'ai'] },
    { id: 'token', label: '토큰은 어떻게 아껴?', keys: ['토큰', 'token', '비용', '사용량', '아껴', '절약', '한도'],
      a: ['<ol><li><b>작게 쪼개기</b> — 한 번에 하나의 화면, 하나의 변경</li><li><b>모델 나눠 쓰기</b> — 설계 · 대량 정리는 Fable, 문구 · 간격 수정은 Opus</li><li><b>다시 쓰지 않기</b> — 전체 재작성 대신 바뀐 부분만</li><li><b>맥락은 문서로</b> — 화면설계서 · 데이터 파일을 기준점으로, 대화가 길어지면 요약 후 새로 시작</li></ol>'],
      next: ['prompt', 'site', 'ai'] },
    { id: 'site', label: '이 사이트도 AI로 만들었어?', keys: ['만들었', '제작', '구현', '코딩', '개발', '퍼블리싱', 'html'],
      a: ['맞아요. 대신 순서가 있어요.',
          '<ol><li><b>기획은 직접</b> — 정보구조도 · 화면설계서를 먼저 쓰고 그 문서를 AI 작업의 기준으로</li><li><b>구현은 Claude Code</b> — 화면 단위로 구현, 문구는 데이터 파일 한곳에서</li><li><b>피드백은 화면으로</b> — 행간 · 여백 · 색까지 수십 번 작게 고침</li><li><b>배포와 검증</b> — 실제 주소에서 다시 확인, 이력서 PDF는 원본과 글자 대조</li></ol>',
          '지금 이야기하고 있는 저도 그렇게 만들어졌어요 🍳'],
      next: ['portfolio', 'noai', 'prompt'] },
    { id: 'noai', label: 'AI에게 안 맡기는 건?', keys: ['맡기지', '안 맡', '다 맡기', '맡기는 거', '의존', '직접 하는', '사실 확인', '믿어', '신뢰', '위험', '윤리', '할루시네이션'],
      a: ['<ul><li>무엇이 문제인지 정하는 일</li><li>숫자와 출처의 사실 확인</li><li>무엇을 남기고 덜어낼지의 결정</li><li>개인정보와 팀원의 기여 표기</li></ul>',
          'HAELON에서도 AI 이미지의 깨진 글자나 실제와 다른 드론 형태는 직접 고쳤고, 실물이 정해지지 않은 형태는 확정안처럼 쓰지 않았어요.'],
      next: ['ai', 'record', 'feedback'] },
    { id: 'aitools', label: '쓸 줄 아는 AI 도구는?', keys: ['ai 도구', '툴', 'chatgpt', 'gpt', '지피티', 'codex', '제미나이', 'gemini', 'copilot', 'midjourney', '미드저니', 'canva'],
      a: ['<b>Claude · Claude Code · ChatGPT · Codex · Gemini · Copilot · Midjourney · Canva AI</b>를 써요.',
          '도구 이름보다 중요한 건 방식이에요. 역할 지정 · 제약조건 명시 · 작업 분해 · 컨텍스트 주입 · 반복 개선을 단계별로 적용해 리서치 정리, 문서 구조화, HTML 프로토타입, 제출용 문서까지 만들어요.'],
      next: ['ai', 'prompt', 'skills'] },

    /* ── 이력 · 스펙 ── */
    { id: 'edu', label: '학교 · 전공은?', keys: ['학교', '학력', '전공', '졸업', '계원', '대학', '학년', '학점'],
      a: ['<b>계원예술대학교 디지털미디어디자인과 · 기획 세부전공</b>이에요.',
          '<ul><li>2024.02 풍무고등학교 졸업</li><li>2025.03 계원예술대학교 디지털미디어디자인과 입학</li><li>2026.03 기획 세부전공 선택</li><li>2027.02 졸업 예정</li></ul>',
          '1학년 1학기 · 2학년 1학기 <b>성적 우수 장학금</b>을 받았어요.'],
      next: ['awards', 'skills', 'available'] },
    { id: 'awards', label: '수상 경력은?', keys: ['수상', '어워드', '상 받', '장학', '입선', '대회', '우수작'],
      a: ['<ul><li>2026.11 <b>ESG 우수작 · 장학금</b> — HAELON</li><li>2026.07 <b>제32회 커뮤니케이션디자인 국제 어워드 입선</b> — Arc.Dot</li><li>성적 우수 장학금 — 1학년 1학기 · 2학년 1학기</li><li>2024.07 수원대 전국 학생 미술 실기대회 <b>최우수상</b></li><li>2024.07 건국대 글로컬캠퍼스 미술실기대회 <b>본상</b></li><li>2023.07 경희대 전국 디자인 실기대회 <b>본상</b></li></ul>'],
      next: ['certs', 'arcdot', 'haelon'] },
    { id: 'certs', label: '자격증 · 어학은?', keys: ['자격증', '어학', '중국어', 'hsk', 'itq', '토익', '영어', '외국어'],
      a: ['<ul><li>2024.08 <b>HSK 2급</b> (160점) — 중국어</li><li>2022.11 <b>ITQ 정보기술자격</b> A등급</li></ul>'],
      next: ['skills', 'edu', 'awards'] },
    { id: 'skills', label: '어떤 역량 · 툴을 써?', keys: ['스킬', '역량', '도구', 'figma', '피그마', '노션', 'notion', '할 수 있', '능력', '기술', '엑셀', 'ppt'],
      a: ['<ul><li><b>UX 리서치</b> — 설문 설계 · 분석, 데스크 리서치, 사용자 니즈 분석, 문제 정의 · 가설 수립, 임팩트 검증</li><li><b>기획</b> — 서비스 기획 · PM, 정보구조(IA) · 카테고리 설계, User Flow, 화면설계서 · 스토리보드, 콘텐츠 기획</li><li><b>툴</b> — Figma · Notion · PowerPoint · Excel · Word</li><li><b>AI</b> — Claude · Claude Code · ChatGPT · Codex · Gemini · Copilot · Midjourney · Canva AI</li></ul>'],
      next: ['ia', 'aitools', 'research'] },
    { id: 'work', label: '아르바이트 · 경력은?', keys: ['경력', '알바', '아르바이트', '근무', '강사', '미술학원', '매장', '사회 경험', '일해 본'],
      a: ['<ul><li><b>클로버 미술학원 · 미술 강사</b> (2024.01 — 05) — 고3 수험생의 기초디자인 실기를 지도하며 멘탈 케어도 함께. 학생마다 작품의 장단점을 분석해 맞춤형 피드백을 줬어요.</li><li><b>PC방 매장 스태프</b> (2024.01) — 고객 응대 · 매장 관리, 주변기기 고장 원인을 찾아 직접 수리.</li></ul>',
          '학업과 병행하며 짧게는 3개월에서 길게는 1년 2개월까지 자리를 지켰어요. 손님과 학생의 말 너머 진짜 요구를 읽는 연습이 지금의 사용자 리서치로 이어졌어요.'],
      next: ['activities', 'research', 'strength'] },
    { id: 'activities', label: '교내 활동은?', keys: ['활동', '교내', '대외', '졸업전시', '전시배치', '학과'],
      a: ['<ul><li>졸업전시준비위원회 <b>전시배치팀</b> (2026.09 — 12)</li><li>2A 기획반 <b>부과대표</b> (2026, 1 · 2학기)</li><li>의왕 ESG 카드뉴스팀 <b>팀장</b> (2026.06 — 08, 혁신지원사업)</li><li>기획동아리 ‘초안’ 카드뉴스팀 <b>팀장</b> (2026)</li><li>선후배 교류 멘토링 5팀 <b>멘토</b> (2026.03 — 04)</li></ul>'],
      next: ['mentor', 'lead', 'work'] },

    /* ── 채용 정보 ── */
    { id: 'available', label: '언제부터 일할 수 있어?', keys: ['입사', '언제부터', '근무 가능', '시작', '졸업 예정', '인턴', '가능 시기', '출근'],
      a: ['<b>2027년 2월 졸업 예정</b>이에요.',
          '인턴 · 입사 가능 시기와 근무 형태는 상황에 따라 맞출 수 있으니, 아래 연락처로 직접 이야기 나눠 주시면 가장 정확해요.'],
      next: ['contact', 'location', 'docs'] },
    { id: 'location', label: '어디 살아?', keys: ['거주', '사는 곳', '주소', '어디 살', '위치', '지역', '출퇴근', '화성'],
      a: ['<b>경기도 화성시</b>에 살고 있어요.'],
      next: ['available', 'contact'] },
    { id: 'contact', label: '연락하고 싶어', keys: ['연락', '메일', '이메일', '전화', '번호', '인스타', '면접', '채용', '컨택'],
      a: ['언제든 환영이에요!',
          '<ul><li>메일 — ' + L('mailto:knewrun25@gmail.com', 'knewrun25@gmail.com') + '</li><li>전화 — ' + L('tel:+821034526632', '010.3452.6632') + '</li><li>인스타그램 — <a href="https://www.instagram.com/nwrnnyo/" target="_blank" rel="noopener">@nwrnnyo ↗</a></li></ul>'],
      next: ['docs', 'available', 'who'] },
    { id: 'docs', label: '이력서 · 자소서 받을래', keys: ['이력서', '자기소개서', '자소서', '레쥬메', 'resume', 'cv', 'pdf', '다운'],
      a: ['바로 받을 수 있어요.',
          '<ul><li>' + L('resume.pdf?v=8', '이력서 PDF ↓') + '</li><li>' + L('cover-letter.pdf?v=4', '자기소개서 PDF ↓') + '</li><li>프로젝트별 기획서 · 보고서 · 화면설계서 원본 — ' + L('works.html', '프로젝트 페이지') + '</li></ul>'],
      next: ['contact', 'projects'] },
    { id: 'salary', label: '희망 연봉 · 조건은?', keys: ['연봉', '급여', '월급', '페이', '조건', '처우', '복지'],
      a: ['그건 제가 대신 답하기보다, 유란이 직접 이야기 나누는 게 맞을 것 같아요 🙂',
          L('mailto:knewrun25@gmail.com', 'knewrun25@gmail.com') + ' 또는 ' + L('tel:+821034526632', '010.3452.6632') + '로 연락 주세요.'],
      next: ['contact', 'available'] }
  ];
  var byId = {}; KB.forEach(function (k) { byId[k.id] = k; });
  byId.menu = { id: 'menu', label: '질문 목록 보기' };
  var START = ['who', 'why', 'projects', 'way', 'ai', 'menu'];

  function norm(s) { return s.toLowerCase().replace(/[?!.,~·'"‘’“”]/g, ' ').replace(/\s+/g, ' ').trim(); }
  function match(q) {
    var s = norm(q), t = s.replace(/\s/g, '');
    var best = null, score = 0;
    KB.forEach(function (k) {
      var sc = 0;
      k.keys.forEach(function (w) { var wn = w.replace(/\s/g, ''); if (s.indexOf(w) > -1 || (wn.length > 1 && t.indexOf(wn) > -1)) sc += wn.length >= 3 ? 3 : wn.length === 2 ? 2 : 1; });
      if (k.label && t.indexOf(norm(k.label).replace(/\s/g, '').slice(0, 6)) > -1) sc += 2;
      sc *= (k.w || 1);
      if (sc > score) { score = sc; best = k; }
    });
    return score >= 1.5 ? best : null;
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
        '<div class="yb-head__t"><b>노른자 봇</b><small><span class="en">YOLK BOT</span> · 김유란에 대해 무엇이든</small></div>' +
        '<button type="button" class="yb-menu-btn" aria-label="질문 목록 보기">목록</button>' +
        '<button type="button" class="yb-close" aria-label="닫기">✕</button></header>' +
      '<div class="yb-log" role="log" aria-live="polite"></div>' +
      '<div class="yb-chips"></div>' +
      '<form class="yb-form" autocomplete="off"><input class="yb-input" type="text" placeholder="예) 팀장 경험은? 왜 뽑아야 해?" aria-label="질문 입력" maxlength="80">' +
        '<button type="submit" class="yb-send" aria-label="보내기">↑</button></form>' +
    '</section>';
  document.body.appendChild(root);

  var launch = root.querySelector('.yb-launch'), panel = root.querySelector('.yb-panel'),
      log = root.querySelector('.yb-log'), chips = root.querySelector('.yb-chips'),
      form = root.querySelector('.yb-form'), input = root.querySelector('.yb-input');
  var started = false, busy = false;

  function scroll() { log.scrollTop = log.scrollHeight; }
  function addUser(t) { var d = document.createElement('div'); d.className = 'yb-msg yb-msg--me'; d.textContent = t; log.appendChild(d); scroll(); }
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
      var html = parts[i++], wait = Math.min(850, 340 + html.replace(/<[^>]+>/g, '').length * 3);
      setTimeout(function () { typing.className = 'yb-msg'; typing.innerHTML = html; scroll(); setTimeout(nextPart, 140); }, wait);
    })();
  }
  function showChips(ids) {
    chips.innerHTML = ids.map(function (id) { return byId[id] ? '<button type="button" class="yb-chip' + (id === 'menu' ? ' yb-chip--menu' : '') + '" data-q="' + id + '">' + byId[id].label + '</button>' : ''; }).join('');
  }
  function showMenu() {
    if (busy) return;
    var html = '<div class="yb-cats">' + CATS.map(function (c, i) { return '<button type="button" class="yb-cat" data-cat="' + i + '">' + c[0] + ' <em>' + c[1].length + '</em></button>'; }).join('') + '</div>';
    addBot(['어떤 게 궁금하세요? 분야를 고르면 질문을 보여드릴게요.', html], function () { showChips(['who', 'why', 'projects']); });
  }
  function showCat(i) {
    if (busy) return;
    var c = CATS[i]; addUser(c[0]);
    addBot([c[0] + ' — 이런 질문에 답할 수 있어요.'], function () { showChips(c[1].concat(['menu'])); });
  }
  function answer(k) { addBot(k.a, function () { showChips((k.next || []).concat(['menu'])); }); }
  function ask(text, k) {
    if (busy) return;
    if (k && k.id === 'menu') { addUser(text); showMenu(); return; }
    addUser(text);
    k = k || match(text);
    if (k) answer(k);
    else addBot(['음, 그 질문은 제가 정확히 답하기 어려워요 🥚 지어내서 말하진 않을게요.', '대신 <b>일하는 방식 · 협업 · 프로젝트 · AI 활용 · 이력 · 채용 정보</b>는 자신 있어요. 더 궁금한 건 ' + L('mailto:knewrun25@gmail.com', '유란에게 직접') + ' 물어봐 주세요!'], function () { showChips(['menu', 'who', 'why', 'contact']); });
  }

  function open() {
    panel.hidden = false; root.classList.add('is-open'); launch.setAttribute('aria-expanded', 'true');
    if (!started) { started = true; addBot(byId.hi.a, function () { showChips(START); }); }
    setTimeout(function () { if (window.matchMedia('(min-width: 641px)').matches) input.focus(); }, 60);
  }
  function close() { panel.hidden = true; root.classList.remove('is-open'); launch.setAttribute('aria-expanded', 'false'); launch.focus(); }

  launch.addEventListener('click', function () { panel.hidden ? open() : close(); });
  root.querySelector('.yb-close').addEventListener('click', close);
  root.querySelector('.yb-menu-btn').addEventListener('click', function () { if (!busy) { addUser('질문 목록 보기'); showMenu(); } });
  chips.addEventListener('click', function (e) { var b = e.target.closest('.yb-chip'); if (!b) return; var k = byId[b.dataset.q]; ask(k.label, k); });
  log.addEventListener('click', function (e) { var c = e.target.closest('.yb-cat'); if (c) showCat(+c.dataset.cat); });
  form.addEventListener('submit', function (e) { e.preventDefault(); var t = input.value.trim(); if (!t) return; input.value = ''; ask(t); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) close(); });
  document.addEventListener('click', function (e) { var t = e.target.closest && e.target.closest('[data-yolkbot]'); if (!t) return; e.preventDefault(); open(); });

  try {
    if (!sessionStorage.getItem('yolkbot-tip')) {
      setTimeout(function () { root.classList.add('tip-on'); }, 2600);
      setTimeout(function () { root.classList.remove('tip-on'); try { sessionStorage.setItem('yolkbot-tip', '1'); } catch (e) {} }, 8600);
    }
  } catch (e) {}
  window.__yolkbotMatch = match;
})();
