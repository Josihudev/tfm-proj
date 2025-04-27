import '/css/style.css'; 
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { Feature } from 'ol';
import { Point, LineString } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import { Icon, Style, Stroke } from 'ol/style';

const initialPos = [11.111208, 49.461512]; // Nuremberg
// Variables globals
let isTracking = false;
let intervalId = null;
let currentCoord = null;
let targetCoord = null;
let initialized = false;
let elapsedTime = 0;

// Punter
const iconFeature = new Feature(new Point(fromLonLat([0, 0])));
iconFeature.setStyle(
  new Style({
    image: new Icon({
      src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      anchor: [0.5, 1],
      scale: 0.05,
    }),
  })
);
const vectorSource = new VectorSource({ features: [iconFeature] });
const vectorLayer = new VectorLayer({ source: vectorSource });

// Rastre del moviment
const lineCoords = [];
const lineGeometry = new LineString([]);
const lineFeature = new Feature({ geometry: lineGeometry });
lineFeature.setStyle(
  new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 2,
    }),
  })
);
const layer1 = new TileLayer({ source: new OSM()});
const lineSource1 = new VectorSource({ features: [lineFeature] });
const lineLayer1 = new VectorLayer({ source: lineSource1 });

// Vista i Mapa
const view = new View({
  center: fromLonLat(initialPos), // Posició inicial -- Podria preguntar al Navegador la posició actual?
  zoom: 18,
});

// Mapa
const map = new Map({
  target: 'map',
  /*layers: [
    new TileLayer({ source: new OSM() }),
    lineLayer,
    vectorLayer,
  ],*/
  layers:[
    layer1,
    lineLayer1,
    vectorLayer
  ],
  view: view,
});

//------------------------- Interfície -------------------------

const toggleTrackingBtn = document.getElementById('toggleTracking');
const speedSelect = document.getElementById('speedSelect');
const timeDisplay = document.getElementById('timeElapsed');
const showLayer1 = document.getElementById('unityAFollow');

// Event listeners
toggleTrackingBtn.addEventListener('click', toggleTracking);
speedSelect.addEventListener('change', restartTrackingSpeed);
showLayer1.addEventListener('change', showLayer);

// Mostrem segons transcorreguts - si el seguiment està activat
setInterval(displayInterval, 1000);


//------------------------- Funcions  -------------------------

function showLayer(){

  if (this.checked) {
    console.log("Checkbox is checked..");
    lineLayer1.setVisible(true);    
  } 
  else{
    console.log("Checkbox is not checked..");
    lineLayer1.setVisible(false);
  }

}

function update() {
  const style = styles[styleSelector.value];
  layer.setStyle(style);
}


function toggleTracking(){
  isTracking = !isTracking;
  toggleTrackingBtn.textContent = isTracking ? 'Pausa Seguiment' : 'Reprèn Seguiment';

  if(isTracking){
    startTracking();
  } 
  else{
    clearInterval(intervalId);
  }
}

function restartTrackingSpeed(){
  if(intervalId){
    clearInterval(intervalId);
  } 
  startTracking(); // Reiniciem amb la nova velocitat triada al selector
}

function startTracking(){
  if(intervalId !== null) clearInterval(intervalId);
  const interval = parseInt(speedSelect.value, 10);
  intervalId = setInterval(fetchAndAnimate, interval);
}

async function fetchAndAnimate(){
  try{
    const res = await fetch(`http://localhost/api-rest/?nocache=${Date.now()}`, { // No volem cache
      credentials: 'include',
      method: 'GET',   
        headers: {
          'Content-Type': 'application/json'
        }
    });
    
    const data = await res.json();
    const lon = parseFloat(data.longitude);
    const lat = parseFloat(data.latitude);
    
    if(isNaN(lon) || isNaN(lat)){
      console.warn('Coordenades no vàlides:', data);
      return;
    }
    
    const newCoord = fromLonLat([lon, lat]);

    if(!initialized) {
      iconFeature.getGeometry().setCoordinates(newCoord);
      view.setCenter(newCoord); 
      currentCoord = newCoord;
      initialized = true;
    } 
    else{
      targetCoord = newCoord;
      animateMove();
    }
  } 
  catch (e){
    console.error('Error fetchAndAnimate:', e);
  }
}

function animateMove(duration = 1000) {    
  if(!currentCoord || !targetCoord){ 
    return;
  }
  
  const start = performance.now();

  function step(timestamp) {
    const elapsed = timestamp - start;
    const fraction = Math.min(elapsed / duration, 1);

    const interpolated = [
      currentCoord[0] + (targetCoord[0] - currentCoord[0]) * fraction,
      currentCoord[1] + (targetCoord[1] - currentCoord[1]) * fraction
    ];

    iconFeature.getGeometry().setCoordinates(interpolated);

    if(fraction > 0) { // Afegim la posició interpolada a la línia
      lineCoords.push([...interpolated]); 
      lineGeometry.setCoordinates(lineCoords);
    }

    if(fraction < 1) {
      requestAnimationFrame(step);
    } 
    else{
      currentCoord = targetCoord;
    }
  }
  requestAnimationFrame(step);
}

function displayInterval(){
  if(isTracking){
    elapsedTime++;
    timeDisplay.textContent = `${elapsedTime}s`;
  }
}
