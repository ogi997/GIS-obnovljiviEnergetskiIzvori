import base from './base.service';

const instance = base.service(true);
export const getEntites = () => {
    return instance
        .get('choices/entites/')
        .then((result) => result.data);
};
export const getCantons = () => {
    return instance
        .get('choices/cantons/')
        .then((result) => result.data)
};
export const getZones = () => {
    return instance
        .get('choices/zones/')
        .then((result) => result.data);
};
export const getProjections = () => {
    return instance
        .get('choices/projections/')
        .then((result) => result.data);
};
const Utils = {
    getZones,
    getCantons,
    getEntites,
    getProjections,
};
export default Utils;
