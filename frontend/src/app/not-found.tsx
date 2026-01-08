import Link from 'next/link';
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <div className={styles.not_found_container}>
      <h1 className={styles.not_found_title}>404 - 페이지를 찾을 수 없습니다</h1>
      <p className={styles.not_found_description}>
        요청하신 페이지가 존재하지 않거나, 삭제되었을 수 있어요.
      </p>
      <Link href="/" className={styles.not_found_link}>
        홈으로 돌아가기
      </Link>
    </div>
  );
}
