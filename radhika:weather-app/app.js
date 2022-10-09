const API_key = '2a16455e3a7c72ec497e6199e53fa01c';
let units_used = "metric"
// let city = "delhi"
let selectedCity;
let selectedCityText;
const daysOfWeek = ['Sat','Sun','Mon','Tue','Wed','Thur','Fri']
const searchInput = document.querySelector("#search");
const body = document.querySelector("body");

// if current time is more than 7pm - night sky image, else morningsky image
let current_h = Number(new Date().getHours());
console.log("print current_h 12 line:  ",current_h)
if (current_h >= 19 || current_h < 5){
    console.log("print current_h: ",current_h)
    body.style.background = `url(nightonw.jpg)`;
    body.style.backgroundSize = `cover`;
    body.style.backgroundPosition= `center center`;
    body.style.backgroundAttachment= `fixed`;
    body.style.color= `white`;
}



// helper functions

// create format for all temperature fields with degree and 1 decimal place
let formatTemperature = (temp) => `${temp?.toFixed(1)}°`;

// get icon image from icon url
let createIconImage = (icon) => `http://openweathermap.org/img/wn/${icon}@2x.png`;


async function getCurrentWeatherData(selectedCity){
       // API call and response in JSON for first card - current Weather
    lat = selectedCity.lat;
    lon = selectedCity.lon;
    city = selectedCity.city;
    // console.log("consoling lat,lon seperately from getCurrentWeatherData before API call: ",lat,lon)
    // if (city?.length){
    //     console.log("consoling city seperately from getCurrentWeatherData before API call: ",city)
    // }
    let url = lat && lon ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=${units_used}` : `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=${units_used}`;
    let response = await fetch(url);
    let data = await response.json()
    // console.log("lat,lon,city from getCurrentWeatherData:",selectedCity)
    // console.log("fetching data after city/lat/lon deletection",data)
    return data
}


let loadCurrentForecastData = ({name,main: {temp,temp_min,temp_max},weather: [{description}]}) => {
    // loading data in first card
    const currentForecastElement = document.querySelector("#current-forecast");
    currentForecastElement.querySelector(".city").textContent = name;
    currentForecastElement.querySelector(".temp").textContent = formatTemperature(temp);
    currentForecastElement.querySelector(".description").textContent = description;
    currentForecastElement.querySelector(".min-max").textContent = `H: ${formatTemperature(temp_max)} L: ${formatTemperature(temp_min)}`;
}

let hourlyWeatherFiveDayData = async (currentWeather) =>{
    // API call and response in JSON for second card - hourly weather - 1 avg call for every 3 hours in  5 days i.e. 40 calls
    // api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_key}&units=${units_used}
    let city = currentWeather.name;
    let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_key}&units=${units_used}`)
    return await response.json();
}

let loadHourlyForecast = async ({main:{temp:tempNow},weather:[{icon:iconNow}]},hourlyWeather) =>{
    const hourlyContainer = document.querySelector(".hourly-container");
    // reduce 40 entries to 12 entries, ignore first entry(time passed)
    // console.log("hourly weather line 56",hourlyWeather)
    // console.log("hourly weather list line 57",hourlyWeather.list)
    let hourlyWeather36Hours = hourlyWeather.list.slice(2,14)
    hourlyContainer.innerHTML = `<article>
            <h3 class="time">Now</h3>
            <img src="${createIconImage(iconNow)}" alt="icon for current hour forecast"> 
            <p class="hourly-temp">${formatTemperature(tempNow)}</p>
        </article>`

    const timeFormatter = Intl.DateTimeFormat("en",{
        hour12:true,hour:"numeric"
    })

    for (let listObject of hourlyWeather36Hours){
        // console.log('element:',listObject)
        const {dt_txt, main:{temp} ,weather:[{icon}]} = listObject;
        // console.log(dt_txt,temp,icon)
        // current_time = dt_txt.split(" ")[1]
        // let current_time_without_seconds = current_time.slice(0,5);

        hourlyContainer.innerHTML += `<article>
            <h3 class="time">${timeFormatter.format(new Date(dt_txt))}</h3>
            <img src="${createIconImage(icon)}" alt="icon for current hour forecast"> 
            <p class="hourly-temp">${formatTemperature(temp)}</p>
        </article>`
    }   
}

