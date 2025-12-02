// Centralized helpers to resolve API and WebSocket base URLs consistently

export function getApiBaseUrl(): string {
  const isBrowser = typeof window !== "undefined";
  // Single source of truth: prefer NEXT_PUBLIC_API_URL for both browser and SSR.
  // Allow explicit browser override if provided.
  const primary = process.env.NEXT_PUBLIC_API_URL;
  const browserOverride = process.env.NEXT_PUBLIC_API_URL_BROWSER;

  if (isBrowser) {
    return (
      browserOverride ||
      primary ||
      // Fallback to localhost for dev when running without Docker
      "http://localhost:4000"
    );
  }

  // On SSR, prefer explicit env; fallback to localhost for non-Docker dev
  return primary || "http://localhost:4000";
}

export function getWsBaseUrl(): string {
  const isBrowser = typeof window !== "undefined";
  const primary = process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_API_URL; // allow re-use
  const browserOverride = process.env.NEXT_PUBLIC_WS_URL_BROWSER || process.env.NEXT_PUBLIC_API_URL_BROWSER;

  if (isBrowser) {
    return browserOverride || primary || "http://localhost:4000";
  }
  return primary || "http://localhost:4000";
}
