// Comments: JS principal. 
// El Vite necessita que els posem aquï
import '../css/style.css'; 
import '../css/sidebar.css'; 
import '../css/intervention.css'; 
import '../css/topbar.css'; 
import '../css/modals.css'; 
import 'ol/ol.css';

import { createMap } from './map.js'; // Mòdul Mapa
import { createTracker } from './tracker.js'; // Mòdul Tracker
import { initSidebar } from './sidebar.js';
import { initTopbar } from './topbar.js';
import { initImportModal } from './bomberIntegration.js';
import { createBomberInterface } from './bomberInterface.js';
import { createTrackerInterface } from './trackerInterface.js';

import { initMapMarkers } from './mapMarkers.js';

const allTrackers = [];

// Creem un mapa amb un punt inicial
const initialPos = [11.111208, 49.461512]; // Nuremberg
const map = createMap(initialPos);
//------------------------- Interfície -------------------------
initSidebar();

initTopbar();

initImportModal({
    map,                // Mapa creat
    createTracker,      // Tracker associat al bomber
    createBomberInterface,  // Interfície amb les dades del bomber
    createTrackerInterface,          // Interfície del tracker per bomber   
    allTrackers             // Array per guardar tots els trackers actius
});

initMapMarkers({map});  //Manú per afegir marcadors sobre el mapa
