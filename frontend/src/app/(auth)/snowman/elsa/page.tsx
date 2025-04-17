'use client';

import styles from './elsa.module.css'
import { useState } from 'react';
import Link from 'next/link';
import InputField from "@/components/InputField"

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI-only: 백엔드 연동 제외
    if (!form.username || !form.password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    setError('');
    // 로그인 처리 로직 placeholder
  };

  return (
    <div className={styles.login_box}>
      <h1>에디터 입장</h1>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <InputField
          id="username"
          name="username"
          label="아이디"
          type='string'
          value={form.username}
          onChange={handleChange}
          required
        />

        <InputField
          id="password"
          name="password"
          type="password"
          label="비밀번호"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
        />
        
        <button
          type="submit"
          className={styles.btn_login}
        >
          로그인
        </button>

        <div className={styles.txt_wrap}>
          <Link href="/snowman/reset-password" className={styles.txt1}>
            비밀번호 찾기
          </Link>
          <Link href="/snowman/signup" className={styles.txt1}>
            회원가입
          </Link>
        </div>
      </form>
    </div>
  );
}