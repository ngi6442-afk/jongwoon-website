// js/gallery.js
// 현장 갤러리 공용 렌더러
// - gallery.html: 전체 목록 (grid/list 전환, 태그 필터)
// - 서비스 상세: .svc-gallery-feed[data-tag] 컨테이너에 태그별 최신 4개
// 데이터 소스: /data/gallery.json  →  { "items": [ ... ] }

(function () {
  'use strict';

  var DATA_URL = '/data/gallery.json';

  // ── 공용 헬퍼 ──
  function esc(str) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(str || ''));
    return d.innerHTML;
  }

  function getThumb(item) {
    if (item.images && item.images.length > 0 && item.images[0].src) return item.images[0].src;
    if (item.image) return item.image;
    return '';
  }

  function getExtras(item) {
    if (item.images && item.images.length > 1) {
      return item.images.slice(1, 5).map(function (img) { return img.src || ''; });
    }
    return [];
  }

  function sortDesc(items) {
    return items.slice().sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
  }

  function parseItems(data) {
    if (data && Array.isArray(data.items)) return data.items;
    if (Array.isArray(data)) return data;
    return [];
  }

  // ── 카드 HTML ──
  function cardHtml(item, compact) {
    var thumb = getThumb(item);
    var thumbTag = thumb
      ? '<img src="' + esc(thumb) + '" alt="' + esc(item.title) + '">'
      : '<div class="noimage"></div>';

    var extras = compact ? [] : getExtras(item);
    var stripTag = '';
    if (extras.length) {
      stripTag = '<div class="thumb-strip">';
      extras.forEach(function (s) { stripTag += '<span class="mini"><img src="' + esc(s) + '" alt=""></span>'; });
      stripTag += '</div>';
    }

    return '<a class="gallery-card" href="' + esc(item.url || '#') + '" target="_blank" rel="noopener noreferrer">'
      + thumbTag
      + '<div class="info">'
      + '<p class="tit"><b>' + esc(item.title) + '</b></p>'
      + '<p class="meta">' + esc(item.date || '') + ((!compact && item.tag) ? ' · ' + esc(item.tag) : '') + '</p>'
      + ((!compact && item.description) ? '<p class="desc">' + esc(item.description) + '</p>' : '')
      + stripTag
      + '</div></a>';
  }

  // ── A) gallery.html 전체 페이지 ──
  function initGalleryPage() {
    var box = document.getElementById('galleryContainer');
    var sel = document.getElementById('tagFilter');
    var bGrid = document.getElementById('btnGrid');
    var bList = document.getElementById('btnList');
    if (!box) return;

    var all = [];
    var view = 'grid';

    fetch(DATA_URL)
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (d) { all = sortDesc(parseItems(d)); render(); })
      .catch(function () { box.innerHTML = '<p class="muted" style="text-align:center;padding:40px 0;">현장 갤러리 데이터를 불러올 수 없습니다.</p>'; });

    function render() {
      var tag = sel ? sel.value : '';
      var list = tag ? all.filter(function (i) { return i.tag === tag; }) : all;
      if (!list.length) { box.innerHTML = '<p class="muted" style="text-align:center;padding:40px 0;">해당 태그의 게시물이 없습니다.</p>'; return; }
      view === 'grid' ? gridView(list) : listView(list);
    }

    function gridView(items) {
      box.className = 'grid-view';
      box.innerHTML = items.map(function (i) { return cardHtml(i, false); }).join('');
    }

    function listView(items) {
      box.className = 'list-view';
      var h = '<div class="board"><div class="board-head"><span class="col date">날짜</span><span class="col title">제목</span><span class="col tag">분류</span></div>';
      items.forEach(function (i) {
        h += '<a class="board-row" href="' + esc(i.url || '#') + '" target="_blank" rel="noopener noreferrer">'
          + '<span class="col date">' + esc(i.date || '') + '</span>'
          + '<span class="col title">' + esc(i.title || '') + '</span>'
          + '<span class="col tag">' + esc(i.tag || '') + '</span></a>';
      });
      box.innerHTML = h + '</div>';
    }

    if (sel) sel.addEventListener('change', render);
    if (bGrid) bGrid.addEventListener('click', function () {
      view = 'grid';
      bGrid.classList.add('primary'); bGrid.setAttribute('aria-pressed', 'true');
      bList.classList.remove('primary'); bList.setAttribute('aria-pressed', 'false');
      render();
    });
    if (bList) bList.addEventListener('click', function () {
      view = 'list';
      bList.classList.add('primary'); bList.setAttribute('aria-pressed', 'true');
      bGrid.classList.remove('primary'); bGrid.setAttribute('aria-pressed', 'false');
      render();
    });
  }

  // ── B) 서비스 상세 현장갤러리 피드 ──
  function initServiceFeeds() {
    var feeds = document.querySelectorAll('.svc-gallery-feed[data-tag]');
    if (!feeds.length) return;

    fetch(DATA_URL)
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (d) {
        var items = sortDesc(parseItems(d));
        feeds.forEach(function (el) {
          var tag = el.getAttribute('data-tag');
          var filtered = items.filter(function (i) { return i.tag === tag; }).slice(0, 4);
          if (!filtered.length) {
            el.innerHTML = '<p class="muted" style="text-align:center;padding:20px 0;">등록된 현장 사진이 없습니다.</p>';
            return;
          }
          el.innerHTML = filtered.map(function (i) { return cardHtml(i, true); }).join('');
        });
      })
      .catch(function () {
        feeds.forEach(function (el) {
          el.innerHTML = '<p class="muted" style="text-align:center;padding:20px 0;">현장 갤러리를 불러올 수 없습니다.</p>';
        });
      });
  }

  // ── 실행 ──
  initGalleryPage();
  initServiceFeeds();
})();
