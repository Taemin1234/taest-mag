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