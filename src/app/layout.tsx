/**
 * @file 전역 레이아웃 (Root Layout)
 * @description 애플리케이션 전체에 공통으로 적용되는 레이아웃입니다.
 * @note 전역 스타일, 공통 폰트, 상태 관리 Provider(React Query 등)가 세팅되는 곳입니다.
 */

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import QueryProvider from '@/lib/QueryProvider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Taskify',
    template: '%s | Taskify', // 하위 페이지에서 적용되는 템플릿 (e.g. "로그인 | Taskify ")
  },
  description: '새로운 일정관리, Taskify',
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    images: '/og-image.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
