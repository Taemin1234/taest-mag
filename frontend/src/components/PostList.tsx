'use client';

import styles from './PostList.module.css';
import Link from 'next/link';

export default function PostList()  {
    type Post = {
        id: string;
        title: string;
        date: string;
        summary: string;
        category: string;
    };
      
      const dummyPosts: Post[] = [
        {
          id: "25162",
          title: "내가 사랑한 히사이시조 노래",
          date: "2025.01.01",
          summary: "Lorem Ipsum is simply dummy text of the printing...",
          category: "Food",
        },
        {
            id: "25163",
            title: "내가 혐오한 히사이시조 노래",
            date: "2025.01.01",
            summary: "Lorem Ipsum is simply dummy text of the printing...",
            category: "Food",
          },
      ];

    return (
        <div>
           {dummyPosts.map((post) => (
                <Link href={`/post/${post.id}`} key={post.id}>
                    <div className={styles.post_list}>
                        <div className="flex justify-between">
                            <p className="text-sm text-gray-500">{post.category}</p>
                            <p className="text-sm text-gray-500">{post.date}</p>
                        </div>
                        <p className="mt-2 font-semibold">{post.title}</p>
                        <p className="text-sm text-gray-600">{post.summary}</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}