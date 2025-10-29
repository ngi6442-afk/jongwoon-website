document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('galleryContainer');
  const btnGrid = document.getElementById('btnGrid');
  const btnList = document.getElementById('btnList');
  const tagFilter = document.getElementById('tagFilter');

  let items = [];
  let view = 'grid';
  let tag = '';

  btnGrid?.addEventListener('click', () => setView('grid'));
  btnList?.addEventListener('click', () => setView('list'));
  tagFilter?.addEventListener('change', e => { tag = e.target.value; render(); });

  function setView(v){
    view = v;
    if (container) container.className = (v === 'grid') ? 'grid-view' : 'list-view';
    btnGrid?.classList.toggle('primary', v==='grid');
    btnList?.classList.toggle('primary', v==='list');
    btnGrid?.setAttribute('aria-pressed', String(v==='grid'));
    btnList?.setAttribute('aria-pressed', String(v==='list'));
    render();
  }

  // 데이터 로드
  fetch('/data/gallery.json?nocache=' + Date.now())
    .then(r => r.json())
    .then(json => {
      items = (json && Array.isArray(json.items)) ? json.items : [];
      // 날짜 내림차순
      items.sort((a,b) => (b.date||'').localeCompare(a.date||''));
      render();
    })
    .catch(() => {
      if (container) container.innerHTML = '<p class="muted">데이터를 불러올 수 없습니다.</p>';
    });

  // ---------- [헬퍼] 대표/전체 이미지 ----------
  function getThumb(item){
    // images: [{src, caption}, ...] 우선
    if (Array.isArray(item?.images) && item.images.length > 0) {
      return item.images[0]?.src || '';
    }
    // 단일 image (역호환)
    return item?.image || '';
  }

  function getAllImages(item){
    if (Array.isArray(item?.images) && item.images.length > 0) {
      return item.images.map(i => i?.src).filter(Boolean);
    }
    return item?.image ? [item.image] : [];
  }
  // ---------------------------------------------

  function render(){
    const list = tag ? items.filter(i => i.tag === tag) : items;
    if (!container) return;
    if (view === 'grid') {
      container.innerHTML = list.map(card).join('');
    } else {
      container.innerHTML = `
        <div class="board">
          <div class="board-head">
            <span class="col date">등록일</span>
            <span class="col title">제목</span>
            <span class="col tag">분류</span>
          </div>
          ${list.map(row).join('')}
        </div>`;
    }
  }

  // 카드(앨범형)
  function card(it){
    const thumb = escape(getThumb(it));
    const strip = renderThumbStrip(it);
    return `
      <article class="gallery-card" data-tag="${escape(it.tag||'')}">
        ${thumb ? `<a href="${thumb}" target="_blank" rel="noopener">
          <img src="${thumb}" alt="${escape(it.title||'')}" loading="lazy">
        </a>` : `<div class="noimage" aria-label="이미지 없음"></div>`}
        <div class="info">
          <h3 class="tit">${escape(it.title||'')}</h3>
          <p class="meta"><span>${escape(it.tag||'')}</span> · <span>${escape(it.date||'')}</span></p>
          ${it.description ? `<p class="desc">${escape(it.description)}</p>` : ''}
          ${strip}
        </div>
      </article>`;
  }

  // 리스트(게시판형)
  function row(it){
    const href = escape(getThumb(it) || '#');
    return `
      <a class="board-row" href="${href}" target="_blank" rel="noopener">
        <span class="col date">${escape(it.date||'')}</span>
        <span class="col title">${escape(it.title||'')}</span>
        <span class="col tag">${escape(it.tag||'')}</span>
      </a>`;
  }

  // 추가 이미지 썸네일 스트립
  function renderThumbStrip(it){
    const imgs = getAllImages(it);
    if (imgs.length <= 1) return '';
    const thumbs = imgs.slice(0,6).map(src => `
      <a class="mini" href="${escape(src)}" target="_blank" rel="noopener">
        <img src="${escape(src)}" alt="" loading="lazy">
      </a>`).join('');
    return `<div class="thumb-strip" aria-label="추가 이미지">${thumbs}</div>`;
  }

  function escape(s){
    return String(s||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
});
