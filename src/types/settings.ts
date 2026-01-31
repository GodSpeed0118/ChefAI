export interface NotificationSettings {
    expiryAlerts: boolean;
    mealReminders: boolean;
    cookingSuggestions: boolean;
    nutritionGoals: boolean;
    dailyReminderTime: string; // HH:mm format
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
    expiryAlerts: true,
    mealReminders: true,
    cookingSuggestions: false,
    nutritionGoals: true,
    dailyReminderTime: '09:00',
};
