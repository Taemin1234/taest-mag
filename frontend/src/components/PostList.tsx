'use client';

import styles from './PostList.module.css';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Post } from "@/types"
import { fetchPosts } from '@/lib/api'

export default function PostList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    return (
        <ul className={styles.postlist_wrap}>
            {posts.map((post) => (
                <li key={post.slug}>
                    <Link href={`/post/${post.id}`} >
                        <div className={styles.post_list}>
                            <div className="flex justify-between">
                                <p className="text-sm text-gray-500">{post.category}</p>
                                <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString('ko-KR')}</p>
                            </div>
                            <p className="mt-2 font-semibold">{post.title}</p>
                            <p className="text-sm text-gray-600">{post.subtitle}</p>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    )
}