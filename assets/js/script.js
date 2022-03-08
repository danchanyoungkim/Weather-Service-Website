let apiKey = "789b338375c5c9c65b5f07a89cf811c6"
let button = document.querySelector("#button");
let clear = document.getElementById("clear");
let cityList = document.querySelector("#city-list");
let searchedCity = document.querySelector("#searched-city");
let cityForecast = document.querySelector("#city-forecast");
let weatherObject = [];

let storage = JSON.parse(localStorage.getItem('cities')) || [];

let urlIcon = 'http://openweathermap.org/img/wn/';

// Function for api data retrieval.
let dataApi = function(city){
    let urlApi = 'https://api.openweathermap.org/data/2.5/forecast?appid=' + apiKey + '&units=imperial&q='+city;
    fetch(urlApi)
    .then(function(weatherResponse) {
        return weatherResponse.json();
    })
    .then(function(weatherResponse) {
        createDataObject(weatherResponse.list, weatherResponse.city.coord);
        let urlApi1 = 'https://api.openweathermap.org/data/2.5/uvi?appid=' + apiKey + '&lat='+weatherObject[0].lat+'&lon='+weatherObject[0].lon;
        fetch(urlApi1)
        .then(function(uvResponse) {
          return uvResponse.json();
        })
        .then(function(uvResponse) {
            //Local storage for city.
            saveCity(city);
            weatherHTML(city, uvResponse.value);
        })
    })
};

// Local storage display.
function initiation() {
    loadCity();
}

clear.addEventListener("click", function(){
    localStorage.clear();
    location.replace("./index.html");
})

// Save data of searched city.
let saveCity = function(city){
    storage.push(city);
    localStorage.setItem("cities",JSON.stringify(storage)); 
loadCity();
}

// On click function to bring data of recently searched city.
$(document).on("click", ".list-group-item", function(event) {
    event.preventDefault();
    let city = $(this).attr("attr");
    dataApi(city);
});

let cardReset = function(element){
    element.innerHTML = "";
};

// Function to get info from local storage.
let loadCity = function() {
    cardReset(cityList);
        if(storage) {
            let ulElement = document.createElement("ul");
            ulElement.classList.add("list-unstyled");
            ulElement.classList.add("w-100");
            //For loop to iterate through out the localStore
            for (let i = 0; i < storage.length; i++) {
                let liElement = document.createElement("li");
                // append a button with bootstraps classes inside each item
                liElement.innerHTML = "<button type='button' class='list-group-item list-group-item-action' attr='"+storage[i]+"'>" + storage[i] + "</button>";
                // append the item into its container
                ulElement.appendChild(liElement);
                }
                cityList.appendChild(ulElement); 
            }
};

// Display of weather in:
let weatherHTML = function (city, uv) {
    cardReset(searchedCity);
    cardReset(cityForecast); 
    // searched city.
    let todayCity = document.createElement("div");                                                           
    let todayCity1 = document.createElement("div");                                                          
    let cityEl = document.createElement("h3");
    let imageCurrent = document.createElement("img");
    cityEl.textContent = city + " (" + weatherObject[0].dateT +")";
    imageCurrent.setAttribute("src", weatherObject[0].icon);                    
    imageCurrent.classList.add("bg-info");                            
    todayCity.appendChild(cityEl);
    todayCity1.appendChild(imageCurrent);
    let todayCity3  = document.createElement("div");                                       
    todayCity3.innerHTML =    
        "<p>Temperature: " + Math.round(weatherObject[0].temp) + " °F" + 
        "<p>Wind Speed: " + weatherObject[0].speed + " MPH" +
        "<p>Humidity: " + weatherObject[0].humidity + "%" +
        "<p>UV index: <span class='text-white "+ indicatorUv(uv) + "'>" + uv + "</span></p>";
    searchedCity.appendChild(todayCity);
    searchedCity.appendChild(todayCity1);
    searchedCity.appendChild(todayCity3);

    // Five day forecast.
    let fiveDay = document.createElement("div");                            
    let fiveDay1 = document.createElement("div");                          
    fiveDay1.innerHTML = "<h3>Five Day Forecast</h3>";
    fiveDay.appendChild(fiveDay1);
    cityForecast.appendChild(fiveDay);
    let fiveDay2 = document.createElement("div");         
    fiveDay2.classList.add("d-inline-flex");              

    // For loop for the five days forecasts. Starts at i = 2 because present day is shown on top.
    for (let i = 2; i < weatherObject.length; i++){ 
        let div1  = document.createElement("div");           
        div1.classList.add("card");                           
        div1.classList.add("border-dark");                                          
        div1.classList.add("flex-fill");
        div1.classList.add("bg-info")
        let div2  = document.createElement("div");
        div2.classList.add("card-body");
        let title = document.createElement("h3");
        let imageForecast = document.createElement("img");
        title.textContent = weatherObject[i].dateT;
        imageForecast.setAttribute("src", weatherObject[i].icon);
        let weekTemp = document.createElement("p");
        let weekHumid = document.createElement("p");
        weekTemp.textContent =   "Temperature: " + Math.round(weatherObject[i].temp) + " °F";
        weekHumid.textContent =  "Humidity: " + weatherObject[i].humidity + "%";
        div2.appendChild(title);
        div2.appendChild(imageForecast);
        div2.appendChild(weekTemp);
        div2.appendChild(weekHumid)
        div1.appendChild(div2);        
        fiveDay2.appendChild(div1);
    }
    cityForecast.appendChild(fiveDay2);
};

// Function for indication of uv by color.
let indicatorUv = function(uv) {
    let indexUV = parseFloat(uv);
    let uvColor;                       
    if (indexUV < 2){
        uvColor = "bg-success";           
    } else if (indexUV < 7){
        uvColor = "bg-warning";
    } else {
        uvColor = "bg-danger";   
    }
    return uvColor;
};

// Retrieving attribute of date form api.
let dateOfWeather = function (str) {
    let hour = str.split(" ")[1].split(":")[0];
    let startTrack = false;
    if(hour == "09"){
        startTrack = true;
    }        
    return startTrack;
};

let currentDate = function(strDate){
    let newDate = strDate.split(" ")[0].split("-");
    return (newDate[1]+"/"+newDate[2]+"/"+newDate[0]);
};

// Function for today's weather display.
let createDataObject = function(list, position){
    if (weatherObject.length)
    weatherObject = [];
    let obj = {
        icon : urlIcon + list[0].weather[0].icon + ".png",
        dateT : currentDate(list[0].dt_txt),
        temp: list[0].main.temp,
        humidity : list[0].main.humidity,
        speed: list[0].wind.speed, 
        lat : position.lat,
        lon: position.lon
    };
    //Within the same function as above but for five day forecast.
    weatherObject.push(obj);
    for(let i = 1; i < list.length; i++) {
        if(dateOfWeather(list[i].dt_txt)){
            obj = {
                icon : urlIcon + list[i].weather[0].icon + ".png",
                dateT : currentDate(list[i].dt_txt),
                temp: list[i].main.temp,
                humidity : list[i].main.humidity,
                speed: list[i].wind.speed,  
                lat : position.lat,
                lon: position.lon
            };
            weatherObject.push(obj);
        }
    }
};

// Function for search input.
let search = function(event) {
    event.preventDefault();
    let formInput = document.querySelector("#form-input");
    let writtenCity = formInput.value.trim();
    dataApi(writtenCity);
};
 
initiation();
button.addEventListener("click", search);