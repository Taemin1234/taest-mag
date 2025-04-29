'use client';

import styles from './adminEditor.module.css'
import { useState, useEffect } from 'react';
import { Editor } from "@/types"
import AdminEditorList from '@/components/editor/AdminEditorList';
import AdminEditorModal from '@/components/editor/AdminEditorModal';
import type { AxiosResponse } from 'axios';
import axios from 'axios';

export default function AdminEditor() {
  const [editors, setEditors] = useState<Editor[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEditor, setCurrentEditor] = useState<Editor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 에디터 목록 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
          const res = await axios.get("/api/editors");
          setEditors(res.data);
      } catch (error) {
          console.log("에디터 로딩 실패: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 모달 오픈 시 스크롤 제어
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // unmount 시에도 원상 복구
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  const openAdd = () => { setCurrentEditor(null); setModalOpen(true);};
  const openEdit = (e: Editor) => { setCurrentEditor(e); setModalOpen(true);};
  const closeModal = () => setModalOpen(false);

  //추가/수정 공용 저장 핸들러
  const handleSave = async (data: Editor, file?: File) => {
    try {
      // 1) 이미지 업로드 (file이 있으면 Cloudinary로)
      let imageUrl = data.imageUrl;
      if (file) {
        const form = new FormData();
        form.append('image', file);
        // 백엔드 /api/upload 엔드포인트로 전송
        const uploadRes = await axios.post(
          'http://localhost:3001/api/upload',
          form,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        imageUrl = uploadRes.data.url;
      }
  
      // 2) payload 준비 / 에디터 데이터에 최종 imageUrl 반영
      const payload: Editor = {
        ...data,
        socialLinks: data.socialLinks ?? [],
        imageUrl, 
      };
  
      // 3) 추가/수정 API 호출
      let res: AxiosResponse<Editor>;
      if (payload.id) { // 수정일때 (id 유무로 판단)
        res = await axios.put(`http://localhost:3001/api/editors/${payload.id}`, payload);
        setEditors(prev =>
          prev.map(e => e.id === payload.id ? res.data : e)
        );
      } else {
        res = await axios.post('http://localhost:3001/api/editors', payload);
        setEditors(prev => [...prev, res.data]);
      }
    } catch (err) {
      console.error('저장 실패:', err);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  // 삭제 이벤트
  const handleDelete = async (id: string) => {
    if (!window.confirm('삭제하시겠어요?')) return;
    try {
        await axios.delete(`http://localhost:3001/api/editors/${id}`, {
            withCredentials: true
        });
        setEditors(prev =>
          prev.filter(editor => editor.id !== id)
        );
    } catch (error) {
        console.error('삭제 실패:', error);
    }
  };

  return (
    <div>
      <h1>에디터 관리</h1>
      <div className={styles.btn_wrap}>
        <button onClick={openAdd} className={styles.addEditor}>+ 에디터 추가</button>
      </div>
      <ul className={styles.editor_list}>
        {isLoading ? (
          <div>로딩중</div>
          ) : editors.length === 0 ? (
            <div>에디터가 없습니다.</div>
          ) : (
            editors.map((editor) => (
              <AdminEditorList
                key={editor.id}
                editor={editor}
                onEdit={openEdit} // 모든 객체를 저장
                onDelete={() => handleDelete(editor.id!)}  
              />
            ))
          )}
      </ul>

      {modalOpen && (
        <AdminEditorModal
          editor={currentEditor}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
