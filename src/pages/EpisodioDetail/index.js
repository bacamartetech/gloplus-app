import React, { useState, useCallback, useEffect, useContext } from 'react';
import { StyleSheet, Linking, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Share from 'react-native-share';

import AppContext from '../../contexts/AppContext';

function formatDate(date) {
    const year = date.toString().substring(0, 4);
    const month = date.toString().substring(4, 6);
    const day = date.toString().substring(6, 8);

    return `${day}/${month}/${year}`;
}

const EpisodeDetail = ({ navigation, route }) => {
    const { socket } = useContext(AppContext);

    const [episodeInfo, setEpisodeInfo] = useState(null);
    const [myInteraction, setMyInteraction] = useState(null);
    const [userCount, setUserCount] = useState(0);
    const [score, setScore] = useState(0);
    const [likes, setLikes] = useState(0);

    navigation.setOptions({
        title: episodeInfo ? episodeInfo.title : '',
    });

    useEffect(() => {
        socket.emit('join', { episodeId: route.params.id });

        socket.on('episodeInfo', data => {
            console.log(data);
            setEpisodeInfo({ ...data, date: formatDate(data.date) });
        });

        socket.on('myInteraction', data => {
            setMyInteraction(data);
        });

        socket.on('userCount', data => {
            setUserCount(data);
        });

        socket.on('statsUpdated', data => {
            setScore(data.score);
            setLikes(data.likes);
        });

        // return () => {
        //     socket.emit('leave', { episodeId: route.params.id });
        // };
    }, [route.params.id, socket]);

    const toggleLike = useCallback(() => {
        socket.emit('updateInteraction', {
            episodeId: episodeInfo._id,
            like: !myInteraction.like,
            score: myInteraction.score,
            review: myInteraction.review,
        });
    }, [episodeInfo, myInteraction, socket]);

    const toggleStars = useCallback(
        stars => {
            socket.emit('updateInteraction', {
                episodeId: episodeInfo._id,
                like: myInteraction.like,
                score: stars,
                review: myInteraction.review,
            });
        },
        [episodeInfo, myInteraction, socket]
    );

    const handleShare = useCallback(async () => {
        try {
            await Share.open({
                title: 'GLO+',
                message: `Venha assistir ${episodeInfo.title} no GLO+ às ${episodeInfo.date} ${episodeInfo.time}`,
                url: `https://gloplus-api.glitch.me/share/${episodeInfo._id}`,
            });
        } catch {
            console.log('No shared!');
        }
    }, [episodeInfo]);

    return (
        <LinearGradient colors={['#9bcbc9', '#616161']} style={styles.container}>
            {episodeInfo && (
                <ScrollView style={{ flex: 1 }}>
                    <Image
                        resizeMode={'cover'}
                        style={{ width: '100%', height: 200 }}
                        source={{ uri: episodeInfo.thumb }}
                    />

                    <View style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: 4, padding: 10, marginTop: 15 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 15 }}>Descrição</Text>
                        <Text>{episodeInfo.description}</Text>

                        {episodeInfo.link && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                                <Icon name="earth" size={24} color="dodgerblue" style={{ marginRight: 5 }} />
                                <Text style={{ color: 'dodgerblue' }} onPress={() => Linking.openURL(episodeInfo.link)}>
                                    Visitar site
                                </Text>
                            </View>
                        )}
                    </View>

                    {episodeInfo.moreInfo.length > 0 && (
                        <View
                            style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: 4, padding: 10, marginTop: 15 }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 15 }}>
                                Informações adicionais
                            </Text>

                            {episodeInfo.moreInfo.map(i => (
                                <View key={i.key}>
                                    <Text>
                                        {i.key}: {i.value}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    <View style={{ flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between' }}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: '#ffffff',
                                borderRadius: 4,
                                padding: 10,
                                marginTop: 15,
                                marginRight: 7.5,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: 15,
                                }}
                            >
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Globadas</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{likes || 0}</Text>
                            </View>

                            {myInteraction && (
                                <View style={{ alignItems: 'center' }}>
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row', alignItems: 'center' }}
                                        onPress={toggleLike}
                                    >
                                        <Icon name="earth" size={24} color="#009DDB" style={{ marginRight: 5 }} />
                                        <Text style={{ color: '#009DDB' }}>
                                            {myInteraction.like ? 'Desglobar' : 'Globar'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        <View
                            style={{
                                flex: 1,
                                backgroundColor: '#ffffff',
                                borderRadius: 4,
                                padding: 10,
                                marginTop: 15,
                                marginLeft: 7.5,
                                justifyContent: 'center',
                            }}
                        >
                            <TouchableOpacity
                                onPress={handleShare}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Icon name="share" size={24} color="#009DDB" style={{ marginRight: 5 }} />
                                <Text style={{ fontWeight: 'bold', color: '#009DDB' }}>Compartilhar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {myInteraction && (
                        <>
                            <View
                                style={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: 4,
                                    padding: 10,
                                    marginTop: 15,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: 15,
                                    }}
                                >
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Avaliação</Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Nota média: {score || '-'}</Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <TouchableOpacity onPress={() => toggleStars(1)}>
                                        <Icon
                                            name="star-face"
                                            size={36}
                                            color="goldenrod"
                                            style={myInteraction.score >= 1 ? styles.aliveStar : styles.deadStar}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => toggleStars(2)}>
                                        <Icon
                                            name="star-face"
                                            size={36}
                                            color="goldenrod"
                                            style={myInteraction.score >= 2 ? styles.aliveStar : styles.deadStar}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => toggleStars(3)}>
                                        <Icon
                                            name="star-face"
                                            size={36}
                                            color="goldenrod"
                                            style={myInteraction.score >= 3 ? styles.aliveStar : styles.deadStar}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => toggleStars(4)}>
                                        <Icon
                                            name="star-face"
                                            size={36}
                                            color="goldenrod"
                                            style={myInteraction.score >= 4 ? styles.aliveStar : styles.deadStar}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => toggleStars(5)}>
                                        <Icon
                                            name="star-face"
                                            size={36}
                                            color="goldenrod"
                                            style={myInteraction.score >= 5 ? styles.aliveStar : styles.deadStar}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#009DDB',
                                    padding: 15,
                                    borderRadius: 4,
                                    marginTop: 15,
                                }}
                                onPress={() => navigation.navigate('EpisodioChat', { id: episodeInfo._id })}
                            >
                                <Icon name="chat" size={24} color="#ffffff" style={{ marginRight: 5 }} />
                                <Text style={{ fontWeight: 'bold', color: '#ffffff' }}>Entrar no chat</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </ScrollView>
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        paddingTop: 80,
    },

    aliveStar: {
        opacity: 1,
    },

    deadStar: {
        opacity: 0.2,
    },
});

export default EpisodeDetail;
