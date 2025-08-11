'use client';

import styles from './adminPosts.module.css'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Editor, Option, Post } from "@/types"
import Checkbox from '@/components/ui/Checkbox';
import TypeSearchbar from '@/components/ui/TypeSearchbar'
import { CATEGORIES } from '@/constants/categories'
import { fetchEditors, fetchPosts } from '@/lib/api'

const AdminPosts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [editorName, setEditorName] = useState<Option[]>([]);
    const [selectedCats, setSelectedCats] = useState<string[]>([]);
    const [selectedEditors, setSelectedEditors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 페이지네이션
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // 검색
    const [searchType, setSearchType] = useState<'title' | 'content'>('title');
    const [searchQuery, setSearchQuery] = useState('');


    // 에디터 목록 불러오기
    useEffect(() => {
        setIsLoading(true)
        fetchEditors()
        .then((data: Editor[]) => {
            const opts: Option[] = data.map((editor) => ({
            value: editor.name,
            label: editor.name,
            }))
            setEditorName(opts)
        })
        .catch((err) => {
            console.error('에디터 로딩 실패:', err)
        })
        .finally(() => {
            setIsLoading(false)
        })
    }, []);


    // 게시글 불러오기
    useEffect(() => {
        setIsLoading(true)
        fetchPosts()
        .then((data: Post[]) => {
            setPosts(data)
        })
        .catch((err) => {
            console.error('게시물 로딩 실패:', err)
        })
        .finally(() => {
            setIsLoading(false)
        })
    }, []);

    // 삭제 이벤트
    const handleDelete = async (slug: string) => {
        if (!window.confirm('삭제하시겠어요? 돌이킬수 없습니다?')) return;
        try {
            const res = await fetch(`/api/posts/${slug}`, {
                method: 'DELETE',
                credentials: 'include',
            })
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
            setPosts(prev =>
                prev.filter(posts => posts.slug !== slug)
            );
        } catch (error) {
            console.error('삭제 실패:', error);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    // 필터링 로직
    const filtered = posts.filter(post => {
        const okCat = selectedCats.length === 0 || selectedCats.includes(post.category);
        const okEditor = selectedEditors.length === 0 || selectedEditors.includes(post.editor);
        const text = (searchType === 'title'
            ? post.title
            : post.content
        ).toLowerCase();
        const okSearch = searchQuery.trim() === ''
            || text.includes(searchQuery.trim().toLowerCase());
        return okCat && okEditor && okSearch;
    });

    ///////////////////////////////////////
    // 페이지 네이션

    // 한 그룹에 몇 개의 페이지 번호를 보여줄지
    const groupSize = 10;
    // 현재 페이지가 속한 그룹 인덱스 (0부터)
    const currentGroup = Math.floor((currentPage - 1) / groupSize);

    // 전체 페이지 개수
    const totalPages = Math.ceil(filtered.length / pageSize);

    // 이 그룹의 시작/끝 페이지 번호
    const startPage = currentGroup * groupSize + 1;
    const endPage = Math.min(startPage + groupSize - 1, totalPages);

    // 페이지 번호 배열
    const pageNumbers = [];
    for (let p = startPage; p <= endPage; p++) {
        pageNumbers.push(p);
    }

    // 현재 페이지에 보일 게시물
    const startIdx = (currentPage - 1) * pageSize;
    const currentPosts = filtered.slice(startIdx, startIdx + pageSize);

    // 페이지 당 항목 수 조정 함수
    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1); // 페이지 사이즈 변경 시 1페이지로 리셋
    };


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
                    <TypeSearchbar
                        searchType={searchType}
                        onSearchTypeChange={setSearchType}
                        query={searchQuery}
                        onQueryChange={setSearchQuery}
                    />

                    <div className={styles.page_view_wrap}>
                        <div>총 {filtered.length}개의 게시물 |</div>
                        <div>
                            <label>
                                페이지당 표시:{" "}
                            </label>
                            <select value={pageSize} onChange={handlePageSizeChange}>
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
                        <col style={{ width: '60px' }} />
                        <col style={{ width: '50px' }} />
                        <col style={{ width: '110px' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>내용</th>
                            <th>작성일</th>
                            <th>수정일</th>
                            <th>조회수</th>
                            <th>특별호</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.map(post => (
                            <tr key={post.slug}>
                                <td>{post.postNum}</td>
                                <td><p>{post.title}</p></td>
                                <td><p>{post.content}</p></td>
                                <td>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</td>
                                <td>{new Date(post.updatedAt).toLocaleDateString('ko-KR')}</td>
                                <td>{post.views}</td>
                                <td>{post.isFeatured ? 'O' : 'X'}</td>
                                <td>
                                    <div className={styles.btn_wrap}>
                                        <Link href={`/admin/posts/${post.slug}/edit`}>
                                            <button className={styles.btn_blue}>수정</button>
                                        </Link>
                                        <button className={styles.btn_red} onClick={() => handleDelete(post.slug)}>삭제</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <nav className={styles.pagination_wrap}>
                    <button
                        onClick={() => setCurrentPage(startPage - 1)}
                        disabled={startPage === 1}
                    >
                        &lt;
                    </button>

                    {pageNumbers.map(p => (
                        <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            disabled={p === currentPage}
                        >
                            {p}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(endPage + 1)}
                        disabled={endPage === totalPages}
                    >
                        &gt;
                    </button>
                </nav>
            </section>
        </div >
    )
}

export default AdminPosts
