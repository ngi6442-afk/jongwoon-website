// js/location-map.js
// 카카오맵 JavaScript API 기반 지도 렌더러
// 종운환경 오시는 길 전용

(function () {
  var mapEl = document.getElementById('map');
  if (!mapEl) return;

  // SDK 로드 실패 또는 API key 미설정 시 fallback
  if (typeof kakao === 'undefined' || !kakao.maps) {
    mapEl.innerHTML = '<p style="text-align:center;color:var(--muted);padding:20px 0;">'
      + '지도 정보를 불러오지 못했습니다.<br>'
      + '아래 네이버 지도 또는 카카오맵 링크를 이용해주세요.</p>';
    return;
  }

  // 종운환경 좌표 (경북 포항시 남구 서원재로 1)
  var LAT = 35.9784;
  var LNG = 129.3636;

  var container = mapEl;
  var options = {
    center: new kakao.maps.LatLng(LAT, LNG),
    level: 3
  };

  // 기존 placeholder 텍스트 제거
  container.innerHTML = '';
  container.style.display = 'block';

  var map = new kakao.maps.Map(container, options);

  // 마커
  var markerPosition = new kakao.maps.LatLng(LAT, LNG);
  var marker = new kakao.maps.Marker({
    position: markerPosition,
    map: map
  });

  // 인포윈도우
  var infoContent = '<div style="padding:8px 12px;font-size:13px;line-height:1.4;white-space:nowrap;">'
    + '<b>유한회사 종운환경</b><br>'
    + '경북 포항시 남구 서원재로 1'
    + '</div>';

  var infowindow = new kakao.maps.InfoWindow({
    content: infoContent,
    removable: true
  });

  infowindow.open(map, marker);

  // 마커 클릭 시 인포윈도우 토글
  kakao.maps.event.addListener(marker, 'click', function () {
    infowindow.open(map, marker);
  });
})();
