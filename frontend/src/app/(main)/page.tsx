'use client'

import styles from "./page.module.css"
import PostList from '../../components/PostList'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { fetchPosts } from '@/lib/api'
import { Post } from "@/types"

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true)
    fetchPosts()
      .then((data: Post[]) => {
        setPosts(data)
      })
      .catch((err) => {
        console.error('게시물 로딩 실패:', err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, []);

  return (
    <main className={styles.main}>
      <section className={styles.main_section}>
        <div className={styles.main_page}>
          <div className={styles.main_page_text}>
            <p>심도보단 <strong>감도</strong>, 트렌드보단 <strong>당신의 결</strong></p>
            <p>취향을 수집하는 매거진,</p>
            <Image src="/main_logo_b.png" alt="logo" width={250} height={40} />
          </div>
        </div>
        <div>
          <PostList posts={posts} variant="main" />
        </div>
      </section>
    </main>
  );
}
