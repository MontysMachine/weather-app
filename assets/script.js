var citySearchForm = document.getElementById('citySearch');
var weatherInfoContainer = document.getElementById('weatherInfo');
var weatherCard = document.getElementById('weatherCard');
var cityInput = document.getElementById('cityInput');

const apiKey = '1bb0d5d66c4ad03dbbae4a6cd5275422';

function getCoordinates(city) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.length === 0) {
        throw new Error('City not found');
      }
      return { lat: data[0].lat, lon: data[0].lon };
    });
}

function fetchWeatherData(city) {
  getCoordinates(city)
    .then(coords => {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=imperial&appid=${apiKey}`;
      return fetch(url);
    })
    .then(response => response.json())
    .then(data => {
      displayWeather(data, city);
      saveSearchHistory(city);
    })
    .catch(error => {
      console.error(error);
    });
}

function displayWeather(data, city) {
  const currentWeather = data.list[0];
  const forecast = data.list.filter(item => item.dt_txt.includes("12:00:00")); // 5-day forecast at noon

  weatherCard.innerHTML = `
    <div class="card-body">
      <h2 class="card-title">Current Weather in ${city}</h2>
      <p class="card-text">Temperature: ${currentWeather.main.temp} °F</p>
      <p class="card-text">Wind Speed: ${currentWeather.wind.speed} mph</p>
      <p class="card-text">Humidity: ${currentWeather.main.humidity}%</p>
      <img src="https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png" alt="${currentWeather.weather[0].description}">
    </div>`;

  let forecastHTML = '<div class="row mt-3">';
  forecast.forEach(day => {
    forecastHTML += `
      <div class="col-12 col-md-2 card m-2 p-2">
        <h5>${new Date(day.dt_txt).toLocaleDateString()}</h5>
        <p>Temp: ${day.main.temp} °F</p>
        <p>Wind: ${day.wind.speed} mph</p>
        <p>Humidity: ${day.main.humidity}%</p>
        <img src="https://openweathermap.org/img/w/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
      </div>`;
  });
  forecastHTML += '</div>';

  weatherInfoContainer.innerHTML = forecastHTML;
}

function saveSearchHistory(city) {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    displaySearchHistory();
  }
}

function displaySearchHistory() {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  const historyContainer = document.getElementById('searchHistory');
  historyContainer.innerHTML = '';

  searchHistory.forEach(city => {
    const cityElement = document.createElement('button');
    cityElement.textContent = city;
    cityElement.className = 'btn btn-secondary m-2';
    cityElement.addEventListener('click', () => fetchWeatherData(city));
    historyContainer.appendChild(cityElement);
  });
}

document.addEventListener('DOMContentLoaded', displaySearchHistory);

citySearchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  var city = cityInput.value;
  fetchWeatherData(city);
});

