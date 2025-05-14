import styles from './adminMain.module.css'
import Link from 'next/link';

export default function AdminMain() {

    const adminList = [
        {
            title : '에디터 관리',
            href : '/admin/adminEditor'
        },
        {
            title : '아티클 관리',
            href : '/admin/adminPosts'
        },
    ]

    return (
        <div className={styles.adminMain}>
            <ul>
                {adminList.map((li) => (
                    <li key={li.title}>
                       <Link href={li.href}>
                        {li.title}
                       </Link>
                    </li>
                    )
                )}
            </ul>
        </div>
    )
}