'use-strict';

import {dom} from './dom.js';
import {getLocationFromQuery, getCurrentLocation, getCurrentWeather, getForecast } from './api.js';



export class WeatherData {
    constructor(
        main,
        desc,
        id,
        icon,
        temp,
        hum,
        wind,
        pres,
        clouds,
        time = new Date()
    ) {
        this.main = main;
        this.description = desc;
        this.weatherId = id;
        this.iconId = icon;

        this.temp = {
            celcius: Math.round(temp - 273.15),
            fahrenheit: Math.round((9 / 5) * (temp - 273.15) + 32),
        };
        this.humidity = hum;
        this.windSpeed = wind;
        this.pressure = pres;
        this.cloudsPercentage = clouds;

        this.time = time;
        this.hour = time.getHours();
    }
}
export class Location {
    constructor(lat, lon, city, country) {
        this.lat = lat;
        this.lon = lon;
        this.city = city;
        this.country = country;
    }
}

let curWeather;
let forecast;
let forecastType = 'hourly'

const handleGeo = async function () {
    try {
        // Hide message and show the spinner
        dom.mainContainer.classList.add('loading');
        dom.mainContainer.classList.remove('disp-msg');

        const location = await getCurrentLocation();
        dom.updateLocation(location);
        curWeather = await getCurrentWeather(location);
        forecast = await getForecast(location);

        console.log(forecast);

        // Display response and hide the spinner
        dom.updateWeather(curWeather);
        dom.updateForecast(forecastType);
        dom.mainContainer.classList.remove('loading');
        dom.cityInputWrapper.classList.remove('error');

        initiialState = false;
    } catch (err) {
        console.error(err);

        // Hide spinner and display geolocation message in the center of the sceen
        dom.userMsg.textContent = 'Turn on the geolocation and then try again';
        dom.mainContainer.classList.add('disp-msg');
        dom.mainContainer.classList.remove('loading');
    }
};
const handleQuerry = async function () {
    try {
        // Hide message and show the spinner
        dom.mainContainer.classList.add('loading');

        const locationQuerry = dom.cityInput.value;
        if (!locationQuerry) {
            dom.mainContainer.classList.remove('loading');
            return;
        }
        const location = await getLocationFromQuery(locationQuerry);

        // Display location and remove the error from under the searchbar
        dom.cityInputWrapper.classList.remove('error');
        dom.updateLocation(location);
        curWeather = await getCurrentWeather(location);
        forecast = await getForecast(location);
        dom.updateWeather(curWeather);
        dom.updateForecast(forecastType);

        // Clear the searchbar and hide the spinner if everything goes fine
        dom.cityInput.value = '';
        dom.mainContainer.classList.remove('loading');
        dom.mainContainer.classList.remove('disp-msg');

        initiialState = false;
    } catch (err) {
        console.error(err);
        dom.cityInput.value = '';

        // Hide spinner and display error under the searchbar
        if (initiialState) {
            dom.mainContainer.classList.add('disp-msg');
        }
        dom.cityInputWrapper.classList.add('error');
        dom.mainContainer.classList.remove('loading');
    }
};

// Toggling temperature
dom.celcius.addEventListener('click', () => {
    dom.celciusSelected = true;
    dom.celcius.classList.add('active');
    dom.fahrenheit.classList.remove('active');
    dom.updateWeather(curWeather);
});
dom.fahrenheit.addEventListener('click', () => {
    dom.celciusSelected = false;
    dom.fahrenheit.classList.add('active');
    dom.celcius.classList.remove('active');
    dom.updateWeather(curWeather);
});

dom.forecastToggleH.addEventListener('click', () => {
    forecastType = 'hourly'
    dom.forecastToggleH.classList.add('active')
    dom.forecastToggleD.classList.remove('active');
});
dom.forecastToggleD.addEventListener('click', () => {
    forecastType = 'daily'
    dom.forecastToggleD.classList.add('active')
    dom.forecastToggleH.classList.remove('active');
});

// Handling main events
dom.geolocateBtn.addEventListener('click', handleGeo);
dom.searchBtn.addEventListener('click', handleQuerry);
document.onkeydown = e => {
    if (e.key === 'Enter' && dom.cityInput.matches(':focus')) handleQuerry();
};
// Variable for a special first run of of handleQuerry with wrong city name
// Without it, the program displays placeholder values instead of error messages
let initiialState = true;
