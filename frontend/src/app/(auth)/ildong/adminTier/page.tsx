'use client';

import styles from './adminTier.module.css'
import { useState, useEffect } from 'react'
import { Users, Role } from '@/types'

export default function AdminTier() {
  const [users, setUsers] = useState<Users[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, Role>>({});
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const ac = new AbortController();

    const fetchUsers = async () => {
      try {
        // API가 Users[] 형태로 반환한다고 가정
        const res = await fetch('/api/user', {
          method: 'GET',
          credentials: 'include',
          signal: ac.signal,
        })

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data:Users[] = await res.json();
        setUsers(data)  // 배열 전체를 상태에 저장

        const init: Record<string, Role> = {};
        data.forEach(u => { init[u.email] = u.role as Role });
        setSelectedRoles(init);
      } catch (error: any) {
        if (error?.name === 'AbortError') return; 
        console.error('유저 로딩 실패:', error);
      }
    }
    fetchUsers()
  }, [])

  // 롤 변경
  const handleRoleSelectChange = (email: string, newRole: Role) => {
    setSelectedRoles(prev => ({ ...prev, [email]: newRole }));
  };

  // 변경된 롤 반영
  const handleRoleSubmit = async (email: string) => {
    const newRole = selectedRoles[email];
    setLoading(true);
    try {
      const res = await fetch('/api/user/role', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, role: newRole }),
      });

      if (!res.ok) {
        const { message } =
          (await res.json().catch(() => ({ message: `HTTP ${res.status}` })));
        throw new Error(message);
      }

      // 로컬 users 상태도 업데이트
      setUsers(prev =>
        prev.map(u =>
          u.email === email ? { ...u, role: newRole } : u
        )
      );
    } catch (err) {
      console.error('티어 업데이트 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTier = users.filter(u => u.role !== "superman")

  return (
    <div>
      <h1>티어 업그레이드</h1>
      {loading && <p>업데이트 중…</p>}
      <table className={styles.table_wrap}>
        <thead>
          <tr>
            <th>이메일</th>
            <th>아이디</th>
            <th>현재 티어</th>
            <th>마지막 로그인</th>
            <th>티어 변경</th>
            <th>확인</th>
          </tr>
        </thead>
        <tbody>
          {filteredTier.map((user) => (
            <tr key={user.email}>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{new Date(user.lastLoginAttempt).toLocaleString()}</td>
              <td>
                <select
                  value={user.role}
                  onChange={e =>
                    handleRoleSelectChange(user.email, e.target.value as Role)
                  }
                  disabled={loading}
                >
                  <option value="human">human</option>
                  <option value="ironman">ironman</option>
                </select>
              </td>
              <td>
                <button className={styles.button} onClick={() => handleRoleSubmit(user.email)}>
                    변경하기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
