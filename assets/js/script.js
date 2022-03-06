let geocodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + inputCity + "&limit=5&appid=789b338375c5c9c65b5f07a89cf811c6";
let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial&appid=789b338375c5c9c65b5f07a89cf811c6";
let apiUrl

let inputCity = document.getElementById("input-city");
let savedSearch = document.getElementById("searched-cities");
let searchedCity = "";

function getApi(url) {
    return fetch(url).then(function (response) {
      return response.json();
    });
  }

