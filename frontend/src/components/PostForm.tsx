"use client"

import styles from './PostForm.module.css'
import React, { useState, useEffect } from "react";
import { Option, Editor } from "@/types"
import QuillEditor from '@/components/ui/QuillEditor';
import Dropdown from './ui/DropDown';
import { CATEGORIES } from '@/constants/categories';
import axios from 'axios';

interface FormData {
    title: string;
    subtitle: string;
    content: string;
    category: string;
    editor: string;
}

interface PostFormProps {
    pageTitle: string;
  }

export default function PostForm({ pageTitle }: PostFormProps) {
    const [formData, setFormData] = useState<FormData>({
        title: '',
        subtitle: '',
        content: '',
        category: '',
        editor: '',
    });
    const [editorName, setEditorName] = useState<Option[]>([]);
    const [selectedEditors, setSelectedEditors] = useState<string>();
    const [isLoading, setIsLoading] = useState(true);

    const [category, setCategory] = useState<string | undefined>(undefined);
    const [subCategory, setSubCategory] = useState<string | undefined>(undefined);

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
    const handleContentChange = (val: string) => {
        setFormData(prev => ({ ...prev, content: val }));
    };

    // 선택된 대분류의 서브카테고리만 뽑아오기
    const subOptions = CATEGORIES.find(c => c.value === category)?.subCategories ?? [];

    return (
        <div>
            <h1>{pageTitle}</h1>
            <form className={styles.form_wrap}>
                <div>
                    <label htmlFor="title">
                        제목
                    </label>
                    <input type="text" id="title" required />
                </div>
                <div>
                    <label htmlFor="subtitle">
                        부제목
                    </label>
                    <input type="text" id="subtitle" required />
                </div>
                <Dropdown 
                    name="editor"
                    options={editorName}
                    value={selectedEditors}
                    onChange={setSelectedEditors}
                    label={'에디터 선택'}
                    placeholder={'에디터를 선택해주세요'}
                    required={true}
                />
                <Dropdown
                    name="category"
                    label="대분류"
                    placeholder="카테고리 선택"
                    options={CATEGORIES.map(c => ({ label: c.label, value: c.value }))}
                    value={category}
                    onChange={val => {
                    setCategory(val);
                    setSubCategory(undefined);  // 대분류 바뀌면 서브카테고리 리셋
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
                    value={subCategory}
                    onChange={setSubCategory}
                    required
                    />
                )}
                <div className={styles.editorContainer}>
                    <label htmlFor="content">
                        내용
                    </label>
                    <QuillEditor
                        value={formData.content}          // 현재 폼의 content
                        onChange={handleContentChange}    // 내용이 바뀌면 이 함수가 실행
                    />
                </div>
                <div className={styles.button_wrap}>
                    <button className={styles.red}>취소</button>
                    <button>저장</button>
                </div>
            </form>
        </div>
    )
}