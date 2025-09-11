'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface PostFormData {
    title: string;
    subtitle: string;
    category: string;
    subCategory: string;
    thumbnailUrl: string;
    isFeatured: boolean;
    editor: string;
    content: string;
    slug?: string; // 수정 모드일 때 사용
}

export async function createPost(formData: PostFormData) {
    try {
        // 썸네일 필수 검증
        if (!formData.thumbnailUrl) {
            return { ok: false, message: '썸네일 이미지를 꼭 등록해주세요.' };
        }

        // 게시물 생성 API 호출
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { ok: false, message: errorData.message || '게시물 저장 실패' };
        }

        // 성공 시 캐시 무효화 및 리다이렉트
        revalidatePath('/admin/adminPosts')
        redirect('/admin/adminPosts')
    } catch (error: any) {
        console.error('게시물 저장 실패:', error)
        return { ok: false, message: error.message || '게시물 저장 중 오류가 발생했습니다.' };
    }
}

export async function updatePost(slug: string, formData: PostFormData) {
    try {
        // 게시물 수정 API 호출
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/posts/${slug}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { ok: false, message: errorData.message || '게시물 수정 실패' };
        }

        // 성공 시 캐시 무효화 및 리다이렉트
        revalidatePath('/admin/adminPosts')
        redirect('/admin/adminPosts')
    } catch (error: any) {
        console.error('게시물 수정 실패:', error)
        return { ok: false, message: error.message || '게시물 수정 중 오류가 발생했습니다.' };
    }
}

export async function uploadThumbnail(formData: FormData) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/upload/thumbnail`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            console.error('썸네일 업로드 실패:', response.status, text);
            return { ok: false, message: `썸네일 업로드 실패 (코드 ${response.status})` };
        }

        const data = await response.json() as { url: string };
        return data.url;
    } catch (error: any) {
        console.error('썸네일 업로드 실패:', error)
        return { ok: false, message: error.message || '썸네일 업로드 중 오류가 발생했습니다.' };
    }
} 