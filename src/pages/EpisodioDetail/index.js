import React, { useState, useCallback, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppContext from '../../contexts/AppContext';

const EpisodeDetail = ({ route }) => {
    const { socket } = useContext(AppContext);

    const [episodeInfo, setEpisodeInfo] = useState(null);
    const [myInteraction, setMyInteraction] = useState(null);
    const [userCount, setUserCount] = useState(0);
    const [score, setScore] = useState(0);
    const [likes, setLikes] = useState(0);

    useEffect(() => {
        socket.emit('join', { episodeId: route.params.id });

        socket.on('episodeInfo', data => {
            setEpisodeInfo(data);
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

        return () => {
            socket.emit('leave', { episodeId: route.params.id });
        };
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

    return (
        <LinearGradient colors={['#9bcbc9', '#616161']} style={styles.container}>
            {episodeInfo && (
                <>
                    <Text>
                        {episodeInfo.date} - {episodeInfo.time}
                    </Text>
                    <Image style={{ width: 50, height: 50 }} source={{ uri: episodeInfo.logo }} />
                    <Text>{episodeInfo.title}</Text>
                    <Image style={{ width: 200, height: 200 }} source={{ uri: episodeInfo.thumb }} />
                    <Text>{episodeInfo.description}</Text>
                    <Text>{episodeInfo.link}</Text>
                    {episodeInfo.moreInfo.map(i => (
                        <View key={i.key}>
                            <Text>
                                {i.key}: {i.value}
                            </Text>
                        </View>
                    ))}
                    <Text>{userCount} Usuários Assistindo</Text>
                    <Text>Nota Média: {score || '-'}</Text>
                    <Text>Globadas: {likes || 0}</Text>
                    {myInteraction && (
                        <>
                            <View style={styles.starContainer}>
                                <TouchableOpacity onPress={() => toggleStars(1)}>
                                    <Icon
                                        style={myInteraction.score >= 1 ? styles.star : styles.deadStar}
                                        name="star-face"
                                        size={24}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => toggleStars(2)}>
                                    <Icon
                                        style={myInteraction.score >= 2 ? styles.star : styles.deadStar}
                                        name="star-face"
                                        size={24}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => toggleStars(3)}>
                                    <Icon
                                        style={myInteraction.score >= 3 ? styles.star : styles.deadStar}
                                        name="star-face"
                                        size={24}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => toggleStars(4)}>
                                    <Icon
                                        style={myInteraction.score >= 4 ? styles.star : styles.deadStar}
                                        name="star-face"
                                        size={24}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => toggleStars(5)}>
                                    <Icon
                                        style={myInteraction.score >= 5 ? styles.star : styles.deadStar}
                                        name="star-face"
                                        size={24}
                                    />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={toggleLike}>
                                <Icon name="earth" size={24} />
                                {myInteraction.like ? <Text>DeGlobar!</Text> : <Text>Globar!</Text>}
                            </TouchableOpacity>
                        </>
                    )}
                </>
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        paddingTop: 40,
    },

    starContainer: {
        flexDirection: 'row',
    },

    star: {
        opacity: 1,
    },

    deadStar: {
        opacity: 0.2,
    },
});

export default EpisodeDetail;
