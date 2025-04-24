"use client"

import React, { useState, useEffect, useRef  } from 'react';
import styles from './AdminEditorModal.module.css';
import { Editor, SNSLink } from '@/types';
import AdminSNSInput from '@/components/editor/AdminSNSInput';
import axios from 'axios'
  
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
        socialLinks: [{ platform: '', url: '' }],
    });
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [uploading, setUploading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                socialLinks: [{ platform: '', url: '' }],
            });
            setPreviewUrl('');
        }
    }, [editor]);

    // 필드 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditorData({
            ...editorData,
            [e.target.name]: e.target.value, // input에 지정한 name과 value 값
        });
    };

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

        setEditorData(prev => ({ ...prev, imageUrl: url }));
    };

    // SNS 링크 변경
    const handleSocialLinksChange = (newLinks: SNSLink[]) => {
        setEditorData(prev => ({ ...prev, socialLinks: newLinks }));
    };

    // 파일 삭제
    const handleRemoveImage = () => {
        setPreviewUrl("");
        setEditorData(prev => ({ ...prev, imageUrl: "" }));
    };

    // 입력한 에디터 저장
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // 파일 ref에서 실제 File 객체 추출
        const file = fileInputRef.current?.files?.[0];
        onSave(editorData, file);
        onClose();
      };
    
    return (
        <div className={styles.editorModal}>
            <div className={styles.input_info}>
                <h2>
                    에디터 추가
                </h2>
                <form onSubmit={handleSubmit} className={styles.form_wrap}>
                    <div>
                        <label>프로필 이미지</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            name='imageUrl'
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={!!previewUrl}
                        />
                        {uploading && <p className={styles.uploading}>이미지 업로드 중...</p>}
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
                    <p className={styles.noti}>미리보기 이미지는 실제 비율과 다를 수 있음</p>
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
                        links={editorData.socialLinks}
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