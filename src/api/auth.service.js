import base from './base.service';

const instance = base.service();
export const login = (email, password) => {
    return instance
        .post('users/login/', {email, password})
        .then((results) => {
            const {access} = results.data;
            sessionStorage.setItem('access', access);
            return results.data;
        })
        .catch((err) => Promise.reject(err.response.status));
}
export const registration = (registrationData) => {
    return instance
        .post('users/register/', registrationData)
        .then((results) => results);
}
export const logout = () => sessionStorage.removeItem('access');
const auth = {
    login,
    registration,
    logout,
};
export default auth;
