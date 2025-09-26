window.addEventListener('load', ()=>{
    let long;
    let lat;
    let apiKey ="1b749d41f9cb4c407684cc74a9c35dcc";
    var xhr = new XMLHttpRequest();    

 
    
   
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position =>{
            long = position.coords.longitude;
            lat = position.coords.latitude;
            
            //get city
            xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=3ce057b00b59e1&lat=" + 
            lat + "&lon=" + long + "&format=json", true); 
            xhr.send(); 
            xhr.onreadystatechange = processRequest; 
            xhr.addEventListener("readystatechange", processRequest, false); 
              function processRequest(e) { 
                if (xhr.readyState == 4 && xhr.status == 200) { 
                 var response = JSON.parse(xhr.responseText); 
                 var city = response.address.city; 
                 console.log(city); 
                 let location = city;
                 if (city == 'undefined') {document.getElementById('city').textContent = 'Today'
                     
                 } else {
                    document.getElementById('city').textContent = city+', Today'
                 }
                 
                return location; 
            } 
            //get current day
            var days = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ];
            let today= days[new Date().getDay()];
            console.log(today);
            } 

            console.log('lat:'+(Math.round(lat *100)/100)+' long:'+(Math.round(long *100)/100))
            
            //weather call
            const api ='https://api.openweathermap.org/data/3.0/onecall?lat='+(Math.round(lat *100)/100)+'&lon='+(Math.round(long *100)/100)+'&appid='+apiKey+'&units=metric';
            fetch(api)
                .then(response=> {
                    return response.json();
                })
                .then(data =>{
                    console.log(data);

                    //current
                    document.getElementById('now-temp').textContent = Math.round(data.current.temp *10)/10 +'°';
                    document.getElementById('now-rain').textContent = Math.round(100* data.hourly[0].pop) +'%';
                    document.getElementById('now-rain-ico').style.opacity = data.hourly[0].pop;
                    document.getElementById('now-img').src = './icons/weather/' + data.current.weather[0].icon + '.svg';
                    let nowWind = Math.round(data.current.wind_speed *3.6)
                    document.getElementById('now-wind').textContent = nowWind
                    if (nowWind < 50 ){
                        document.getElementById('now-wind-ico').style.opacity = nowWind*2+'%';
                    }else{ document.getElementById('now-wind-ico').style.opacity = "1"; 
                    }

                    
                    //upcomin time
                    let time= new Date().getHours();
                    console.log(time);

                    let t1 = time+1;
                    let t2 = time+2;
                    let t3 = time+3;
                    let t4 = time+4;
                    let t5 = time+5;

                    if (t1>24) { t1 = t1-24; }
                    if (t2>24) { t2 = t2-24; }
                    if (t3>24) { t3 = t3-24; }
                    if (t4>24) { t4 = t4-24; }
                    if (t5>24) { t5 = t5-24; }

                    let i=1

                    for (let i = 1; i < 6; i++) {
                        
                        //time
                        var hour = time+i
                        if (hour>24) { hour = hour-24; }
                        document.getElementById('H'+i).textContent = hour+':00'

                        //icon
                        document.getElementById('H'+i+'Icon').src = './icons/weather/' + data.hourly[i].weather[0].icon + '.svg';

                        //temp
                        document.getElementById('H'+i+'Temp').textContent = Math.round(data.hourly[i].temp) +'°';
                        
                        //rain
                        document.getElementById('H'+i+'Rain').textContent = Math.round(100* data.hourly[i].pop) +'%';
                        
                        //speical blue
                        if (data.hourly[i].pop > 0.3) {

                            document.getElementById('H'+i+'Rain').style.color = '#41A0FF';
                            //document.getElementById('H'+i+'Rain').style.fontWeight = 'bold';
                            document.getElementById('H'+i+'RainIcon').src = './icons/MiniRainBlue.svg';

                        }
                    }
                    

                    

                    //tomorrow
                    var days = [
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday"
                    ];
                    document.getElementById('tomorrow-day').textContent = days[(new Date().getDay())+1];
                    document.getElementById('tomorrow-ico').src = './icons/weather/' + data.daily[1].weather[0].icon + '.svg';
                    document.getElementById('tomorrow-weather').textContent = data.daily[1].weather[0].description;


                    let tempDif = Math.round(data.daily[0].temp.day - data.daily[1].temp.day);
                    
                    if (tempDif > 0) {
                        document.getElementById('tomorrow-temp').textContent = tempDif + '° colder than today'
                        
                    } else {
                        if (tempDif <0 ) {
                            document.getElementById('tomorrow-temp').textContent = (-tempDif) + '° warmer than today'
                        } else {
                            document.getElementById('tomorrow-temp').textContent = 'temperatures will be the same'
                        }
                        
                    }

                    //temp tomorrow
                    document.getElementById('morning-temp').textContent = Math.round(data.daily[0].temp.morn)+ '°';
                    document.getElementById('afternoon-temp').textContent = Math.round(data.daily[0].temp.day)+ '°';
                    document.getElementById('night-temp').textContent = Math.round(data.daily[0].temp.night)+ '°';

                    //icon tomorrow
                    hToMidnight = (24 - new Date().getHours());
                    document.getElementById('morning-img').src = './icons/weather/' + data.hourly[(hToMidnight+9)].weather[0].icon + '.svg';
                    document.getElementById('afternoon-img').src = './icons/weather/' + data.hourly[(hToMidnight+16)].weather[0].icon + '.svg';
                    document.getElementById('night-img').src = './icons/weather/' + data.hourly[(hToMidnight+22)].weather[0].icon + '.svg';

                    //sunrise and sunset
                    if (new Date(data.daily[1].sunrise*1000).getMinutes() < 10) {
                        sunriseMin = '0'+ new Date(data.daily[1].sunrise*1000).getMinutes();
                    } else {
                        sunriseMin = new Date(data.daily[1].sunrise*1000).getMinutes();
                    }
                    if (new Date(data.daily[0].sunset*1000).getMinutes() < 10) {
                        sunsetMin = '0'+ new Date(data.daily[0].sunset*1000).getMinutes();
                    } else {
                        sunsetMin = new Date(data.daily[0].sunset*1000).getMinutes();
                    }
                    let sunrise = new Date(data.daily[1].sunrise*1000).getHours() + ':' + sunriseMin;
                    let sunset = new Date(data.daily[0].sunset*1000).getHours()+ ':'+ sunsetMin;
                    console.log(sunrise + ' '+ sunset);

                    document.getElementById('sunset').textContent = 'sunset ' + sunset;
                    document.getElementById('sunrise').textContent = 'sunrise '+ sunrise;

                    // adpatative section
                    let today= days[new Date().getDay()];

                    //monday
                    if (today == 'Monday') {
                        //hide
                        document.getElementById('next').style.display = 'none';

                        let i=0;
                        // this week
                        document.getElementById('weekday1-img').src = './icons/weather/' + data.daily[i+2].weather[0].icon + '.svg';
                        document.getElementById('weekday1-temp').textContent = Math.round(data.daily[i+2].temp.day *10)/10+ '°';
                        document.getElementById('weekday1-detail').textContent = Math.round(100* data.daily[i+2].pop) + '% rain, ' + Math.round(data.daily[i+2].wind_speed *3.6) + 'km/h wind';

                        document.getElementById('weekday2-img').src = './icons/weather/' + data.daily[i+3].weather[0].icon + '.svg';
                        document.getElementById('weekday2-temp').textContent = Math.round(data.daily[i+3].temp.day *10)/10+ '°';
                        document.getElementById('weekday2-detail').textContent = Math.round(100* data.daily[i+3].pop) + '% rain, ' + Math.round(data.daily[i+3].wind_speed *3.6) + 'km/h wind';

                        document.getElementById('weekday3-img').src = './icons/weather/' + data.daily[i+4].weather[0].icon + '.svg';
                        document.getElementById('weekday3-temp').textContent = Math.round(data.daily[i+4].temp.day *10)/10+ '°';
                        document.getElementById('weekday3-detail').textContent = Math.round(100* data.daily[i+4].pop) + '% rain, ' + Math.round(data.daily[i+4].wind_speed *3.6) + 'km/h wind';

                        //weekend
                        document.getElementById('sat-img').src = './icons/weather/' + data.daily[i+5].weather[0].icon + '.svg';
                        document.getElementById('sat-temp').textContent = Math.round(data.daily[i+5].temp.day *10)/10+ '°';
                        document.getElementById('sat-rain-ico').style.opacity = data.daily[i+5].pop;
                        document.getElementById('sat-rain').textContent = Math.round(100* data.daily[i+5].pop) +'%';
                        let satWind = Math.round(data.daily[i+5].wind_speed *3.6);
                        document.getElementById('sat-wind').textContent = satWind
                        if (nowWind < 50 ){
                        document.getElementById('sat-wind-ico').style.opacity = satWind *2 +'%';
                        }else{ document.getElementById('satwind-ico').style.opacity = "1"; }
                        
                        document.getElementById('sun-img').src = './icons/weather/' + data.daily[i+6].weather[0].icon + '.svg';
                        document.getElementById('sun-temp').textContent = Math.round(data.daily[i+6].temp.day *10)/10+ '°';
                        document.getElementById('sun-rain-ico').style.opacity = data.daily[i+6].pop;
                        document.getElementById('sun-rain').textContent = Math.round(100* data.daily[i+6].pop) +'%';
                        let sunWind = Math.round(data.daily[i+6].wind_speed *3.6);
                        document.getElementById('sun-wind').textContent = sunWind
                        if (nowWind < 50 ){
                        document.getElementById('sun-wind-ico').style.opacity = sunWind*2 +'%';
                        }else{ document.getElementById('sunwind-ico').style.opacity = "1"; }                 

                    }

                    //Wednesday
                    if (today == 'Wednesday') {
                        //hide
                        document.getElementById('next').style.display = 'none';
                        document.getElementById('weekday1').style.display = 'none';
                        document.getElementById('weekday2').style.display = 'none';

                        let i=-2;
                        // this week
                        document.getElementById('weekday1-img').src = './icons/weather/' + data.daily[i+2].weather[0].icon + '.svg';
                        document.getElementById('weekday1-temp').textContent = Math.round(data.daily[i+2].temp.day *10)/10+ '°';
                        document.getElementById('weekday1-detail').textContent = Math.round(100* data.daily[i+2].pop) + '% rain, ' + Math.round(data.daily[i+2].wind_speed *3.6) + 'km/h wind';

                        document.getElementById('weekday2-img').src = './icons/weather/' + data.daily[i+3].weather[0].icon + '.svg';
                        document.getElementById('weekday2-temp').textContent = Math.round(data.daily[i+3].temp.day *10)/10+ '°';
                        document.getElementById('weekday2-detail').textContent = Math.round(100* data.daily[i+3].pop) + '% rain, ' + Math.round(data.daily[i+3].wind_speed *3.6) + 'km/h wind';

                        document.getElementById('weekday3-img').src = './icons/weather/' + data.daily[i+4].weather[0].icon + '.svg';
                        document.getElementById('weekday3-temp').textContent = Math.round(data.daily[i+4].temp.day *10)/10+ '°';
                        document.getElementById('weekday3-detail').textContent = Math.round(100* data.daily[i+4].pop) + '% rain, ' + Math.round(data.daily[i+4].wind_speed *3.6) + 'km/h wind';

                        //weekend
                        document.getElementById('sat-img').src = './icons/weather/' + data.daily[i+5].weather[0].icon + '.svg';
                        document.getElementById('sat-temp').textContent = Math.round(data.daily[i+5].temp.day *10)/10+ '°';
                        document.getElementById('sat-rain-ico').style.opacity = data.daily[i+5].pop;
                        document.getElementById('sat-rain').textContent = Math.round(100* data.daily[i+5].pop) +'%';
                        let satWind = Math.round(data.daily[i+5].wind_speed *3.6);
                        document.getElementById('sat-wind').textContent = satWind
                        if (nowWind < 50 ){
                        document.getElementById('sat-wind-ico').style.opacity = satWind*2 +'%';
                        }else{ document.getElementById('satwind-ico').style.opacity = "1"; }
                        
                        document.getElementById('sun-img').src = './icons/weather/' + data.daily[i+6].weather[0].icon + '.svg';
                        document.getElementById('sun-temp').textContent = Math.round(data.daily[i+6].temp.day *10)/10+ '°';
                        document.getElementById('sun-rain-ico').style.opacity = data.daily[i+6].pop;
                        document.getElementById('sun-rain').textContent = Math.round(100* data.daily[i+6].pop) +'%';
                        let sunWind = Math.round(data.daily[i+6].wind_speed *3.6);
                        document.getElementById('sun-wind').textContent = sunWind
                        if (nowWind < 50 ){
                        document.getElementById('sun-wind-ico').style.opacity = sunWind*2+'%';
                        }else{ document.getElementById('sunwind-ico').style.opacity = "1"; }                 

                    }

                    //Tuseday
                    if (today == 'Tuesday') {
                        //hide
                        document.getElementById('next').style.display = 'none';
                        document.getElementById('weekday1').style.display = 'none';

                        let i=-1;
                        // this week
                        document.getElementById('weekday1-img').src = './icons/weather/' + data.daily[i+2].weather[0].icon + '.svg';
                        document.getElementById('weekday1-temp').textContent = Math.round(data.daily[i+2].temp.day *10)/10+ '°';
                        document.getElementById('weekday1-detail').textContent = Math.round(100* data.daily[i+2].pop) + '% rain, ' + Math.round(data.daily[i+2].wind_speed *3.6) + 'km/h wind';

                        document.getElementById('weekday2-img').src = './icons/weather/' + data.daily[i+3].weather[0].icon + '.svg';
                        document.getElementById('weekday2-temp').textContent = Math.round(data.daily[i+3].temp.day *10)/10+ '°';
                        document.getElementById('weekday2-detail').textContent = Math.round(100* data.daily[i+3].pop) + '% rain, ' + Math.round(data.daily[i+3].wind_speed *3.6) + 'km/h wind';

                        document.getElementById('weekday3-img').src = './icons/weather/' + data.daily[i+4].weather[0].icon + '.svg';
                        document.getElementById('weekday3-temp').textContent = Math.round(data.daily[i+4].temp.day *10)/10+ '°';
                        document.getElementById('weekday3-detail').textContent = Math.round(100* data.daily[i+4].pop) + '% rain, ' + Math.round(data.daily[i+4].wind_speed *3.6) + 'km/h wind';

                        //weekend
                        document.getElementById('sat-img').src = './icons/weather/' + data.daily[i+5].weather[0].icon + '.svg';
                        document.getElementById('sat-temp').textContent = Math.round(data.daily[i+5].temp.day *10)/10+ '°';
                        document.getElementById('sat-rain-ico').style.opacity = data.daily[i+5].pop;
                        document.getElementById('sat-rain').textContent = Math.round(100* data.daily[i+5].pop) +'%';
                        let satWind = Math.round(data.daily[i+5].wind_speed *3.6);
                        document.getElementById('sat-wind').textContent = satWind
                        if (nowWind < 50 ){
                        document.getElementById('sat-wind-ico').style.opacity = satWind*2+'%';
                        }else{ document.getElementById('satwind-ico').style.opacity = "1"; }
                        
                        document.getElementById('sun-img').src = './icons/weather/' + data.daily[i+6].weather[0].icon + '.svg';
                        document.getElementById('sun-temp').textContent = Math.round(data.daily[i+6].temp.day *10)/10+ '°';
                        document.getElementById('sun-rain-ico').style.opacity = data.daily[i+6].pop;
                        document.getElementById('sun-rain').textContent = Math.round(100* data.daily[i+6].pop) +'%';
                        let sunWind = Math.round(data.daily[i+6].wind_speed *3.6);
                        document.getElementById('sun-wind').textContent = sunWind
                        if (nowWind < 50 ){
                        document.getElementById('sun-wind-ico').style.opacity = sunWind*2+'%';
                        }else{ document.getElementById('sunwind-ico').style.opacity = "1"; }                 

                    }

                     //Thursday
                                        if (today == 'Thursday') {
                                            //hide
                                            document.getElementById('next').style.display = 'none';
                                            document.getElementById('thisweekdiv').style.display = 'none';
                                            
                                            
                    
                                            let i=-3;
                                          
                                            //weekend
                                            document.getElementById('sat-img').src = './icons/weather/' + data.daily[i+5].weather[0].icon + '.svg';
                                            document.getElementById('sat-temp').textContent = Math.round(data.daily[i+5].temp.day *10)/10+ '°';
                                            document.getElementById('sat-rain-ico').style.opacity = data.daily[i+5].pop;
                                            document.getElementById('sat-rain').textContent = Math.round(100* data.daily[i+5].pop) +'%';
                                            let satWind = Math.round(data.daily[i+5].wind_speed *3.6);
                                            document.getElementById('sat-wind').textContent = satWind
                                            if (nowWind < 50 ){
                                            document.getElementById('sat-wind-ico').style.opacity = satWind*2+'%';
                                            }else{ document.getElementById('satwind-ico').style.opacity = "1"; }
                                            
                                            document.getElementById('sun-img').src = './icons/weather/' + data.daily[i+6].weather[0].icon + '.svg';
                                            document.getElementById('sun-temp').textContent = Math.round(data.daily[i+6].temp.day *10)/10+ '°';
                                            document.getElementById('sun-rain-ico').style.opacity = data.daily[i+6].pop;
                                            document.getElementById('sun-rain').textContent = Math.round(100* data.daily[i+6].pop) +'%';
                                            let sunWind = Math.round(data.daily[i+6].wind_speed *3.6);
                                            document.getElementById('sun-wind').textContent = sunWind
                                            if (nowWind < 50 ){
                                            document.getElementById('sun-wind-ico').style.opacity = sunWind*2+'%';
                                            }else{ document.getElementById('sunwind-ico').style.opacity = "1"; }                 
                    
                                        }
                //Friday
                if (today == 'Friday') {
                    //hide
                    document.getElementById('thisweekdiv').style.display = 'none';
                    document.getElementById('saturday').style.display = 'none';
                    document.getElementById('end-title').style.display = 'none';
                    document.getElementById('tomorrow').textContent = 'Weekend';

                    let i=-4;
                  
                    //weekend
                                        
                    document.getElementById('sun-img').src = './icons/weather/' + data.daily[i+6].weather[0].icon + '.svg';
                    document.getElementById('sun-temp').textContent = Math.round(data.daily[i+6].temp.day *10)/10+ '°';
                    document.getElementById('sun-rain-ico').style.opacity = data.daily[i+6].pop;
                    document.getElementById('sun-rain').textContent = Math.round(100* data.daily[i+6].pop) +'%';
                    let sunWind = Math.round(data.daily[i+6].wind_speed *3.6);
                    document.getElementById('sun-wind').textContent = sunWind;
                    if (nowWind < 50 ){
                    document.getElementById('sun-wind-ico').style.opacity = sunWind*2+'%';
                    }else{ document.getElementById('sunwind-ico').style.opacity = "1"; }  
                    
                    //nextweek
                    let x = 1;
                    for(let x =1; x<6; x++){

                        document.getElementById(x+'-img').src = './icons/weather/' + data.daily[i+x+6].weather[0].icon + '.svg';
                        document.getElementById(x+'-temp').textContent = Math.round(data.daily[i+x+6].temp.day *10)/10+ '°';
                        document.getElementById(x+'-rain-ico').style.opacity = data.daily[i+x+6].pop;
                        document.getElementById(x+'-rain').textContent = Math.round(100* data.daily[i+x+6].pop) +'%';
                        let sunWind = Math.round(data.daily[i+x+6].wind_speed *3.6);
                        document.getElementById(x+'-wind').textContent = sunWind
                        if (nowWind < 50 ){
                        document.getElementById(x+'-wind-ico').style.opacity = sunWind*2+'%';
                        }else{ document.getElementById(x+'-wind-ico').style.opacity = "1"; }  

                    }

                }
                
                                //Saturday
                                if (today == 'Saturday') {
                                    //hide
                                    document.getElementById('thisweekdiv').style.display = 'none';
                                    
                                    document.getElementById('end').style.display = 'none';
                                    
                
                                    let i=-5;
                                                                                        
                                   
                                    
                                    //nextweek
                                    let x = 1;
                                    for(let x =1; x<6; x++){
                
                                        document.getElementById(x+'-img').src = './icons/weather/' + data.daily[i+x+6].weather[0].icon + '.svg';
                                        document.getElementById(x+'-temp').textContent = Math.round(data.daily[i+x+6].temp.day *10)/10+ '°';
                                        document.getElementById(x+'-rain-ico').style.opacity = data.daily[i+x+6].pop;
                                        document.getElementById(x+'-rain').textContent = Math.round(100* data.daily[i+x+6].pop) +'%';
                                        let sunWind = Math.round(data.daily[i+x+6].wind_speed *3.6);
                                        document.getElementById(x+'-wind').textContent = sunWind
                                        if (nowWind < 50 ){
                                        document.getElementById(x+'-wind-ico').style.opacity = sunWind*2+'%';
                                        }else{ document.getElementById(x+'-wind-ico').style.opacity = "1"; }  
                
                                    }
                
                                }
             //Sunday
             if (today == 'Sunday') {
                //hide
                document.getElementById('thisweekdiv').style.display = 'none';
                
                document.getElementById('end').style.display = 'none';
                document.getElementById('nextmonday').style.display = 'none';
                

                let i=-6;
                                                                    
               
                
                //nextweek
                let x = 1;
                for(let x =1; x<6; x++){

                    document.getElementById(x+'-img').src = './icons/weather/' + data.daily[i+x+6].weather[0].icon + '.svg';
                    document.getElementById(x+'-temp').textContent = Math.round(data.daily[i+x+6].temp.day *10)/10+ '°';
                    document.getElementById(x+'-rain-ico').style.opacity = data.daily[i+x+6].pop;
                    document.getElementById(x+'-rain').textContent = Math.round(100* data.daily[i+x+6].pop) +'%';
                    let sunWind = Math.round(data.daily[i+x+6].wind_speed *3.6);
                    document.getElementById(x+'-wind').textContent = sunWind
                    if (nowWind < 50 ){
                    document.getElementById(x+'-wind-ico').style.opacity = sunWind*2+'%';
                    }else{ document.getElementById(x+'-wind-ico').style.opacity = "1"; }  

                }

            }

                })

                

        })
    }
})
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  showInstallPromotion();
});