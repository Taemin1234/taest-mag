'use client'

import React, {useEffect, useState, use} from 'react'
import PostBasicList from '@/components/PostBasicList'
import Link from 'next/link'
import styles from './CategoryPage.module.css'
import { CATEGORIES } from '@/constants/categories'
import { fetchPosts } from '@/lib/api'
import { Post } from "@/types"

interface CategoryPageProps {
  params: Promise<{ category: string[] }>
}

export default function CategoryPage(props: CategoryPageProps) {
  const { category } = use(props.params);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const currentCategory = CATEGORIES.find(c => c.value === category[0]);
  const headingClassName = styles[`title_${category[0]}`] 
    ? styles[`title_${category[0]}`] 
    : styles['title_default'];

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

  const filteredPosts = category[1] ? posts.filter(post => post.subCategory === category[1]) : posts.filter(post => post.category === category[0]);

  return (
    <main className={styles.category_page}>
      <h1 className={headingClassName}>{currentCategory?.label}</h1>
      <ul className={styles.sub_categories}>
          <li>
            <Link href={`/category/${category[0]}`}>전체</Link>
          </li>
        {currentCategory?.subCategories?.map((subCategory) => (
          <li key={subCategory.value}>
            <Link href={`/category/${category[0]}/${subCategory.value}`}>
              {subCategory.label}
            </Link>
          </li>
        ))}
      </ul>
      <div>
        <PostBasicList posts={filteredPosts} />
      </div>
    </main>
  )
}