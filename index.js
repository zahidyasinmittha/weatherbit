document.getElementById("con").innerHTML = "<b style=font-size:40px;>ENABLE LOCATION OR SEARCH BY NAME</b>"
var longi = null;
var latitude = null;
st = (response, i, sunrise, sunset, country, name, choice, id) => {
    temp = Math.floor(response.main.temp)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let dat = new Date(response.dt * 1000);
    sunrise = new Date(sunrise * 1000)
    sunset = new Date(sunset * 1000)
    let min = dat.getMinutes();
    let hour = dat.getHours();
    let day = dat.getDate();
    let month = dat.getMonth()
    let year = dat.getFullYear()
    console.log()
    if (hour > 12) {
        hour = hour - 12;
        min += "PM";
    }
    else
        min += "AM";
    let str = `
        <section class="weatherCard partialy-cloudy">
        <div class="title__container">
            <div class="weatherIcon" id="icon"></div>
            <div>
                <div class="title">${day}:${months[month]}:${year}</div>
                <div class="city">${name}, ${country}</div>
            </div>
        </div>
        <div class="main">
            <div class="temperature">
                <b class="temperature__max">${temp}ºC</b>
                <b class="temperature__min">feels like:${response.main.feels_like}ºC</b>
            </div>
            <div class="forecast">${response.weather[i].main}<small> ${response.weather[i].description}</small></div>
            <div class="date"><b>Time:</b>${hour}:${min}</div>
            <div class="date"><b>Visibility:</b>${response.visibility / 1000}km</div>
            <div class="date"><b>temp-min:</b>${response.main.temp_min}<b> temp-max:</b>${response.main.temp_max}</div>
            <div class="date"><b>sunrise:</b>${sunrise.getHours()}:${sunrise.getMinutes()}AM<b> sunset:</b>${sunset.getHours() - 12}:${sunset.getMinutes()}PM</div>
        </div>
        <div class="info__container">
            <div class="info pressure">
                <div class="info__title">Humidity</div>
                <div class="info__value">${response.main.humidity}%</div>
            </div>
            <div class="info visibility">
                <div class="info__title">Cloudiness</div>
                <div class="info__value">${response.clouds.all}%</div>
            </div>
            <div class="info rain">
                <div class="info__title">Wind</div>
                <div class="info__value">${Math.floor(response.wind.speed * 3.6)}kmh</div>
                <div class="info__value">${response.wind.deg}deg</div>
            </div>
        </div>
    </section>`

    if (choice == 1) {
        document.getElementById("con").innerHTML += str;
        document.getElementsByClassName(`weatherIcon`)[id].style.background = ` url(http://openweathermap.org/img/wn/${response.weather[i].icon}@2x.png) no-repeat  center center`
        document.getElementById("btn-forecast").innerHTML = ""
    }
    else {
        document.getElementById("con").innerHTML = str;
        document.getElementById("btn-forecast").innerHTML = "<button id='forecast' onclick='forecast()'>forecast</button>"
        document.getElementsByClassName(`weatherIcon`)[id].style.background = ` url(http://openweathermap.org/img/wn/${response.weather[i].icon}@2x.png) no-repeat  center center`
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, err);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
err = (e) => {
    document.getElementById("con").innerHTML = "<b style=font-size:40px;>ENABLE LOCATION OR SEARCH BY NAME</b>"
}
showPosition = (e) => {
    longi = e.coords.longitude;
    latitude = e.coords.latitude;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longi}&appid=1e88a618d9f5264acba3f64c923927ad&units=metric`)
        .then(response => response.json())
        .then(response => {
            st(response, 0, response.sys.sunrise, response.sys.sunset, response.sys.country, response.name, 0, 0)
        })
        .catch(err => alert(err))
}
getLocation();

bysearch = () => {
    let city = document.getElementById("search").value;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1e88a618d9f5264acba3f64c923927ad&units=metric`)
        .then(response => {
            if (!response.ok)
                alert("please enter valid city name")
            else
                return response.json()
        })
        .then(response => {
            longi = response.coord.lon;
            latitude = response.coord.lat;
            st(response, 0, response.sys.sunrise, response.sys.sunset, response.sys.country, response.name, 0, 0)
        })
        .catch(err => alert(err))
}

forecast = () => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longi}&appid=1e88a618d9f5264acba3f64c923927ad&units=metric`)
        .then(response => response.json())
        .then(response => {
            let j = 0;
            for (let i = 0; i < response.list.length; i += 3) {
                st(response.list[i], 0, response.city.sunrise, response.city.sunset, response.city.country, response.city.name, 1,j++)
            }
        })
        .catch(err => alert(err))
}

