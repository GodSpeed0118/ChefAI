import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../types/recipe';

const STORAGE_KEY = '@chefai_saved_recipes';

export function useSavedRecipes() {
    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSavedRecipes();
    }, []);

    const loadSavedRecipes = async () => {
        try {
            const storedData = await AsyncStorage.getItem(STORAGE_KEY);
            if (storedData) {
                setSavedRecipes(JSON.parse(storedData));
            }
        } catch (error) {
            console.error('Failed to load saved recipes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveRecipe = async (recipe: Recipe) => {
        try {
            const updatedRecipes = [recipe, ...savedRecipes];
            setSavedRecipes(updatedRecipes);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecipes));
        } catch (error) {
            console.error('Failed to save recipe:', error);
        }
    };

    const removeRecipe = async (recipeName: string) => {
        try {
            const updatedRecipes = savedRecipes.filter(r => r.name !== recipeName);
            setSavedRecipes(updatedRecipes);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecipes));
        } catch (error) {
            console.error('Failed to remove recipe:', error);
        }
    };

    const isSaved = (recipeName: string) => {
        return savedRecipes.some(r => r.name === recipeName);
    };

    const toggleSave = async (recipe: Recipe) => {
        if (isSaved(recipe.name)) {
            await removeRecipe(recipe.name);
        } else {
            await saveRecipe(recipe);
        }
    };

    return {
        savedRecipes,
        isLoading,
        isSaved,
        toggleSave,
        refresh: loadSavedRecipes
    };
}
