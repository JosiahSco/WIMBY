import { getAPIKey } from "./config.js";

function findMyPosition() {
    function success(position) {
        const latitudeNum = position.coords.latitude;
        const longitudeNum = position.coords.longitude;
        getCurrentWeather(latitudeNum, longitudeNum);
    }
    
    function error() {
        alert('There has been an error getting your location');
    }
    
    if (!navigator.geolocation) {
        alert('There has been an error getting your location');
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

document.querySelector('#getLocation').addEventListener('click', findMyPosition);

document.querySelector('.search-bar').addEventListener('keypress', function(e){
    if (e.keyCode == 13) {
        var hasNumber = /\d/;
        let locationInput = document.getElementById("searchInput").value;
        if(hasNumber.test(locationInput)){ //if search input is zipcode
            fetch(`http://api.openweathermap.org/geo/1.0/zip?zip=${locationInput}&limit=5&appid=${getAPIKey()}`) 
            .then(response => response.json()) //everything after this is the same for both conditions and should be put into a function instead of being written twice
            .then(json => { 
                if(json.length <= 0){
                    alert('Invalid Location Entered');
                } else {
                    console.log(json);
                    getCurrentWeather(json.lat, json.lon);
                }
            });
        } else { //else interpret search input as city name
            fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${locationInput}&limit=5&appid=${getAPIKey()}`)
            .then(response => response.json())
            .then(json => {
                if(json.length <= 0){
                    alert('Invalid Location Entered');
                } else {
                    console.log(json);
                    getCurrentWeather(json[0].lat, json[0].lon);
                }
            });
        }
    }
});

function getCurrentWeather(latitude, longitude) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${getAPIKey()}`)
    .then(response => response.json())
    .then(json => {
        console.log(json);
        document.querySelector('#location').textContent =  json.name;
        document.querySelector('#conditions').textContent = json.weather[0].main;
        document.querySelector('#temperature').textContent = 'Temperature: ' + json.main.temp;
    });
}
