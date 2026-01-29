import React, { Suspense } from 'react';
import { notFound } from 'next/navigation'
import { fetchEditors, fetchRecommendedPosts } from '@/lib/api'
import { getPostBySlugCached } from "@/lib/postSlug";
import { EditorInfo } from '@/components/editor/EditorInfo'
import PostList from '@/components/PostList'
import PostSkeleton from "@/components/skeleton/PostSkeleton";
import { getCategoryLabel } from '@/utils/getCategoryLabel'
import styles from './postPage.module.css'
import LinkCopyButton from '@/components/LinkCopyButton';
import SafeHtml from '@/components/SafeHtml';
import type { Metadata } from 'next'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: PostPageProps,
): Promise<Metadata> {
  const { slug } = await params

  const postMeta = await getPostBySlugCached(slug);

  const defaultDes = "테이스트 매거진에서 제안하는 최신 트렌드와 깊이 있는 아티클을 만나보세요"

  return {
    title: postMeta?.title || "Taest Mag",
    description: postMeta?.subtitle || defaultDes,
    keywords: ["매거진", "트렌드", "취향", "테이스트", `${postMeta?.category}`, `${postMeta?.subCategory}`],
    authors: [{ name: "테이스트 팀" }],
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/post/${slug}`,
      siteName: "테이스트 매거진",
      title: postMeta?.title || "Taest Mag",
      description: postMeta?.subtitle || defaultDes,
      images: [
        {
          url: postMeta?.thumbnailUrl ?? '/thumbnail.png',
          alt: "테이스트 매거진 이미지",
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: postMeta?.title || "Taest Mag",
      description: postMeta?.subtitle || defaultDes,
      images: [
        {
          url: postMeta?.thumbnailUrl ?? '/thumbnail.png',
          alt: "테이스트 매거진 이미지",
        }
      ]
    }
  }
}

// 1. 에디터 정보 컴포넌트
async function EditorSection({ editorName }: { editorName: string }) {
  try {
    const editors = await fetchEditors();
    const editor = editors?.find((e) => e.name === editorName);
    
    if (!editor) return null;
    return <EditorInfo editor={editor} />;
  } catch (err) {
    console.error('에디터 조회 실패:', err);
    return null;
  }
}

// 2. 추천 게시물 컴포넌트
async function RecommendedSection({ category, slug }: { category: string; slug: string }) {
  try {
    const recommendedPosts = await fetchRecommendedPosts(category, slug);
    return <PostList posts={recommendedPosts} enableSwiper={true} />;
  } catch (err) {
    console.error('추천 게시물 조회 실패:', err);
    return null;
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params

  const post = await getPostBySlugCached(slug);

  if (!post) {
    notFound() // 404 페이지로 이동
  }

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

          <div className={styles.post_content}>
            <SafeHtml html={post.content} className={styles.post_content} />
          </div>
        </section>
        <div className={styles.link_copy_btn}>
          <LinkCopyButton />
        </div>
        <section className={styles.post_editor}>
          <Suspense fallback={<div>에디터 정보 로딩 중...</div>}>
            <EditorSection editorName={post.editor} />
          </Suspense>
        </section>

        <section className={styles.post_recommend}>
          <p className={styles.subtitle}>추천 게시물</p>
          <Suspense fallback={<PostSkeleton variant="sub" />}>
            <RecommendedSection category={post.category} slug={post.slug} />
          </Suspense>
        </section>
      </article>
    </main>
  )
}
