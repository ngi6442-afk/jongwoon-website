// --- Header/Footer include 완료 후 실행 (A02) ---
document.addEventListener('includesLoaded', function() {

  // --- Submenu 역 hover 효과 ---
  var topbar = document.querySelector('.topbar');
  if (topbar) {
    var mainNavItems = topbar.querySelectorAll('.main-nav > ul > li');
    var submenuWrappers = topbar.querySelectorAll('.submenu-wrapper > .submenu');

    submenuWrappers.forEach(function(submenu, index) {
      submenu.addEventListener('mouseenter', function() {
        if (mainNavItems[index]) {
          mainNavItems[index].querySelector('a').classList.add('active');
        }
      });
      submenu.addEventListener('mouseleave', function() {
        if (mainNavItems[index]) {
          mainNavItems[index].querySelector('a').classList.remove('active');
        }
      });
    });
  }

  // --- 네비게이션 활성 표시 (페이지 로드 시) ---
  (function() {
    try {
      var url = new URL(location.href);
      var path = url.pathname;
      if (!path || path === '/' || path.endsWith('/')) {
        path = (path || '/') + 'index.html';
      }

      document.querySelectorAll('.main-nav a').forEach(function(a) {
        var ahref = new URL(a.getAttribute('href'), location.href).pathname;
        if (path === ahref) {
          a.classList.add('active');
        }
      });
    } catch (e) {
      console.error(e);
    }
  })();

});

document.addEventListener('DOMContentLoaded', function() {

  // --- 외부 링크 rel 보강 ---
  document.querySelectorAll('a[target="_blank"]').forEach(function(a) {
    var rel = (a.getAttribute('rel') || '').split(' ').filter(Boolean);
    if (!rel.includes('noopener')) rel.push('noopener');
    if (!rel.includes('noreferrer')) rel.push('noreferrer');
    a.setAttribute('rel', rel.join(' '));
  });

  // --- 이미지 성능 최적화: lazy + async ---
  document.querySelectorAll('img:not(.no-lazy)').forEach(function(img) {
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
  });

// --- HERO TEXT SLIDER (INFINITE LOOP VERSION) ---
(function () {
    var slider = document.getElementById('hero-text-slider');
    if (!slider) return;

    var track = slider.querySelector('.hts-track');
    var items = slider.querySelectorAll('.hts-item');
    var dotsContainer = document.querySelector('.hts-dots');
    var slideCount = items.length;

    if (slideCount <= 1) return;

    var currentIndex = 1;
    var autoPlay;

    var cloneFirst = items[0].cloneNode(true);
    track.appendChild(cloneFirst);

    var totalSlides = slideCount + 1;

    for (var i = 0; i < slideCount; i++) {
        var dot = document.createElement("button");
        dot.className = "hts-dot";
        dot.dataset.index = i;
        dotsContainer.appendChild(dot);
    }
    var dots = dotsContainer.querySelectorAll('.hts-dot');

    function updateDots(realIndex) {
        dots.forEach(function(dot) { dot.classList.remove("active"); });
        dots[realIndex].classList.add("active");
    }

    function moveTo(index, smooth) {
        if (smooth === undefined) smooth = true;
        if (!smooth) {
            track.style.transition = "none";
        } else {
            track.style.transition = "transform .5s ease";
        }
        track.style.transform = 'translateX(-' + (index * 100) + '%)';
    }

    moveTo(0);
    updateDots(0);

    function start() {
        autoPlay = setInterval(function() {
            currentIndex++;
            moveTo(currentIndex);

            if (currentIndex === totalSlides - 1) {
                setTimeout(function() {
                    moveTo(0, false);
                    currentIndex = 0;
                }, 500);
            }

            updateDots(currentIndex % slideCount);
        }, 5000);
    }

    start();
})();


  // --- SUB-VISUAL CONTENT CONTROLLER (INTEGRATED) ---
  (function() {
    var body = document.body;
    var visualContent = document.querySelector('.sub-visual-content');
    if (!visualContent) return;

    if (visualContent.children.length > 0 || visualContent.textContent.trim() !== '') {
      return;
    }

    var environmentHTML = '<h1>지속 가능한 현장, 기술로 완성합니다</h1>' +
      '<p>폐기물 수집·운반부터 하수 준설까지, 데이터와 경험으로 효율적인 환경 관리를 실현합니다.</p>';

    var constructionHTML = '<h1>정확한 절차, 완벽한 해체</h1>' +
      '<p>건축물 철거부터 석면 제거까지, 법규와 안전 기준을 준수하며 책임 있게 수행합니다.</p>';

    var commonDefaultHTML = '<h1>도시와 현장을 하나의 흐름으로 관리합니다</h1>' +
      '<p>종운환경·종운건설은 환경과 건설의 경계를 넘어 통합 솔루션을 제공합니다.</p>';

    if (body.classList.contains('visual-environment')) {
      visualContent.innerHTML = environmentHTML;
    } else if (body.classList.contains('visual-construction')) {
      visualContent.innerHTML = constructionHTML;
    } else if (body.classList.contains('visual-common')) {
      visualContent.innerHTML = commonDefaultHTML;
    }
  })();

  // --- 클릭 이벤트 로깅(GA4) ---
  document.addEventListener('click', function(e) {
    var a = e.target.closest('a');
    if (!a) return;

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
  (function() {
    var box = document.getElementById('lightbox');
    if (!box) return;

    var img = document.getElementById('lb-img');
    var cap = document.getElementById('lb-cap');

    var open = function(src, name, date) {
      img.src = src;
      img.alt = name || '';

      if (name) {
        var dateHtml = date
          ? '<br><small style="color: #ccc; font-size: 0.85em;">' + date + '</small>'
          : '';
        cap.innerHTML = name + dateHtml;
      } else {
        cap.innerHTML = '';
      }

      box.classList.add('open');
    };

    var close = function() {
      box.classList.remove('open');
    };

    document.querySelectorAll('.gallery .g-item').forEach(function(a) {
      a.addEventListener('click', function(e) {
        e.preventDefault();
        open(a.getAttribute('href'), a.dataset.name, a.dataset.date);
      });
    });

    box.querySelector('.lb-close').addEventListener('click', close);
    box.querySelector('.lb-backdrop').addEventListener('click', close);
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') close();
    });
  })();

  // --- TABS UI (수정본) ---
  (function() {
    var tabContainers = document.querySelectorAll('.tabs-ui');

    tabContainers.forEach(function(container) {
      var tabButtons = container.querySelectorAll(':scope > .tab-buttons > .tab-btn');
      var tabContents = container.querySelectorAll(':scope > .tab-content');

      tabButtons.forEach(function(button) {
        button.addEventListener('click', function() {
          var targetTab = button.getAttribute('data-tab');

          tabButtons.forEach(function(btn) { btn.classList.remove('active'); });
          tabContents.forEach(function(content) { content.classList.remove('active'); });

          button.classList.add('active');

          var targetContent = container.querySelector('#' + targetTab);
          if (targetContent) {
            targetContent.classList.add('active');
          }
        });
      });
    });
  })();

}); // DOMContentLoaded 종료

