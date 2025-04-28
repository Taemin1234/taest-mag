'use client'

import styles from './AdminHeader.module.css'
import React from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from "axios";

const AdminHeader = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await axios.post(
                "/api/auth/logout",
                {},
                { withCredentials: true } // 쿠키 전송
            );
    
            // 로그아웃 성공 시 로그인 페이지로 이동
            if (response.status === 200) {
                router.replace('/snowman/elsa');
            }
        } catch (error) {
            console.log("로그아웃 실패: ", error);
        }
    };

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
                <li>
                    <button
                        onClick={handleLogout}
                    >
                        로그아웃
                    </button>
                </li>
            </ul>
        </header>
    )
}

export default AdminHeader
