const userTab = document.querySelector('[data-userWeather]');
const searchTab = document.querySelector('[data-searchWeather]');
const userContainer = document.querySelector('.weather-container');
const grantAccessContainer = document.querySelector('.grant-location-container');
const searchform = document.querySelector('[data-searchForm]');
const loadingScreen = document.querySelector('.Loading-container');
const userInfoContainer = document.querySelector('.user-info-container');
const errorWindow=document.querySelector('.error');

//intial variable
let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();
function switchTab(newTab) {
    if (newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");
        if (!searchform.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchform.classList.add("active");

        }
    
    else {
        
        searchform.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getfromSessionStorage();
    }
}
}


userTab.addEventListener('click', () => {
    switchTab(userTab);
    errorWindow.classList.remove('active')
    
    

});
searchTab.addEventListener('click', () => {
    switchTab(searchTab);
    errorWindow.classList.remove('active')
});


// userTab.addEventListener('click',function(){
//     userTab.classList.add('current-tab');
//     searchTab.classList.remove('current-tab');
//     getfromSessionStorage();
// })
// searchTab.addEventListener('click',function(){
//     searchTab.classList.add('current-tab');
//     userTab.classList.remove('current-tab')
// })

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem('user-coordinates');
    if (!localCoordinates) {
        grantAccessContainer.classList.add('active');
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
        // console.log(coordinates);
    }
}



async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    grantAccessContainer.classList.remove('active');
    loadingScreen.classList.add('active');
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);

    }
    catch (err) {
        loadingScreen.classList.remove('active');
        alert('No data Present For Your Place')
    }

}
function renderWeatherInfo(weatherInfo) {
    const cityName = document.querySelector('[data-cityName]');
    const countryIcon = document.querySelector('[data-CountryIcon]');
    const desc = document.querySelector('[data-weatherDesc]');
    const weatherIcon = document.querySelector('[ data-weatherIcon]');
    const temp = document.querySelector('[data-Temp]');
    const windSpeed = document.querySelector('[data-windspeed]');
    const humidity = document.querySelector('[data-humidity]');
    const cloudiness = document.querySelector('[data-cloudiness]');

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${
    weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
    errorWindow.classList.remove('active')
    if(weatherInfo?.name==undefined){
        userInfoContainer.classList.remove('active');
        errorWindow.classList.add('active');

    }
}
function getlocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else {
        alert('No Location Access');
    }
}
function showposition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    sessionStorage.setItem('user-coordinates', JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


const grantAccessbtn = document.querySelector('[data-grantAccess]');
grantAccessbtn.addEventListener('click', getlocation);

const searchInput=document.querySelector('[data-searchInput]')
searchform.addEventListener('submit',(e)=>{
    e.preventDefault(); 
    let cityName=searchInput.value;
    if(cityName==''){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }

})
 async function  fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove('active');
    grantAccessContainer.classList.remove('active');
    try{

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingScreen.classList.remove("active");
        alert('Failed to fetch weather data. Please try again.');
    }

}






