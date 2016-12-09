function generateHistory(q,l,latlng) {
  if(l == 0) {
    if(latlng) {
      var url = 'https://personalizer-server-beta.otenv.com/v1/personalize?q='+q+'&debug=true&maxResults=50&sortBy=best&locQ='+latlng+'&locU='+latlng+'&radius=50';  
    } else {
      var url = 'https://personalizer-server-beta.otenv.com/v1/personalize?q='+q+'&debug=true&maxResults=50&sortBy=best&locQ=37.7576948,-122.4726193&locU=37.7576948,-122.4726193&radius=50';  
    }
  } else if(l == 1) {
    var url = 'https://personalizer-server-beta.otenv.com/v1/personalize?q=&debug=true&maxResults=50&sortBy=best&areaQ='+q+'&radius=50';
  } else {
    var url = 'https://personalizer-server-beta.otenv.com/v1/personalize?q=&debug=true&maxResults=50&sortBy=best&locQ=37.7576948,-122.4726193&locU=37.7576948,-122.4726193&radius=50';
  }
  $.getJSON(url, function(data) {
    var d = data.results;
    for(var i = 0; i < d.length; i++) {
      var dl = d[i].location;
      if(dl.name) {
        var name = dl.name;
      } else {
      	var locale = dl.locale;
        var name = dl.names[locale];
      }
      var rid = dl.id;
      $('ul.history').html($('ul.history').html() + getResult(name, rid));
    }

    function getResult(n,rid){
      var output = '<li class="past">';
      output += '<div class="history_image" style="background: url('+getImg(rid)+') center center no-repeat; background-size: cover;"></div>';
      output += '<ul class="history_info">';
      output += '<li class="history_rest_name">'+n+'</li>';
      output += '<li class="history_row"><i class="ion-android-person"></i><span>'+getParty()+'</span></li>';
      output += '<li class="history_row"><i class="ion-android-calendar"></i><span>'+getDate()+'</span></li>';
      output += '<li class="history_points">'+getPoints()+'</li>';
      output += '</ul>';
      output += '<ul class="actions">';
      if(Math.random() > 0.2) {
        output += '<li id="reviewed">View review - <span><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></li></span>';
      } else {
        output += '<li id="needs_review">Write a review</li>';
      }
      output += '</ul>';
      output += '</li>';

      return output;
    }

    function getImg(rid) {
      return 'https://www.opentable.com/img/restimages/' + rid + '.jpg';
    }
    
    function getParty() {
    	var p = Math.floor(Math.random()*5)+1;
      if(p > 1) {
      	return 'Table for ' + p + ' people';
      } else {
      	return 'Table for ' + p + ' person';
      }
    }
    
    function getDate() {
    	var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var ampm = ['AM','PM'];
      var min = ['00','15','30','45'];
      return days[Math.floor(Math.random()*days.length)] + ', ' + month[Math.floor(Math.random()*month.length)] + ' ' + Math.floor(Math.random()*30) + ' at ' + (Math.floor(Math.random()*12)+1) + ':' + min[Math.floor(Math.random()*min.length)] + ' ' + ampm[Math.floor(Math.random()*ampm.length)];
    }
    
    function getPoints() {
    	var points = [0,500,1000];
      var temp = Math.random();
      if(temp > 0.5) {
      	return '<div><i class="fa fa-diamond"></i><p>+100 pts</p></div>';
      } else if(temp > 0.1) {
      	return '<div><i class="fa fa-diamond"></i><p>+'+points[Math.floor(Math.random()*points.length)]+' pts</p></div>';
      } else {
      	return '<div class="history_access"><i class="fa fa-diamond"></i><p>-750 pts</p></div>';
      }
    }
    
  });
}