'use client';

import styles from '../styles/elsa.module.css'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import InputField from "@/components/InputField"
import axios from 'axios';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    setError('');
    
    try {
      // 2) 백엔드 로그인 API 호출
      const res = await axios.post('http://localhost:3001/api/auth/login', form,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );

      // 3) 응답 처리
      if (res.status !== 200) {
        throw new Error(res.data.message || '로그인에 실패했습니다.');
      }

      // 4) 로그인 성공 시 로그인 페이지로 이동
      router.push('/admin/adminPosts');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    }
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