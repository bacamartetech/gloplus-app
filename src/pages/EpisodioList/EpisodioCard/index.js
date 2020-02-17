import React from 'react';
import { Text, View, TouchableOpacity, ImageBackground, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EpisodioCard = ({ item, onPress = () => {} }) => {
    return (
        <ImageBackground
            source={{ uri: item.thumb }}
            style={{
                height: '100%',
                width: '100%',
                position: 'relative',
            }}
            imageStyle={{ borderRadius: 4 }}
            resizeMode={'cover'}
        >
            <View
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.50)',
                    position: 'absolute',
                    bottom: 0,
                    padding: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    borderBottomLeftRadius: 4,
                    borderBottomRightRadius: 4,
                }}
            >
                <Image source={{ uri: item.logo }} style={{ width: 35, height: 35, marginRight: 10 }} />
                <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{ fontWeight: 'bold', color: '#ffffff', flex: 1 }}
                >
                    {item.title}
                </Text>
            </View>

            <View
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    padding: 5,
                    borderRadius: 4,
                    backgroundColor: '#009DDB',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <Icon name="clock" size={18} color="#ffffff" />
                <Text style={{ marginLeft: 5, color: '#ffffff' }}>{item.time}</Text>
            </View>
        </ImageBackground>
    );
};

export default EpisodioCard;
