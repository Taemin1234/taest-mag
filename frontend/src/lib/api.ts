import { Editor, Post } from "@/types"

// 에디터
export async function fetchEditors(): Promise<Editor[]> {
  const response = await fetch('/api/editors', {
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