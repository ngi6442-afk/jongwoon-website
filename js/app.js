document.addEventListener('DOMContentLoaded', function() {

    // --- 수정: Hero 슬라이더 '무한 루프' 기능 개선 ---
    // --- 신규 추가: 모바일 햄버거 메뉴 스크립트 ---
    (function(){
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const mobileNav = document.getElementById('mobileNav');

        if (hamburgerBtn && mobileNav) {
            hamburgerBtn.addEventListener('click', () => {
                const isOpen = mobileNav.classList.toggle('is-open');
                hamburgerBtn.setAttribute('aria-expanded', isOpen);
            });
        }
    })();
    (function(){
        const slider = document.getElementById('hero-slider');
        if (!slider) return;

        const track = slider.querySelector('.hs-track');
        const items = Array.from(track.children);
        const nextButton = slider.querySelector('.next');
        const prevButton = slider.querySelector('.prev');
        
        const firstClone = items[0].cloneNode(true);
        const lastClone = items[items.length - 1].cloneNode(true);
        track.appendChild(firstClone);
        track.insertBefore(lastClone, items[0]);

        const newItems = Array.from(track.children);
        let currentIndex = 1;
        let isMoving = false;

        const setPosition = (index) => {
            track.style.transform = `translateX(-${index * 100}%)`;
        };
        
        track.style.transition = 'none';
        setPosition(currentIndex);

        const moveToSlide = (direction) => {
            if (isMoving) return;
            isMoving = true;
            currentIndex += direction;
            track.style.transition = 'transform 0.5s ease-in-out';
            setPosition(currentIndex);
        };
        
        track.addEventListener('transitionend', () => {
            isMoving = false;
            if (currentIndex === 0) {
                currentIndex = newItems.length - 2;
                track.style.transition = 'none';
                setPosition(currentIndex);
            }
            if (currentIndex === newItems.length - 1) {
                currentIndex = 1;
                track.style.transition = 'none';
                setPosition(currentIndex);
            }
        });

        nextButton.addEventListener('click', () => moveToSlide(1));
        prevButton.addEventListener('click', () => moveToSlide(-1));

        setInterval(() => {
            moveToSlide(1);
        }, 5000);
    })();


    // --- Submenu 역 hover 효과 ---
    const topbar = document.querySelector('.topbar');
    if (topbar) {
        const mainNavItems = topbar.querySelectorAll('.main-nav > ul > li');
        const submenuWrappers = topbar.querySelectorAll('.submenu-wrapper > .submenu');

        submenuWrappers.forEach((submenu, index) => {
            submenu.addEventListener('mouseenter', () => {
                if (mainNavItems[index]) {
                    mainNavItems[index].querySelector('a').classList.add('active');
                }
            });
            submenu.addEventListener('mouseleave', () => {
                if (mainNavItems[index]) {
                    mainNavItems[index].querySelector('a').classList.remove('active');
                }
            });
        });
    }

    // --- 외부 링크 rel 보강 ---
    document.querySelectorAll('a[target="_blank"]').forEach(function(a){
      var rel = (a.getAttribute('rel')||'').split(' ').filter(Boolean);
      if (rel.indexOf('noopener') === -1) rel.push('noopener');
      if (rel.indexOf('noreferrer') === -1) rel.push('noreferrer');
      a.setAttribute('rel', rel.join(' '));
    });

    // --- 이미지 성능 최적화: lazy + async ---
    document.querySelectorAll('img:not(.no-lazy)').forEach(function(img){
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
      if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
    });

    // --- 연혁 사진 슬라이드 ---
    (function(){
      const track = document.querySelector('.history-slider .hs-track');
      if(!track) return;
      const imgs = [...track.querySelectorAll('.hs-item')];
      let idx = 0;
      const show = i => { imgs.forEach((el,j)=> el.classList.toggle('active', j===i)); };
      show(idx);
      document.querySelector('.history-slider .prev').addEventListener('click', ()=>{ idx = (idx - 1 + imgs.length) % imgs.length; show(idx); });
      document.querySelector('.history-slider .next').addEventListener('click', ()=>{ idx = (idx + 1) % imgs.length; show(idx); });
    })();


});

// --- 네비게이션 활성 표시 (페이지 로드 시) ---
(function () {
  try {
    var url = new URL(location.href);
    var path = url.pathname;
    if (!path || path === "/" || path.endsWith("/")) path = (path || "/") + "index.html";

    document.querySelectorAll(".main-nav a").forEach(function (a) {
      var ahref = new URL(a.getAttribute("href"), location.href).pathname;
      if (path === ahref) {
        a.classList.add("active");
      }
    });
  } catch(e) { console.error(e); }
})();

// --- 클릭 이벤트 로깅(GA4) ---
document.addEventListener('click', function(e){
  var a = e.target.closest('a'); if (!a) return;
  if (a.href && a.href.indexOf('pf.kakao.com/_Txgsen') !== -1) {
    if (window.gtag) gtag('event', 'kakao_consult_click', { method: 'kakao_channel' });
  }
  if (a.protocol === 'tel:') {
    if (window.gtag) gtag('event', 'phone_call_click', { method: 'tel_link' });
  }
  if (a.protocol === 'mailto:') {
    if (window.gtag) gtag('event', 'email_click', { method: 'mailto_link' });
  }
}, false);

// --- 라이트박스 (캡션 외부 표시 및 두 줄 처리) ---
(function(){
  const box = document.getElementById('lightbox');
  if (!box) return;
  
  const img = document.getElementById('lb-img');
  const cap = document.getElementById('lb-cap');
  
  const open = (src, name, date) => {
    img.src = src;
    img.alt = name || '';
    
    // 캡션 텍스트를 두 줄로 만듦
    if (name) {
        const dateHtml = date ? `<br><small style="color: #ccc; font-size: 0.85em;">${date}</small>` : '';
        cap.innerHTML = `${name}${dateHtml}`;
    } else {
        cap.innerHTML = '';
    }

    box.classList.add('open');
  };

  const close = () => {
    box.classList.remove('open');
  };

  document.querySelectorAll('.gallery .g-item').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      open(a.getAttribute('href'), a.dataset.name, a.dataset.date);
    });
  });

  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-backdrop').addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();