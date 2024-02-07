var citySearchForm = document.getElementById('citySearch');
var weatherInfoContainer = document.getElementById('weatherInfo');
var weatherCard = document.getElementById('weatherCard');

function fetchWeatherData(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=1bb0d5d66c4ad03dbbae4a6cd5275422`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      var temperature = data.main.temp;
      var windSpeed = data.wind.speed;
      var humidity = data.main.humidity;

      weatherCard.innerHTML = `
        <div class="card-body">
          <h2 class="card-title">Weather Information for ${city}</h2>
          <p class="card-text">Temperature: ${temperature} °F</p>
          <p class="card-text">Wind Speed: ${windSpeed} mph</p>
          <p class="card-text">Humidity: ${humidity}%</p>
        </div>`;
    })
};

citySearchForm.addEventListener('submit', function(event){
  event.preventDefault();
  var city = document.getElementById('cityInput').value;
  fetchWeatherData(city);
});