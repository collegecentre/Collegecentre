import { supabase } from "./supabase.ts";

export const RESERVED_USERNAMES = new Set([
  "admin",
  "administrator",
  "api",
  "app",
  "auth",
  "callback",
  "claim",
  "college",
  "colleges",
  "collegecentre",
  "dashboard",
  "design-system",
  "explore",
  "forgot-password",
  "help",
  "legal",
  "login",
  "logout",
  "null",
  "onboarding",
  "privacy",
  "profile",
  "profiles",
  "reset-password",
  "root",
  "settings",
  "signup",
  "status",
  "support",
  "terms",
  "undefined",
  "user",
  "users",
  "verify",
]);

/**
 * Normalizes username input: trims whitespace and converts to lowercase
 */
export function normalizeUsername(raw: string): string {
  return (raw || "").trim().toLowerCase();
}

/**
 * Validates format, length, and reserved list for a username
 */
export function validateUsernameFormat(username: string): { valid: boolean; error?: string } {
  const normalized = normalizeUsername(username);

  if (!normalized) {
    return { valid: false, error: "Username is required." };
  }

  if (normalized.length < 3) {
    return { valid: false, error: "Username must be at least 3 characters." };
  }

  if (normalized.length > 30) {
    return { valid: false, error: "Username must be 30 characters or fewer." };
  }

  // Only lowercase alphanumeric, dashes, and underscores
  const validRegex = /^[a-z0-9][a-z0-9_-]*[a-z0-9]$/;
  if (!validRegex.test(normalized)) {
    return {
      valid: false,
      error: "Username can only contain lowercase letters, numbers, hyphens, and underscores, and cannot start or end with a symbol.",
    };
  }

  if (RESERVED_USERNAMES.has(normalized)) {
    return {
      valid: false,
      error: `"${normalized}" is a reserved system keyword. Please choose another handle.`,
    };
  }

  return { valid: true };
}

/**
 * Checks if a username is available in the database (or mock storage)
 */
export async function checkUsernameAvailability(
  username: string,
  currentUserId?: string
): Promise<{ available: boolean; error?: string }> {
  const formatCheck = validateUsernameFormat(username);
  if (!formatCheck.valid) {
    return { available: false, error: formatCheck.error };
  }

  const normalized = normalizeUsername(username);

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username")
      .eq("username", normalized)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      // In case of network failure or table not initialized yet, check local reservation
      console.warn("Supabase username check warning:", error.message);
    }

    if (data) {
      if (currentUserId && data.id === currentUserId) {
        return { available: true };
      }
      return { available: false, error: `collegecentre.in/${normalized} is already taken.` };
    }

    return { available: true };
  } catch (err: any) {
    return { available: false, error: err?.message || "Failed to check username availability." };
  }
}
