// Simple and reactive authentication utility using localStorage and CustomEvents

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  initiatives: string[]; // List of initiative names they volunteer for
  events: Array<{
    title: string;
    date: string;
    role: string;
  }>;
  isLoggedIn: boolean;
  twoFactorEnabled?: boolean;
}

const DEFAULT_USER: UserProfile = {
  name: "Gus Silva",
  email: "gus@animativa.org",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  initiatives: ["Vozes da Periferia", "Eco-Ação"],
  events: [
    { title: "Workshop: Design de Impacto", date: "15 Abr 2026", role: "Facilitador" },
    { title: "Encontro Regional Sul", date: "22 Abr 2026", role: "Organizador" }
  ],
  isLoggedIn: true,
  twoFactorEnabled: true
};

const STORAGE_KEY = "animativa_auth_user";

export function getAuthUser(): UserProfile {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Seed default user for an active experience out of the box
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USER));
    return DEFAULT_USER;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return {
      name: "",
      email: "",
      avatar: "",
      initiatives: [],
      events: [],
      isLoggedIn: false,
      twoFactorEnabled: false
    };
  }
}

export function setAuthUser(user: UserProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent("animativa-auth-change", { detail: user }));
}

export function loginSimulated(name: string, email: string) {
  const user: UserProfile = {
    name: name || "Gus Silva",
    email: email || "gus@animativa.org",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
    initiatives: ["Vozes da Periferia", "Eco-Ação"],
    events: [
      { title: "Workshop: Design de Impacto", date: "15 Abr 2026", role: "Facilitador" }
    ],
    isLoggedIn: true,
    twoFactorEnabled: true
  };
  setAuthUser(user);
}

export function logoutUser() {
  const user: UserProfile = {
    name: "",
    email: "",
    avatar: "",
    initiatives: [],
    events: [],
    isLoggedIn: false,
    twoFactorEnabled: false
  };
  setAuthUser(user);
}

// Hook-like listener utility
export function subscribeAuthChange(callback: (user: UserProfile) => void) {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<UserProfile>;
    callback(customEvent.detail);
  };
  window.addEventListener("animativa-auth-change", handler);
  return () => window.removeEventListener("animativa-auth-change", handler);
}
