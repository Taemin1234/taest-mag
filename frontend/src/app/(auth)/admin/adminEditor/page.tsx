'use client';

import styles from './adminEditor.module.css'
import { useState, useEffect } from 'react';
import { Editor } from "@/types"
import AdminEditorList from '@/components/editor/AdminEditorList';
import AdminEditorModal from '@/components/editor/AdminEditorModal';
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
          const response = await axios.get("http://localhost:3001/api/editors");
          setEditors(response.data);
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

  const openAdd = () => { setCurrentEditor(null); setModalOpen(true); };
  const openEdit = (e: Editor) => { setCurrentEditor(e); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

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
                editor={editor}    // <-- prop 이름 바뀜
                onEdit={openEdit} // openEdit(id: string) 으로 정의되어 있다면 그대로 넘겨도 OK
                onDelete={() => handleDelete(editor.id)}  
              />
            ))
          )}
      </ul>

      {modalOpen && (
        <AdminEditorModal
          // editor={currentEditor}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
