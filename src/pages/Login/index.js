import React, { useState, useContext } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import api from '../../services/api';
import AppContext from '../../contexts/AppContext';
import storage from '../../services/storage';

const Login = ({ navigation }) => {
    const [loginData, setLoginData] = useState({ email: null, password: null });
    const { updateAppState } = useContext(AppContext);

    navigation.setOptions({
        headerShown: false,
    });

    async function handleSubmit() {
        // eslint-disable-next-line no-useless-escape
        const reEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!loginData.email) {
            return ToastAndroid.show('Favor informar o e-mail', 3000);
        }

        if (!reEmail.test(loginData.email)) {
            return ToastAndroid.show('Favor informar um e-mail válido', 3000);
        }

        if (!loginData.password) {
            return ToastAndroid.show('Favor informar a senha', 3000);
        }

        try {
            const response = await api.login(loginData);

            setLoginData({ email: null, password: null });
            updateAppState({ user: response.data });

            await storage.saveUserData(response.data);
        } catch (error) {
            console.log(error);

            if (error.data && error.data.error) {
                ToastAndroid.show(error.data.error, 3000);
            }
        }
    }

    return (
        <LinearGradient colors={['#9bcbc9', '#616161']} style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logo}>Glo+</Text>
            </View>

            <View style={styles.fieldsContainer}>
                <View style={styles.inputContainer}>
                    <Icon name="email-outline" size={28} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        placeholderTextColor="rgba(255, 255, 255, 0.45)"
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        keyboardType={'email-address'}
                        value={loginData.email}
                        onChangeText={v => setLoginData({ ...loginData, email: v })}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="lock-outline" size={28} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        placeholderTextColor="rgba(255, 255, 255, 0.45)"
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        secureTextEntry={true}
                        value={loginData.password}
                        onChangeText={v => setLoginData({ ...loginData, password: v })}
                    />
                </View>

                <TouchableOpacity style={styles.submitButton} activeOpacity={0.7} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.registerButton}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.registerButtonText}>Criar minha conta gratuita</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 15,
    },

    header: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    logo: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#ffffff',
    },

    fieldsContainer: {
        justifyContent: 'flex-end',
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },

    inputIcon: {
        position: 'absolute',
        color: '#ffffff',
    },

    input: {
        flex: 1,
        height: 60,
        paddingLeft: 35,
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ffffff',
        color: '#ffffff',
    },

    submitButton: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#009DDB',
        borderRadius: 6,
        marginTop: 15,
    },

    submitButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },

    registerButton: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },

    registerButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});

export default Login;
