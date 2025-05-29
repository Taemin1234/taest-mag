"use client"

import React, { useState, useEffect } from 'react';
import styles from './AdminEditorModal.module.css';
import { Editor, SNSLink } from '@/types';
import AdminSNSInput from '@/components/editor/AdminSNSInput';
import ImageUploader from '@/components/ui/ImageUploader'
  
interface EditorModalProps {
    editor: Editor | null;
    onClose: () => void;
    onSave: (editor: Editor, file?: File) => void;
}

export default function AdminEditorModal({ editor, onClose, onSave }: EditorModalProps) {
    const [editorData, setEditorData] = useState<Editor>({
        name: "",
        imageUrl: "",
        tagline: "",
        des: "",
        socialLinks: [],
    });
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [uploading, setUploading] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // editor prop이 바뀔 때마다 state를 초기화
    useEffect(() => {
        if (editor) {
            setEditorData(editor);
            setPreviewUrl(editor.imageUrl);   
        } else {
            setEditorData({ 
                name: '',
                imageUrl: '',
                tagline: '',
                des: '',
                socialLinks: [],
            });
            setPreviewUrl('');
        }
    }, [editor]);

    // 필드 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditorData({
            ...editorData,
            [e.target.name]: e.target.value,
        });
    };

    // 이미지 파일 변경 핸들러
    const handleFileChange = (file: File) => {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setImageFile(file);
        setEditorData(prev => ({ ...prev, imageUrl: url }));
    };

    // 이미지 파일 삭제
    const handleRemoveImage = () => {
        setPreviewUrl("");
        setImageFile(null);
        setEditorData(prev => ({ ...prev, imageUrl: "" }));
    };

    // SNS 링크 변경
    const handleSocialLinksChange = (newLinks: SNSLink[]) => {
        setEditorData(prev => ({ ...prev, socialLinks: newLinks.length ? newLinks : [],}));
    };

    // 입력한 에디터 저장
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload: Editor = {
            ...editorData,
            socialLinks: editorData.socialLinks ?? [],
        };
        onSave(payload, imageFile || undefined);
        onClose();
    };
    
    return (
        <div className={styles.editorModal}>
            <div className={styles.input_info}>
                <h2>
                    에디터 추가
                </h2>
                <form onSubmit={handleSubmit} className={styles.form_wrap}>
                    <ImageUploader
                        label="프로필 이미지"
                        name="imageUrl"
                        disabled={false}
                        uploading={uploading}
                        previewUrl={previewUrl}
                        onFileChange={handleFileChange}
                        onRemove={handleRemoveImage}
                    />
                    <div>
                        <label>이름</label>
                        <input
                            type="text"
                            name='name'
                            value={editorData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>한줄 설명</label>
                        <input
                            type="text"
                            name='tagline'
                            value={editorData.tagline}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>긴 설명</label>
                        <textarea
                            name='des'
                            value={editorData.des}
                            rows={4}
                            onChange={handleChange}
                        />
                    </div>
                    <AdminSNSInput
                        links={
                            editorData.socialLinks && editorData.socialLinks.length > 0
                              ? editorData.socialLinks
                              : []
                          }
                        onChange={handleSocialLinksChange}
                    />
                    <div className={styles.btn_wrap}>
                        <button
                            type="button"
                            className={styles.red}
                            onClick={() => onClose()}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className={styles.white}
                        >
                            저장
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}