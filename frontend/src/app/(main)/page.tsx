import styles from "./page.module.css"
import PostList from '@/components/PostList'
import PostSkeleton from "@/components/skeleton/PostSkeleton";
import React, { use, Suspense } from 'react';
import Image from 'next/image';
import { fetchPosts } from '@/lib/api'
import { Post } from "@/types"
import logo from '@/public/main_logo_b.png';

export const dynamic = 'force-dynamic';

interface PostListProps {
  variant?: 'main' | 'sub';
  enableSwiper?: boolean;
}

const GetPost = (
  props: PostListProps
) => {
  const posts = use(fetchPosts()) as Post[]

  return (
    <PostList posts={posts} {...props} />
  )
}

export default function Home() {

  return (
    <main className={styles.main}>
      <section className={styles.main_section}>
        <div className={styles.main_page}>
          <div className={styles.main_page_text}>
            <p>심도보단 <strong>감도</strong>, 트렌드보단 <strong>당신의 결</strong></p>
            <p>취향을 수집하는 매거진,</p>
            <Image src="/main_logo_b.png" alt="logo" width={250} height={40}  sizes="(max-width: 600px) 100px, (max-width: 768px) 150px, 250px"/>
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
