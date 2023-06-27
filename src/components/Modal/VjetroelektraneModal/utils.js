import wellknown from 'wellknown';
export const setFormData = (data, coords) => {
    const formData = new FormData();
    formData.append('city', data.city);
    formData.append('elevation', data.elevation);
    if(data.document[0])
        formData.append('document', data.document[0]);
    formData.append('entity', data.entity);
    formData.append('manufactured', data.manufactured);
    formData.append('note', data.note);
    formData.append('owner', data.owner);
    formData.append('power_energy', data.power_energy);
    formData.append('wind_direction', data.wind_direction);
    formData.append('zone', data.zone);
    if(data.entity === 'FBiH')
        formData.append('canton', data.canton);
    formData.append('geometry', wellknown.stringify(coords));

    return formData;
}
