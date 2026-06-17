import type { User } from '../types';
import { authAPI } from '../../services/api';

const USER_KEY         = 'astroanu_user';
const CONSULTATIONS_KEY = 'astroanu_consultations';
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const authUtils = {
  saveUser: (user: User) => localStorage.setItem(USER_KEY, JSON.stringify(user)),

  getUser: (): User | null => {
    const d = localStorage.getItem(USER_KEY);
    return d ? JSON.parse(d) : null;
  },

  logout: () => {
    authAPI.logout();
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  isAuthenticated: (): boolean =>
    !!(localStorage.getItem(ACCESS_TOKEN_KEY) && localStorage.getItem(USER_KEY)),

  register: async (fullName: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const parts    = fullName.trim().split(' ');
    const firstName = parts[0] || '';
    const lastName  = parts.slice(1).join(' ') || '';
    const username  = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') + Math.floor(Math.random() * 1000);
    const result   = await authAPI.signup({ email, username, password, password_confirm: password, first_name: firstName, last_name: lastName }) as any;
    if (result.data) {
      const { user, access, refresh } = result.data as any;
      localStorage.setItem(ACCESS_TOKEN_KEY, access);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
      authUtils.saveUser({ id: String(user.id), fullName: `${user.first_name} ${user.last_name}`.trim() || user.username, email: user.email, birthDate: user.birth_date, birthTime: user.birth_time, birthPlace: user.birth_place });
      return { success: true };
    }
    const errData = result.error;
    if (typeof errData === 'object') {
      const msgs = Object.values(errData).flat().join(' ');
      return { success: false, error: msgs || 'Registration failed' };
    }
    return { success: false, error: errData || 'Registration failed' };
  },

  login: async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const result = await authAPI.login({ email, password }) as any;
    if (result.data) {
      const { user, access, refresh } = result.data as any;
      localStorage.setItem(ACCESS_TOKEN_KEY, access);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
      authUtils.saveUser({ id: String(user.id), fullName: `${user.first_name} ${user.last_name}`.trim() || user.username, email: user.email, birthDate: user.birth_date, birthTime: user.birth_time, birthPlace: user.birth_place });
      return { success: true };
    }
    return { success: false, error: result.error || 'Invalid email or password' };
  },

  updateUserProfile: async (updates: Partial<User>) => {
    const payload: any = {};
    if (updates.fullName) { const p = updates.fullName.split(' '); payload.first_name = p[0]; payload.last_name = p.slice(1).join(' '); }
    if (updates.birthDate)  payload.birth_date  = updates.birthDate;
    if (updates.birthTime)  payload.birth_time  = updates.birthTime;
    if (updates.birthPlace) payload.birth_place = updates.birthPlace;
    await authAPI.updateProfile(payload);
    const cur = authUtils.getUser();
    if (cur) { const updated = { ...cur, ...updates }; authUtils.saveUser(updated); return updated; }
    return null;
  },
};

export const consultationUtils = {
  saveConsultation: (c: any) => {
    const all = consultationUtils.getConsultations();
    all.push(c);
    localStorage.setItem(CONSULTATIONS_KEY, JSON.stringify(all));
  },
  getConsultations: (): any[] => {
    const d = localStorage.getItem(CONSULTATIONS_KEY);
    return d ? JSON.parse(d) : [];
  },
  getUserConsultations: (userId: string): any[] =>
    consultationUtils.getConsultations().filter((c: any) => c.userId === userId),
};
