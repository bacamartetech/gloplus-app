import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import api from '../../services/api';

const EmissoraList = ({ navigation }) => {
    const [emissoras, setEmissoras] = useState([]);
    const [loading, setLoading] = useState(false);

    navigation.setOptions({
        title: 'Selecione uma emissora',
    });

    useEffect(() => {
        setLoading(true);

        api.fetchUserProfile()
            .then(responseProfile => {
                const schedule = responseProfile.data.schedule;

                if (schedule) {
                    navigation.navigate('EpisodioList', { idEmissora: schedule._id });
                }

                api.fetchEmissoras()
                    .then(responseSchedule => {
                        setEmissoras(responseSchedule.data);
                    })
                    .catch(console.log);
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Parece que estamos indisponíveis... tente novamente mais tarde. =(');
            })
            .then(() => {
                setLoading(false);
            });
    }, [navigation]);

    const handleSelectEmissora = useCallback(
        item => {
            api.updateUserSchedule(item._id).then(() => {
                navigation.navigate('EpisodioList', { idEmissora: item._id });
            });
        },
        [navigation]
    );

    return (
        <LinearGradient colors={['#9bcbc9', '#616161']} style={styles.container}>
            {loading && (
                <>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#ffffff',
                            textAlign: 'center',
                            marginTop: 50,
                            marginBottom: 10,
                        }}
                    >
                        Carregando
                    </Text>
                    <ActivityIndicator />
                </>
            )}
            <FlatList
                data={emissoras}
                keyExtractor={item => item._id}
                style={{ marginBottom: -15 }}
                renderItem={({ item }) => (
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#ffffff',
                            padding: 15,
                            borderRadius: 4,
                            marginBottom: 15,
                        }}
                    >
                        <Text>{item.title}</Text>
                        <TouchableOpacity onPress={() => handleSelectEmissora(item)}>
                            <Icon name="arrow-right" size={24} />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        paddingTop: 80,
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
        marginBottom: 20,
    },
});

export default EmissoraList;
