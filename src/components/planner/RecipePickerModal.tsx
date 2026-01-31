import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Spacing } from '../../theme/Spacing';
import { Typography } from '../../theme/Typography';
import { Recipe } from '../../types/recipe';
import { GlassCard } from '../common/GlassCard';

interface RecipePickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (recipe: Recipe) => void;
    savedRecipes: Recipe[];
}

export function RecipePickerModal({ visible, onClose, onSelect, savedRecipes }: RecipePickerModalProps) {
    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFill as ViewStyle} onPress={onClose} />
                <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />

                <View style={styles.content}>
                    <GlassCard intensity={40} style={styles.modalCard as ViewStyle}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Assign Recipe</Text>
                            <Pressable onPress={onClose} style={styles.closeBtn}>
                                <Ionicons name="close" size={24} color="white" />
                            </Pressable>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {savedRecipes.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <Ionicons name="heart-dislike-outline" size={48} color="rgba(255,255,255,0.1)" />
                                    <Text style={styles.emptyText}>No saved recipes found. Save some recipes first!</Text>
                                </View>
                            ) : (
                                savedRecipes.map(recipe => (
                                    <Pressable
                                        key={recipe.id || recipe.name}
                                        onPress={() => onSelect(recipe)}
                                        style={({ pressed }) => [
                                            styles.recipeItem,
                                            pressed && { backgroundColor: 'rgba(255,255,255,0.1)' }
                                        ] as any}
                                    >
                                        <View style={styles.recipeIcon}>
                                            <Ionicons name="restaurant-outline" size={20} color="white" style={{ opacity: 0.5 }} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.recipeName}>{recipe.name}</Text>
                                            <Text style={styles.recipeMeta}>{recipe.prepTime} • {recipe.calories} cal</Text>
                                        </View>
                                        <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.2)" />
                                    </Pressable>
                                ))
                            )}
                        </ScrollView>
                    </GlassCard>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    content: {
        height: '70%',
    },
    modalCard: {
        flex: 1,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: Spacing.xl,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.xl,
    },
    title: {
        fontSize: Typography.size.xl,
        fontWeight: Typography.weight.black as any,
        color: 'white',
    } as TextStyle,
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    recipeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    recipeIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    recipeName: {
        fontSize: Typography.size.md,
        fontWeight: Typography.weight.bold as any,
        color: 'white',
        marginBottom: 2,
    } as TextStyle,
    recipeMeta: {
        fontSize: Typography.size.tiny,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: Typography.weight.medium as any,
    } as TextStyle,
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.3)',
        textAlign: 'center',
        marginTop: Spacing.md,
        fontSize: Typography.size.sm,
        maxWidth: 200,
    } as TextStyle,
});
