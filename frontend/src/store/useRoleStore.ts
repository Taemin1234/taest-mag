import { create } from 'zustand'
import { Role } from '@/types/index'
import axios from 'axios'

interface UserRoleState {
  tier: Role | null
  fetchUserRole: () => Promise<void>
}

export const useUserStore = create<UserRoleState>((set) => ({
  tier: null,
  fetchUserRole: async () => {
    try {
      const res = await axios.get<{ role: Role }>('/api/user/user', {
        withCredentials: true,
      })
      set({ tier: res.data.role })
    } catch (err) {
      console.error('fetchUserRole failed:', err)
      set({ tier: null })
    }
  },
}))