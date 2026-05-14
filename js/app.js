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
      var items = Array.isArray(data) ? data : ((data && Array.isArray(data.items)) ? data.items : []);

      feeds.forEach(function (el) {
        var tag = el.getAttribute('data-tag');
        var limit = Number(el.getAttribute('data-limit')) || 4;
        var filtered = items.filter(function (item) {
          return !tag || item.tag === tag;
        }).slice(0, limit);

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
      var thumb = '';

      if (Array.isArray(item.images) && item.images.length) {
        if (typeof item.images[0] === 'string') {
          thumb = item.images[0];
        } else if (item.images[0] && item.images[0].src) {
          thumb = item.images[0].src;
        }
      }

      if (!thumb && item.image) {
        thumb = item.image;
      }

      var thumbHtml = thumb
        ? '<img src="' + esc(thumb) + '" alt="' + esc(item.title || '') + '" loading="lazy" decoding="async">'
        : '<div class="noimage"></div>';

      html += '<a class="gallery-card" href="' + esc(item.url || '#') + '" target="_blank" rel="noopener noreferrer">'
        + thumbHtml
        + '<div class="info">'
        + '<p class="tit"><b>' + esc(item.title || '') + '</b></p>'
        + '<p class="meta">' + esc(item.date || '') + '</p>';

      if (item.description) {
        html += '<p class="desc">' + esc(item.description) + '</p>';
      }

      html += '</div></a>';
    });

    el.innerHTML = html;
  }

  function esc(str) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(str || ''));
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

// --- Fleet Status Gallery Feed (data/fleet.json 기반 렌더링) ---
(function () {
  var board = document.getElementById('fleet-board');
  if (!board) return;

  fetch('/data/fleet.json')
    .then(function (res) {
      if (!res.ok) throw new Error('fleet.json not found');
      return res.json();
    })
    .then(function (data) {
      var items = (data && Array.isArray(data.items)) ? data.items : [];
      if (items.length === 0) return; // 데이터가 없으면 기존 정적 콘텐츠 유지

      // order 기준 오름차순 정렬
      items.sort(function(a, b) {
        var orderA = typeof a.order === 'number' ? a.order : 999;
        var orderB = typeof b.order === 'number' ? b.order : 999;
        return orderA - orderB;
      });

      var html = '<div class="fleet-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">';
      
      items.forEach(function (item) {
        var imgHtml = item.image
          ? '<img src="' + esc(item.image) + '" alt="' + esc(item.title || '') + '" style="width:100%; height:auto; border-radius:8px; margin-bottom:12px; object-fit:cover; aspect-ratio:4/3;">'
          : '<div class="noimage" style="width:100%; height:200px; background:#f5f5f5; border-radius:8px; margin-bottom:12px; display:flex; align-items:center; justify-content:center; color:#999;">이미지 준비중</div>';

        var catHtml  = item.category ? '<span style="display:inline-block; padding:4px 8px; background:#e9ecef; color:#495057; font-size:0.8em; border-radius:4px; margin-bottom:8px;">' + esc(item.category) + '</span>' : '';
        var specHtml = item.spec ? '<p style="margin:4px 0; font-size:0.9em; color:#555;"><strong>사양:</strong> ' + esc(item.spec) + '</p>' : '';
        var qtyHtml  = item.quantity ? '<p style="margin:4px 0; font-size:0.9em; color:#555;"><strong>수량:</strong> ' + esc(item.quantity) + '</p>' : '';
        var descHtml = item.description ? '<p style="margin:8px 0 0; font-size:0.95em; color:#666;">' + esc(item.description) + '</p>' : '';

        html += '<div class="fleet-card" style="border:1px solid #e0e0e0; padding:20px; border-radius:8px; background:#fff; box-shadow:0 2px 4px rgba(0,0,0,0.05);">'
          + imgHtml
          + catHtml
          + '<h3 style="margin:0 0 12px; font-size:1.25em; color:#333;">' + esc(item.title || '차량명 미상') + '</h3>'
          + specHtml
          + qtyHtml
          + descHtml
          + '</div>';
      });
      html += '</div>';

      board.innerHTML = html; // 성공 시 기존 콘텐츠 덮어쓰기
    })
    .catch(function (err) {
      // 에러 시 Console 에러를 방지하고 기존 정적 콘텐츠 유지
      console.warn('운반차량 현황 렌더링 건너뜀 (정적 데이터 사용):', err.message);
    });

  function esc(str) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(str || ''));
    return d.innerHTML;
  }
})();

