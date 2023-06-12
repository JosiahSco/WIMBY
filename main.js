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
        let cityName = document.getElementById("searchInput").value;
        console.log(cityName);
        console.log('enter pressed in input field');   
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${getAPIKey()}`)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            getCurrentWeather(json[0].lat, json[0].lon);
        });
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
