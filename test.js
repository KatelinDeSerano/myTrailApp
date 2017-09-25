let countryCode = "us";
let BATTUTA_KEY="1b568dfcb5d096e0c78327fb27f6e590";
url = "https://battuta.medunes.net/api/region/"+countryCode+"/all/?key="+BATTUTA_KEY+"&callback=?";
console.log(url);
$.getJSON(url,function(region) {
    //console.log(region);
    var state = region;
    var option = '';
    for (var i=0;i<state.length;i++){
       option += '<option value="'+ state[i].region + '">' + state[i].region + '</option>';
    }
    $('#items').append(option);
});

$('#items').on('change', function() {
    let region = this.value;

    url="https://battuta.medunes.net/api/city/"+countryCode+"/search/?region="+region+"&key="+BATTUTA_KEY+"&callback=?";
    $.getJSON(url,function(city) {
        var option = '';
        for (var i=0;i<city.length;i++){
           option += '<option data-latitude="'+city[i].latitude+'" data-longitude="'+city[i].longitude+'">' + city[i].city + '</option>';
        }
        $('#cities').append(option);
    });
  })

$("#cities").change(function () {
    let latitude = $(this).find(':selected').data('latitude');
    let longitude = $(this).find(':selected').data('longitude');
    console.log(latitude);
    console.log(longitude);
    getDataFromTrails(latitude,longitude,displayTrailSearchData);
});

function getDataFromTrails(latitude, longitude, callback) {
    const settings = {
      url: 'https://trailapi-trailapi.p.mashape.com/',
      headers: {
        "X-Mashape-Key":'Jiv2iCwuWKmshf598IFTnsJC7Va7p15GAbhjsnMVlaeqLJbqru'
      },
      data: {
        lat: latitude,
        lon: longitude,
        radius: 100,
        limit: 5,
      },
      dataType: 'json',
      type: 'GET',
      success: callback
    };
    $.ajax(settings);
  }
  
function displayTrailSearchData(data){
    console.log(data);
}