// --- Page-Level CMS Renderer (fleet + service detail pilot) ---
(function () {
  var root = document.querySelector('#page-cms-root[data-page]');
  if (!root) return;

  var page = root.getAttribute('data-page');
  var fallbackHTML = root.innerHTML;

  fetch('/data/pages/' + page + '.json')
    .then(function (r) {
      if (!r.ok) throw new Error('page json not found');
      return r.json();
    })
    .then(function (data) {
      if (data.meta) {
        if (data.meta.title) document.title = data.meta.title;

        var metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && data.meta.description) {
          metaDesc.setAttribute('content', data.meta.description);
        }
      }

      var html = '';

      if (Array.isArray(data.breadcrumbs) && data.breadcrumbs.length) {
        html += '<div class="breadcrumbs">';
        data.breadcrumbs.forEach(function (b, i) {
          if (i > 0) html += ' · ';
          if (b.href) {
            html += '<a href="' + esc(b.href) + '">' + esc(b.label) + '</a>';
          } else {
            html += esc(b.label);
          }
        });
        html += '</div>';
      }

      if (data.hero && data.hero.visible !== false) {
        html += '<h1 class="section-title" style="text-align:center;margin-top:47px;">' + esc(data.hero.title || '');
        if (data.hero.subtitle) {
          html += '<br><span style="display:inline;font-size:0.7em;">' + esc(data.hero.subtitle) + '</span>';
        }
        html += '</h1>';
      }

      var sections = Array.isArray(data.sections) ? data.sections.slice() : [];
      sections.sort(function (a, b) {
        return (Number(a.order) || 0) - (Number(b.order) || 0);
      });

      sections.forEach(function (sec) {
        if (sec.visible === false) return;
        html += renderSection(sec);
      });

      root.innerHTML = html;

      initTabs(root);

      root.querySelectorAll('[data-cms-fleet-cards="true"]').forEach(function (target) {
        var source = target.getAttribute('data-source') || 'fleet';
        loadFleetCards(target, source);
      });

      root.querySelectorAll('[data-cms-gallery-feed="true"]').forEach(function (target) {
        var tag = target.getAttribute('data-tag') || '';
        var limit = Number(target.getAttribute('data-limit')) || 4;
        loadGalleryFeed(target, tag, limit);
      });
    })
    .catch(function (err) {
      console.warn('Page-Level CMS 렌더링 실패. 정적 fallback 사용:', err.message);
      root.innerHTML = fallbackHTML;
    });

  function renderSection(sec) {
    var h = '';

    switch (sec.type) {
      case 'legalText':
      case 'text':
        h += '<section class="section">';

        if (sec.title) {
          h += '<h2 class="section-title" style="text-align:center;">' + esc(sec.title) + '</h2>';
        }

        if (sec.body) {
          h += renderParagraphs(sec.body);
        }

        if (Array.isArray(sec.items) && sec.items.length) {
          h += '<ul class="list-bulleted" style="margin-top:8px">';
          sec.items.forEach(function (item) {
            h += '<li>' + esc(item) + '</li>';
          });
          h += '</ul>';
        }

        if (sec.note) {
          h += '<p class="muted" style="text-align:left;margin-top:20px;margin-left:30px;margin-right:30px;font-size:0.9em;">' + esc(sec.note) + '</p>';
        }

        h += '</section>';
        break;

      case 'cards':
        h += '<section class="section">';

        if (sec.title) {
          h += '<h2 class="section-title" style="text-align:center;">' + esc(sec.title) + '</h2>';
        }

        if (sec.body) {
          h += renderParagraphs(sec.body);
        }

        h += '<div class="service-grid">';

        (Array.isArray(sec.cards) ? sec.cards : []).forEach(function (card) {
          h += '<article class="card">';
          if (card.title) h += '<h3>' + esc(card.title) + '</h3>';
          if (card.body) h += '<p class="muted">' + esc(card.body).replace(/\n/g, '<br>') + '</p>';
          h += '</article>';
        });

        h += '</div></section>';
        break;

      case 'list':
        h += '<section class="section">';

        if (sec.title) {
          h += '<h2 class="section-title" style="text-align:center;">' + esc(sec.title) + '</h2>';
        }

        if (sec.body) {
          h += renderParagraphs(sec.body);
        }

        if (Array.isArray(sec.items) && sec.items.length) {
          h += '<ul class="list-bulleted" style="margin-top:8px">';
          sec.items.forEach(function (item) {
            h += '<li>' + esc(item) + '</li>';
          });
          h += '</ul>';
        }

        h += '</section>';
        break;

      case 'tabs':
        h += renderTabsSection(sec);
        break;

      case 'galleryFeed':
        h += '<section class="section">';

        if (sec.title) {
          h += '<h2 class="section-title" style="text-align:center;">' + esc(sec.title) + '</h2>';
        }

        if (sec.body) {
          h += renderParagraphs(sec.body);
        }

        h += '<div class="svc-gallery-feed" data-cms-gallery-feed="true" data-tag="' + esc(sec.tag || '') + '" data-limit="' + esc(sec.limit || 4) + '">';
        h += '<p class="muted" style="text-align:center;padding:20px 0;">현장 갤러리를 불러오는 중...</p>';
        h += '</div>';

        h += '</section>';
        break;

      case 'cta':
        h += '<section class="section" style="text-align:center;">';

        if (sec.title) {
          h += '<h2 class="section-title" style="text-align:center;">' + esc(sec.title) + '</h2>';
        }

        if (sec.body) {
          h += renderParagraphs(sec.body);
        }

        if (sec.buttonLabel && sec.buttonHref) {
          h += '<a class="btn primary" href="' + esc(sec.buttonHref) + '">' + esc(sec.buttonLabel) + '</a>';
        }

        h += '</section>';
        break;

      case 'tableImage':
        h += '<section class="section">';

        if (sec.title) {
          h += '<h2 class="section-title" style="text-align:center;">' + esc(sec.title) + '</h2>';
        }

        h += '<div class="table-wrap">';

        if (sec.image) {
          h += '<img src="' + esc(sec.image) + '" alt="' + esc(sec.imageAlt || sec.title || '') + '" loading="lazy" decoding="async">';
        } else {
          h += '<div class="fleet-image-placeholder" style="width:100%;min-height:180px;border-radius:12px;background:#f3f5f6;display:flex;align-items:center;justify-content:center;color:var(--muted);">이미지 준비중</div>';
        }

        h += '</div></section>';
        break;

      case 'fleetCards':
        h += '<section class="section">';

        if (sec.title) {
          h += '<h2 class="section-title" style="text-align:center;">' + esc(sec.title) + '</h2>';
        }

        if (sec.body) {
          h += renderParagraphs(sec.body);
        }

        h += '<div id="cms-fleet-cards" data-cms-fleet-cards="true" data-source="' + esc(sec.source || 'fleet') + '">';
        h += '<p class="muted" style="text-align:center;padding:20px;">차량 정보를 불러오는 중...</p>';
        h += '</div>';

        h += '</section>';
        break;

      default:
        break;
    }

    return h;
  }

  function renderTabsSection(sec) {
    var tabs = Array.isArray(sec.tabs) ? sec.tabs : [];
    if (!tabs.length) return '';

    var h = '<section class="section">';

    if (sec.title) {
      h += '<h2 class="section-title" style="text-align:center;">' + esc(sec.title) + '</h2>';
    }

    if (sec.body) {
      h += renderParagraphs(sec.body);
    }

    h += '<div class="tabs-ui card" style="margin-top:20px;">';
    h += '<div class="tab-buttons">';

    tabs.forEach(function (tab, index) {
      h += '<button class="tab-btn' + (index === 0 ? ' active' : '') + '" data-tab="' + esc(tab.id || ('tab-' + index)) + '">' + esc(tab.label || ('탭 ' + (index + 1))) + '</button>';
    });

    h += '</div>';

    tabs.forEach(function (tab, index) {
      h += '<div id="' + esc(tab.id || ('tab-' + index)) + '" class="tab-content' + (index === 0 ? ' active' : '') + '">';
      h += renderTabContent(tab);
      h += '</div>';
    });

    h += '</div></section>';

    return h;
  }

  function renderTabContent(tab) {
    var h = '';

    if (Array.isArray(tab.tabs) && tab.tabs.length) {
      h += '<div class="tabs-ui">';
      h += '<div class="tab-buttons">';

      tab.tabs.forEach(function (subtab, index) {
        h += '<button class="tab-btn' + (index === 0 ? ' active' : '') + '" data-tab="' + esc(subtab.id || ('subtab-' + index)) + '">' + esc(subtab.label || ('탭 ' + (index + 1))) + '</button>';
      });

      h += '</div>';

      tab.tabs.forEach(function (subtab, index) {
        h += '<div id="' + esc(subtab.id || ('subtab-' + index)) + '" class="tab-content' + (index === 0 ? ' active' : '') + '">';
        h += renderTabContent(subtab);
        h += '</div>';
      });

      h += '</div>';
      return h;
    }

    if (tab.type === 'galleryFeed' || tab.galleryTag || tab.tag) {
      h += '<div class="svc-gallery-feed" data-cms-gallery-feed="true" data-tag="' + esc(tab.tag || tab.galleryTag || '') + '" data-limit="' + esc(tab.limit || tab.galleryLimit || 4) + '">';
      h += '<p class="muted" style="text-align:center;padding:20px 0;">현장 갤러리를 불러오는 중...</p>';
      h += '</div>';
      return h;
    }

    if (tab.image) {
      h += '<img src="' + esc(tab.image) + '" alt="' + esc(tab.imageAlt || tab.label || '') + '" loading="lazy" decoding="async" style="' + esc(tab.imageStyle || 'width:100%;') + '">';
    }

    if (tab.body) {
      h += renderParagraphs(tab.body);
    }

    if (Array.isArray(tab.items) && tab.items.length) {
      h += '<ul class="list-bulleted" style="margin-top:8px">';
      tab.items.forEach(function (item) {
        h += '<li>' + esc(item) + '</li>';
      });
      h += '</ul>';
    }

    return h;
  }

  function renderParagraphs(body) {
    var h = '';

    String(body).split('\n\n').forEach(function (p) {
      if (!p.trim()) return;
      h += '<p class="muted" style="text-align:left;margin-top:30px;margin-left:30px;margin-right:30px;">' + esc(p).replace(/\n/g, '<br>') + '</p>';
    });

    return h;
  }

  function initTabs(scope) {
    var tabContainers = scope.querySelectorAll('.tabs-ui');

    tabContainers.forEach(function (container) {
      if (container.dataset.cmsTabsInit === '1') return;
      container.dataset.cmsTabsInit = '1';

      var tabButtons = container.querySelectorAll(':scope > .tab-buttons > .tab-btn');
      var tabContents = container.querySelectorAll(':scope > .tab-content');

      tabButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          var targetTab = button.getAttribute('data-tab');

          tabButtons.forEach(function (btn) { btn.classList.remove('active'); });
          tabContents.forEach(function (content) { content.classList.remove('active'); });

          button.classList.add('active');

          var targetContent = container.querySelector(':scope > #' + cssEscape(targetTab));
          if (targetContent) {
            targetContent.classList.add('active');
          }
        });
      });
    });
  }

  function loadGalleryFeed(target, tag, limit) {
    fetch('/data/gallery.json')
      .then(function (r) {
        if (!r.ok) throw new Error('gallery json not found');
        return r.json();
      })
      .then(function (data) {
        var items = Array.isArray(data) ? data : ((data && Array.isArray(data.items)) ? data.items.slice() : []);

        var filtered = items.filter(function (item) {
          return !tag || item.tag === tag;
        }).slice(0, limit || 4);

        if (!filtered.length) {
          target.innerHTML = '<p class="muted" style="text-align:center;padding:20px 0;">등록된 현장 사진이 없습니다.</p>';
          return;
        }

        var h = '';

        filtered.forEach(function (item) {
          var thumb = '';

          if (Array.isArray(item.images) && item.images.length) {
            if (typeof item.images[0] === 'string') {
              thumb = item.images[0];
            } else if (item.images[0] && item.images[0].src) {
              thumb = item.images[0].src;
            }
          }

          if (!thumb && item.image) {
            thumb = item.image;
          }

          var thumbHtml = thumb
            ? '<img src="' + esc(thumb) + '" alt="' + esc(item.title || '') + '" loading="lazy" decoding="async">'
            : '<div class="noimage"></div>';

          h += '<a class="gallery-card" href="' + esc(item.url || '#') + '" target="_blank" rel="noopener noreferrer">'
            + thumbHtml
            + '<div class="info">'
            + '<p class="tit"><b>' + esc(item.title || '') + '</b></p>'
            + '<p class="meta">' + esc(item.date || '') + '</p>';

          if (item.description) {
            h += '<p class="desc">' + esc(item.description) + '</p>';
          }

          h += '</div></a>';
        });

        target.innerHTML = h;
      })
      .catch(function (err) {
        console.warn('galleryFeed 렌더링 실패:', err.message);
        target.innerHTML = '<p class="muted" style="text-align:center;padding:20px 0;">현장 갤러리를 불러올 수 없습니다.</p>';
      });
  }

  function loadFleetCards(target, source) {
    var dataUrl = source === 'fleet' ? '/data/fleet.json' : '/data/' + source + '.json';

    fetch(dataUrl)
      .then(function (r) {
        if (!r.ok) throw new Error('fleet item json not found');
        return r.json();
      })
      .then(function (data) {
        var items = data && Array.isArray(data.items) ? data.items.slice() : [];

        items.sort(function (a, b) {
          return (Number(a.order) || 999) - (Number(b.order) || 999);
        });

        if (!items.length) {
          target.innerHTML = '<p class="muted" style="text-align:center;padding:20px;">등록된 차량이 없습니다.</p>';
          return;
        }

        var h = '';
        h += '<div class="fleet-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;margin-top:20px;">';

        items.forEach(function (item) {
          h += '<div class="fleet-card card" style="padding:16px;border:1px solid var(--line);border-radius:12px;background:#fff;">';

          h += '<div class="fleet-image-wrap" style="width:100%;aspect-ratio:4/3;border-radius:10px;background:#f3f5f6;overflow:hidden;display:flex;align-items:center;justify-content:center;color:var(--muted);margin-bottom:12px;">';

          if (item.image) {
            h += '<img data-fleet-image="true" src="' + esc(item.image) + '" alt="' + esc(item.title || '') + '" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;">';
          } else {
            h += '이미지 준비중';
          }

          h += '</div>';

          if (item.category) {
            h += '<span style="display:inline-block;padding:4px 8px;background:#f3f5f6;color:var(--muted);font-size:0.85em;border-radius:999px;margin-bottom:8px;">' + esc(item.category) + '</span>';
          }

          h += '<h3 style="margin:0 0 8px;font-size:1.15rem;">' + esc(item.title || '차량명 미상') + '</h3>';

          if (item.spec) {
            h += '<p class="muted" style="margin:0 0 6px;font-size:0.95em;">' + esc(item.spec) + '</p>';
          }

          if (item.quantity) {
            h += '<p style="margin:0 0 6px;font-size:0.95em;">보유: ' + esc(item.quantity) + '</p>';
          }

          if (item.description) {
            h += '<p class="muted" style="margin:8px 0 0;font-size:0.95em;">' + esc(item.description) + '</p>';
          }

          h += '</div>';
        });

        h += '</div>';

        target.innerHTML = h;

        target.querySelectorAll('img[data-fleet-image="true"]').forEach(function (img) {
          img.addEventListener('error', function () {
            var wrap = img.parentNode;
            if (!wrap) return;
            wrap.innerHTML = '이미지 준비중';
          });
        });
      })
      .catch(function (err) {
        console.warn('fleetCards 렌더링 실패:', err.message);
        target.innerHTML = '<p class="muted" style="text-align:center;padding:20px;">차량 정보를 불러올 수 없습니다.</p>';
      });
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === 'function') {
      return window.CSS.escape(value);
    }

    return String(value || '').replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  }

  function esc(str) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(str || ''));
    return d.innerHTML;
  }
})();