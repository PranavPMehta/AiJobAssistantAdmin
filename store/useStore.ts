import { create } from 'zustand';
import api from '../lib/axios';
import { User, AdminUser, UserStatus } from '../types';

interface AuthState {
    admin: AdminUser | null;
    isAuthenticated: boolean;
    login: (credentials: Record<string, string>) => Promise<void>;
    logout: () => void;
}

interface UserState {
    users: User[];
    isLoading: boolean;
    fetchUsers: () => Promise<void>;
    updateUser: (userId: string, data: Partial<User>) => Promise<void>;
    createUser: (data: Partial<User>) => Promise<void>;
}

interface AppState extends AuthState, UserState { }

export const useStore = create<AppState>((set, get) => ({
    // --- Auth Slice ---
    admin: null,
    isAuthenticated: false,
    login: async (credentials) => {
        try {
            const response = await api.post('/admin/api/login', credentials);
            const adminData: AdminUser = response.data;
            set({ admin: adminData, isAuthenticated: true });
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },
    logout: () => {
        set({ admin: null, isAuthenticated: false });
    },

    // --- User Slice ---
    users: [],
    isLoading: false,
    fetchUsers: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/admin/api/users');
            set({ users: response.data });
        } catch (error) {
            console.error('Fetch users failed:', error);
        } finally {
            set({ isLoading: false });
        }
    },
    updateUser: async (userId, data) => {
        try {
            const response = await api.patch(`/admin/api/user/${userId}`, data);
            const updatedUser = response.data;

            set((state) => ({
                users: state.users.map((u) => (u.user_id === userId ? updatedUser : u)),
            }));
        } catch (error) {
            console.error('Update user failed:', error);
            throw error;
        }
    },
    createUser: async (data) => {
        try {
            const response = await api.post('/admin/api/user', data);
            const newUser = response.data;
            set((state) => ({
                users: [...state.users, newUser],
            }));
        } catch (error) {
            console.error('Create user failed:', error);
            throw error;
        }
    },
}));
