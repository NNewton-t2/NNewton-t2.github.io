// Start GLobal Variables
const strBaseWeatherURL = 'https://api.open-meteo.com/v1/forecast?'
const strBaseLocationURL = 'https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API'
const defaultLat = 36.1628
const defaultLong = -85.5016
const guardianClass = ''

// End Global Variables

async function getWeather(latitude,longitude){
    try {
        const callURL = `${strBaseWeatherURL}latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=America%2FChicago`;
        
        console.log(callURL)

        const objResponse = await fetch(callURL, {
            method: 'GET', 
            headers: { 'Content-Type': 'application/json' }
        });

        if(!objResponse.ok){
            throw new Error(`HTTP Error Status:${objResponse.status}`)
        }

        const objData = await objResponse.json()
        
        if(objData.current_weather){
            //Sweetalert for success
            // Swal.fire({
            //     position: "top-end",
            //     icon:"success",
            //     title:"Retrieval Successful",
            //     showConfirmButton: false,
            //     timer: 1500
            // })

        console.log("Completed Call to Weather API")

        // Extract weather data
        const temperature = objData.current_weather.temperature;
        const windSpeed = objData.current_weather.windspeed;
        const weatherCode = objData.current_weather.weathercode;

        // Create a readable message
        const weatherHTML = `
            <h2 class="text-center text-info">Current Weather</h2>
            <p><strong>Temperature:</strong> ${temperature}°C</p>
            <p><strong>Wind Speed:</strong> ${windSpeed} km/h</p>
            <p><strong>Weather Code:</strong> ${weatherCode}</p>
        `;

        // Display the data inside `divHomepage`
        document.querySelector("#divHomepage .card-body").innerHTML += weatherHTML;

        } else {
            //Sweetalert for failure
            // Swal.fire({
            //     position: "top-end",
            //     icon:"error",
            //     title:"Retrieval Failed",
            //     showConfirmButton: false,
            //     timer: 1500
            // })
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
    const timeZone = 'America%2FChicago'
    //get class
    const guardianClass = document.querySelector('#menuClassSelection').value
    console.log(guardianClass)
      
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
