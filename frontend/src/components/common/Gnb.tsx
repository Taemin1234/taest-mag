'use client'

import styles from './Gnb.module.css'
import Link from 'next/link';
import { useState } from 'react';
import { CATEGORIES } from '@/constants/categories';

export default function GNB({ isOpen }: { isOpen: boolean }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  if (!isOpen) return null;

  const handleClick = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <nav className={styles.gnb_wrap}>
      <ul className={styles.depth1}>
        {CATEGORIES.map((category, index) => (
          <li key={category.value} className={activeIndex === index ? styles.active : ''}>
            <span onClick={() => handleClick(index)}>{category.label}</span>
            <ul className={styles.depth2}>
              <li>
                <Link href={`/category/${category.value}`}>전체</Link>
              </li>
              {category.subCategories?.map(sub => (
                <li key={sub.value}>
                  <Link href={`/category/${category.value}/${sub.value}`}>{sub.label}</Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
        <li>
          <Link href="/category/aboutus">
            About Us
          </Link>
        </li>
      </ul>
    </nav>
  );
}
