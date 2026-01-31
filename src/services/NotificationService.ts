import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotificationSettings } from '../types/settings';

// Configure how notifications are handled when the app is foregrounded
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const NotificationService = {
    async registerForPushNotificationsAsync(): Promise<string | undefined> {
        if (!Device.isDevice) {
            console.log('Must use physical device for Push Notifications');
            return;
        }

        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                console.log('Failed to get push token for push notification!');
                return;
            }

            const token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log('Expo Push Token:', token);

            if (Platform.OS === 'android') {
                Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            return token;
        } catch (error) {
            console.log('Error registering for push notifications:', error);
            return undefined;
        }
    },

    async scheduleExpiryAlert(itemName: string, expiryDate: Date, settings: NotificationSettings) {
        if (!settings.expiryAlerts) return;

        // Schedule 1 day before expiry
        const trigger = new Date(expiryDate);
        trigger.setDate(trigger.getDate() - 1);
        trigger.setHours(9, 0, 0, 0); // 9 AM

        if (trigger < new Date()) return; // Already passed

        await Notifications.scheduleNotificationAsync({
            content: {
                title: '🍎 Food Expiring Soon',
                body: `Your ${itemName} will expire tomorrow! Time to cook something delicious?`,
                data: { screen: 'pantry' },
            },
            trigger,
        });
    },

    async scheduleDailyReminder(time: string, settings: NotificationSettings) {
        if (!settings.nutritionGoals) return;

        const [hours, minutes] = time.split(':').map(Number);

        await Notifications.scheduleNotificationAsync({
            content: {
                title: '🥗 Nutrition Check-in',
                body: "Don't forget to track your meals for today and stay on top of your goals!",
                data: { screen: 'nutrition' },
            },
            trigger: {
                hour: hours,
                minute: minutes,
                repeats: true,
            },
        });
    },

    async cancelAllNotifications() {
        await Notifications.cancelAllScheduledNotificationsAsync();
    }
};
