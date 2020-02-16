import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import api from '../../services/api';

const EpisodioList = ({ route, navigation }) => {
    const [episodios, setEpisodios] = useState([]);

    useEffect(() => {
        api.fetchEpisodios(route.params.idEmissora, route.params.date)
            .then(response => {
                setEpisodios(response.data);
            })
            .catch(console.log);
    }, [route.params.date, route.params.idEmissora]);

    return (
        <LinearGradient colors={['#9bcbc9', '#616161']} style={styles.container}>
            {/* date: 20200216
            logo: "https://s3.glbimg.com/v1/AUTH_947d0a0390ad47fbba7a4b93423e1004/Logo/533.jpg"
            time: "02:07"
            title: "Flash Big Brother Brasil"
            thumb: "https://s3.glbimg.com/v1/AUTH_947d0a0390ad47fbba7a4b93423e1004/Imagem/596.jpg"
            description: "As últimas notícias do que acontece na casa mais vigiada do Brasil." */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#ffffff' }}>Programação</Text>
            <FlatList
                data={episodios}
                keyExtractor={item => item._id}
                style={{ marginTop: 15, marginBottom: -15 }}
                renderItem={({ item }) => (
                    <View style={{ backgroundColor: '#ffffff', padding: 15, borderRadius: 4, marginBottom: 15 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                            }}
                        >
                            <Image
                                source={{ uri: item.logo }}
                                resizeMode={'contain'}
                                style={{ height: 50, width: 50 }}
                            />
                            <View style={{ marginLeft: 10, justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
                                <Text>Hora: {item.time}</Text>
                            </View>

                            <TouchableOpacity onPress={() => navigation.navigate('EpisodioDetail', { id: item._id })}>
                                <Icon name="arrow-right" size={24} />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 12, marginTop: 15 }}>{item.description}</Text>
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

export default EpisodioList;
