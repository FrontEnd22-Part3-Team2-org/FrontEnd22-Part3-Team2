/**
 * @file layout.tsx
 * @description 대시보드(Main) 라우트 그룹의 공통 레이아웃 컴포넌트입니다.
 * 좌측 고정 사이드메뉴(SideMenu)와 상단 헤더(Header)를 포함하며,
 * 우측 하단 영역에 자식 페이지(children)를 렌더링합니다.
 * * @author []
 * @notes
 * - 전체 화면을 꽉 채우는 구조(h-screen)입니다.
 * - 모바일 환경에서는 사이드메뉴가 숨겨지도록 반응형 처리가 되어 있습니다.
 */

import Header from '@/components/layout/Header';
import SideMenu from '@/components/layout/SideMenu';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 전체 화면을 꽉 채우고(h-screen) 가로로 배치(flex)
    <div className="flex h-screen w-full bg-[#FAFAFA]">
      {/* 왼쪽 사이드메뉴 고정 영역 */}
      <div className="hidden md:block w-[300px] border-r border-gray-200 bg-white shrink-0">
        <SideMenu />
      </div>

      {/* 오른쪽 영역 (헤더 + 메인 컨텐츠) */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* 상단 헤더 영역 */}
        <div className="h-[70px] border-b border-gray-200 bg-white shrink-0">
          <Header />
        </div>

        {/* 실제 페이지 내용이 들어갈 하단 영역 (스크롤 가능) */}
        <main className="flex-1 overflow-auto p-10">
          {children} {/* /mydashboard, /mypage 등이 렌더링되는 곳 */}
        </main>
      </div>
    </div>
  );
}
