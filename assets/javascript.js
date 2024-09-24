const apiKey = '7a0fbe2742fb17dd43551428d82f00d1'; // Add your OpenWeatherMap API key here

const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const currentWeatherContent = document.getElementById('currentWeatherContent');
const forecastContent = document.getElementById('forecastContent');
const historyList = document.getElementById('historyList');

let searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];

// Function to update the search history in the UI
function updateSearchHistory() {
    historyList.innerHTML = '';
    searchHistory.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.addEventListener('click', () => fetchWeather(city));
        historyList.appendChild(li);
    });
}

// Function to fetch weather data for a city
function fetchWeather(city) {
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Fetch current weather data
    fetch(currentWeatherURL)
        .then(response => response.json())
        .then(data => displayCurrentWeather(data));

    // Fetch 5-day forecast data
    fetch(forecastURL)
        .then(response => response.json())
        .then(data => displayForecastWeather(data));
}

// Function to display current weather
function displayCurrentWeather(data) {
    const { name, main, weather, wind } = data;
    const date = new Date().toLocaleDateString();
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;

    currentWeatherContent.innerHTML = `
        <h3>${name} (${date})</h3>
        <img src="${iconUrl}" alt="${weather[0].description}" />
        <p>Temperature: ${main.temp}°C</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
    `;
}

// Function to display 5-day forecast
function displayForecastWeather(data) {
    forecastContent.innerHTML = '';
    
    // Filter the forecast to show one entry per day at 12:00 PM
    const filteredForecast = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    filteredForecast.forEach(day => {
        const date = new Date(day.dt_txt).toLocaleDateString();
        const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
        
        const forecastEl = document.createElement('div');
        forecastEl.classList.add('forecast-item');
        forecastEl.innerHTML = `
            <h4>${date}</h4>
            <img src="${iconUrl}" alt="${day.weather[0].description}" />
            <p>Temp: ${day.main.temp}°C</p>
            <p>Wind: ${day.wind.speed} m/s</p>
            <p>Humidity: ${day.main.humidity}%</p>
        `;

        forecastContent.appendChild(forecastEl);
    });
}

// Function to handle form submission
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const city = cityInput.value.trim();
    
    if (city && !searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
        updateSearchHistory();
    }

    fetchWeather(city);
    cityInput.value = '';
});

// Load search history on page load
updateSearchHistory();
