// get data for drowdown menus from Battuta API
var countryCode = "us";
var BATTUTA_KEY = "1b568dfcb5d096e0c78327fb27f6e590";
url = "https://battuta.medunes.net/api/region/" + countryCode + "/all/?key=" + BATTUTA_KEY + "&callback=?";



$(".button-collapse").sideNav();
$.getJSON(url, function (states) {
    var option = '';
    for (var i = 0; i < states.length; i++) {
        option += '<option value="' + states[i].region + '">' + states[i].region + '</option>';
    }
    $('#items').append(option);

    $(document).ready(function() {
        $('select').material_select();
      });
});



$('#items').on('change', function () {
    var region = this.value;
    url = "https://battuta.medunes.net/api/city/" + countryCode + "/search/?region=" + region + "&key=" + BATTUTA_KEY + "&callback=?";
    $.getJSON(url, function (city) {
        var option = '';
        $("#cities option").remove();
        for (var i = 0; i < city.length; i++) {
            option += '<option data-latitude="' + city[i].latitude + '" data-longitude="' + city[i].longitude + '">' + city[i].city + '</option>';
        }
        $('#cities').append(option);
        $(document).ready(function() {
            $('select').material_select();
          });
    });
})

$("#cities").on('change', function () {
    var latitude = $(this).find(':selected').data('latitude');
    var longitude = $(this).find(':selected').data('longitude');
    getDataFromTrails(latitude, longitude, displayTrailSearchData);
});

function getDataFromTrails(latitude, longitude, callback) {
    const settings = {
        url: 'https://trailapi-trailapi.p.mashape.com/',
        headers: {
            "X-Mashape-Key": 'Jiv2iCwuWKmshf598IFTnsJC7Va7p15GAbhjsnMVlaeqLJbqru'
        },
        data: {
            lat: latitude,
            lon: longitude,
            radius: 100,
            limit: 2,
        },
        dataType: 'json',
        type: 'GET',
        success: callback
    };
    $.ajax(settings);
}

var map;
var markers = [];
function initialize() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
    });
}

function displayTrailSearchData(data) {
    var arr = data.places
   
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < arr.length; i++) {
        position = new google.maps.LatLng(arr[i].lat, arr[i].lon);
        marker = new google.maps.Marker({
            position: position,
            map: map
        });
        markers.push(marker);
        bounds.extend(position);
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent('<h3>' + arr[i].name + '</h3><h4>' + arr[i].directions + '</h4>');
                infowindow.open(map, marker);
            }
        })(marker, i));
        
    }
    function deleteMarkers() {
        clearMarkers();
        markers = [];
      }

    map.fitBounds(bounds);
    var infowindow = new google.maps.InfoWindow();
    var marker, i;

}


