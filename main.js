'use-strict';

// Reverse geocoding
// http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid={API key}

// Current weather
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

// Forecast
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

class WeatherData {
    constructor(main, desc, id, icon, temp, hum, wind, pres, clouds) {
        this.main = main;
        this.description = desc;
        this.weatherId = id;
        this.iconId = icon;

        this.temp = {
            celcius: temp - 273.15,
            fahrenheit: (9 / 5) * (temp - 273.15) + 32,
        };
        (this.humidity = hum),
            (this.windSpeed = wind),
            (this.pressure = pres),
            (this.cloudsPercentage = clouds);
    }
}

const geolocate = function () {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
    });
};

const prepareURL = async function (requestType) {
    const location = await geolocate();
    const {latitude: lat, longitude: lon} = location.coords;
    const weatherKey = 'b48fc9a3f6a6deaf3d65d0d6620f1a13';

    switch (requestType) {
        case 'reverseGeo':
            return `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${weatherKey}`;
        case 'current':
            return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}`;
        case 'forecast':
            return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherKey}`;
        default:
            throw new Error('Wrong request type');
    }
};

const getCity = async function () {
    const url = await prepareURL('reverseGeo');
    const [response] = await fetch(url).then(res => res.json());

    const resultString = `${response.name}, ${response.country}`;
    return resultString;
};

const getCurrentWeather = async function () {
    try {
        const url = await prepareURL('current');
        const response = await fetch(url).then(res => res.json());

        const currentWeather = new WeatherData(
            response.weather[0].main,
            response.weather[0].description,
            response.weather[0].id,
            response.weather[0].icon,
            response.main.temp,
            response.main.humidity,
            response.wind.speed,
            response.main.pressure,
            response.clouds.all
        );
        return currentWeather;
    } catch (err) {
        throw new Error(err);
    }
};

getCurrentWeather().then(response => console.log(response)).catch(err => console.error(err));
