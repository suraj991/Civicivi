import type { CivicProfile } from "./types";

const PROFILE_KEY = "civicivi_profile";

export function saveProfile(profile: CivicProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadProfile(): CivicProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CivicProfile;
  } catch {
    return null;
  }
}

export function clearProfile(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROFILE_KEY);
}

export function hasProfile(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(PROFILE_KEY);
}
