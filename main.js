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
        (this.humidity = hum),
            (this.windSpeed = wind),
            (this.pressure = pres),
            (this.cloudsPercentage = clouds);

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
            console.log('response arrived')
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

const dom = {
    mainContainer: document.querySelector('div.container'),

    // Search section inputs.
    cityInput: document.querySelector('input.searchbar'),
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

    forecastTogglesH: document.querySelectorAll('button.hourly-btn'),
    forecastTogglesD: document.querySelectorAll('button.daily-btn'),

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
};

let curWeather;

const handleGeo = async function() {
    try {
        dom.mainContainer.classList.add('loading');
        const location = await getCurrentLocation();
        dom.updateLocation(location);

        curWeather = await getCurrentWeather(location);
        dom.updateWeather(curWeather);
        dom.mainContainer.classList.remove('loading');
    } catch (err) {
        console.error(err);
    }
}
const handleQuerry = async function() {
    try {
        dom.mainContainer.classList.add('loading');
        const locationQuerry = dom.cityInput.value;
        if (!locationQuerry) return;
        const location = await getLocationFromQuery(locationQuerry);
        dom.updateLocation(location);

        curWeather = await getCurrentWeather(location);
        dom.updateWeather(curWeather);
        dom.cityInput.value = '';
        dom.mainContainer.classList.remove('loading');
    } catch (err) {
        console.error(err);
    }
}

dom.geolocateBtn.addEventListener('click', handleGeo);
dom.searchBtn.addEventListener('click', handleQuerry);
dom.celcius.addEventListener('click', () => {
    dom.celciusSelected = true;
    dom.updateWeather(curWeather);
});
dom.fahrenheit.addEventListener('click', () => {
    dom.celciusSelected = false;
    dom.updateWeather(curWeather);
})

dom.mainContainer.classList.add('loading');
handleGeo();