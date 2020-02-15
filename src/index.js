import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Loading from './pages/Loading';
import Login from './pages/Login';
import Register from './pages/Register';
import storage from './services/storage';
import Home from './pages/Home';
import AppContext from './contexts/AppContext';

const Stack = createStackNavigator();

const App = () => {
    const [appState, setAppState] = useState({
        loading: true,
        user: null,
    });

    useEffect(() => {
        storage.getUserData().then(value => {
            updateAppState({ user: value, loading: false });
            console.log(value);
        });
    }, [updateAppState]);

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

            <AppContext.Provider value={{ appState, updateAppState }}>
                <NavigationContainer>
                    <Stack.Navigator headerMode={'none'} screenOptions={{ animationEnabled: false }}>
                        {appState.user ? (
                            <>
                                <Stack.Screen name="Home" component={Home} />
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
