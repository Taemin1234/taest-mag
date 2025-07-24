'use client'

import styles from './Gnb.module.css'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { CATEGORIES } from '@/constants/categories'

export default function GNB({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (open: boolean) => void }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const itemRef = useRef<HTMLLIElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // Measure one item to compute step and container height
  useEffect(() => {
    if (itemRef.current && listRef.current) {
      const h = itemRef.current.offsetHeight
      const s = h / 2
      setStep(s)
      // 총 높이 = 맨 앞 full + (n-1)*step
      listRef.current.style.height = `${h + (CATEGORIES.length - 1) * s}px`
    }
  }, [])

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
      <ul ref={listRef} className={styles.depth1}>
        {CATEGORIES.map((cat, i) => (
          <li
            key={cat.value}
            ref={i === 0 ? itemRef : null}
            className={i === activeIndex ? styles.active : ''}
            onClick={() => handleClick(i)}
            style={{
              transform: `translateY(${i === activeIndex ? (i - 1) * step : i * step}px)`
            }}
          >
            <span className={styles.label}>{cat.label}</span>
            <ul className={styles.depth2}>
              <li>
                <Link href={`/category/${cat.value}`} onClick={handleLinkClick}>전체</Link>
              </li>
              {cat.subCategories?.map(sub => (
                <li key={sub.value}>
                  <Link
                    href={`/category/${cat.value}/${sub.value}`}
                    onClick={handleLinkClick}
                  >
                    {sub.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
        <li className={styles.about}>
          <Link href="/category/aboutus" onClick={handleLinkClick}>About Us</Link>
        </li>
      </ul>
    </nav>
  )
}