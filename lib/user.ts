// lib/user.ts
import { create } from "zustand";

type User = {
  email: string;
  password: string;
};

type UserState = {
  users: User[];
  currentUser: User | null;
  register: (email: string, password: string) => boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

export const useUserStore = create<UserState>((set, get) => ({
  users: [], // list of registered users
  currentUser: null,

  register: (email, password) => {
    const existing = get().users.find((u) => u.email === email);
    if (existing) return false; // email already taken

    const newUser = { email, password };
    set((state) => ({ users: [...state.users, newUser] }));
    return true;
  },

  login: (email, password) => {
    const user = get().users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) return false;

    set({ currentUser: user });
    return true;
  },

  logout: () => set({ currentUser: null }),
}));
