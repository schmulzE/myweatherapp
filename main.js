window.onload = function() {
    let searchBox = document.querySelector('.search-box');
    let tempCity = document.querySelector('.temp-city');
    let tempIcon = document.querySelector('.temp-icon');
    let tempDegree = document.querySelector('.temp-degree');
    let tempUpdate = document.querySelector('.temp-update');
    let tempDesc = document.querySelector('.temp-desc');
    let tempFeels = document.querySelector('.temp-feels');
    let lon;
    let lat;

    const api  = {
        "key": "a58af71603b5125af5799cb38961bfea"
    };

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            console.log(position);
            lat = position.coords.latitude;
            lon = position.coords.longitude;
             
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api.key}`)
            .then((response) => {
                console.log(response);
                if(response.ok) {
                    return response.json();
                }
                throw Error('Unable to complete GET request');
            })
            .then((data) => {
                    displayResult(data);
            });
           
        });
    }

    function UpdateTime(time) {
        let newTime = time * 1000;
        const newDate = new Date(newTime);
        let hour = newDate.getHours();
        let min = newDate.getMinutes();
        let session = 'am';
        if(hour > '12') {
            hour -= '12';
            session = 'pm';       
        }
        if(hour == '0') {
            session = 'am';
        }
        let hourToString = hour.toString().padStart(2, '0');
        let minToString = min.toString().padStart(2, '0');
    
        return `updated as of ${hourToString}:${minToString}${session}`;
    }

    searchBox.addEventListener('keypress', setQuery);
    function setQuery(evt) {        
        if(evt.keyCode === 13) {
            fetchData(searchBox.value);
            searchBox.value = ''; 
        }
    }
    
    function fetchData(query) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${api.key}`)
        .then(response => response.json())
        .then(data => {
            displayResult(data);
        });
    }

    function displayResult(weather) {
        tempCity.innerHTML = `${weather.name}, ${weather.sys.country}`;
        console.log(weather.name);
        tempDegree.innerHTML = `${weather.main.temp.toFixed(0)}°c`;
        tempFeels.innerHTML = `feels like: ${weather.main.feels_like}°c`;
        tempDesc.innerHTML = `${weather.weather[0].description}`;
        tempUpdate.innerHTML = UpdateTime(weather.dt);
        tempIcon.src = ` http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`;
    }
};