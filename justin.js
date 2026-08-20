/* ===========================================================
   저스틴 (Justin) — 한국정책연구소 고객응대 도우미
   - 서버 없이 페이지 안에서 동작 (비용 0)
   - 모르는 것은 지어내지 않고 전화·메일로 연결
   - JUSTIN_API 를 채우면 그대로 LLM 백엔드 호출로 전환됨
   =========================================================== */
(function () {
  'use strict';

  var TEL = '010-3745-0126';
  var MAIL = 'coqss@naver.com';
  var JUSTIN_API = ''; // 예: 'https://koips-justin.onrender.com/chat'  ← 채우면 진짜 AI 모드

  /* ---------- 지식베이스 ---------- */
  var KB = [
    {
      k: ['행정사', '인허가', '허가', '인가', '면허', '신고', '등록', '서류', '대행', '민원', '행정절차', '법인설립', '법인 설립'],
      t: '행정사 업무',
      a: '당사 고문 <b>윤성수</b>는 <b>행정안전부 등록 행정사</b>입니다. 행정사법 제2조가 정한 법정 업무를 수행합니다.<br><br>' +
         '· 행정기관 제출 서류 작성<br>· 권리·의무·사실증명 서류 작성<br>· 서류 번역<br>· 서류 제출 대행<br>' +
         '· <b>인가·허가·면허 신청·신고의 대리</b><br>· 행정 법령·행정에 대한 상담·자문<br>· 위탁 사무의 사실 조사·확인<br><br>' +
         '법인 설립, 의료법인 설립, 외환거래 신고 등 실제 수행 실적이 있습니다.<br>' +
         '<span class="js-note">※ 소송 대리 등 변호사법상 변호사 직무에 속하는 업무는 취급하지 않습니다.</span>',
      c: ['어떤 인허가를 맡길 수 있나요?', '비용은 어떻게 되나요?']
    },
    {
      k: ['어떤 인허가', '인허가 종류', '무슨 서류', '어떤 서류'],
      t: '맡기실 수 있는 행정업무',
      a: '실제로 자주 다루는 유형입니다.<br><br>· 법인 설립 · 의료법인 설립<br>· 영업 인허가 · 등록 · 신고<br>· 외환거래 · 지분취득 관련 신고<br>' +
         '· 각종 행정기관 제출 서류의 작성과 제출 대행<br>· 행정 법령 해석에 관한 상담<br><br>' +
         '사안을 말씀해 주시면 <b>가능 여부부터 먼저</b> 알려드립니다. 안 되는 건 안 된다고 말씀드립니다.',
      c: ['문의 남기기', '전화번호 알려주세요']
    },
    {
      k: ['사업분야', '무슨 일', '어떤 일', '뭐 하는', '무엇을', '서비스', '업무 범위', '하는 일'],
      t: '사업분야',
      a: '한국정책연구소는 10개 분야를 수행합니다.<br><br>' +
         '① 정책연구·실태조사 ② 먹거리·상권 정책 ③ <b>행정사 업무</b> ④ 박람회 기획운영 ⑤ 경영·행정 컨설팅<br>' +
         '⑥ 미디어·콘텐츠 ⑦ 교육·안전 ⑧ 면접컨설팅·평가위원 풀 ⑨ 정치·선거 컨설팅 ⑩ 한중 국제협력<br><br>' +
         '어느 분야가 궁금하신가요?',
      c: ['정책연구 실적이 궁금해요', '행정사 업무', '수의계약 가능한가요?']
    },
    {
      k: ['실적', '수행', '경험', '레퍼런스', '해본', '해 본', '포트폴리오'],
      t: '수행 실적',
      a: '문서로 확인되는 실적만 게재합니다. <b>수행 건과 제안 건을 구분</b>해 표기합니다.<br><br>' +
         '· <b>농림축산식품부·aT 발주</b> 전국 지자체 급식지원센터 운영현황 조사 (2024)<br>' +
         '· 경기도의회 공공기관 조직·기능 혁신 방안 연구 (2025)<br>· 법무법인 한별 외환거래·주식취득 행정컨설팅 (2024)<br>' +
         '· 메디피움 의료법인 설립 컨설팅 (2024)<br>· 용인시 공공기관 경영혁신 과제 (2026)<br><br>' +
         '계약서·결과보고서 등 <b>증빙은 요청 시 즉시 제출</b>합니다.',
      c: ['증빙을 받을 수 있나요?', '문의 남기기']
    },
    {
      k: ['증빙', '계약서', '결과보고서', '자료 제출', '확인서'],
      t: '증빙 제출',
      a: '가능합니다. 홈페이지 실적은 계약서·결과보고서·제안서로 확인되는 건이며, 발주기관이 요청하시면 <b>즉시 제출</b>합니다.<br>' +
         '사업자등록증, 조달청 경쟁입찰참가자격 등록 확인, 경력·자격 증빙도 함께 보내드립니다.',
      c: ['문의 남기기']
    },
    {
      k: ['수의계약', '입찰', '경쟁입찰', '계약 방법', '조달', '나라장터'],
      t: '계약 방식',
      a: '<b>수의계약 · 경쟁입찰 · 단기 자문</b> 모두 가능합니다.<br>' +
         '<b>조달청 경쟁입찰참가자격 등록</b>을 완료했고, 사업자등록번호는 150-15-02253입니다.<br><br>' +
         '과업지시서를 보내주시면 <b>영업일 기준 24시간 이내</b>에 수행 가능 여부와 예상 일정을 회신드립니다.',
      c: ['과업지시서를 보내려면?', '문의 남기기']
    },
    {
      k: ['연락', '전화', '번호', '메일', '이메일', '연락처', '문의처', '과업지시서를 보내려면'],
      t: '연락처',
      a: '편하신 쪽으로 연락 주십시오.<br><br>· 전화 <b>' + TEL + '</b> (2대 대표 윤현수, 평일 09–19시)<br>· 메일 <b>' + MAIL + '</b><br><br>' +
         '과업지시서나 제안요청서는 메일로 첨부해 주시면 가장 빠릅니다.',
      c: ['문의 남기기']
    },
    {
      k: ['대표', '누구', '윤현수', '윤성수', '사람', '인력', '조직', '연구원', '박주현'],
      t: '인력 구성',
      a: '· <b>2대 대표 윤현수</b> — 국제협력·경영 총괄. 광저우 한인무역협회 회장<br>' +
         '· <b>고문 윤성수</b>(1대 대표·설립자) — 정책연구·공공행정 총괄. <b>행정안전부 등록 행정사</b>. 화성시청·화성시푸드통합지원센터·경기도청·경기도시장상권진흥원·화성시산업진흥원 근무<br>' +
         '· <b>박주현</b> — 영상 총괄 디렉터<br><br>과업 규모에 따라 법률·회계·통계·도시계획 전문가를 연구원으로 위촉합니다.',
      c: ['화성시·경기도 경력이 궁금해요']
    },
    {
      k: ['화성', '경기도', '경력', '공무원', '현장', '급식', '로컬푸드', '전통시장', '소상공인', '상권'],
      t: '화성시 · 경기도 현장 실무',
      a: '고문 윤성수가 공공 현장에서 직접 기획·집행한 업무입니다.<br><br>' +
         '· 2006~2007 화성시청 농정과 — 급식체계·로컬푸드 기획<br>' +
         '· 2007~2014 화성시푸드통합지원센터 — 급식·로컬푸드 총괄, <b>9개 시·군 급식 공급</b><br>' +
         '· 2018~2022 경기도청·경기도시장상권진흥원 — <b>31개 시·군 전통시장·소상공인 지원사업</b>, 지역화폐, 기본소득박람회<br>' +
         '· 2025.12~2026.04 화성시산업진흥원 산업전략본부장<br>· 현재 화성특례시 미래위원회 위원',
      c: ['이 경험이 왜 중요한가요?', '문의 남기기']
    },
    {
      k: ['왜 중요', '차별점', '강점', '다른 곳과', '경쟁력'],
      t: '차별점',
      a: '과업지시서를 <b>써 본 쪽</b>에 있던 사람이 제안서를 씁니다.<br><br>' +
         '· 발주 부서가 무엇을 왜 요구하는지에서 출발합니다<br>· 예산 편성 시기와 결재 흐름을 알아 <b>집행 불가능한 과제를 제안하지 않습니다</b><br>' +
         '· 급식·시장·소상공인 현장을 오래 다녀 통계에 안 잡히는 작동 방식을 압니다',
      c: ['문의 남기기']
    },
    {
      k: ['박람회', '행사', '축제', '전시', '부스'],
      t: '박람회 · 행사',
      a: '타당성 조사부터 기본계획·운영매뉴얼, 참가기업 모집·부스 운영·바이어 매칭, 관람객 조사와 경제적 파급효과 분석까지 수행합니다.<br>' +
         '고문이 경기도청 재직 시 <b>대한민국 기본소득박람회·경기도 우수시장 박람회</b>를 직접 추진했습니다.',
      c: ['문의 남기기']
    },
    {
      k: ['영상', '홍보', '유튜브', '미디어', '콘텐츠', '촬영'],
      t: '미디어 · 콘텐츠',
      a: '미디어콘텐츠창작업 등록과 전속 영상 디렉터를 기반으로 정책 홍보영상·전시영상·성과 기록물을 직접 제작합니다.<br>' +
         '문화재청 특별전, 여성가족부 캠페인, 화성시 기업 홍보영상 제작 경력이 있습니다.',
      c: ['문의 남기기']
    },
    {
      k: ['평가위원', '심의위원', '면접', '위원 추천', '면접컨설팅'],
      t: '평가위원 · 면접',
      a: '면접·평가·심의위원 풀 구성과 추천, 채용·평가 절차 설계와 공정성 자문, 공무원·공공기관 면접 컨설팅을 수행합니다.<br>' +
         '고문은 중소벤처기업부 심의평가위원으로 참여한 경력이 있습니다.',
      c: ['문의 남기기']
    },
    {
      k: ['중국', '한중', '수출', '투자', '통상', '광저우', '무역'],
      t: '한중 국제협력',
      a: '2대 대표 윤현수가 <b>광저우 한인무역협회 회장</b>, 중국 허난성 중원은행·초상은행 투자유치 고문, 심양시 한국 투자유치 고문으로 현직 활동 중입니다.<br>' +
         '한·중 지방정부·기업 교류 중개, 현지 네트워크 지원, 투자유치·통상 자문을 제공합니다.',
      c: ['문의 남기기']
    },
    {
      k: ['비용', '가격', '견적', '수수료', '얼마'],
      t: '비용',
      a: '과업 범위·기간·투입 인력에 따라 산정하므로 <b>사전에 정해진 단가는 없습니다</b>.<br>' +
         '사안을 알려주시면 예상 범위를 정직하게 말씀드리고, 예산에 맞지 않으면 그렇다고 말씀드립니다. <b>상담에는 비용이 들지 않습니다.</b>',
      c: ['문의 남기기', '전화번호 알려주세요']
    },
    {
      k: ['위치', '주소', '어디', '사무실', '오시는'],
      t: '위치',
      a: '경기도 화성시 동탄에 있습니다. <b>수도권·충청권 전역 현장 대응</b>이 가능하며, 필요하시면 기관으로 직접 찾아뵙습니다.',
      c: ['문의 남기기']
    },
    {
      k: ['안녕', '반가', '하이', '헬로', '누구세요', '뭐야'],
      t: '인사',
      a: '반갑습니다. 한국정책연구소 상담 도우미 <b>저스틴</b>입니다.<br>사업분야, 실적, 행정사 업무, 계약 방식 무엇이든 물어보십시오.',
      c: ['사업분야가 뭔가요?', '행정사 업무', '수의계약 가능한가요?']
    }
  ];

  var CHIPS0 = ['사업분야가 뭔가요?', '행정사 업무', '수행 실적이 궁금해요', '수의계약 가능한가요?', '문의 남기기'];

  /* ---------- 매칭 ---------- */
  function score(q, item) {
    var s = 0, i, k;
    for (i = 0; i < item.k.length; i++) {
      k = item.k[i];
      if (q.indexOf(k) !== -1) s += k.length >= 3 ? 3 : 2;
    }
    return s;
  }
  function answer(q) {
    var norm = (q || '').replace(/\s+/g, ' ').trim(), best = null, bs = 0, i, s;
    for (i = 0; i < KB.length; i++) {
      s = score(norm, KB[i]);
      if (s > bs) { bs = s; best = KB[i]; }
    }
    if (best && bs >= 2) return { a: best.a, c: best.c || [] };
    return null;
  }

  /* ---------- DOM ---------- */
  var root = document.createElement('div');
  root.className = 'jstn';
  root.innerHTML =
    '<button class="jstn-fab" type="button" aria-expanded="false" aria-controls="jstn-panel">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-3.2-6.4"/><path d="M8.5 11h7M8.5 14.5h4.5"/></svg>' +
      '<span>저스틴에게 물어보기</span></button>' +
    '<section class="jstn-panel" id="jstn-panel" role="dialog" aria-label="한국정책연구소 상담 도우미 저스틴" hidden>' +
      '<header class="jstn-head"><div><b>저스틴</b><span>한국정책연구소 상담 도우미</span></div>' +
        '<button class="jstn-x" type="button" aria-label="닫기">&times;</button></header>' +
      '<div class="jstn-log" role="log" aria-live="polite"></div>' +
      '<div class="jstn-chips"></div>' +
      '<form class="jstn-form"><input class="jstn-in" type="text" autocomplete="off" placeholder="궁금한 점을 입력해 주십시오">' +
        '<button class="jstn-send" type="submit" aria-label="보내기">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12 20 4l-3.5 16-4.5-6-7.999-2Z"/></svg></button></form>' +
      '<p class="jstn-foot">답을 모르면 지어내지 않고 담당자에게 연결해 드립니다 · <a href="tel:' + TEL + '">' + TEL + '</a></p>' +
    '</section>';
  document.body.appendChild(root);

  var fab = root.querySelector('.jstn-fab'),
      panel = root.querySelector('.jstn-panel'),
      log = root.querySelector('.jstn-log'),
      chips = root.querySelector('.jstn-chips'),
      form = root.querySelector('.jstn-form'),
      input = root.querySelector('.jstn-in');

  function push(who, html) {
    var d = document.createElement('div');
    d.className = 'jstn-msg ' + who;
    d.innerHTML = who === 'bot' ? '<span class="jstn-av">J</span><div class="jstn-bub">' + html + '</div>'
                                : '<div class="jstn-bub">' + html + '</div>';
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  }
  function setChips(list) {
    chips.innerHTML = '';
    (list || []).forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'jstn-chip'; b.textContent = c;
      b.onclick = function () { send(c); };
      chips.appendChild(b);
    });
  }
  function esc(s) { return (s || '').replace(/[<>&]/g, function (m) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[m]; }); }

  /* ---------- 문의 남기기 (3단계) ---------- */
  var lead = null;
  function leadStart() {
    lead = { step: 1, org: '', task: '', contact: '' };
    push('bot', '문의를 정리해서 담당자에게 바로 전달되도록 도와드리겠습니다.<br><b>1/3 · 기관명(또는 회사명)</b>을 알려주십시오.');
    setChips([]);
  }
  function leadNext(text) {
    if (lead.step === 1) {
      lead.org = text; lead.step = 2;
      push('bot', '<b>2/3 · 어떤 과업인지</b> 한두 줄로 적어주십시오. (예: 전통시장 활성화 계획 수립, 법인 설립 인허가 대행)');
    } else if (lead.step === 2) {
      lead.task = text; lead.step = 3;
      push('bot', '<b>3/3 · 회신받으실 연락처</b>(전화 또는 이메일)를 알려주십시오.');
    } else {
      lead.contact = text;
      var subj = '[과업 검토 요청] ' + lead.org,
          body = '기관명: ' + lead.org + '\n과업 개요: ' + lead.task + '\n담당자 연락처: ' + lead.contact +
                 '\n\n(홈페이지 상담 도우미 저스틴을 통해 접수)';
      var href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
      push('bot', '정리했습니다. 아래 버튼을 누르면 <b>메일 작성 화면이 열립니다</b>. 보내주시면 영업일 24시간 이내에 회신드립니다.<br><br>' +
        '<a class="jstn-btn" href="' + href + '">메일 보내기</a> <a class="jstn-btn ghost" href="tel:' + TEL + '">전화 걸기</a>' +
        '<br><span class="jstn-note">기관명 ' + esc(lead.org) + ' · ' + esc(lead.task) + ' · ' + esc(lead.contact) + '</span>');
      lead = null;
      setChips(CHIPS0);
    }
  }

  /* ---------- 전송 ---------- */
  function fallback() {
    push('bot', '<b>제가 확실히 아는 내용이 아닙니다.</b> 잘못 안내드리면 안 되니 담당자에게 바로 연결해 드리겠습니다.<br><br>' +
      '<a class="jstn-btn" href="tel:' + TEL + '">전화 ' + TEL + '</a> <a class="jstn-btn ghost" href="mailto:' + MAIL + '">메일 보내기</a>');
    setChips(['문의 남기기', '사업분야가 뭔가요?', '수행 실적이 궁금해요']);
  }
  function reply(text) {
    if (JUSTIN_API) {
      fetch(JUSTIN_API, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      }).then(function (r) { return r.json(); })
        .then(function (d) { d && d.reply ? push('bot', d.reply) : fallback(); })
        .catch(fallback);
      return;
    }
    var r = answer(text);
    if (r) { push('bot', r.a); setChips(r.c.length ? r.c : CHIPS0); }
    else fallback();
  }
  function send(text) {
    text = (text || '').trim();
    if (!text) return;
    push('me', esc(text));
    input.value = '';
    if (text === '문의 남기기' && !lead) { setTimeout(leadStart, 220); return; }
    if (lead) { setTimeout(function () { leadNext(text); }, 220); return; }
    setTimeout(function () { reply(text); }, 260);
  }

  /* ---------- 열고 닫기 ---------- */
  var opened = false;
  function open() {
    panel.hidden = false;
    root.classList.add('on');
    fab.setAttribute('aria-expanded', 'true');
    if (!opened) {
      opened = true;
      push('bot', '안녕하십니까. 한국정책연구소 상담 도우미 <b>저스틴</b>입니다.<br>사업분야 · 수행 실적 · <b>행정사 업무</b> · 계약 방식 무엇이든 물어보십시오.');
      setChips(CHIPS0);
    }
    setTimeout(function () { input.focus(); }, 80);
  }
  function close() {
    root.classList.remove('on');
    fab.setAttribute('aria-expanded', 'false');
    setTimeout(function () { if (!root.classList.contains('on')) panel.hidden = true; }, 200);
  }
  fab.onclick = function () { root.classList.contains('on') ? close() : open(); };
  root.querySelector('.jstn-x').onclick = close;
  form.onsubmit = function (e) { e.preventDefault(); send(input.value); };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('on')) close(); });
})();
