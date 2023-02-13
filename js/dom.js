export const dom = {
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

    forecastTiles: document.querySelectorAll('div.tile'),

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

    updateForecast: function(forecast, forecastType) {
        for (let i = 0; i < 5; i++) {
            const forecastEntry = forecast[i];
            const domTileEntry = this.forecastTiles[i];

            const weekdayMap = new Map();
            weekdayMap.set(0, 'Monday').set(1, 'Tuesday').set(2, 'Wednesday').set(3, 'Thursday').set(4, 'Friday').set(5, 'Saturday').set(6, 'Sunday');

            const id = forecastEntry.weatherId;
            const date = (forecastType === 'hourly' ? `${forecastEntry.time.getHours()}:00` : weekdayMap.get(forecastEntry.time.getDay()));
            const temperature = (this.celciusSelected ? forecastEntry.temp.celcius : forecastEntry.temp.fahrenheit)

            domTileEntry.querySelector('.date').textContent = date;
            domTileEntry.querySelector('i').removeAttribute('class');
            domTileEntry.querySelector('i').classList.add('wi', `wi-owm-${id}`)
            domTileEntry.querySelector('.temperature').textContent = `${temperature}${this.celciusSelected ? '°C' : '°F'}`;
        }
    },
};