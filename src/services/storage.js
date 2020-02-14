import AsyncStorage from '@react-native-community/async-storage';

export default {
    saveUserData(data) {
        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        }

        return AsyncStorage.setItem('userData', data);
    },

    getUserData() {
        return AsyncStorage.getItem('userData').then(ud => JSON.parse(ud));
    },

    clearUserData() {
        return AsyncStorage.removeItem('userData');
    },
};
