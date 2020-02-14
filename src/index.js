import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Loading from './pages/Loading';
import Login from './pages/Login';
import Register from './pages/Register';
import storage from './services/storage';
import Home from './pages/Home';

const Stack = createStackNavigator();

const App = () => {
    const [loggedUser, setLoggedUser] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkUserData() {
            const userData = await storage.getUserData();

            console.log(userData);

            setLoggedUser(userData);
            setIsLoading(false);
        }

        checkUserData();
    }, []);

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" />
            <NavigationContainer>
                <Stack.Navigator headerMode={'none'} screenOptions={{ animationEnabled: false }}>
                    <Stack.Screen name="Register" component={Register} />
                    {/* {isLoading && <Stack.Screen name="Loading" component={Loading} />}

                    {loggedUser ? (
                        <>
                            <Stack.Screen name="Home" component={Home} />
                        </>
                    ) : (
                        <>
                            <Stack.Screen name="Login" component={Login} />
                            <Stack.Screen name="Register" component={Register} />
                        </>
                    )} */}
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
};

export default App;
