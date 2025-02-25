// Start GLobal Variables
const strBaseWeatherURL = 'https://api.open-meteo.com/v1/forecast?'
//const strBaseLocationURL = 'https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API'
const defaultLat = 36.1628
const defaultLong = -85.5016
const guardianClass = ''

var globalTemperature = ''
var globalSunriseTime = ''
var globalSunsetTime = ''
var globalElevation = ''

var classIcon = document.querySelector("img")
console.log(classIcon)

// End Global Variables

async function getWeather(latitude,longitude){
    try {
        // https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&daily=sunrise,sunset&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FChicago
        const callURL = `${strBaseWeatherURL}latitude=${latitude}&longitude=${longitude}&current=temperature_2m&daily=sunrise,sunset&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FChicago`;
        
        console.log(callURL)

        const objResponse = await fetch(callURL, {
            method: 'GET', 
            headers: { 'Content-Type': 'application/json' }
        });

        if(!objResponse.ok){
            throw new Error(`HTTP Error Status:${objResponse.status}`)
        }

        const objData = await objResponse.json()
        
        if(objData.latitude){

        console.log("Completed Call to Weather API")

        // Extract weather data
        const temperature = objData.current.temperature_2m;
        console.log("Completed Call to Weather API:"+temperature+objData.current_units.temperature_2m)

        //write to Global variables
        globalElevation = objData.elevation
        console.log(globalElevation)

        globalSunriseTime = objData.daily.sunrise[0]
        console.log(globalSunriseTime)

        globalSunsetTime = objData.daily.sunset[0]
        console.log(globalSunsetTime)

        globalTemperature = temperature + objData.current_units.temperature_2m
        console.log(globalTemperature)

        document.querySelector("#temperature").textContent = globalTemperature
        document.querySelector("#sunrise").textContent = globalSunriseTime
        document.querySelector("#sunset").textContent = globalSunsetTime
        document.querySelector("#elevation").textContent= globalElevation + " Feet"

        } else {
            console.log(objData)
            console.log("ERROR! Couldn't call Weather API")
        }
    } catch(objError){
        console.log('Error fetching objData',objError)
        //Create a Sweetalert for user indicating failure
    }
}

// Start click handlers
// click event for geoFindMe to get user's Lat and Long via mozilla api call
  
document.querySelector("#findMe").addEventListener("click", geoFindMe);

function geoFindMe() { 
    
    // https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m&timezone=America%2FChicago
    //change to be dyamic time zone
    const timeZone = 'America%2FChicago'
    //get class
    const guardianClass = document.querySelector('#menuClassSelection').value
    console.log(guardianClass)
      
    switch (guardianClass) {
        case 'Hunter':
            classIcon.src = 'class-hunter-proportional.svg'
            console.log("Display Hunter Icon")
            break;
        case 'Warlock':
            classIcon.src = 'class-warlock-proportional.svg'
            console.log("Display Warlock Icon")
            break;
        case 'Titan':
            classIcon.src = 'class-titan-proportional.svg'
            console.log("Display Titan Icon")
            break;

        default:
            classIcon.src = 'traveller.svg'
            console.log("Display Traveller Icon")
    }
    
    const status = document.querySelector("#status");
  
    function success(position) {
      const latitude = position.coords.latitude.toFixed(4);
      const longitude = position.coords.longitude.toFixed(4);

      // Store values in hidden input fields
      document.querySelector("#hiddenLatitude").value = latitude;
      document.querySelector("#hiddenLongitude").value = longitude;
    
      status.textContent = "";

      getWeather(latitude, longitude)
      console.log( document.querySelector("#hiddenLatitude").value, document.querySelector("#hiddenLongitude").value)
    }
  
    function error() {
      status.textContent = "Unable to retrieve your location";
    }
  
    if (!navigator.geolocation) {
      status.textContent = "Geolocation is not supported by your browser";
      console.log(status.textContent)
    } else {
      status.textContent = "Locating…";
      navigator.geolocation.getCurrentPosition(success, error);
      // Swap screens
      document.querySelector('#frmWeatherOptions').style.display = 'none'
      document.querySelector('#divHomepage').style.display = 'block' 
    }

}

// click event for btnSkip - get's cookeville's weather - skips location input
document.querySelector('#btnSkip').addEventListener('click', function(){
    //get class
    const guardianClass = document.querySelector('#menuClassSelection').value
    console.log(guardianClass)
    switch (guardianClass) {
        case 'Hunter':
            classIcon.src = 'class-hunter-proportional.svg'
            console.log("Display Hunter Icon")
            break;
        case 'Warlock':
            classIcon.src = 'class-warlock-proportional.svg'
            console.log("Display Warlock Icon")
            break;
        case 'Titan':
            classIcon.src = 'class-titan-proportional.svg'
            console.log("Display Titan Icon")
            break;

        default:
            classIcon.src = 'traveller.svg'
            console.log("Display Traveller Icon")
    }
    
    //Weather API call?
    getWeather(defaultLat, defaultLong)

    // Swap screens
    document.querySelector('#frmWeatherOptions').style.display = 'none'
    document.querySelector('#divHomepage').style.display = 'block'    



})

// click event for btnOptions - to go to options page
document.querySelector('#btnOptions').addEventListener('click', function(){
    // Swap screens
    document.querySelector('#frmWeatherOptions').style.display = 'block'
    document.querySelector('#divHomepage').style.display = 'none' 
})

// End click handlers
