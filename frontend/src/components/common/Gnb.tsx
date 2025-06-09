'use client'

import styles from './Gnb.module.css'
import Link from 'next/link';
import { useState } from 'react';
import { CATEGORIES } from '@/constants/categories';

export default function GNB({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleClick = (index: number) => {
    setActiveIndex(prev => (prev === index ? null : index));
  };

  const handleLinkClick = () => {
    setIsOpen(false);  // 메뉴 닫기
    setActiveIndex(null);
  };

  return (
    <nav className={styles.gnb_wrap}>
      <ul className={styles.depth1}>
        {CATEGORIES.map((category, index) => (
          <li key={category.value} onClick={() => handleClick(index)} className={activeIndex === index ? styles.active : ''}>
            <span>{category.label}</span>
            <ul className={styles.depth2}>
              <li>
                <Link href={`/category/${category.value}`} onClick={handleLinkClick}>전체</Link>
              </li>
              {category.subCategories?.map(sub => (
                <li key={sub.value}>
                  <Link href={`/category/${category.value}/${sub.value}`} onClick={handleLinkClick}>{sub.label}</Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
        <li>
          <Link href="/category/aboutus" onClick={handleLinkClick}>
            About Us
          </Link>
        </li>
      </ul>
    </nav>
  );
}
