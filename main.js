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
        hideSearchElement();
        document.getElementById('weatherWrapper').style.display = 'flex';
        fillCurrentWeatherData(json);
        
    })
}

function convertTime(timestamp, dow) { // unix timestamp, bool (true if include day of week)
    var date = new Date(timestamp * 1000); // convert to miliseconds from seconds 
    const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; 
    var day = dayName[date.getDay()]; 
    var hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours(); // 12-Hour Format 
    var min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(); // 10:3 -> 10:03 
    var period = date.getHours() < 12 ? 'AM' : 'PM'; 
    var formattedTime = dow ? day + ' ' + hour + ':' + min + ' ' + period : hour + ':' + min + ' ' + period; 
    return formattedTime; 
} 

document.querySelector('#detailsButton').addEventListener('click', showDetails); 

function displayWeatherIcon(description){
    switch(description) {
        //case 'cloudy':
        //element.src = "graphics/cloudly.png/" or something
    }
}

//this is a temporary function for testing purposes
function hideSearchElement() {
    document.getElementById('searchLocation').style.display = "none";
    document.querySelector('.container').style.display = "none";
}

function showDetails() {
    document.getElementById('currentWeatherList').style.display === 'none' 
        ? document.getElementById('currentWeatherList').style.display = 'block' 
        : document.getElementById('currentWeatherList').style.display = 'none';
}

function fillCurrentWeatherData(json) {
    document.getElementById('currentWeatherList').style.backgroundColor = 'rgba(0,0,0,0.25)';
    // WEATHER RESULTS
    // Location
    document.querySelector('#currentLocation').textContent =  json.name;
    // Current Temperature
    document.querySelector('#currentTemp').textContent = Math.round(json.main.temp) + '°F';
    // "AS OF CURRENT TIME"
    //document.querySelector('#datetime').textContent = convertTime(json.dt, true); 
    // Feels Like
    document.querySelector('#feelslike').textContent = 'Feels Like: ' + Math.round(json.main.feels_like) + '°F'; 
    // Main Weather Status "rain"
    // document.querySelector('#conditions').textContent = json.weather[0].main;
    //Desc for Main Status "moderate rain"
    document.querySelector('#conditions').textContent = 'Currently ' + json.weather[0].description; 
    // High Temp 
    document.querySelector('#tempmax').textContent = 'High: ' + Math.round(json.main.temp_max) + '°F'; 
    // Low Temp
    document.querySelector('#tempmin').textContent = 'Low: ' + Math.round(json.main.temp_min) + '°F'; 
    // Humidity
    document.querySelector('#humidity').textContent = 'Humidity: ' + json.main.humidity + '%'; 
    // Wind
    // - Speed
    document.querySelector('#windspeed').textContent = 'WIND Speed: ' + Math.round(json.wind.speed) + ' MPH'; 
    // - Deg 
    document.querySelector('#winddeg').textContent = 'WIND Deg: ' + json.wind.deg + '°'; 
    // Sunset Time
    document.querySelector('#sunset').textContent = 'Sunset at ' + convertTime(json.sys.sunset, false); 
    // Sunrise Time
    document.querySelector('#sunrise').textContent = 'Sunrise at ' + convertTime(json.sys.sunrise, false); 
}