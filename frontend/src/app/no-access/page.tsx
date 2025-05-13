import styles from './page.module.css'
import Image from 'next/image';

export default function noAccess() {
    return (
        <div className={styles.noAccess}>
            <Image
                        src={'/main_logo.png'}
                        alt={'테이스트 매거진 로고'}
                        width={310}
                        height={160}
                        className={styles.img}
                    />
            <p className={styles.noti}>관리자에게 문의해주세요!</p>
        </div>
    )
}