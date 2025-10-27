document.addEventListener('DOMContentLoaded', function() {


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

// --- HERO TEXT SLIDER (NEW) ---
(function() {
    const slider = document.getElementById('hero-text-slider');
    if (!slider) return;

    const track = slider.querySelector('.hts-track');
    const items = slider.querySelectorAll('.hts-item');
    const dotsContainer = document.querySelector('.hts-dots');
    const slideCount = items.length;
    let currentIndex = 0;
    let autoPlayInterval;

    if (slideCount <= 1) return;

    // 1. 원형 버튼 생성
    for (let i = 0; i < slideCount; i++) {
        const button = document.createElement('button');
        button.className = 'hts-dot';
        button.addEventListener('click', () => {
            moveTo(i);
            resetAutoPlay();
        });
        dotsContainer.appendChild(button);
    }
    const dots = dotsContainer.querySelectorAll('.hts-dot');
    
    // 2. 슬라이드 이동 및 UI 업데이트 함수
    function moveTo(index) {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        currentIndex = index;
    }

    // 3. 자동 재생 함수
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % slideCount;
            moveTo(nextIndex);
        }, 5000);
    }
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // 4. 초기화
    moveTo(0);
    startAutoPlay();
})();

// --- SUB-VISUAL CONTENT CONTROLLER (INTEGRATED) ---
(function() {
    const body = document.body;
    const visualContent = document.querySelector('.sub-visual-content');
    if (!visualContent) return;

    // '환경' 분류용 고정 문구
    const environmentHTML = `
        <h1>지속 가능한 현장, 기술로 완성합니다</h1>
        <p>폐기물 수집·운반부터 하수 준설까지, 데이터와 경험으로 효율적인 환경 관리를 실현합니다.</p>
    `;

    // '건설' 분류용 고정 문구
    const constructionHTML = `
        <h1>정확한 절차, 완벽한 해체</h1>
        <p>건축물 철거부터 석면 제거까지, 법규와 안전 기준을 준수하며 책임 있게 수행합니다.</p>
    `;

    // '공통' 분류용 슬라이드 문구
const commonMessages = [
  {
    title: "정직한 기술로 현장을 변화시킵니다",
    subtitle: "현장의 데이터와 경험을 기반으로, 고객에게 가장 합리적인 솔루션을 제공합니다."
  },
  {
    title: "신뢰와 품질, 그 이상의 가치",
    subtitle: "투명한 절차와 꾸준한 개선으로 고객의 믿음에 보답합니다."
  }
];


    // 분류에 따라 다른 콘텐츠 삽입
    if (body.classList.contains('visual-environment')) {
        visualContent.innerHTML = environmentHTML;
    } 
    else if (body.classList.contains('visual-construction')) {
        visualContent.innerHTML = constructionHTML;
    } 
    else if (body.classList.contains('visual-common')) {
        // '공통' 분류일 경우 슬라이더 생성 및 실행
        visualContent.innerHTML = `<div class="svs-track"></div>`;
        const track = visualContent.querySelector('.svs-track');

        commonMessages.forEach(msg => {
            track.innerHTML += `
                <div class="svs-item" style="opacity: 0;">
                    <h1>${msg.title}</h1>
                    <p>${msg.subtitle}</p>
                </div>
            `;
        });
        
        const items = track.querySelectorAll('.svs-item');
        if (items.length === 0) return;

        let currentIndex = 0;
        
        function showSlide(index) {
            items.forEach((item, i) => {
                item.style.opacity = (i === index) ? '1' : '0';
            });
        }

        setInterval(() => {
            currentIndex = (currentIndex + 1) % items.length;
            showSlide(currentIndex);
        }, 4000);

        showSlide(0);
    }
})();

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

// --- TABS UI (수정본) ---
(function() {
    const tabContainers = document.querySelectorAll('.tabs-ui');
    
    tabContainers.forEach(container => {
        // 중요: 현재 컨테이너의 직계 자식 버튼과 콘텐츠만 선택하도록 수정
        const tabButtons = container.querySelectorAll(':scope > .tab-buttons > .tab-btn');
        const tabContents = container.querySelectorAll(':scope > .tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');

                // 모든 버튼과 콘텐츠에서 active 클래스 제거
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // 클릭된 버튼과 해당 콘텐츠에 active 클래스 추가
                button.classList.add('active');
                
                // 중요: ID로 전체 문서에서 찾지 않고, 현재 컨테이너 내에서만 찾도록 수정
                const targetContent = container.querySelector('#' + targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    });
})();})