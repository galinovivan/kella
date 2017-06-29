function initMap() {
    var latitude = 59.965025,
        longitude = 30.278920,
        map_zoom = 17;
    var style = [{
        featureType: 'all',
        stylers: [
            {saturation: -100}]
    },{featureType: 'water',
        skylers: [
            {saturation: 1}]}];
    var map_options = {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: map_zoom,
        panControl: false,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: true,
        styles: style
    }
    var map = new google.maps.Map(document.getElementById('map'), map_options);
    var image = 'wp-content/themes/kella/assets/img/map_marker.png';
    var beachMarker = new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        map: map,
        icon: image,
    });
}
