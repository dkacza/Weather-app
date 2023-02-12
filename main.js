'use-strict';

const API_KEY = 'b48fc9a3f6a6deaf3d65d0d6620f1a13';

class WeatherData {
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
class Location {
    constructor(lat, lon, city, country) {
        this.lat = lat;
        this.lon = lon;
        this.city = city;
        this.country = country;
    }
}

const geolocation = function () {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
    });
};
const getCurrentLocation = async function () {
    try {
        const geoResponse = await geolocation();
        if (!geoResponse) throw new Error('Geolocation disabled');
        const {latitude, longitude} = geoResponse.coords;

        const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
        const response = await fetch(url).then(res => {
            if (!res.ok)
                throw new Error(
                    `Getting current location error - ${res.status}`
                );
            return res.json();
        });
        return new Location(
            response[0].lat,
            response[0].lon,
            response[0].name,
            response[0].country
        );
    } catch (err) {
        throw err;
    }
};
const getLocationFromQuery = async function (searchQuerry) {
    try {
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${searchQuerry}&limit=1&appid=${API_KEY}`;
        const response = await fetch(url).then(res => {
            if (!res.ok)
                throw new Error(
                    `Getting location from user querry error - ${res.status}`
                );
            return res.json();
        });
        if (response.length === 0) throw new Error('Invalid search querry');
        return new Location(
            response[0].lat,
            response[0].lon,
            response[0].name,
            response[0].country
        );
    } catch (err) {
        throw err;
    }
};

const getCurrentWeather = async function (location) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}`;
        const response = await fetch(url).then(res => {
            if (!res.ok)
                throw new Error(
                    `Getting current weather error - ${res.status}`
                );
            return res.json();
        });
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
        throw err;
    }
};
const getForecast = async function (location, type = 'hourly') {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}`;
        const response = await fetch(url).then(res => {
            if (!res.ok)
                throw new Error(`Getting forecast error - ${res.status}`);
            return res.json();
        });

        forecastArray = [];
        if (type === 'hourly') {
            for (let i = 1; i < 6; i++) {
                item = response.list[i];
                const forecastEntry = new WeatherData(
                    item.weather[0].main,
                    item.weather[0].description,
                    item.weather[0].id,
                    item.weather[0].icon,
                    item.main.temp,
                    item.main.humidity,
                    item.wind.speed,
                    item.main.pressure,
                    item.clouds.all,
                    new Date(item.dt_txt)
                );
                forecastArray.push(forecastEntry);
            }
        }
        if (type === 'daily') {
            for (let i = 1; i < 6; i += 4) {
                item = response.list[i];
                const forecastEntry = new WeatherData(
                    item.weather[0].main,
                    item.weather[0].description,
                    item.weather[0].id,
                    item.weather[0].icon,
                    item.main.temp,
                    item.main.humidity,
                    item.wind.speed,
                    item.main.pressure,
                    item.clouds.all,
                    new Date(item.dt_txt)
                );
                forecastArray.push(forecastEntry);
            }
        }

        return forecastArray;
    } catch (err) {
        throw err;
    }
};
const dom = {
    // Main container and message display
    mainContainer: document.querySelector('div.container'),
    userMsg: document.querySelector('div.msg'),

    // Search section inputs.
    cityInput: document.querySelector('input.searchbar'),
    cityInputWrapper: document.querySelector('div.input-wrapper'),
    searchBtn: document.querySelector('button.search-btn'),
    geolocateBtn: document.querySelector('button.geolocate-btn'),

    // Current weather section
    place: document.querySelector('div.city-info'),
    temperature: document.querySelector('div.temperature'),
    conditions: document.querySelector('div.conditions'),

    celcius: document.querySelector('button.celcius-btn'),
    fahrenheit: document.querySelector('button.fahrenheit-btn'),

    humidity: document.querySelector('div.data.humidity'),
    wind: document.querySelector('div.data.wind'),

    forecastToggleH: document.querySelector('button.hourly-btn'),
    forecastToggleD: document.querySelector('button.daily-btn'),

    celciusSelected: true,

    updateLocation: function (newLocation) {
        this.place.textContent = `${newLocation.city}, ${newLocation.country}`;
    },
    updateWeather: function (curWeather) {
        this.temperature.textContent = this.celciusSelected
            ? `${curWeather.temp.celcius} °C`
            : `${curWeather.temp.fahrenheit} °F`;
        this.conditions.textContent = curWeather.main;
        this.humidity.textContent = `${curWeather.humidity} %`;
        this.wind.textContent = `${curWeather.windSpeed} m/s`;
    },
    updateForecast: function(type) {
        
    }
};

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
console.log(dom.forecastToggleD)
