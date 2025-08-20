'use client'

import React, { useEffect } from 'react'
import AdminHeader from "@/components/common/AdminHeader";
import styles from './layout.module.css';
import { useUserStore } from '@/store/useRoleStore';
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin | 테이스트 매거진",
  description: "테이스트 매거진 관리자 페이지",
  robots: {
    index: false,   // 검색엔진 색인 금지
    follow: false,  // 링크 추적 금지
  },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const tier = useUserStore((s) => s.tier)
  const fetchUserRole = useUserStore((s) => s.fetchUserRole)

  useEffect(() => {
      fetchUserRole()
  }, [fetchUserRole])

  return (
    <>
      <AdminHeader tier={tier}/>
      <div className={tier === 'human' ? styles.admin_main_noaccess : styles.admin_main}>
        {children}
      </div>
    </>
  );
}
