console.log("Weather script loaded");

function capitalizeWords(str) {
  return str
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

// Current weather
const URL =
  "https://api.openweathermap.org/data/2.5/weather?q=tooele&units=imperial&appid=c327a17bd211e05a4f2a1cee9a280fd3";

fetch(URL)
  .then((response) => response.json())
  .then((data) => {
    const temperature = document.querySelector("#temperature");
    const feelsLike = document.querySelector("#feelsLike");
    const humidity = document.querySelector("#humidity");
    const windSpeed = document.querySelector("#windSpeed");
    const condition = document.querySelector("#condition");
    const icon = document.querySelector("#weatherIconMain");

    const temp = Math.round(data.main.temp);
    const feels = Math.round(data.main.feels_like);
    const humid = data.main.humidity;
    const wind = Math.round(data.wind.speed);
    const desc = capitalizeWords(data.weather[0].description);
    const iconCode = data.weather[0].icon;

    temperature.textContent = temp;
    feelsLike.textContent = feels;
    humidity.textContent = humid;
    windSpeed.textContent = wind;
    condition.textContent = desc;
    icon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    icon.alt = desc;
  })
  .catch((err) => console.error("Current weather fetch failed:", err));

// 5-day forecast
const forecastURL =
  "https://api.openweathermap.org/data/2.5/forecast?q=tooele&units=imperial&appid=c327a17bd211e05a4f2a1cee9a280fd3";

fetch(forecastURL)
  .then((res) => res.json())
  .then((forecastData) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let forecastCount = 0;

    for (let item of forecastData.list) {
      if (item.dt_txt.includes("12:00:00") && forecastCount < 5) {
        const date = new Date(item.dt * 1000);
        const dayName = days[date.getDay()];
        const iconCode = item.weather[0].icon;
        const temp = Math.round(item.main.temp);
        const desc = capitalizeWords(item.weather[0].description);

        document.querySelector(`#dayTitle${forecastCount + 1}`).textContent =
          dayName;
        document.querySelector(
          `#weatherIcon${forecastCount + 1}`
        ).src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        document.querySelector(`#weatherIcon${forecastCount + 1}`).alt = desc;
        document.querySelector(
          `#data${forecastCount + 1}`
        ).textContent = `${temp}°F`;

        forecastCount++;
      }
    }
  });

const year = new Date().getFullYear();
document.getElementById("currentYear").textContent = year;

const newsURL =
  "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=53e0f232f711401582e5b6e7a623d850";

fetch(newsURL)
  .then((res) => res.json())
  .then((data) => {
    for (let i = 0; i < 5; i++) {
      const article = data.articles[i];
      if (!article) continue;

      document.querySelector("#article-" + (i + 1)).textContent =
        article.title || "No title";
      document.querySelector("#art-desc-" + (i + 1)).textContent =
        article.description || "No description";

      const img = document.querySelector("#art-img-" + (i + 1));
      if (article.urlToImage) {
        img.src = article.urlToImage;
        img.alt = article.title;
      } else {
        img.src =
          "https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg";
        img.alt = "No image available";
      }

      const link = document.querySelector("#link-" + (i + 1));
      link.href = article.url || "#";
    }
  });
