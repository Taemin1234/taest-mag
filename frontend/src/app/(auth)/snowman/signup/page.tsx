'use client';

import styles from '../elsa/elsa.module.css'
import { useState } from 'react';
import Link from 'next/link';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    // TODO: 백엔드 회원가입 API 연결 준비
    // 예: await fetch('/api/auth/signup', { method: 'POST', body: JSON.stringify(form) });
    console.log('Signup data:', {
      username: form.username,
      email: form.email,
      password: form.password,
    });
  };


  return (
    <div className={styles.login_box}>
      <h1>회원가입</h1>
      <form
        onSubmit={handleSubmit}
      >
        
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
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

        <p  className={styles.txt_wrap}>
          이미 계정이 있으신가요?{' '}
          <Link href="/snowman/elsa" className={styles.txt1}>
            로그인
          </Link>
        </p>
      </form>
    </div>
  );
}