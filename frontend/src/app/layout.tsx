import "./globals.css";
import localFont from 'next/font/local'

const myFont = localFont({
  src: [
    { path: './fonts/Pretendard-Light.woff2', weight: '400', style: 'normal' },
    { path: './fonts/Pretendard-Regular.woff2', weight: '500', style: 'normal' },
    { path: './fonts/Pretendard-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-pretendard',
})

export const metadata = {
  title: "테이스트 매거진",
  description: "심도보단 감도, 트렌드보단 당신의 결. 취향을 수집하는 매거진",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={myFont.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}