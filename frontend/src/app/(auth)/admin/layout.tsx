import AdminHeader from "@/components/common/AdminHeader"
import styles from './layout.module.css'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <>
      <AdminHeader />
      <div className={styles.admin_main}>
        {children}
      </div>
    </>
  )
}
