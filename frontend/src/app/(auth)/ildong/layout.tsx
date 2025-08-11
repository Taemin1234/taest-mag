'use client'

import React, { useEffect } from 'react'
import AdminHeader from "@/components/common/AdminHeader";
import styles from './layout.module.css';
import { useUserStore } from '@/store/useRoleStore';

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
