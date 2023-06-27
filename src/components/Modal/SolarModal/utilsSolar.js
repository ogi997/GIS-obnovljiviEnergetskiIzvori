import wellknown from 'wellknown';
export const setFormData = (data, coords) => {
    const formData = new FormData();
    if(data.document[0])
        formData.append('document', data.document[0]);
    formData.append('elevation', data.elevation);
    formData.append('city', data.city);
    formData.append('owner', data.owner);
    formData.append('note', data.note);
    formData.append('entity', data.entity);
    formData.append('power_field', data.power_field);
    formData.append('panel_degree', data.panel_degree);
    formData.append('zone', data.zone);
    formData.append('manufactured', data.manufactured);
    
    if(data.entity === 'FBiH')
        formData.append('canton', data.canton);
    formData.append('geometry', wellknown.stringify(coords));

    return formData;
}
