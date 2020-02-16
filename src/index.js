import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import socketio from 'socket.io-client';

import storage from './services/storage';
import AppContext from './contexts/AppContext';
import Loading from './pages/Loading';
import Login from './pages/Login';
import Register from './pages/Register';
import EmissoraList from './pages/EmissoraList';
import EmissoraDetail from './pages/EmissoraDetail';
import EpisodioList from './pages/EpisodioList';
import EpisodioDetail from './pages/EpisodioDetail';

const Stack = createStackNavigator();

const App = () => {
    const [socket, setSocket] = useState(null);
    const [appState, setAppState] = useState({
        loading: true,
        user: null,
    });

    useEffect(() => {
        storage.getUserData().then(value => {
            updateAppState({ user: value, loading: false });
        });
    }, [updateAppState]);

    useEffect(() => {
        if (appState.user) {
            const token = appState.user.token;
            const newSocket = socketio('https://gloplus-api.glitch.me?token=' + token, {
                transportOptions: {
                    polling: {
                        extraHeaders: {
                            'Authorization ': 'Bearer ' + token,
                        },
                    },
                },
            });
            newSocket.connect();
            setSocket(newSocket);
        }
    }, [appState]);

    const updateAppState = useCallback(
        data => {
            setAppState({ ...appState, ...data });
        },
        [appState]
    );

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" />

            {appState.loading && <Loading />}

            <AppContext.Provider value={{ appState, updateAppState, socket }}>
                <NavigationContainer>
                    <Stack.Navigator headerMode={'none'} screenOptions={{ animationEnabled: false }}>
                        {appState.user ? (
                            <>
                                <Stack.Screen name="EmissoraList" component={EmissoraList} />
                                <Stack.Screen name="EmissoraDetail" component={EmissoraDetail} />
                                <Stack.Screen name="EpisodioList" component={EpisodioList} />
                                <Stack.Screen name="EpisodioDetail" component={EpisodioDetail} />
                            </>
                        ) : (
                            <>
                                <Stack.Screen name="Login" component={Login} />
                                <Stack.Screen name="Register" component={Register} />
                            </>
                        )}
                    </Stack.Navigator>
                </NavigationContainer>
            </AppContext.Provider>
        </>
    );
};

export default App;
