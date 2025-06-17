'use client';

import styles from './Header.module.css'
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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

  // GNB 열릴 때 스크롤 제어
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // unmount 시에도 원상 복구
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleGNB = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <header className={`${styles.header_wrap} ${show ? styles.show : styles.hide}`}>
      <h1>
        <Link href="/">
          <Image src="/main_logo.png" alt="logo" width={171} height={40} />
        </Link>
      </h1>
      <button
        onClick={toggleGNB}
        className={`${styles.button} ${isOpen ? styles.close : styles.open}`}
      >
        메뉴
        <span></span>
        <span></span>
        <span></span>
      </button>
      <GNB isOpen={isOpen} setIsOpen={setIsOpen} />
    </header>
  );
}