// --- Floating Consult Toggle (wait for include footer) ---
(function () {
  function initFloatingConsult() {
    var wrap = document.querySelector('.fc-wrap');
    if (!wrap) return false;

    var btn = wrap.querySelector('.fc-main');
    var panel = wrap.querySelector('.fc-panel');
    if (!btn || !panel) return false;

    if (wrap.dataset.fcInit === '1') return true;
    wrap.dataset.fcInit = '1';

    var close = function() {
      panel.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    };

    btn.addEventListener('click', function() {
      var isOpen = panel.hidden;
      panel.hidden = !isOpen;
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', function(e) {
      if (!wrap.contains(e.target)) close();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') close();
    });

    return true;
  }

  if (initFloatingConsult()) return;

  var observer = new MutationObserver(function() {
    if (initFloatingConsult()) observer.disconnect();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  setTimeout(function() { observer.disconnect(); }, 5000);
})();

// --- Mobile Nav Toggle (A05 - wait for include header) ---
(function () {
  function initMobileNav() {
    var hamburger = document.querySelector('.hamburger-btn');
    var panel = document.querySelector('.mobile-nav-panel');
    var backdrop = document.querySelector('.mobile-nav-backdrop');
    if (!hamburger || !panel) return false;

    // 중복 바인딩 방지
    if (hamburger.dataset.mobileInit === '1') return true;
    hamburger.dataset.mobileInit = '1';

    function openMenu() {
      panel.classList.add('is-open');
      hamburger.classList.add('is-active');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', '메뉴 닫기');
      document.body.classList.add('mobile-nav-open');
      if (backdrop) backdrop.classList.add('is-open');
    }

    function closeMenu() {
      panel.classList.remove('is-open');
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', '메뉴 열기');
      document.body.classList.remove('mobile-nav-open');
      if (backdrop) backdrop.classList.remove('is-open');
    }

    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (panel.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // 배경 오버레이 클릭 시 닫기
    if (backdrop) {
      backdrop.addEventListener('click', closeMenu);
    }

    // ESC 닫기
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) {
        closeMenu();
      }
    });

    // 메뉴 내부 링크 클릭 시 닫기
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    return true;
  }

  // 1) 즉시 시도
  if (initMobileNav()) return;

  // 2) header include 완료 대기
  var observer = new MutationObserver(function () {
    if (initMobileNav()) observer.disconnect();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  // 3) 안전장치
  setTimeout(function () { observer.disconnect(); }, 5000);
})();

// --- Service Detail Gallery Feed (태그 기준 최신 4개) ---
(function () {
  var feeds = document.querySelectorAll('.svc-gallery-feed[data-tag]');
  if (!feeds.length) return;

  fetch('/data/gallery.json')
    .then(function (res) {
      if (!res.ok) throw new Error('gallery.json not found');
      return res.json();
    })
    .then(function (data) {
      var items = Array.isArray(data) ? data : [];
      feeds.forEach(function (el) {
        var tag = el.getAttribute('data-tag');
        var filtered = items.filter(function (item) { return item.tag === tag; }).slice(0, 4);
        renderFeed(el, filtered);
      });
    })
    .catch(function () {
      feeds.forEach(function (el) {
        el.innerHTML = '<p class="muted" style="text-align:center;padding:20px 0;">현장 갤러리를 불러올 수 없습니다.</p>';
      });
    });

  function renderFeed(el, items) {
    if (items.length === 0) {
      el.innerHTML = '<p class="muted" style="text-align:center;padding:20px 0;">등록된 현장 사진이 없습니다.</p>';
      return;
    }
    var html = '';
    items.forEach(function (item) {
      var thumb = (item.images && item.images[0]) || item.image || '';
      var thumbHtml = thumb
        ? '<img src="' + esc(thumb) + '" alt="' + esc(item.title || '') + '">'
        : '<div class="noimage"></div>';

      html += '<a class="gallery-card" href="' + esc(item.url || '#') + '" target="_blank" rel="noopener noreferrer">'
        + thumbHtml
        + '<div class="info">'
        + '<p class="tit"><b>' + esc(item.title || '') + '</b></p>'
        + '<p class="meta">' + esc(item.date || '') + '</p>'
        + '</div></a>';
    });
    el.innerHTML = html;
  }

  function esc(str) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }
})();

// --- Online Inquiry: 개인정보 동의 체크 → 제출 버튼 활성화 ---
(function () {
  var cb = document.getElementById('privacy-consent');
  var btn = document.getElementById('submit-btn');
  if (!cb || !btn) return;

  cb.addEventListener('change', function () {
    btn.disabled = !cb.checked;
  });
})();

// --- FAQ: 렌더 + 검색 (data/faq.json 기반) ---
(function () {
  var board = document.getElementById('faq-board');
  var search = document.getElementById('faq-search');
  if (!board) return;

  var faqItems = [];

  // 1) JSON fetch 시도
  fetch('/data/faq.json')
    .then(function (res) { return res.ok ? res.json() : Promise.reject(); })
    .then(function (data) {
      faqItems = (data && Array.isArray(data.items)) ? data.items : [];
      render('');
    })
    .catch(function () {
      // 2) fallback: 기존 faq-data.js 전역 변수
      if (typeof faqData !== 'undefined' && Array.isArray(faqData)) {
        faqItems = faqData;
        render('');
      } else {
        board.innerHTML = '<p class="muted" style="text-align:center;padding:40px 0;">FAQ 데이터를 불러올 수 없습니다.</p>';
      }
    });

  function render(keyword) {
    var kw = (keyword || '').trim().toLowerCase();
    var filtered = faqItems.filter(function (item) {
      if (!kw) return true;
      return item.question.toLowerCase().indexOf(kw) !== -1
        || item.answer.toLowerCase().indexOf(kw) !== -1;
    });

    if (filtered.length === 0) {
      board.innerHTML = '<p class="muted" style="text-align:center;padding:40px 0;">검색 결과가 없습니다.</p>';
      return;
    }

    var html = '';
    filtered.forEach(function (item) {
      html += '<details class="card" style="margin-bottom:8px;">'
        + '<summary style="cursor:pointer;padding:14px 16px;font-weight:600;">'
        + esc(item.question)
        + '</summary>'
        + '<div style="padding:0 16px 14px;color:var(--muted);">'
        + '<p style="margin:0;">' + esc(item.answer) + '</p>'
        + '</div></details>';
    });
    board.innerHTML = html;
  }

  function esc(str) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(str || ''));
    return d.innerHTML;
  }

  if (search) {
    search.addEventListener('input', function () {
      render(search.value);
    });
  }
})();