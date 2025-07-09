"use client"

import styles from './PostForm.module.css'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { Option, Editor } from "@/types"
import QuillEditor from '@/components/ui/QuillEditor';
import Dropdown from '@/components/ui/DropDown';
import { SingleCheckbox } from '@/components/ui/Checkbox'
import { CATEGORIES } from '@/constants/categories';
import ImageUploader from '@/components/ui/ImageUploader';
import axios from 'axios';

export interface FormData {
    title: string;
    subtitle: string;
    category: string;
    subCategory: string;
    thumbnailUrl: string;
    isFeatured: boolean;
    editor: string;
    content: string;
}

interface PostFormProps {
    pageTitle: string;
    initialData?: FormData;
    onSubmit?: (data: FormData) => Promise<void>;
}

export default function PostForm({
    pageTitle,
    initialData,
    onSubmit,
}: PostFormProps) {
    const [formData, setFormData] = useState<FormData>(
        initialData ?? {
            title: '',
            subtitle: '',
            category: '',
            subCategory: '',
            thumbnailUrl: '',
            isFeatured: false,
            editor: '',
            content: '',
        }
    )
    const [editorName, setEditorName] = useState<Option[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null)
    const [category, setCategory] = useState<string | undefined>
    (undefined);
    const [isFeatured, setIsFeatured] = useState(false)
    
    const router = useRouter()

    // 썸네일 필수 검증
    useEffect(() => {
        if (!initialData && !thumbnailFile) {
            setError('썸네일 이미지를 꼭 등록해주세요.');
        } else {
            setError(null);
        }
    }, [initialData, thumbnailFile]);

    // Edit 모드로 진입해 initialData가 바뀌면 폼에 반영
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setPreviewUrl(initialData.thumbnailUrl);
            setCategory(initialData.category);
            setIsFeatured(initialData.isFeatured);
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

    // 내용 변경 핸들러
    const handleChange = (name: keyof FormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 선택된 대분류의 서브카테고리만 뽑아오기
    const subOptions = CATEGORIES.find(c => c.value === category)?.subCategories ?? [];

    // 이미지 파일 변경 핸들러
    const handleFileChange = (file: File) => {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setThumbnailFile(file);
        setFormData(prev => ({ ...prev, thumbnailUrl: url }));
    };

    // 이미지 파일 삭제
    const handleRemoveImage = () => {
        setPreviewUrl("");
        setThumbnailFile(null);
        setFormData(prev => ({ ...prev, thumbnailUrl: "" }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setUploading(true)

        // 썸네일 필수 검증
        if (!initialData && !thumbnailFile) {
            setError('썸네일 이미지를 꼭 등록해주세요.');
            setUploading(false);
            return;
        }

        try {
            let finalThumbnailUrl = formData.thumbnailUrl;

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
                  const thumbData = (await thumbRes.json()) as { url: string };
                  finalThumbnailUrl = thumbData.url;
            }

            // 최종 게시물 데이터 준비
            const finalFormData = {
                ...formData,
                thumbnailUrl: finalThumbnailUrl
            };

            if (onSubmit) {
                // 수정 모드: 상위 페이지에서 넘겨준 콜백 호출
                await onSubmit(finalFormData)
            } else {
                // 새 글 작성 모드: 기본 POST
                const postRes = await fetch('/api/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(finalFormData),
                });
                if (!postRes.ok) {
                    const errData = await postRes.json().catch(() => ({}));
                    throw new Error(errData.message || '게시물 저장 실패');
                }
            }
            // 성공 시 리스트 페이지로 이동
            router.push('/admin/adminPosts')
        } catch (err: any) {
            console.error('게시물 저장 실패:', err)
            setError(err.response?.data?.message || '게시물 저장 중 오류가 발생했습니다.')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div>
            <h1>{pageTitle}</h1>
            {error && <p className={styles.error}>{error}</p>}
            <form className={styles.form_wrap} onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">
                        제목
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={e => handleChange('title', e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="subtitle">
                        부제목
                    </label>
                    <input
                        type="text"
                        id="subtitle"
                        name="subtitle"
                        required
                        value={formData.subtitle}
                        onChange={e => handleChange('subtitle', e.target.value)}
                    />
                </div>
                <Dropdown
                    name="editor"
                    options={editorName}
                    value={formData.editor}
                    onChange={val => {
                        handleChange('editor', val)
                    }}
                    label={'에디터 선택'}
                    placeholder={'에디터를 선택해주세요'}
                    required={true}
                />
                <Dropdown
                    name="category"
                    label="대분류"
                    placeholder="카테고리 선택"
                    options={CATEGORIES.map(c => ({ label: c.label, value: c.value }))}
                    value={formData.category}
                    onChange={val => {
                        setCategory(val);
                        handleChange('category', val)
                    }}
                    required={true}
                />

                {/* 2단계: 서브카테고리 (대분류를 선택해야 보임) */}
                {subOptions.length > 0 && (
                    <Dropdown
                        name="subCategory"
                        label="소분류"
                        placeholder="소분류 선택"
                        options={subOptions.map(s => ({ label: s.label, value: s.value }))}
                        value={formData.subCategory}
                        onChange={val => {
                            handleChange('subCategory', val)
                        }}
                        required
                    />
                )}

                <SingleCheckbox
                    label="표지 게시물로 등록"
                    name="isFeatured"
                    checked={isFeatured}
                    onChange={val => {
                        setIsFeatured(val);
                        handleChange('isFeatured', val)
                    }}
                />

                <ImageUploader
                    label="썸네일 이미지"
                    name="thumbnailUrl"
                    disabled={false}
                    uploading={uploading}
                    previewUrl={previewUrl}
                    onFileChange={handleFileChange}
                    onRemove={handleRemoveImage}
                />
                <div className={styles.editorContainer}>
                    <label htmlFor="content">
                        내용
                    </label>
                    <QuillEditor
                        defaultValue={formData.content}          // 현재 폼의 content
                        onChange={val => handleChange('content', val)}// 내용이 바뀌면 이 함수가 실행
                    />
                </div>
                <div className={styles.button_wrap}>
                    <button className={styles.red} onClick={() => router.back()}>취소</button>
                    <button type="submit">{initialData ? '수정' : '저장'}</button>
                </div>
            </form>
        </div>
    )
}