//http://w3.unpocodetodo.info/utiles/waa-analizador-de-sonido.php
//https://codepen.io/enxaneta/pen/613c5b3f253999304f009075c04c638b
//https://www.youtube.com/watch?v=41xCGwVI498&ab_channel=SoyDalto
//https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData#new_promise-based_syntax
//https://developer.spotify.com/console/put-play/
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
"user-library-read",
"user-follow-read",
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
let runMusic = null;

let time = 0;
let stop = true;
let play = false;



let musicCode = null;
let musicTime = 0;


let musicFlow=null;
var source;
//var DurationBuffer= null;
  document.getElementById("RecentlyPlayed").addEventListener("click", (e) => {
    e.preventDefault();
    //console.log(typeof(e.target.className));
    let ClassName =e.target.className;
    if(ClassName.indexOf("icon__music--play") !== -1){
      document.getElementById("reproductor").classList.toggle("none");
    //time = audioCtx.currentTime;
      const MusicUrl = e.target.getAttribute('url');
      const MusicId = e.target.id;
      audio(MusicId, MusicUrl);
    }
  });
/* points?.forEach(point => {point.addEventListener('click', (e)=> {
    document.getElementById("reproductor").classList.toggle("none");
    //time = audioCtx.currentTime;
    const music = e.target.getAttribute('cod-music');
    console.log();
    audio(music);
    //button.play();
  })
}) */
function detenerAudio() {
  fuenteDeReproduccion.stop();
  clearInterval(gettFrecuency);
  clearInterval(runMusic);
}
function audio(music, Url) {
    if(!musicFlow ){        
        musicCode,musicFlow = music;
        musicTime = 0;
        return  fetchAudio(Url);
          //return reproducirAudio(0, musicFlow == music ? true:false);
    }
    if (stop) {
      // si el audio está parado
      //time =audioCtx.currentTime;
      stop = false;
      play = true;  
      return detenerAudio();
    } 
    if (musicFlow && musicFlow !== music ) {
        musicCode,musicFlow = music;
        //console.log(musicFlow);
        musicTime = 0;
        stop = true;
        play = false;
        return  fetchAudio(Url);
        //return reproducirAudio(0, musicFlow == music? true:false);
    }
    musicCode = music;
    stop = true;
    play = false;
      return  fetchAudio(Url, musicTime);
    //return reproducirAudio(musicTime);
  }
  async function fetchAudio(url, flow = 0) {
     return  fetch(url)
    .then(res => res.ok ? Promise.resolve(res.arrayBuffer()): Promise.reject(res))    
    .then(res => audioCtx.decodeAudioData(res, function(buffer) {
      fuenteDeReproduccion = audioCtx.createBufferSource();
        fuenteDeReproduccion.buffer = buffer;
        fuenteDeReproduccion.connect(audioCtx.destination);
        fuenteDeReproduccion.connect(analizador)
        analizador.connect(audioCtx.destination);
        let musicNow = Math.trunc(fuenteDeReproduccion.buffer.duration);
        flow == 0 ?  [musicTime = musicNow, fuenteDeReproduccion.start(0,0), containerwaves.innerHTML = ""]  :
         [musicTime= flow, fuenteDeReproduccion.start(0,  musicNow - flow )]  ;
        //console.log(same);
         //console.log(flow);
        let timeCache = musicTime;
        gettFrecuency = setInterval(() => {
                  if(musicTime == 0){
                    stop = false;
                    play = true;  
                    clearInterval(gettFrecuency);
                  }else{
                    musicTime = timeCache--
                  }
                  //console.log(musicTime);
                  let bufferLength = analizador.frequencyBinCount;  
                  let dataArray = new Uint8Array(bufferLength);
                  //drawVisual = window.requestAnimationFrame(foto);
                  analizador.getByteTimeDomainData(dataArray);
                  let percentage = (((( ( (Math.max.apply(null, dataArray))).toFixed(2)/ 128  )* 100)- 100).toFixed(0)+ "%");
                  createWave(containerwaves, percentage);
           //       console.log(timeCache);
          }, 1000);
    })
    ) 
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
window.onload = function() {
    if (localStorage.getItem("TokenCode")) {
        document.getElementById("Loggin").style.display = "none";
    }else{
        document.getElementById("Loggin").style.display = "block";
    }
    //console.log(window.location.hash);
    restartToken(window.location.hash);
    const Tokken = localStorage.getItem("TokenCode");
    FetchArtistFollow(4, Tokken);
    FetchRecentlyPlayed(4, Tokken);
    //localStorage.setItem("TokenCode", "12");
  };
    // private methods
    const getToken = async () => {
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'Get',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });
        const data = await result.json();
        return data.access_token;
    };

    function FetchArtistFollow(limit=4 , Tokken) {
      return fetch(`https://api.spotify.com/v1/me/following?type=artist&limit=${limit}`, {
                        method: "GET",
                        headers: {                  
                          Authorization: `Bearer ${Tokken}`
                        }
                      }
                    )
      .then(res => res.ok ? Promise.resolve(res): Promise.reject(res))    
      .then(res => res.json()
      .then(res => {
          for (const iterator of res.artists.items) {
                let Img = iterator.images[2].url;
                let Tittle =iterator.name;
                let Description = iterator.genres;
                paintBlocks("ArtistsFollowed",Img, Tittle, Description, null, null, null)
                //console.log(iterator.genres);
          }
      })
      )
    }
    function FetchRecentlyPlayed(limit=3 , Tokken) {
      return fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, {
                        method: "GET",
                        headers: {                  
                          Authorization: `Bearer ${Tokken}`
                        }
                      }
                    )
      .then(res => res.ok ? Promise.resolve(res): Promise.reject(res))    
      .then(res => res.json()
      .then(res => {
          for (const iterator of res.items) {
                let artists = [];
                let Img = iterator.track.album.images[1].url;
                //let Tittle =iterator;
                let Description = iterator.track.name;
                //paintFollowArtis(Img, Tittle, Description)
                //console.log(iterator.genres);
                for (const artist of iterator.track.artists) {
                  artists.push(artist.name);
                }
                let UrlPlay = iterator.track.preview_url;
                let Id = iterator.track.id;
               
                paintBlocks("RecentlyPlayed", Img, artists, Description, true, UrlPlay, Id)
          }
      })
      )
    }
  function paintBlocks(Nodo=null,img, Tittle, Description = [], button = null, Play = null, Id= null) {
    const NodeArtistsFollowed =document.getElementById(Nodo);
    const FrgmntArtist = document.createDocumentFragment();
    const FrgmntTittle = document.createDocumentFragment();
    const FrgmntDescription = document.createDocumentFragment();
    const FrgmnButtonOption = document.createDocumentFragment();
    const FrgmntOption = document.createDocumentFragment();
    const MusicDiv = document.createElement("div");
        MusicDiv.classList.add("music");
        const newImage = document.createElement('img');
          newImage.setAttribute('src', img);
          newImage.classList.add('music__image');
        const DescriptionDiv = document.createElement("div");
              DescriptionDiv.classList.add("music__description");
        const TittleDescr = document.createElement("div");
        TittleDescr.setAttribute("class", "music__description--tittle");
        const TittleContent= document.createElement("SPAN");
          TittleContent.classList.add("description__tittle--name");
          TittleContent.textContent= Tittle;
        const DescriptionContent = document.createElement("SPAN");
          DescriptionContent.classList.add("description__tittle--artist");
          DescriptionContent.textContent=Description.toString();
          FrgmntTittle.appendChild(TittleContent);
          FrgmntTittle.appendChild(DescriptionContent);
        TittleDescr.appendChild(FrgmntTittle);
        DescriptionDiv.appendChild(newImage);
        DescriptionDiv.appendChild(TittleDescr);
        FrgmntDescription.appendChild(DescriptionDiv);
        /* Node music Option */
      const MusicOption = document.createElement("div");
        MusicOption.classList.add("music__option");
      const BtnOption = document.createElement("A");
        BtnOption.classList.add("icon__music", "icon__music-points");

        if(button){
          const BtnPlay = document.createElement("A");
            BtnPlay.setAttribute("url", Play);
            BtnPlay.setAttribute("id", Id);
            BtnPlay.classList.add("icon__music", "icon__music--play");
            
            BtnPlay.setAttribute("href", "#");
            
            FrgmnButtonOption.appendChild(BtnPlay);
        }
        FrgmnButtonOption.appendChild(BtnOption);
      MusicOption.appendChild(FrgmnButtonOption);
      MusicDiv.appendChild(FrgmntDescription);
      MusicDiv.appendChild(MusicOption);
      FrgmntArtist.appendChild(MusicDiv);
        //Adding to div Principal
        NodeArtistsFollowed.appendChild(FrgmntArtist);
  }
//getToken();


