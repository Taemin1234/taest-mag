"use client"

import styles from './AdminEditorModal.module.css'
import { Editor, SNSLink } from "@/types"
import { useState } from 'react'
import AdminSNSInput from '@/components/editor/AdminSNSInput'
  
interface EditorModalProps {
    editor: Editor | null;
    onClose: () => void;
    // onSave: (editor: Editor) => void;
}

export default function AdminEditorModal({ onClose }: EditorModalProps) {
    const [editorData, setEditorData] = useState<Editor[]>({
        name: "",
        imageUrl: "",
        tagline: "",
        des: "",
        socialLinks: [{ platform: '', url: '' }],
    });

    const handleSocialLinksChange = (newLinks: SNSLink[]) => {
        setEditorData(prev => ({ ...prev, socialLinks: newLinks }));
    };

    const handleChange = (e) => {
        setEditorData({
            ...editorData,
            [e.target.name]: e.target.value, // input에 지정한 name과 value 값
        });

        console.log(editorData);
    };
    
    return (
        <div className={styles.editorModal}>
            <div className={styles.input_info}>
                <h2>
                    에디터 추가
                </h2>
                <form className={styles.form_wrap}>
                    <div>
                        <label>프로필 이미지</label>
                        <input
                        type="file"
                        name='imageUrl'
                        accept="image/*"
                        // onChange={handleFileChange}
                        />
                        {/* {previewUrl && (
                            <img
                                src={previewUrl}
                                alt="프리뷰"
                                className="mt-2 h-20 w-20 object-cover rounded-full border"
                            />
                        )} */}
                    </div>
                    <div>
                        <label>이름</label>
                        <input
                            type="text"
                            name='name'
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>한줄 설명</label>
                        <input
                            type="text"
                            name='tagline'
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>긴 설명</label>
                        <textarea
                            name='des'
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