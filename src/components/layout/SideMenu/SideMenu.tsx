/**
 * @file SideMenu.tsx
 * @description 서비스 좌측에 고정되는 네비게이션 사이드바 컴포넌트입니다.
 * 내 대시보드 목록을 보여주고, 현재 위치한 페이지의 탭을 하이라이트 처리합니다.
 * * @author []
 * @notes
 * - 현재 경로(pathname)를 감지하기 위해 'use client'가 선언되어 있습니다.
 * - 대시보드 목록 데이터는 향후 API 연동 시 상태 관리가 필요합니다.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SideMenu() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col h-full px-6 py-5">
      {/* 서비스 로고 영역 */}
      <div className="mb-10 text-2xl font-bold text-violet-5534DA">
        <Link href="/mydashboard">Taskify</Link>
      </div>

      {/* 대시보드 목록 영역 */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-gray-500">Dash Boards</span>
        <button className="text-gray-400 hover:text-gray-700">+</button>
      </div>

      {/* 사이드바 메뉴 리스트 */}
      <ul className="flex flex-col gap-2">
        <li
          className={`p-3 rounded-md ${pathname === '/dashboard/1' ? 'bg-violet-F1EFFD' : 'hover:bg-gray-100'}`}
        >
          <Link href="/dashboard/1" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-gray-700 font-medium">비브리지 👑</span>
          </Link>
        </li>
        {/* ... 다른 대시보드 항목들 ... */}
      </ul>
    </aside>
  );
}
