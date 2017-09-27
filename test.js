// get data for drowdown menus from Battuta API
var countryCode = "us";
var BATTUTA_KEY = "20d543e656b7fe6818101f7fefa26d66";
url = "https://battuta.medunes.net/api/region/" + countryCode + "/all/?key=" + BATTUTA_KEY + "&callback=?";

function startPage() {
	let html = 
			`<div id="startPage">
            <h2>Find Your Trail<h2><br>
            <h3>Search any US city for nearby trails and go on your next adventure!</h3>
			<form id ="startButton">
			<button class="btn btn-lg btn-default" type="submit">Let's go!</button>
			</form>
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
    // init side navbar
    $(".button-collapse").sideNav();
    let html = `<div id="slide-out" class="side-nav fixed">
                    <div class="container">
                        <div class="row">
                            <form id="locatonSearch"></form>
                                <h3>Find Your Trail</h3>
                                <h4>Select a Location:</h4>
                                <div class="input-field">
                                    <select id="items">
                                        <option value="" disabled selected>Choose a state</option>
                                    </select>
                                </div>
                                <div class="input-field">
                                    <select id="cities">
                                        <option value="" disabled selected>Choose a city</option>
                                    </select>
                                </div>
                            </form> 
                        </div>
                    </div>  
                </div>
                <a href="#" data-activates="slide-out" class="button-collapse"><i class="material-icons">menu</i></a>
                <div id="map"></div>
                <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD5BRSSgrgK8EJ8998mi5CclUx2vjH7Tc0&callback=initialize"
                ></script>`;
    $("#trailPage").html(html);
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
        center: { lat: -34.397, lng: 150.644 },
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
                infowindow.setContent('<h3>' + arr[i].name + '</h3><h4>' + arr[i].directions+ '</h4>');
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
