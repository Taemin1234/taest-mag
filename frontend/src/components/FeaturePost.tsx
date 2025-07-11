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

export default function FeaturePost() {
    const posts = [
        {
            slug:'123',
            thumbnailUrl:'https://placehold.co/600x400',
            title:'titlezz',
            category:'food',
            createdAt:'2024',
            subtitle:'니가 뭘알어'
        },
        {
            slug:'456',
            thumbnailUrl:'https://placehold.co/600x400',
            title:'title222222',
            category:'food2222222',
            createdAt:'2024',
            subtitle:'뱅배애뱅뱅'
        },
        {
            slug:'789',
            thumbnailUrl:'https://placehold.co/600x400',
            title:'title333333',
            category:'food3333332',
            createdAt:'2024',
            subtitle:'뱅배애뱅뱅'
        },
        {
            slug:'177',
            thumbnailUrl:'https://placehold.co/600x400',
            title:'title444444',
            category:'food4444442',
            createdAt:'2024',
            subtitle:'뱅배애뱅뱅'
        },
        {
            slug:'2258',
            thumbnailUrl:'https://placehold.co/600x400',
            title:'title55555555',
            category:'food555555552',
            createdAt:'2024',
            subtitle:'뱅배애뱅뱅'
        }
    ]

    if (!posts || posts.length === 0) {
        return <p className={styles.noPosts}>게시물이 없습니다.</p>;
    }

   return (

        <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            spaceBetween={30}
            coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 50,
                modifier: 1,
                slideShadows: true,
                scale:0.5,
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
// 터치드



// tempalay

// 2014년 도쿄에서 결성된 3인조 밴드로, 2015년 후지 록 페스티벌 ‘Rookie A Go-Go’ 무대에서 주목을 받으며 데뷔했다.
// 사이키델릭과 로파이(lo-fi) 스타일을 기반으로, 묘하게 중독적인 멜로디와 다채로운 사운드를 통해 독자적인 색채를 구축해왔다.
// 작년에는 일본 아티스트들의 꿈의 무대인 무도관 공연을 성공적으로 마치며, 그동안 쌓아온 음악적 위상을 입증했다.


// 혁오 & 선셋 롤러코스터

// 독창적인 감성과 실험적인 사운드로 한국 인디씬을 대표하는 밴드 ‘혁오’와, 몽환적이고 세련된 시티팝 사운드로 아시아를 넘어 전 세계적인 팬층을 보유한 대만 밴드 ‘선셋 롤러코스터’가 만났다.
// 서로 다른 음악적 색을 가진 두 밴드는 협업을 통해 프로젝트 앨범 『AAA』를 발표했고, 1년에 걸쳐 한국의 다양한 지역을 돌며 녹음을 진행했다.
// 앨범 발매 이후에는 전 세계를 무대로 콘서트를 열며, 국경을 넘은 새로운 음악적 시너지의 가능성을 증명해 보였다.


// 바이 바이 배드맨

// 감각적인 멜로디와 깊이 있는 사운드로 주목받은 밴드 ‘바이 바이 배드맨’은 2011년 데뷔 직후 EBS 스페이스 공감 헬로루키 대상을 수상하며 강렬한 인상을 남겼다.
// 이듬해 한국대중음악상 신인상을 수상하며 실력을 입증한 뒤, 활발한 활동을 이어가다 2018년부터 휴식기에 들어갔다.
// 그리고 올해, 오랜 기다림 끝에 신곡 『zero』로 다시 무대에 돌아오며 복귀를 알렸다.

// 3호선 버터플라이

// 1999년 결성된 ‘3호선 버터플라이’는 한국 인디 음악의 1세대를 대표하는 밴드로, 사이키델릭과 그런지 등 다양한 장르를 몽환적으로 풀어내며 독자적인 음악 세계를 구축해왔다.
// 특히 보컬 남상아의 유니크한 음색과 섬세하게 직조된 가사는 곡의 몰입도를 한층 끌어올린다.
// 오랜 시간의 침묵을 깨고, 6년 만에 펜타포트 록 페스티벌 무대를 통해 다시 관객 앞에 선다.

// 밀레나

// 바이올린을 전공한 멀티 뮤지션 ‘밀레나’는 재즈와 클래식를 바탕으로 한 감각적인 R&B 사운드로 주목받고 있다.
// 헤이즈, Colde의 곡에 작,편곡으로 참여하며 실력을 인정받았고, 2021년 낸 싱글앨범을 시작으로 활발한 활동을 이어가고 있다.
// 섬세한 감정선과 부드러운 음색으로, 한국 R&B 씬에서 독자적인 색을 구축해가고 있는 아티스트다.

