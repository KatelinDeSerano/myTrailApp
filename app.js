// get data for drowdown menus from Battuta API
var countryCode = "us";
var BATTUTA_KEY = "c0d8fe3d683adb01ee5b7d32a56ab767";

// Load start page
function startPage() {
    let html = `
            <div class="startPage">
                <div class="textbox container-fluid">
                    <h1>GET YOUR FIX. DISCOVER ADVENTURE.<h1>
                    <h3>Use the TrailFix app to search any US city for nearby trails!</h3>
                    <form id="startButton">
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
    url = "https://battuta.medunes.net/api/region/" + countryCode + "/all/?key=" + BATTUTA_KEY + "&callback=?";
    let html = `
        <div class="searchPage">
            <nav class="navbar navbar-inverse navbar-fixed-top">
                <div class="container-fluid">
                    <div class="navbar-header">
                        <h4 class="navbar-text">TrailFix</h4>
                    </div>
                </div>
            </nav>
            <form class="search">
                <h1>Select a City and a State: </h1>
                <select id="items" autofocus required >
                    <option>Choose a State</option>
                </select>  
                <select id="cities" autofocus required>
                    <option>Choose a City</option>
                </select>
            </form>
        </div>`
          
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
            "X-Mashape-Key": 'iyDyJdYKg2mshSk2SnqdpH0e9swAp1fYGHvjsn7UtygqsIi9Fv'
        },
        data: {
            lat: latitude,
            lon: longitude,
            radius: 100,
            limit: 10,
        },
        dataType: 'json',
        type: 'GET',
        success: callback
    };
    $.ajax(settings);
    
    let html = `
    <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container-fluid">
            <div class="navbar-header">
            <h4 class="navbar-text">TrailFix</h4>
                <form class="navbar-form navbar-right" id ="backButton">
                    <button class="backButton" type="submit">New Search</button>
                </form>
             </div>
         </div>
    </nav> 
    <div id="map" class="col-md-12"></div>
        <script 
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD5BRSSgrgK8EJ8998mi5CclUx2vjH7Tc0&callback=initialize">
        </script>`

    $("#trailPage").html(html);

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
        google.maps.event.addListener(marker, 'mouseover', (function (marker, i) {
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

function handleBackButton() {
    $("#trailPage").on("submit", "#backButton", function(e) {
        e.preventDefault();
        getStateCityData();
    });
}

startPage();
handleStartButton();
handleBackButton();