'use client';

import styles from './Header.module.css'
import { useState } from 'react';
import Link from 'next/link';
import GNB from "./Gnb"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleGNB = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <header className={styles.header_wrap}>
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
