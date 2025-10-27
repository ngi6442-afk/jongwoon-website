// js/include.js

document.addEventListener("DOMContentLoaded", function() {
    // 헤더 삽입 (절대 경로로 수정)
    const headerEl = document.querySelector('header.include-header');
    if (headerEl) {
        fetch('/header.html') // <--- 슬래시(/) 추가
            .then(res => res.ok ? res.text() : Promise.reject('header.html not found'))
            .then(data => headerEl.innerHTML = data)
            .catch(console.error);
    }

    // 푸터 삽입 (절대 경로로 수정)
    const footerEl = document.querySelector('footer.include-footer');
    if (footerEl) {
        fetch('/footer.html') // <--- 슬래시(/) 추가
            .then(res => res.ok ? res.text() : Promise.reject('footer.html not found'))
            .then(data => footerEl.innerHTML = data)
            .catch(console.error);
    }
});