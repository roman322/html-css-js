function initMap() {
    var myLatLng = {lat: 49.835293, lng: 24.008873};

    var map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 14,
        minZoom: 14,
        maxZoom: 17
    });

    var infoWindow = new google.maps.InfoWindow({
        content: "Я тут живу :)"
    });

    var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(49.7484836, 24.1373796),
        new google.maps.LatLng(49.911466, 23.9141759));

    var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          animation: google.maps.Animation.DROP
    });
    marker.addListener('mouseover', toggleBounce);
    marker.addListener('click', function() {
      infoWindow.open(map, marker);
    });
    
    function toggleBounce() {
       if (marker.getAnimation() !== null) {
         marker.setAnimation(null);
       } else {
         marker.setAnimation(google.maps.Animation.BOUNCE);
       }
     }
}
