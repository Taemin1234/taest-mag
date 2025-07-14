// src/app/post/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { Post, Editor } from '@/types'
import { fetchPostBySlug, fetchEditors, fetchRecommendedPosts } from '@/lib/api'
import ViewTracker from '@/components/common/ViewTracker'
import { EditorInfo } from '@/components/editor/EditorInfo'
import PostList from '@/components/PostList'
import { getCategoryLabel } from '@/utils/getCategoryLabel'
import styles from './postPage.module.css'
import DOMPurify, { Config } from 'isomorphic-dompurify';
import LinkCopyButton from '@/components/LinkCopyButton';

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
      recommendedPosts = await fetchRecommendedPosts(post.category, post.slug);
    }
  } catch (err) {
    console.error('추천 게시물 조회 중 오류:', err);
  }


// Config 타입으로 옵션 객체 선언
const sanitizeOptions: Config = {
  ADD_TAGS: [
    'h1', 'h2', 'h3', 'p', 'span', 'strong', 'b', 'i', 'u', 's', 'em', 'blockquote',
    'ul', 'ol', 'li', 'a', 'img', 'pre', 'code', 'br', 'hr', 'div',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'sup', 'sub'
  ],
  ADD_ATTR: [
    'href', 'src', 'alt', 'title', 'style', 'class', 'target', 'rel', 'width', 'height', 'align'
  ],
};

// 허용할 태그·속성·스타일을 명시적으로 추가
const cleanHtml = DOMPurify.sanitize(post.content, sanitizeOptions)

  return (
    <main className={styles.post_page}>
       <ViewTracker slug={slug} />
      <article className={styles.post_article}>
        <section>
          <header className={styles.post_header}>
            <span className={styles.post_category}>{getCategoryLabel(post.category)}</span>
            <h1 className={styles.post_title}>{post.title}</h1>
            <div>
              {/* <span>
                {new Date(post.createdAt).toLocaleDateString('ko-KR')}
              </span> */}
            </div>
          </header>

          {/* {post.subtitle && <p>{post.subtitle}</p>} */}

          <div className={`${styles.post_content} ql-editor`}
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
          />
        </section>
        <div>
          <LinkCopyButton />
        </div>
        {editor && 
          <section className={styles.post_editor}>
            <EditorInfo editor={editor} />
          </section>}
        
        <section  className={styles.post_recommend}>
          <p className={styles.subtitle}>추천 게시물</p>
          <PostList posts={recommendedPosts} enableSwiper={true} />
        </section>
      </article>
    </main>
  )
}
