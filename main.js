function findMyPosition() {
    const latitudeElement = document.querySelector("#latitude");
    const longitudeElement = document.querySelector("#longitude");

    function success(position) {
        const latitudeNum = position.coords.latitude;
        const longitudeNum = position.coords.longitude;
        latitudeElement.textContent = `Latitude: ${latitudeNum}°`;
        longitudeElement.textContent = `Longitude: ${longitudeNum}°`;
        //getCurrentWeather(latitudeNum, longitudeNum);
    }

    function error() {
        latitude.textContent = "Error getting your location"
    }

    if (!navigator.geolocation) {
        latitude.textContent = "Geolocation is not supported by your browser";
      } else {
        navigator.geolocation.getCurrentPosition(success, error);
      }
}

function getCurrentWeather(latitude, longitude) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=441765b6213a3a01d862e511735ad6bc`)
    .then(response => response.json())
    .then(json => {
        console.log(json);
    })
}
