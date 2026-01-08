import styles from './loading.module.css'

export default function Loading() {
  return (
    <div className={styles.loading_container}>
      <div className={styles.loading_content}>
        <div className={styles.loading_spinner} />
        <p className={styles.loading_text}>로딩 중입니다...</p>
      </div>
    </div>
  );
}
