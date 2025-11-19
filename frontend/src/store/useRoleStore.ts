import { create } from 'zustand'
import { Role } from '@/types/index'

interface UserRoleState {
  tier: Role | null
  fetchUserRole: () => Promise<void>
}

export const useUserStore = create<UserRoleState>((set) => ({
  tier: null,
  fetchUserRole: async () => {
    try {
      const res = await fetch('/api/user/user', {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        set({ tier: null });
        return;
      }

      // 응답 타입 안전하게 지정
      const data: { role: Role } = await res.json();
      set({ tier: data.role });
    } catch (err) {
      console.error('fetchUserRole failed:', err);
      set({ tier: null });
    }
  },
}))