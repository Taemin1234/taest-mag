'use client';

import styles from '../styles/elsa.module.css'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import InputField from "@/components/InputField"

interface LoginError {
  message: string;
  remainingAttempts?: number;
}

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState<LoginError | null>(null);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/auth/login',
        {
          method:'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        }
      );

      let data: any = null;
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        data = await res.json();
      }

      if (!res.ok) {
        const message = data?.message || `로그인 실패 (status: ${res.status})`;
        const remainingAttempts = data?.remainingAttempts;
        const error = new Error(message) as Error & { remainingAttempts?: number };
        if (remainingAttempts !== undefined) error.remainingAttempts = remainingAttempts;
        throw error;
      }
  

      router.push('/ildong');

    } catch (err: any) {
      const errMsg = err.response?.data;
      setError({
        message: errMsg?.message || '로그인 중 오류가 발생했습니다.',
        remainingAttempts: errMsg?.remainingAttempts,
      });
    }
  };

  return (
    <div className={styles.login_box}>
      <h1>에디터 입장</h1>
      <form onSubmit={handleSubmit}>

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

        {error && (
          <>
            <p className={styles.msg_error}>
              {error.message}            
            </p>
            <p className={styles.msg_error}>
              {error.remainingAttempts != null &&
                ` (남은 시도: ${error.remainingAttempts}/5회)`}
            </p>
          </>
        )}
        
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