"use client"

import styles from './PostForm.module.css'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { Option, Editor } from "@/types"
import WebEditor from '@/components/ui/WebEditor';
import Dropdown from '@/components/ui/DropDown';
import { SingleCheckbox } from '@/components/ui/Checkbox'
import { CATEGORIES } from '@/constants/categories';
import ImageUploader from '@/components/ui/ImageUploader';
import axios from 'axios';
import { createPost, updatePost, type PostFormData } from '@/app/actions/postActions';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

interface PostFormServerProps {
    pageTitle: string;
    initialData?: PostFormData;
    slug?: string; // 수정 모드일 때 사용
}

// Server Action을 래핑하는 함수들
async function createPostAction(prevState: any, formData: PostFormData) {
    try {
        await createPost(formData);
        return { success: true, error: null };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function updatePostAction(prevState: any, formData: PostFormData) {
    try {
        if (!formData.slug) throw new Error('Slug is required for update');
        await updatePost(formData.slug, formData);
        return { success: true, error: null };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// 로딩 상태를 표시하는 컴포넌트
function SubmitButton({ isEdit }: { isEdit: boolean }) {
    const { pending } = useFormStatus();
    
    return (
        <button type="submit" disabled={pending}>
            {pending ? '처리 중...' : (isEdit ? '수정' : '저장')}
        </button>
    );
}

export default function PostFormServer({
    pageTitle,
    initialData,
    slug,
}: PostFormServerProps) {
    const [editorName, setEditorName] = useState<Option[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [category, setCategory] = useState<string | undefined>(undefined);
    const [isFeatured, setIsFeatured] = useState(false);
    const [content, setContent] = useState('');
    
    const router = useRouter();

    // Server Action 초기화
    const initialState = { success: false, error: null };
    const [state, formAction] = useActionState(
        initialData ? updatePostAction : createPostAction,
        initialState
    );

    // Edit 모드로 진입해 initialData가 바뀌면 폼에 반영
    useEffect(() => {
        if (initialData) {
            setPreviewUrl(initialData.thumbnailUrl);
            setCategory(initialData.category);
            setIsFeatured(initialData.isFeatured);
            setContent(initialData.content);
        }
    }, [initialData]);

    // 에디터 목록 불러오기
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get<Editor[]>("/api/editors");
                const data = res.data;

                const opts = data.map(editor => ({
                    value: editor.name,
                    label: editor.name,
                }));
                setEditorName(opts);
            } catch (error) {
                console.log("에디터 로딩 실패: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // 선택된 대분류의 서브카테고리만 뽑아오기
    const subOptions = CATEGORIES.find(c => c.value === category)?.subCategories ?? [];

    // 이미지 파일 변경 핸들러
    const handleFileChange = (file: File) => {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setThumbnailFile(file);
    };

    // 이미지 파일 삭제
    const handleRemoveImage = () => {
        setPreviewUrl("");
        setThumbnailFile(null);
    };

    // 폼 제출 핸들러
    const handleSubmit = async (formData: FormData) => {
        try {
            let finalThumbnailUrl = initialData?.thumbnailUrl || '';

            // 새로운 이미지 파일이 있다면 먼저 업로드
            if (thumbnailFile) {
                const thumbForm = new FormData();
                thumbForm.append('thumbnail', thumbnailFile);
                
                const thumbRes = await fetch('/api/upload/thumbnail', {
                    method: 'POST',
                    body: thumbForm,
                    credentials: 'include'
                });
                
                if (!thumbRes.ok) throw new Error("썸네일 업로드 실패");
                const thumbData = await thumbRes.json() as { url: string };
                finalThumbnailUrl = thumbData.url;
            }

            // FormData에서 값들을 추출
            const postData: PostFormData = {
                title: formData.get('title') as string,
                subtitle: formData.get('subtitle') as string,
                category: formData.get('category') as string,
                subCategory: formData.get('subCategory') as string,
                thumbnailUrl: finalThumbnailUrl,
                isFeatured: formData.get('isFeatured') === 'true',
                editor: formData.get('editor') as string,
                content: content, // WebEditor에서 관리되는 content 사용
                slug: slug, // 수정 모드일 때만 사용
            };

            // Server Action 호출
            await formAction(postData);
        } catch (error: any) {
            console.error('폼 제출 실패:', error);
        }
    };

    return (
        <div>
            <h1>{pageTitle}</h1>
            {state.error && <p className={styles.error}>{state.error}</p>}
            
            <form 
                className={styles.form_wrap} 
                action={handleSubmit}
            >
                <div>
                    <label htmlFor="title">제목</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        defaultValue={initialData?.title || ''}
                        required
                    />
                </div>
                
                <div>
                    <label htmlFor="subtitle">부제목</label>
                    <input
                        type="text"
                        id="subtitle"
                        name="subtitle"
                        defaultValue={initialData?.subtitle || ''}
                        required
                    />
                </div>
                
                <Dropdown
                    name="editor"
                    options={editorName}
                    value={initialData?.editor || ''}
                    onChange={() => {}}
                    label={'에디터 선택'}
                    placeholder={'에디터를 선택해주세요'}
                    required={true}
                />
                
                <Dropdown
                    name="category"
                    label="대분류"
                    placeholder="카테고리 선택"
                    options={CATEGORIES.map(c => ({ label: c.label, value: c.value }))}
                    value={initialData?.category || ''}
                    onChange={val => setCategory(val)}
                    required={true}
                />

                {/* 2단계: 서브카테고리 (대분류를 선택해야 보임) */}
                {subOptions.length > 0 && (
                    <Dropdown
                        name="subCategory"
                        label="소분류"
                        placeholder="소분류 선택"
                        options={subOptions.map(s => ({ label: s.label, value: s.value }))}
                        value={initialData?.subCategory || ''}
                        onChange={() => {}}
                        required
                    />
                )}

                <SingleCheckbox
                    label="표지 게시물로 등록"
                    name="isFeatured"
                    checked={initialData?.isFeatured || false}
                    onChange={val => setIsFeatured(val)}
                />

                <ImageUploader
                    label="썸네일 이미지"
                    name="thumbnailUrl"
                    disabled={false}
                    uploading={false}
                    previewUrl={previewUrl}
                    onFileChange={handleFileChange}
                    onRemove={handleRemoveImage}
                />
                
                <div className={styles.editorContainer}>
                    <label htmlFor="content">내용</label>
                    <WebEditor
                        defaultValue={initialData?.content || ''}
                        onChange={val => setContent(val)}
                    />
                </div>
                
                <div className={styles.button_wrap}>
                    <button 
                        type="button" 
                        className={styles.red} 
                        onClick={() => router.back()}
                    >
                        취소
                    </button>
                    <SubmitButton isEdit={!!initialData} />
                </div>
            </form>
        </div>
    )
} 