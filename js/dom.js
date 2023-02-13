const weekdayMap = new Map();
weekdayMap
    .set(0, 'Monday')
    .set(1, 'Tuesday')
    .set(2, 'Wednesday')
    .set(3, 'Thursday')
    .set(4, 'Friday')
    .set(5, 'Saturday')
    .set(6, 'Sunday');
const weekdayMapShort = new Map();
weekdayMapShort
    .set(0, 'Mon')
    .set(1, 'Tue')
    .set(2, 'Wed')
    .set(3, 'Thu')
    .set(4, 'Fri')
    .set(5, 'Sat')
    .set(6, 'Sun');

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

    forecastTilesHourly: document.querySelectorAll('div.hourly div.tile'),
    forecastTilesDaily: document.querySelectorAll('div.daily div.tile'),

    hourlyTilesContainer: document.querySelector('div.hourly'),
    dailyTilesContainer: document.querySelector('div.daily'),

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

    updateForecastData: function (forecast) {
        for (let i = 0; i < 5; i++) {
            const currDailyTile = this.forecastTilesDaily[i];
            const currHourlyTile = this.forecastTilesHourly[i];

            const currHourlyForecast = forecast[i];
            const currDailyForecast = forecast[i * 8];

            console.log(currHourlyForecast);


            currDailyTile.querySelector('.date.full').textContent =
                weekdayMap.get(currDailyForecast.time.getDay())
            currDailyTile.querySelector('.date.short').textContent = 
            weekdayMapShort.get(currDailyForecast.time.getDay())
            currDailyTile.querySelector('i').classList.add('wi', `wi-owm-${currDailyForecast.weatherId}`)
            currDailyTile.querySelector('.temperature').textContent = `${this.celciusSelected ? currDailyForecast.temp.celcius : currDailyForecast.temp.fahrenheit}${this.celciusSelected ? '°C' : '°F'}`;

            currHourlyTile.querySelector('.date').textContent = currHourlyForecast.time.getHours() + ":00";
            currHourlyTile.querySelector('i').classList.add('wi', `wi-owm-${currHourlyForecast.weatherId}`);
            currHourlyTile.querySelector('.temperature').textContent = `${this.celciusSelected ? currHourlyForecast.temp.celcius : currHourlyForecast.temp.fahrenheit}${this.celciusSelected ? '°C' : '°F'}`;

        }
    },
    updateForecastDisplay(forecastType) {
        if(forecastType == 'daily') {
            this.hourlyTilesContainer.classList.add('hidden');
            this.dailyTilesContainer.classList.remove('hidden');
        } else {
            this.hourlyTilesContainer.classList.remove('hidden');
            this.dailyTilesContainer.classList.add('hidden');
        }
    },
};
