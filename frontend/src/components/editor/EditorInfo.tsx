import Image from 'next/image'
import { Editor } from '@/types'
import Link from 'next/link';
import styles from './EditorInfo.module.css'

export const EditorInfo = ({ editor }: { editor: Editor }) => {
    return (
        <div className={styles.editorInfo}>
            <p className={styles.editorInfo_editor}>
                Edit by <Link href={`/editor/${editor.name}`} className={styles.editor_name}>{editor.name}</Link>
            </p>
            <div className={styles.editorInfo_info}>
                <Image
                    src={editor.imageUrl || '/default-thumb.png'}
                    alt="에디터"
                    width={100}
                    height={100}
                    priority
                    style={{ width: 'auto', height: 'auto' }}
                />
                <p className={styles.editorInfo_des}>{editor.tagline}</p>
            </div>
        </div>
    )
}