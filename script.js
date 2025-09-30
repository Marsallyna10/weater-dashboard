const apiKey = "https://openweathermap.org/e"; // Ganti dengan API key kamu

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weatherIcon");
const forecastContainer = document.getElementById("forecastContainer");
const toggleTheme = document.getElementById("toggleTheme");

// Peta ikon ke assets lokal
const iconMap = {
  Clear: "assets/clear.svg",
  Clouds: "assets/clouds.svg",
  Rain: "assets/rain.svg",
  Snow: "assets/snow.svg",
  Mist: "assets/mist.svg",
  Thunderstorm: "assets/thunder.svg"
};

// Event pencarian
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  }
});

// Enter untuk cari
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// Toggle tema
toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleTheme.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Ambil data cuaca
async function getWeather(city) {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=id`);
    if (!res.ok) throw new Error("Kota tidak ditemukan");
    const data = await res.json();

    // Update current weather
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)} °C`;
    description.textContent = data.weather[0].description;
    feelsLike.textContent = Math.round(data.main.feels_like);
    humidity.textContent = data.main.humidity;
    wind.textContent = data.wind.speed;

    const mainWeather = data.weather[0].main;
    weatherIcon.src = iconMap[mainWeather] || "assets/clear.svg";

    // Ambil forecast
    getForecast(city);
  } catch (err) {
    alert(err.message);
  }
}

// Ambil prakiraan 5 hari
async function getForecast(city) {
  forecastContainer.innerHTML = "";
  const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=id`);
  const data = await res.json();

  const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  daily.forEach(day => {
    const date = new Date(day.dt * 1000);
    const temp = Math.round(day.main.temp);
    const mainWeather = day.weather[0].main;

    const div = document.createElement("div");
    div.classList.add("forecast-item", "fade-in");
    div.innerHTML = `
      <p><strong>${date.toLocaleDateString("id-ID", { weekday: "long" })}</strong></p>
      <img src="${iconMap[mainWeather] || "assets/clear.svg"}" alt="${mainWeather}">
      <p>${temp} °C</p>
      <p>${day.weather[0].description}</p>
    `;
    forecastContainer.appendChild(div);
  });
}
