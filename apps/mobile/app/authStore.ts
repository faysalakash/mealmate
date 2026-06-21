// apps/mobile/app/authStore.ts
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'MEMBER';
    homeId: string | null;
}

interface AuthState {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    setAuth: async (user, token) => {
        await SecureStore.setItemAsync('auth_token', token);
        set({ user, token });
    },
    logout: async () => {
        await SecureStore.deleteItemAsync('auth_token');
        set({ user: null, token: null });
    },
}));