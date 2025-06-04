'use client'

import styles from './Gnb.module.css'
import Link from 'next/link';
import { useState } from 'react';

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
        <li className={activeIndex === 0 ? styles.active : ''}>
          <span onClick={() => handleClick(0)}>FOOD</span>
          <ul className={styles.depth2}>
            <li>
              <Link href="/category/food">전체</Link>
            </li>
            <li>
              <Link href="/category/food/drink">술</Link>
            </li>
            <li>
              <Link href="/category/food/restaurant">식당</Link>
            </li>
          </ul>
        </li>
        <li className={activeIndex === 1 ? styles.active : ''}>
          <span onClick={() => handleClick(1)}>CULTURE</span>
          <ul className={styles.depth2}>
            <li>
              <Link href="/category/culture">전체</Link>
            </li>
            <li>
              <Link href="/category/culture/music">음악</Link>
            </li>
            <li>
              <Link href="/category/culture/movie">영화/드라마</Link>
            </li>
          </ul>
        </li>
        <li className={activeIndex === 2 ? styles.active : ''}>
          <span onClick={() => handleClick(2)}>TECH</span>
          <ul className={styles.depth2}>
            <li>
              <Link href="/category/tech">전체</Link>
            </li>
            <li>
              <Link href="/category/tech/review">리뷰</Link>
            </li>
            <li>
              <Link href="/category/tech/tech-etc">기타</Link>
            </li>
          </ul>
        </li>
        <li className={activeIndex === 3 ? styles.active : ''}>
          <span onClick={() => handleClick(3)}>LIVING</span>
          <ul className={styles.depth2}>
            <li>
              <Link href="/category/living">전체</Link>
            </li>
            <li>
              <Link href="/category/living/interior">인테리어</Link>
            </li>
            <li>
              <Link href="/category/living/honey-tip">꿀팁</Link>
            </li>
          </ul>
        </li>
        <li className={activeIndex === 4 ? styles.active : ''}>
          <span onClick={() => handleClick(4)}>PEOPLE</span>
          <ul className={styles.depth2}>
            <li>
              <Link href="/category/people">전체</Link>
            </li>
            <li>
              <Link href="/category/people/human">소개</Link>
            </li>
            <li>
              <Link href="/category/people/interview">인터뷰</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link href="/category/aboutus">
            About Us
          </Link>
        </li>
      </ul>
    </nav>
  );
}
