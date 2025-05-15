'use client'

import styles from './AdminHeader.module.css'
import React from 'react'
import { useRouter } from 'next/navigation';
import { Role } from '@/types'
import Link from 'next/link';
import Image from 'next/image';
import useLogout from '@/hooks/useLogout'

interface AdminHeaderProps {
  tier: Role | null
}

const AdminHeader = ({tier} : AdminHeaderProps) => {
    const router = useRouter();
    const logout = useLogout()

    return (
        <header className={styles.admin_header}>
            <h1>
                <Link href="/" className={styles.main_logo}>
                    <Image
                        src={'/main_logo.png'}
                        alt={'테이스트 매거진 로고'}
                        width={155}
                        height={80}
                        className={styles.img}
                    />
                </Link>
            </h1>
            <ul>
               <li>
                    <Link href="/admin/adminEditor">에디터 관리</Link>
                </li>
                <li>
                    <Link href="/admin/adminPosts">아티클 관리</Link>
                </li>
                {tier?.toString() === 'superman' && (
                    <li>
                        <Link href="/admin/adminTier">티어 관리</Link>
                    </li>
                )}
                <li>
                    <button
                        onClick={logout}
                    >
                        로그아웃
                    </button>
                </li>
            </ul>
        </header>
    )
}

export default AdminHeader
