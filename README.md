# ChefAI 🍳

> Your Premium Culinary AI Assistant

ChefAI is an iOS app that analyzes fridge contents from a photo and recommends personalized recipes. Simply take a photo of your fridge, and the app identifies food items using GPT-4o's vision API, then suggests 3-5 recipes with difficulty ratings, calorie counts, ingredient lists, and step-by-step cooking instructions.

## ✨ Features

- 📸 **Smart Photo Analysis** - AI-powered ingredient recognition from fridge photos
- 🍽️ **Recipe Generation** - Get 3-5 personalized recipes based on available ingredients
- 💾 **Save Favorites** - Save recipes to your personal collection (synced via Supabase)
- 🔐 **User Authentication** - Secure email/password authentication with session persistence
- 🎨 **Modern UI** - Beautiful dark theme with glass morphism effects and smooth animations
- 📊 **Ingredient Matching** - Color-coded ingredients show what you have vs. what you need
- 🔍 **Dietary Filters** - Filter recipes by dietary preferences (Vegan, Vegetarian, etc.)
- 👨‍🍳 **Cook with AI** - Interactive cooking mode with step-by-step guidance

## 🛠️ Tech Stack

- **Frontend:** React Native + Expo (iOS), TypeScript
- **Navigation:** Expo Router (file-based routing)
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **Async State:** TanStack Query (React Query)
- **Validation:** Zod for runtime type validation
- **Backend:** Supabase (auth, PostgreSQL database, storage)
- **AI:** OpenAI GPT-4o API (vision + text)
- **Camera:** Expo ImagePicker
- **Images:** expo-image for optimized image display
- **Animations:** lottie-react-native + react-native-reanimated
- **Graphics:** react-native-svg

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/go) app on your iOS device (for testing on a physical device)
- An [OpenAI API key](https://platform.openai.com/api-keys) with GPT-4o access
- A [Supabase](https://supabase.com/) project with:
  - Authentication enabled
  - PostgreSQL database access
  - Storage bucket (optional, for future features)

## 🚀 Setup

### 1. Clone the Repository

```bash
git clone https://github.com/GodSpeed0118/ChefAI.git
cd ChefAI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EXPO_PUBLIC_OPENAI_API_KEY=your-openai-api-key
```

### 4. Set Up Supabase Database

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **SQL Editor**
3. Run the migration script from `supabase/migrations/001_saved_recipes.sql`

This creates the `saved_recipes` table with Row Level Security (RLS) policies that ensure users can only access their own saved recipes.

### 5. Enable Supabase Authentication

1. In your Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional) under **Authentication** → **Email Templates**

## ▶️ Running the App

```bash
# Start the Expo dev server
npx expo start

# Start with iOS simulator
npx expo start --ios

# Native iOS build (requires Xcode)
npx expo run:ios
```

**For Physical Device Testing:**
- Scan the QR code shown in the terminal with the Expo Go app
- Or use tunnel mode: `npx expo start --tunnel`

## 📁 Project Structure

```
ChefAI/
├── app/                              # Expo Router file-based routing
│   ├── (auth)/                       # Auth route group
│   │   ├── login.tsx                # Login screen
│   │   └── register.tsx             # Register screen
│   ├── recipe/                       # Recipe detail route group
│   │   └── [id].tsx                 # Cook with AI mode
│   ├── _layout.tsx                  # Root layout (AuthProvider, routing)
│   ├── index.tsx                    # Home screen (photo input)
│   ├── results.tsx                  # Results screen (recipes)
│   └── saved.tsx                    # Saved recipes screen
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── common/                  # Common components (buttons, cards)
│   │   ├── RecipeCard.tsx           # Expandable recipe card
│   │   ├── LoadingState.tsx         # Lottie loading animation
│   │   └── ErrorState.tsx           # Error display component
│   ├── context/                     # React contexts
│   │   └── AuthContext.tsx          # Auth state provider
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAnalyzeImage.ts       # Image analysis (GPT-4o Vision)
│   │   ├── useGenerateRecipes.ts    # Recipe generation (GPT-4o)
│   │   └── useSavedRecipes.ts       # Saved recipes (Supabase)
│   ├── lib/                         # Library initialization
│   │   ├── openai.ts                # OpenAI client
│   │   ├── supabase.ts              # Supabase client
│   │   └── queryClient.ts           # TanStack Query client
│   ├── services/                    # Business logic
│   │   ├── ai.ts                    # AI API calls
│   │   ├── auth.ts                  # Auth service layer
│   │   └── storage.ts               # Storage utilities
│   ├── theme/                       # Theme configuration
│   │   ├── Colors.ts                # Color palette
│   │   ├── Gradients.ts             # Gradient definitions
│   │   ├── Spacing.ts               # Spacing scale
│   │   └── Typography.ts            # Typography scale
│   └── types/                       # TypeScript types & Zod schemas
│       ├── api.ts                   # API response types
│       └── recipe.ts                # Recipe types
├── assets/
│   └── animations/
│       └── hourglass.json            # Lottie loading animation
├── supabase/
│   └── migrations/
│       └── 001_saved_recipes.sql    # Database schema
├── .env                             # Environment variables
└── CLAUDE.md                        # Development guidelines
```

## 🔍 How It Works

### User Flow

1. **Sign Up / Login** - Create an account or sign in with email/password
2. **Capture** - Take a photo of your fridge or pick one from your gallery
3. **Analyze** - The image is sent to GPT-4o's vision API, which identifies all visible food items
4. **Generate** - The identified ingredients are sent back to GPT-4o, which generates 3-5 personalized recipes
5. **Browse** - View recipe cards with:
   - Difficulty ratings (1-5)
   - Total calories
   - Prep time
   - Ingredient match count (color-coded: green = have, red = need)
   - Step-by-step cooking instructions
6. **Save** - Save your favorite recipes to your personal collection
7. **Cook** - Use "Cook with AI" mode for interactive step-by-step guidance

### Architecture

**Two-Step AI Pipeline:**

1. **Image Analysis (GPT-4o Vision):**
   - Input: Photo of fridge
   - Output: Structured list of identified ingredients
   - Validation: Zod schema ensures proper data structure

2. **Recipe Generation (GPT-4o Text):**
   - Input: List of identified ingredients
   - Output: 3-5 recipes with full details
   - Validation: Zod schema ensures all required fields are present

**Data Flow:**

```
Camera → ImagePicker → GPT-4o Vision → Ingredients
                                         ↓
                                    GPT-4o Text → Recipes → Display
                                                      ↓
                                                  Save to Supabase
```

## 🗄️ Database Schema

### `saved_recipes` Table

Stores user-specific saved recipes with Row Level Security (RLS):

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key (auto-generated) |
| `user_id` | uuid | Foreign key to auth.users (with CASCADE delete) |
| `recipe_data` | jsonb | Recipe data (name, difficulty, calories, ingredients, steps) |
| `created_at` | timestamptz | Timestamp (auto-generated) |

**Indexes:**
- `idx_saved_recipes_user_id` on `user_id` (faster queries)
- `idx_saved_recipes_created_at` on `created_at DESC` (sorting)

**Row Level Security Policies:**
- Users can only SELECT, INSERT, and DELETE their own recipes
- Enforced via `auth.uid() = user_id` policy

## 🎨 UI/UX Highlights

- **Dark Theme** - Modern indigo/purple gradient background
- **Glass Morphism** - Frosted glass effects on cards and inputs
- **Lottie Animations** - Professional loading states with custom hourglass animation
- **Color-Coded Ingredients:**
  - 🟢 Green = Ingredients you have
  - 🔴 Red = Ingredients you need to buy
- **Interactive Recipe Cards** - Expand/collapse to view full details
- **Dietary Filters** - Quick filter chips for dietary preferences
- **Haptic Feedback** - Tactile feedback on button presses (iOS)

## 🐛 Troubleshooting

### Common Issues

**"Reading/Writing from `value` during component render" warnings:**
- These warnings were fixed by removing `transition-all` className from TextInput containers
- NativeWind doesn't support CSS transitions in React Native
- Use conditional classNames for focus states instead

**OpenAI API errors:**
- Check that your API key has GPT-4o access
- Verify your API key is correctly set in `.env`
- Check your OpenAI account has sufficient credits

**Supabase authentication errors:**
- Verify your Supabase URL and anon key in `.env`
- Check that email authentication is enabled in Supabase Dashboard
- Run the database migration to create the `saved_recipes` table

**Images not loading:**
- Make sure you're using `expo-image` instead of React Native's built-in `Image`
- Check camera/photo library permissions in iOS settings

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Follow the coding conventions in `CLAUDE.md`
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

**Important Conventions:**
- Never use `transition-all` className (causes Reanimated warnings)
- Use TanStack Query for all API calls
- Validate AI responses with Zod schemas
- Follow the existing auth service layer pattern
- Use NativeWind for styling

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **OpenAI** - For the GPT-4o API
- **Supabase** - For backend infrastructure
- **Expo** - For the React Native framework
- **LottieFiles** - For the hourglass animation

---

Built with ❤️ by the ChefAI team
