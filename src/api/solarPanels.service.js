import base from './base.service';

const instance = base.service(true);
export const getAllSolarPanels = () => {
    return instance
        .get('resources/solar_panels/')
        .then((result) => result.data);
};
export const getSolarPanel = (idSolarPanel) => {
    return instance
        .get(`resources/solar_panels/${idSolarPanel}`)
        .then((result) => result.data);
};
export const deleteSolarPanel = (idSolarPanel) => {
    return instance
        .delete(`resources/solar_panels/${idSolarPanel}`)
        .then((result) => result.data);
};
export const updateSolarPanel = (idSolarPanel, dataToUpdate) => {
    return instance
        .put(`resources/solar_panels/${idSolarPanel}`, dataToUpdate)
        .then((result) => result.data);
};
export const createSolarPanel = (solarPanel) => {
    return instance
        .post(`resources/solar_panels/`, solarPanel, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((result) => result.data);
};
export const patchCanton = (idSolarPanel, dataToUpdate) => {
    return instance
        .patch(`resources/solar_panels/${idSolarPanel}`, dataToUpdate)
        .then((result) => result.data);
};
const SolarPanels = {
    getSolarPanel,
    getAllSolarPanels,
    createSolarPanel,
    deleteSolarPanel,
    updateSolarPanel,
    patchCanton,
};
export default SolarPanels;
