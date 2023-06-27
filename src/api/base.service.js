import axios from "axios";

const baseService = {
    service: (useAuth) => {
        const instance = axios;
        instance.defaults.headers.common['Content-Type'] = 'application/json';
        instance.defaults.headers.common['Accept'] = 'application/json';
        if (useAuth) {
            instance.interceptors.request.use(
                async (config) => {
                    const token = sessionStorage.getItem('access');
                    if (token) {
                        config.headers = {
                            ...config.headers,
                            Authorization: `Bearer ${token}`,
                        };
                    }
                    return config;
                },
                (error) => {
                   return Promise.reject(error);
                }
            );
        }
        return instance;
    },
};
export default baseService;
