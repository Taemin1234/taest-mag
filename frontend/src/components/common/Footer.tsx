import Link from 'next/link';
import styles from './Footer.module.css';
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.group}>
          <div className={styles.titleGroup}>
            <p className={styles.title}>심도 얕은, 감도 높은</p>
            <p className={styles.title}>모든 이들의 취향을 위한 매거진</p>
          </div>

          <div className={styles.divider}>
            <div className={styles.bottom}>
              <div className={styles.copy}>
                © 2025 TA(e)ST Magazine. All rights reserved.
              </div>
                <nav className={styles.socialNav}>
                    <Link
                        href="mailto:contact@taest.co.kr"
                        className={styles.emailLink}
                    >
                        contact@taest.co.kr
                    </Link>

                    <Link
                        href="https://instagram.com/taest_magazine"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.instagramButton}
                    >
                        <Image src={'/Instagram.svg'} alt='인스타그램 로고' width={16} height={16} />
                        인스타그램
                    </Link>
                </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
