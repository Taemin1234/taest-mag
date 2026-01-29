import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import BackToTopButton from "@/components/common/BacktoTopBtn";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  other: {
    rel: 'preconnect',
    url: 'https://res.cloudinary.com',
  },
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='content_layout'>
      <Header />
      <main className='content_wrapper'>
        <div className='content'>
          {children}
          <BackToTopButton />
        </div>
      </main>
      <Footer />
    </div>
  );
}
