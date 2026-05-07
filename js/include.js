// js/include.js

document.addEventListener("DOMContentLoaded", function() {
    var promises = [];

    // 헤더 삽입
    var headerEl = document.querySelector('.include-header');
    if (headerEl) {
        promises.push(
            fetch('/header.html')
                .then(function(res) { return res.ok ? res.text() : Promise.reject('header.html not found'); })
                .then(function(data) { headerEl.innerHTML = data; })
                .catch(console.error)
        );
    }

    // 푸터 삽입
    var footerEl = document.querySelector('.include-footer');
    if (footerEl) {
        promises.push(
            fetch('/footer.html')
                .then(function(res) { return res.ok ? res.text() : Promise.reject('footer.html not found'); })
                .then(function(data) { footerEl.innerHTML = data; })
                .catch(console.error)
        );
    }

    // 모든 include 완료 후 커스텀 이벤트 발행 (A02)
    Promise.all(promises).then(function() {
        document.dispatchEvent(new CustomEvent('includesLoaded'));
    });
});