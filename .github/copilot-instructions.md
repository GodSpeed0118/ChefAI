# Copilot / AI Agent Instructions for ChefAI

Purpose: concise, actionable guidance so an AI coding agent can be immediately productive in this repo.

**Big picture**
- Frontend: Expo (React Native) + Expo Router (file-based routing) in `app/`.
- Business logic & API clients live under `src/` (notably `src/lib/` and `src/services/`).
- Auth & persistence: Supabase (auth, storage, DB) configured in `src/lib/supabase.ts` and `src/services/auth.ts`.
- AI flow: two-step GPT-4o usage — image analysis then recipe generation implemented in `src/services/ai.ts` and surfaced to UI via hooks (e.g. `src/hooks/useAnalyzeImage.ts`).

**Where to start for common tasks**
- App shell & providers: [app/_layout.tsx](../app/_layout.tsx) (AuthProvider + routing).
- AI integration: [src/lib/openai.ts](../src/lib/openai.ts) and [src/services/ai.ts](../src/services/ai.ts).
- Hooks that call services: [src/hooks/useAnalyzeImage.ts](../src/hooks/useAnalyzeImage.ts), [src/hooks/useGenerateRecipes.ts](../src/hooks/useGenerateRecipes.ts).
- Auth surface: [src/context/AuthContext.tsx](../src/context/AuthContext.tsx) and [src/services/auth.ts](../src/services/auth.ts).
- Saved recipes: [supabase/migrations/001_saved_recipes.sql](../supabase/migrations/001_saved_recipes.sql) and [src/hooks/useSavedRecipes.ts](../src/hooks/useSavedRecipes.ts).

**Project-specific conventions (do not assume defaults)**
- Use Expo managed workflow — avoid ejecting. Prefer `expo install` for native packages.
- All code uses TypeScript (`.ts`/`.tsx`). Do not introduce `.js` files.
- Styling uses NativeWind; prefer `className` props over `StyleSheet.create`.
- All network/AI calls go through service layer in `src/services/` and are wrapped with TanStack Query hooks in `src/hooks/`.
- Validate AI responses with Zod schemas (types live under `src/types/`), and fail-fast on schema mismatch.
- Use `useAuth()` from `AuthContext` rather than calling Supabase directly in components.
- Use `expo-image` for images; avoid the core `Image` component unless necessary.

**Build / run / developer workflows**
- Start dev server: `npm run start` (runs `expo start`).
- iOS simulator: `npm run ios` or `npx expo start --ios`.
- Android: `npm run android` or `npx expo start --android`.
- Install native deps: `npx expo install <pkg>`.
- Lint: `npm run lint` (configured via Expo/ESLint).

**AI prompt & model editing hints**
- Prompts / model settings: update `src/lib/openai.ts` for client-level config and `src/services/ai.ts` for the actual prompt text and response parsing.
- Keep parsing/validation in the same module as the prompt so Zod schemas can be co-located with parsing code (existing pattern present in `src/types/` and `src/services/ai.ts`).

**Supabase & data flow notes**
- Supabase client is initialized in `src/lib/supabase.ts` — environment variables must be used (do not hardcode keys).
- Saved recipes stored as JSONB in `saved_recipes` table (see migration `supabase/migrations/001_saved_recipes.sql`).
- Use service layer `src/services/storage.ts` for any storage operations and `useSavedRecipes` hook for UI interactions.

**Editing guidance for PRs**
- Small UI/UX fixes: modify component in `src/components/` and update corresponding hook if data-fetch changes.
- AI behaviour changes: update prompt in `src/services/ai.ts`, add/adjust Zod schema in `src/types/`, add unit-like tests where feasible.
- Auth changes: update `src/services/auth.ts` and `src/context/AuthContext.tsx` — ensure redirects in `app/(auth)/` remain consistent.

**Quick examples**
- To change the recipe-generation prompt: edit `src/services/ai.ts` and update `src/types/recipe.ts` Zod schema.
- To add a new page route: add `app/newpage.tsx` (Expo Router will pick it up automatically).

If anything in this file is unclear or you want more detail (example prompts, schema locations, or testing patterns), say which area to expand.
