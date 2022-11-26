'use-strict';

// http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid={API key}

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

    const [response] = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=b48fc9a3f6a6deaf3d65d0d6620f1a13`).then(res => res.json());

    const resultString = `${response.name}, ${response.state}`
    return resultString;
}
getCity().then(res => console.log(res));