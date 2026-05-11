// js/location-map.js
// 카카오맵 JavaScript API — 주소 기반 마커 (autoload=false + services)

(function () {
  var mapEl = document.getElementById('map');
  if (!mapEl) return;

  var ADDRESS = '경상북도 포항시 남구 서원재로 1';
  var FALLBACK_LAT = 35.9784;
  var FALLBACK_LNG = 129.3636;
  var INFO_CONTENT = '<div style="padding:8px 12px;font-size:13px;line-height:1.4;white-space:nowrap;">'
    + '<b>유한회사 종운환경</b><br>'
    + '경북 포항시 남구 서원재로 1'
    + '</div>';
  var FALLBACK_HTML = '<p style="text-align:center;color:var(--muted);padding:20px 0;">'
    + '지도 정보를 불러오지 못했습니다.<br>'
    + '아래 네이버 지도 또는 카카오맵 링크를 이용해주세요.</p>';

  // SDK 확인
  if (typeof kakao === 'undefined' || !kakao.maps) {
    console.warn('[location-map] 카카오맵 SDK 미로드');
    mapEl.innerHTML = FALLBACK_HTML;
    return;
  }

  if (typeof kakao.maps.load !== 'function') {
    console.warn('[location-map] kakao.maps.load 없음');
    mapEl.innerHTML = FALLBACK_HTML;
    return;
  }

  kakao.maps.load(function () {
    try {
      // 1) 지도 생성 (fallback 좌표 기반 초기 중심)
      var fallbackCenter = new kakao.maps.LatLng(FALLBACK_LAT, FALLBACK_LNG);

      mapEl.innerHTML = '';
      mapEl.style.display = 'block';

      var map = new kakao.maps.Map(mapEl, {
        center: fallbackCenter,
        level: 3
      });

      map.relayout();

      // 2) Geocoder로 정확한 좌표 검색
      if (kakao.maps.services && kakao.maps.services.Geocoder) {
        var geocoder = new kakao.maps.services.Geocoder();

        geocoder.addressSearch(ADDRESS, function (result, status) {
          var coords;

          if (status === kakao.maps.services.Status.OK && result.length > 0) {
            coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          } else {
            console.warn('[location-map] 주소 검색 실패, fallback 좌표 사용');
            coords = fallbackCenter;
          }

          // 지도 중심 이동
          map.setCenter(coords);

          // 마커
          var marker = new kakao.maps.Marker({
            position: coords,
            map: map
          });

          // 인포윈도우
          var infowindow = new kakao.maps.InfoWindow({
            content: INFO_CONTENT,
            removable: true
          });

          infowindow.open(map, marker);

          kakao.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
          });
        });

      } else {
        // services 라이브러리 미로드 — fallback 좌표로 직접 마커
        console.warn('[location-map] services 라이브러리 없음, fallback 좌표 사용');
        var marker = new kakao.maps.Marker({ position: fallbackCenter, map: map });
        var infowindow = new kakao.maps.InfoWindow({ content: INFO_CONTENT, removable: true });
        infowindow.open(map, marker);
        kakao.maps.event.addListener(marker, 'click', function () { infowindow.open(map, marker); });
      }

    } catch (e) {
      console.error('[location-map] 지도 초기화 실패:', e);
      mapEl.innerHTML = FALLBACK_HTML;
    }
  });
})();
