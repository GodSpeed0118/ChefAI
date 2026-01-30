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

**Supabase** handles image storage (temporary upload for API processing) and optionally user sessions. The Supabase MCP server is pre-configured in `.mcp.json`.

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
