import { supabase } from "../lib/supabase";
import type { Session, User, AuthError } from "@supabase/supabase-js";

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export interface SignUpParams {
  email: string;
  password: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

/**
 * Sign up a new user with email and password
 */
export async function signUp({ email, password }: SignUpParams): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return {
    user: data.user,
    session: data.session,
    error,
  };
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn({ email, password }: SignInParams): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return {
    user: data.user,
    session: data.session,
    error,
  };
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Get the current session
 */
export async function getCurrentSession(): Promise<Session | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Get the current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}

/**
 * Map Supabase auth errors to user-friendly messages
 */
export function getAuthErrorMessage(error: AuthError | null): string {
  if (!error) return "An unknown error occurred";

  switch (error.message) {
    case "Invalid login credentials":
      return "Invalid email or password. Please try again.";
    case "User already registered":
      return "An account with this email already exists.";
    case "Email not confirmed":
      return "Please confirm your email address before signing in.";
    case "Password should be at least 6 characters":
      return "Password must be at least 6 characters long.";
    case "Unable to validate email address: invalid format":
      return "Please enter a valid email address.";
    case "Signups not allowed for this instance":
      return "Sign up is currently disabled. Please contact support.";
    case "Email rate limit exceeded":
      return "Too many attempts. Please try again later.";
    default:
      // Return the original error message if we don't have a specific mapping
      return error.message || "An error occurred during authentication.";
  }
}
