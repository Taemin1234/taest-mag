"use client"

import React, { useState, useEffect } from 'react';
import styles from './AdminEditorModal.module.css';
import { Editor, SNSLink } from '@/types';
import AdminSNSInput from '@/components/editor/AdminSNSInput';
import ImageUploader from '@/components/ui/ImageUploader'

interface EditorModalProps {
    editor: Editor | null;
    onClose: () => void;
    onSave: (editor: Editor) => void;
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
    const [error, setError] = useState<string | null>(null);

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
        setError(null);
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
        setEditorData(prev => ({ ...prev, socialLinks: newLinks.length ? newLinks : [], }));
    };

    // 입력한 에디터 저장
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        let finalUrl = editorData.imageUrl;

        // 새 이미지가 선택되었다면 업로드
        if (imageFile) {
            setUploading(true);
            try {
                // 1) FormData 에 파일 붙이기
                const form = new FormData();
                form.append('profile', imageFile);

                // 2) fetch로 POST 요청 보내기
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/upload/profile`, {
                    method: 'POST',
                    body: form,
                    // 쿠키 전송을 위해 include
                    credentials: 'include',
                });

                // 3) HTTP 에러 체크
                if (!response.ok) {
                    // 서버가 에러 메시지를 JSON으로 내려준다면 파싱
                    let errMsg = '이미지 업로드 중 오류가 발생했습니다.';
                    try {
                        const errData = await response.json();
                        if (errData.message) errMsg = errData.message;
                    } catch {
                        /* ignore parse errors */
                    }
                    setError(errMsg);
                    setUploading(false);
                    return;
                }

                // 4) 성공 시 JSON 파싱하여 URL 꺼내기
                const data = (await response.json()) as { url: string };
                finalUrl = data.url;

            } catch (err: any) {
                console.error('이미지 업로드 실패:', err);
                setError(err.message || '이미지 업로드 중 오류가 발생했습니다.');
                setUploading(false);
                return;
            }
            setUploading(false);
        }


        const payload: Editor = {
            ...editorData,
            imageUrl: finalUrl,
        };
        onSave(payload);
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
                        <p>이름 겹치지 않게 만들어주세요!</p>
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