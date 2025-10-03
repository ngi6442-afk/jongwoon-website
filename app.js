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
