import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Picker, FlatList, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import api from '../../services/api';

function formatDate(date) {
    const year = date.toString().substring(0, 4);
    const month = date.toString().substring(4, 6);
    const day = date.toString().substring(6, 8);

    return `${day}/${month}/${year}`;
}

const EpisodioList = ({ route, navigation }) => {
    const [emissora, setEmissora] = useState({});
    const [episodios, setEpisodios] = useState([]);
    const [selectedDate, setSelectedDate] = useState(0);

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = ('0' + (today.getMonth() + 1)).slice(-2);
        const date = today.getDate();
        setSelectedDate(Number(`${year}${month}${date}`));

        api.fetchEmissora(route.params.idEmissora)
            .then(response => {
                setEmissora({
                    ...response.data,
                    dates: response.data.dates.map(d => ({ date: d, label: formatDate(d) })),
                });
            })
            .catch(console.log);
    }, [route.params.idEmissora]);

    useEffect(() => {
        api.fetchEpisodios(route.params.idEmissora, selectedDate).then(response => setEpisodios(response.data));
    }, [route.params.idEmissora, selectedDate]);

    return (
        <LinearGradient colors={['#9bcbc9', '#616161']} style={styles.container}>
            {emissora && (
                <>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#ffffff' }}>{emissora.title}</Text>
                    {emissora.dates && (
                        <Picker
                            selectedValue={selectedDate}
                            onValueChange={(itemValue, itemIndex) => setSelectedDate(itemValue)}
                        >
                            {emissora.dates.map(d => (
                                <Picker.Item label={d.label} value={d.date} />
                            ))}
                        </Picker>
                    )}
                </>
            )}
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
