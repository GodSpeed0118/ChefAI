export interface MacroNutrients {
    protein: number; // in grams
    carbs: number;   // in grams
    fat: number;     // in grams
}

export interface DailyNutrition {
    date: string; // ISO date string
    calories: number;
    macros: MacroNutrients;
    waterIntake?: number; // in ml
}

export interface NutritionGoals {
    calories: number;
    macros: MacroNutrients;
}

export interface WeeklyNutrition {
    id: string;
    weekStartDate: string;
    dailyData: DailyNutrition[];
    streakDays: number;
}
