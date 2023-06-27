import base from './base.service';

const instance = base.service(true);
export const getAllWindFarms = () => {
    return instance
        .get('resources/wind_farms/')
        .then((result) => result.data);
};
export const createWindFarm = (dataWindFarm) => {
    return instance
        .post('resources/wind_farms/', dataWindFarm, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((result) => result.data);
};
export const deleteWindFarm = (idWindFarm) => {
    return instance
        .delete(`resources/wind_farms/${idWindFarm}`)
        .then((result) => result.data);
};
export const getWindFarm = (idWindFarm) => {
    return instance
        .get(`resources/wind_farms/${idWindFarm}`)
        .then((result) => result.data);
};
export const updateWindFarm = (idWindFarm, dataToUpdate) => {
    return instance
        .put(`resources/wind_farms/${idWindFarm}`, dataToUpdate)
        .then((result) => result.data);
};
export const patchCanton = (idWindFarm, dataToUpdate) => {
    return instance
        .patch(`resources/wind_farms/${idWindFarm}`, dataToUpdate)
        .then((result) => result.data);
}
const WindFarms = {
    getAllWindFarms,
    createWindFarm,
    deleteWindFarm,
    updateWindFarm,
    getWindFarm,
    patchCanton,
};
export default WindFarms;
