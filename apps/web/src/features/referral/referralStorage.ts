const REFERRER_KEY = "kryptpay_referrer";

export function saveReferrer(referrer: string) {
  if (typeof window === "undefined") return;

  const value = referrer.trim();
  if (!value) return;

  localStorage.setItem(REFERRER_KEY, value);
}

export function getSavedReferrer() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(REFERRER_KEY);
}

export function clearSavedReferrer() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(REFERRER_KEY);
}