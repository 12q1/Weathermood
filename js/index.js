const baseUrl = "https://api.openweathermap.org/data/2.5/forecast?id=";
const extras = "&APPID=6d525fe7650f9c1b801faae2755e97d5";
const toMetric = "&units=metric";
let currCity;

getWeather = cityId => {
  let api = baseUrl + cityId + extras + toMetric; //constructs the request string
  //console.log(api)
  fetch(api)
    .then(response => {
      return response.json();
    }) //fetch and unpack data
    .then(data => {
      scoreClouds = //creates a score based on cloud coverage with a weight of .25
        data.list.reduce((acc, curr) => acc + curr.clouds.all, 0) /
        data.list.length /
        4;
      scoreTemp = //creates a score based on avg local temp
        data.list.reduce((acc, curr) => acc + curr.main.temp, 0) /
          data.list.length -
        14;
      scoreWind = //creates a score based on current wind speed in m/s
        data.list.reduce((acc, curr) => acc + curr.wind.speed, 0) /
        data.list.length;
      if (data.list[0].rain) {
        //openweatherapi gives no rain property if there is no rain
        scoreRain = data.list //creates a score based on rainfall
          .map(x => x.rain["3h"]) //property name 3h causes problems
          .filter(rain => rain != undefined)
          .reduce((acc, curr) => acc + curr, 0);
      } else {
        scoreRain = 0; //condition for no rainfall
      }
      currCity = cityId; //sets current city to cityId for check in handleButtonClick
      document.getElementById("meter").value =
        (100 - scoreClouds + scoreTemp - scoreWind - scoreRain); //scores tallied up

      document.getElementById("currCity").innerHTML = data.city.name;
      document.getElementById("condition").innerHTML =
        "Forecast: " + data.list[0].weather["0"].description;
      let avgTemp = scoreTemp+14 
      document.getElementById("avgTemp").innerHTML =
        "Average temperature: " + avgTemp.toFixed(1) + "°C"
      document.getElementById("icon").src = 
        "http://openweathermap.org/img/w/" + data.list[0].weather["0"].icon + ".png";
      console.log("got weather for " + data.city.name);
    });
};

handleButtonClick = cityId => {
  if (cityId != currCity) {
    //check if a new fetch is needed
    console.log("getting info for city id " + cityId);
    getWeather(cityId);
  }
  setInterval(
    (interval = () => {
      getWeather(cityId);
    }),
    600000
  );
}; //button handler with repeat 10 min

window.onLoad = getWeather(2759794); //calls getweather on first load