let loadFeelsLike = ({main: {feels_like}}) => {
    const FeelsLikeContainer = document.querySelector(".feels-like-temp");
    FeelsLikeContainer.textContent = formatTemperature(feels_like);
}

let loadHumidity = ({main: {humidity}}) => {
    // console.log("humidity/",humidity)
    const HumidityContainer = document.querySelector(".humidity-value");
    HumidityContainer.textContent = `${humidity}%`
}

let loadFiveDayForecast = async (hourlyWeather) => {
    const fiveDayForecastContainer = document.querySelector(".five-day-forecast-container");
    fiveDayForecastContainer.innerHTML ="";
    let hourlyWeatherList = hourlyWeather.list
    // console.log("hourly weather data list object inside loadFiveDayForecast():",hourlyWeatherList)
    // console.log("hourlyWeatherList inside loadFiveDayForecast():",hourlyWeatherList)
    let dayWiseMap = new Map()
    // key will be date and values will be array object of icon,temp_min,temp_max
    for (let listObject of hourlyWeatherList){
        // console.log('element:',listObject)
        // deconstruct for required fields
        let {dt_txt, main:{temp_max,temp_min} ,weather:[{icon}]} = listObject;
        // from date time string, extract only date
        current_date = dt_txt.split(" ")[0]
        // console.log(current_date,temp_max,temp_min,icon)
        if (dayWiseMap.has(current_date)) {
            // if dictionary already has a date key, compare temp_min and temp_max values 
            let valueArray = dayWiseMap.get(current_date)
            if (valueArray[1] < temp_min){
                temp_min = valueArray[1]
            }
            if (valueArray[2] > temp_max){
                temp_max = valueArray[2]
            }
            // assign changes in existing values if any
            dayWiseMap.set(current_date,[icon,temp_min,temp_max])
        } else {
            // if dictionary does not current_date as key
            dayWiseMap.set(current_date,[icon,temp_min,temp_max])
        }
        
    }  
    // console.log("daywise map 128:",dayWiseMap)
    // Obtain array of 5daysForecast Values
    let dayWiseArray = Array.from(dayWiseMap,([key,value]) => value);
    // console.log('dayWiseArray: ',dayWiseArray)
    let todayIndex = new Date().getDay()
    let toDay = daysOfWeek[todayIndex]
    // console.log('today day:',toDay)

    for (let i=0; i<dayWiseArray.length; i++){
        // to stop printing after 5 days
        if (i>4){
            break;
        }
        fiveDayForecastContainer.innerHTML += `<article class="day-wise-forecast">
        <h3 class="day">${i===0? "Today":daysOfWeek[i]}</h3>
        <img src="${createIconImage(dayWiseArray[i][0])}" alt="day-forecast-icon" class="icon">
        <p class="min-temp">L: ${formatTemperature(dayWiseArray[i][1])}</p>
        <p class="max-temp">H: ${formatTemperature(dayWiseArray[i][2])}</p>
        </article>`

    }
    
}

// function doSomething(latcoords, longcoords) {
//     console.log('coords obtained:',latcoords,longcoords)
// }

let loadDataUsingCurrentGeoLocation = () => {
    // navigator.geolocation.getCurrentPosition(({position})=>{
    //     console.log("positioncoords:",position)
    //     // let {latitude,longitude} = positioncoords;
    //     let lat = position.coords.latitude;
    //     let lon = position.coords.longitude;
    //     selectedCity = {lat,lon} ;
    //     console.log("selectedcity:",selectedCity)
    // },error =>console.log(error))
    navigator.geolocation.getCurrentPosition((position) => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        selectedCity = {lat,lon};
        // console.log("selectedcity:",selectedCity)
        loadData();
      },error =>console.log(error));

}

