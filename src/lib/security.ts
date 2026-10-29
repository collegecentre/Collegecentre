/**
 * CollegeCentre - Security, Sanitization & Abuse Prevention Utility
 */

/**
 * Sanitizes plain text input by stripping dangerous HTML tags, angle brackets,
 * and normalizing whitespace to prevent stored XSS attacks.
 */
export function sanitizeText(input?: string | null): string {
  if (!input) return "";
  return input
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[<>]/g, "") // Strip raw brackets
    .trim();
}

/**
 * Validates that a user-provided URL uses an approved, safe protocol.
 * Rejects javascript:, vbscript:, data: URIs and relative protocol attacks.
 */
export function isSafeUrl(rawUrl?: string | null): boolean {
  if (!rawUrl || typeof rawUrl !== "string") return false;
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;

  // Prevent dangerous protocol bypasses
  const lowercase = trimmed.toLowerCase();
  if (
    lowercase.startsWith("javascript:") ||
    lowercase.startsWith("vbscript:") ||
    lowercase.startsWith("data:") ||
    lowercase.startsWith("file:") ||
    lowercase.startsWith("//")
  ) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:" || parsed.protocol === "mailto:";
  } catch {
    // Relative URLs or malformed URLs
    return false;
  }
}

/**
 * Normalizes and sanitizes external web links, prepending https:// if protocol is omitted.
 */
export function sanitizeUrl(rawUrl?: string | null): string | null {
  if (!rawUrl) return null;
  let trimmed = rawUrl.trim();

  // If user enters github.com/user instead of https://github.com/user
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("mailto:")) {
    trimmed = `https://${trimmed}`;
  }

  return isSafeUrl(trimmed) ? trimmed : null;
}

export interface FileValidationOptions {
  allowedMimeTypes: string[];
  maxSizeBytes: number;
}

/**
 * Validates file upload metadata against strict size and MIME type allowlists.
 */
export function validateFileUpload(
  file: { name: string; size: number; type: string },
  options: FileValidationOptions
): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: "No file was provided for upload." };
  }

  // 1. File size check
  if (file.size > options.maxSizeBytes) {
    const maxMb = (options.maxSizeBytes / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File exceeds maximum allowed size of ${maxMb}MB.`,
    };
  }

  // 2. MIME type check
  const mimeMatch = options.allowedMimeTypes.includes(file.type.toLowerCase());
  if (!mimeMatch) {
    return {
      valid: false,
      error: `Unsupported file type (${file.type}). Allowed formats: ${options.allowedMimeTypes.join(", ")}`,
    };
  }

  // 3. Extension check (prevent double extension attacks like resume.pdf.exe)
  const cleanName = file.name.toLowerCase();
  const dangerousExtensions = [".exe", ".bat", ".cmd", ".sh", ".php", ".js", ".vbs", ".scr", ".jar", ".html", ".svg"];
  for (const ext of dangerousExtensions) {
    if (cleanName.endsWith(ext)) {
      return {
        valid: false,
        error: `Executable and script extensions (${ext}) are prohibited.`,
      };
    }
  }

  return { valid: true };
}

/**
 * In-memory sliding window rate limiter for abuse prevention and endpoint throttling.
 */
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  key: string,
  limit: number = 60,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  const record = rateLimitStore.get(key) || { timestamps: [] };
  // Filter out timestamps older than the active window
  const activeTimestamps = record.timestamps.filter((t) => t > windowStart);

  if (activeTimestamps.length >= limit) {
    const oldestTimestamp = activeTimestamps[0];
    const resetAt = oldestTimestamp + windowMs;
    return {
      allowed: false,
      remaining: 0,
      resetAt,
    };
  }

  activeTimestamps.push(now);
  rateLimitStore.set(key, { timestamps: activeTimestamps });

  return {
    allowed: true,
    remaining: limit - activeTimestamps.length,
    resetAt: now + windowMs,
  };
}
