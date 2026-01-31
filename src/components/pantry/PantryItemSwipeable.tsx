import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { Colors } from '../../theme/Colors';

interface SwipeableProps {
    children: React.ReactNode;
    onDelete: () => void;
}

export function PantryItemSwipeable({ children, onDelete }: SwipeableProps) {
    const renderRightActions = () => {
        return (
            <Pressable onPress={onDelete} style={styles.rightAction}>
                <Ionicons name="trash-outline" size={24} color="white" />
            </Pressable>
        );
    };

    return (
        <GestureHandlerRootView>
            <Swipeable renderRightActions={renderRightActions} friction={2} rightThreshold={40}>
                {children}
            </Swipeable>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    rightAction: {
        backgroundColor: Colors.rose[500],
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        borderRadius: 24,
        marginLeft: 10,
        marginBottom: 16,
    },
});
