document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const ADMIN_PASSWORD = 'jwadmin2025'; // 초기 비밀번호 (테스트용)

  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('adminPass').value.trim();
    if (input === ADMIN_PASSWORD) {
      localStorage.setItem('jw_auth', 'ok');
      alert('로그인 성공');
      location.href = '/admin/gallery-manage.html';
    } else {
      alert('비밀번호가 올바르지 않습니다.');
    }
  });
});
