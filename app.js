const API_key = '2a16455e3a7c72ec497e6199e53fa01c';
let units_used = "metric"
// let city = "delhi"
let selectedCity;
const daysOfWeek = ['Sat','Sun','Mon','Tue','Wed','Thur','Fri']
const SearchInput = document.querySelector("#search");

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


// helper functions

// create format for all temperature fields with degree and 1 decimal place
let formatTemperature = (temp) => `${temp?.toFixed(1)}°`;

// get icon image from icon url
let createIconImage = (icon) => `http://openweathermap.org/img/wn/${icon}@2x.png`;


async function getCurrentWeatherData(selectedCity){
       // API call and response in JSON for first card - current Weather
    let url = lat && lon ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=${units_used}` : `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=${units_used}`;
    let response = await fetch(url);
    return await response.json()
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
        console.log("selectedcity:",selectedCity)
        loadData();
      },error =>console.log(error));

}

document.addEventListener("DOMContentLoaded",async function() {
    loadDataUsingCurrentGeoLocation();
   
})

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