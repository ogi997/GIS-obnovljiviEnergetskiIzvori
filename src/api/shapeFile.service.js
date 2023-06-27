import base from './base.service';

const instance = base.service(true);
export const importShapeFileWindFarm = (dataWindFarm) => {
    return instance
        .post('resources/import_shape_file/wind_farms/', dataWindFarm, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((result) => result.data);
};
export const importShapeFileSolarPanel = (dataSolarPanel) => {
    return instance
        .post('resources/import_shape_file/solar_panels/', dataSolarPanel, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((result) => result.data);
};
const ShapeFile = {
    importShapeFileWindFarm,
    importShapeFileSolarPanel
};
export default ShapeFile;
