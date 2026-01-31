import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteMealPlan, MealPlanItem } from '../types/planner';
import { Recipe } from '../types/recipe';
import { DEFAULT_NOTIFICATION_SETTINGS, NotificationSettings } from '../types/settings';

export interface PantryItem {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    category: string;
    expiryDate: string; // ISO string
    addedAt: string;
}

export interface PantryAnalytics {
    totalItems: number;
    expiringSoon: number;
    expired: number;
    categoriesCount: Record<string, number>;
}

const STORAGE_KEYS = {
    PANTRY: 'chef_ai_pantry',
    SAVED_RECIPES: 'chef_ai_saved_recipes',
    MEAL_PLAN: 'chef_ai_meal_plan',
    FAVORITE_PLANS: 'chef_ai_favorite_plans',
    NOTIFICATION_SETTINGS: 'chef_ai_notification_settings',
};

export const StorageService = {
    async getPantry(): Promise<PantryItem[]> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.PANTRY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting pantry:', error);
            return [];
        }
    },

    async savePantry(items: PantryItem[]): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.PANTRY, JSON.stringify(items));
        } catch (error) {
            console.error('Error saving pantry:', error);
        }
    },

    async addItem(item: Omit<PantryItem, 'id' | 'addedAt'>): Promise<void> {
        const pantry = await this.getPantry();
        const newItem: PantryItem = {
            ...item,
            id: Math.random().toString(36).substring(7),
            addedAt: new Date().toISOString(),
        };
        await this.savePantry([...pantry, newItem]);
    },

    async updateItem(id: string, updates: Partial<PantryItem>): Promise<void> {
        const pantry = await this.getPantry();
        const updated = pantry.map(item =>
            item.id === id ? { ...item, ...updates } : item
        );
        await this.savePantry(updated);
    },

    async removeItem(id: string): Promise<void> {
        const pantry = await this.getPantry();
        await this.savePantry(pantry.filter(i => i.id !== id));
    },

    async getAnalytics(): Promise<PantryAnalytics> {
        const items = await this.getPantry();
        const now = new Date();
        const weekFromNow = new Date();
        weekFromNow.setDate(now.getDate() + 7);

        let expiringSoon = 0;
        let expired = 0;
        const categoriesCount: Record<string, number> = {};

        items.forEach(item => {
            const expiry = new Date(item.expiryDate);
            if (expiry < now) {
                expired++;
            } else if (expiry <= weekFromNow) {
                expiringSoon++;
            }

            categoriesCount[item.category] = (categoriesCount[item.category] || 0) + 1;
        });

        return {
            totalItems: items.length,
            expiringSoon,
            expired,
            categoriesCount,
        };
    },

    // Meal Plan Methods
    async getMealPlan(): Promise<MealPlanItem[]> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.MEAL_PLAN);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error fetching meal plan:', error);
            return [];
        }
    },

    async saveMealPlan(items: MealPlanItem[]): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.MEAL_PLAN, JSON.stringify(items));
        } catch (error) {
            console.error('Error saving meal plan:', error);
        }
    },

    async updateMealPlanItem(item: MealPlanItem): Promise<void> {
        const plan = await this.getMealPlan();
        const existingIndex = plan.findIndex(p => p.day === item.day && p.mealType === item.mealType);

        if (existingIndex > -1) {
            plan[existingIndex] = item;
        } else {
            plan.push(item);
        }
        await this.saveMealPlan(plan);
    },

    async removeMealPlanItem(day: string, mealType: string): Promise<void> {
        const plan = await this.getMealPlan();
        const updated = plan.filter(p => !(p.day === day && p.mealType === mealType));
        await this.saveMealPlan(updated);
    },

    // Favorite Plans
    async getFavoritePlans(): Promise<FavoriteMealPlan[]> {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITE_PLANS);
        return data ? JSON.parse(data) : [];
    },

    async saveFavoritePlan(plan: FavoriteMealPlan): Promise<void> {
        const favorites = await this.getFavoritePlans();
        favorites.push({ ...plan, id: Date.now().toString() });
        await AsyncStorage.setItem(STORAGE_KEYS.FAVORITE_PLANS, JSON.stringify(favorites));
    },

    async getSavedRecipes(): Promise<Recipe[]> {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_RECIPES);
        return data ? JSON.parse(data) : [];
    },

    async getNotificationSettings(): Promise<NotificationSettings> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS);
            return data ? JSON.parse(data) : DEFAULT_NOTIFICATION_SETTINGS;
        } catch (error) {
            console.error('Error fetching notification settings:', error);
            return DEFAULT_NOTIFICATION_SETTINGS;
        }
    },

    async saveNotificationSettings(settings: NotificationSettings): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving notification settings:', error);
        }
    }
};
