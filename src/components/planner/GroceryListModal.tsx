import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { StorageService } from '../../services/StorageService';
import { Colors } from '../../theme/Colors';
import { Spacing } from '../../theme/Spacing';
import { Typography } from '../../theme/Typography';
import { GroceryItem, MealPlanItem } from '../../types/planner';
import { Recipe } from '../../types/recipe';
import { GlassCard } from '../common/GlassCard';

interface GroceryListModalProps {
    visible: boolean;
    onClose: () => void;
    plan: MealPlanItem[];
}

export function GroceryListModal({ visible, onClose, plan }: GroceryListModalProps) {
    const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);

    useEffect(() => {
        if (visible) {
            generateList();
        }
    }, [visible, plan]);

    const generateList = async () => {
        const savedRecipes = await StorageService.getSavedRecipes();
        const plannedRecipes = plan.map(item => savedRecipes.find(r => (r.id || r.name) === item.recipeId)).filter(Boolean) as Recipe[];

        const aggregation: Record<string, GroceryItem> = {};

        plannedRecipes.forEach(recipe => {
            recipe.ingredients.forEach(ing => {
                const key = ing.name.toLowerCase();
                if (aggregation[key]) {
                    aggregation[key].quantity += ing.amount ?? 0;
                    if (!aggregation[key].recipes.includes(recipe.name)) {
                        aggregation[key].recipes.push(recipe.name);
                    }
                } else {
                    aggregation[key] = {
                        name: ing.name,
                        quantity: ing.amount ?? 0,
                        unit: ing.unit ?? ing.quantity ?? '',
                        category: getCategory(ing.name),
                        recipes: [recipe.name],
                        checked: false,
                    };
                }
            });
        });

        setGroceryItems(Object.values(aggregation));
    };

    const getCategory = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('milk') || n.includes('cheese') || n.includes('yogurt')) return 'Dairy';
        if (n.includes('chicken') || n.includes('beef') || n.includes('pork') || n.includes('fish')) return 'Meat/Seafood';
        if (n.includes('apple') || n.includes('spinach') || n.includes('tomato') || n.includes('onion')) return 'Produce';
        if (n.includes('flour') || n.includes('sugar') || n.includes('oil') || n.includes('salt')) return 'Pantry';
        return 'Other';
    };

    const toggleItem = (name: string) => {
        setGroceryItems(prev => prev.map(item =>
            item.name === name ? { ...item, checked: !item.checked } : item
        ));
    };

    const grouped = groceryItems.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, GroceryItem[]>);

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFill as ViewStyle} onPress={onClose} />
                <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />

                <View style={styles.content}>
                    <GlassCard intensity={40} style={styles.modalCard as ViewStyle}>
                        <View style={styles.header}>
                            <View>
                                <Text style={styles.title}>Grocery List</Text>
                                <Text style={styles.subtitle}>{groceryItems.length} items to buy</Text>
                            </View>
                            <Pressable onPress={onClose} style={styles.closeBtn}>
                                <Ionicons name="close" size={24} color="white" />
                            </Pressable>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {groceryItems.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <Ionicons name="cart-outline" size={48} color="rgba(255,255,255,0.1)" />
                                    <Text style={styles.emptyText}>Your list is empty. Plan some meals first!</Text>
                                </View>
                            ) : (
                                Object.keys(grouped).map(cat => (
                                    <View key={cat} style={styles.group}>
                                        <Text style={styles.groupTitle}>{cat}</Text>
                                        {grouped[cat].map(item => (
                                            <Pressable
                                                key={item.name}
                                                onPress={() => toggleItem(item.name)}
                                                style={[styles.item, item.checked && styles.itemChecked]}
                                            >
                                                <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                                                    {item.checked && <Ionicons name="checkmark" size={14} color="white" />}
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>{item.name}</Text>
                                                    <Text style={styles.itemMeta}>{item.quantity} {item.unit}</Text>
                                                </View>
                                                <Text style={styles.recipeCount}>{item.recipes.length} recipes</Text>
                                            </Pressable>
                                        ))}
                                    </View>
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
        height: '85%',
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
    subtitle: {
        fontSize: Typography.size.sm,
        color: 'rgba(255,255,255,0.4)',
        marginTop: 2,
    } as TextStyle,
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    group: {
        marginBottom: Spacing.lg,
    },
    groupTitle: {
        fontSize: Typography.size.tiny,
        fontWeight: Typography.weight.bold as any,
        color: Colors.accent[500],
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: Spacing.sm,
        marginLeft: 4,
    } as TextStyle,
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    itemChecked: {
        opacity: 0.5,
        backgroundColor: 'transparent',
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        marginRight: Spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: Colors.emerald[500],
        borderColor: Colors.emerald[500],
    },
    itemName: {
        fontSize: Typography.size.md,
        fontWeight: Typography.weight.bold as any,
        color: 'white',
    } as TextStyle,
    itemNameChecked: {
        textDecorationLine: 'line-through',
    },
    itemMeta: {
        fontSize: Typography.size.tiny,
        color: 'rgba(255,255,255,0.4)',
        marginTop: 2,
    } as TextStyle,
    recipeCount: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.3)',
        fontWeight: Typography.weight.bold as any,
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    } as TextStyle,
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.3)',
        textAlign: 'center',
        marginTop: Spacing.md,
        fontSize: Typography.size.md,
        maxWidth: 240,
    } as TextStyle,
});
