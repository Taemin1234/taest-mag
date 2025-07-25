import styles from "./page.module.css"
import PostList from '@/components/PostList'
import FeaturePost from "@/components/FeaturePost";
import PostSkeleton from "@/components/skeleton/PostSkeleton";
import React, { use, Suspense } from 'react';
import Image from 'next/image';
import { fetchNotFeaturePosts, fetchFeaturePost } from '@/lib/api'
import { Post } from "@/types"
import logo from '@/assets/main_logo_b.png';

export const dynamic = 'force-dynamic';

interface PostListProps {
  variant?: 'main' | 'sub';
  enableSwiper?: boolean;
}

const GetPost = (
  props: PostListProps
) => {
  const posts = use(fetchNotFeaturePosts()) as Post[]

  return (
    <PostList posts={posts} {...props} />
  )
}

const GetFeaturePost = () => {
  const posts = use(fetchFeaturePost()) as Post[]

  return (
    <FeaturePost posts={posts}/>
  )
}

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
              <Suspense fallback={<PostSkeleton variant="main" />}>
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
