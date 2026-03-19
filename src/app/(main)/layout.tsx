// 이 파일의 모든 내용은 주석 사용 예시를 위함입니다! 편히 수정하셔요

/**
 * @file layout.tsx
 * @description 대시보드(Main) 라우트 그룹의 공통 레이아웃 컴포넌트입니다.
 * 좌측 고정 사이드메뉴(SideMenu)와 상단 헤더(Header)를 포함하며, 우측 하단 영역에 자식 페이지를 렌더링합니다.
 * @author
 * * @notes
 * - 전체 화면을 꽉 채우는 구조(h-screen)입니다.
 * - 모바일 환경에서는 사이드메뉴가 숨겨지도록 반응형 처리가 되어 있습니다.
 */

// import Header from '@/components/layout/Header';
// ...

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="main-layout-container flex">
      {/* 임시 사이드바 틀 */}
      <aside className="w-64 bg-gray-100">임시 사이드바</aside>

      <div className="flex flex-col flex-1">
        {/* 임시 헤더 틀 */}
        <header className="h-16 bg-white border-b">임시 헤더</header>

        {/* 실제 페이지 내용이 들어갈 자리 */}
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
