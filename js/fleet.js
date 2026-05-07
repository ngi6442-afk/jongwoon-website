document.addEventListener('DOMContentLoaded', () => {
  const el = id => document.getElementById(el);
  const box = el('fleetContainer');
  const fType  = el('fType');
  const fUsage = el('fUsage');
  const fTon   = el('fTon');
  const fDepot = el('fDepot');
  const sortBy = el('sortBy');

  let items = [];

  fetch('/data/fleet.json?nocache=' + Date.now())
    .then(r => r.json())
    .then(j => { items = Array.isArray(j.items) ? j.items : []; render(); })
    .catch(() => box.innerHTML = '<p class="muted">데이터를 불러올 수 없습니다.</p>');

  [fType, fUsage, fTon, fDepot, sortBy].forEach(s => s.addEventListener('change', render));

  function render(){
    let list = items.slice();

    if (fType.value)  list = list.filter(x => x.type  === fType.value);
    if (fUsage.value) list = list.filter(x => x.usage === fUsage.value);
    if (fTon.value)   list = list.filter(x => toBucket(x.ton) === fTon.value);
    if (fDepot.value) list = list.filter(x => x.depot === fDepot.value);

    if (sortBy.value === 'ton')   list.sort((a,b) => (b.ton||0)-(a.ton||0));
    else                          list.sort((a,b) => (b.reg_date||'').localeCompare(a.reg_date||''));

    box.innerHTML = list.map(card).join('') || '<p class="muted">표시할 항목이 없습니다.</p>';
  }

  function toBucket(ton){
    if (!ton) return '';
    if (ton >= 25) return '25t+';
    if (ton >= 11) return '11t';
    if (ton >= 5)  return '5t';
    if (ton >= 2.5) return '2.5t';
    return '1t';
  }

  function card(it){
    return `
      <article class="card fleet" data-type="${esc(it.type)}" data-usage="${esc(it.usage)}">
        <div class="thumb">${it.image ? `<img src="${esc(it.image)}" alt="${esc(it.name||'장비')}" loading="lazy">` : ''}</div>
        <div class="info">
          <h3 class="tit">${esc(it.name||'무명')} <small>${esc(it.model||'')}</small></h3>
          <p class="meta">
            <span>${esc(it.usage||'-')}</span> ·
            <span>${esc(it.depot||'-')}</span> ·
            <span>${it.ton ? `${it.ton}t` : '-'}</span> ·
            <span>${esc(it.reg_date||'')}</span>
          </p>
          ${it.plate ? `<p class="sub">차량번호: ${esc(it.plate)}</p>` : ''}
          ${renderSpec(it.spec)}
        </div>
      </article>`;
  }

  function renderSpec(arr){
    if (!Array.isArray(arr) || arr.length === 0) return '';
    return `<ul class="spec">${arr.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`;
  }

  function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;' }[m]));}
});
