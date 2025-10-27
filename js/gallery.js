document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('galleryContainer');
  const btnGrid = document.getElementById('btnGrid');
  const btnList = document.getElementById('btnList');
  const tagFilter = document.getElementById('tagFilter');

  let items = [];      // 전체 데이터
  let currentView = 'grid'; // 'grid' | 'list'
  let currentTag = ''; // 필터 태그

  // 뷰 전환
  function setView(view) {
    currentView = view;
    if (view === 'grid') {
      container.className = 'grid-view';
      btnGrid.classList.add('primary'); btnGrid.setAttribute('aria-pressed', 'true');
      btnList.classList.remove('primary'); btnList.setAttribute('aria-pressed', 'false');
    } else {
      container.className = 'list-view';
      btnList.classList.add('primary'); btnList.setAttribute('aria-pressed', 'true');
      btnGrid.classList.remove('primary'); btnGrid.setAttribute('aria-pressed', 'false');
    }
    render();
  }

  btnGrid.addEventListener('click', () => setView('grid'));
  btnList.addEventListener('click', () => setView('list'));

  // 필터
  tagFilter.addEventListener('change', (e) => {
    currentTag = e.target.value;
    render();
  });

  // 데이터 로드
  fetch('/data/gallery.json')
    .then(res => res.json())
    .then(data => { items = data || []; render(); })
    .catch(err => { console.error('갤러리 로드 오류:', err); container.innerHTML = '<p class="muted">데이터를 불러올 수 없습니다.</p>'; });

  function render() {
    const filtered = currentTag ? items.filter(i => i.tag === currentTag) : items;

    if (currentView === 'grid') {
      container.innerHTML = filtered.map(toGridCard).join('');
    } else {
      container.innerHTML = `
        <div class="board">
          <div class="board-head">
            <span class="col date">등록일</span>
            <span class="col title">제목</span>
            <span class="col tag">분류</span>
          </div>
          ${filtered.map(toBoardRow).join('')}
        </div>
      `;
    }
  }

  function toGridCard(item) {
    return `
      <article class="gallery-card" data-tag="${item.tag}">
        <a href="${item.image}" class="no-lightbox" target="_blank" rel="noopener">
          <img src="${item.image}" alt="${escapeHtml(item.title)}">
        </a>
        <div class="info">
          <h3 class="tit">${escapeHtml(item.title)}</h3>
          <p class="meta"><span>${escapeHtml(item.tag)}</span> · <span>${escapeHtml(item.date)}</span></p>
          ${item.description ? `<p class="desc">${escapeHtml(item.description)}</p>` : ''}
        </div>
      </article>
    `;
  }

  function toBoardRow(item) {
    return `
      <a class="board-row" href="${item.image}" target="_blank" rel="noopener">
        <span class="col date">${escapeHtml(item.date)}</span>
        <span class="col title">${escapeHtml(item.title)}</span>
        <span class="col tag">${escapeHtml(item.tag)}</span>
      </a>
    `;
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }
});
