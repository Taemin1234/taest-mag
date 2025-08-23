'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { useInView } from 'react-intersection-observer'

import styles from './PostList.module.css'
import { Post } from '@/types'
import { getCategoryLabel } from '@/utils/getCategoryLabel'

interface PostBasicListProps {
    posts: Post[];
    variant?: 'main' | 'sub';
    enableSwiper?: boolean;
    swiperBreakpoint?: number
}

export default function PostList({ posts, variant = 'sub', enableSwiper = false, }: PostBasicListProps) {

    if (!posts || posts.length === 0) {
        return <p className={styles.noPosts}>게시물이 없습니다.</p>;
    }

    // Swiper 모드
    if (enableSwiper) {
        return (
            <Swiper
                navigation={true}
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{
                    600: {
                        slidesPerView: 3,
                    },
                    768: {
                        slidesPerView: 4,

                    },

                }}
                className={styles.swiperContainer} // 필요시 추가 스타일
            >
                {posts.map(post => (
                    <SwiperSlide key={post.slug} className={styles.postlist_wrap}>
                        <Link href={`/post/${post.slug}`}>
                            <div className={styles.thumbnailWrapper}>
                                <Image
                                    src={post.thumbnailUrl || '/default-thumb.png'}
                                    alt={post.title}
                                    fill
                                    className={styles.post_thumbnail}
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 33vw, 25vw"
                                />
                            </div>
                            <div className={styles.post_list}>
                                <div className={styles.list_top}>
                                    <p className={styles.list_category}>
                                        {getCategoryLabel(post.category)}
                                    </p>
                                    <p>
                                        {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                                    </p>
                                </div>
                                <p className={styles.list_title}>{post.title}</p>
                                <p className={styles.list_subtitle}>{post.subtitle}</p>
                            </div>
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
                <CardList key={post.slug} post={post} />
            ))}
        </ul>
    )
}

function CardList({ post }: { post: Post }) {
    const { ref, inView } = useInView({
        threshold: 0.15,
        triggerOnce: true,
    })

    return (
        <li key={post.slug} ref={ref} className={`${styles.content_box} ${inView ? styles.active : ''}`}>
            <Link href={`/post/${post.slug}`} >
                <div className={styles.thumbnailWrapper}>
                    <Image
                        src={post.thumbnailUrl || '/default-thumb.png'}
                        alt={post.title}
                        fill
                        className={styles.post_thumbnail}
                        sizes="(max-width: 640px) 100vw, 33vw"
                    />
                </div>
                <div className={styles.post_list}>
                    <div className={styles.list_top}>
                        <p className={styles.list_category}>{getCategoryLabel(post.category)}</p>
                        <p>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</p>
                    </div>
                    <p className={styles.list_title}>{post.title}</p>
                    <p className={styles.list_subtitle}>{post.subtitle}</p>
                </div>
            </Link>
        </li>
    )
}
