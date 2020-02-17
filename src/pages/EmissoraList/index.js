import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import api from '../../services/api';

const EmissoraList = ({ navigation }) => {
    const [emissoras, setEmissoras] = useState([]);

    useEffect(() => {
        api.fetchUserProfile()
            .then(profile => {
                const schedule = profile.data.schedule;
                if (schedule) {
                    navigation.navigate('EpisodioList', { idEmissora: schedule._id });
                }
                api.fetchEmissoras()
                    .then(response => {
                        setEmissoras(response.data);
                    })
                    .catch(console.log);
            })
            .catch(console.log);
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
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#ffffff' }}>Selecione a emissora</Text>
            <FlatList
                data={emissoras}
                keyExtractor={item => item._id}
                style={{ marginTop: 15, marginBottom: -15 }}
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
        paddingTop: 40,
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
