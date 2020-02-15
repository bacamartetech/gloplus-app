import React, { useState, useContext } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, Picker } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import api from '../../services/api';
import AppContext from '../../contexts/AppContext';
import storage from '../../services/storage';

const Register = ({ navigation }) => {
    const [avatarOptions, setAvatarOptions] = useState([
        { label: 'Faustão', value: 'faustao' },
        { label: 'Carminha', value: 'carminha' },
        { label: 'William Bonner', value: 'williambonner' },
    ]);
    const [registerData, setRegisterData] = useState({ name: null, email: null, password: null, avatar: null });
    const { setAppState: updateAppState } = useContext(AppContext);

    async function handleSubmit() {
        // eslint-disable-next-line no-useless-escape
        const reEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!registerData.name) {
            return ToastAndroid.show('Favor informar o nome', 3000);
        }

        if (!registerData.email) {
            return ToastAndroid.show('Favor informar o e-mail', 3000);
        }

        if (!reEmail.test(registerData.email)) {
            return ToastAndroid.show('Favor informar um e-mail válido', 3000);
        }

        if (!registerData.password) {
            return ToastAndroid.show('Favor informar a senha', 3000);
        }

        try {
            const response = await api.register(registerData);

            setRegisterData({ name: null, email: null, password: null, avatar: null });
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
                {/* email */}
                <View style={styles.inputContainer}>
                    <Icon name="email-outline" size={28} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        placeholderTextColor="rgba(255, 255, 255, 0.45)"
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        keyboardType={'email-address'}
                        value={registerData.email}
                        onChangeText={v => setRegisterData({ ...registerData, email: v })}
                    />
                </View>

                {/* name */}
                <View style={styles.inputContainer}>
                    <Icon name="account-outline" size={28} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Nome"
                        placeholderTextColor="rgba(255, 255, 255, 0.45)"
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        value={registerData.name}
                        onChangeText={v => setRegisterData({ ...registerData, name: v })}
                    />
                </View>

                {/* password */}
                <View style={styles.inputContainer}>
                    <Icon name="lock-outline" size={28} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        placeholderTextColor="rgba(255, 255, 255, 0.45)"
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        secureTextEntry={true}
                        value={registerData.password}
                        onChangeText={v => setRegisterData({ ...registerData, password: v })}
                    />
                </View>

                {/* avatar */}
                <View style={styles.inputContainer}>
                    <Icon name="face" size={28} style={styles.inputIcon} />
                    <View style={styles.input}>
                        <Picker
                            selectedValue={registerData.avatar}
                            onValueChange={v => setRegisterData({ ...registerData, avatar: v })}
                            style={{ color: '#ffffff', marginLeft: -7, marginRight: -15 }}
                        >
                            <Picker.Item label="-- selecione --" value={null} />
                            {avatarOptions.map((opt, index) => (
                                <Picker.Item key={index.toString()} label={opt.label} value={opt.value} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <TouchableOpacity style={styles.submitButton} activeOpacity={0.7} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Criar minha conta</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.registerButton}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.registerButtonText}>Já tenho uma conta</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#d4d4d4',
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

export default Register;
