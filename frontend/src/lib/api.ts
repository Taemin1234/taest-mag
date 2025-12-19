import { Editor, Post } from "@/types"

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// 에디터
export async function fetchEditors(): Promise<Editor[]> {

  const response = await fetch(`${baseUrl}/api/editors`, {
    method: 'GET',
    credentials: 'include', // 쿠키 전송이 필요하다면 포함
  })
  if (!response.ok) {
    console.error('fetchEditors failed with status', response.status)
    return []
  }
  const data: Editor[] = await response.json()
  return data
}

// 게시물 post
export async function fetchPosts(): Promise<Post[]> {

  const response = await fetch(`${baseUrl}/api/posts`, {
    method: 'GET',
    next: { revalidate: 60 },
  })
  if (!response.ok) {
    console.error('fetchPosts failed with status', response.status)
    return []
  }
  const data: Post[] = await response.json()
  return data
}

// 특별 게시물 제외한 post
export async function fetchNotFeaturePosts(): Promise<Post[]> {

  const response = await fetch(`${baseUrl}/api/posts/notFeatured`, {
    method: 'GET',
    next: { revalidate: 60 },
  })
  if (!response.ok) {
    console.error('fetchNotFeaturePosts failed with status', response.status)
    return []
  }
  const data: Post[] = await response.json()
  return data
}

// 특별 게시물 가져오기
export async function fetchFeaturePost(): Promise<Post[]> {

  const response = await fetch(`${baseUrl}/api/posts/featured`, {
    method: 'GET',
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    console.error('fetchFeaturePost failed with status', response.status)
    return []
  }
  const data: Post[] = await response.json()
  return data
}

// 카테고리별 추천 게시물
export async function fetchRecommendedPosts(category: string, excludeSlug: string): Promise<Post[]> {

  const res = await fetch(`${baseUrl}/api/posts/recommend?category=${category}&exclude=${excludeSlug}`, {
    method: 'GET',
    credentials: 'include',
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error('fetchRecommendedPosts failed with status', res.status)
    return []
  }

  return await res.json();
}

// 특정에디터가 작성한 게시물
export async function fetchPostsByEditor(editorName: string): Promise<Post[]> {

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
    console.error('fetchPostsByEditor failed with status', res.status)
    return []
  }

  return await res.json()
}

// slug를 이용해 단일 포스트 가져오기
export async function fetchPostBySlug(slug: string, signal?: AbortSignal): Promise<Post | null> {


  const res = await fetch(`${baseUrl}/api/posts/${encodeURIComponent(slug)}`, {
    method: 'GET',
    credentials: 'include',
    signal,
  })
  if (!res.ok) {
    console.error('fetchPostBySlug failed with status', res.status)
    return null
  }
  const post: Post = await res.json()
  return post
}