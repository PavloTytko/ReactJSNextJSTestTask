export function getApiBaseUrl(): string {
  const isBrowser = typeof window !== "undefined";
  const primary = process.env.NEXT_PUBLIC_API_URL;
  const browserOverride = process.env.NEXT_PUBLIC_API_URL_BROWSER;

  if (isBrowser) {
    return (
      browserOverride ||
      primary ||
      "http://localhost:4000"
    );
  }
  return primary || "http://localhost:4000";
}

export function getWsBaseUrl(): string {
  const isBrowser = typeof window !== "undefined";
  const primary = process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_API_URL;
  const browserOverride = process.env.NEXT_PUBLIC_WS_URL_BROWSER || process.env.NEXT_PUBLIC_API_URL_BROWSER;

  if (isBrowser) {
    return browserOverride || primary || "http://localhost:4000";
  }
  return primary || "http://localhost:4000";
}
