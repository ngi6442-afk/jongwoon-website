// js/location-map.js
// 카카오맵 JavaScript API 기반 지도 렌더러 (autoload=false 대응)

(function () {
  var mapEl = document.getElementById('map');
  if (!mapEl) return;

  var FALLBACK_HTML = '<p style="text-align:center;color:var(--muted);padding:20px 0;">'
    + '지도 정보를 불러오지 못했습니다.<br>'
    + '아래 네이버 지도 또는 카카오맵 링크를 이용해주세요.</p>';

  // SDK 미로드 확인
  if (typeof kakao === 'undefined' || !kakao.maps) {
    console.warn('[location-map] 카카오맵 SDK 미로드');
    mapEl.innerHTML = FALLBACK_HTML;
    return;
  }

  // kakao.maps.load 존재 확인 (autoload=false 사용 시 필수)
  if (typeof kakao.maps.load !== 'function') {
    console.warn('[location-map] kakao.maps.load 없음');
    mapEl.innerHTML = FALLBACK_HTML;
    return;
  }

  kakao.maps.load(function () {
    try {
      var LAT = 35.9784;
      var LNG = 129.3636;
      var center = new kakao.maps.LatLng(LAT, LNG);

      // placeholder 텍스트 제거 + display 보정
      mapEl.innerHTML = '';
      mapEl.style.display = 'block';

      var map = new kakao.maps.Map(mapEl, {
        center: center,
        level: 3
      });

      // 컨테이너 크기 반영
      map.relayout();
      map.setCenter(center);

      // 마커
      var marker = new kakao.maps.Marker({
        position: center,
        map: map
      });

      // 인포윈도우
      var infowindow = new kakao.maps.InfoWindow({
        content: '<div style="padding:8px 12px;font-size:13px;line-height:1.4;white-space:nowrap;">'
          + '<b>유한회사 종운환경</b><br>'
          + '경북 포항시 남구 서원재로 1'
          + '</div>',
        removable: true
      });

      infowindow.open(map, marker);

      kakao.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
      });

    } catch (e) {
      console.error('[location-map] 지도 초기화 실패:', e);
      mapEl.innerHTML = FALLBACK_HTML;
    }
  });
})();
