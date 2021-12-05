//http://w3.unpocodetodo.info/utiles/waa-analizador-de-sonido.php
//https://codepen.io/enxaneta/pen/613c5b3f253999304f009075c04c638b
//https://www.youtube.com/watch?v=41xCGwVI498&ab_channel=SoyDalto
document.getElementById('search-icon').addEventListener('change', (e) => {
    const searchInput = document.getElementById('search-input');
    document.getElementById("header").classList.toggle("header_active");
    document.getElementById("input-search").focus();
});
document.getElementById("navigation-icon").addEventListener("change", (e) => {
    document.getElementById("ul__navigation").classList.toggle("ul__navigation--active");
    document.getElementById("ul__navigation").classList.remove("none");
    document.getElementById("button--cancel").classList.remove("none");
});
document.getElementById("button--cancel").addEventListener("click", (e) => {
    document.getElementById('navigation-icon').checked = false;
    document.getElementById("ul__navigation").classList.add("none");
    document.getElementById("ul__navigation").classList.toggle("ul__navigation--active");
    e.target.classList.add("none");
});

document.getElementById("ul__navigation").addEventListener("click", (e) => {
    let active = document.getElementById("ul__navigation").getElementsByClassName('li__navigation--active')[0];
    const marker = document.getElementById("li--marker");   
    if (e.target.tagName === "LI") {
        active.classList.remove("li__navigation--active");
        e.target.classList.add("li__navigation--active");
        let lat = e.target.offsetTop;
        marker.style.top = (lat-2) + "px";
    }
});
/* Events clicks points  */

/* Event Listener butotn back */
document.getElementById("back").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("reproductor").classList.toggle("none");
});
const CLIENT_ID = "e666d111cbeb49f897e1a05352690b42"; // insert your client id here from spotify
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:5500/";
const SPACE_DELIMITER = "%20";
const SCOPES = ["user-read-currently-playing",
"user-read-playback-state",
"playlist-read-private", 
"user-read-playback-position",
"user-read-recently-played",
"user-top-read"];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

document.getElementById("Loggin")?.addEventListener("click", () => {
    //window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=user-read-currently-playing%20user-top-read`;
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
});
const getReturnedParamsFromSpotifyAuth = (hash) => {
    const stringAfterHashtag = hash.substring(1);
    const paramsInUrl = stringAfterHashtag.split("&");
    const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
    const [key, value] = currentValue.split("=");
      accumulater[key] = value;
      return accumulater;
    }, {});
    return paramsSplitUp;
  };

function restartToken(hash) {
    if (hash) {
            const { access_token } =
            getReturnedParamsFromSpotifyAuth(hash);
            localStorage.clear();
            localStorage.setItem("TokenCode", access_token);
            window.location.href = REDIRECT_URL_AFTER_LOGIN;
        }

}




var audioCtx =new (window.AudioContext || window.webkitAudioContext) ;
var analizador =    analizador = audioCtx.createAnalyser();
var bufferLength = analizador.frequencyBinCount;  
  
var dataArray = new Uint8Array(bufferLength);

analizador.fftSize = 2048;// [32, 64, 128, 256, 512, 1024, 2048]

var dataArray = new Uint8Array(analizador.frequencyBinCount);
const button = document.getElementById("audio");
const points = document.querySelectorAll('.icon__music--play');
var url, audio, fuenteDeReproduccion;
let gettFrecuency = null;
let played = [];
let time = 0;
let stop = true;
let play = false;
let musicCode=null;
points?.forEach(point => {point.addEventListener('click', (e)=> {
    document.getElementById("reproductor").classList.toggle("none");
    //time = audioCtx.currentTime;
    audio();
    //button.play();
  })
})


