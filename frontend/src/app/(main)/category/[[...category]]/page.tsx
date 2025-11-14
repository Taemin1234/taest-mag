import React, {use, Suspense} from 'react'
import PostList from '@/components/PostList'
import PostSkeleton from "@/components/skeleton/PostSkeleton";
import Link from 'next/link'
import styles from './categoryPage.module.css'
import { CATEGORIES } from '@/constants/categories'
import { getCategoryLabel } from '@/utils/getCategoryLabel'
import { fetchPosts } from '@/lib/api'
import { Post } from "@/types"
import type { Metadata, ResolvingMetadata } from 'next'

export const dynamic = 'force-dynamic'

interface CategoryPageProps {
  params: Promise<{ category: string[] }>
}

interface PostListProps {
  variant?: 'main' | 'sub';
  enableSwiper?: boolean;
  category:string[]
}

export async function generateMetadata(
  { params }: CategoryPageProps
) :Promise<Metadata> {
  const { category } = await params
  
  // 카테고리 배열에서 실제 카테고리 값 추출
  const categoryPath = Array.isArray(category) ? category : [category]
  const mainCategoryValue = categoryPath[0] || ''
  const subCategoryValue = categoryPath[1] || ''
  
  // 카테고리 상수에서 라벨 찾기
  const mainCategoryLabel = mainCategoryValue ? getCategoryLabel(mainCategoryValue) : '전체'
  const subCategoryLabel = subCategoryValue ? getCategoryLabel(subCategoryValue) : ''
  
  // 카테고리별 제목과 설명 생성
  const title = subCategoryLabel 
    ? `${mainCategoryLabel} - ${subCategoryLabel} | 테이스트 매거진`
    : `${mainCategoryLabel} | 테이스트 매거진`

  const description = subCategoryLabel
    ? `${mainCategoryLabel}의 ${subCategoryLabel} 관련 트렌드와 취향을 담은 테이스트 매거진입니다.`
    : `${mainCategoryLabel} 관련 트렌드와 취향을 담은 테이스트 매거진입니다.`

  return {
    title,
    description,
    keywords: ["매거진", "트렌드", "취향", "테이스트", mainCategoryLabel, subCategoryLabel].filter(Boolean),
    authors: [{ name: "테이스트 팀" }],
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/category/${categoryPath.join('/')}`,
      siteName: "테이스트 매거진",
      title,
      description,
      images: [
        {
          url: '/thumbnail.png',
          alt: "테이스트 매거진 이미지",
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: '/thumbnail.png',
          alt: "테이스트 매거진 이미지",
        }
      ]
    }
  }
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
      <div className={styles.list_wrap}>
        <Suspense fallback={<PostSkeleton variant="sub" enableSwiper={true}/>}>
          <GetPost variant="sub" enableSwiper={false} category={category}/>
        </Suspense>
      </div>
    </main>
  )
}