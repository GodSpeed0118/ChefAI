import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextStyle, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '../src/components/common/GlassCard';
import { NotificationService } from '../src/services/NotificationService';
import { StorageService } from '../src/services/StorageService';
import { Colors } from '../src/theme/Colors';
import { Gradients } from '../src/theme/Gradients';
import { Spacing } from '../src/theme/Spacing';
import { Typography } from '../src/theme/Typography';
import { DEFAULT_NOTIFICATION_SETTINGS, NotificationSettings } from '../src/types/settings';

export default function SettingsScreen() {
    const router = useRouter();
    const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const savedSettings = await StorageService.getNotificationSettings();
        setSettings(savedSettings);
    };

    const toggleSetting = async (key: keyof NotificationSettings) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        setSettings(newSettings);
        await StorageService.saveNotificationSettings(newSettings);

        if (key === 'expiryAlerts' && newSettings.expiryAlerts) {
            await NotificationService.registerForPushNotificationsAsync();
        }
    };

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
                        App <Text className="text-accent-500">Settings</Text>
                    </Text>
                    <View className="w-11" />
                </View>

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                    <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
                        <Text style={styles.sectionTitle}>Notifications</Text>

                        <GlassCard intensity={8} style={styles.settingsGroup as ViewStyle}>
                            <View style={styles.settingItem}>
                                <View style={styles.settingInfo}>
                                    <Ionicons name="notifications-outline" size={20} color={Colors.accent[500]} />
                                    <View>
                                        <Text style={styles.settingLabel}>Food Expiry Alerts</Text>
                                        <Text style={styles.settingDesc}>Notify 1 day before food expires</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={settings.expiryAlerts}
                                    onValueChange={() => toggleSetting('expiryAlerts')}
                                    trackColor={{ false: '#334155', true: Colors.accent[500] }}
                                    thumbColor="white"
                                />
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.settingItem}>
                                <View style={styles.settingInfo}>
                                    <Ionicons name="restaurant-outline" size={20} color={Colors.emerald[500]} />
                                    <View>
                                        <Text style={styles.settingLabel}>Meal Reminders</Text>
                                        <Text style={styles.settingDesc}>Notifications for planned meals</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={settings.mealReminders}
                                    onValueChange={() => toggleSetting('mealReminders')}
                                    trackColor={{ false: '#334155', true: Colors.accent[500] }}
                                    thumbColor="white"
                                />
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.settingItem}>
                                <View style={styles.settingInfo}>
                                    <Ionicons name="analytics-outline" size={20} color={Colors.sky[500]} />
                                    <View>
                                        <Text style={styles.settingLabel}>Nutrition Check-in</Text>
                                        <Text style={styles.settingDesc}>Daily goal tracking reminder</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={settings.nutritionGoals}
                                    onValueChange={() => toggleSetting('nutritionGoals')}
                                    trackColor={{ false: '#334155', true: Colors.accent[500] }}
                                    thumbColor="white"
                                />
                            </View>
                        </GlassCard>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
                        <Text style={styles.sectionTitle}>Reminder Time</Text>
                        <GlassCard intensity={8} style={styles.settingItem as ViewStyle}>
                            <View style={styles.settingInfo}>
                                <Ionicons name="time-outline" size={20} color="white" />
                                <View>
                                    <Text style={styles.settingLabel}>Daily Notifications at</Text>
                                    <Text style={styles.settingDesc}>{settings.dailyReminderTime}</Text>
                                </View>
                            </View>
                            <Pressable style={styles.changeBtn}>
                                <Text style={styles.changeBtnText}>Change</Text>
                            </Pressable>
                        </GlassCard>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(400)} style={styles.footer}>
                        <Text style={styles.versionText}>ChefAI v1.0.0</Text>
                        <Text style={styles.footerMuted}>Powered by Gemini AI Vision</Text>
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.bold as any,
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: Spacing.md,
        marginLeft: Spacing.xs,
    } as TextStyle,
    settingsGroup: {
        borderRadius: 24,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.lg,
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        flex: 1,
    },
    settingLabel: {
        fontSize: Typography.size.md,
        fontWeight: Typography.weight.bold as any,
        color: 'white',
    } as TextStyle,
    settingDesc: {
        fontSize: Typography.size.tiny,
        color: 'rgba(255,255,255,0.4)',
        marginTop: 2,
    } as TextStyle,
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginHorizontal: Spacing.lg,
    },
    changeBtn: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    changeBtnText: {
        fontSize: Typography.size.xs,
        fontWeight: Typography.weight.bold as any,
        color: 'white',
    } as TextStyle,
    footer: {
        marginTop: Spacing.xxl,
        alignItems: 'center',
        gap: 4,
        paddingBottom: 40,
    },
    versionText: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 10,
        fontWeight: Typography.weight.bold as any,
    } as TextStyle,
    footerMuted: {
        color: 'rgba(255,255,255,0.1)',
        fontSize: 9,
        textTransform: 'uppercase',
        letterSpacing: 1,
    } as TextStyle,
});
