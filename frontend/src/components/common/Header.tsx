'use client';

import styles from './Header.module.css'
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import GNB from "./Gnb"
import throttle from 'lodash/throttle';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        setShow(true);
      } else if (currentScrollY > lastScrollYRef.current) {
        setShow(false);
      } else {
        setShow(true);
      }

      lastScrollYRef.current = currentScrollY;
    }, 100); // 100ms 동안 쓰로틀 적용

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleGNB = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <header className={`${styles.header_wrap} ${show ? styles.show : styles.hide}`}>
      <h1 className="">
        <Link href="/">ta(e)st 매거진</Link>
        </h1>
      <button
        onClick={toggleGNB}
        className={styles.button}
      >
        메뉴
      </button>
      <GNB isOpen={isOpen} />
    </header>
  );
}
