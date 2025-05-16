'use client'

import styles from './adminMain.module.css'
import Link from 'next/link';
import { useUserStore } from '@/store/useRoleStore';
import { adminList } from '@/constants/adminList'

export default function AdminMain() {
    const tier = useUserStore((s) => s.tier)

    const filteredList = tier === 'superman'
    ? adminList
    : tier === 'ironman'
      ? adminList.filter(item => item.accessTier === 'ironman')
      : [] 

    return (
        <div className={styles.adminMain}>
            <ul>
                {filteredList.map((li) => (
                    <li key={li.title}>
                        <Link href={li.href}>
                            {li.title}
                        </Link>
                    </li>)
                )}
            </ul>
        </div>
    )
}