import styles from './PostList.module.css';
import Link from 'next/link';
import React from 'react';
import { Post } from "@/types"

interface PostBasicListProps {
    posts: Post[];
    variant?: 'main' | 'sub';
}

export default function PostList({ posts, variant = 'sub', }: PostBasicListProps) {
    if (!posts || posts.length === 0) {
        return <p className={styles.noPosts}>게시물이 없습니다.</p>;
    }

    const containerClassName = `
        ${styles.postlist_wrap}
        ${styles[`variant_${variant}`] || ''}`.trim();

    return (
        <ul className={containerClassName}>
            {posts.map((post) => (
                <li key={post.slug}>
                    <Link href={`/post/${post.slug}`} >
                        <img src={post.thumbnailUrl} alt={post.title} className={styles.post_thumbnail} />
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