'use client';

/**
 * @file SideMenu.tsx
 * @description 서비스 좌측에 고정되는 네비게이션 사이드바 컴포넌트입니다.
 * 대시보드 목록을 보여주고, 현재 위치에 따라 활성 항목을 하이라이트 처리합니다.
 * @author 하늘
 * @notes
 * - 반응형 3단계: 데스크탑(xl, 300px) / 태블릿(md, 160px) / 모바일(67px)
 * - 15개 초과 시 하단 페이지네이션으로 목록이 나뉩니다.
 * - 현재 pathname 감지를 위해 'use client'가 선언되어 있습니다.
 */

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AddBoxIcon from '@/components/common/Icon/AddBoxIcon';
import CrownIcon from '@/components/common/Icon/CrownIcon';
import Pagination from '@/components/common/Pagination/Pagination';
import Logo from '@/components/common/Logo';
import { cn } from '@/lib/utils';

interface Dashboard {
  id: number;
  /** 대시보드 이름 */
  title: string;
  /** 컬러칩과 매핑된 hex 코드 색상값 */
  color: string;
  /** 내가 만든 대시보드 여부 (true면 왕관 아이콘 표시) */
  createdByMe: boolean;
}

// TODO: [하늘] API 연동 후 props 혹은 커스텀 훅으로 변경
const MOCK_DASHBOARDS: Dashboard[] = [
  { id: 1, title: '비브리지', color: '#7AC555', createdByMe: true },
  { id: 2, title: '코드잇', color: '#760DDE', createdByMe: true },
  { id: 3, title: '3분기 계획', color: '#FFA500', createdByMe: false },
  { id: 4, title: '회의록', color: '#76A5EA', createdByMe: false },
  { id: 5, title: '중요 문서함', color: '#E876EA', createdByMe: false },
  { id: 6, title: '비브리지', color: '#7AC555', createdByMe: true },
  { id: 7, title: '코드잇', color: '#760DDE', createdByMe: true },
  { id: 8, title: '3분기 계획', color: '#FFA500', createdByMe: false },
  { id: 9, title: '회의록', color: '#76A5EA', createdByMe: false },
  { id: 10, title: '중요 문서함', color: '#E876EA', createdByMe: false },
  { id: 11, title: '회의록', color: '#76A5EA', createdByMe: false },
  { id: 12, title: '비브리지', color: '#7AC555', createdByMe: true },
  { id: 13, title: '코드잇', color: '#760DDE', createdByMe: true },
  { id: 14, title: '3분기 계획', color: '#FFA500', createdByMe: false },
  { id: 15, title: '회의록', color: '#76A5EA', createdByMe: false },
  { id: 16, title: '중요 문서함', color: '#E876EA', createdByMe: false },
];

const PAGE_SIZE = 15;

// 메인 컴포넌트

const SideMenu = () => {
  const pathname = usePathname();
  const [page, setPage] = useState(1);

  const totalCount = MOCK_DASHBOARDS.length;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const pagedDashboards = MOCK_DASHBOARDS.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const handlePrevPage = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNextPage = () =>
    setPage((prev) => Math.min(totalPages, prev + 1));

  return (
    <aside
      className={cn(
        'flex flex-col shrink-0 bg-white border-r border-gray-200 min-h-screen',
        'w-[67px] md:w-[160px] xl:w-[300px]',
      )}
    >
      {/* ── 로고 ── */}
      <Link
        href="/"
        className="flex items-center shrink-0 pt-5 pl-[22px] md:pt-5 md:pl-[13px] xl:pl-2 mb-[39px] md:mb-[57px] xl:mb-14"
      >
        <span className="md:hidden">
          <Logo variant="small" />
        </span>
        <span className="hidden md:block">
          <Logo variant="large" />
        </span>
      </Link>

      {/* ── Dash Boards 영역 ── */}
      <div className="flex items-center justify-between shrink-0 pl-6 pr-[14px] md:pl-[13px] md:pr-[13px] xl:pl-2 xl:pr-3 mb-[18px] md:mb-4">
        <span className="hidden md:block text-xs-semibold text-gray-500">
          Dash Boards
        </span>
        {/* NOTE: 모바일에서는 텍스트 없이 버튼만 left: 24px 위치에 표시 */}
        <button
          type="button"
          className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="대시보드 추가"
        >
          <AddBoxIcon width={20} height={20} />
        </button>
      </div>

      {/* ── 대시보드 목록 ── */}
      <div className="flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-1.5 md:gap-0.5 xl:gap-2">
          {pagedDashboards.map((dashboard) => {
            const isActive =
              pathname === `/dashboard/${dashboard.id}` ||
              pathname.startsWith(`/dashboard/${dashboard.id}/`);

            return (
              <li key={dashboard.id}>
                <Link href={`/dashboard/${dashboard.id}`}>
                  {/* mobile: 컬러 점 40×40 박스 (left: 14px, 선택 시 흰 배경) */}
                  <div
                    className={cn(
                      'md:hidden flex items-center justify-center',
                      'w-10 h-10 ml-[14px] rounded-[4px] transition-colors',
                      isActive ? 'bg-white' : 'hover:bg-gray-100',
                    )}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: dashboard.color }}
                    />
                  </div>

                  {/* tablet: [dot] gap-4 [text + crown(gap-1.5)] */}
                  <div
                    className={cn(
                      'hidden md:flex xl:hidden items-center gap-4',
                      'h-[43px] mx-2 px-[10px] rounded-[4px] transition-colors',
                      isActive ? 'bg-brand-violet-light' : 'hover:bg-gray-100',
                    )}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: dashboard.color }}
                    />
                    <span className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span
                        className={cn(
                          'truncate text-lg-medium',
                          isActive ? 'text-gray-700' : 'text-gray-500',
                        )}
                      >
                        {dashboard.title}
                      </span>
                      {dashboard.createdByMe && (
                        <CrownIcon
                          width={15}
                          height={12}
                          className="shrink-0"
                        />
                      )}
                    </span>
                  </div>

                  {/* desktop: [dot] gap-4 [text + crown(gap-1.5)] */}
                  <div
                    className={cn(
                      'hidden xl:flex items-center gap-4',
                      'h-[50px] mx-3 px-3 rounded-[4px] transition-colors',
                      isActive ? 'bg-brand-violet-light' : 'hover:bg-gray-100',
                    )}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: dashboard.color }}
                    />
                    <span className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span
                        className={cn(
                          'truncate text-2lg-medium',
                          isActive ? 'text-gray-700' : 'text-gray-500',
                        )}
                      >
                        {dashboard.title}
                      </span>
                      {dashboard.createdByMe && (
                        <CrownIcon
                          width={18}
                          height={14}
                          className="shrink-0"
                        />
                      )}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── 페이지네이션 (tablet/desktop만 표시, 15개 초과 시에만 렌더링) ── */}
      {totalPages > 1 && (
        <div className="hidden md:flex items-center gap-3 shrink-0 px-5 pt-6 xl:pt-8 pb-4">
          <Pagination
            size="sm"
            currentPage={page}
            totalPages={totalPages}
            onPrev={handlePrevPage}
            onNext={handleNextPage}
          />
          <span className="text-xs-regular text-gray-500">
            {page} / {totalPages}
          </span>
        </div>
      )}
    </aside>
  );
};

export default SideMenu;
