/* 노른자 봇 — 김유란을 소개하는 챗봇
   서버 없이 동작합니다. 답변은 이력서 · 자기소개서 · 프로젝트 문서 · AI 활용 페이지에 있는 사실만 근거로, 문장으로 답합니다. */
(function () {
  if (window.__yolkbot) return; window.__yolkbot = true;

  var L = function (href, text) { return '<a href="' + href + '">' + text + '</a>'; };
  var PJ = function (id, text) { return L('project.html?id=' + id, text); };
  var MAIL = '<a href="mailto:knewrun25@gmail.com" data-mail="gmail" target="_blank" rel="noopener">knewrun25@gmail.com</a>';

  /* ---------- 질문 카테고리 ---------- */
  var CATS = [
    ['소개', ['who', 'slogan', 'role', 'vision']],
    ['일하는 방식', ['way', 'research', 'define', 'ia', 'usability', 'data', 'record', 'plan']],
    ['협업 · 리더십', ['lead', 'conflict', 'feedback', 'present', 'teamrole', 'mentor']],
    ['성격 · 강점', ['je', 'strength', 'punctual', 'sense', 'weakness', 'failure', 'newbie', 'why']],
    ['프로젝트', ['projects', 'haelon', 'kiosk', 'weverse', 'seongsu', 'arcdot', 'coupang', 'bluedog', 'ieumline', 'portfolio', 'dam']],
    ['AI 활용', ['ai', 'prompt', 'token', 'site', 'noai', 'aitools']],
    ['이력 · 스펙', ['edu', 'awards', 'certs', 'skills', 'work', 'activities']],
    ['채용 정보', ['available', 'location', 'contact', 'docs', 'salary']]
  ];

  /* ---------- 지식 (모두 문장형, 결론으로 끝맺음) ---------- */
  var KB = [
    { id: 'hi', label: '안녕!', keys: ['안녕', '하이', '반가', 'hello', 'hi', '헬로'],
      a: ['안녕하세요! 저는 김유란을 소개하는 <b>노른자 봇</b>이에요 🍳', '일하는 방식부터 프로젝트, 회사와 잘 맞을지까지 무엇이든 편하게 물어봐 주세요. 예를 들어 "우리 회사는 ○○인데 잘 맞을까?"처럼 물어보셔도 좋아요.'],
      next: ['who', 'why', 'projects', 'menu'] },

    /* 소개 */
    { id: 'who', label: '김유란은 어떤 기획자야?', keys: ['누구', '소개', '어떤 기획자', '어떤 사람', '자기소개', '한마디', '정체', '1분', '간단히'],
      a: ['김유란은 <b>판을 계획하고, 핵심만 남기는 노른자 같은 기획자</b>예요. 겉으로 드러난 현상에 머물지 않고 서비스 전체를 지탱하는 진짜 문제를 먼저 찾은 다음, 근거로 방향을 세워 끝까지 핵심만 남기는 방식으로 일해요.',
          '계원예술대학교 디지털미디어디자인과에서 기획을 세부전공하고 있고(2027년 2월 졸업 예정), 팀 프로젝트 7개 모두에서 팀장과 발표를 맡아 결과까지 책임졌어요. 한마디로, <b>문제를 정확히 짚고 팀을 끝까지 이끄는 UX/UI · 서비스 기획자</b>예요.'],
      next: ['why', 'way', 'projects'] },
    { id: 'slogan', label: '왜 하필 ‘노른자’야?', keys: ['노른자', '슬로건', '달걀', '컨셉', '왜 노른자', '키워드'],
      a: ['달걀은 겉모습만 보면 다 비슷하지만, 깨 보면 전체를 지탱하는 노른자가 있어요. 서비스도 마찬가지로 겉의 현상은 비슷해 보여도 그 안에 전체를 지탱하는 진짜 문제가 있고, 유란은 바로 그 핵심을 찾아내는 사람이라는 뜻이에요.',
          '이 사이트도 같은 구조로 만들었어요. 첫 화면은 첫인상인 달걀, 이력은 노른자를 지탱하는 흰자, 프로젝트는 핵심인 노른자예요. 그래서 <b>노른자는 유란이 일하는 방식 그 자체</b>예요.'],
      next: ['way', 'portfolio', 'who'] },
    { id: 'role', label: '희망 직무는?', keys: ['직무', '희망 직무', '포지션', '어떤 일', '하고 싶은 일', '직군', '서비스 기획', 'ux', 'ui'],
      a: ['유란이 원하는 직무는 <b>UX/UI · 서비스 기획</b>이에요. 사용자 리서치로 문제를 정의하고, 정보구조와 사용자 흐름, 화면설계서로 서비스를 구체화하는 일을 꾸준히 해 왔어요.',
          '웹과 앱은 물론 키오스크와 웨어러블까지 화면이 놓이는 기기에 맞춰 설계해 봤고, 팀에서는 늘 팀장이자 PM으로 일정과 방향을 이끌었어요. 그래서 <b>기획부터 실행까지 바로 맡길 수 있는 기획자</b>예요.'],
      next: ['skills', 'way', 'projects'] },
    { id: 'vision', label: '앞으로 어떤 기획자가 되고 싶어?', keys: ['앞으로', '목표', '비전', '꿈', '미래', '포부', '되고 싶', '5년', '커리어'],
      a: ['유란은 어떤 서비스를 만나든 겉모습에 머무르지 않고, 사용자와 팀 모두를 지탱하는 진짜 문제를 찾아내는 기획자로 성장하고 싶어 해요. 그리고 그 과정을 함께하는 사람들과 나누며 더 단단한 결과로 이어가는 게 목표예요.',
          '지금까지 프로젝트마다 문제를 다시 정의하고 결과를 숫자로 확인해 온 만큼, <b>들어가는 팀에서도 핵심을 찾는 사람으로 빠르게 자리 잡을 거예요.</b>'],
      next: ['why', 'strength', 'contact'] },

    /* 일하는 방식 */
    { id: 'way', label: '일하는 방식이 궁금해', keys: ['방식', '일하', '작업 방식', '프로세스', '과정', '어떻게 일', '접근', '순서', '스타일'],
      a: ['유란은 먼저 목표와 범위를 정해 판을 그리고, 현상을 한 겹 더 파고들어 진짜 문제를 짚은 뒤, 펼쳐진 아이디어를 덜어내 핵심만 남겨요. 그리고 이 모든 과정을 팀원 각자의 강점을 살려 함께 해요.',
          '예를 들어 쿠팡 로켓프레시에서는 화면을 고치기 전에 사용자 50명 설문부터 설계했고, Arc.Dot에서는 실태조사를 다시 파고들어 문제를 ‘정보의 사각지대’로 정의했어요. 그래서 유란과 일하면 <b>방향이 흔들리지 않고, 결과가 분명하게 나와요.</b>'],
      next: ['research', 'define', 'lead'] },
    { id: 'research', label: '리서치는 어떻게 해?', keys: ['리서치', '조사', '인터뷰', '설문', '현장', '필드', '관찰', '데스크', '사용자 조사'],
      a: ['유란은 책상과 현장을 함께 써요. 쿠팡에서는 사용자 50명 설문을, 블루독에서는 산책로와 공원, 애견카페를 직접 찾아가 시민과 관계자를 인터뷰했고, 크리에이티브X성수에서는 행사장을 7시간 동안 걸으며 관찰했어요.',
          '위버스에서는 사용자 5명의 아이트래킹과 사용성 테스트를 직접 설계했고, 발표에 쓰는 숫자는 원문을 찾아 하나씩 확인해요. 그래서 유란의 기획은 <b>느낌이 아니라 현장과 근거에서 출발해요.</b>'],
      next: ['define', 'usability', 'data'] },
    { id: 'define', label: '문제 정의는 어떻게 해?', keys: ['문제 정의', '문제정의', '핵심 문제', '재정의', '원인', '인사이트', '본질'],
      a: ['유란은 "현상이 아니라 핵심"이라는 한 문장으로 문제를 다시 써 보는 습관이 있어요. HAELON에서는 문제를 드론 탐지가 아니라 관제사와 기장, 보안요원 사이의 ‘전달’로, 위버스에서는 콘텐츠 양이 아니라 ‘기준이 불분명한 카테고리’로 다시 정의했어요.',
          '이렇게 문제를 정확히 잡자 해결책도 하나의 방향으로 모였어요. 그래서 <b>유란은 팀이 엉뚱한 문제를 푸느라 시간을 쓰지 않게 만드는 사람</b>이에요.'],
      next: ['research', 'haelon', 'weverse'] },
    { id: 'ia', label: '정보구조 · 화면설계서도 해?', keys: ['정보구조', 'ia', '화면설계', '화면 설계', '와이어', '스토리보드', '설계서', '플로우', 'user flow'],
      a: ['네, 유란은 정보구조와 화면설계서를 직접 만들어요. 쿠팡 프로젝트에서는 PC와 태블릿, 모바일 화면설계서를 전부 혼자 만들었고, 이 포트폴리오 사이트도 화면설계서 42쪽을 먼저 쓴 뒤 그대로 구현했어요.',
          'HAELON 보안요원 디바이스와 위버스 개선안까지 화면설계서가 모두 8건이고, ' + L('works.html?type=wire', '프로젝트 페이지') + '에서 원본을 바로 볼 수 있어요. <b>실무 문서를 바로 쓸 수 있는 기획자</b>예요.'],
      next: ['portfolio', 'coupang', 'skills'] },
    { id: 'usability', label: '사용성 평가 해봤어?', keys: ['사용성', '테스트', '아이트래킹', 'usability', '검증', '평가', 'ut'],
      a: ['네, 위버스 프로젝트에서 사용성 평가를 1차와 2차로 직접 설계하고 진행했어요. 사용자 5명에게 같은 과업을 주고 아이트래킹과 성공률, 시간을 측정해 문제를 검증한 뒤, 카테고리와 필터 구조를 다시 설계했어요.',
          '그 결과 같은 과업의 성공률이 <b>55%에서 92%로</b> 올랐고 과업 시간도 크게 줄었어요. 문제를 직접 증명하고, 고친 효과까지 숫자로 보여주는 기획자예요. ' + PJ('07', '자세히 보기 →')],
      next: ['weverse', 'data', 'research'] },
    { id: 'data', label: '데이터 · 수치는 어떻게 써?', keys: ['데이터', '수치', '숫자', '근거', '통계', '정량', '지표', '성과'],
      a: ['유란은 "어렵다"는 느낌을 숫자로 바꿔야 팀의 판단이 빨라진다고 생각해요. 위버스에서는 성공률을 55%에서 92%로 끌어올린 걸 확인했고, 쿠팡에서는 불편 1위가 ‘많은 정보량’(55%)이라는 설문 결과로 개선 방향을 정했어요.',
          '숫자는 반드시 원문을 찾아 직접 확인하기 때문에, <b>유란이 내놓는 근거는 믿고 쓸 수 있어요.</b>'],
      next: ['usability', 'define', 'record'] },
    { id: 'record', label: '기록은 어떻게 해?', keys: ['기록', '문서화', '회의록', '정리', '남기', '로그', '아카이브'],
      a: ['유란은 무엇을 왜 바꿨는지를 꼭 남겨요. 숫자는 원문과 대조해 확인할 곳을 표시해 두고, 화면설계서는 버전과 수정 내용을 관리하며, AI에 맡긴 일과 팀이 직접 한 일도 표로 정리해요.',
          '크리에이티브X성수 제안서에서는 지적 57건을 수용·기각·보류로 하나씩 정리했어요. 그래서 <b>유란의 작업은 누가 이어받아도 흐름이 끊기지 않아요.</b>'],
      next: ['plan', 'seongsu', 'punctual'] },
    { id: 'plan', label: '일정 관리는?', keys: ['일정', '마감', '데드라인', '스케줄', '시간 관리', '계획', '관리', '우선순위'],
      a: ['유란은 계획형(J)이라 시작할 때 목표와 범위, 일정, 산출물을 먼저 정하고, 긴 일은 번호를 붙여 작게 쪼갠 뒤 하나씩 끝내요. 이 포트폴리오 사이트도 구조 세우기, 화면 완성, 검증과 공개의 세 단계로 나눠 진행했어요.',
          '팀 프로젝트 7개를 모두 팀장으로 마감까지 이끌었으니, <b>일정과 약속은 믿고 맡기셔도 돼요.</b>'],
      next: ['punctual', 'record', 'lead'] },

    /* 협업 · 리더십 */
    { id: 'lead', label: '팀장 경험은?', keys: ['리더', '리더십', '팀장', '리드', '이끌', '반장', '과대', '부과대표', '주도'],
      a: ['유란은 팀장과 리드 경험이 10회예요. 포트폴리오의 팀 프로젝트 7개 모두에서 팀장이자 발표자였고, 동아리 카드뉴스팀 팀장과 학과 부과대표, 멘토링 멘토, 고등학교 3년 반장까지 맡았어요.',
          '유란에게 이끈다는 건 혼자 앞서는 게 아니라 함께 걷는 속도를 맞추는 일이에요. 그래서 <b>팀원들이 끝까지 함께 가고 싶어 하는 리더</b>예요.'],
      next: ['conflict', 'teamrole', 'je'] },
    { id: 'conflict', label: '의견이 부딪히면?', keys: ['갈등', '충돌', '부딪', '의견 차이', '반대', '설득', '다툼', '이견'],
      a: ['유란은 의견이 부딪히면 판단을 밀어붙이지 않고 근거로 설득해요. 다른 의견을 낸 사람이 소외되지 않도록 왜 그렇게 생각했는지 끝까지 이유를 함께 짚어요.',
          'HAELON에서도 첫 설계를 두고 의견이 갈렸을 때, 역할 시뮬레이션에서 나온 질문을 근거로 팀이 함께 더 나은 구조를 골랐어요. <b>갈등을 더 좋은 결과로 바꾸는 사람</b>이에요.'],
      next: ['lead', 'feedback', 'teamrole'] },
    { id: 'feedback', label: '피드백은 어떻게 받아들여?', keys: ['피드백', '비판', '지적', '수정 요청', '받아들', '코멘트', '레드팀'],
      a: ['유란은 지적을 감정이 아니라 원문으로 판단해요. 크리에이티브X성수 제안서에서 평가위원 시점의 검토로 57건의 지적을 받았을 때도, 하나하나 원문을 열어 반영할지 정한 뒤 보완 계획표로 만들었어요.',
          '매 과제마다 부족한 점을 돌아보고 다음에 반영해 온 습관이 성적 우수 장학금 2회로도 이어졌어요. <b>피드백을 받으면 반드시 더 나아지는 사람</b>이에요.'],
      next: ['seongsu', 'failure', 'record'] },
    { id: 'present', label: '발표 경험은?', keys: ['발표', '프레젠테이션', 'pt', '스피치', '말하기', '청중'],
      a: ['유란은 포트폴리오의 팀 프로젝트 7개 모두에서 발표를 맡았어요. HAELON 최종 발표에서는 청중을 ‘이륙이 멈춘 비행기 승객’으로 설정하고, 마지막에 확정 버튼 하나로 다섯 곳에 동시에 알림이 가는 장면을 직접 보여주며 첫 질문에 답하는 구조로 4분 57초를 설계했어요.',
          '내용을 설명하는 데서 그치지 않고 듣는 사람이 직접 느끼게 만들기 때문에, <b>유란의 발표는 기억에 남아요.</b>'],
      next: ['haelon', 'lead', 'sense'] },
    { id: 'teamrole', label: '팀에서 주로 맡는 역할은?', keys: ['역할', '맡은', '팀에서', '담당', '기여'],
      a: ['유란은 주로 팀장이자 PM, 기획 총괄을 맡아 문제 정의와 방향을 잡고, 일정을 나누고, 최종 문서와 발표까지 책임져요. 동시에 직접 만드는 사람이라 쿠팡에서는 화면설계서를 전부 직접 만들었고, 크리에이티브X성수에서는 제안 논리와 본문을 썼어요.',
          '역할을 나눌 때는 팀원 각자의 강점을 찾아 맡기기 때문에, <b>유란이 있는 팀은 모두가 제 몫을 해요.</b>'],
      next: ['lead', 'conflict', 'projects'] },
    { id: 'mentor', label: '멘토링 · 동아리 활동은?', keys: ['멘토', '멘토링', '동아리', '초안', '카드뉴스', '학생회'],
      a: ['유란은 기획동아리 ‘초안’에서 기획부원으로 시작해 카드뉴스팀 팀장이 되어 학과 홍보 콘텐츠를 정기적으로 기획하고 만들고 있어요. 2026 혁신지원사업에서는 의왕 ESG 카드뉴스팀 팀장으로 결과발표회까지 함께했고, 선후배 멘토링에서는 멘토를 맡았어요.',
          '학과 2A 기획반 부과대표와 졸업전시 전시배치팀까지 맡고 있으니, <b>맡은 자리에서 늘 꾸준히 몫을 해내는 사람</b>이에요.'],
      next: ['activities', 'lead', 'work'] },

    /* 성격 · 강점 */
    { id: 'je', label: '성격은 어때? (J + E)', keys: ['성격', 'mbti', '엠비티아이', '외향', '계획형', '성향', 'j+e', 'je', '분위기'],
      a: ['유란은 J와 E가 뚜렷한 사람이에요. 계획형답게 움직이기 전에 목표와 일정을 먼저 그리고, 외향형답게 앞에 서서 사람을 모으는 걸 두려워하지 않아요.',
          '그러면서도 혼자 앞서가지 않고 다른 의견을 끝까지 함께 짚어요. 그래서 <b>계획은 단단하고, 분위기는 밝은 팀을 만드는 사람</b>이에요.'],
      next: ['lead', 'strength', 'punctual'] },
    { id: 'strength', label: '강점이 뭐야?', keys: ['강점', '장점', '잘하는', '차별', '특징', '매력', '무기'],
      a: ['유란의 가장 큰 강점은 겉이 아니라 핵심을 짚는 힘이에요. 쿠팡에서 ‘화면이 복잡하다’는 문제의 진짜 원인이 목적과 어긋난 카테고리라는 걸 찾아냈고, 개선안 9종을 모두 하나의 방향으로 묶었어요.',
          '여기에 계획을 끝까지 지키는 성실함, 사람을 모으는 에너지, 디자인 감각, 그리고 AI를 근거 정리 도구로 다루는 능력이 더해져요. <b>일을 잘하는 데 필요한 것을 고루 갖춘 기획자</b>예요.'],
      next: ['why', 'sense', 'punctual'] },
    { id: 'punctual', label: '성실하고 약속은 잘 지켜?', keys: ['성실', '약속', '시간 약속', '지각', '책임감', '꾸준', '근태', '믿을'],
      a: ['네, 유란은 약속과 마감을 지키는 사람이에요. 학업과 병행하며 미술학원 강사, 카페, 매장 일을 짧게는 3개월에서 길게는 1년 2개월까지 꾸준히 이어 왔고, 고등학교 3년 내내 반장과 대학 부과대표를 맡아 일정과 약속을 먼저 챙겨 왔어요.',
          '팀 프로젝트 7개를 모두 팀장으로 마감까지 이끌었으니, <b>시간 약속과 책임감은 걱정하지 않으셔도 돼요.</b>'],
      next: ['plan', 'work', 'lead'] },
    { id: 'sense', label: '센스나 감각은 어때?', keys: ['센스', '감각', '디자인 감각', '안목', '미적', '심미', '트렌드', '눈썰미'],
      a: ['유란은 디자인 실기에서 수원대 전국 대회 최우수상과 건국대, 경희대 대회 본상을 받은 디자인 감각을 갖고 있어요. 그래서 기획서도 읽히는 구조와 보기 좋은 화면을 함께 생각해요.',
          '이 포트폴리오 사이트도 흰 바탕과 노른자 포인트, 두 가지 서체만으로 브랜드 규칙을 세워 직접 완성했어요. <b>기획의 논리와 화면의 감각을 함께 갖춘 사람</b>이에요.'],
      next: ['portfolio', 'awards', 'strength'] },
    { id: 'weakness', label: '보완하고 싶은 점은?', keys: ['약점', '단점', '부족', '보완', '아쉬', '개선할 점', '한계'],
      a: ['유란이 스스로 더 키우고 싶어 하는 건 실제 사용 현장에서의 검증을 더 일찍, 더 많이 하는 거예요. 그래서 위버스에서는 1차 평가로 문제를 증명하고 2차 평가로 효과를 확인하는 방식을 직접 만들었어요.',
          '부족한 점을 알고 바로 방법으로 바꾸는 사람이라, <b>함께 일할수록 계속 더 정확해져요.</b>'],
      next: ['failure', 'usability', 'strength'] },
    { id: 'failure', label: '실패 · 방향을 바꾼 경험은?', keys: ['실패', '실수', '바꾼', '버린', '전환', '어려웠', '위기', '극복', '시행착오'],
      a: ['HAELON에서 유란은 첫 설계를 두 번 과감히 바꿨어요. ‘확인을 누르면 끝’이던 알림을 상황, 읽음 확인, 조치 진행을 따로 남기는 구조로 바꿨고, 보안요원 기기도 폴더블 폰에서 ‘손은 자유롭게, 시선은 현장에’라는 조건에 맞는 스마트 글래스와 손목 기기로 바꿨어요.',
          '틀린 걸 빨리 인정하고 조건을 다시 세웠기 때문에 결과물이 더 단단해졌어요. <b>실패를 더 나은 설계로 바꾸는 사람</b>이에요.'],
      next: ['haelon', 'conflict', 'weakness'] },
    { id: 'newbie', label: '신입으로 잘 적응할까?', keys: ['신입', '적응', '처음', '배우', '학습', '빨리', '성장 속도', '주니어'],
      a: ['네, 잘 적응할 거예요. 유란은 매 과제마다 부족한 점을 돌아보고 다음에 반영해 성적 우수 장학금을 두 번 받았고, 처음 다뤄 보는 분야도 리서치부터 시작해 짧은 기간에 화면설계서와 프로토타입까지 완성해 왔어요.',
          '피드백을 원문으로 받아들이고, 팀에서는 먼저 일정과 역할을 챙기는 사람이라 <b>신입이어도 금방 믿고 일을 맡길 수 있는 사람</b>이에요.'],
      next: ['punctual', 'feedback', 'why'] },
    { id: 'why', label: '왜 김유란을 뽑아야 해?', keys: ['왜 뽑', '뽑아야', '채용해야', '왜 너', '왜 김유란', '어필', '경쟁력', '이유', '추천'],
      a: ['유란은 프로젝트마다 현상을 한 겹 더 파서 진짜 문제를 다시 정의하고, 리서치에서 끝내지 않고 화면설계서와 프로토타입, 웹사이트까지 직접 완성해요. 팀 프로젝트 7개 모두에서 팀장과 발표를 맡았고, 그 결과는 국제 어워드 입선과 ESG 우수작 선정으로 이어졌어요.',
          '여기에 시간 약속을 지키는 성실함과 디자인 감각, AI로 속도를 내면서도 판단은 직접 하는 일하는 법까지 갖췄어요. <b>바로 함께 일하기 좋은, 믿고 맡길 수 있는 기획자예요.</b>'],
      next: ['strength', 'awards', 'contact'] },

    /* 프로젝트 */
    { id: 'projects', w: .5, label: '프로젝트 전체 보여줘', keys: ['프로젝트', '작업물', '대표', '핵심 프로젝트', '포폴', '결과물', '어떤 프로젝트', '프로젝트 목록'],
      a: ['유란의 프로젝트는 모두 8개이고, 그중 핵심은 공항 드론 테러 통합 관제 서비스 ' + PJ('01', '<b>HAELON</b>') + ', 사용성 평가로 성공률을 55%에서 92%로 높인 ' + PJ('07', '<b>위버스</b>') + ', 성수동 현장을 직접 걸으며 쓴 ' + PJ('08', '<b>크리에이티브X성수 제안서</b>') + '예요.',
          '그 밖에 ' + PJ('02', 'Arc.Dot') + ', ' + PJ('03', '쿠팡 로켓프레시') + ', ' + PJ('05', '블루독') + ', ' + PJ('04', '이음선') + ', ' + PJ('10', '포트폴리오 웹사이트 기획서') + '가 있어요. 모든 프로젝트를 ' + L('works.html', '원본 문서') + '와 함께 볼 수 있어서, <b>말이 아니라 결과물로 확인하실 수 있어요.</b>'],
      next: ['haelon', 'weverse', 'seongsu'] },
    { id: 'haelon', label: 'HAELON은 뭐야?', keys: ['haelon', '헤일론', '드론', '공항', '관제', '공중도덕', '캡스톤'],
      a: ['HAELON은 공항 드론 테러 감지 · 대응 통합 관제 서비스이고, 유란이 팀 공중도덕의 팀장과 발표를 맡았어요. 사례를 모아 보니 드론을 잡는 장비는 이미 있었고, 진짜 문제는 관제사가 확인한 정보가 기장과 보안요원, 시민에게 한 명씩 말로 전달된다는 것이었어요.',
          '그래서 관제사용 가로형 통합 관제 키오스크를 중심으로, 확정 한 번이면 네 화면에 동시에 정보가 닿는 흐름을 만들었어요. 사람의 안전을 앞에 둔 이 설계는 ESG 우수작으로도 선정됐어요. ' + PJ('01', '직접 체험해 보기 →')],
      next: ['kiosk', 'failure', 'present'] },
    { id: 'kiosk', label: '가로형 관제 키오스크는?', keys: ['키오스크', '가로형', '관제사', '3d', '뉴미디어', '디지털 트윈', '시뮬레이션'],
      a: ['가로형 통합 관제 키오스크는 HAELON의 메인 기기예요. 관제사가 확정해야 모두에게 정보가 가기 때문에, 레이더와 CCTV, 운항 정보를 하나의 공항 위에 겹쳐 보고 출동과 출발 정지, 대피를 한 곳에서 승인하도록 가로로 넓게 설계했어요.',
          '인천공항을 3D 공간으로 옮기고, 시간대와 시점을 바꾸고, 40초 시나리오로 대응 과정을 직접 체험하게 만들어 뉴미디어를 ‘보는 화면’이 아니라 ‘겪는 관제’로 풀었어요. ' + PJ('01', '사이트에서 직접 눌러 볼 수 있어요 →')],
      next: ['haelon', 'ia', 'sense'] },
    { id: 'weverse', label: '위버스 프로젝트는?', keys: ['위버스', 'weverse', '미디어 탐색', '미디어 프로토', '세븐틴', '팬'],
      a: ['위버스 프로젝트는 미디어 탭에서 원하는 콘텐츠를 찾기 어려운 문제를 사용성 평가로 풀어낸 보고서예요. 유란이 3인 팀의 팀장과 발표를 맡았고, 사용자 5명의 아이트래킹과 테스트로 원인이 콘텐츠 양이 아니라 기준이 불분명한 카테고리와 필터라는 걸 직접 검증했어요.',
          '카테고리를 세 가지 유형으로 압축하고 필터를 다시 설계한 뒤 2차 평가를 해 보니, 같은 과업의 성공률이 <b>55%에서 92%로</b> 올랐어요. ' + PJ('07', '자세히 보기 →')],
      next: ['usability', 'data', 'projects'] },
    { id: 'seongsu', label: '크리에이티브X성수 제안서는?', keys: ['성수', '크리에이티브', '제안서', '용역', '전시', '써밋', 'rfp', '성동'],
      a: ['크리에이티브X성수 제안서는 성동문화재단의 주제전시와 써밋 용역을 가정한 모의 제안서예요. 유란이 2인 팀의 팀장과 발표를 맡아, 행사장을 7시간 동안 직접 걸으며 스탬프는 매장으로 흩어지고 1층 전시와 3층 써밋이 따로 열린다는 걸 확인했어요.',
          '그래서 작품을 체험한 사람이 네트워킹과 성수동 축제까지 자연스럽게 이어지는 행사를 제안했고, 평가자가 읽는 순서에 맞춰 구조를 세웠어요. ' + PJ('08', '자세히 보기 →')],
      next: ['feedback', 'record', 'projects'] },
    { id: 'arcdot', label: 'Arc.Dot은 뭐야?', keys: ['arc', '아크닷', 'arcdot', '장애인', '스포츠', '오륜기세', '어워드'],
      a: ['Arc.Dot은 데이터 기반 장애인 스포츠 매니지먼트 서비스이고, 유란이 3인 팀의 팀장이자 PM, 발표를 맡았어요. 선수들이 가장 큰 어려움으로 ‘기록 증명 불가’를 꼽은 데서 출발해, 문제를 ‘정보의 사각지대’로 다시 정의했어요.',
          '훈련 기록과 AI 코칭, 스카우팅을 잇는 정보구조를 설계했고, <b>제32회 커뮤니케이션디자인 국제 어워드에서 입선</b>했어요. ' + PJ('02', '자세히 보기 →')],
      next: ['define', 'awards', 'projects'] },
    { id: 'coupang', label: '쿠팡 로켓프레시는?', keys: ['쿠팡', '로켓프레시', '로켓', '신선', '장보기', '이커머스'],
      a: ['쿠팡 로켓프레시 메인페이지 리뉴얼에서 유란은 5인 팀의 팀장과 발표를 맡았고, PC와 태블릿, 모바일 화면설계서를 전부 직접 만들었어요. 20대 모바일 사용자 50명 설문에서 불편 1위가 ‘많은 정보량’이었는데, 그 원인이 화면이 아니라 목적과 어긋난 카테고리라는 걸 찾아냈어요.',
          '목적 기반 카테고리 재구조화를 중심으로 개선안 9종을 하나의 방향으로 묶었어요. <b>커머스의 장보기 흐름을 사용자 관점에서 다시 짤 수 있는 기획자</b>예요. ' + PJ('03', '자세히 보기 →')],
      next: ['ia', 'data', 'projects'] },
    { id: 'bluedog', label: '블루독은?', keys: ['블루독', 'bluedog', '은퇴견', '경찰견', '과천', '반려견'],
      a: ['블루독은 과천의 은퇴견과 시민을 잇는 상생 플랫폼이에요. 유란이 3인 팀의 팀장과 발표를 맡아, 산책로와 공원, 애견카페를 직접 찾아가 시민과 보호자, 관계자를 인터뷰했어요.',
          '2차 현장 조사에서 ‘산책 전 돌발 상황 대처 교육’ 같은 안전망이 먼저 필요하다는 걸 확인하고 서비스 방향을 바꿨어요. <b>현장에서 답을 찾는 기획자</b>라는 걸 보여주는 프로젝트예요. ' + PJ('05', '자세히 보기 →')],
      next: ['research', 'projects', 'way'] },
    { id: 'ieumline', label: '이음선은?', keys: ['이음선', '철도', '박물관', '의왕', '공간', '굴다리', '동선'],
      a: ['이음선은 한국철도박물관 일대를 다시 구성한 공간 경험 기획이고, 유란이 6인 팀의 팀장과 발표를 맡았어요. 박물관과 생태습지가 굴다리 하나를 사이에 두고 따로 이용되는 이유가 볼거리가 아니라 이어지지 않은 동선이라는 걸 찾았어요.',
          '그래서 권역 전체를 아홉 개 역의 노선으로 묶고 굴다리를 ‘이음터널’로 바꿔, 관람 전체를 하나의 기차 여행처럼 만들었어요. ' + PJ('04', '자세히 보기 →')],
      next: ['define', 'projects', 'research'] },
    { id: 'portfolio', label: '이 포트폴리오 사이트는?', keys: ['포트폴리오 사이트', '포트폴리오 기획', '이 사이트', '웹사이트 기획', 'yolk planner', '사이트 기획'],
      a: ['이 사이트도 유란의 기획 프로젝트예요. ‘판을 계획하고, 핵심만 남기는 노른자 같은 기획자’라는 한 문장에서 출발해 컨셉과 브랜드 규칙, 정보구조를 정하고, 화면설계서 42쪽을 먼저 쓴 다음 그 문서를 기준으로 직접 구현했어요.',
          '이력서와 자기소개서, 웹사이트가 모두 같은 문장과 같은 순서로 말하도록 맞췄어요. <b>나 자신도 하나의 서비스처럼 기획할 줄 아는 사람</b>이에요. ' + PJ('10', '기획서 보기 →')],
      next: ['site', 'sense', 'slogan'] },
    { id: 'dam', label: '담(DAM)은?', keys: ['담 프로젝트', '담(dam)', 'dam', '학교 안전', '교권', '학교폭력', '초중고'],
      a: ['담(DAM)은 초 · 중 · 고 통합 안전 · 생활지원 플랫폼으로, 유란이 2026 캡스톤디자인에서 팀장과 서비스 기획을 맡았어요. 교권침해와 학교폭력, 화재 같은 위기에 통합 대응 체계가 없다는 문제에서 출발해, 기능을 평시와 긴급 두 모드로 덜어냈어요.',
          '키오스크와 모바일, 웹의 정보구조를 각각 설계했고 졸업전시에서 43인치 키오스크로 시연할 예정이에요. <b>복잡한 기능을 위기 상황에서도 쓸 수 있게 단순하게 만드는 기획자</b>예요.'],
      next: ['way', 'haelon', 'projects'] },

    /* AI 활용 */
    { id: 'ai', label: 'AI는 어떻게 써?', keys: ['ai', '에이아이', '인공지능', '클로드', 'claude', 'fable', '페이블', 'opus', '오퍼스', '활용'],
      a: ['유란의 원칙은 "AI에게 맡기지 않고, AI와 판을 짠다"예요. 주로 Claude Code를 쓰고, 긴 자료 구조화와 큰 구현은 Fable, 짧은 정리와 작은 수정은 Opus로 나눠 써요.',
          '문제 정의와 판단은 유란이 하고, 정리와 구현은 AI가 하고, 결과 검증은 다시 유란이 해요. 그래서 <b>AI로 속도를 내면서도 결과의 질은 직접 책임지는 기획자</b>예요. 자세한 건 ' + L('ai.html', 'AI 활용 페이지') + '에 있어요.'],
      next: ['prompt', 'noai', 'site'] },
    { id: 'prompt', label: '프롬프트는 어떻게 써?', keys: ['프롬프트', 'prompt', '지시문', '명령어', 'rgc'],
      a: ['유란은 프롬프트를 짧게 쓰되 조건은 분명하게 써요. 무엇이 끝인지 목표를 한 문장으로 말하고, 근거 자료를 직접 붙이고, 하지 말 것을 먼저 밝히고, 바뀐 부분만 받고, 확인 방법까지 요청해요.',
          '"예쁘게 만들어줘" 대신 "1920×1080 한 화면에, 내용은 수정하지 말고, 스크린샷으로 보고해 줘"처럼 말하기 때문에 <b>한 번에 원하는 결과에 가깝게 도착해요.</b>'],
      next: ['token', 'noai', 'ai'] },
    { id: 'token', label: '토큰은 어떻게 아껴?', keys: ['토큰', 'token', '비용', '사용량', '아껴', '절약', '한도'],
      a: ['유란은 한 번에 하나의 화면, 하나의 변경만 요청해 작업을 작게 쪼개요. 설계와 대량 정리는 Fable, 문구와 간격 수정은 Opus로 나눠 쓰고, 전체를 다시 쓰는 대신 바뀐 부분만 받아요.',
          '화면설계서와 데이터 파일을 기준점으로 두고 대화가 길어지면 요약 후 새로 시작해요. <b>같은 비용으로 더 많은 결과를 내는 방법을 아는 사람</b>이에요.'],
      next: ['prompt', 'site', 'ai'] },
    { id: 'site', label: '이 사이트도 AI로 만들었어?', keys: ['만들었', '제작', '구현', '코딩', '개발', '퍼블리싱', 'html'],
      a: ['네, 이 사이트는 유란이 기획하고 Claude Code와 함께 만들었어요. 정보구조와 화면설계서는 직접 쓰고, 구현은 AI에 맡기고, 실제 화면을 보며 행간과 여백, 색까지 수십 번 작게 고쳤어요.',
          '마지막에는 실제 주소에서 다시 확인하고 이력서 PDF는 원본과 글자까지 대조했어요. 지금 이야기하고 있는 저도 그렇게 만들어졌어요 🍳 <b>기획한 것을 끝까지 실물로 만들어 내는 사람</b>이에요.'],
      next: ['portfolio', 'noai', 'prompt'] },
    { id: 'noai', label: 'AI에게 안 맡기는 건?', keys: ['맡기지', '안 맡', '다 맡기', '맡기는 거', '의존', '직접 하는', '사실 확인', '믿어', '신뢰', '위험', '윤리', '할루시네이션'],
      a: ['유란은 무엇이 문제인지 정하는 일, 숫자와 출처의 사실 확인, 무엇을 남기고 덜어낼지의 결정, 개인정보와 팀원의 기여 표기는 절대 AI에 넘기지 않아요.',
          'HAELON에서도 AI 이미지의 깨진 글자나 실제와 다른 드론 형태는 직접 고쳤어요. 그래서 <b>AI를 쓰면서도 결과물에 대한 책임은 늘 유란에게 있어요.</b>'],
      next: ['ai', 'record', 'feedback'] },
    { id: 'aitools', label: '쓸 줄 아는 AI 도구는?', keys: ['ai 도구', 'chatgpt', 'gpt', '지피티', 'codex', '제미나이', 'gemini', 'copilot', 'midjourney', '미드저니', 'canva'],
      a: ['유란은 Claude와 Claude Code, ChatGPT, Codex, Gemini, Copilot, Midjourney, Canva AI를 상황에 맞게 써요. 리서치 정리와 문서 구조화부터 HTML 프로토타입, 제출용 문서 제작까지 활용해요.',
          '도구 이름보다 역할과 조건을 분명히 주는 방식을 더 중요하게 생각하기 때문에, <b>어떤 새 도구가 나와도 금방 제대로 써요.</b>'],
      next: ['ai', 'prompt', 'skills'] },

    /* 이력 · 스펙 */
    { id: 'edu', label: '학교 · 전공은?', keys: ['학교', '학력', '전공', '졸업', '계원', '대학', '학년', '학점'],
      a: ['유란은 계원예술대학교 디지털미디어디자인과에 2025년에 입학해 2026년부터 기획을 세부전공하고 있고, 2027년 2월에 졸업할 예정이에요.',
          '1학년 1학기와 2학년 1학기에 성적 우수 장학금을 받았을 만큼 <b>학업에서도 꾸준히 좋은 결과를 내 왔어요.</b>'],
      next: ['awards', 'skills', 'available'] },
    { id: 'awards', label: '수상 경력은?', keys: ['수상', '어워드', '상 받', '장학', '입선', '대회', '우수작'],
      a: ['유란은 2026년 11월 HAELON으로 ESG 우수작에 선정됐고, 같은 해 7월 Arc.Dot으로 제32회 커뮤니케이션디자인 국제 어워드에 입선했어요. 성적 우수 장학금도 두 번 받았고, 2학년 1·2학기에는 부과대표 장학금을 받았어요.',
          '디자인 실기에서는 수원대 전국 대회 최우수상과 건국대, 경희대 대회 본상을 받았어요. <b>기획과 디자인 양쪽에서 실력을 인정받아 왔어요.</b>'],
      next: ['certs', 'arcdot', 'sense'] },
    { id: 'certs', label: '자격증 · 어학은?', keys: ['자격증', '어학', '중국어', 'hsk', 'itq', '토익', '영어', '외국어'],
      a: ['유란은 중국어 HSK 2급(160점)과 ITQ 정보기술자격 A등급을 갖고 있어요. 문서 작업에 필요한 오피스 도구와 Figma, Notion도 능숙하게 다뤄서 <b>실무 문서를 바로 만들 수 있어요.</b>'],
      next: ['skills', 'edu', 'awards'] },
    { id: 'skills', label: '어떤 역량 · 툴을 써?', keys: ['스킬', '역량', '도구', '툴', 'figma', '피그마', '노션', 'notion', '할 수 있', '능력', '기술', '엑셀', 'ppt'],
      a: ['유란은 설문 설계와 분석, 데스크 리서치, 사용자 니즈 분석으로 문제를 정의하고, 서비스 기획과 PM, 정보구조와 사용자 흐름, 화면설계서와 스토리보드, 콘텐츠 기획까지 직접 해요.',
          '도구는 Figma와 Notion, PowerPoint, Excel, Word를 쓰고, AI는 Claude Code를 중심으로 활용해요. <b>리서치부터 문서, 화면, 구현까지 한 사람이 이어서 해낼 수 있어요.</b>'],
      next: ['ia', 'aitools', 'research'] },
    { id: 'work', label: '아르바이트 · 경력은?', keys: ['경력', '알바', '아르바이트', '근무', '강사', '미술학원', '매장', '사회 경험', '일해 본'],
      a: ['유란은 미술학원 강사로 고3 수험생의 실기를 지도하며 학생마다 작품의 장단점을 분석해 맞춤 피드백을 줬고, 매장 스태프로는 고객 응대와 함께 주변기기 고장 원인을 찾아 직접 고치기도 했어요.',
          '학업과 병행하며 짧게는 3개월에서 길게는 1년 2개월까지 자리를 지켰고, 상대의 말 너머 진짜 요구를 읽는 연습이 지금의 사용자 리서치로 이어졌어요. <b>사회생활에서도 성실함과 대응력을 이미 증명한 사람</b>이에요.'],
      next: ['punctual', 'research', 'strength'] },
    { id: 'activities', label: '교내 활동은?', keys: ['활동', '교내', '대외', '졸업전시', '전시배치', '학과'],
      a: ['유란은 졸업전시준비위원회 전시배치팀에서 전시 공간을 설계하고 있고, 2A 기획반 부과대표를 두 학기 연속 맡고 있어요. 기획동아리 카드뉴스팀과 의왕 ESG 카드뉴스팀 팀장, 선후배 멘토링 멘토도 했어요.',
          '맡은 일마다 끝까지 책임지는 모습으로 <b>주변의 신뢰를 계속 쌓아 온 사람</b>이에요.'],
      next: ['mentor', 'lead', 'work'] },

    /* 채용 정보 */
    { id: 'available', label: '언제부터 일할 수 있어?', keys: ['입사', '언제부터', '근무 가능', '졸업 예정', '인턴', '가능 시기', '출근'],
      a: ['유란은 2027년 2월 졸업 예정이에요. 인턴이나 입사 시기, 근무 형태는 상황에 맞춰 조율할 수 있으니 ' + MAIL + ' 메일로 연락 주시면 가장 빠르고 정확하게 정할 수 있어요. <b>함께 일할 준비는 이미 되어 있어요.</b>'],
      next: ['contact', 'location', 'docs'] },
    { id: 'location', label: '어디 살아? 출퇴근은?', keys: ['거주', '사는 곳', '주소', '어디 살', '위치', '지역', '출퇴근', '통근', '멀', '거리', '화성'],
      a: ['유란은 경기도 화성시에 살고 있어요. 시간 약속과 일정을 늘 먼저 챙기는 사람이라, 출퇴근 때문에 일에 영향이 가지 않도록 스스로 준비해요.',
          '출퇴근 방식은 ' + MAIL + ' 메일로 유란과 직접 이야기 나누시면 가장 정확하게 맞출 수 있어요. <b>거리보다 일로 증명하는 사람</b>이에요.'],
      next: ['punctual', 'available', 'contact'] },
    { id: 'contact', label: '연락하고 싶어', keys: ['연락', '메일', '이메일', '전화', '번호', '면접', '채용', '컨택'],
      a: ['언제든 환영이에요! 메일은 ' + MAIL + ', 전화는 ' + L('tel:+821034526632', '010.3452.6632') + '예요. <b>연락 주시면 유란이 빠르게 답할 거예요.</b>'],
      next: ['docs', 'available', 'who'] },
    { id: 'docs', label: '이력서 · 자소서 받을래', keys: ['이력서', '자기소개서', '자소서', '레쥬메', 'resume', 'cv', 'pdf', '다운'],
      a: ['' + L('resume.pdf?v=9', '이력서 PDF') + '와 ' + L('cover-letter.pdf?v=4', '자기소개서 PDF') + '를 바로 받으실 수 있어요. 프로젝트별 기획서와 보고서, 화면설계서 원본도 ' + L('works.html', '프로젝트 페이지') + '에 모두 있으니 <b>필요한 자료는 여기서 다 확인하실 수 있어요.</b>'],
      next: ['contact', 'projects'] },
    { id: 'salary', label: '희망 연봉 · 조건은?', keys: ['연봉', '급여', '월급', '페이', '조건', '처우', '복지'],
      a: ['연봉과 조건은 유란이 직접 이야기 나누는 게 가장 정확해요. ' + MAIL + ' 메일이나 ' + L('tel:+821034526632', '010.3452.6632') + '로 연락 주시면 <b>성실하게 맞춰 갈 거예요.</b>'],
      next: ['contact', 'available'] }
  ];
  var byId = {}; KB.forEach(function (k) { byId[k.id] = k; });
  byId.menu = { id: 'menu', label: '질문 목록 보기' };
  var START = ['who', 'why', 'projects', 'way', 'ai', 'menu'];

  /* ---------- 회사 · 업종 적합도 ---------- */
  var DOMAINS = [
    { keys: ['패션', '의류', '옷', '어패럴', '브랜드', '피트니스복', '애슬레저', '스포츠웨어', '운동복', '뷰티', '화장품', '쇼핑', '쇼핑몰', '커머스', '이커머스', '리테일', '온라인몰'],
      text: '브랜드와 커머스 쪽이라면 특히 잘 맞아요. 쿠팡 로켓프레시 리뉴얼에서 20대 모바일 사용자 50명을 조사해 상품 카테고리와 장보기 흐름을 목적 중심으로 다시 짰고, 이 포트폴리오도 브랜드 규칙을 직접 세워 톤과 메시지를 끝까지 하나로 맞췄어요.' },
    { keys: ['피트니스', '운동', '헬스', '스포츠', '요가', '필라테스', '러닝', '웰니스', '건강'],
      text: '운동과 스포츠 분야도 이미 다뤄 봤어요. Arc.Dot에서 선수들의 훈련 기록과 코칭 데이터를 잇는 서비스를 기획해 국제 어워드에 입선했기 때문에, 운동하는 사람의 기록과 동기를 이해하는 시선이 있어요.' },
    { keys: ['여성', '2030', '20대', '젊은', 'mz', '고객층'],
      text: '주 고객이 20~30대라면 그 시선을 잘 알아요. 쿠팡과 위버스 프로젝트 모두 20대 사용자를 직접 조사하고 테스트해서 그들이 어디서 불편해하고 무엇을 기대하는지 확인했어요.' },
    { keys: ['콘텐츠', '마케팅', 'sns', '인스타', '카드뉴스', '홍보', '캠페인'],
      text: '콘텐츠와 마케팅도 해 봤어요. 기획동아리 카드뉴스팀 팀장으로 학과 홍보 콘텐츠를 정기적으로 기획 · 제작했고, ESG 캠페인 카드뉴스팀도 결과발표회까지 이끌었어요.' },
    { keys: ['팝업', '오프라인', '매장', '전시', '공간', '행사', '쇼룸', '이벤트'],
      text: '오프라인 공간과 행사 경험도 있어요. 크리에이티브X성수에서 성수동 행사장을 7시간 걸으며 관람 동선을 관찰했고, 이음선에서는 공간 전체를 하나의 경험으로 이어지게 설계했어요.' },
    { keys: ['앱', '플랫폼', 'it', '서비스', '스타트업', '테크', '소프트웨어', '웹'],
      text: '앱과 플랫폼 서비스는 유란의 주 무대예요. 위버스에서 사용성 평가로 성공률을 55%에서 92%로 높였고, HAELON과 블루독에서는 서비스 전체 구조와 화면설계서를 직접 만들었어요.' },
    { keys: ['공공', '안전', '보안', '항공', '공항', '교통', '모빌리티'],
      text: '안전과 공공 서비스도 깊게 다뤄 봤어요. HAELON에서 공항 관제 흐름 전체를 설계해 ESG 우수작으로 선정됐어요.' },
    { keys: ['엔터', '팬', '음악', '아이돌', '미디어', '영상'],
      text: '엔터와 미디어 서비스도 잘 알아요. 위버스 미디어 탐색을 사용성 평가로 개선해 성공률을 55%에서 92%로 끌어올렸어요.' }
  ];
  var FIT_KEYS = ['우리 회사', '저희 회사', '우리 팀', '저희 팀', '회사가', '회사인데', '회사에서', '잘 할 수', '잘할 수', '잘 맞', '어울릴', '적합', '맞을까', '할 수 있을까', '괜찮을까', '신입으로', '입사하면', '채용하면', '뽑으면', '함께하면'];

  function norm(s) { return s.toLowerCase().replace(/[?!.,~·'"‘’“”]/g, ' ').replace(/\s+/g, ' ').trim(); }
  function has(t, list) { return list.some(function (w) { return t.indexOf(w.replace(/\s/g, '')) > -1; }); }
  function scores(q) {
    var s = norm(q), t = s.replace(/\s/g, '');
    return KB.map(function (k) {
      var sc = 0;
      k.keys.forEach(function (w) { var wn = w.replace(/\s/g, ''); if (s.indexOf(w) > -1 || (wn.length > 1 && t.indexOf(wn) > -1)) sc += wn.length >= 3 ? 3 : wn.length === 2 ? 2 : 1; });
      return { k: k, sc: sc * (k.w || 1) };
    }).sort(function (a, b) { return b.sc - a.sc; });
  }
  function match(q) { var r = scores(q)[0]; return r && r.sc >= 1.5 ? r.k : null; }

  /* 회사 적합도 질문은 업종에 맞춰 문장으로 조립 */
  function fitAnswer(q) {
    var t = norm(q).replace(/\s/g, '');
    var hits = DOMAINS.filter(function (d) { return has(t, d.keys); });
    var parts = ['네, <b>김유란은 충분히 잘 해낼 거예요.</b>'];
    if (hits.length) parts.push(hits.slice(0, 3).map(function (d) { return d.text; }).join(' '));
    else parts.push('유란은 어떤 분야든 리서치로 먼저 사용자를 이해하고, 진짜 문제를 다시 정의한 뒤 화면설계서와 프로토타입까지 직접 완성해 온 기획자예요.');
    parts.push('무엇보다 팀 프로젝트 7개 모두에서 팀장과 발표를 맡아 마감까지 책임졌고, 아르바이트도 길게는 1년 2개월씩 꾸준히 이어 온 만큼 시간 약속과 책임감이 확실해요. 디자인 실기 수상 경력에서 보이듯 감각도 좋아서, 기획의 논리와 화면의 센스를 함께 갖췄어요.');
    if (has(t, ['성수'])) parts.push('성수동이라면 더 반가워요. 크리에이티브X성수 제안서를 쓰면서 성수동 현장을 7시간 넘게 직접 걸으며 브랜드 공간과 사람들의 흐름을 관찰했기 때문에, 동네와 고객의 분위기가 이미 낯설지 않아요.');
    if (has(t, ['위치', '거리', '멀', '출퇴근', '통근', '집에서', '어디 살', '거주'])) parts.push('출퇴근이 걱정되실 수 있지만, 유란은 경기도 화성시에 살면서도 일정과 약속을 늘 먼저 챙겨 온 사람이에요. 출퇴근 방식은 ' + MAIL + ' 메일로 직접 이야기 나누시면 가장 정확하게 맞출 수 있어요.');
    parts.push('결론적으로, <b>유란은 신입이어도 빠르게 적응해 믿고 맡길 수 있는 기획자</b>예요. 함께하신다면 분명 좋은 선택이 될 거예요.');
    return parts;
  }
  function isFit(q) {
    var t = norm(q).replace(/\s/g, '');
    return has(t, FIT_KEYS) || (has(t, ['회사', '브랜드', '업계', '분야']) && has(t, ['잘', '맞', '할수있', '어울', '괜찮']));
  }
  /* 두 가지를 함께 물으면 두 답을 이어서 */
  function multi(q) {
    var r = scores(q).filter(function (x) { return x.sc >= 2; });
    if (r.length >= 2 && ((r[0].k.next || []).indexOf(r[1].k.id) > -1 || (r[1].k.next || []).indexOf(r[0].k.id) > -1)) return null;
    if (r.length >= 2 && r[1].sc >= 2 && r[0].k.id !== r[1].k.id && r[1].sc >= r[0].sc * 0.6) return [r[0].k, r[1].k];
    return null;
  }

  /* ---------- 화면 ---------- */
  var yolk = '<span class="yb-yolk" aria-hidden="true"><i class="yb-eye"></i><i class="yb-eye"></i></span>';
  var root = document.createElement('div');
  root.className = 'yb';
  root.innerHTML =
    '<button type="button" class="yb-launch" aria-label="노른자 봇 열기 — 김유란에 대해 물어보기" aria-expanded="false" aria-controls="yb-panel">' +
      '<span class="yb-egg">' + yolk + '</span><span class="yb-tip">김유란이 궁금하다면?</span></button>' +
    '<section class="yb-panel" id="yb-panel" role="dialog" aria-label="노른자 봇" hidden>' +
      '<div class="yb-rz yb-rz--l" data-rz="l" aria-hidden="true"></div><div class="yb-rz yb-rz--t" data-rz="t" aria-hidden="true"></div><div class="yb-rz yb-rz--tl" data-rz="tl" aria-hidden="true"></div>' +
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

  /* 채팅 창 크기 조절 — 창의 왼쪽 · 위쪽 테두리와 왼쪽 위 모서리에 마우스를 올리면 조절 커서가 뜨고, 끌어서 가로 · 세로를 자유롭게 조절.
     테두리를 두 번 누르면 기본 크기. 크기는 이 브라우저에만 기억 */
  (function () {
    var KEY = 'yolkbot-size';
    function apply(w, ht) { if (w) panel.style.width = w + 'px'; if (ht) panel.style.height = ht + 'px'; if (pinned) scroll(); }
    try { var sv = JSON.parse(localStorage.getItem(KEY) || 'null'); if (sv && innerWidth > 600) apply(sv[0], sv[1]); } catch (e) {}
    panel.querySelectorAll('.yb-rz').forEach(function (h) {
      var mode = h.getAttribute('data-rz');
      h.addEventListener('pointerdown', function (e) {
        if (innerWidth <= 600 || e.button !== 0) return;
        e.preventDefault(); h.setPointerCapture(e.pointerId); panel.classList.add('is-resizing');
        var r = panel.getBoundingClientRect(), sx = e.clientX, sy = e.clientY, keep = pinned; rzing = true;
        function mv(ev) {
          var w = mode !== 't' ? Math.max(320, Math.min(r.width + (sx - ev.clientX), r.right - 16)) : 0;
          var ht = mode !== 'l' ? Math.max(480, Math.min(r.height + (sy - ev.clientY), r.bottom - 16)) : 0;
          apply(w, ht); if (keep) scroll();
        }
        function up() { rzing = false; if (keep) { pinned = true; scroll(); } h.removeEventListener('pointermove', mv); h.removeEventListener('pointerup', up); h.removeEventListener('pointercancel', up); panel.classList.remove('is-resizing');
          try { localStorage.setItem(KEY, JSON.stringify([panel.offsetWidth, panel.offsetHeight])); } catch (err) {} }
        h.addEventListener('pointermove', mv); h.addEventListener('pointerup', up); h.addEventListener('pointercancel', up);
      });
      h.addEventListener('dblclick', function () { panel.style.width = ''; panel.style.height = ''; pinned = true; requestAnimationFrame(scroll); try { localStorage.removeItem(KEY); } catch (e) {} });
    });
  })();

  function scroll() { log.scrollTop = log.scrollHeight; }
  /* 아래 추천 질문 · 창 크기가 바뀌어도 마지막 답변이 가려지지 않도록 바닥에 붙여 둠 */
  var pinned = true;
  var rzing = false;
  log.addEventListener('scroll', function () { if (!rzing) pinned = log.scrollHeight - log.scrollTop - log.clientHeight < 40; });
  if (window.ResizeObserver) new ResizeObserver(function () { if (pinned) scroll(); }).observe(log);
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
    pinned = true; scroll(); requestAnimationFrame(scroll);
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
    if (!k && isFit(text)) { addBot(fitAnswer(text), function () { showChips(['why', 'punctual', 'sense', 'contact', 'menu']); }); return; }
    if (!k) { var m = multi(text); if (m) { addBot(m[0].a.concat(m[1].a), function () { showChips((m[0].next || []).slice(0, 2).concat((m[1].next || []).slice(0, 1), ['menu'])); }); return; } }
    k = k || match(text);
    if (k) answer(k);
    else addBot(['좋은 질문이에요! 그 부분은 유란이 직접 답할 때 가장 정확하니, ' + MAIL + ' 메일로 물어봐 주시면 빠르게 답해 드릴 거예요.', '그 전에 하나만 말씀드리면, 유란은 문제의 핵심을 정확히 짚고 팀을 끝까지 이끌며 약속과 마감을 지키는 기획자예요. 아래에서 궁금한 주제를 골라 주시면 제가 바로 답해 드릴게요 🍳'], function () { showChips(['menu', 'who', 'why', 'contact']); });
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
  window.__yolkbotMatch = match; window.__yolkbotFit = function (q) { return isFit(q) ? fitAnswer(q) : null; }; window.__yolkbotMulti = multi;
})();
