'use client'
import React, { useRef, useState, ChangeEvent, useEffect } from 'react'
import styles from './ImageUploader.module.css'

interface Props {
  label: string;
  name: string;
  disabled?: boolean;
  uploading?: boolean;
  previewUrl: string;
  maxSizeMB?: number;
  onFileChange: (file: File) => void;
  onRemove: () => void;
}

export default function ImageUploader({
  label,
  name,
  disabled = false,
  uploading = false,
  previewUrl,
  maxSizeMB = 5,
  onFileChange,
  onRemove,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return;
    }
    // 파일 크기 검증
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`${maxSizeMB}MB 이하의 파일만 업로드 가능합니다.`);
      return;
    }

    onFileChange(file);
  }

   // 컴포넌트 언마운트 시 Blob URL 해제 (previewUrl이 blob: 인 경우)
   useEffect(() => {
    return () => {
      if (typeof previewUrl === 'string' && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleRemove = () => {
    setError(null);
    onRemove();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <>
      <div className={styles.uploader}>
        <label>{label}</label>
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept="image/*"
          onChange={handleChange}
          disabled={disabled || uploading}
        />
         {error && <p className={styles.error}>{error}</p>}
        {uploading && <p className={styles.uploading}>업로드 중…</p>}
        {previewUrl && (
          <div className={styles.previewWrap}>
            <img src={previewUrl} alt="미리보기" className={styles.previewImg} />
            <button type="button" onClick={handleRemove}>X</button>
          </div>
        )}
        
      </div>
      <p className={styles.noti}>미리보기 이미지는 실제 비율과 다를 수 있음</p>
    </>
  )
}
