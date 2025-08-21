'use client'

import styles from './Gnb.module.css'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { CATEGORIES } from '@/constants/categories'

export default function GNB({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (open: boolean) => void }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState<Boolean>(false)

  const activeCategory =
    activeIndex !== null && activeIndex >= 0 && activeIndex < CATEGORIES.length
      ? CATEGORIES[activeIndex]
      : null

  useEffect(() => {
    if (activeCategory?.value) {
      setIsAnimating(true)
    }
  }, [activeCategory?.value])

  if (!isOpen) return null

  const handleClick = (index: number) => {
    setActiveIndex(prev => (prev === index ? null : index))
  }

  const handleLinkClick = () => {
    setIsOpen(false)
    setActiveIndex(null)
  }

  return (
    <nav className={styles.gnb_wrap} role="dialog" aria-modal="true">
      <div className={styles.panel}>
        <aside className={styles.left}>
          <ul className={styles.mainList}>
            {CATEGORIES.map((cat, i) => (
              <li key={cat.value} className={i === activeIndex ? styles.active : ''}>
                <button type="button" className={styles.mainButton} onClick={() => handleClick(i)}>
                  <span className={styles.mainLabel}>{cat.label}</span>
                </button>
              </li>
            ))}
            <li className={styles.about}>
              <Link href="/category/aboutus" onClick={handleLinkClick}>About Us</Link>
            </li>
          </ul>
        </aside>
        <section className={styles.right} aria-live="polite">
          {activeCategory ? (
            <ul key={`${activeCategory.value}`} className={`${styles.subList} ${isAnimating ? styles.animate : ''}`} onAnimationEnd={() => setIsAnimating(false)} >
              <li>
                <Link href={`/category/${activeCategory.value}`} onClick={handleLinkClick}>전체</Link>
              </li>
              {activeCategory.subCategories?.map(sub => (
                <li key={sub.value}>
                  <Link
                    href={`/category/${activeCategory.value}/${sub.value}`}
                    onClick={handleLinkClick}
                  >
                    {sub.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.placeholder}>taest magazine</div>
          )}
        </section>
      </div>
    </nav>
  )
}