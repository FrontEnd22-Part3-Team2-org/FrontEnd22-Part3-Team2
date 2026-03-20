/**
 * @file 서비스 랜딩 페이지 ( / )
 * @description Taskify 서비스에 처음 접속했을 때 보이는 소개 화면입니다.
 * @note 비로그인 유저도 접근할 수 있어야 하며, 서비스의 장점을 어필하는 UI 위주로 구성됩니다.
 */

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Link
        href="/login"
        className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
      >
        로그인
      </Link>
    </div>
  );
}
