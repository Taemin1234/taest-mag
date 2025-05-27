import { ReactNode } from 'react'
import PostList from '@/components/PostList'
// import { getPostsByCategory } from '@/lib/api'  // 직접 만든 API 호출 유틸

interface CategoryPageProps {
  params: { category: string }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params

  console.log(category)

  // 서버 컴포넌트이므로 fetch 또는 DB 호출도 직접!
  //   const posts = await getPostsByCategory(category)

  return (
    <main>
      <h1>‘{category[0]} / {category[1]}’ 카테고리 게시물</h1>
      {/* {posts.length
        ? <PostList posts={posts} />
        : <p>게시물이 없습니다.</p>
      } */}

    </main>
  )
}