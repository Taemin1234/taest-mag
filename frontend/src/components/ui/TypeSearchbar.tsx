'use client';

import React from 'react';
import styles from './TypeSearchbar.module.css';

export interface TypeSearchbarProps {
    /** 검색할 필드: 제목(title) 또는 내용(content) */
    searchType: 'title' | 'content';
    /** 검색 필드 변경 시 호출 */
    onSearchTypeChange: (value: 'title' | 'content') => void;
    /** 현재 검색어 */
    query: string;
    /** 검색어 변경 시 호출 */
    onQueryChange: (value: string) => void;
}

export default function TypeSearchbar({
    searchType,
    onSearchTypeChange,
    query,
    onQueryChange,
}: TypeSearchbarProps) {
    return (
        <div className={styles.search_wrap}>
            <select
                value={searchType}
                onChange={e => onSearchTypeChange(e.target.value as 'title' | 'content')}
                className={styles.select}
            >
                <option value="title">제목</option>
                <option value="content">내용</option>
            </select>

            <div className={styles.input_wrap}>
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={query}
                    onChange={e => onQueryChange(e.target.value)}
                    className={styles.input}
                />
            </div>
        </div>
    );
}
