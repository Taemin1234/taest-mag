'use client';

import styles from '../styles/elsa.module.css'
import { useState } from 'react';
import Link from 'next/link';
import InputField from "@/components/InputField"

export default function RequestResetPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }
    setError('');
    setSuccess('비밀번호 재설정 링크를 이메일로 보냈습니다.');
    console.log('Reset link requested for:', email);
    // TODO: 백엔드 API 호출하여 재설정 링크 발송
  };

  return (
    <div className={styles.login_box}>
      <h1 className="text-2xl font-bold text-center">비밀번호 찾기</h1>
      <form onSubmit={handleSubmit}>
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}

        <InputField
          id="email"
          name="email"
          type="email"
          label="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className={styles.btn_login}
        >
          재설정 링크 발송
        </button>

        <div className={styles.txt_wrap}>
          <Link href="/auth/login" className="hover:underline">
            로그인
          </Link>
          <Link href="/auth/signup" className="hover:underline">
            회원가입
          </Link>
        </div>
      </form>
    </div>
  );
}