function generateBG() {
  var repeat = ['directions_bike','directions_boat','directions_bus','directions_car','directions_railway','directions_run','directions_subway','directions_walk','flight','local_bar','local_cafe','local_car_wash','local_dining','local_drink','local_florist','local_gas_station','local_grocery_store','local_hospital','local_hotel','local_library','local_mall','local_movies','local_offer','local_parking','local_pizza','local_play','local_taxi','restaurant','restaurant_menu','subway','terrain','traffic','train','tram'];

  var output = '';
  for(var i = 0; i < 500; i++) {
    output += '<li><i class="material-icons">'+repeat[Math.floor(Math.random()*repeat.length)]+'</i></li>';
  }
  $('.step_repeat').html(output);
}