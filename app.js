// --- 네비게이션 활성 표시 (파일/폴더 접근 모두 대응)
(function () {
  try {
    var url = new URL(location.href);
    var path = url.pathname;
    if (!path || path === "/" || path.endsWith("/")) path = (path || "/") + "index.html";

    var candidates = [path];
    if (!path.endsWith(".html")) candidates.push(path + ".html");
    var last = path.split("/").pop(); if (last) candidates.push(last);

    document.querySelectorAll("nav.main a").forEach(function (a) {
      var ahref = new URL(a.getAttribute("href"), location.href).pathname;
      var ahLast = ahref.split("/").pop();
      if (candidates.includes(ahref) || candidates.includes(ahLast)) a.classList.add("active");
    });
  } catch(e) { /* noop */ }
})();

// --- 외부 링크 rel 보강
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('a[target="_blank"]').forEach(function(a){
    var rel = (a.getAttribute('rel')||'').split(' ').filter(Boolean);
    if (rel.indexOf('noopener') === -1) rel.push('noopener');
    if (rel.indexOf('noreferrer') === -1) rel.push('noreferrer');
    a.setAttribute('rel', rel.join(' '));
  });
});

// --- 이미지 성능 최적화: lazy + async (로고/히어로 제외)
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('img:not(.no-lazy)').forEach(function(img){
    // 로고/히어로는 .no-lazy 클래스로 제외하세요.
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
  });
});


// --- 클릭 이벤트 로깅(GA4)
document.addEventListener('click', function(e){
  var a = e.target.closest('a'); if (!a) return;

  // Kakao
  if (a.href && a.href.indexOf('pf.kakao.com/_Txgsen') !== -1) {
    if (window.gtag) gtag('event', 'kakao_consult_click', { method: 'kakao_channel' });
  }
  // tel:
  if (a.protocol === 'tel:') {
    if (window.gtag) gtag('event', 'phone_call_click', { method: 'tel_link' });
  }
  // mailto:
  if (a.protocol === 'mailto:') {
    if (window.gtag) gtag('event', 'email_click', { method: 'mailto_link' });
  }
}, false);

// --- 연혁 사진 슬라이드 ---
(function(){
  const track = document.querySelector('.history-slider .hs-track');
  if(!track) return;
  const imgs = [...track.querySelectorAll('.hs-item')];
  let idx = 0;
  const show = i => {
    imgs.forEach((el,j)=> el.classList.toggle('active', j===i));
  };
  show(idx);
  document.querySelector('.history-slider .prev').addEventListener('click', ()=>{
    idx = (idx - 1 + imgs.length) % imgs.length; show(idx);
  });
  document.querySelector('.history-slider .next').addEventListener('click', ()=>{
    idx = (idx + 1) % imgs.length; show(idx);
  });
})();

// --- 라이트박스 ---
(function(){
  const box = document.getElementById('lightbox');
  if(!box) return;
  const img = document.getElementById('lb-img');
  const cap = document.getElementById('lb-cap');
  const open = (src, alt) => {
    img.src = src; img.alt = alt || '';
    cap.textContent = alt || '';
    box.classList.add('open');
    box.setAttribute('aria-hidden','false');
  };
  const close = () => {
    box.classList.remove('open');
    box.setAttribute('aria-hidden','true');
    img.src = '';
  };
  document.querySelectorAll('.gallery .g-item').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const i = a.querySelector('img');
      open(a.getAttribute('href'), i?.getAttribute('alt') || '');
    });
  });
  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-backdrop').addEventListener('click', close);
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') close(); });
})();
