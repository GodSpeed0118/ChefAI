import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedCard } from '../src/components/common/AnimatedCard';
import { GlassCard } from '../src/components/common/GlassCard';
import { PantryAnalyticsCard } from '../src/components/pantry/PantryAnalyticsCard';
import { PantryItemSwipeable } from '../src/components/pantry/PantryItemSwipeable';
import { PantryModal } from '../src/components/pantry/PantryModal';
import { NotificationService } from '../src/services/NotificationService';
import { PantryAnalytics, PantryItem, StorageService } from '../src/services/StorageService';
import { Colors } from '../src/theme/Colors';
import { Gradients } from '../src/theme/Gradients';
import { Spacing } from '../src/theme/Spacing';
import { Typography } from '../src/theme/Typography';

export default function PantryScreen() {
    const router = useRouter();
    const [items, setItems] = useState<PantryItem[]>([]);
    const [analytics, setAnalytics] = useState<PantryAnalytics>({
        totalItems: 0,
        expiringSoon: 0,
        expired: 0,
        categoriesCount: {},
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<PantryItem | null>(null);

    useEffect(() => {
        loadPantry();
    }, []);

    const loadPantry = async () => {
        const data = await StorageService.getPantry();
        setItems(data);
        const stats = await StorageService.getAnalytics();
        setAnalytics(stats);
    };

    const handleSaveItem = async (itemData: Partial<PantryItem>) => {
        try {
            if (editingItem) {
                await StorageService.updateItem(editingItem.id, itemData);
            } else {
                await StorageService.addItem(itemData as Omit<PantryItem, 'id' | 'addedAt'>);
            }

            // Notification Integration
            const settings = await StorageService.getNotificationSettings();
            if (settings.expiryAlerts && itemData.name && itemData.expiryDate) {
                await NotificationService.scheduleExpiryAlert(
                    itemData.name,
                    new Date(itemData.expiryDate),
                    settings
                );
            }

            setModalVisible(false);
            setEditingItem(null);
            loadPantry();
        } catch (error) {
            console.error('Error saving item:', error);
        }
    };

    const removeItem = async (id: string) => {
        await StorageService.removeItem(id);
        loadPantry();
    };

    const openEdit = (item: PantryItem) => {
        setEditingItem(item);
        setModalVisible(true);
    };

    const openAdd = () => {
        setEditingItem(null);
        setModalVisible(true);
    };

    const getExpiryColor = (expiryDate: string) => {
        const diff = new Date(expiryDate).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (days < 0) return Colors.rose[500];
        if (days <= 3) return '#fbbf24'; // amber-400
        return Colors.emerald[500];
    };

    const groupedItems = useMemo(() => {
        return items.reduce((acc, item) => {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item);
            return acc;
        }, {} as Record<string, PantryItem[]>);
    }, [items]);

    return (
        <View className="flex-1 bg-primary-950">
            <LinearGradient colors={Gradients.background as any} style={StyleSheet.absoluteFill} />
            <SafeAreaView className="flex-1">
                <StatusBar style="light" />

                {/* Header */}
                <View className="px-6 py-4 flex-row items-center justify-between">
                    <Pressable
                        onPress={() => router.back()}
                        className="w-11 h-11 rounded-2xl bg-white/5 items-center justify-center border border-white/10"
                    >
                        <Ionicons name="arrow-back" size={22} color="white" />
                    </Pressable>

                    <Text style={{ fontSize: Typography.size.xl, fontWeight: Typography.weight.black as any }} className="text-white italic tracking-tight">
                        Smart <Text className="text-accent-500">Pantry</Text>
                    </Text>

                    <View className="flex-row gap-2">
                        <Pressable
                            onPress={() => router.push('/settings')}
                            className="w-11 h-11 rounded-2xl bg-white/5 items-center justify-center border border-white/10"
                        >
                            <Ionicons name="settings-outline" size={22} color="white" />
                        </Pressable>
                        <Pressable
                            onPress={openAdd}
                            className="w-11 h-11 rounded-2xl bg-accent-500 items-center justify-center border border-accent-400 shadow-lg shadow-accent-500/30"
                        >
                            <Ionicons name="add" size={26} color="white" />
                        </Pressable>
                    </View>
                </View>

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Spacing.xl }}>
                    {/* Analytics */}
                    <PantryAnalyticsCard
                        total={analytics.totalItems}
                        expiring={analytics.expiringSoon}
                        expired={analytics.expired}
                    />

                    {items.length === 0 ? (
                        <View className="items-center justify-center pt-24">
                            <Animated.View entering={FadeInDown.delay(200)} className="w-20 h-20 rounded-[30px] bg-white/5 border border-white/10 items-center justify-center mb-6">
                                <Ionicons name="leaf-outline" size={40} color="rgba(255,255,255,0.1)" />
                            </Animated.View>
                            <Animated.Text entering={FadeInDown.delay(400)} style={{ fontSize: Typography.size.xl, fontWeight: Typography.weight.black as any }} className="text-white mb-2 text-center">Your Pantry is Empty</Animated.Text>
                            <Animated.Text entering={FadeInDown.delay(600)} style={{ fontSize: Typography.size.sm }} className="text-white/40 text-center leading-6 font-medium max-w-[240px]">
                                Start adding ingredients manually to build your culinary vault.
                            </Animated.Text>
                        </View>
                    ) : (
                        Object.keys(groupedItems).map((category, catIndex) => (
                            <View key={category} style={{ marginBottom: Spacing.xl }}>
                                <Text style={{ fontSize: Typography.size.tiny, letterSpacing: Typography.tracking.widest }} className="text-accent-400 font-extrabold uppercase mb-4 ml-2">
                                    {category}
                                </Text>
                                <View style={{ gap: Spacing.md }}>
                                    {groupedItems[category].map((item, index) => (
                                        <PantryItemSwipeable key={item.id} onDelete={() => removeItem(item.id)}>
                                            <AnimatedCard
                                                delay={index * 50}
                                                onPress={() => openEdit(item)}
                                                style={{ padding: 0 }}
                                            >
                                                <GlassCard intensity={15} style={{ padding: 16 }}>
                                                    <View className="flex-row items-center justify-between">
                                                        <View className="flex-row items-center flex-1">
                                                            <View style={[styles.statusDot, { backgroundColor: getExpiryColor(item.expiryDate) }]} />
                                                            <View className="w-10 h-10 rounded-xl bg-white/5 items-center justify-center border border-white/10 mr-3">
                                                                <Ionicons name="restaurant-outline" size={18} color="white" style={{ opacity: 0.5 }} />
                                                            </View>
                                                            <View className="flex-1">
                                                                <Text style={{ fontSize: Typography.size.md, fontWeight: Typography.weight.bold as any }} className="text-white capitalize leading-tight">{item.name}</Text>
                                                                <Text style={{ fontSize: Typography.size.tiny }} className="text-white/30 font-bold">
                                                                    {item.quantity} {item.unit} • Expires {new Date(item.expiryDate).toLocaleDateString()}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.2)" />
                                                    </View>
                                                </GlassCard>
                                            </AnimatedCard>
                                        </PantryItemSwipeable>
                                    ))}
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>

                <PantryModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onSave={handleSaveItem}
                    initialItem={editingItem}
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    statusDot: {
        width: 4,
        height: 24,
        borderRadius: 2,
        marginRight: 12,
    }
});
