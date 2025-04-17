'use client';

import styles from '../../elsa/elsa.module.css'
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import InputField from "@/components/InputField"

export default function ConfirmResetPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') || '';

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 토큰 유효성 체크용 예시
  useEffect(() => {
    if (!token) {
      setError('유효하지 않은 링크입니다.');
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.password || !form.confirmPassword) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setError('');
    setSuccess('비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다.');
    console.log('Reset token:', token, 'New password:', form.password);
    // TODO: 백엔드 API 호출하여 비밀번호 변경
    setTimeout(() => router.push('/auth/login'), 2000);
  };

  return (
    <div className={styles.login_box}>
        <h1>새 비밀번호 설정</h1>
      <form onSubmit={handleSubmit} >

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}

        <InputField
            id="password"
            name="password"
            type="password"
            label="새 비밀번호(6자 이상)"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
        />
        <InputField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="새 비밀번호 확인"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
        />

        <button
          type="submit"
          className={styles.btn_login}
        >
          비밀번호 변경
        </button>
      </form>
    </div>
  );
}