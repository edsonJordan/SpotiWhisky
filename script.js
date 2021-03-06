//http://w3.unpocodetodo.info/utiles/waa-analizador-de-sonido.php
//https://codepen.io/enxaneta/pen/613c5b3f253999304f009075c04c638b
//https://www.youtube.com/watch?v=41xCGwVI498&ab_channel=SoyDalto
//https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData#new_promise-based_syntax
//https://developer.spotify.com/console/put-play/
const CLIENT_ID = "194749ef76664a5e902ddee34d4c8b73"; // insert your client id here from spotify
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = "https://edsonjordan.github.io/SpotiWhisky/";//https://edsonjordan.github.io/SpotiWhisky/
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

//Event listener icon Sign out
document.getElementById("Sign_out").addEventListener("click", function() {
    localStorage.clear();
    window.location.href = REDIRECT_URL_AFTER_LOGIN;
  });
//Event Listener Icon Search Words Key
document.getElementById('search-icon').addEventListener('change', (e) => {
  const searchInput = document.getElementById('search-input');
        document.getElementById("header").classList.toggle("header_active");
        document.getElementById("input-search").focus();
        document.getElementById("container__search").classList.toggle("none");
  
});
//Event Listener input search music
document.getElementById("input-search")?.addEventListener("keyup", (e) => {
  const Tokken = localStorage.getItem("TokenCode");
    let NodeContainerSearch = document.getElementById("container__search").className;
    if(NodeContainerSearch.indexOf("none") !== -1) document.getElementById("container__search").classList.remove("none");
   
    if(e.target.value.length > 3 ){
      let word = e.target.value;
      SearchWord(Tokken, word);
      }
}

);
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


