'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import styles from './PostList.module.css'
import { Post } from '@/types'
import { getCategoryLabel } from '@/utils/getCategoryLabel'

interface PostBasicListProps {
    posts: Post[];
    variant?: 'main' | 'sub';
    enableSwiper?: boolean;
    swiperBreakpoint?: number
}


export default function PostList({ posts, variant = 'sub', enableSwiper = false, swiperBreakpoint = 768,}: PostBasicListProps) {
    const [isSwiperMode, setIsSwiperMode] = useState(false)

    // 클라이언트에서만 window 감지
    useEffect(() => {
        if (!enableSwiper) return

        const updateMode = () => {
        setIsSwiperMode(window.innerWidth < swiperBreakpoint)
        }
        updateMode()
        window.addEventListener('resize', updateMode)
        return () => window.removeEventListener('resize', updateMode)
    }, [enableSwiper, swiperBreakpoint])

    if (!posts || posts.length === 0) {
        return <p className={styles.noPosts}>게시물이 없습니다.</p>;
    }

    // Swiper 모드
    if (enableSwiper && isSwiperMode) {
        return (
        <Swiper
            spaceBetween={10}
            slidesPerView={1}
            className={styles.swiperContainer} // 필요시 추가 스타일
        >
            {posts.map(post => (
            <SwiperSlide key={post.slug}>
                <Link href={`/post/${post.slug}`}>
                <a className={styles.slideItem}>
                    <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    className={styles.post_thumbnail}
                    />
                    <div className={styles.post_list}>
                    <div className={styles.list_top}>
                        <p className={styles.list_category}>
                        {getCategoryLabel(post.category)}
                        </p>
                        <p className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                        </p>
                    </div>
                    <p className={styles.list_title}>{post.title}</p>
                    <p className={styles.list_subtitle}>{post.subtitle}</p>
                    </div>
                </a>
                </Link>
            </SwiperSlide>
            ))}
        </Swiper>
        )
    }

    const containerClassName = [
        styles.postlist_wrap,
        styles[`variant_${variant}`] || '',
      ]
        .filter(Boolean)
        .join(' ')

    return (
        <ul className={containerClassName}>
            {posts.map((post) => (
                <li key={post.slug}>
                    <Link href={`/post/${post.slug}`} >
                        <img src={post.thumbnailUrl} alt={post.title} className={styles.post_thumbnail} />
                        <div className={styles.post_list}>
                            <div className={styles.list_top}>
                                <p className={styles.list_category}>{getCategoryLabel(post.category)}</p>
                                <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString('ko-KR')}</p>
                            </div>
                            <p className={styles.list_title}>{post.title}</p>
                            <p className={styles.list_subtitle}>{post.subtitle}</p>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    )
}