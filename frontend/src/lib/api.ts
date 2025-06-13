import { Editor, Post } from "@/types"

// 에디터
export async function fetchEditors(): Promise<Editor[]> {
  const isServer = typeof window === 'undefined';

  const baseUrl = isServer
    ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    : '';

  const response = await fetch(`${baseUrl}/api/editors`, {
    method: 'GET',
    credentials: 'include', // 쿠키 전송이 필요하다면 포함
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch editors: ${response.status} ${response.statusText}`)
  }
  const data: Editor[] = await response.json()
  return data
}

// 게시물 post
export async function fetchPosts(): Promise<Post[]> {
  const response = await fetch('/api/posts', {
    method: 'GET',
    credentials: 'include', // 필요 시 쿠키 전송
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`)
  }
  const data: Post[] = await response.json()
  return data
}

// 카테고리별 추천 게시물
export async function fetchRecommendedPosts(subCategory: string, excludeSlug: string): Promise<Post[]> {
  const baseUrl =
    typeof window === 'undefined'
      ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      : '';

  const res = await fetch(`${baseUrl}/api/posts/recommend?subCategory=${subCategory}&exclude=${excludeSlug}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(`추천 게시물을 불러오는 데 실패했습니다: ${res.status}`);
  }

  return await res.json();
}

// 특정에디터가 작성한 게시물
export async function fetchPostsByEditor(editorName: string): Promise<Post[]> {
  // 서버(Next.js 서버 컴포넌트) vs 클라이언트 구분
  const baseUrl =
    typeof window === 'undefined'
      ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      : ''

  // URL에 한글이나 특수문자가 있을 수 있으니 인코딩
  const encodedName = encodeURIComponent(editorName)

  const res = await fetch(
    `${baseUrl}/api/posts/editor/${encodedName}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  )

  if (!res.ok) {
    throw new Error(`에디터 게시물을 불러오는 데 실패했습니다: ${res.status}`)
  }

  return await res.json()
}

// slug를 이용해 단일 포스트 가져오기
export async function fetchPostBySlug(slug: string): Promise<Post> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const res = await fetch(`${baseUrl}/api/posts/${encodeURIComponent(slug)}`, {
    method: 'GET',
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error(`게시글(슬러그: ${slug})을 불러오지 못했습니다. (${res.status})`)
  }
  const post: Post = await res.json()
  return post
}

