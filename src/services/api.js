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
    register({ name, email, password }) {
        console.log('registering...', { name, email, password });
        return api.post('/register', { name, email, password });
    },

    login({ email, password }) {
        console.log('authenticating...', { email, password });
        return api.post('/session', { email, password });
    },

    fetchEmissoras() {
        return api.get('/schedule');
    },

    fetchEmissora(idEmissora) {
        return api.get(`/schedule/${idEmissora}`);
    },

    fetchEpisodios(idEmissora, date) {
        return api.get(`/schedule/${idEmissora}/${date}`);
    },

    fetchAvatars() {
        return api.get('/avatar');
    },
};
