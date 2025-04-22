"use client"

import React from 'react';
import { SNSLink } from "@/types"
import styles from './AdminSNSInputList.module.css';

interface SNSProps {
    links: SNSLink[];
    onChange: (links: SNSLink[]) => void;
}

export default function AdminSNSInputList({ links, onChange }: SNSProps) {

  const handleNameChange = (idx: number, value: string) => {
    const next = [...links];
    next[idx].platform = value;
    onChange(next);
  };

  const handleUrlChange = (idx: number, value: string) => {
    const next = [...links];
    next[idx].url = value;
    onChange(next);
  };


  const addLink = () => {
    const last = links[links.length - 1]; //마지막 항목
    if (last.platform.trim() !== '' && last.url.trim() !== '') {
      onChange([...links, { platform: '', url: '' }]);
    } else {
        alert('내용을 입력해주세요')
    }
  };

  const removeLink = (idx: number) => {
    onChange(links.filter((_, i) => i !== idx));
  };

  return (
    <div className={styles.sns_wrap}>
      <div className={styles.input_wrap}>
        <label>SNS 주소</label>

        <div className={styles.sns_list_wrap}>
            {links.map((link, idx) => (
                <div key={idx} className={styles.sns_list}>
                    <div className={styles.sns_input}>
                        <div>
                            <span>SNS명</span>
                            <input
                                type="text"
                                name='platform'
                                value={link.platform}
                                onChange={e => handleNameChange(idx, e.target.value)}
                            />
                        </div>
                        <div>
                            <span>SNS주소</span>
                            <input
                                type="text"
                                name='url'
                                value={link.url}
                                onChange={e => handleUrlChange(idx, e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        className={styles.red}
                        onClick={() => removeLink(idx)}
                        disabled={links.length === 1} // 한 개일 땐 삭제 비활성화
                    >
                        삭제
                    </button>
                </div>
            ))}
        </div>

      </div>
      <button
        type="button"
        className={styles.white}
        onClick={addLink}
      >
        + SNS 주소 추가
      </button>
    </div>
  );
}
