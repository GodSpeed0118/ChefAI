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
- **Animations:** lottie-react-native for Lottie animations, react-native-reanimated for UI animations
- **Graphics:** react-native-svg for SVG support

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
- **NEVER use `transition-all` className** - Not supported in React Native and causes Reanimated warnings (especially on TextInput containers)
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
- Avoid using Reanimated's `useSharedValue` with `.value` assignments in event handlers; prefer direct style changes or state updates
- Use Lottie animations for complex loading states instead of custom SVG implementations
- Color-code UI elements for clarity: green for available/success, red for unavailable/error, yellow/amber for warnings

## UI/UX Design Patterns

### Loading States

ChefAI uses **Lottie animations** for loading indicators to provide a polished, professional experience:

- **LoadingState Component** (`src/components/LoadingState.tsx`) - Uses a golden hourglass Lottie animation with white outline
- **Animation File** - Located at `assets/animations/hourglass.json`, downloaded from LottieFiles
- **Color Scheme** - White outline with golden yellow sand/liquid for brand consistency
- **Usage** - Display during API calls, image analysis, and recipe generation

### Home Screen UX

- **Photo Input** - Placeholder with dashed border and camera icon when no photo is uploaded
- **Action Buttons** - Two large buttons side-by-side: "Take Photo" (camera) and "Upload Image" (gallery)
- **Button Styling** - Purple/indigo accent background with increased size (80px height) for better tap targets

### Recipe Display

**Ingredient Color Coding:**
- **Green (emerald)** - Ingredients the user has (available: true)
- **Red (rose)** - Ingredients the user needs to buy (available: false)
- Both show with matching background, border, dot, and text colors

**Macro Display:**
- Stacked vertically with full labels (Protein, Carbs, Fat)
- Color-coded dots: emerald (protein), amber (carbs), rose (fat)
- Font size: 11px for readability

**Recipe Cards:**
- Collapsed by default with expand/collapse toggle
- Show difficulty, calories, prep time, and ingredient match count
- Full ingredient list and step-by-step instructions when expanded

### Results Screen

- **Header** - "AI Suggestions" with dietary filter chips
- **Identified Items** - Small, grey uppercase label with item count badge
- **Filter Chips** - Horizontal scrollable list aligned with section labels
- **Recipe List** - Vertical stack of expandable recipe cards

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
- **Important:** TextInput containers should NOT use `transition-all` className as it causes Reanimated warnings. Use conditional classNames for focus states instead.

## File Structure

```
ChefAI/
├── app/                              # Expo Router file-based routing
│   ├── (auth)/                       # Auth route group (login, register)
│   │   ├── _layout.tsx              # Auth layout (redirects authenticated users)
│   │   ├── login.tsx                # Login screen
│   │   └── register.tsx             # Register screen
│   ├── recipe/                       # Recipe detail route group
│   │   └── [id].tsx                 # Recipe detail screen (Cook with AI mode)
│   ├── _layout.tsx                  # Root layout (AuthProvider, auth-based routing)
│   ├── index.tsx                    # Home screen (photo input + buttons)
│   ├── results.tsx                  # Results screen (ingredients + recipes)
│   └── saved.tsx                    # Saved recipes screen (user-specific)
├── assets/
│   └── animations/
│       └── hourglass.json            # Lottie animation for loading states
├── src/
│   ├── components/                  # Reusable React Native components
│   │   ├── common/                  # Common UI components
│   │   │   ├── AnimatedCard.tsx     # Animated card wrapper (fade-in only)
│   │   │   ├── FilterChips.tsx      # Horizontal filter chip selector
│   │   │   ├── GlassCard.tsx        # Glass morphism card with blur
│   │   │   ├── GradientButton.tsx   # Gradient button with haptics
│   │   │   └── Skeleton.tsx         # Skeleton loader (unused)
│   │   ├── ErrorState.tsx           # Error display component
│   │   ├── IngredientTag.tsx        # Color-coded ingredient tag (green/red)
│   │   ├── LoadingState.tsx         # Lottie hourglass loading animation
│   │   └── RecipeCard.tsx           # Expandable recipe card
│   ├── context/                     # React contexts
│   │   └── AuthContext.tsx          # Auth state provider
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAnalyzeImage.ts       # Image analysis via GPT-4o Vision
│   │   ├── useGenerateRecipes.ts    # Recipe generation via GPT-4o
│   │   └── useSavedRecipes.ts       # Supabase-backed saved recipes (per-user)
│   ├── lib/                         # Library/client initialization
│   │   ├── openai.ts                # OpenAI client setup
│   │   ├── queryClient.ts           # TanStack Query client
│   │   └── supabase.ts              # Supabase client with AsyncStorage
│   ├── services/                    # Business logic services
│   │   ├── ai.ts                    # AI functions (analyzeImage, generateRecipes)
│   │   ├── auth.ts                  # Auth service layer (signUp, signIn, signOut)
│   │   └── storage.ts               # Storage utilities
│   ├── theme/                       # Theme configuration
│   │   ├── Colors.ts                # Color palette
│   │   ├── Gradients.ts             # Gradient definitions
│   │   ├── Spacing.ts               # Spacing scale
│   │   └── Typography.ts            # Typography scale
│   └── types/                       # TypeScript types & Zod schemas
│       ├── api.ts                   # API response types
│       └── recipe.ts                # Recipe types
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

## Animations & Performance

### Lottie Animations

ChefAI uses **lottie-react-native** for professional, performant animations:

```typescript
import LottieView from "lottie-react-native";

<LottieView
  source={require("../../assets/animations/hourglass.json")}
  autoPlay
  loop
  style={{ width: 120, height: 120 }}
/>
```

**Best Practices:**
- Store Lottie JSON files in `assets/animations/`
- Use free animations from [LottieFiles.com](https://lottiefiles.com)
- Customize colors by editing the JSON file (search and replace RGB values)
- Keep file sizes under 50KB for optimal performance

**Current Animations:**
- `hourglass.json` - White outline with golden yellow liquid (customized from LottieFiles)

### React Native Reanimated

**Avoiding Warnings:**

React Native Reanimated v3+ shows warnings when accessing `.value` from the JS thread. To avoid these:

1. **Don't use `useSharedValue` with event handlers** - Prefer regular state updates
2. **Don't wrap interactive components in Animated.View with entering animations** - Can conflict with user interactions
3. **NEVER use `transition-all` className** - Not supported in React Native and causes Reanimated warnings
   - **Especially avoid on TextInput containers** - This will trigger "Reading/Writing from `value` during component render" warnings
   - Use conditional classNames instead: `className={focusedInput === 'email' ? "border-accent-500" : "border-white/10"}`
4. **Use worklets for animations** - Or simplify to state-based styling

**Good Pattern:**
```typescript
// Use state for interactive elements
const [isPressed, setIsPressed] = useState(false);

<Pressable
  onPressIn={() => setIsPressed(true)}
  onPressOut={() => setIsPressed(false)}
  style={isPressed ? styles.pressed : styles.normal}
>
```

**Bad Pattern:**
```typescript
// Avoid - causes Reanimated warnings
const scale = useSharedValue(1);

<Pressable
  onPressIn={() => { scale.value = 0.95; }}
  onPressOut={() => { scale.value = 1; }}
>
```

**When to Use Reanimated:**
- Entrance animations (`FadeInDown`, `FadeInUp`, etc.)
- Continuous animations (skeleton loaders, progress indicators)
- Complex gesture-based interactions (requires React Native Gesture Handler)
