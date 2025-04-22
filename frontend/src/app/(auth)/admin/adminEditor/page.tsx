'use client';

import styles from './adminEditor.module.css'
import { useState, useEffect } from 'react';
import { Editor } from "@/types"
import AdminEditorList from '@/components/editor/AdminEditorList';
import AdminEditorModal from '@/components/editor/AdminEditorModal';

export default function AdminEditor() {
  const [editors, setEditors] = useState<Editor[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEditor, setCurrentEditor] = useState<Editor | null>(null);

  // 백엔드 
  //   useEffect(() => {
  //     fetch('/api/editors').then(r => r.json()).then(setEditors);
  //   }, []);

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

  const handleSave = (editor: Editor) => {
    // POST or PUT으로 저장 → 목록 갱신
  };
  const handleDelete = (id: string) => {
    // DELETE 호출 → 목록 갱신
  };

  const dummyEditor = [
    {
      id: 1,
      name: 'olivia rodrigo',
      // imageUrl : '/public/profileImg.png',
      tagline: '소울이 담긴 목소리, 감동을 주는 음악을 합니다.',
      des: '데뷔 이래로 2020년대 대중음악계를 대표하는 슈퍼스타 중 하나로 꼽힌다. 빌리 아일리시, 키드 라로이 등과 함께 가장 대표적인 Z세대 가수이며 에이브릴 라빈의 재림으로 평가받는 대중음악계에서 가장 인기있는 가수들 중 하나이다.',
      socialLinks: [
        { platform: 'Instagram', url: 'https://instagram.com/oliviarodrigo' },
        { platform: 'YouTube', url: 'https://youtube.com/oliviarodrigo' }
      ]
    },
    {
      id: 2,
      name: 'Jensen Huang',
      // imageUrl : '/public/profileImg.png',
      tagline: '미래 산업의 선두주자, 엔비디아에서 일하고 있습니다.',
      des: '데뷔 이래로 2020년대 대중음악계를 대표하는 슈퍼스타 중 하나로 꼽힌다. 빌리 아일리시, 키드 라로이 등과 함께 가장 대표적인 Z세대 가수이며 에이브릴 라빈의 재림으로 평가받는 대중음악계에서 가장 인기있는 가수들 중 하나이다.',
      socialLinks: [
        { platform: 'Instagram', url: 'https://instagram.com/oliviarodrigo' },
        { platform: 'YouTube', url: 'https://youtube.com/oliviarodrigo' }
      ]
    },
    {
      id: 3,
      name: '한로로',
      // imageUrl : '/public/profileImg.png',
      tagline: 'taest 전속가수',
      des: '데뷔 이래로 2020년대 대중음악계를 대표하는 슈퍼스타 중 하나로 꼽힌다. 빌리 아일리시, 키드 라로이 등과 함께 가장 대표적인 Z세대 가수이며 에이브릴 라빈의 재림으로 평가받는 대중음악계에서 가장 인기있는 가수들 중 하나이다.',
      socialLinks: [
        { platform: 'Instagram', url: 'https://instagram.com/oliviarodrigo' },
        { platform: 'YouTube', url: 'https://youtube.com/oliviarodrigo' }
      ]
    },
    {
      id: 4,
      name: '드록바',
      // imageUrl : '/public/profileImg.png',
      tagline: 'taest 전속축구선수',
      des: '데뷔 이래로 2020년대 대중음악계를 대표하는 슈퍼스타 중 하나로 꼽힌다. 빌리 아일리시, 키드 라로이 등과 함께 가장 대표적인 Z세대 가수이며 에이브릴 라빈의 재림으로 평가받는 대중음악계에서 가장 인기있는 가수들 중 하나이다.',
      socialLinks: [
        { platform: 'Instagram', url: 'https://instagram.com/oliviarodrigo' },
        { platform: 'YouTube', url: 'https://youtube.com/oliviarodrigo' }
      ]
    }
  ]

  return (
    <div>
      <h1>에디터 관리</h1>
      <div className={styles.btn_wrap}>
        <button onClick={openAdd} className={styles.addEditor}>+ 에디터 추가</button>
      </div>
      <ul className={styles.editor_list}>
        {dummyEditor.map((editor) => (
          <AdminEditorList
            key={editor.id}
            editor={editor}              // <-- prop 이름 바뀜
            onEdit={openEdit}            // openEdit(id: string) 으로 정의되어 있다면 그대로 넘겨도 OK
            onDelete={handleDelete}      // handleDelete(id: string)
          />
        ))}
      </ul>

      {modalOpen && (
        <AdminEditorModal
          // editor={currentEditor}
          onClose={closeModal}
        // onSave={handleSave}
        />
      )}
    </div>
  );
}
