// DOM Elements
const weatherForm = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const errorDisplay = document.getElementById('error-display');
const loadingDisplay = document.getElementById('loading-display');
const weatherDisplay = document.getElementById('weather-display');

const locationTitle = document.getElementById('location-title');
const tempValue = document.getElementById('temp-value');
const humidityValue = document.getElementById('humidity-value');
const windValue = document.getElementById('wind-value');

// Event Listener for the Search Form
weatherForm.addEventListener('submit', handleSearch);

async function handleSearch(e) {
    e.preventDefault();
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    // Reset UI state before starting network request
    showLoading(true);
    hideError();
    hideWeather();

    try {
        // Step 1: Fetch coordinate data from Geocoding API based on City Name
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);

        // Check if the server responded with an error status (e.g., 404 or 500)
        if (!geoResponse.ok) {
            throw new Error('Failed to connect to the geocoding service.');
        }

        const geoData = await geoResponse.json();

        // Comprehensive Error Handling: Check if the API returned an empty array (city not found)
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error(`City "${cityName}" not found. Please verify the spelling.`);
        }

        // Parse coordinates from nested JSON response
        const { latitude, longitude, name, country } = geoData.results[0];

        // Step 2: Fetch real-time weather metrics using coordinates
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;
        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            throw new Error('Failed to retrieve data from the weather station service.');
        }

        // Parse and process complex nested JSON weather object
        const weatherData = await weatherResponse.json();
        
        // Extract live weather data metrics from the structure
        const temperature = weatherData.current.temperature_2m;
        const humidity = weatherData.current.relative_humidity_2m;
        const windSpeed = weatherData.current.wind_speed_10m;

        // Render data dynamically to the DOM
        renderWeather(name, country, temperature, humidity, windSpeed);

    } catch (error) {
        // Catch-all block handles network dropouts, bad API payloads, and custom errors
        displayError(error.message);
    } finally {
        // Ensure loading screen turns off regardless of success or failure
        showLoading(false);
    }
}

// ==========================================================================
// UI Rendering Helper Functions
// ==========================================================================

function renderWeather(city, country, temp, humidity, wind) {
    locationTitle.textContent = `${city}, ${country}`;
    tempValue.textContent = `${temp}°C`;
    humidityValue.textContent = `${humidity}%`;
    windValue.textContent = `${wind} km/h`;
    weatherDisplay.style.display = 'block';
}

function displayError(message) {
    errorDisplay.textContent = message;
    errorDisplay.style.display = 'block';
}

function showLoading(isLoading) {
    loadingDisplay.style.display = isLoading ? 'block' : 'none';
}

function hideError() {
    errorDisplay.style.display = 'none';
    errorDisplay.textContent = '';
}

function hideWeather() {
    weatherDisplay.style.display = 'none';
}