'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PostForm, { FormData } from '@/components/PostForm';
import { fetchPostBySlug } from '@/lib/api'
import { Post } from '@/types'

export default function EditPostPage() {
  const params = useParams();
  const rawSlug = params?.slug as string | string[] | undefined;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  
  const [initialData, setInitialData] = useState<FormData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 1) 기존 포스트 불러오기
  useEffect(() => {
    if (!slug) return;
    const ac = new AbortController();
  
    fetchPostBySlug(slug, ac.signal)
      .then((data: Post) => {
        setInitialData(data as FormData);
      })
      .catch(err => {
        if (err.name === 'AbortError') return; // 취소 시 무시
        console.error(err);
        setError('포스트를 불러오는 중 오류가 발생했습니다.');
      });
  
    return () => ac.abort(); // 언마운트 시 취소
  }, [slug]);

  // 2) 수정 요청 핸들러
  const handleUpdate = async (data: FormData) => {
    if (!slug) return;
    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(slug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const maybeJson = await res
          .json()
          .catch(() => ({ message: '수정 중 오류가 발생했습니다.' }));
        throw new Error(maybeJson?.message || `HTTP ${res.status}`);
      }
      // 필요시 성공 후 처리 (예: 라우팅) 추가
    } catch (e: any) {
      console.error(e);
      setError(e?.message || '수정 중 오류가 발생했습니다.');
    }
  };

  if (error) return <p>{error}</p>;
  if (!initialData) return <p>로딩 중…</p>;

  return (
    <PostForm
      pageTitle="게시물 수정"
      initialData={initialData}
      onSubmit={handleUpdate}
    />
  );
}
