// src/app/post/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { Post, Editor } from '@/types'
import { fetchPostBySlug, fetchEditors, fetchRecommendedPosts } from '@/lib/api'
import { EditorInfo } from '@/components/editor/EditorInfo'
import PostList from '@/components/PostList'
import styles from './postPage.module.css'

interface PostPageProps {
  params: { slug: string }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params

  let post: Post | null = null
  try {
    post = await fetchPostBySlug(slug)
  } catch (err) {
    console.error('게시글 조회 중 오류:', err)
    post = null
  }

  if (!post) {
    notFound() // 404 페이지로 이동
  }

  // 해당 에디터 불러오기
  let editors: Editor[] | null = null
  try {
    editors = await fetchEditors()
  } catch (err) {
    console.error('에디터 조회 중 오류:', err)
    editors = null
  }

  const editor = editors?.find(editor => editor.name === post.editor)

  // 추천 게시물 가져오기
  let recommendedPosts: Post[] = []
  try {
    if (post) {
      recommendedPosts = await fetchRecommendedPosts(post.subCategory, post.slug);
    }
  } catch (err) {
    console.error('추천 게시물 조회 중 오류:', err);
  }

  return (
    <main className={styles.post_page}>
      <article className={styles.post_article}>
        <section>
          <header className={styles.post_header}>
            <span className={styles.post_category}>{post.category}</span>
            <h1 className={styles.post_title}>{post.title}</h1>
            <div>
              {/* <span>
                {new Date(post.createdAt).toLocaleDateString('ko-KR')}
              </span> */}
            </div>
          </header>

          {/* {post.subtitle && <p>{post.subtitle}</p>} */}

          <div className={styles.post_content}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </section>
        <section className={styles.post_editor}>
          {editor && <EditorInfo editor={editor} />}
        </section>
        <section>
          <p>추천 게시물</p>
          <PostList posts={recommendedPosts} />
        </section>
      </article>

    </main>
  )
}
