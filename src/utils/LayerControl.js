export const addLayer = (name, payload, map) => {
    if(!map.current) return;
    map.current.addSource(name, {
        'type': 'geojson',
        'data': payload,
    });
    const circleColor = name === 'windFarms' ? '#007cbf' : name === 'solarLayer' ? '#ffb733' : '#007cbf'; // based on layer name
    const outlineColor = {'circle-stroke-width': 3, 'circle-stroke-color': 'white'}
    map.current.addLayer({
        'id': name,
        'type': 'circle',
        'source': name,
        'paint': {
            'circle-radius': 10,
            'circle-color': circleColor,
            ...outlineColor
        }
    });
}
export const removeLayer = (name, map) => {
    if(!map.current) return;

    if (map.current.getLayer(name)) {
        map.current.removeLayer(name);
        if(map.current.getSource(name))
            map.current.removeSource(name);
    }
}
