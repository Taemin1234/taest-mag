'use client'

import styles from './PostSkeletion.module.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, EffectCoverflow } from 'swiper/modules';
import React from 'react';

export default function FeaturePostSkeleton() {
  const count = 4;
  const placeholders = Array.from({ length: count });

  return (
    <Swiper
      effect={'coverflow'}
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={'auto'}
      spaceBetween={10}
      coverflowEffect={{
        rotate: 50,
        stretch: 50,
        depth: 100,
        modifier: 1,
        scale: 0.5,
      }}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      modules={[EffectCoverflow, Pagination]}
      className={styles.swiperContainer}
    >
      {placeholders.map((_, i) => (
        <SwiperSlide key={i} className={styles.postlist_wrap}>
          <div className={styles.background}>
            <div className={styles.skeletonCard} style={{height: '100%', width: '100%'}} />
          </div>
          <div className={styles.content}>
            <div className={styles.list}>
              <div className={styles.skeletonLine} style={{width: '60%', height: 18, marginBottom: 8}} />
              <div className={styles.thumbnail_inner}>
                <div className={styles.skeletonCard} style={{height: 120, width: '100%'}} />
              </div>
            </div>
            <div className={styles.textContent}>
              <div className={styles.skeletonLine} style={{width: '80%', height: 20, marginBottom: 6}} />
              <div className={styles.skeletonLine} style={{width: '60%', height: 16}} />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
} 