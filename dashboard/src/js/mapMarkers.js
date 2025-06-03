import { Feature } from 'ol';
import { Point } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Icon, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import Translate from 'ol/interaction/Translate'; // Per moure els marcadors
import { closeAllMenus } from './topbar';


export function initMapMarkers({map}) {

    // Capa per afegir les icones d'incidents
    const incidentSource = new VectorSource();
    const incidentLayer = new VectorLayer({ source: incidentSource });
    map.addLayer(incidentLayer);

    // Mou els marcadors (arrastrant-los amb el punter- o amb el dit)
    const translate = new Translate({
        features: incidentSource.getFeaturesCollection()
    });
    map.addInteraction(translate);
    
    document.addEventListener('DOMContentLoaded', ()=>{

        const modal = document.getElementById('markerModal');
        const addIconBtn = document.getElementById('addMarkerBtn');
        const closeModalBtn = document.getElementById('closeModalMarker');
        const overlay = document.getElementById('overlayid');

        let selectedIconUrl = null;
        let placingIcon = false;

        // Obrir modal
        addIconBtn.addEventListener('click', ()=>{
            closeAllMenus();
            modal.classList.remove('hidden');            
            modal.classList.add('active');
            overlay.classList.add('active');
        });

        // Tancar modal
        closeModalBtn.addEventListener('click', ()=>{
            placingIcon = false;
            overlay.classList.remove('active');
            modal.classList.add('hidden');
            modal.classList.remove('active');        
        });
         
        // Escollir icona i esperar clic sobre el mapa
        modal.querySelectorAll('button[data-icon]').forEach(btn =>{
            btn.addEventListener('click', () => {
                selectedIconUrl = btn.getAttribute('data-icon');
                placingIcon = true;
                overlay.classList.remove('active');
                modal.classList.add('hidden');
                modal.classList.remove('active');                       
            });
        });

        // Clic sobre al mapa
        map.on('click', function(evt) {
            
            if(!placingIcon || !selectedIconUrl){
                return;
            }

            const coord = evt.coordinate;
            const feature = new Feature({
                geometry: new Point(coord)
            });

            feature.setStyle(new Style({
                image: new Icon({
                src: selectedIconUrl,
                scale: 0.07,
                anchor: [0.5, 1],
                })
            }));

            incidentSource.addFeature(feature);
            placingIcon = false;  // Permet col·locar només una icona per clic
        });

        // Elimina marcador amb el clic dret
        // Captura event botó dret -menú contextual
        // Útil per Desktop- inútil per tauletes
        map.getViewport().addEventListener('contextmenu', function(evt){
            
            evt.preventDefault();

            const pixel = map.getEventPixel(evt);
            const feature = map.forEachFeatureAtPixel(pixel,function(feature){
                return feature;
            });

            if(feature && incidentSource.hasFeature(feature)){
                incidentSource.removeFeature(feature);
            }
        });

        // Eliminar marcador amb un clic llarg (per tauletes)
        let touchTimer = null;

        map.getViewport().addEventListener('touchstart', function(evt) {
            if(evt.touches.length !== 1){
                return;
            }

            const touch = evt.touches[0];
            const pixel = map.getEventPixel(touch);

            touchTimer = setTimeout(() => {

                const feature = map.forEachFeatureAtPixel(pixel, function(feature){ // Retorna la primera feature que troba al pixel clicat
                    return feature;
                });

                if (feature && incidentSource.hasFeature(feature)) {
                    incidentSource.removeFeature(feature);
                }
            }, 600); // Clic llarg = 600ms
        });

        map.getViewport().addEventListener('touchend', function() {
            clearTimeout(touchTimer);
        });

    });

    return{
        clearMarkers: ()=> incidentSource.clear(),  // Eliminar marcadors
        getLayer: ()=> incidentLayer,
    };
}

export function clearMapMarkers() {
    const incidentLayers = map.getLayers().getArray().filter(layer => {
        return layer instanceof VectorLayer && layer.getSource() instanceof VectorSource;
    });

    incidentLayers.forEach(layer => {
        layer.getSource().clear();
    });
}
