import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import BackToTopButton from "@/components/common/BacktoTopBtn";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className='content_wrapper'>
        <div className='content'>
          {children}
          <BackToTopButton />
        </div>
      </main>
      <Footer />
    </>
  );
}
