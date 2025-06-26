import styles from './EditorSkeleton.module.css'

export default function EditorSkeleton () {
    return (
        <div className={styles.editor_skeletonWrap}>
            <div className={styles.editor_skeletonHead}></div>
            <div className={styles.skeletonWrap}>
                <div className={styles.editor_skeletonImg}></div>
                <div className={styles.editor_skeletonTxtWrap}>
                    <div className={styles.editor_skeletonLine}></div>
                    <div className={styles.editor_skeletonLine}></div>
                </div>
            </div>
        </div>
    )
}