'use client'

import styles from './AdminHeader.module.css'
import React from 'react'
import { Role } from '@/types'
import Link from 'next/link';
import Image from 'next/image';
import useLogout from '@/hooks/useLogout'
import { adminList } from '@/constants/adminList'

interface AdminHeaderProps {
  tier: Role | null
}

const AdminHeader = ({tier} : AdminHeaderProps) => {
    const logout = useLogout()

    const filteredList = tier === 'superman'
        ? adminList
        : tier === 'ironman'
          ? adminList.filter(item => item.accessTier === 'ironman')
          : [] 

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
            <div className={styles.flex}>
                <ul>
                    {filteredList.map((li) => (
                        <li key={li.title}>
                            <Link href={li.href}>
                                {li.title}
                            </Link>
                        </li>)
                    )}
                </ul>
                <button
                    className={styles.button}
                    onClick={logout}
                >
                    로그아웃
                </button>
            </div>
        </header>
    )
}

export default AdminHeader
