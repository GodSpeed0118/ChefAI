
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealPlanItem {
    id: string;
    recipeId: string;
    recipeName: string;
    day: string; // ISO date string or 'Monday', etc. For this app, let's use full date.
    mealType: MealType;
}

export interface MealPlan {
    id: string;
    name: string;
    items: MealPlanItem[];
    startDate: string; // ISO date
    endDate: string;   // ISO date
}

export interface GroceryItem {
    name: string;
    quantity: number;
    unit: string;
    category: string;
    recipes: string[]; // IDs of recipes requiring this item
    checked: boolean;
}

export interface FavoriteMealPlan {
    id: string;
    name: string;
    items: Omit<MealPlanItem, 'id' | 'day'>[]; // Template items
}
