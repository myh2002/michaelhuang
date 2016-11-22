function generateResults(q,l,latlng, domain) {
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
    var ref_cuisines = data.facets.types;
  	var d = data.results;
    console.log(url, data);
    var output = '';
    for(var i = 0; i < d.length; i++) {
    	var dl = d[i].location;
      //console.log(dl);
      if (dl.name) {
        var name = dl.name;
      } else {
        var locale = dl.locale;
        var name = dl.names[locale];
      }
      // var locale = dl.locale;
      // var name = dl.names[locale];
      // var name = dl.name;
      var hood = (dl.address.neighborhood ? dl.address.neighborhood : dl.address.city);
      var price = dl.price;
      var rating = Math.floor(dl.avgAllTimeRating * 100)/100;
      var ratingCount = dl.ratingCount;
      var cuisine = dl.types[0];
      var rid = dl.id;
      output += getResult(name, hood, price, rating, ratingCount, cuisine, rid);
      //console.log(output);
    }
    
    //$('.results').html(output);
    //console.log(output);

    //return output;

    function getResult(n,h,p,r,rc,c,rid){
      var output = '<li class="result">';
      output += '<div class="image" style="background: url('+getImg(rid, domain)+') center center no-repeat; background-size: cover;"></div>';
      output += '<ul class="info">';
      output += '<li class="rest_name">'+n+'</li>';
      output += '<li class="row"><div>'+getRating(r, rc)+'</div><div></div></li>';
      output += '<li class="row"><div>'+getCuisine(c)+'</div><div>'+getPrice(p)+'</div></li>';
      output += '<li class="row"><div>'+hood+'</div><div><i class="ion-android-pin"></i> 0.9mi</div></li>';
      output += '<li class="row"><ul class="times">'+getTimes()+'</ul></li>';
      output += '</ul>';
      output += '<ul class="times tablet none">'+getTimes()+'</ul>'
      output += '</li>';
      
      return output;
    }


    function getImg(rid,domain) {
      if(domain) {
        if(domain == 0) {
          return 'https://www.opentable.com/img/restimages/' + rid + '.jpg'; //US + Global
        } else if(domain == 1) {
          return 'https://www.opentable.co.uk/img/restimages/' + rid + '.jpg'; //UK
        } else if(domain == 2) {
          return 'https://www.opentable.jp/img/restimages/' + rid + '.jpg'; //JP
        } else if(domain == 3) {
          return 'https://www.opentable.de/img/restimages/' + rid + '.jpg'; //DE
        }
      } else {
        return 'https://www.opentable.com/img/restimages/' + rid + '.jpg';
      }
    }

    function getRating(r, rc){
      var output = '';
      for(var i = 0; i < Math.floor(r); i++) {
        output += '<i class="fa fa-star rating"></i>';
      }
      if(r > Math.floor(r)) {
        output += '<i class="fa fa-star-half-o rating"></i>';
      }
      output += '<span>';
      for(var j = 5; j > Math.ceil(r); j--) {
        output += '<i class="fa fa-star-o rating"></i>';
      }
      output += ' '+rc+' ratings</span>';
      return output;
    }

    function getPrice(p){
      var output = '';
      for(var i = 0; i < p; i++){
        output += '$';
      }
      output += '<span>';
      for(var j = 4; j > p; j--) {
        output += '$';
      }
      output += '</span>';
      return output;
    }

    function getCuisine(c){
      var output = '';
      for(var i = 0; i < ref_cuisines.length; i++) {
        //console.log(c, lookup[i].id, lookup[i].name);
        if(ref_cuisines[i].id == c) {
          output = ref_cuisines[i].name;
        }
      }
      return output;
    }
    
  	getTimes();
    
    function getTimes(){
    	var times = ['111','101','110','100','011','001','010'];
      var avail = Math.floor(Math.random()*times.length);
      var slots = ['<div>6:30PM</div>','<div>7:00PM</div>','<div>7:30PM</div>'];
      var slots_pop = ['<div>6:30PM</div><div class="pop">+ 1,000pts</div>','<div>7:00PM</div><div class="pop">+ 1,000pts</div>','<div>7:30PM</div><div class="pop">+ 1,000pts</div>'];
      var slots_types = [slots,slots_pop];
      var output = '';
      for(var i = 0; i < 3; i++) {
        if(Math.random() > 0.8) {
          var temp = slots_pop;
        } else {
          var temp = slots;
        }
        //var temp = slots_types[Math.floor(Math.random()*slots_types.length)];
      	if(times[avail][i] == 1) {
        	output += '<li>'+temp[i]+'</li>';
        } else {
        	output += '<li class="unavail">'+slots[i]+'</li>';
        }
      }
      //console.log(output);
      return output;
    }

    $('.results').html(output);
    $('.result').on('click', function(){
        $('.result').toggleClass('alt');
    })
    return output; 
  });
}
