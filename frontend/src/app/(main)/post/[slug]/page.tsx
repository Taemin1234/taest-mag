// src/app/post/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { Post, Editor } from '@/types'
import { fetchPostBySlug, fetchEditors, fetchRecommendedPosts } from '@/lib/api'
import { getPostBySlugCached } from "@/lib/postSlug";
import { EditorInfo } from '@/components/editor/EditorInfo'
import PostList from '@/components/PostList'
import { getCategoryLabel } from '@/utils/getCategoryLabel'
import styles from './postPage.module.css'
import DOMPurify, { Config } from 'isomorphic-dompurify';
import LinkCopyButton from '@/components/LinkCopyButton';
import type { Metadata, ResolvingMetadata } from 'next'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: PostPageProps,
): Promise<Metadata> {
  const { slug } = await params

  const postMeta = await getPostBySlugCached(slug);

  return {
    title: postMeta?.title,
    description: postMeta?.subtitle,
    keywords: ["매거진", "트렌드", "취향", "테이스트", `${postMeta?.category}`, `${postMeta?.subCategory}`],
    authors: [{ name: "테이스트 팀" }],
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/post/${slug}`,
      siteName: "테이스트 매거진",
      title: postMeta?.title,
      description: postMeta?.subtitle,
      images: [
        {
          url: postMeta?.thumbnailUrl ?? '/thumbnail.png',
          alt: "테이스트 매거진 이미지",
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: postMeta?.title,
      description: postMeta?.subtitle,
      images: [
        {
          url: postMeta?.thumbnailUrl ?? '/thumbnail.png',
          alt: "테이스트 매거진 이미지",
        }
      ]
    }
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params

  const post = await getPostBySlugCached(slug);

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
      {/* <ViewTracker slug={slug} /> */}
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

          <div className={styles.post_content}
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
          />
        </section>
        <div className={styles.link_copy_btn}>
          <LinkCopyButton />
        </div>
        {editor &&
          <section className={styles.post_editor}>
            <EditorInfo editor={editor} />
          </section>}

        <section className={styles.post_recommend}>
          <p className={styles.subtitle}>추천 게시물</p>
          <PostList posts={recommendedPosts} enableSwiper={true} />
        </section>
      </article>
    </main>
  )
}
