import styles from './AdminHeader.module.css'
import React from 'react'
import Link from 'next/link';

const AdminHeader = () => {
    return (
        <header className={styles.admin_header}>
            <h1>ta(e)st 매거진</h1>
            <ul>
                <li>
                    <Link href="/admin/adminPosts">아티클 관리</Link>
                </li>
                <li>
                    <button
                        className="hover:bg-gray-700 px-3 py-2 rounded text-white"
                    >
                        로그아웃
                    </button>
                </li>
            </ul>
        </header>
    )
}

export default AdminHeader
