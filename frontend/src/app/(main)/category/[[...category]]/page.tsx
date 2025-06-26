import React, {use, Suspense} from 'react'
import PostList from '@/components/PostList'
import PostSkeleton from "@/components/skeleton/PostSkeleton";
import Link from 'next/link'
import styles from './categoryPage.module.css'
import { CATEGORIES } from '@/constants/categories'
import { fetchPosts } from '@/lib/api'
import { Post } from "@/types"

export const dynamic = 'force-dynamic'

interface CategoryPageProps {
  params: Promise<{ category: string[] }>
}

interface PostListProps {
  variant?: 'main' | 'sub';
  enableSwiper?: boolean;
  category:string[]
}

const GetPost = ({
  variant = 'sub',
  enableSwiper = false,
  category,
}: PostListProps) => {
  const posts = use(fetchPosts()) as Post[]

  const filteredPosts = category[1] ? posts.filter(post => post.subCategory === category[1]) : posts.filter(post => post.category === category[0]);

  return (
    <PostList posts={filteredPosts}  variant={variant} enableSwiper={enableSwiper} />
  )
}

export default function CategoryPage(props: CategoryPageProps) {
  const { category } = use(props.params);
  
  const currentCategory = CATEGORIES.find(c => c.value === category[0]);
  const headingClassName = styles[`title_${category[0]}`] 
    ? styles[`title_${category[0]}`] 
    : styles['title_default'];

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
        <Suspense fallback={<PostSkeleton variant="sub" enableSwiper={true}/>}>
          <GetPost variant="sub" enableSwiper={false} category={category}/>
        </Suspense>
      </div>
    </main>
  )
}