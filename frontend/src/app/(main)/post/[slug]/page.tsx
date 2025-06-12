// src/app/post/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { Post, Editor } from '@/types'
import { fetchPostBySlug, fetchEditors } from '@/lib/api'
import { EditorInfo } from '@/components/editor/EditorInfo'
// import styles from './page.module.css'

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

  let editors: Editor[] | null = null
  try {
    editors = await fetchEditors()
  } catch (err) {
    console.error('에디터 조회 중 오류:', err)
    editors = null
  }

  const editor = editors?.find(editor => editor.name === post.editor) 

  return (
    <main>
      <article>
        <header>
          <h1>{post.title}</h1>
          <div>
            <span>{post.category}</span>
            <span>
              {new Date(post.createdAt).toLocaleDateString('ko-KR')}
            </span>
          </div>
        </header>

        {post.subtitle && <p>{post.subtitle}</p>}

        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
      {editor && <EditorInfo editor={editor} />}
      <div>
        추천 게시물
      </div>
    </main>
  )
}