/* Events clicks More data  */
document.querySelectorAll(".icon__view--more").forEach(point => {
    point.addEventListener("click", (e) => {
        const NodeAttribute = e.target.getAttribute("attr-section");
        const Tokken = localStorage.getItem("TokenCode");
        switch (true) {
          case NodeAttribute === "RecentlyPlayed":
            //FetchArtistFollow(4, Tokken);
            //FetchRecentlyPlayed(3, Tokken);
            //FetchPlayList("", 4, Tokken);
              //FetchRecentlyPlayed(3, Tokken, LastRecentlyPlayed)
            break;
          case NodeAttribute === "ArtistsFollowed":
            FetchArtistFollow(2, Tokken, LastArtistsFollowed);
            /* const NodeArtistNode = document.getElementById("artistsFollowed");
            NodeArtistNode.scrollTo(0, NodeArtistNode.scrollHeight) */
            break;
          case NodeAttribute === "RecentlyPlayList":
            //const PlayListNode = document.getElementById("RecentlyPlayList");
            
            FetchPlayList("", 4, Tokken, PlayList);
            
           
          break;
            
        }
    });
});
//Event Listener Loggin Button
document.getElementById("Loggin")?.addEventListener("click", () => {
  //window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=user-read-currently-playing%20user-top-read`;
  window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
});
/* Event Listener button back */
document.getElementById("back").addEventListener("click", (e) => {
    e.preventDefault();
    if(stop) {
      stop = false;
      play = true;  
       detenerAudio();
    }
    ListMusic =  {};
    PositionMusic = 0;
    document.getElementById("reproductor").classList.toggle("none");
});
//Event Listener Click Play RecentlyPlayed
document.getElementById("RecentlyPlayed").addEventListener("click", (e) => {
  e.preventDefault();
  //console.log(typeof(e.target.className));
  let ClassName =e.target.className;
  let PositionMusic= 0;
  ListMusic =  {};
  if(ClassName.indexOf("icon__music--play") !== -1){
    if(stop) {
      stop = true;
      play = false;  
    }
    
    
    document.getElementById("reproductor").classList.toggle("none");
  //time = audioCtx.currentTime;
    const MusicUrl = e.target.getAttribute('url');
    const MusicId = e.target.id;
    const InputChecket = document.getElementById("icon__play");
    if(InputChecket.checked = true){
      InputChecket.setAttribute("checked", false)
    }
    
    audio(MusicId, MusicUrl);

    document.getElementById("reproductor__cards").innerHTML="";
    const Id = e.target.getAttribute('id');
    const Tittle = e.target.getAttribute('attr-tittle');
    const Description = e.target.getAttribute('attr-description');
    const Image = e.target.getAttribute('attr-img');
    const Url = e.target.getAttribute('url');
    //ListMusic = ListMusic.push([{musi:MusicId, url:MusicUrl, position:PositionMusic}]);}
    ListMusic[PositionMusic]= {CodeMusic:MusicId, UrlMusic:MusicUrl, PositionMusic:PositionMusic};

    const BtnPrevious = document.getElementById("btn-previous");
    const BtnNext = document.getElementById("btn-next");
    BtnPrevious.setAttribute("href", `#`);
    BtnNext.setAttribute("href", `#`);

    PaintReproductorCards("reproductor__cards", Image, Tittle, Description,Id);
 
  }
});
//Event Listener Click container search
document.getElementById("container__search").addEventListener("click", (e) => {
  e.preventDefault();
  //console.log(typeof(e.target.className));
  let ClassName =e.target.className;
  const MusicUrl = e.target.getAttribute('url');
  if(ClassName.indexOf("icon__music--play") !== -1){
    if(MusicUrl == "null") {
      return alert("Musica no disponible");
    }
    document.getElementById("reproductor").classList.toggle("none");
  //time = audioCtx.currentTime;
    const MusicId = e.target.id;


    const InputChecket = document.getElementById("icon__play");
    if(InputChecket.checked = true){
      InputChecket.setAttribute("checked", false)
    }
    audio(MusicId, MusicUrl);
    document.getElementById("reproductor__cards").innerHTML="";
    const Id = e.target.getAttribute('id');
    const Tittle = e.target.getAttribute('attr-tittle');
    const Description = e.target.getAttribute('attr-description');
    const Image = e.target.getAttribute('attr-img');
    const Url = e.target.getAttribute('url');

    ListMusic[PositionMusic]= {CodeMusic:MusicId, UrlMusic:MusicUrl, PositionMusic:PositionMusic};
    //Buttons Arrow Next and Previous
    const BtnPrevious = document.getElementById("btn-previous");
    const BtnNext = document.getElementById("btn-next");
    BtnPrevious.setAttribute("href", `#`);
    BtnNext.setAttribute("href", `#`);
    PaintReproductorCards("reproductor__cards", Image, Tittle, Description,Id);
  }
});
//Event Listener Click Play PlayList from ArtistFollowed
document.getElementById("ArtistsFollowed").addEventListener("click", (e) => {

  let ClassName =e.target.className;
  let FirstAudio = false;
  if(ClassName.indexOf("icon__music--play") !== -1){
    e.preventDefault();
    

    
    const IdArtist= e.target.getAttribute('id');
    const Tokken = localStorage.getItem("TokenCode");
    //console.log(IdArtist);
    document.getElementById("reproductor__cards").innerHTML="";

    const InputChecket = document.getElementById("icon__play");
    if(InputChecket.checked = true){
      InputChecket.setAttribute("checked", false)
    }
    
    if(screen.width<768){
      document.getElementById("reproductor").classList.remove("none");
    }
    
    
    if(stop) {
      stop = true;
      play = false;  
    }
    ListMusic =  {};
    PositionMusic = 0;
    
    //detenerAudio();
    
    FetchArtistTrack(IdArtist, Tokken);  
    
    //btn_next.setAttribute("href", `${IdArtist}`);
    //btn-next
    //audio(MusicId, MusicUrl);  
  }
});
//Event Listener Click Play track from PlayList
document.getElementById("RecentlyPlayList").addEventListener("click", (e) => {
  let ClassName =e.target.className;
  if(ClassName.indexOf("icon__music--play") !== -1){
    e.preventDefault();
    const IdArtist= e.target.getAttribute('id');
    const Tokken = localStorage.getItem("TokenCode");

    document.getElementById("reproductor__cards").innerHTML="";
    const InputChecket = document.getElementById("icon__play");
    if(InputChecket.checked = true){
      InputChecket.setAttribute("checked", false)
    }
    if(screen.width<768){
      document.getElementById("reproductor").classList.remove("none");
    }
    if(stop) {
      stop = true;
      play = false;  
    }
    ListMusic =  {};
    PositionMusic = 0;
    FetchPlayListTracks(IdArtist, 15, Tokken, 0);
   /*  
    //console.log(IdArtist);
    document.getElementById("reproductor__cards").innerHTML="";

    const InputChecket = document.getElementById("icon__play");
    if(InputChecket.checked = true){
      InputChecket.setAttribute("checked", false)
    }
    
    if(screen.width<768){
      document.getElementById("reproductor").classList.remove("none");
    } */

    //FetchArtistTrack(IdArtist, Tokken);  
    
    //btn_next.setAttribute("href", `${IdArtist}`);
    //btn-next
    //audio(MusicId, MusicUrl);  
  }
});
//Event Listener Click on Buttons Next and Previous
document.querySelectorAll(".reproductor__option--arrow").forEach(element => {
  element.addEventListener("click", (e) => {
    const NodeName = e.target.className;
    let IconPlay = document.getElementById("icon__play");
    const BtnPrevious = document.getElementById("btn-previous");
    const BtnNext = document.getElementById("btn-next");
    if(BtnPrevious.getAttribute("href") == "#" && BtnNext.getAttribute("href") == "#") return false

    switch (true) {      
      case NodeName.indexOf("reproductor__option--previous") !== -1:
      detenerAudio();
      PositionMusic--;  
      if(PositionMusic === -1) PositionMusic = 0;
      if(IconPlay.checked = true){
        IconPlay.setAttribute("checked", false)
      }
      stop = false;
      play = true;
      audio(ListMusic[(PositionMusic)].CodeMusic, ListMusic[(PositionMusic)].UrlMusic);
      BtnPrevious.setAttribute("href", `#link${ListMusic[(PositionMusic)].CodeMusic}`);
      BtnNext.setAttribute("href", `#link${ListMusic[(PositionMusic+1)].CodeMusic}`);
      
        break;


      case NodeName.indexOf("reproductor__option--next") !== -1:
      detenerAudio();
      PositionMusic++;
      if(PositionMusic == Object.keys(ListMusic).length ){
        PositionMusic--
      } 
      if(IconPlay.checked = true){
        IconPlay.setAttribute("checked", false)
      }
      stop = false;
      play = true;
      audio(ListMusic[(PositionMusic-1)].CodeMusic, ListMusic[PositionMusic].UrlMusic);
      BtnPrevious.setAttribute("href", `#link${ListMusic[(PositionMusic-1)].CodeMusic}`);
      BtnNext.setAttribute("href", `#link${ListMusic[(PositionMusic)].CodeMusic}`);

      
          break;
      }
      removeParamrUrl();

  });
});
//Event Listener Click Option Arrow from Reproductor
document.getElementById("reproductor__option").addEventListener("click", (e) => {
  if(e.target.className == "reproductor__option--arrow"){
    console.log("click");
  }
});
//Event Listener Icon Play to Reproductor
document.getElementById("icon__play").addEventListener("change", (e) => {
    //document.getElementById("reproductor__cards").innerHTML="";
   //console.log(ListMusic);
   const IconPlay = document.getElementById("icon__play");
   if(ListMusic[0] === undefined ) {
     
    return true;
   }
    (IconPlay.checked)? IconPlay.setAttribute("checked", false) : true;

    const CodMusic = ListMusic[(PositionMusic)].CodeMusic;
    const UrlMusic = ListMusic[(PositionMusic)].UrlMusic;
    audio(CodMusic, UrlMusic);
   
   
}
);
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
  if(hash.length<70) return
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
/* var bufferLength = analizador.frequencyBinCount;  
var dataArray = new Uint8Array(bufferLength); */
analizador.fftSize = 2048;// [32, 64, 128, 256, 512, 1024, 2048]

