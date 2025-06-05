'use client';

import styles from './PostBasicList.module.css';
import Link from 'next/link';
import React from 'react';
import { Post } from "@/types"

export default function PostBasicList({posts}: {posts: Post[]}) {
    if (!posts || posts.length === 0) {
        return <p className={styles.noPosts}>게시물이 없습니다.</p>;
      }
   
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