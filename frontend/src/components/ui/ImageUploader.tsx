'use client'
import React, { useRef, useState, ChangeEvent } from 'react'
import styles from './ImageUploader.module.css'

interface Props {
  label: string
  name: string
  disabled?: boolean
  uploading?: boolean
  previewUrl: string
  onFileChange: (file: File) => void
  onRemove: () => void
}

export default function ImageUploader({
  label, name,
  disabled, uploading,
  previewUrl,
  onFileChange, onRemove,
}: Props) {
  const inp = useRef<HTMLInputElement>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) onFileChange(f)
  }

  return (
    <>
      <div className={styles.uploader}>
        <label>{label}</label>
        <input
          ref={inp}
          type="file"
          name={name}
          accept="image/*"
          onChange={handleChange}
          disabled={disabled || uploading}
        />
        {uploading && <p className={styles.uploading}>업로드 중…</p>}
        {previewUrl && (
          <div className={styles.previewWrap}>
            <img src={previewUrl} alt="미리보기" className={styles.previewImg} />
            <button type="button" onClick={() => {
              onRemove()
              if (inp.current) inp.current.value = ''
            }}>X</button>
          </div>
        )}
        
      </div>
      <p className={styles.noti}>미리보기 이미지는 실제 비율과 다를 수 있음</p>
    </>
  )
}
