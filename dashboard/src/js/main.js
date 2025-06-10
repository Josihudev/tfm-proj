// JavScript principal. 
// El Vite necessita que els posem aquï
import '../css/style.css'; // General
import '../css/sidebar.css';  // Barra lateral Opcions
import '../css/intervention.css';  // Barra lateral Control Interevenció
import '../css/topbar.css'; // Barra superior
import '../css/modals.css'; // Finestres modals
import 'ol/ol.css'; // Estil d'OpenLayers

import { createMap } from './map.js'; // Mòdul Mapa
import { createTracker } from './tracker.js'; // Mòdul Tracker
import { initSidebar } from './sidebar.js'; // Barra Opcions
import { initTopbar } from './topbar.js'; // Barra menú superior
import { initImportModal } from './bomberIntegration.js'; // Controlador importador bombers
import { createBomberInterface } from './bomberInterface.js'; // Interfícies dels bombers al COntrol de la Intervenció
import { createTrackerInterface } from './trackerInterface.js'; // Tracker del bomber
import { initMapMarkers } from './mapMarkers.js';  // Marcadors sobre el mapa

const allTrackers = []; // Emmagatzema tots els trackers actius

// Creem un mapa amb un punt inicial
const initialPos = [11.111208, 49.461512]; // Nuremberg
const map = createMap(initialPos);
//------------------------- Interfície -------------------------
initSidebar();  // Inicialitza menú Opcions barra lateral

initTopbar();       // Inicialitza menú barra superior

initImportModal({   // Modal d'Importació de BOmbers - Al carregar-se mostra dades al mapa i al menú Control de la Intervenció
    map,                // Mapa creat
    createTracker,      // Tracker associat al bomber
    createBomberInterface,  // Interfície amb les dades del bomber
    createTrackerInterface,          // Interfície del tracker per bomber   
    allTrackers             // Array per guardar tots els trackers actius
});

initMapMarkers({map});  // Menú per afegir marcadors sobre el mapa
