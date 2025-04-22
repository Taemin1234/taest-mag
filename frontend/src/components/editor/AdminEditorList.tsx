'use client';

import React from 'react';
import Image from 'next/image';
import styles from "./AdminEditorList.module.css"
import { Editor } from "@/types"


export interface AdminEditorListProps {
    editor: Editor;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function AdminEditorList({ editor, onEdit, onDelete }: AdminEditorListProps) {
    const { id, name, imageUrl, tagline, des, socialLinks } = editor;
  
    return (
      <li className={styles.editorList}>
        <div className={styles.editHeader}>
            <p className={styles.index}>No. {id}</p>
            <div className={styles.button_wrap}>
                <button
                    onClick={() => onEdit(id)}
                    className={styles.edit}
                >
                    수정
                </button>
                <button
                    onClick={() => onDelete(id)}
                    className={styles.delete}
                >
                    삭제
                </button>
            </div>
        </div>
        <div className={styles.profile_box}>
            <Image
                src={imageUrl || '/profileImg.png'}
                alt={imageUrl ? `${name} 프로필 이미지` : '기본 프로필 이미지'}
                width={64}
                height={64}
                className="rounded-full"
            />
            <div>
                <h3>{name}</h3>
                <p>{tagline}</p>
            </div>
        </div>
        <p>{des}</p>
        {socialLinks.length > 0 && (
          <ul className={styles.social}>
            {socialLinks.map((link) => (
              <li key={link.platform}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.platform}
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }