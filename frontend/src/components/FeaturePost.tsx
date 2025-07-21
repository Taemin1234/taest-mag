'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation';
import { Navigation, EffectCoverflow, Pagination } from 'swiper/modules';

import styles from './FeaturePost.module.css'
import { Post } from '@/types'
import { getCategoryLabel } from '@/utils/getCategoryLabel'

export default function FeaturePost({posts}:{posts:Post[]}) {


    if (!posts || posts.length === 0) {
        return <p className={styles.noPosts}>게시물이 없습니다.</p>;
    }

    return (
        <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            spaceBetween={10}
            coverflowEffect={{
                rotate: 50,
                stretch:50,
                depth: 100,
                modifier: 1,
                // slideShadows: true,
                scale: 0.5,
            }}
            pagination={{
                clickable: true,
                dynamicBullets: true,
            }}
            modules={[EffectCoverflow, Pagination]}
            className={styles.swiperContainer}
        >
            {posts.map(post => (
                <SwiperSlide key={post.slug} className={styles.postlist_wrap}>
                    <div className={styles.background}>
                        <Image
                            src={post.thumbnailUrl || '/default-thumb.png'}
                            alt={post.title}
                            fill
                            unoptimized
                            className={styles.post_bg_thumbnail}
                        />
                    </div>
                    <Link href={`/post/${post.slug}`} className={styles.content}>
                        <div className={styles.list}>
                            <p className={styles.date}>
                                {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                            <div className={styles.thumbnail_inner}>
                                <Image
                                    src={post.thumbnailUrl || '/default-thumb.png'}
                                    alt={post.title}
                                    fill
                                    unoptimized
                                    className={styles.post_thumbnail}
                                />
                            </div>
                        </div>
                        <div className={styles.textContent}>
                            <p className={styles.list_title}>{post.title}</p>
                            <p className={styles.list_subtitle}>{post.subtitle}</p>
                        </div>
                    </Link>
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

