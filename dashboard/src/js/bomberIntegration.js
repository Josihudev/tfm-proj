// Controlador de la lògica d'importació i creació de bombers i trackers
// Integra tots els components (interfície, tracker, bombona, etc...)

import { setupImportModal } from './importModalInterface.js';
import { createBombona } from './bombona.js';
import { createHealth } from './health.js';
import {fetchBomberStatus, resetSimulation } from './apiClient.js';

let bomberData = [];

export async function importDataRFID(){
    const response = await fetch('/extern-data/RFID/bombers.json');
    const json = await response.json();
    return json.bombers;
}

export function initImportModal({
    map,
    createTracker,
    createBomberInterface,
    createTrackerInterface,
    allTrackers
}){
    setupImportModal({
        onOpen: async (modalFileSelect)=>{
            try {
                bomberData = await importDataRFID();
                bomberData.forEach((bomber, index) =>{
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = bomber.nom_bomber;
                    modalFileSelect.appendChild(option);
                });
            }
            catch(err){
                console.error('Error important dades RFID', err);
                alert('No s’ha pogut importar les dades RFID');
            }
        },

        onSelectBomber: (selectedIndex)=>{
            const data = bomberData[selectedIndex];
            
            if(document.getElementById(`bomber-${data.id_bomber}`)){
                alert('Aquest bomber ja està carregat.');
                return;
            }

            // Reinicia la simulació de l'API abans de crear el Bomber
            resetSimulation(data.id_bomber, data.kml_origin);
            
            createFullBomberUnit({
                data, map, createTracker, createBomberInterface, createTrackerInterface, allTrackers
            });
        }
    });
    
    // Crea i afegeix la interfície del bomber
    // Inicialitza el seu tracker
    // Connecta la bombona
    // Connecta el monitor del ritme cardíac
    // Gestiona la seva eliminació 
    function createFullBomberUnit({ 
        data,
        map,
        createTracker,
        createBomberInterface,
        createTrackerInterface,
        allTrackers
    }){
        const bombersContainer = document.getElementById('bombersContainer');
        const minutsInputSet = document.getElementById('minutsInputSet');

        const bomberDiv = createBomberInterface({
            bomber: data,
            container: bombersContainer,
            minutsInputSet,
            onDelete: (id)=>{
                const index = allTrackers.findIndex(t => t.bomberId === id);
                if(index !== -1){
                    const tracker = allTrackers[index];

                    if (tracker.health){
                        tracker.health.setMonitoringHeart(false);
                    }

                    if (tracker.bombona){
                        tracker.bombona.setConsumingOxigen(false);
                    }
                    if(tracker.iconLayer && map){
                        map.removeLayer(tracker.iconLayer);
                    }
                    if(tracker.lineLayer && map){
                        map.removeLayer(tracker.lineLayer);
                    }
                    if(tracker.intervalId){
                        clearInterval(tracker.intervalId);
                    }

                    allTrackers.splice(index, 1);
                }
            },
            allTrackers
        });

        const {tracker, elements} = createTrackerInterface({
            bomber: data,
            map,
            createTracker,
            container: bomberDiv,
            minutsInputSet
        });

        // Connecta la bombona del bomber
       const oxigenSet = document.getElementById('oxigenInputSet'); // alarma de bombona
       const bombona = createBombona({
            onUpdate: (oxigenPercent) => {
                const oxigenElement = bomberDiv.querySelector('.oxigen-value');
                if (oxigenElement){
                    oxigenElement.textContent = `${oxigenPercent}%`;

                    if( oxigenPercent <=  oxigenSet.value  ){ // alarma. Pinta amb roig
                        oxigenElement.classList.add('red-text');
                    }
                }
            }
        });

        // Associa bombona al tracker
        tracker.bombona = bombona;
        tracker.bomberId = data.id_bomber;

        // Monitor de BPM's
        const bpmSet = document.getElementById('bpmInputSet'); // alarma de bpm's
        const beatsPerMinute = createHealth({
            onUpdate: (bpm) => {
                const bpmElement = bomberDiv.querySelector('.bpm-value');
                if (bpmElement){
                    bpmElement.textContent = `${bpm} bpm's`;

                    if( bpm >=  bpmSet.value  ){ // alarma. Pinta amb roig nomès quan el valor està per damunt. SI està per sota deixa l'estil normal
                        bpmElement.classList.add('red-text');
                    }
                    else{
                        bpmElement.classList.remove('red-text');
                    }                    
                }
            }
        });

         // Associa bombona al tracker
        tracker.health = beatsPerMinute;

        // Botons i interfície
        const controlsDiv = document.createElement('div');
        controlsDiv.classList.add("bomber-controls");
        controlsDiv.appendChild(elements.trackingBtn);
        controlsDiv.appendChild(elements.checkboxDiv);
        bomberDiv.appendChild(controlsDiv);

        // Crea el label
        const label = document.createElement('label');
        label.textContent = 'Temps:'; // Assigna el text al label
        label.classList.add('timer-label'); 
        label.appendChild(elements.timerElement);
        bomberDiv.appendChild(label); 
        
        // Interval automàtic de seguiment (sense toggle)
        const intervalId = setInterval(async()=>{
            try {
                const { bpm, oxigen, position } = await fetchBomberStatus({ idBomber: data.id_bomber, originData: data.kml_origin });
                
                tracker.update(position);      // Actualitza la posició
                bombona.update(oxigen);        // Actualitza l'oxigen
                beatsPerMinute.update(bpm);        // Actualitza els bpms
            } catch (e){
                console.error('Error actualitzant bomber:', e);
            }
        }, 2000);

        tracker.intervalId = intervalId;

        // tracker a l'array de trackers
        allTrackers.push(tracker);
    }
}
