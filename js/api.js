const API_KEY = 'b48fc9a3f6a6deaf3d65d0d6620f1a13';

import { WeatherData, Location } from "./main.js";
import {dom} from "./dom.js"

export const geolocation = function () {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
    });
};
export const getCurrentLocation = async function () {
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
export const getLocationFromQuery = async function (searchQuerry) {
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

export const getCurrentWeather = async function (location) {
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
export const getForecast = async function (location, type = 'hourly') {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}`;
        const response = await fetch(url).then(res => {
            if (!res.ok)
                throw new Error(`Getting forecast error - ${res.status}`);
            return res.json();
        });

        let forecastArray = [];
        if (type === 'hourly') {
            for (let i = 1; i < 6; i++) {
                let item = response.list[i];
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