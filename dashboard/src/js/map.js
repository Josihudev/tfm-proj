// Mòdul MAPA ONPENLAYERS 
// Paràmetre entrada: Posició inicial per situar el punter sobre el mapa.
// Retorna: new Map

import Map from 'ol/Map'; // The map is the core component of OpenLayers. For a map to render, a view, one or more layers, and a target container are needed [https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html]
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { Feature } from 'ol';
import { Point, LineString } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import { Icon, Style, Stroke } from 'ol/style';

export function createMap(initialPos){    
   
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

    const vectorSource = new VectorSource({features: [iconFeature]});
    const vectorLayer = new VectorLayer({source: vectorSource});

    // Rastre del moviment
    const lineGeometry = new LineString([]);
    const lineFeature = new Feature({geometry: lineGeometry});

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

    // Vista
    const view = new View({
        center: fromLonLat(initialPos), // Posició inicial 
        zoom: 19,
    });

    // Mapa
    const map = new Map({
        target: 'map',
        layers:[
            layer1,
            lineLayer1,
            vectorLayer
        ],
        view: view,
    });
    return map;
}
