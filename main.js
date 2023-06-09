function buttonAlert() {
    findMyPosition();
}

function findMyPosition() {
    const latitudeElement = document.querySelector("#latitude");
    const longitudeElement = document.querySelector("#longitude");

    function success(position) {
        const latitudeNum = position.coords.latitude;
        const longitudeNum = position.coords.longitude;
        latitudeElement.textContent = `Latitude: ${latitudeNum}°`;
        longitudeElement.textContent = `Longitude: ${longitudeNum}°`;
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
