import axios from 'axios';

import storage from './storage';

const api = axios.create({
    baseURL: 'https://gloplus-api.glitch.me',
});

api.interceptors.request.use(
    async request => {
        const userData = await storage.getUserData();

        if (userData) {
            request.headers.Authorization = `Bearer ${userData.token}`;
        }

        return request;
    },
    error => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error.response);
    }
);

export default {
    register({ name, email, password, avatar }) {
        console.log('registering...', { name, email, password, avatar });
        return api.post('/register', { name, email, password, avatar });
    },

    login({ email, password }) {
        console.log('authenticating...', { email, password });
        return api.post('/session', { email, password });
    },
};
