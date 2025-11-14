'use client';

import styles from '../styles/elsa.module.css'
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InputField from "@/components/InputField"

interface SignUpForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpPage() {
  const [form, setForm] = useState<SignUpForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 비밀번호 확인
    if (form.password !== form.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    // 필수 입력 확인
    if (!form.username || !form.email || !form.password) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    setError('');

    try {
      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
      };


      // 2) 백엔드 회원가입 API 호출
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // 3) 응답 처리
      let data: any = null;
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        data = await res.json();
      }

      if (!res.ok) {
        const message = data?.message || `회원가입 실패 (status: ${res.status})`;
        const remainingAttempts = data?.remainingAttempts;
        const fullMessage = remainingAttempts !== undefined
          ? `${message} (남은 시도: ${remainingAttempts})`
          : message;
        setError(fullMessage);
        return;
      }

      // 4) 회원가입 성공 시 로그인 페이지로 이동
      router.push('/snowman/elsa');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    }
  };


  return (
    <div className={styles.login_box}>
      <h1>회원가입</h1>
      <form
        onSubmit={handleSubmit}
      >

        {error && (
          <p>{error}</p>
        )}

        <InputField
          id="username"
          name="username"
          type='string'
          label="아이디 (4자 이상 30자 이하)"
          value={form.username}
          onChange={handleChange}
          required
          minLength={4}
          maxLength={30}
        />
        <InputField
          id="email"
          name="email"
          type="email"
          label="이메일"
          value={form.email}
          onChange={handleChange}
          required
        />

        <InputField
          id="password"
          name="password"
          type="password"
          label="비밀번호(6자 이상)"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
        />

        <InputField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="비밀번호 확인"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          minLength={6}
        />

        <button
          type="submit"
          className={styles.btn_login}
        >
          가입하기
        </button>

        <p className={styles.txt_wrap}>
          이미 계정이 있으신가요?{' '}
          <Link href="/snowman/elsa" className={styles.txt1}>
            로그인
          </Link>
        </p>
      </form>
    </div>
  );
}