function detenerAudio() {
  fuenteDeReproduccion.stop();
  clearInterval(gettFrecuency);
}
function audio() {
    //console.log(audioCtx.currentTime);
  if (stop) {
    // si el audio está parado
    //time = audioCtx.currentTime;
  
    reproducirAudio();
    //time =audioCtx.currentTime;
    stop = false;
    play = true;
  } else {
    // de lo contrario
    detenerAudio();
    stop = true;
    play = false;
  }
  //console.log(time);
}
solicitarAudio(
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/222579/Kevin_MacLeod_-_Camille_Saint-Sans_Danse_Macabre_-_Finale.mp3"
);
function solicitarAudio(url) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    request.onload = function() {
      audioCtx.decodeAudioData(request.response, function(buffer) {
        audioBuffer = buffer;
      });
    };
    request.send();
  }
  const containerwaves=  document.getElementById("container__onda");
  function createWave(container, heightNode = "10%") {
    const fragment = document.createDocumentFragment() 
    const nodechild = document.createElement("div");
    nodechild.setAttribute('class', 'onda');  
    nodechild.style.height = heightNode;
    fragment.appendChild(nodechild);
    container.appendChild(fragment)
  }
  function reproducirAudio() {
    
    fuenteDeReproduccion = audioCtx.createBufferSource();
    fuenteDeReproduccion.buffer = audioBuffer;
    fuenteDeReproduccion.connect(audioCtx.destination);
    fuenteDeReproduccion.connect(analizador)
    analizador.connect(audioCtx.destination);
    fuenteDeReproduccion.start(audioCtx.currentTime);

    
    let height = containerwaves.clientHeight;
    if (time == 0) {
      containerwaves.innerHTML = "";
      gettFrecuency= setInterval(function(){
        var bufferLength = analizador.frequencyBinCount;  
  
        var dataArray = new Uint8Array(bufferLength);
  
        //drawVisual = window.requestAnimationFrame(foto);
        analizador.getByteTimeDomainData(dataArray);
        let percentage = (((( ( (Math.max.apply(null, dataArray))).toFixed(2)/ 128  )* 100)- 100).toFixed(0)+ "%");
        createWave(containerwaves, percentage);
        //Time musical 
        //fuenteDeReproduccion.buffer.duration
        
        //Time actual
        //audioCtx.currentTime
        console.log();
      }, 1000);
     }else{
      gettFrecuency= setInterval(function(){
       
  
        //drawVisual = window.requestAnimationFrame(foto);
        analizador.getByteTimeDomainData(dataArray);
        let percentage = (((( ( (Math.max.apply(null, dataArray))).toFixed(2)/ 128  )* 100)- 100).toFixed(0)+ "%");
        //console.log(percentage);
        createWave(containerwaves, percentage);
        //Time musical 
        //fuenteDeReproduccion.buffer.duration
        
        //Time actual
        //audioCtx.currentTime
      }, 1000);
     }


      
  }
function foto(){
  drawVisual = window.requestAnimationFrame(foto);
  console.log(time);
  /* var bufferLength = analizador.frequencyBinCount;  
  var dataArray = new Uint8Array(bufferLength);
  drawVisual = window.requestAnimationFrame(foto);
  analizador.getByteTimeDomainData(dataArray);
  console.log(Math.max.apply(null, dataArray)); */
      /* setInterval(function() {
        if(!stop || audioBuffer && audioCtx.currentTime - time >= audioBuffer.duration){
          
          var bufferLength = analizador.frequencyBinCount;  
          var dataArray = new Uint8Array(bufferLength);
          drawVisual = window.requestAnimationFrame(foto);
          analizador.getByteTimeDomainData(dataArray);
          console.log(Math.max.apply(null, dataArray)); 
        }
      }, 1000); */
      //Musica almacenada en buffer
         //fuenteDeReproduccion.buffer

  }
 
window.onload = function() {
    if (localStorage.getItem("TokenCode")) {
        //document.getElementById("Loggin").style.display = "none";
    }else{
        //document.getElementById("Loggin").style.display = "block";
    }
    //console.log(window.location.hash);
    restartToken(window.location.hash);
  };
    



    // private methods
    /* const getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });
        const data = await result.json();
        console.log(data);
        return data.access_token;
    }; */
//getToken();