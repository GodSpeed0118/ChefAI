import { useState, useEffect } from 'react';
import { Recipe } from '../types/recipe';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface SavedRecipeRow {
    id: string;
    user_id: string;
    recipe_data: Recipe;
    created_at: string;
}

export function useSavedRecipes() {
    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            loadSavedRecipes();
        } else {
            // Clear recipes if user is not authenticated
            setSavedRecipes([]);
            setIsLoading(false);
        }
    }, [user]);

    const loadSavedRecipes = async () => {
        if (!user) {
            setSavedRecipes([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('saved_recipes')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Failed to load saved recipes:', error);
                setSavedRecipes([]);
            } else {
                const recipes = (data as SavedRecipeRow[]).map(row => row.recipe_data);
                setSavedRecipes(recipes);
            }
        } catch (error) {
            console.error('Failed to load saved recipes:', error);
            setSavedRecipes([]);
        } finally {
            setIsLoading(false);
        }
    };

    const saveRecipe = async (recipe: Recipe) => {
        if (!user) {
            console.error('User must be authenticated to save recipes');
            return;
        }

        try {
            const { error } = await supabase
                .from('saved_recipes')
                .insert({
                    user_id: user.id,
                    recipe_data: recipe,
                });

            if (error) {
                console.error('Failed to save recipe:', error);
            } else {
                // Optimistically update local state
                setSavedRecipes(prev => [recipe, ...prev]);
            }
        } catch (error) {
            console.error('Failed to save recipe:', error);
        }
    };

    const removeRecipe = async (recipeName: string) => {
        if (!user) {
            console.error('User must be authenticated to remove recipes');
            return;
        }

        try {
            // Find the recipe to delete by querying for matching recipe_data->name
            const { data: recipesToDelete, error: fetchError } = await supabase
                .from('saved_recipes')
                .select('id')
                .eq('user_id', user.id)
                .eq('recipe_data->>name', recipeName);

            if (fetchError) {
                console.error('Failed to find recipe:', fetchError);
                return;
            }

            if (recipesToDelete && recipesToDelete.length > 0) {
                const { error: deleteError } = await supabase
                    .from('saved_recipes')
                    .delete()
                    .eq('id', recipesToDelete[0].id);

                if (deleteError) {
                    console.error('Failed to remove recipe:', deleteError);
                } else {
                    // Optimistically update local state
                    setSavedRecipes(prev => prev.filter(r => r.name !== recipeName));
                }
            }
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
