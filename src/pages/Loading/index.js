import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Loading = () => {
    return (
        <LinearGradient colors={['#9bcbc9', '#616161']} style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logo}>Glo+</Text>
                <ActivityIndicator size="small" color="#ffffff" />
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#d4d4d4',
        padding: 15,
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

export default Loading;