var dataArray = new Uint8Array(analizador.frequencyBinCount);
const button = document.getElementById("audio");
const points = document.querySelectorAll('.icon__music--play');
var url, audio, fuenteDeReproduccion;

let ProgresFrecuency = null;
let gettFrecuency = null;
let runMusic = null;

let stop = true;
let play = false;

let musicCode = null;
let musicTime = 0;

let musicFlow=null;
let ProgressValue=0;


let LastArtistsFollowed ;
let PlayList = 0;

//Variables para el reproductor
let ListMusic =  Object();
let PositionMusic = 0;
let ArrowPlay = false;
//var DurationBuffer= null;
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
      // si el audio est?? parado
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
        const NodeProgress = document.getElementById("ProgressBar");
        NodeProgress.setAttribute("value", 0);
        ProgressValue = 0;
        return  fetchAudio(Url);
        //return reproducirAudio(0, musicFlow == music? true:false);
    }
    musicCode = music;
    stop = true;
    play = false;
      return  fetchAudio(Url, (musicTime/1000));
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
        let Progress= musicTime * 1000;
        let TotalProgress =  (Math.trunc(fuenteDeReproduccion.buffer.duration) * 1000);
        const NodeProgress = document.getElementById("ProgressBar");
        
        gettFrecuency = setInterval(() => {
                  Progress = Progress-100
                  if(Progress % (TotalProgress/100) == 0){
                    ProgressValue++;
                    //console.log(ProgressValue);                   
                    NodeProgress.setAttribute("value", ProgressValue);
                   }

                  if(Progress == 0){
                    stop = false;
                    play = true;  
                    ProgressValue = 0;
                    const InputChecket = document.getElementById("icon__play");
                      if(InputChecket.checked = false){
                        InputChecket.setAttribute("checked", true)
                        }
                    clearInterval(gettFrecuency);
                  }
                  musicTime = Progress;
                  let bufferLength = analizador.frequencyBinCount;  
                  let dataArray = new Uint8Array(bufferLength);
                  //drawVisual = window.requestAnimationFrame(foto);
                  analizador.getByteTimeDomainData(dataArray);
                  let NumberPercentage = (Progress/1000);
                  if(Number.isInteger(NumberPercentage)){
                    let percentage = (((( ( (Math.max.apply(null, dataArray))).toFixed(2)/ 128  )* 100)- 100).toFixed(0)+ "%");
                    createWave(containerwaves, percentage);
                  }
                  
                  
                   
           //       console.log(timeCache);
          }, 100);
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
  let DataUserApi ;

  function removeParamrUrl(){
    const nextURL = REDIRECT_URL_AFTER_LOGIN;
    var url=document.location.href;
  return history.replaceState('',null,nextURL);;
  }
