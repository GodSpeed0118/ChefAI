# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ChefAI is an iOS app that analyzes fridge contents from a photo and recommends recipes. The user takes a photo of their fridge, the app identifies food items via GPT-4o's vision API, then suggests 3-5 recipes with difficulty ratings, calorie counts, ingredient lists, and cooking steps.

## Tech Stack

- **Frontend:** React Native + Expo (iOS target), TypeScript
- **Navigation:** Expo Router (file-based routing)
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **Async State:** TanStack Query (React Query) for API call management
- **Validation:** Zod for runtime validation of AI API responses
- **Backend:** Supabase (auth, storage, database)
- **AI:** OpenAI GPT-4o API for image analysis and recipe generation
- **Camera:** Expo ImagePicker
- **Images:** expo-image for optimized image display and caching

## Build & Run Commands

```bash
npx expo start              # Start dev server
npx expo start --ios        # Start with iOS simulator
npx expo run:ios            # Native iOS build
npx expo install <pkg>      # Add dependencies (use this instead of npm install for Expo compatibility)
```

## Architecture

**Core user flow:** Camera capture → GPT-4o Vision API (identify ingredients) → GPT-4o text API (generate recipes) → Display recipe cards.

The OpenAI API integration involves two sequential calls:
1. **Image analysis** — send fridge photo to GPT-4o with vision, receive structured list of identified ingredients
2. **Recipe generation** — send ingredient list to GPT-4o, receive 3-5 recipes each containing: name, difficulty (1-5), total calories, full ingredient list, and step-by-step instructions

**Supabase** handles:
- **Authentication** — Email/password sign-up and sign-in with session persistence via AsyncStorage
- **Database** — User-specific saved recipes stored in the `saved_recipes` table with Row Level Security
- **Storage** — Temporary image uploads for API processing (planned)

The Supabase MCP server is pre-configured in `.mcp.json`.

## Key Conventions

- Use Expo's managed workflow; avoid ejecting
- All source files use TypeScript (`.ts`/`.tsx`); avoid `.js`/`.jsx`
- Use NativeWind's `className` prop for styling; avoid inline `StyleSheet.create` unless NativeWind doesn't cover the case
- API keys must go in environment variables (use `expo-constants` or `.env` with `expo-env`), never hardcoded
- AI API calls should go through a service layer, not directly in components
- Use TanStack Query hooks to wrap API calls; avoid raw `useEffect` for data fetching
- Validate AI API responses with Zod schemas before rendering; define schemas alongside their corresponding TypeScript types
- Use Expo Router file-based routing in the `app/` directory
- Use `expo-image` `<Image>` instead of React Native's built-in `<Image>`
- Image uploads to Supabase Storage should be cleaned up after processing
- Auth-related code must go through the service layer (`src/services/auth.ts`), not directly calling Supabase in components
- Use the `useAuth()` hook from `AuthContext` to access auth state and methods app-wide
- Protected routes are handled automatically by the root layout based on auth state

## Authentication System

ChefAI uses **Supabase Auth** for user authentication with email/password sign-up and sign-in.

