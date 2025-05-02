'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PostForm, { FormData } from '@/components/PostForm';

export default function EditPostPage() {
  const { slug } = useParams();
  const [initialData, setInitialData] = useState<FormData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 1) 기존 포스트 불러오기
  useEffect(() => {
    axios
      .get(`/api/posts/${slug}`)
      .then(res => {
        setInitialData(res.data);
      })
      .catch(err => {
        console.error(err);
        setError('포스트를 불러오는 중 오류가 발생했습니다.');
      });
  }, [slug]);

  // 2) 수정 요청 핸들러
  const handleUpdate = async (data: FormData) => {
    try {
      await axios.put(`/api/posts/${slug}`, data, { withCredentials: true });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || '수정 중 오류가 발생했습니다.');
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!initialData) return <p>로딩 중…</p>;

  return (
    <PostForm
      pageTitle="게시물 수정"
      initialData={initialData}
      onSubmit={handleUpdate}
    />
  );
}
