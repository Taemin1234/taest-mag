import AdminHeader from "@/components/common/AdminHeader"
import styles from './layout.module.css'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  let role: string;

  try {
    const payload = jwt.verify(token || '', process.env.JWT_SECRET!);
    // @ts-ignore
    role = payload.role;
  } catch {
    redirect('/login');
  }

  if (role === 'human') {
    return (
      <div>
        <h2>접근 권한이 없습니다</h2>
        <p>관리자에게 문의해주세요.</p>
      </div>
    );
  }

  return (
    <>
      <AdminHeader />
      <div className={styles.admin_main}>
        {children}
      </div>
    </>
  )
}
