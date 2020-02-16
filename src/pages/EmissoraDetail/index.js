import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import api from '../../services/api';

const EmissoraDetail = ({ navigation, route }) => {
    const [emissora, setEmissora] = useState({});

    useEffect(() => {
        api.fetchEmissora(route.params.id)
            .then(response => {
                setEmissora(response.data);
            })
            .catch(console.log);
    }, [route.params.id]);

    function formatDate(date) {
        const year = date.toString().substring(0, 4);
        const month = date.toString().substring(4, 6);
        const day = date.toString().substring(6, 8);

        return `${day}/${month}/${year}`;
    }

    return (
        <LinearGradient colors={['#9bcbc9', '#616161']} style={styles.container}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#ffffff' }}>{emissora.title}</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#ffffff' }}>Selecione uma data</Text>
            <FlatList
                data={emissora.dates}
                keyExtractor={item => item.toString()}
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
                        <Text>{formatDate(item)}</Text>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('EpisodioList', { idEmissora: emissora._id, date: item })
                            }
                        >
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

export default EmissoraDetail;
