async function get_weather(cityName) {
	const url = 'https://weatherapi-com.p.rapidapi.com/forecast.json?q=' + cityName + '&days=14';
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': config.SECRET_KEY,
			'X-RapidAPI-Host': config.API_URL
		}
	};

	try {
		const response = await fetch(url, options);
		let result = await response.json();
		localStorage.setItem("result", JSON.stringify(result));
		document.location.reload();

	} catch (error) {
		console.error(error);
	}
}

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			get_weather(position.coords.latitude + "%2C" + position.coords.longitude)
		});
	} else {
		alert("Geolocation is not supported by this browser.");
	}
}

function convertTo12HourFormat(time) {
	if (Number(time.slice(0, 2)) <= 11) {
		return time + " AM";
	}
	else {
		if (Number(time.slice(0, 2)) >= 13) {
			let num = Number(time.slice(0, 2)) - 12;
			return num + time.slice(2) + " PM";
		}
		else {
			return time + " PM";
		}
	}
}

document.getElementById("city_search_btn").addEventListener("click", (event) => {
	event.preventDefault();
	if (city_search_bar.value != '') {
		get_weather(city_search_bar.value);
	}
})

document.body.addEventListener("keydown", (event) => {
	if (event.key == "Enter") {
		event.preventDefault();
		if (city_search_bar.value != '') {
			get_weather(city_search_bar.value);
		}
	}
})

let result = JSON.parse(localStorage.getItem("result"));

if(result == null){
	document.getElementsByClassName("main")[0].style.display = "none";
	getLocation();
}
else if (result.error) {
	document.getElementById("error-message-div").style.display = "block";
	document.getElementsByClassName("main")[0].style.display = "none";
}

