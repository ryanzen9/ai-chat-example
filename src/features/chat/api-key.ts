const DEEPSEEK_API_KEY_STORAGE_KEY = "deepseek-api-key";

export function getDeepSeekApiKey() {
  if (typeof window === "undefined") return "";

  return window.localStorage.getItem(DEEPSEEK_API_KEY_STORAGE_KEY) ?? "";
}

export function setDeepSeekApiKey(apiKey: string) {
  if (typeof window === "undefined") return;

  const normalizedApiKey = apiKey.trim();

  if (!normalizedApiKey) {
    window.localStorage.removeItem(DEEPSEEK_API_KEY_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(DEEPSEEK_API_KEY_STORAGE_KEY, normalizedApiKey);
}
