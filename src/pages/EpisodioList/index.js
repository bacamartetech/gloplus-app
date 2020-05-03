import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { StyleSheet, Text, View, Picker, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { subDays } from 'date-fns';

import api from '../../services/api';

import EpisodioCard from './EpisodioCard';

let _currentEpisode;

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
    const date = ('0' + today.getDate()).slice(-2);

    return Number(`${year}${month}${date}`);
}

function getDateValue(today) {
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const date = ('0' + today.getDate()).slice(-2);

    return Number(`${year}${month}${date}`);
}

const EpisodioList = ({ route, navigation }) => {
    const [todayAdjusted, setTodayAdjusted] = useState(false);
    const [emissora, setEmissora] = useState({});
    const [episodios, setEpisodios] = useState([]);
    const [selectedDate, setSelectedDate] = useState(getTodayValue());

    const isFocused = useIsFocused();

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
                const dates = response.data.dates.map(d => ({
                    date: d.value,
                    label: formatDate(d.value),
                    start: Number(d.start.slice(0, 2)) * 60 + Number(d.start.slice(3, 5)),
                    end: Number(d.end.slice(0, 2)) * 60 + Number(d.end.slice(3, 5)),
                }));

                dates.forEach(d => {
                    if (d.end < 1440) {
                        d.end += 1440;
                    }
                });

                setEmissora({ ...response.data, dates });
            })
            .catch(console.log);
    }, [route.params.idEmissora]);

    const fetchEpisodios = useCallback(
        date => {
            api.fetchEpisodios(route.params.idEmissora, date || selectedDate)
                .then(response => {
                    const episodiosData = response.data.map(e => ({
                        ...e,
                        totalMinutes: Number(e.time.slice(0, 2)) * 60 + Number(e.time.slice(3, 5)),
                    }));

                    const maxTotalMinutes = Math.max(...episodiosData.map(e => e.totalMinutes));
                    const maxTotalMinutesOrder = episodiosData.find(e => e.totalMinutes === maxTotalMinutes).order;

                    episodiosData
                        .filter(e => e.order > maxTotalMinutesOrder)
                        .forEach(e => {
                            e.totalMinutes += 1440;
                        });

                    setEpisodios(episodiosData);
                })
                .catch(console.log);
        },
        [route.params.idEmissora, selectedDate]
    );

    useEffect(() => {
        fetchEpisodios(selectedDate);
    }, [fetchEpisodios, selectedDate]);

    const currentEpisode = useMemo(() => {
        if (!isFocused) {
            return;
        }

        if (!emissora.dates || !episodios.length) {
            return;
        }

        const selectedInfo = emissora.dates.filter(d => d.date === selectedDate)[0];
        let today = new Date();
        let totalMinutes = today.getHours() * 60 + today.getMinutes();

        if (totalMinutes <= selectedInfo.start) {
            // o episódio está na programação do dia anterior
            today = new Date(subDays(today, 1));
            totalMinutes = today.getHours() * 60 + today.getMinutes() + 1440;
        }

        if (selectedDate !== getDateValue(today)) {
            if (!todayAdjusted) {
                setTodayAdjusted(true);
                setSelectedDate(getDateValue(today));
            }
            return _currentEpisode;
        }

        if (episodios[0].date !== getDateValue(today)) {
            return _currentEpisode;
        }

        const pastEpisodes = episodios.filter(e => e.totalMinutes <= totalMinutes);
        _currentEpisode = pastEpisodes[pastEpisodes.length - 1];
        return _currentEpisode;
    }, [emissora.dates, episodios, isFocused, selectedDate, todayAdjusted]);

    return (
        <LinearGradient colors={['#9bcbc9', '#616161']} style={styles.container}>
            <View style={{ flex: 1 }}>
                {emissora.dates && (
                    <View style={{ borderRadius: 4, borderWidth: 1, borderColor: '#ffffff' }}>
                        <Picker
                            style={{ color: '#ffffff' }}
                            selectedValue={selectedDate}
                            onValueChange={value => setSelectedDate(value)}
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
                    Programação {selectedDate === getTodayValue() ? 'de hoje' : `do dia ${formatDate(selectedDate)}`}
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
