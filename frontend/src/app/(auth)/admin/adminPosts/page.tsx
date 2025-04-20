'use client';

import React from 'react'
import styles from './adminPosts.module.css'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Checkbox, { Option } from '@/components/ui/Checkbox';

type Post = {
    id: string;
    title: string;
    category: string;
    editor: string;
    // ...다른 필드
};

const categories: Option[] = [
    { label: 'All', value: 'all' },
    { label: 'Food', value: 'food' },
    { label: 'Tech', value: 'tech' },
    { label: 'Culture', value: 'culture' },
    { label: 'Living', value: 'living' },
    { label: 'People', value: 'people' },
];

const editors: Option[] = [
    { label: 'All', value: 'all' },
    { label: '태1', value: '태1' },
    { label: '태2', value: '태2' },
    { label: '혜1', value: '혜1' },
];

const adminPosts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedCats, setSelectedCats] = useState<string[]>([]);
    const [selectedEditors, setSelectedEditors] = useState<string[]>([]);


    // 예시: API에서 게시글 불러오기
    // useEffect(() => {
    //     fetch('/api/admin/posts')
    //         .then(res => res.json())
    //         .then(data => setPosts(data));
    // }, []);

    const dummyPost = [
        {
            id: 1432,
            title: '나랑드 사이다 나랑드 사이다나랑드 사이다사이다나랑드사이다나랑드',
            content: '컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠',
            view: 98,
            createdAt: '2025-03-12',
            updatedAt: '2033.16.56'
        },
        {
            id: 214352,
            title: '콜라라 사이다',
            content: '컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠',
            view: 928,
            createdAt: '2025-03-12',
            updatedAt: '2033.16.56'
        },
        {
            id: 1433434,
            title: '카리나 가위위',
            content: '컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠',
            view: 938,
            createdAt: '2025-03-12',
            updatedAt: '2033.16.56'
        }
    ]

    // 필터링 로직
    const filtered = posts.filter(post => {
        const okCat = selectedCats.length === 0 || selectedCats.includes(post.category);
        const okEditor = selectedEditors.length === 0 || selectedEditors.includes(post.editor);
        return okCat && okEditor;
    });

    return (
        <div className={styles.admin_posts}>
            <h1>게시글 관리</h1>
            <section className={styles.chkbox_box}>
                <div className={styles.chkbox_wrap}>
                    <h2 className={styles.chkbox_tit}>카테고리 선택</h2>
                    <Checkbox
                        name="category"
                        options={categories}
                        selectedValues={selectedCats}
                        onChange={setSelectedCats}
                    />
                </div>

                <div className={styles.chkbox_wrap}>
                    <h2 className={styles.chkbox_tit}>에디터 선택</h2>
                    <Checkbox
                        name="editor"
                        options={editors}
                        selectedValues={selectedEditors}
                        onChange={setSelectedEditors}
                    />
                </div>
            </section>

            <section className={styles.post_table}>
                <div className={styles.post_tool}>
                    <div className={styles.search_wrap}>
                        <select>
                            <option value="title">제목</option>
                            <option value="content">글 내용</option>
                        </select>
                        <div className={styles.input_wrap}>
                            <input
                                type="text"
                                placeholder="검색어를 입력하세요"
                            />
                        </div>
                    </div>

                    <div className={styles.page_view_wrap}>
                        <div>총 00개의 게시물 |</div>
                        <div>
                            <label>
                                페이지당 표시:{" "}
                            </label>
                            <select>
                                {[10, 25, 50, 100].map((size) => (
                                    <option key={size} value={size}>{`${size}개`}</option>
                                ))}
                            </select>
                        </div>
                        <a
                            href="admin/uploadPosts"
                            className={styles.btn_post_add}
                        >
                            글 추가하기
                        </a>
                    </div>

                </div>
                <table>
                    <colgroup>
                        <col style={{ width: '50px' }} />
                        <col style={{ width: '200px' }} />
                        <col style={{ width: 'auto' }} />
                        <col style={{ width: '110px' }} />
                        <col style={{ width: '110px' }} />
                        <col style={{ width: '110px' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>내용</th>
                            <th>작성일</th>
                            <th>수정일</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyPost.map(post => (
                            <tr key={post.id}>
                                <td>{post.id}</td>
                                <td><p>{post.title}</p></td>
                                <td><p>{post.content}</p></td>
                                <td>{post.createdAt}</td>
                                <td>{post.updatedAt}</td>
                                <td>
                                    <div className={styles.btn_wrap}>
                                        <button className={styles.btn_blue}>수정</button>
                                        <button className={styles.btn_red}>삭제</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div >
    )
}

export default adminPosts
