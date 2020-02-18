import React, { useState, useEffect, useCallback, useContext } from 'react';
import { StyleSheet, FlatList, TextInput, TouchableOpacity, Text, View, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppContext from '../../contexts/AppContext';

function formatDate(date) {
    const year = date.toString().substring(0, 4);
    const month = date.toString().substring(4, 6);
    const day = date.toString().substring(6, 8);

    return `${day}/${month}/${year}`;
}

const EpisodioChat = ({ navigation, route }) => {
    const { socket } = useContext(AppContext);

    const [episodeInfo, setEpisodeInfo] = useState(null);
    const [userCount, setUserCount] = useState(0);
    const [chatHistory, setChatHistory] = useState([]);
    const [messageDraft, setMessageDraft] = useState('');

    navigation.setOptions({
        title: episodeInfo ? `Chat - ${episodeInfo.title}` : '',
    });

    useEffect(() => {
        socket.emit('join', { episodeId: route.params.id });

        socket.on('episodeInfo', data => {
            setEpisodeInfo({ ...data, date: formatDate(data.date) });
        });

        socket.on('userCount', data => {
            setUserCount(data);
        });

        socket.on('chatHistory', data => {
            setChatHistory(data.messages);
        });

        // return () => {
        //     socket.emit('leave', { episodeId: route.params.id });
        // };
    }, [chatHistory, route.params.id, socket]);

    const handleSendMessage = useCallback(() => {
        const message = messageDraft;

        socket.emit('chatMessage', {
            episodeId: route.params.id,
            message,
        });

        setMessageDraft('');
    }, [messageDraft, route.params.id, socket]);

    return (
        <LinearGradient colors={['#9bcbc9', '#616161']} style={styles.container}>
            <FlatList
                data={chatHistory}
                keyExtractor={item => item._id}
                style={{ marginTop: 15, marginBottom: -15 }}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row' }}>
                        {/* <Text>{item.date}</Text> */}
                        {/* <Text>{item.user.name}</Text> */}
                        <Image style={{ width: 40, height: 40 }} source={{ uri: item.user.avatar.url }} />
                        {/* <Text>{item.message}</Text> */}
                    </View>
                )}
            />

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                    placeholder="Digite sua mensagem"
                    style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: 4, padding: 15 }}
                />
                <Icon name="send" size={24} />
            </View>
            {/* {episodeInfo && (
                <>
                    <Icon name="account" />
                    <Text>{userCount}</Text>
                    <Text>
                        {episodeInfo.date} - {episodeInfo.time}
                    </Text>
                    <Image style={{ width: 40, height: 40 }} source={{ uri: episodeInfo.logo }} />
                    <Text>{episodeInfo.title}</Text>

                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                        value={messageDraft}
                        onChangeText={text => setMessageDraft(text)}
                    />
                    <TouchableOpacity onPress={handleSendMessage}>
                        <Text>Enviar mensagem</Text>
                    </TouchableOpacity>
                    <FlatList
                        data={chatHistory}
                        keyExtractor={item => item._id}
                        style={{ marginTop: 15, marginBottom: -15 }}
                        renderItem={({ item }) => (
                            <View style={{ flexDirection: 'row' }}>
                                <Text>{item.date}</Text>
                                <Text>{item.user.name}</Text>
                                <Image style={{ width: 40, height: 40 }} source={{ uri: item.user.avatar.url }} />
                                <Text>{item.message}</Text>
                            </View>
                        )}
                    />
                </>
            )} */}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        paddingTop: 80,
    },
});

export default EpisodioChat;
