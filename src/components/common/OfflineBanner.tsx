import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';

export const OfflineBanner = () => {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOffline(!(state.isConnected && state.isInternetReachable !== false));
        });

        return () => unsubscribe();
    }, []);

    if (!isOffline) return null;

    return (
        <Animated.View
            entering={FadeInUp.duration(400)}
            exiting={FadeOutUp.duration(400)}
            style={styles.container}
        >
            <BlurView intensity={30} tint="dark" style={styles.blur}>
                <View className="flex-row items-center px-6 py-3 border border-orange-500/30 rounded-full">
                    <View className="w-2 h-2 rounded-full bg-orange-500 animate-pulse mr-3" />
                    <Ionicons name="cloud-offline-outline" size={18} color={Colors.orange[500]} />
                    <Text className="text-white font-bold ml-2 text-xs">Offline Mode • Using Cached Data</Text>
                </View>
            </BlurView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 9999,
        paddingHorizontal: 20,
    },
    blur: {
        borderRadius: 25,
        overflow: 'hidden',
    }
});
