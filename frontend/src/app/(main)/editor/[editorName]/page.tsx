import styles from './EditorPage.module.css'
import { fetchPostsByEditor, fetchEditors } from '@/lib/api'
import PostList from '@/components/PostList'
import PostSkeleton from "@/components/skeleton/PostSkeleton";
import EditorSkeleton from "@/components/skeleton/EditorSkeleton";
import { EditorInfo } from '@/components/editor/EditorInfo'
import React, { use, Suspense } from 'react';
import { Post, Editor } from "@/types"
import type { Metadata, ResolvingMetadata } from 'next'

export const dynamic = 'force-dynamic';

interface PostListProps {
  variant?: 'main' | 'sub';
  enableSwiper?: boolean;
}

interface PostPageProps {
  params: Promise<{ editorName: string }>
}

interface GetPostProps extends PostListProps {
  editorName: string;
}

export async function generateMetadata(
  { params }: PostPageProps
): Promise<Metadata> {
  const { editorName } = await params

  const title = `${editorName} | 테이스트 매거진`

  const description = `${editorName}의 공간`

  return {
    title,
    description,
    keywords: ["매거진", "트렌드", "취향", "테이스트"],
    authors: [{ name: "테이스트 매거진" }],
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/editor/${encodeURIComponent(editorName)}`,
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
  editorName,
  variant = 'sub',
  enableSwiper = false,
}: GetPostProps) => {
  const editorPosts = use(fetchPostsByEditor(editorName)) as Post[]

  return (
    <PostList posts={editorPosts} variant={variant} enableSwiper={enableSwiper} />
  )
}

const GetEditor = ({ editorName }: { editorName: string }) => {
  const editorInfo = use(fetchEditors()) as Editor[]

  const editor = editorInfo.find(editor => editor.name === editorName)

  if (!editor) {
    return <div>에디터를 찾을 수 없습니다.</div>
  }

  return (
    <EditorInfo editor={editor} />
  )
}

export default async function EditorPage(props: PostPageProps) {

  const { editorName } = await props.params;

  // url에 한글이나 특수문자가 있으면 자동으로 인코딩한다.
  // url 파라미터 디코딩
  const editor = decodeURIComponent(editorName);

  return (
    <main className={styles.main}>
      <div>
        <Suspense fallback={<EditorSkeleton />}>
          <GetEditor editorName={editor} />
        </Suspense>
      </div>
      <div>
        <p>게시물 보기</p>
        <Suspense fallback={<PostSkeleton variant="sub" />}>
          <GetPost editorName={editor} variant="sub" enableSwiper={false} />
        </Suspense>
      </div>
    </main>
  );
}