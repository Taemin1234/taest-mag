"use client"

import React from 'react';
import { SNSLink } from "@/types"
import styles from './AdminSNSInput.module.css';

interface SNSProps {
    links: SNSLink[];
    onChange: (links: SNSLink[]) => void;
}

const platformOptions = [
  'Facebook',
  'Instagram',
  'Naver Blog',
  'X(Twitter)',
  'LinkedIn',
  'YouTube',
  'GitHub',
  'Personal Website',
];

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
    setLinksIfAllowed([...links, { platform: '', url: '' }]);
  };

  const setLinksIfAllowed = (newLinks: SNSLink[]) => {
    const last = links[links.length - 1];
    if (!last || (last.platform.trim() && last.url.trim())) {
      onChange(newLinks);
    } else {
      alert('먼저 현재 입력창을 채워주세요.');
    }
  };

  const removeLink = (idx: number) => {
    onChange(links.filter((_, i) => i !== idx));
  };

  return (
    <div className={styles.sns_wrap}>
      <div className={styles.input_wrap}>
        <label>SNS 주소</label>

        {links.length > 0 && (
          <div className={styles.sns_list_wrap}>
            {links.map((link, idx) => (
                <div key={idx} className={styles.sns_list}>
                    <div className={styles.sns_input}>
                        <div className={styles.select_wrap}>
                            <span>SNS명</span>
                            <select
                              name="platform"
                              value={link.platform}
                              onChange={e => handleNameChange(idx, e.target.value)}
                            >
                              <option value="" disabled>플랫폼 선택</option>
                              {platformOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
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
                    >
                        삭제
                    </button>
                </div>
            ))}
        </div>
        )}

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
