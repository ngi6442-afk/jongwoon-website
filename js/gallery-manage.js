document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('jw_auth') !== 'ok') {
    alert('로그인이 필요합니다.');
    location.href = '/admin/login.html';
    return;
  }

  const area = document.getElementById('adminArea');
  let items = JSON.parse(localStorage.getItem('galleryData') || '[]');

  render();

  function render() {
    area.innerHTML = `
      <form id="addForm">
        <label>제목 <input name="title" required></label><br>
        <label>날짜 <input name="date" type="date" required></label><br>
        <label>태그 <input name="tag" required></label><br>
        <label>이미지경로 <input name="image" required></label><br>
        <label>설명 <textarea name="description" rows="2"></textarea></label><br>
        <button class="btn primary" type="submit">추가</button>
      </form>
      <hr>
      <h3>등록된 항목</h3>
      <ul class="list">
        ${items.map((it,i)=>`<li>${it.date} - ${it.title} (${it.tag}) 
          <button data-i="${i}" class="btn small danger delBtn">삭제</button></li>`).join('')}
      </ul>
    `;
    document.getElementById('addForm').addEventListener('submit', add);
    area.querySelectorAll('.delBtn').forEach(btn => btn.addEventListener('click', del));
  }

  function add(e){
    e.preventDefault();
    const f = e.target;
    const item = Object.fromEntries(new FormData(f));
    items.push(item);
    localStorage.setItem('galleryData', JSON.stringify(items));
    render();
  }

  function del(e){
    const i = e.target.dataset.i;
    items.splice(i,1);
    localStorage.setItem('galleryData', JSON.stringify(items));
    render();
  }
});
