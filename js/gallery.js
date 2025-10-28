document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('galleryContainer');
  const btnGrid = document.getElementById('btnGrid');
  const btnList = document.getElementById('btnList');
  const tagFilter = document.getElementById('tagFilter');

  let items = [];
  let view = 'grid';
  let tag = '';

  btnGrid.addEventListener('click', () => setView('grid'));
  btnList.addEventListener('click', () => setView('list'));
  tagFilter.addEventListener('change', e => { tag = e.target.value; render(); });

  function setView(v){
    view = v;
    container.className = (v === 'grid') ? 'grid-view' : 'list-view';
    btnGrid.classList.toggle('primary', v==='grid');
    btnList.classList.toggle('primary', v==='list');
    btnGrid.setAttribute('aria-pressed', String(v==='grid'));
    btnList.setAttribute('aria-pressed', String(v==='list'));
    render();
  }

  fetch('/data/gallery.json?nocache=' + Date.now())
    .then(r => r.json())
    .then(json => {
      items = (json && Array.isArray(json.items)) ? json.items : [];
      // 날짜 내림차순 정렬
      items.sort((a,b) => (b.date||'').localeCompare(a.date||''));
      render();
    })
    .catch(() => container.innerHTML = '<p class="muted">데이터를 불러올 수 없습니다.</p>');

  function render(){
    const list = tag ? items.filter(i => i.tag === tag) : items;
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

  function card(it){
    return `
      <article class="gallery-card" data-tag="${escape(it.tag||'')}">
        <a href="${escape(it.image||'')}" target="_blank" rel="noopener">
          <img src="${escape(it.image||'')}" alt="${escape(it.title||'')}" loading="lazy">
        </a>
        <div class="info">
          <h3 class="tit">${escape(it.title||'')}</h3>
          <p class="meta"><span>${escape(it.tag||'')}</span> · <span>${escape(it.date||'')}</span></p>
          ${it.description ? `<p class="desc">${escape(it.description)}</p>` : ''}
        </div>
      </article>`;
  }

  function row(it){
    return `
      <a class="board-row" href="${escape(it.image||'')}" target="_blank" rel="noopener">
        <span class="col date">${escape(it.date||'')}</span>
        <span class="col title">${escape(it.title||'')}</span>
        <span class="col tag">${escape(it.tag||'')}</span>
      </a>`;
  }

  function escape(s){
    return String(s||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
});
