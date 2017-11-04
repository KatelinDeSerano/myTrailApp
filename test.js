// get data for drowdown menus from Battuta API
var countryCode = "us";
var BATTUTA_KEY = "c0d8fe3d683adb01ee5b7d32a56ab767";
url = "https://battuta.medunes.net/api/region/" + countryCode + "/all/?key=" + BATTUTA_KEY + "&callback=?";

function startPage() {
	let html = `
            <div id="startPage">
            <div class="textbox container-fluid">
                <h2>GET YOUR FIX. DISCOVER ADVENTURE.<h2>
                <h3>Use the TrailFix app to search any US city for nearby trails!</h3>
                <form id ="startButton">
                    <button class="button" type="submit">GET GOING <i class="fa fa-long-arrow-right" aria-hidden="true"></i></button>
                </form>
            </div>
                </div>`

	$("#trailPage").html(html);
}

function handleStartButton() {
	$("#trailPage").on("submit", "#startButton", function(e) {
	 	e.preventDefault();
	 	getStateCityData();
	});
}

// Get data from Battuta API for State and Cities
function getStateCityData() {
    
    let html = `
           <nav class="navbar navbar-inverse navbar-fixed-top">
           <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand" href="#">TrailFix</a>
            </div>
            <p class="navbar-text">Select a City and a State: </p>
           
                <select id="items" >
                    <option>Choose a State</option>
                </select>  
                <select id="cities">
                    <option>Choose a City</option>
                </select>
            </form>
            </div>
            <div id="map" class="col-md-12"></div>
                <script 
                    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD5BRSSgrgK8EJ8998mi5CclUx2vjH7Tc0&callback=initialize">
                </script>`
          
    $("#trailPage").html(html);

    $.getJSON(url, function(states) {
        var option = '';
        for (var i = 0; i < states.length; i++) {
            option += '<option value="' + states[i].region + '">' + states[i].region + '</option>';
        }
        $('#items').append(option);
    });

    $('#items').on('change', function () {
        document.getElementById('cities').style.display='block';
        var region = this.value;
        url = "https://battuta.medunes.net/api/city/" + countryCode + "/search/?region=" + region + "&key=" + BATTUTA_KEY + "&callback=?";
        $.getJSON(url, function (city) {
            var option = '';
            $("#cities option").remove();
            for (var i = 0; i < city.length; i++) {
                option += '<option data-latitude="' + city[i].latitude + '" data-longitude="' + city[i].longitude + '">' + city[i].city + '</option>';
            }
            
            $('#cities').append(option);
        });
    });
    // get Latitude and Longitude from selected city
    $("#cities").on('change', function () {
        var latitude = $(this).find(':selected').data('latitude');
        var longitude = $(this).find(':selected').data('longitude');
        getDataFromTrails(latitude, longitude, displayTrailSearchData);
    });
}

// Pass Latitude and Longitude from selected city to get data from TrailsAPI
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
    // if results are null or failure,  do some code to render an error screen
}
// Initialize map
var map;
var markers = [];
function initialize() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644  },
        zoom: 8
    });
}
// Pass Latitude and Longitude into Google Maps API to render map, markers, and info windows.
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
                infowindow.setContent('<h4>' + arr[i].name + '</h4><p>' + arr[i].directions+ '</p>');
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

startPage();
handleStartButton();