### Auth Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  app/_layout.tsx (Root Layout)                              │
│  ├── AuthProvider (wraps entire app)                        │
│  │   └── Manages auth state via onAuthStateChange          │
│  └── RootLayoutNav (auth-based routing)                     │
│      ├── If user: Show main app (index, results, saved)    │
│      └── If no user: Redirect to /(auth)/login             │
└─────────────────────────────────────────────────────────────┘
```

### Auth Service Layer (`src/services/auth.ts`)

All Supabase auth operations are centralized in this service:
- `signUp({ email, password })` — Create new user account
- `signIn({ email, password })` — Sign in existing user
- `signOut()` — Sign out current user
- `getCurrentSession()` — Get current session
- `getCurrentUser()` — Get current user
- `onAuthStateChange(callback)` — Subscribe to auth state changes
- `getAuthErrorMessage(error)` — Map Supabase errors to user-friendly messages

### Auth Context (`src/context/AuthContext.tsx`)

Provides global auth state and methods:
```typescript
const { user, session, isLoading, signIn, signUp, signOut } = useAuth();
```

- `user: User | null` — Current authenticated user
- `session: Session | null` — Current session with tokens
- `isLoading: boolean` — Loading state during initial session check
- `signIn(email, password)` — Sign in function
- `signUp(email, password)` — Sign up function
- `signOut()` — Sign out function

### Protected Routes

Routes are automatically protected based on auth state in `app/_layout.tsx`:
- **Unauthenticated users** → Redirected to `/(auth)/login`
- **Authenticated users** on auth screens → Redirected to `/` (home)

### Auth Screens

- `app/(auth)/login.tsx` — Login screen with email/password, validation, error display
- `app/(auth)/register.tsx` — Registration screen with email/password/confirm, validation
- Both screens use NativeWind styling matching the app's dark indigo theme

## File Structure

```
ChefAI/
├── app/                              # Expo Router file-based routing
│   ├── (auth)/                       # Auth route group (login, register)
│   │   ├── _layout.tsx              # Auth layout (redirects authenticated users)
│   │   ├── login.tsx                # Login screen
│   │   └── register.tsx             # Register screen
│   ├── _layout.tsx                  # Root layout (AuthProvider, auth-based routing)
│   ├── index.tsx                    # Home screen (camera/gallery + logout button)
│   ├── results.tsx                  # Results screen (ingredients + recipes)
│   └── saved.tsx                    # Saved recipes screen (user-specific)
├── src/
│   ├── components/                  # Reusable React Native components
│   │   ├── ErrorState.tsx
│   │   ├── IngredientTag.tsx
│   │   ├── LoadingState.tsx
│   │   └── RecipeCard.tsx
│   ├── context/                     # React contexts
│   │   └── AuthContext.tsx          # Auth state provider
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAnalyzeImage.ts
│   │   ├── useGenerateRecipes.ts
│   │   └── useSavedRecipes.ts       # Supabase-backed saved recipes (per-user)
│   ├── lib/                         # Library/client initialization
│   │   ├── openai.ts
│   │   ├── queryClient.ts
│   │   └── supabase.ts              # Supabase client with AsyncStorage
│   ├── services/                    # Business logic services
│   │   ├── ai.ts                    # AI functions (analyzeImage, generateRecipes)
│   │   ├── auth.ts                  # Auth service layer (signUp, signIn, signOut)
│   │   └── storage.ts
│   └── types/                       # TypeScript types & Zod schemas
│       ├── api.ts
│       └── recipe.ts
├── supabase/
│   └── migrations/
│       └── 001_saved_recipes.sql    # Creates saved_recipes table with RLS
├── .env                             # Environment variables (Supabase, OpenAI keys)
├── CLAUDE.md                        # This file
└── package.json
```

## Database Schema

### `saved_recipes` Table

Stores user-specific saved recipes with Row Level Security (RLS) enabled.

```sql
CREATE TABLE saved_recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

**Indexes:**
- `idx_saved_recipes_user_id` on `user_id` (faster queries)
- `idx_saved_recipes_created_at` on `created_at DESC` (sorting)

**Row Level Security Policies:**
- Users can only SELECT their own recipes (`auth.uid() = user_id`)
- Users can only INSERT their own recipes (`auth.uid() = user_id`)
- Users can only DELETE their own recipes (`auth.uid() = user_id`)

**Migration:** Run `supabase/migrations/001_saved_recipes.sql` in Supabase SQL Editor

### Recipe Storage Pattern

Recipes are stored as JSONB in the `recipe_data` column with this structure:
```typescript
{
  name: string;
  difficulty: number;      // 1-5
  calories: number;
  prepTime: string;
  ingredients: Array<{
    name: string;
    quantity?: string;
    available: boolean;
  }>;
  steps: string[];
}
```

## Saved Recipes Hook (`useSavedRecipes`)

The `useSavedRecipes` hook manages user-specific saved recipes via Supabase:

```typescript
const { savedRecipes, isLoading, isSaved, toggleSave, refresh } = useSavedRecipes();
```

- Automatically fetches recipes for the authenticated user
- Clears recipes when user signs out
- Optimistic UI updates for save/remove
- Same API interface as before (backward compatible with RecipeCard component)

**Implementation:**
- Fetches from `saved_recipes` table filtered by `user_id`
- Saves recipes via Supabase INSERT
- Removes recipes via Supabase DELETE (queries by `recipe_data->>'name'`)
- No longer uses AsyncStorage (fully migrated to Supabase)
