<script>
  // 메뉴 클릭 이벤트 → GA4로 전송
  document.addEventListener('DOMContentLoaded', function () {
    var links = document.querySelectorAll('nav.main a');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.gtag) {
          gtag('event', 'nav_click', {
            label: link.textContent.trim(),         // 예: "서비스"
            href: link.getAttribute('href') || ''   // 예: "services.html"
          });
        }
      });
    });
  });
</script>
</body>
