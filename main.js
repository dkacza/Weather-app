'use-strict';

// Reverse geocoding
// http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid={API key}

// Current weather
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

const geolocateBtn = document.querySelector('.geolocate-btn');

const geolocate = function() {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
    })
}
const getCity = async function() {
    const location = await geolocate();
    const {latitude: lat, longitude: lng} = location.coords;
    
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=b48fc9a3f6a6deaf3d65d0d6620f1a13`

    const [response] = await fetch(url).then(res => res.json());

    const resultString = `${response.name}, ${response.country}`
    return resultString;
}
const getCurrentWeather = async function() {
    const location = await geolocate();
    const {latitude: lat, longitude: lng} = location.coords;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=b48fc9a3f6a6deaf3d65d0d6620f1a13`;

    const response = await fetch(url).then(res => res.json());
    console.log(response);

    // Values
    const temperature = response.main.temp; // K
    const humidity = response.main.humidity; // %
    const pressure = response.main.pressure; // hPa
    const wind = response.wind.speed; // m/s
    const clouds = response.clouds.all // %

    // Desctiptions
    const description = response.weather[0].description; // rain, snow
    const main = response.weather[0].main;
    const icon = response.weather[0].icon;
    const weatherID = response.weather[0].id

    console.log(temperature, humidity, pressure, wind, clouds);
    console.log(weatherID, icon, main, description);
}

getCity().then(res => console.log(res));
getCurrentWeather();