import styles from "./page.module.css"
import PostList from '../../components/PostList'

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        메인 페이지
      </div>
      <div className={styles.postlist_wrap}>
        <PostList />
      </div>
    </main>
  );
}
