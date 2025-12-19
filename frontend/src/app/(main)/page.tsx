import styles from "./page.module.css"
import PostList from '@/components/PostList'
import FeaturePost from "@/components/FeaturePost";
import PostSkeleton from "@/components/skeleton/PostSkeleton";
import FeaturePostSkeleton from "@/components/skeleton/FeaturePostSkeleton";
import React, { use, Suspense } from 'react';
import Image from 'next/image';
import { fetchNotFeaturePosts, fetchFeaturePost } from '@/lib/api'
import { Post } from "@/types"
import type { Metadata } from 'next'
import logo from '@/assets/main_logo_b.png';

export const metadata: Metadata = {
  title: "테이스트 매거진",
  description: "심도보단 감도, 트렌드보단 당신의 결. 취향을 수집하는 매거진",
  keywords: ["매거진", "트렌드", "취향", "테이스트"],
  authors: [{ name: "테이스트 팀" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    siteName: "테이스트 매거진",
    title: "테이스트 매거진",
    description: "심도보단 감도, 트렌드보단 당신의 결. 취향을 수집하는 매거진",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "테이스트 매거진 대표 이미지",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "테이스트 매거진",
    description: "심도보단 감도, 트렌드보단 당신의 결. 취향을 수집하는 매거진",
    images: ["/thumbnail.png"]
  }
}

interface PostListProps {
  variant?: 'main' | 'sub';
  enableSwiper?: boolean;
}

const GetPost = async (props: PostListProps) => {
  const posts = await fetchNotFeaturePosts();
  return <PostList posts={posts} {...props} />;
};

const GetFeaturePost = async () => {
  const posts = await fetchFeaturePost();
  return <FeaturePost posts={posts} />;
};

export default function Home() {

  return (
    <main className={styles.main}>
      <section className={styles.main_section}>
        <div className={styles.main_page}>
          <div className={styles.main_page_text}>
            <p>심도보단 <strong>감도</strong>, <br className={styles.mo}/>트렌드보단 <strong>당신의 결</strong></p>
            <p>취향을 수집하는 매거진,</p>
            <Image src={logo} alt="logo" width={256} height={61} className={styles.logo}/>
          </div>
          <div className={styles.feature_wrap}>
            <div className={styles.feature}>
              <Suspense fallback={<FeaturePostSkeleton/>}>
                <GetFeaturePost />
              </Suspense>
            </div>
          </div>
        </div>
        <div>
          <Suspense fallback={<PostSkeleton variant="main" />}>
            <GetPost variant="main" enableSwiper={false}/>
          </Suspense>
        </div>
      </section>
    </main>
  );
}