else {
	// top-left-main fillers
	document.getElementById("city-name").innerHTML = result.location.name + " , " + result.location.region + " , " + result.location.country;
	document.getElementById("localtime-label").innerHTML = "Local time : <br>" + result.location.localtime.slice(0,11) + convertTo12HourFormat(result.location.localtime.slice(11));
	document.getElementById("chanceOfRain").innerHTML = "<br>Chance Of Rain : " + result.forecast.forecastday[0].day.daily_chance_of_rain + "%";
	document.getElementById("chanceOfSnow").innerHTML = "Chance Of Snow : " + result.forecast.forecastday[0].day.daily_chance_of_snow + "%";
	document.getElementById("temp-main-left").innerHTML = result.current.temp_c + "&deg; C / " + result.current.condition.text;
	document.getElementById("top-left-main-icon").innerHTML = "<img src=https://" + result.current.condition.icon.slice(2) + ">";

	// center-left-main fillers

	for (let i = 0; i < 24; i++) {
		document.getElementById("center-left-main-div").innerHTML +=
			`<div class="center-left-main-card mxl-25">
                    	<span class="myb-10 text-medium font-weight-600 center-left-main-card-time"></span>
                    	<div class="image-center-left-main myb-10 center-left-main-card-icon"></div>
                    	<span class="text-medium font-weight-600 center-left-main-card-temp"></span>
                	</div>`

		let time = result.forecast.forecastday[0].hour[i].time;
		let temperature = result.forecast.forecastday[0].hour[i].temp_c;
		let icon = result.forecast.forecastday[0].hour[i].condition.icon;

		let timeId = "24hr-forecast-time" + i;
		let tempId = "24hr-forecast-temp" + i;
		let iconId = "24hr-forecast-icon" + i;

		document.getElementsByClassName("center-left-main-card-time")[i].setAttribute("id", timeId);
		document.getElementsByClassName("center-left-main-card-temp")[i].setAttribute("id", tempId);
		document.getElementsByClassName("center-left-main-card-icon")[i].setAttribute("id", iconId);

		document.getElementById(timeId).innerHTML = time.slice(11, 16);
		document.getElementById(iconId).innerHTML = "<img src=https://" + icon.slice(2) + ">";
		document.getElementById(tempId).innerHTML = temperature + "&deg; C";
	}

	// bottom-left-main-div
	document.getElementById("real-feel-value-bottom-left-main").innerHTML = result.current.feelslike_c + "&deg; C";
	document.getElementById("wind-speed-value-bottom-left-main").innerHTML = result.current.wind_kph + " km/h";
	document.getElementById("min-temp-value-bottom-left-main").innerHTML = result.forecast.forecastday[0].day.mintemp_c + "&deg; C";
	document.getElementById("max-temp-value-bottom-left-main").innerHTML = result.forecast.forecastday[0].day.maxtemp_c + "&deg; C";


	// right-main-div

	const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	let date = new Date();
	let x = date.getDay();

	for (let i = 0; i < 3; i++) {
		document.getElementById("right-main-info-div").innerHTML +=
			`
			<div class="right-main-card flex align-center myt-10 round-8">
                <span class="right-main-day"></span>
                <div class="flex align-center">
					<span class="right-main-icon"></span>
                	<span class="right-main-env"></span>
				</div>
                <div class="mxr-10">
                    <span class="d-block right-main-min-temp"></span>
                    <span class="d-block right-main-max-temp"></span>
                </div>
            </div>
	`

		dayId = "right-main-day-name" + i;
		envId = "right-main-day-env" + i;
		minTempId = "right-main-min-temp" + i;
		maxTempId = "right-main-max-temp" + i;
		iconId = "right-main-icon" + i;

		document.getElementsByClassName("right-main-day")[i].setAttribute("id", dayId);
		document.getElementsByClassName("right-main-env")[i].setAttribute("id", envId);
		document.getElementsByClassName("right-main-icon")[i].setAttribute("id", iconId);
		document.getElementsByClassName("right-main-min-temp")[i].setAttribute("id", minTempId);
		document.getElementsByClassName("right-main-max-temp")[i].setAttribute("id", maxTempId);

		if (i == 0)
			dayName = "Today";
		else {
			dayName = weekday[x];
		}
		x = (x + 1) % 7;

		document.getElementById(dayId).innerHTML = dayName;
		document.getElementById(envId).innerHTML = result.forecast.forecastday[i].day.condition.text;
		document.getElementById(iconId).innerHTML = "<img src=https://" + result.forecast.forecastday[i].day.condition.icon.slice(2) + ">"
		document.getElementById(minTempId).innerHTML = "Min : " + result.forecast.forecastday[i].day.mintemp_c + "&deg; C";
		document.getElementById(maxTempId).innerHTML = "Max : " + result.forecast.forecastday[i].day.maxtemp_c + "&deg; C";
	}
}

function showItems(){
	document.getElementsByClassName("left-main")[0].classList.add("hambg-1");
	document.getElementsByClassName("logo")[0].classList.add("hambg-1");
	document.getElementsByClassName("nav-links")[0].classList.add("hambg-2");
	for (let i = 0; i < document.getElementsByClassName("link-text").length; i++){
		document.getElementsByClassName("link-text")[i].classList.add("hambg-3");
	}
	document.getElementsByClassName("search-bar-div")[0].classList.add("hambg-4");
	document.getElementsByClassName("hamburger-icon")[0].classList.add("hambg-4");
	document.getElementsByClassName("cross-icon")[0].classList.add("hambg-6");
	document.getElementsByClassName("navbar")[0].classList.add("hambg-5");
}

function removeItems(){
	document.getElementsByClassName("left-main")[0].classList.remove("hambg-1");
	document.getElementsByClassName("logo")[0].classList.remove("hambg-1");
	document.getElementsByClassName("nav-links")[0].classList.remove("hambg-2");
	for (let i = 0; i < document.getElementsByClassName("link-text").length; i++){
		document.getElementsByClassName("link-text")[i].classList.remove("hambg-3");
	}
	document.getElementsByClassName("search-bar-div")[0].classList.remove("hambg-4");
	document.getElementsByClassName("hamburger-icon")[0].classList.remove("hambg-4");
	document.getElementsByClassName("cross-icon")[0].classList.remove("hambg-6");
	document.getElementsByClassName("navbar")[0].classList.remove("hambg-5");
}