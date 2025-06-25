'use client'

import styles from './PostSkeletion.module.css'
import { Swiper, SwiperSlide } from 'swiper/react';

interface PostSkeletonProps {
  variant?: 'sub' | 'main';
  enableSwiper?: boolean;
}

export default function PostSkeleton({
  variant = 'sub',
  enableSwiper = false,
}: PostSkeletonProps) {

    const count = enableSwiper ? 4 : 5;
    const placeholders = Array.from({ length: count });

    if (enableSwiper) {
      return (
        <Swiper
          navigation
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{ 600: { slidesPerView: 3 }, 768: { slidesPerView: 4 } }}
          className={styles.swiperContainer}
        >
          {placeholders.map((_, i) => (
            <SwiperSlide key={i} className={styles.postlist_wrap}>
              <div className={styles.skeletonCard}>
                <div className={styles.skeletonWrap}>
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLine} />
                </div>
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonLine} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      );
    }

    const containerClassName = [
      styles.postlist_wrap,
      styles[`variant_${variant}`],
    ].filter(Boolean).join(' ');

    return (
      <ul className={containerClassName}>
        {placeholders.map((_, i) => (
          <li key={i}>
            <div className={styles.skeletonCard}>
              <div className={styles.skeletonWrap}>
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLine} />
              </div>
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLine} />
            </div>
          </li>
        ))}
      </ul>
    );
}
