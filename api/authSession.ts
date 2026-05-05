export const ADMIN_SESSION_KEY = "admin_session_token";
export const LEGACY_ADMIN_TOKEN_KEY = "admin_token";

const tokenFields = [
  "sessionToken",
  "session_token",
  "session-token",
  "sessionId",
  "session_id",
  "session",
  "token",
  "accessToken",
  "access_token",
];

export const ADMIN_SESSION_HEADER_NAMES = [
  "session_token",
  "X-Session-Token",
  "Admin-Session-Token",
];

const readStorage = (storage: Storage, key: string) => {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};

export const getAdminSessionToken = () => {
  return (
    readStorage(sessionStorage, ADMIN_SESSION_KEY) ||
    readStorage(sessionStorage, LEGACY_ADMIN_TOKEN_KEY) ||
    readStorage(localStorage, ADMIN_SESSION_KEY) ||
    readStorage(localStorage, LEGACY_ADMIN_TOKEN_KEY)
  );
};

export const setAdminSessionToken = (token: string) => {
  const trimmedToken = token.trim();

  sessionStorage.setItem(ADMIN_SESSION_KEY, trimmedToken);
  sessionStorage.setItem(LEGACY_ADMIN_TOKEN_KEY, trimmedToken);

  // Keep the old localStorage key for existing app checks and open tabs.
  localStorage.setItem(LEGACY_ADMIN_TOKEN_KEY, trimmedToken);
};

export const clearAdminSession = () => {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  sessionStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_SESSION_KEY);
  localStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
};

const findToken = (value: any): string | null => {
  if (!value) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed && !/\s/.test(trimmed) ? trimmed : null;
  }

  for (const field of tokenFields) {
    if (typeof value[field] === "string" && value[field].trim()) {
      return value[field].trim();
    }
  }

  return findToken(value.data) || findToken(value.admin) || findToken(value.session);
};

export const extractAdminSessionToken = (response: any) => {
  return findToken(response);
};

export const hasAdminSession = () => Boolean(getAdminSessionToken());
