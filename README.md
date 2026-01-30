# ChefAI

ChefAI is an iOS app that analyzes fridge contents from a photo and recommends recipes. Take a photo of your fridge, and the app identifies food items using GPT-4o's vision API, then suggests 3-5 recipes with difficulty ratings, calorie counts, ingredient lists, and step-by-step cooking instructions.

## Tech Stack

- **Frontend:** React Native + Expo, TypeScript
- **Navigation:** Expo Router (file-based routing)
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **Async State:** TanStack Query
- **Validation:** Zod
- **Backend:** Supabase (auth, storage, database)
- **AI:** OpenAI GPT-4o (vision + text)
- **Camera:** Expo ImagePicker

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- [Expo Go](https://expo.dev/go) app on your iOS device (for testing on a physical device)
- An [OpenAI API key](https://platform.openai.com/api-keys)
- A [Supabase](https://supabase.com/) project (for storage)

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/GodSpeed0118/ChefAI.git
   cd ChefAI
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the project root:

   ```
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   EXPO_PUBLIC_OPENAI_API_KEY=your-openai-api-key
   ```

## Running the App

```bash
# Start the Expo dev server
npx expo start

# Start with iOS simulator
npx expo start --ios

# Start in tunnel mode (for testing on a physical device over the network)
npx expo start --tunnel
```

To run on a physical device, scan the QR code shown in the terminal with the Expo Go app.

## Project Structure

```
app/                  # Expo Router pages (file-based routing)
  _layout.tsx         # Root layout with providers
  index.tsx           # Home screen (camera/gallery + analyze)
  results.tsx         # Recipe results screen
src/
  components/         # Reusable UI components
  hooks/              # TanStack Query hooks
  lib/                # API clients (OpenAI, Supabase, React Query)
  services/           # Business logic (AI calls, storage)
  types/              # TypeScript types and Zod schemas
```

## How It Works

1. **Capture** - Take a photo of your fridge or pick one from your gallery
2. **Analyze** - The image is sent to GPT-4o's vision API, which identifies all visible food items
3. **Generate** - The identified ingredients are sent back to GPT-4o, which generates 3-5 recipes
4. **Browse** - View recipe cards with difficulty ratings, calorie counts, ingredient lists, and cooking steps
