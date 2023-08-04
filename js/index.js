let searchCityInput = document.getElementById("searchCity");
let userLocation = document.getElementById("userLocation");
let currentFullDay = document.getElementById("fullDay");
let currentDayTime = document.getElementById("dayTime");
let currentDegree = document.querySelector(".current-degree");
let currentConditionIcon = document.querySelector(".condition-icon");
let currentQueryCity = document.getElementById("queryCity");
let currentWCondition = document.getElementById("wCondition");
let currentDayHigh = document.getElementById("dayHigh");
let currentNightLow = document.getElementById("nightLow");
let currentFeelsLike = document.getElementById("feelsLike");
let currentWindSpeed = document.getElementById("windSpeed");
let currentDayHumidity = document.getElementById("dayHumidity");
let forecastDay = document.querySelectorAll(".forecast-day");
let forecastIcon = document.querySelectorAll(".forecast-icon");
let forecastHigh = document.querySelectorAll(".forecast-high");
let forecastLow = document.querySelectorAll(".forecast-low");
let forecastCondition = document.querySelectorAll(".forecast-con");

let fullDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// get user's ip geolocation
async function getIpAddress() {
  var keyLocation = "8a092f9d6c414bcf8da49120846a1296";
  let apiResponse = await fetch(
    // `https://ipgeolocation.abstractapi.com/v1/?api_key=8a092f9d6c414bcf8da49120846a1296`
    `https://ipgeolocation.abstractapi.com/v1/?api_key=${keyLocation}`
  );
  let apiData = await apiResponse.json();
  displayUserLocation(apiData.city, apiData.country);
  return apiData.city;
}

// get city weather
async function getWeather() {
  if (searchCityInput.value.length == 0) {
    // var keyWeatherApi = "e10289c8104148a69a560310230408";
    let location = await getIpAddress();
    var apiResponse =
      await fetch(`https://api.weatherapi.com/v1/forecast.json?key=750f599a3c0b4912bea61424230408&q=${location}&days=7&aqi=yes&alerts=no
  `);
  } else {
    let city = searchCityInput.value;
    var apiResponse =
      await fetch(`https://api.weatherapi.com/v1/forecast.json?key=750f599a3c0b4912bea61424230408&q=${city}&days=10&aqi=yes&alerts=no
`);
  }

  let apiData = await apiResponse.json();
  displayCurrent(
    apiData.current.temp_c,
    apiData.current.condition.icon,
    apiData.location.name,
    apiData.current.condition.text,
    apiData.forecast.forecastday[0].day.maxtemp_c,
    apiData.forecast.forecastday[0].day.mintemp_c,
    apiData.current.feelslike_c,
    apiData.current.wind_kph,
    apiData.current.humidity
  );
  return apiData;
}

function displayUserLocation(cityLocation, countryLocation) {
  userLocation.innerHTML = `<i class="fa-solid fa-location-dot text-warning"></i>
  <span class="fw-bold s-color">${cityLocation}</span>,  ${countryLocation}`;
}

function displayCurrent(
  cDegree,
  cIcon,
  cCity,
  cCondition,
  cHigh,
  cLow,
  cFeel,
  cWind,
  cHumid
) {
  let d = new Date();
  let todayName = d.getDay();
  let todayTime = d.toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  currentFullDay.innerHTML = fullDays[todayName];
  currentDayTime.innerHTML = todayTime;
  currentDegree.innerHTML = cDegree;
  currentConditionIcon.setAttribute("src", `https:${cIcon}`);
  currentQueryCity.innerHTML = cCity;
  currentWCondition.innerHTML = cCondition;
  currentDayHigh.innerHTML = cHigh;
  currentNightLow.innerHTML = cLow;
  currentFeelsLike.innerHTML = cFeel;
  currentWindSpeed.innerHTML = cWind;
  currentDayHumidity.innerHTML = cHumid;
}

async function displayForecast() {
  let forecastData = await getWeather();
  let arr = forecastData.forecast.forecastday;
  let d = new Date();
  let todayName = d.getDay();
  for (let i = 1; i < arr.length; i++) {
    todayName += 1;
    if (todayName > 6) {
      todayName = 0;
    }
    forecastDay[i - 1].innerHTML = shortDays[todayName];
    forecastIcon[i - 1].setAttribute(
      "src",
      `https:${arr[i].day.condition.icon}`
    );
    forecastHigh[i - 1].innerHTML = arr[i].day.maxtemp_c;
    forecastLow[i - 1].innerHTML = arr[i].day.mintemp_c;
    forecastCondition[i - 1].innerHTML = arr[i].day.condition.text;
  }
}
displayForecast();

searchCityInput.addEventListener("keyup", function () {
  let queryCity = searchCityInput.value;

  console.log(queryCity);
  displayForecast();
});