window.onload = function() {
    /* if (localStorage.getItem("TokenCode")) {
        document.getElementById("Loggin").style.display = "none";
    }else{
        document.getElementById("Loggin").style.display = "flex";
    } */
    //console.log(window.location.hash);
    
    restartToken(window.location.hash);
    let Tokken = localStorage.getItem("TokenCode");
    FetchArtistFollow(4, Tokken, 0);
    FetchRecentlyPlayed(10, Tokken, null);
    FetchPlayList(3, 4, Tokken);
    //FetchArUserData(Tokken);
  };


    //Remove parameter anchor from url
    
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
    function FetchArtistFollow(limit=3 , Tokken, after = null) {
      return fetch(`https://api.spotify.com/v1/me/following?type=artist&limit=${limit}&after=${after}`, {
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
                let Id = iterator.id;
                //
                /* let UrlPlay = iterator.track.preview_url;
                     */
                paintBlocks("ArtistsFollowed",Img, Tittle, Description, true, null, Id)
                //console.log(iterator.genres); 
               LastArtistsFollowed= iterator.id;
          }
          document.getElementById("Loggin").style.display = "none";
        }))
      .catch(res => {
         console.log(res);
      })
    }
    function FetchArtistTrack(IdArtist, Tokken) {
                    return fetch(`https://api.spotify.com/v1/artists/${IdArtist}/top-tracks?market=ES`, {
                      method: "GET",
                      headers: {                  
                        Authorization: `Bearer ${Tokken}`
                      }
                    }
                  )
              .then(res => res.ok ? Promise.resolve(res): Promise.reject(res))    
              .then(res => res.json()
              .then(res => {
                ListMusic={};
                  const btn_next = document.getElementById("btn-next");
                  const btn_previous = document.getElementById("btn-previous");
                  let CountPosition = 0;
                    for (const iterator of res.tracks) {                      
                      let Tittle =iterator.name;
                      let Img = iterator.album.images[0].url
                      let Description = iterator.album.name;
                      let IdMusic = iterator.id;
                      let UrlPlay = iterator.preview_url; 
                      ListMusic[CountPosition]= {CodeMusic:IdMusic, UrlMusic:UrlPlay, PositionMusic:CountPosition};
                      
                      /* if(CountPosition == 0) {                        
                        btn_previous.setAttribute("href", `#link${IdMusic}`);
                      } */
                      if(CountPosition == 0) {
                        btn_previous.setAttribute("href", `#link${IdMusic}`);                       
                      }
                      if(CountPosition == 1) {
                        btn_next.setAttribute("href", `#link${IdMusic}`);
                      }
                      CountPosition++
                      PaintReproductorCards("reproductor__cards", Img, Tittle, Description,IdMusic);                                             
                    }                                    
                    audio(ListMusic[0].CodeMusic, ListMusic[0].UrlMusic);
              }))
              .catch(res => {
                      console.log(res);
              })
    }
    function FetchRecentlyPlayed(limit=3 , Tokken, after = null) {  
      let url = !after? `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`
                    :  `https://api.spotify.com/v1/me/player/recently-played?limit=20`;
      return fetch(url, {
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
      }))
      .catch(res => {
        console.log(res);
     })
    }
    function FetchPlayList(User = null, limit=4, Tokken, offset = null) {
                  return fetch(`https://api.spotify.com/v1/me`, {
                    method: "GET",
                    headers: {                  
                      Authorization: `Bearer ${Tokken}`
                    }
                  }
                )
            .then(res => res.ok ? Promise.resolve(res): Promise.reject(res))    
            .then(res => res.json()
            .then(res => {
              //const UserId = res.id;
              let url = !offset? `https://api.spotify.com/v1/me/playlists?limit=${limit}`
                  : `https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`;;
                     return fetch(url, {
                      method: "GET",
                      headers: { Authorization: `Bearer ${Tokken}`}
                      })
                      .then(res => res.ok ? Promise.resolve(res): Promise.reject(res))    
                      .then(res => res.json()
                      .then(res => {
                      for (const iterator of res.items) {
                        let Img = iterator.images[0].url;
                        let Tittle =iterator.name;
                        let Description = iterator.description;
                        let IdPlayList = iterator.id;
                        paintBlocks("RecentlyPlayList",Img, Tittle, Description, true, null, IdPlayList)
                        PlayList++;
                        }
                      })
                    ).catch(res => {
                      console.log(res);
                   })
              /* Object.values(res).forEach(function(key) {
              console.log(key);
              //params.push({"id":key, "option":"Igual", "value":params[key].id})
              }); */
            }))
            .catch(res => {
              console.log(res);
           })
            
    }
    function FetchPlayListTracks(IdPlayList, limit=null, Tokken, offset = 0) {
              return fetch(`https://api.spotify.com/v1/playlists/${IdPlayList}/tracks?market=ES&fields=items(track(id%2Cname%2Cpreview_url%2Calbum(name%2Cimages%2Chref)))&limit=${limit}&offset=${offset}`, {
                method: "GET",
                headers: {                  
                  Authorization: `Bearer ${Tokken}`
                }
              }
            )
        .then(res => res.ok ? Promise.resolve(res): Promise.reject(res))    
        .then(res => res.json()
        .then(res => {
          ListMusic={};
            const btn_next = document.getElementById("btn-next");
            const btn_previous = document.getElementById("btn-previous");
            let CountPosition = 0;
              for (const iterator of res.items) {             
                let Tittle =iterator.track.album.name;
                let Description =iterator.track.name;
                let Img = iterator.track.album.images[1].url;
                let IdMusic = iterator.track.id;
                let UrlPlay = iterator.track.preview_url; 

                ListMusic[CountPosition]= {CodeMusic:IdMusic, UrlMusic:UrlPlay, PositionMusic:CountPosition};
                if(CountPosition == 0) {
                  btn_previous.setAttribute("href", `#link${IdMusic}`);                       
                }
                if(CountPosition == 1) {
                  btn_next.setAttribute("href", `#link${IdMusic}`);
                }
                CountPosition++
                PaintReproductorCards("reproductor__cards", Img, Tittle, Description,IdMusic);                                                        
              }                            
              audio(ListMusic[0].CodeMusic, ListMusic[0].UrlMusic);
        }))
        .catch(res => {
                console.log(res);
        })
    }
    function SearchWord(Tokken, word = null) {
        return fetch(`https://api.spotify.com/v1/search?q=${word}&type=track&limit=20&offset=0`, {
          method: "GET",
          headers: {                  
            Authorization: `Bearer ${Tokken}`
          }
        }
      )
      .then(res => res.ok ? Promise.resolve(res): Promise.reject(res))    
      .then(res => res.json()
      .then(res => {
        document.getElementById("container__search").innerHTML="";
      for (const iterator of res.tracks.items) {
        let artists = [];
        let Img = iterator.album.images[1].url;
      
        let Tittle =iterator.name;
       /*  let Description = iterator.album.album_type; */
        for (const artist of iterator.artists) {
          artists.push(artist.name);
        }
        let Id = iterator.id;
        let UrlPlay = iterator.preview_url;
        
        paintBlocks("container__search", Img, artists, Tittle, true, UrlPlay, Id,)
        }
      
      }))
      .catch(res => {
        console.log(res);
        document.getElementById("Loggin").style.display = "flex";
     })
    }
  function paintBlocks(Nodo=null,img, Tittle, Description = [], button = false, Play = null, Id= null) {
    const NodoContainer =document.getElementById(Nodo);
    
    const FrgmntArtist = document.createDocumentFragment();
    const FrgmntTittle = document.createDocumentFragment();
    const FrgmntDescription = document.createDocumentFragment();
    const FrgmnButtonOption = document.createDocumentFragment();
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
            BtnPlay.setAttribute("attr-tittle", Tittle);
            BtnPlay.setAttribute("attr-description",Description.toString());
            BtnPlay.setAttribute("attr-img", img);
            BtnPlay.setAttribute("href", "#");            
            FrgmnButtonOption.appendChild(BtnPlay);
        }
        FrgmnButtonOption.appendChild(BtnOption);
      MusicOption.appendChild(FrgmnButtonOption);
      MusicDiv.appendChild(FrgmntDescription);
      MusicDiv.appendChild(MusicOption);
      FrgmntArtist.appendChild(MusicDiv);
        //Adding to div Principal
        NodoContainer.appendChild(FrgmntArtist);
  }
  function PaintReproductorCards(Nodo=null,img, Tittle, Description = [], Id= null){
    const NodoContainer =document.getElementById(Nodo);
    const FrgmnCardDescription = document.createDocumentFragment();
        const DivOptionIconLiked = document.createElement("div");
        DivOptionIconLiked.classList.add("option__icon--liked");
        const FrgmntCardImg = document.createDocumentFragment();
        const FrgmntOptionIconLiked = document.createDocumentFragment();
        const InputOption= document.createElement("INPUT");
        InputOption.setAttribute("type", "checkbox");
        InputOption.classList.add("none", "input__liked");
        InputOption.setAttribute("id", "check".Id);
        const LabelOption = document.createElement("LABEL");
        LabelOption.classList.add("option__icon", "option__label--liked");
        LabelOption.setAttribute("for", "check".Id);
        FrgmntOptionIconLiked.appendChild(InputOption);
        FrgmntOptionIconLiked.appendChild(LabelOption);
        DivOptionIconLiked.appendChild(FrgmntOptionIconLiked);
        const ImgCard = document.createElement("img");
        ImgCard.setAttribute("src", img);
        ImgCard.classList.add("img__card");
        ImgCard.setAttribute('Width', 262.5);
        ImgCard.setAttribute('Height', 280.13);
        FrgmntCardImg.appendChild(ImgCard);
        FrgmntCardImg.appendChild(DivOptionIconLiked);
        const DivCardImg = document.createElement("div");
        DivCardImg.classList.add("card__image");
      DivCardImg.appendChild(FrgmntCardImg);
        const DivCardDescription = document.createElement("div");
        DivCardDescription.classList.add("card__description");
        const H3CardDescription = document.createElement("h3");
        H3CardDescription.classList.add("card__description--tittle");
        H3CardDescription.textContent = Tittle;
        const PcardDescription = document.createElement("p");
        PcardDescription.classList.add("card__description--artist");
        PcardDescription.textContent = Description.toString();
        FrgmnCardDescription.appendChild(H3CardDescription);
        FrgmnCardDescription.appendChild(PcardDescription);
        DivCardDescription.appendChild(FrgmnCardDescription);
        const DivCard = document.createElement("div");
        DivCard.classList.add("card");
        DivCard.setAttribute("id", `link${Id}`);
        DivCard.appendChild(DivCardImg);
        DivCard.appendChild(DivCardDescription);
        NodoContainer.appendChild(DivCard);
  }
//getToken();