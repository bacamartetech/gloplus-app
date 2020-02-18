import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { StyleSheet, FlatList, TextInput, TouchableOpacity, Text, View, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import formatRelative from 'date-fns/formatRelative';
import { ptBR } from 'date-fns/locale';

import AppContext from '../../contexts/AppContext';

function formatDate(date) {
    const year = date.toString().substring(0, 4);
    const month = date.toString().substring(4, 6);
    const day = date.toString().substring(6, 8);

    return `${day}/${month}/${year}`;
}

const EpisodioChat = ({ navigation, route }) => {
    const { socket } = useContext(AppContext);
    const listRef = useRef();

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
    }, [route.params.id, socket]);

    const handleSendMessage = useCallback(() => {
        socket.emit('chatMessage', {
            episodeId: route.params.id,
            message: messageDraft,
        });

        setMessageDraft('');
    }, [messageDraft, route.params.id, socket]);

    return (
        <LinearGradient colors={['#9bcbc9', '#616161']} style={styles.container}>
            <FlatList
                ref={listRef}
                data={chatHistory}
                keyExtractor={item => item._id}
                style={{ marginBottom: 15 }}
                contentContainerStyle={{ marginBottom: -15 }}
                onContentSizeChange={() => listRef.current.scrollToEnd({ animated: true })}
                onLayout={() => listRef.current.scrollToEnd({ animated: true })}
                renderItem={({ item }) => (
                    <View style={{ marginBottom: 15 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontWeight: 'bold', color: '#ffffff' }}>{item.user.name}</Text>
                            <Text style={{ color: '#ffffff' }}>
                                {formatRelative(new Date(item.date), new Date(), {
                                    locale: ptBR,
                                })}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                style={{ width: 40, height: 40, borderRadius: 4, marginRight: 15 }}
                                source={{ uri: item.user.avatar.url }}
                            />

                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                                    borderRadius: 4,
                                    padding: 15,
                                }}
                            >
                                <Text>{item.message}</Text>
                            </View>
                        </View>
                    </View>
                )}
            />

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                    placeholder="Digite sua mensagem"
                    value={messageDraft}
                    onChangeText={setMessageDraft}
                    style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: 4, padding: 15, paddingRight: 55 }}
                />
                <TouchableOpacity
                    style={{ position: 'absolute', right: 0, zIndex: 2, padding: 15 }}
                    onPress={handleSendMessage}
                >
                    <Icon name="send" size={24} />
                </TouchableOpacity>
            </View>
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
