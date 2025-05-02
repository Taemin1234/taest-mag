'use client';

import React from 'react'
import styles from './adminPosts.module.css'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Editor, Option, Post } from "@/types"
import Checkbox from '@/components/ui/Checkbox';
import { CATEGORIES } from '@/constants/categories'
import axios from 'axios';

const AdminPosts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [editorName, setEditorName] = useState<Option[]>([]);
    const [selectedCats, setSelectedCats] = useState<string[]>([]);
    const [selectedEditors, setSelectedEditors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    // 에디터 목록 불러오기
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get<Editor[]>("/api/editors");
                const data = res.data;

                const opts = data.map(editor => ({
                    value: editor.name,      // 예: id를 value로
                    label: editor.name,    // name을 label로
                  }));
                  setEditorName(opts);
            } catch (error) {
                console.log("에디터 로딩 실패: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    
    // API에서 게시글 불러오기
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get("/api/posts");
                setPosts(res.data);
            } catch (error) {
                console.log("게시물 로딩 실패: ", error);
            } finally {
              setIsLoading(false);
            }
          };
      
          fetchPosts();
    }, []);

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
                        options={CATEGORIES}
                        selectedValues={selectedCats}
                        onChange={setSelectedCats}
                    />
                </div>

                <div className={styles.chkbox_wrap}>
                    <h2 className={styles.chkbox_tit}>에디터 선택</h2>
                    <Checkbox
                        name="editor"
                        options={editorName}
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
                        <div>총 {posts.length}개의 게시물 |</div>
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
                        <Link
                            href="/admin/posts/new"
                            className={styles.btn_post_add}
                        >
                            글 추가하기
                        </Link>
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
                        {posts.map(post => (
                            <tr key={post.slug}>
                                <td>{post.postNum}</td>
                                <td><p>{post.title}</p></td>
                                <td><p>{post.content}</p></td>
                                <td>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</td>
                                <td>{new Date(post.updatedAt).toLocaleDateString('ko-KR')}</td>
                                <td>
                                    <div className={styles.btn_wrap}>
                                        <Link href={`/admin/posts/${post.slug}/edit`}>
                                            <button className={styles.btn_blue}>수정</button>
                                        </Link>
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

export default AdminPosts