async function getCityNamesListFromApi(searchValue){
    let response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=5&appid=${API_key}`)
    let data = response.json()
    // let {name} = data;
    // console.log('name deconstructed:',name)
    return data

}
async function loadCityNamesIntoOptions(event){
    console.log("after every .5 sec of input eventlistener")
    const value = event.target.value;
    // console.log("city entered in search:",value)
    // assign values incase of no values entered
    if (!value){
        selectedCity = null;
        selectedCityText = "";
    }
    if (value){
        // fetch cities array from API
        let citiesList = await getCityNamesListFromApi(value);
        // console.log('cities list from api response on input value: ',citiesList)
        // load array into datalist html as options
        let innerHTMLData = "";
        let citiesDropDown = document.querySelector("#cities");
        for (let {name, state, country,lat,lon} of citiesList){
            innerHTMLData += `<option latlonname="${lat},${lon},${name}" value="${name},${state},${country}"></option>`
        }
        // console.log("innerhtml data for drop down: ", innerHTMLData)
        citiesDropDown.innerHTML = innerHTMLData;   
    }
}

async function loadDataAfterCitySelection(event){
    selectedCityText = event.target.value
    // console.log('selectedCityText:',selectedCityText)
    // select attribute for option selected by comparing if selectedcitytext and item in options is equal
    const optionsList = document.querySelectorAll("#cities > option")
    // option element.attribute.nodeValue = lat-lon-name = "23.22,74.22,Pune"
    // console.log("options html from line 213: ",optionsList)
    // convert nodeList to array becoz nodelist is not iterable
    if (optionsList?.length){
        let optionsListArray = Array.from(optionsList)
        // console.log("ARRAY of options  html from line 214: ",optionsListArray)
        optionsListArray.map((optionObject)=>{
        // console.log('optionObject.attributes.value.nodeValue:', optionObject.attributes.value.nodeValue)
        if (optionObject.attributes.value.nodeValue === selectedCityText) {
            let requiredString = optionObject.attributes.latlonname.value;
            // console.log('requiredString:',requiredString)
            let [lat, lon,city] = requiredString.split(',');
            selectedCity = {lat,lon,city}
            // console.log('selectedCity from line 228 inside loadDataAfterCitySelection',selectedCity)
            loadData()
            }
        })      
    }
    
    // for (let [key,value] in optionsListArray){
    //     console.log('iterating array: ',value)
    // }
    
}


let loadData = async () => {
    // console.log(await getCurrentWeatherData(),'this was currentWeather api DATA')
    let currentWeather = await getCurrentWeatherData(selectedCity)
    loadCurrentForecastData(currentWeather);
    // console.log(await hourlyWeatherFiveDayData(),'this was HOURLY Weather api Data')
    let hourlyWeather = await hourlyWeatherFiveDayData(currentWeather)
    loadHourlyForecast(currentWeather,hourlyWeather);
    loadFiveDayForecast(hourlyWeather);
    loadFeelsLike(currentWeather);
    loadHumidity(currentWeather);
}

const debounce = (func) => {
    let timer;
    
    return (...args) => {
        clearTimeout(timer);

        timer = setTimeout(() => {
            func.apply(this,args);
        }, 500);
    }
}

// let debounceSearch =  debounce(event => loadCityNamesIntoOptions(event))



const debounceSearch = debounce(event => loadCityNamesIntoOptions(event));



document.addEventListener("DOMContentLoaded",async function() {
    // load data as per current location of user
    loadDataUsingCurrentGeoLocation();
    // add event listener for search input, search for city and show relevant cities in dropdown
    searchInput.addEventListener("input",debounceSearch)
    // searchInput.addEventListener("input", debounce((event) => loadCityNamesIntoOptions(event)))
    // add event listener in case of selection from dropdown in search input 
    searchInput.addEventListener("change",loadDataAfterCitySelection)
   
})









// async function getCityNamesFromGeoData(event){
//     let response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${event.target}&limit=5&appid=${API_key}`)
//     let data = response.json()
//     let {name} = data;
//     console.log('name deconstructed:',name)
//     return data
// }

// // let onSearchChange = (event) => {
// //     return getCityNamesFromGeoData(event.target)
// // }

// document.addEventListener("DOMContentLoaded", async function(){
//     SearchInput.addEventListener("input",getCityNamesFromGeoData)
// })