import React, {useRef, useEffect, useState} from 'react';
import { zoomMap } from '../../constant/constants';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import mapboxgl from 'mapbox-gl';
import turfLength from '@turf/length';
import turfArea from '@turf/area';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import LeftSidebar from "./LeftSidebar/LeftSidebar";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export default function Mapa() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(17.1856);
  const [lat, setLat] = useState(44.7752);
  const [zoom, setZoom] = useState(12);
  const [length, setLength] = useState(null); 
  const [area, setArea] = useState(null);

  useEffect(() => {
    if (map.current) {
      return; 
    }
  
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
    });
  
     //geocoder 
     const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: true,
    });
    map.current.addControl(geocoder, 'top-right');

    geocoder.on('result', (e) => {
      setLng(e.result.center[0]);
      setLat(e.result.center[1]);
      setZoom(13);
      map.current.flyTo({
        center: [e.result.center[0], e.result.center[1]],
        zoom: 12,
      });
    });

    //  zoom controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');


    //gl draw control
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        line_string: true,
        trash: true,
        polygon:true
      },
      styles: [
        {
          id: 'gl-draw-line',
          type: 'line',
          filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#3b9ddd',
            'line-dasharray': [0.2, 2],
            'line-width': 4,
            'line-opacity': 0.7
          }
        },
        {
          id: 'gl-draw-polygon-fill-inactive',
          type: 'fill',
          filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          paint: {
            'fill-color': '#ffff80',
            'fill-opacity': 0.3
          }
        }
      ]
    });

    map.current.addControl(draw, 'top-right');


    map.current.on('draw.create', (event) => {
      const { features } = event;
      const lineString = features.find(feature => feature.geometry.type === 'LineString');
      const polygon = features.find(feature => feature.geometry.type === 'Polygon');

      if (lineString) {
        const length = turfLength(lineString);
        setLength(length.toFixed(2));
      }

      if (polygon) {
        const area = turfArea(polygon);
        setArea(area.toFixed(2));
      }
    });

    map.current.on('draw.delete', () => {
      setArea(null);
      setLength(null);
    });

    map.current.on('draw.modechange', (event) => {
      if (event.mode === 'draw_polygon') {
        setArea(null);
      }
    });

  });


  useEffect(() => {
    if (!map.current) 
      return; 

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <div>
        <LeftSidebar map={map} />
      <div className="sidebar">
        {zoomMap} {zoom}
        {length !== null &&  ` Line length: ${(length)} km`}
        {area ? ` Polygon area: ${(area/1e6).toFixed(2)} km²` : null}
      </div>
      <div ref={mapContainer} className="map-container"/> </div> )
}
