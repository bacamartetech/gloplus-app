import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, Picker, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import api from '../../services/api';

import EpisodioCard from './EpisodioCard';

function formatDate(date) {
    const year = date.toString().substring(0, 4);
    const month = date.toString().substring(4, 6);
    const day = date.toString().substring(6, 8);

    return `${day}/${month}/${year}`;
}

function getTodayValue() {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const date = today.getDate();
    return Number(`${year}${month}${date}`);
}

const EpisodioList = ({ route, navigation }) => {
    const [emissora, setEmissora] = useState({});
    const [episodios, setEpisodios] = useState([]);
    const [selectedDate, setSelectedDate] = useState(getTodayValue());

    navigation.setOptions({
        title: emissora.title ? emissora.title : '',
    });

    useEffect(() => {
        fetchEmissora();
        fetchEpisodios();
    }, [fetchEmissora, fetchEpisodios, navigation]);

    const fetchEmissora = useCallback(() => {
        api.fetchEmissora(route.params.idEmissora)
            .then(response => {
                setEmissora({
                    ...response.data,
                    dates: response.data.dates.map(d => ({ date: d, label: formatDate(d) })),
                });
            })
            .catch(console.log);
    }, [route.params.idEmissora]);

    const fetchEpisodios = useCallback(
        date => {
            if (date) {
                setSelectedDate(date);
            }

            api.fetchEpisodios(route.params.idEmissora, selectedDate)
                .then(response =>
                    setEpisodios(
                        response.data.map(e => ({
                            ...e,
                            totalMinutes: Number(e.time.slice(0, 2)) * 60 + Number(e.time.slice(3, 5)),
                        }))
                    )
                )
                .catch(console.log);
        },
        [route.params.idEmissora, selectedDate]
    );

    const currentEpisode = useMemo(() => {
        if (selectedDate !== getTodayValue()) {
            return null;
        }

        const today = new Date();
        const totalMinutes = today.getHours() * 60 + today.getMinutes();
        const pastEpisodes = episodios.filter(e => e.totalMinutes <= totalMinutes);

        return pastEpisodes[pastEpisodes.length - 1];
    }, [episodios, selectedDate]);

    return (
        <LinearGradient colors={['#9bcbc9', '#616161']} style={styles.container}>
            <View style={{ flex: 1 }}>
                {emissora.dates && (
                    <View style={{ borderRadius: 4, borderWidth: 1, borderColor: '#ffffff' }}>
                        <Picker
                            style={{ color: '#ffffff' }}
                            selectedValue={selectedDate}
                            onValueChange={date => fetchEpisodios(date)}
                        >
                            {emissora.dates.map(d => (
                                <Picker.Item key={d.date} label={`Dia ${d.label}`} value={d.date} />
                            ))}
                        </Picker>
                    </View>
                )}

                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff', marginVertical: 15 }}>
                    Exibindo agora
                </Text>

                {currentEpisode && (
                    <>
                        <View style={{ flex: 1 }}>
                            <View style={{ width: '100%', height: 200 }}>
                                <EpisodioCard item={currentEpisode} />
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginTop: 15,
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon name="account-outline" color="#ffffff" size={36} />
                                    <Text style={{ fontWeight: 'bold', color: '#ffffff' }}>
                                        {currentEpisode.userCount || 0} pessoa(s) assistindo
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={{ padding: 15, backgroundColor: '#009DDB', borderRadius: 4 }}
                                    onPress={() => navigation.navigate('EpisodioDetail', { id: currentEpisode._id })}
                                >
                                    <Text style={{ fontWeight: 'bold', color: '#ffffff' }}>Ver detalhes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                )}
            </View>

            <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff', marginBottom: 15 }}>
                    Programação
                </Text>

                <FlatList
                    data={episodios}
                    keyExtractor={item => item._id}
                    horizontal={true}
                    contentContainerStyle={{ marginHorizontal: -7.5 }}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                width: (Dimensions.get('screen').width / 5) * 4,
                                height: 200,
                                marginHorizontal: 7.5,
                            }}
                        >
                            <TouchableOpacity onPress={() => navigation.navigate('EpisodioDetail', { id: item._id })}>
                                <EpisodioCard item={item} />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>

            {/* {emissora && (
                <>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#ffffff' }}>{emissora.title}</Text>
                    {emissora.dates && (
                        <Picker selectedValue={selectedDate} onValueChange={date => fetchEpisodios(date)}>
                            {emissora.dates.map(d => (
                                <Picker.Item key={d.date} label={d.label} value={d.date} />
                            ))}
                        </Picker>
                    )}
                </>
            )}
            {currentEpisode && (
                <>
                    <Text>Passando agora:</Text>

                    <View
                        style={{
                            backgroundColor: '#ffffff',
                            padding: 15,
                            borderRadius: 4,
                            marginBottom: 15,
                            marginTop: 15,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                            }}
                        >
                            <Image
                                source={{ uri: currentEpisode.logo }}
                                resizeMode={'contain'}
                                style={{ height: 50, width: 50 }}
                            />
                            <View style={{ marginLeft: 10, justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: 'bold' }}>{currentEpisode.title}</Text>
                                <Text>Hora: {currentEpisode.time}</Text>
                            </View>

                            <TouchableOpacity
                                style={{ alignSelf: 'flex-end' }}
                                onPress={() => navigation.navigate('EpisodioDetail', { id: currentEpisode._id })}
                            >
                                <Icon name="arrow-right" size={24} />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 12, marginTop: 15 }}>{currentEpisode.description}</Text>
                    </View>
                </>
            )}
            /> */}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        paddingTop: 80,
        justifyContent: 'space-between',
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
