// Mòdul Tracker
// Comments: Dibuixa un bomber sobre un mapa i el seu moviment

import { fromLonLat } from 'ol/proj';
import { Vector as VectorLayer } from 'ol/layer';
import { Feature } from 'ol';
import { Point, LineString } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import { Icon, Style, Stroke, Text, Fill } from 'ol/style';

export function createTracker({ map, iconUrl, color, name }){
  
    let currentCoord = null;
    let targetCoord = null;
    let initialized = false;
    
    const lineCoords = [];    
    const lineGeometry = new LineString([]);
    const lineFeature = new Feature({geometry: lineGeometry});

    lineFeature.setStyle(new Style({
        stroke: new Stroke({ color, width: 2 })
    }));

    const lineSource = new VectorSource({features: [lineFeature]});
    const lineLayer = new VectorLayer({source: lineSource});

    const iconFeature = new Feature(new Point(fromLonLat([0, 0])));
    iconFeature.setStyle(new Style({
        image: new Icon({
            src: iconUrl,
            anchor: [0.5, 1],
            scale: 0.05,
        }),

        text: new Text({  // Per mostrar el nom del bomber damunt del punter
            text: name || '',              // Mostrar nom bomber si està definit
            offsetY: -25,                  // Text sobre la icona
            font: '14px Calibri,sans-serif',
            fill: new Fill({ color: '#000' }),
            stroke: new Stroke({ color: '#fff', width: 3 }),
        }),

    }));
    const vectorSource = new VectorSource({ features: [iconFeature] });
    const vectorLayer = new VectorLayer({ source: vectorSource });

    map.addLayer(lineLayer);
    map.addLayer(vectorLayer);

    //------------------------- Funcions  -------------------------
    
    function update(position){
        
        const longitude = parseFloat(position.longitude);
        const latitude = parseFloat(position.latitude);

        if (typeof latitude !== 'number' || typeof longitude !== 'number') return;

        const newCoord = fromLonLat([longitude, latitude]);

        
        if (!initialized){
            iconFeature.getGeometry().setCoordinates(newCoord);
            currentCoord = newCoord;
            initialized = true;
        } else {
            targetCoord = newCoord;
            animateMove();
        }
    }

    function animateMove(duration = 1000){ // Referència: https://www.w3schools.com/jsref/met_win_requestanimationframe.asp
        
        if(!currentCoord || !targetCoord){
            return; 
        } 
        
        const start = performance.now();

        function step(timestamp){
            const elapsed = timestamp - start;
            const fraction = Math.min(elapsed / duration, 1);
            const interpolated = [
                currentCoord[0] + (targetCoord[0] - currentCoord[0]) * fraction,
                currentCoord[1] + (targetCoord[1] - currentCoord[1]) * fraction,
            ];
            
            iconFeature.getGeometry().setCoordinates(interpolated);

            if(fraction > 0){
                lineCoords.push([...interpolated]);
            } 

            lineGeometry.setCoordinates(lineCoords);
            
            if(fraction < 1){
                requestAnimationFrame(step);
            }            
            else{
                currentCoord = targetCoord;
            } 
        }

        requestAnimationFrame(step);
    }

    function setLineVisible(visible){
        lineLayer.setVisible(visible);
    }

    return {
        update, 
        setLineVisible,        
        iconLayer: vectorLayer,
        lineLayer: lineLayer,
        getColor: () => color  // X accedir directament al color del tracker
    };
}
