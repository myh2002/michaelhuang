window.onload = function() {
  var styles = [{ "featureType": "water", "stylers": [{ "visibility": "on" }, { "color": "#acbcc9" }] }, { "featureType": "landscape", "stylers": [{ "color": "#f2e5d4" }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#c5c6c6" }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#e4d7c6" }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#fbfaf7" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#c5dac6" }] }, { "featureType": "administrative", "stylers": [{ "visibility": "on" }, { "lightness": 33 }] }, { "featureType": "road" }, { "featureType": "poi.park", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "lightness": 20 }] }, {}, { "featureType": "road", "stylers": [{ "lightness": 20 }] }];

  var myOptions = {
    zoom: 4,
    center: new google.maps.LatLng(38.2240689, -89.4247656),
    disableDefaultUI: false,
    mapTypeId: 'roadmap',
    scrollwheel: true,
    navigationControl: true,
    mapTypeControl: true,
    scaleControl: true,
    draggable: true,
    styles: styles
  }

  var map = new google.maps.Map($('.map')[0], myOptions);

  var clickMarkers = [];
  var paths = [];

  map.addListener('mousemove', function(event) {
    var marker = new google.maps.Marker({position: event.latLng});
    clickMarkers.push(marker);
    setOnMap(map);
  });

  var b = 1;

  $('.material-icons').on('click', function(){
      $(this).toggleClass('active');
      b = (b+1)%2;
      if(b%2 == 0) {
        setOnMap(map, restaurants);
      } else {
        removeMarkers(map, restaurants);
      }
  })


  function setOnMap(map,m) {
    var icon = 'https://storage.googleapis.com/support-kms-prod/SNP_2752068_en_v0';
    var icon_red = 'https://storage.googleapis.com/support-kms-prod/SNP_2752125_en_v0';
    if(m) {
      for (var i = 0; i < m.length; i++) {
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(m[i][1],m[i][2]),
            zIndex: 5
          });

          if(m == metros) {
            marker.setIcon(icon_red);
          } else if(m == restaurants) {
            marker.setIcon(icon);
          }

          m[i].push(marker);
          marker.setMap(map);
      } 
    } else {
      if(clickMarkers.length > 1) {
        var temp = clickMarkers.pop();
        temp.setMap(map);
        clickMarkers[0].setMap(null);
        clickMarkers = [];
        clickMarkers.push(temp);
      } else {
        var temp = clickMarkers[0];
        temp.setMap(map);
      }

      var closestPath = [
        temp.getPosition(),
        calcDistance(temp.getPosition())
      ];

      var line = new google.maps.Polyline({
        path: closestPath,
        strokeColor: "#000",
        strokeOpacity: 0.75,
        strokeWeight: 2
      });

      paths.push(line);

      if(paths.length > 1) {
        var foo = paths.pop();
        foo.setMap(map);
        paths[0].setMap(null);
        paths = [];
        paths.push(foo);
      } else {
        var foo = paths[0];
        foo.setMap(map);
      }
    }
  }


  setOnMap(map,metros);
  generateStrength(map);
  //setOnMap(map,restaurants);
};

function generateStrength(map) {
  for(var i = 0; i < metros.length; i++) {
    var influence = new google.maps.Circle({
      strokeColor: '#DA3743',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#DA3743',
      fillOpacity: 0.35,
      center: new google.maps.LatLng(metros[i][1],metros[i][2]),
      radius: metros[i][3]*50,
      map: map
    });

  }
  
}

function removeMarkers(map,m) {
  for(var i = 0; i < m.length; i++) {
    console.log(m[i][5]);
    m[i][5].setMap(null);
  }
}

function calcDistance(x) {
  //var paths = [];
  var metro = metros[0][0];
  var d = metros[0][5];
  var temp2 = google.maps.geometry.spherical.computeDistanceBetween(x,d.getPosition());

  for(var i = 1; i < metros.length; i++) {
    var temp = google.maps.geometry.spherical.computeDistanceBetween(x,metros[i][5].getPosition());
    if(temp < temp2) {
      d = metros[i][5];
      metro = metros[i][0];
      temp2 = google.maps.geometry.spherical.computeDistanceBetween(x,d.getPosition());
    }
  }
  console.log(metro);
  return d.getPosition();
}



