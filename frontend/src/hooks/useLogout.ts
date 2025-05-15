'use client'

import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useCallback } from 'react'

export default function useLogout () {
  const router = useRouter()

  const logout = useCallback(async () => {
    try {
      const res = await axios.post(
        '/api/auth/logout',
        {},
        { withCredentials: true } // httpOnly 쿠키 전송
      )

      if (res.status === 200) {
        // 로그아웃 후 기본 경로로 리다이렉트
        router.replace('/snowman/elsa')
      }
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }, [router])

  return logout
}
