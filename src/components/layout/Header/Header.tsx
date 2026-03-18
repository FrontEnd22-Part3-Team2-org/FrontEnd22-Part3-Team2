/**
 * @file Header.tsx
 * @description 서비스 상단에 고정되는 공통 헤더(GNB) 컴포넌트입니다.
 * 현재 선택된 대시보드의 타이틀, 참여 멤버 프로필 칩, 그리고 내 프로필을 표시합니다.
 * @author []
 * @notes
 * - 접속한 라우트 경로(pathname)에 따라 우측 버튼('관리', '초대하기') 노출 여부가 달라집니다.
 * - 내 정보 및 알림 드롭다운 메뉴 조작을 위해 'use client' 선언이 필요합니다.
 */

'use client';

export default function Header() {
  return (
    <header className="flex items-center justify-between h-full px-10">
      {/* 헤더 왼쪽: 현재 페이지 타이틀 등 (필요 시) */}
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-gray-800">비브리지 👑</h1>
      </div>

      {/* 헤더 오른쪽: 유저 프로필 및 액션 버튼들 */}
      <div className="flex items-center gap-6">
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
            ⚙️ 관리
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
            ➕ 초대하기
          </button>
        </div>

        {/* 구분선 */}
        <div className="w-[1px] h-8 bg-gray-300"></div>

        {/* 유저 프로필 */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-green-500 rounded-full">
            B
          </div>
          <span className="font-medium text-gray-700">배유철</span>
        </div>
      </div>
    </header>
  );
}
