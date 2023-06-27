import base from './base.service';

const instance = base.service(true);
export const changePassword = (changePasswordData) => {
    return instance
        .patch(`users/change_password/`, changePasswordData)
        .then((results) => results);
}
export const status = () => {
    return instance
        .get(`users/status/`)
        .then((results) => results.data);
}
const user = {
    changePassword,
    status,
}
export default user;
