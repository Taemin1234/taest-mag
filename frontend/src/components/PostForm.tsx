"use client"

import styles from './PostForm.module.css'
import React, { useState, useEffect ,useRef } from "react";
import { useRouter } from 'next/navigation'
import { Option, Editor } from "@/types"
import QuillEditor from '@/components/ui/QuillEditor';
import Dropdown from '@/components/ui/DropDown';
import { CATEGORIES } from '@/constants/categories';
import axios from 'axios';

export interface FormData {
    title: string;
    subtitle: string;
    category: string;
    subCategory: string;
    thumbnailUrl:string;
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
    // initialData가 있으면 수정 모드, 없으면 새 글 모드
    const [formData, setFormData] = useState<FormData>(
        initialData ?? {
        title: '',
        subtitle: '',
        category: '',
        subCategory: '',
        thumbnailUrl:'',
        editor: '',
        content: '',
        }
    )
    const [editorName, setEditorName] = useState<Option[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    const [category, setCategory] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter()

    // Edit 모드로 진입해 initialData가 바뀌면 폼에 반영
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setPreviewUrl(initialData.thumbnailUrl);
        }
    }, [initialData])

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

    // 에디터 내용 변경 핸들러
    const handleChange = (name: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        // console.log(formData)
    };

    // 선택된 대분류의 서브카테고리만 뽑아오기
    const subOptions = CATEGORIES.find(c => c.value === category)?.subCategories ?? [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        try {
            if (onSubmit) {
                // 수정 모드: 상위 페이지에서 넘겨준 콜백 호출
                await onSubmit(formData)
              } else {
                // 새 글 작성 모드: 기본 POST
                await axios.post('/api/posts', formData, { withCredentials: true })
              }
          // 성공 시 리스트 페이지로 이동
          router.push('/admin/adminPosts')
        } catch (err: any) {
          console.error('게시물 저장 실패:', err)
          setError(err.response?.data?.message || '게시물 저장 중 오류가 발생했습니다.')
        }
    }

    // 이미지 파일 미리보기
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            // 이미 업로드된 이미지가 있으면 차단
            if (previewUrl) {
            alert("이미지는 한 개만 업로드할 수 있습니다.")
            return
        }

        const file = e.target.files?.[0];
        if (!file) return;
        
        // FileReader보다 메모리 관리 측면에서 효율적
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        // 업로드는 나중에 handleSubmit 에서 처리

        setFormData(prev => ({ ...prev, thumbnailUrl: url }));
    };

    // 이미지 파일 삭제
    const handleRemoveImage = () => {
        setPreviewUrl("");
        setFormData(prev => ({ ...prev, thumbnailUrl: "" }));
    };

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
                <div>
                    <label>썸네일 이미지</label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        name='thumbnailUrl'
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={!!previewUrl}
                    />
                    {previewUrl && (
                        <div className={styles.previewImg_wrap}>
                            <img
                                src={previewUrl}
                                alt="미리보기"
                                className={styles.previewImg}
                            />
                            <button
                                type='button'
                                onClick={handleRemoveImage}
                            >X</button>
                        </div>
                    )}
                </div>
                <div className={styles.editorContainer}>
                    <label htmlFor="content">
                        내용
                    </label>
                    <QuillEditor
                        value={formData.content}          // 현재 폼의 content
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