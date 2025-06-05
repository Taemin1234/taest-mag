'use client'

import styles from "./page.module.css"
import PostList from '../../components/PostList'
import React, { useState, useEffect } from 'react';
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
      <div>
        메인 페이지
      </div>
      <div className={styles.postlist_wrap}>
        <PostList posts={posts} variant="main"/>
      </div>
    </main>
  );
}
