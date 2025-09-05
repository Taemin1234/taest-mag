'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export default function useLogout () {
  const router = useRouter()

  const logout = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/logout',{ 
          method:"POST",
          credentials: "include",
          cache: 'no-store',
          keepalive: true,
         }
      )

      if (!res.ok) {
        // 서버가 JSON 에러 메시지를 줄 수도 있으니 안전 파싱
        let message = `로그아웃 실패 (status: ${res.status})`;
        try {
          const ct = res.headers.get('content-type') || '';
          if (ct.includes('application/json')) {
            const data = await res.json();
            if (data?.message) message = data.message;
          }
        } catch {}
        return { ok: false, message: message };
      }
  
      router.replace('/snowman/elsa');
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }, [router])

  return logout
}
