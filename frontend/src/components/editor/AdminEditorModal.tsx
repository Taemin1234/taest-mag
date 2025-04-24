"use client"

import styles from './AdminEditorModal.module.css'
import { Editor, SNSLink } from "@/types"
import { useState } from 'react'
import axios from 'axios'
import AdminSNSInput from '@/components/editor/AdminSNSInput'
  
interface EditorModalProps {
    editor: Editor | null;
    onClose: () => void;
    // onSave: (editor: Editor) => void;
}

export default function AdminEditorModal({ onClose }: EditorModalProps) {
    const [editorData, setEditorData] = useState<Editor>({
        name: "",
        imageUrl: "",
        tagline: "",
        des: "",
        socialLinks: [{ platform: '', url: '' }],
    });
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [uploading, setUploading] = useState<boolean>(false);

    const handleSocialLinksChange = (newLinks: SNSLink[]) => {
        setEditorData(prev => ({ ...prev, socialLinks: newLinks }));
    };

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

    // 파일 삭제
    const handleRemoveImage = () => {
        setPreviewUrl("");
        setEditorData(prev => ({ ...prev, imageUrl: "" }));
    };

    // 입력한 에디터 저장
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
          // 1) 만약 아직 Cloudinary에 업로드하지 않은 로컬 blob URL이라면
          let uploadUrl = editorData.imageUrl
          if (previewUrl && previewUrl.startsWith('blob:')) {
            // FormData에 파일 첨부
            const file = (document.querySelector('input[name="imageUrl"]') as HTMLInputElement)?.files?.[0]
            if (file) {
              const form = new FormData()
              form.append('image', file)
              // 백엔드 /api/upload 엔드포인트로 전송
              const uploadRes = await axios.post(
                'http://localhost:3001/api/upload',
                form,
                { headers: { 'Content-Type': 'multipart/form-data' } }
              )
              uploadUrl = uploadRes.data.url
            }
          }
    
          // 2) 에디터 데이터에 최종 imageUrl 반영
          const payload: Editor = { ...editorData, imageUrl: uploadUrl }
    
          // 3) MongoDB에 저장
          await axios.post(
            'http://localhost:3001/api/editors',
            payload,
            { headers: { 'Content-Type': 'application/json' } }
          )
    
          // 성공 시 모달 닫기
          onClose()
        } catch (err) {
          console.error(err)
          alert('저장 중 오류가 발생했습니다.')
        }
      }
    
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