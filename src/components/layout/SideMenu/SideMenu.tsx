'use client';

/**
 * @file SideMenu.tsx
 * @description 서비스 좌측에 고정되는 네비게이션 사이드바 컴포넌트입니다.
 * 대시보드 목록을 보여주고, 현재 위치에 따라 활성 항목을 하이라이트 처리합니다.
 * 드래그앤드롭으로 대시보드 순서를 변경할 수 있습니다.
 * @author 하늘
 * @notes
 * - 반응형 3단계: 데스크탑(xl, 300px) / 태블릿(md, 160px) / 모바일(67px)
 * - 15개 초과 시 하단 페이지네이션으로 목록이 나뉩니다.
 * - 현재 pathname 감지를 위해 'use client'가 선언되어 있습니다.
 * - 드래그 시작 전 8px 이상 이동해야 드래그로 인식 (클릭과 구분).
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDndMonitor,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AddBoxIcon from '@/components/common/Icon/AddBoxIcon';
import CrownIcon from '@/components/common/Icon/CrownIcon';
import Pagination from '@/components/common/Pagination/Pagination';
import Logo from '@/components/common/Logo';
import Skeleton from '@/components/common/Skeleton/Skeleton';
import { cn } from '@/lib/utils';
import { getDashboards } from '@/api/dashboard';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { Dashboard } from '@/types/dashboard';

const PAGE_SIZE = 15;

/**
 * 모듈 레벨 플래그: 드래그가 발생했는지 추적.
 * React state/ref 대신 모듈 변수를 사용해 렌더링 사이클과 무관하게
 * 동기적으로 읽고 쓸 수 있어 pointerup → click 이벤트 순서에서 안정적으로 동작.
 */
let hasDragged = false;

interface SortableDashboardItemProps {
  dashboard: Dashboard;
  isActive: boolean;
}

function SortableDashboardItem({
  dashboard,
  isActive,
}: SortableDashboardItemProps) {
  const router = useRouter();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: dashboard.id });

  useDndMonitor({
    onDragStart() {
      hasDragged = false;
    },
    onDragEnd() {
      hasDragged = true;
      setTimeout(() => {
        hasDragged = false;
      }, 100);
    },
  });

  const handleClick = () => {
    if (!hasDragged) {
      router.push(`/dashboard/${dashboard.id}`);
    }
  };

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined,
    position: 'relative',
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      {/* mobile */}
      <div
        className={cn(
          'md:hidden flex items-center justify-center',
          'w-10 h-10 ml-[14px] rounded-[4px] transition-colors cursor-pointer',
          isActive ? 'bg-white' : 'hover:bg-gray-100',
          isDragging && 'bg-gray-100',
        )}
      >
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: dashboard.color }}
        />
      </div>

      {/* tablet */}
      <div
        className={cn(
          'hidden md:flex lg:hidden items-center gap-4',
          'h-[43px] mx-2 px-[10px] rounded-[4px] transition-colors cursor-pointer',
          isActive ? 'bg-brand-violet-light' : 'hover:bg-gray-100',
          isDragging && 'bg-gray-100',
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
            <CrownIcon width={15} height={12} className="shrink-0" />
          )}
        </span>
      </div>

      {/* desktop */}
      <div
        className={cn(
          'hidden lg:flex items-center gap-4',
          'h-[50px] mx-3 px-3 rounded-[4px] transition-colors cursor-pointer',
          isActive ? 'bg-brand-violet-light' : 'hover:bg-gray-100',
          isDragging && 'bg-gray-100',
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
            <CrownIcon width={18} height={14} className="shrink-0" />
          )}
        </span>
      </div>
    </li>
  );
}

function SideMenuSkeleton() {
  return (
    <ul className="flex flex-col gap-1.5 md:gap-0.5 lg:gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i}>
          {/* mobile */}
          <div className="md:hidden flex items-center justify-center w-10 h-10 ml-[14px]">
            <Skeleton className="w-2 h-2 rounded-full" />
          </div>
          {/* tablet */}
          <div className="hidden md:flex lg:hidden items-center gap-4 h-[43px] mx-2 px-[10px]">
            <Skeleton className="w-2 h-2 rounded-full shrink-0" />
            <Skeleton className="h-4 flex-1 rounded-[4px]" />
          </div>
          {/* desktop */}
          <div className="hidden lg:flex items-center gap-4 h-[50px] mx-3 px-3">
            <Skeleton className="w-2 h-2 rounded-full shrink-0" />
            <Skeleton className="h-4 flex-1 rounded-[4px]" />
          </div>
        </li>
      ))}
    </ul>
  );
}

const SideMenu = () => {
  const pathname = usePathname();
  const [page, setPage] = useState(1);

  /**
   * 페이지별 드래그 순서를 메모리에 보관.
   * key: storageKey(`dashboard-order-page-${page}`)
   * value: 해당 페이지에서 드래그로 재정렬된 대시보드 ID 배열
   */
  const [localOrderMap, setLocalOrderMap] = useState<Record<string, number[]>>(
    {},
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.dashboards(), page],
    queryFn: () => getDashboards(page, PAGE_SIZE),
  });

  const dashboards = data?.dashboards ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const storageKey = `dashboard-order-page-${page}`;

  /**
   * 표시할 대시보드 순서를 계산.
   * 우선순위: 드래그 인메모리 순서 > localStorage 저장 순서 > API 기본 순서
   * useEffect + setState 대신 useMemo로 처리해 effect 내 setState 규칙 위반을 방지.
   */
  const orderedDashboards = useMemo(() => {
    if (dashboards.length === 0) return [];

    const applyOrder = (ids: number[]) =>
      [...dashboards].sort((a, b) => {
        const ai = ids.indexOf(a.id);
        const bi = ids.indexOf(b.id);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      });

    const inMemory = localOrderMap[storageKey];
    if (inMemory?.length) return applyOrder(inMemory);

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return applyOrder(JSON.parse(saved));
    } catch {
      /* ignore */
    }

    return dashboards;
  }, [dashboards, localOrderMap, storageKey]);

  const handlePrevPage = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNextPage = () =>
    setPage((prev) => Math.min(totalPages, prev + 1));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedDashboards.findIndex((d) => d.id === active.id);
    const newIndex = orderedDashboards.findIndex((d) => d.id === over.id);
    const newOrder = arrayMove(orderedDashboards, oldIndex, newIndex);
    const newIds = newOrder.map((d) => d.id);

    setLocalOrderMap((prev) => ({ ...prev, [storageKey]: newIds }));

    try {
      localStorage.setItem(storageKey, JSON.stringify(newIds));
    } catch {
      // 시크릿 모드 등 localStorage 비활성 환경에서는 무시
    }
  };

  return (
    <aside
      className={cn(
        'flex flex-col shrink-0 bg-white border-r border-gray-200 min-h-screen',
        'w-[67px] md:w-[160px] lg:w-[300px]',
      )}
    >
      {/* ── 로고 ── */}
      <Link
        href={pathname.startsWith('/dashboard/') ? '/mydashboard' : '/'}
        className="flex items-center shrink-0 pt-5 pl-[22px] md:pt-5 md:pl-[13px] lg:pl-2 mb-[39px] md:mb-[57px] lg:mb-14"
      >
        <span className="md:hidden">
          <Logo variant="small" />
        </span>
        <span className="hidden md:block">
          <Logo variant="large" />
        </span>
      </Link>

      {/* ── Dash Boards 영역 ── */}
      <div className="flex items-center justify-between shrink-0 pl-6 pr-[14px] md:pl-[13px] md:pr-[13px] lg:pl-2 lg:pr-3 mb-[18px] md:mb-4">
        <span className="hidden md:block text-xs-semibold text-gray-500">
          Dash Boards
        </span>
        <button
          type="button"
          className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="대시보드 추가"
        >
          <AddBoxIcon width={20} height={20} />
        </button>
      </div>

      {/* ── 대시보드 목록 (드래그앤드롭) ── */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <SideMenuSkeleton />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedDashboards.map((d) => d.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="flex flex-col gap-1.5 md:gap-0.5 lg:gap-2">
                {orderedDashboards.map((dashboard) => {
                  const isActive =
                    pathname === `/dashboard/${dashboard.id}` ||
                    pathname.startsWith(`/dashboard/${dashboard.id}/`);

                  return (
                    <SortableDashboardItem
                      key={dashboard.id}
                      dashboard={dashboard}
                      isActive={isActive}
                    />
                  );
                })}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* ── 페이지네이션 ── */}
      {totalPages > 1 && (
        <div className="hidden md:flex items-center gap-3 shrink-0 px-5 pt-6 lg:pt-8 pb-4">
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
