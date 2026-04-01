'use client';

/**
 * @file SideMenu.tsx
 * @description 서비스 좌측에 고정되는 네비게이션 사이드바 컴포넌트입니다.
 * 대시보드 목록을 보여주고, 현재 위치에 따라 활성 항목을 하이라이트 처리합니다.
 * 드래그앤드롭으로 대시보드 순서를 변경할 수 있습니다.
 * @author 하늘
 * @notes
 * - 반응형 3단계: 데스크탑(xl, 300px) / 태블릿(md, 160px) / 모바일(67px)
 * - 사이드바 우측 핸들을 드래그해 너비를 자유롭게 조절할 수 있습니다.
 * - 조절된 너비는 breakpoint별로 localStorage에 저장되어 새로고침 후에도 유지됩니다.
 * - 너비 기준 레이아웃: mobile(<100px) / tablet(100~219px) / desktop(≥220px)
 * - mobile 레이아웃(컬러칩만 표시)에서는 무한스크롤로 대시보드를 불러옵니다.
 * - tablet/desktop 레이아웃에서는 15개 초과 시 페이지네이션으로 목록이 나뉩니다.
 */

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
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
import DashboardCreateModal from '@/components/Modal/DashboardCreateModal';

const PAGE_SIZE = 15;
const MIN_WIDTH = 67;
const MAX_WIDTH = 500;

/** layout === null: SSR/초기 상태. CSS 클래스 기반 반응형으로 처리. */
type LayoutType = 'mobile' | 'tablet' | 'desktop';

let hasDragged = false;

// ─── 유틸 함수 ───────────────────────────────────────────────────

function getBreakpoint(): 'mobile' | 'tablet' | 'desktop' {
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

function getDefaultWidth(bp: 'mobile' | 'tablet' | 'desktop'): number {
  if (bp === 'mobile') return MIN_WIDTH;
  if (bp === 'tablet') return 160;
  return 300;
}

function getSavedWidth(bp: string): number | null {
  try {
    const raw = localStorage.getItem(`sidemenu-width-${bp}`);
    if (!raw) return null;
    const parsed = Number(raw);
    return !isNaN(parsed) && parsed >= MIN_WIDTH && parsed <= MAX_WIDTH
      ? parsed
      : null;
  } catch {
    return null;
  }
}

// ─── 드래그앤드롭 대시보드 아이템 ───────────────────────────────

interface SortableDashboardItemProps {
  dashboard: Dashboard;
  isActive: boolean;
  layout: LayoutType | null;
}

function SortableDashboardItem({
  dashboard,
  isActive,
  layout,
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
    if (!hasDragged) router.push(`/dashboard/${dashboard.id}`);
  };

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined,
    position: 'relative',
    touchAction: 'pan-y',
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      {/* JS 기반: mobile */}
      {layout === 'mobile' && (
        <div
          className={cn(
            'flex items-center justify-center',
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
      )}

      {/* SSR / 초기 상태: CSS 클래스 기반 반응형 */}
      {layout === null && (
        <>
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
        </>
      )}

      {/* JS 기반: tablet */}
      {layout === 'tablet' && (
        <div
          className={cn(
            'flex items-center gap-4',
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
      )}

      {/* JS 기반: desktop */}
      {layout === 'desktop' && (
        <div
          className={cn(
            'flex items-center gap-4',
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
      )}
    </li>
  );
}

// ─── 스켈레톤 ────────────────────────────────────────────────────

function SideMenuSkeleton({ layout }: { layout: LayoutType | null }) {
  return (
    <ul
      className={cn(
        'flex flex-col',
        layout === null
          ? 'gap-1.5 md:gap-0.5 lg:gap-2'
          : layout === 'mobile'
            ? 'gap-1.5'
            : layout === 'tablet'
              ? 'gap-0.5'
              : 'gap-2',
      )}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i}>
          {(layout === null || layout === 'mobile') && (
            <div
              className={cn(
                'flex items-center justify-center w-10 h-10 ml-[14px]',
                layout === null && 'md:hidden',
              )}
            >
              <Skeleton className="w-2 h-2 rounded-full" />
            </div>
          )}
          {(layout === null || layout === 'tablet') && (
            <div
              className={cn(
                'flex items-center gap-4 h-[43px] mx-2 px-[10px]',
                layout === null && 'hidden md:flex lg:hidden',
              )}
            >
              <Skeleton className="w-2 h-2 rounded-full shrink-0" />
              <Skeleton className="h-4 flex-1 rounded-[4px]" />
            </div>
          )}
          {(layout === null || layout === 'desktop') && (
            <div
              className={cn(
                'flex items-center gap-4 h-[50px] mx-3 px-3',
                layout === null && 'hidden lg:flex',
              )}
            >
              <Skeleton className="w-2 h-2 rounded-full shrink-0" />
              <Skeleton className="h-4 flex-1 rounded-[4px]" />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────

const SideMenu = () => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  /** 인라인 스타일 너비. null이면 CSS 클래스 기반 반응형 유지 */
  const [sidebarWidth, setSidebarWidth] = useState<number | null>(null);
  const currentWidthRef = useRef<number>(300);
  const currentBpRef = useRef<string>('');

  const [localOrderMap, setLocalOrderMap] = useState<Record<string, number[]>>(
    {},
  );

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 220,
        tolerance: 10,
      },
    }),
  );

  // ── 초기 너비 설정 + 창 크기 변화 시 breakpoint 전환 ──────────
  useEffect(() => {
    const applyWidth = (bp: 'mobile' | 'tablet' | 'desktop') => {
      const w = getSavedWidth(bp) ?? getDefaultWidth(bp);
      currentWidthRef.current = w;
      setSidebarWidth(w);
    };

    const handleResize = () => {
      const bp = getBreakpoint();
      if (bp === currentBpRef.current) return;
      currentBpRef.current = bp;
      applyWidth(bp);
    };

    const bp = getBreakpoint();
    currentBpRef.current = bp;
    applyWidth(bp);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── 사이드바 너비 → 레이아웃 분기 ───────────────────────────
  const layout = useMemo<LayoutType | null>(() => {
    if (sidebarWidth === null) return null;
    if (sidebarWidth < 100) return 'mobile';
    if (sidebarWidth < 220) return 'tablet';
    return 'desktop';
  }, [sidebarWidth]);

  const isMobileLayout = layout === 'mobile';

  // ── 드래그 리사이즈 핸들 ────────────────────────────────────
  const handleResizeStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);

    const startX = e.clientX;
    const startWidth = currentWidthRef.current;
    let rafId: number | null = null;
    let nextWidth = startWidth;

    const handleMove = (moveEvent: PointerEvent) => {
      nextWidth = Math.max(
        MIN_WIDTH,
        Math.min(MAX_WIDTH, startWidth + (moveEvent.clientX - startX)),
      );
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        currentWidthRef.current = nextWidth;
        setSidebarWidth(nextWidth);
        rafId = null;
      });
    };

    const handleUp = () => {
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);
      document.removeEventListener('pointercancel', handleUp);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      try {
        const bp = getBreakpoint();
        localStorage.setItem(
          `sidemenu-width-${bp}`,
          String(currentWidthRef.current),
        );
      } catch {
        /* 시크릿 모드 등 */
      }
    };

    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);
    document.addEventListener('pointercancel', handleUp);
  }, []);

  // ── 페이지네이션 쿼리 (tablet / desktop) ─────────────────────
  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.dashboards(), page],
    queryFn: () => getDashboards(page, PAGE_SIZE),
    enabled: !isMobileLayout,
    staleTime: 0,
  });

  // ── 무한스크롤 쿼리 (mobile) ─────────────────────────────────
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isInfiniteLoading,
  } = useInfiniteQuery({
    queryKey: [...QUERY_KEYS.dashboards(), 'infinite'],
    queryFn: ({ pageParam }) => getDashboards(pageParam as number, PAGE_SIZE),
    getNextPageParam: (lastPage, pages) => {
      const total = Math.ceil(lastPage.totalCount / PAGE_SIZE);
      return pages.length < total ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: isMobileLayout,
  });

  // ── 무한스크롤 트리거 ────────────────────────────────────────
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isMobileLayout || !bottomRef.current) return;
    const el = bottomRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobileLayout, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ── 데이터 ──────────────────────────────────────────────────
  const dashboards = data?.dashboards ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const storageKey = `dashboard-order-page-${page}`;

  /**
   * 표시할 대시보드 순서를 계산.
   * 우선순위: 드래그 인메모리 순서 > localStorage 저장 순서 > API 기본 순서
   */
  const orderedDashboards = useMemo(() => {
    if (dashboards.length === 0) return [];

    const uniqueDashboards = dashboards.filter(
      (board, index, self) =>
        index === self.findIndex((b) => b.id === board.id),
    );

    const applyOrder = (ids: number[]) =>
      [...uniqueDashboards].sort((a, b) => {
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

    return uniqueDashboards;
  }, [dashboards, localOrderMap, storageKey]);

  /**
   * 무한스크롤 데이터에도 페이지별 저장 순서를 적용.
   * 태블릿/데스크탑에서 드래그앤드롭으로 바꾼 순서가 모바일 전환 후에도 유지됨.
   */
  const orderedInfiniteDashboards = useMemo(() => {
    if (!infiniteData) return [];

    const applyPageOrder = (items: Dashboard[], key: string) => {
      const inMemory = localOrderMap[key];
      if (inMemory?.length) {
        return [...items].sort((a, b) => {
          const ai = inMemory.indexOf(a.id);
          const bi = inMemory.indexOf(b.id);
          if (ai === -1) return 1;
          if (bi === -1) return -1;
          return ai - bi;
        });
      }
      try {
        const saved = localStorage.getItem(key);
        if (saved) {
          const ids: number[] = JSON.parse(saved);
          return [...items].sort((a, b) => {
            const ai = ids.indexOf(a.id);
            const bi = ids.indexOf(b.id);
            if (ai === -1) return 1;
            if (bi === -1) return -1;
            return ai - bi;
          });
        }
      } catch {
        /* ignore */
      }
      return items;
    };

    const allOrderedItems = infiniteData.pages.flatMap((pageData, i) =>
      applyPageOrder(pageData.dashboards, `dashboard-order-page-${i + 1}`),
    );

    const finalUniqueItems = allOrderedItems.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id),
    );

    return finalUniqueItems;
  }, [infiniteData, localOrderMap]);

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
      /* 시크릿 모드 등 */
    }
  };

  /**
   * 모바일 레이아웃 드래그앤드롭 처리.
   * 무한스크롤 전체 순서를 기준으로 정렬 후,
   * 각 페이지에 속하는 아이템들의 새 순서를 페이지별로 분리하여 저장.
   * 이 방식으로 태블릿/데스크탑과 순서가 공유됨.
   */
  const handleMobileDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedInfiniteDashboards.findIndex(
      (d) => d.id === active.id,
    );
    const newIndex = orderedInfiniteDashboards.findIndex(
      (d) => d.id === over.id,
    );
    const newOrder = arrayMove(orderedInfiniteDashboards, oldIndex, newIndex);

    infiniteData?.pages.forEach((pageData, i) => {
      const key = `dashboard-order-page-${i + 1}`;
      const pageIdSet = new Set(pageData.dashboards.map((d) => d.id));
      const newPageIds = newOrder
        .filter((d) => pageIdSet.has(d.id))
        .map((d) => d.id);

      setLocalOrderMap((prev) => ({ ...prev, [key]: newPageIds }));
      try {
        localStorage.setItem(key, JSON.stringify(newPageIds));
      } catch {
        /* 시크릿 모드 등 */
      }
    });
  };

  const currentIsLoading = isMobileLayout ? isInfiniteLoading : isLoading;

  return (
    <aside
      style={sidebarWidth !== null ? { width: sidebarWidth } : undefined}
      className={cn(
        'flex flex-col shrink-0 bg-white border-r border-gray-200 min-h-screen relative select-none',
        sidebarWidth === null && 'w-[67px] md:w-[160px] lg:w-[300px]',
      )}
    >
      {/* ── 로고 ── */}
      <Link
        href={pathname.startsWith('/dashboard/') ? '/mydashboard' : '/'}
        className={cn(
          'flex items-center shrink-0',
          layout === null
            ? 'pt-5 pl-[22px] md:pt-5 md:pl-[13px] lg:pl-2 mb-[39px] md:mb-[57px] lg:mb-14'
            : layout === 'mobile'
              ? 'pt-5 pl-[22px] mb-[39px]'
              : layout === 'tablet'
                ? 'pt-5 pl-[13px] mb-[57px]'
                : 'pt-5 pl-2 mb-14',
        )}
      >
        {layout === null ? (
          <>
            <span className="md:hidden">
              <Logo variant="small" />
            </span>
            <span className="hidden md:block">
              <Logo variant="large" />
            </span>
          </>
        ) : layout === 'mobile' ? (
          <Logo variant="small" />
        ) : (
          <Logo variant="large" />
        )}
      </Link>

      {/* ── Dash Boards 헤더 ── */}
      <div
        className={cn(
          'flex items-center justify-between shrink-0',
          layout === null
            ? 'pl-6 pr-[14px] md:pl-[13px] md:pr-[13px] lg:pl-2 lg:pr-3 mb-[18px] md:mb-4'
            : layout === 'mobile'
              ? 'pl-6 pr-[14px] mb-[18px]'
              : layout === 'tablet'
                ? 'pl-[13px] pr-[13px] mb-4'
                : 'pl-2 pr-3 mb-4',
        )}
      >
        <span
          className={cn(
            'text-xs-semibold text-gray-500',
            layout === null
              ? 'hidden md:block'
              : layout === 'mobile'
                ? 'hidden'
                : 'block',
          )}
        >
          Dash Boards
        </span>
        <button
          type="button"
          className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="대시보드 추가"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <AddBoxIcon width={20} height={20} />
        </button>
      </div>

      {/* ── 대시보드 목록 ── */}
      <div className="flex-1 overflow-y-auto">
        {currentIsLoading ? (
          <SideMenuSkeleton layout={layout} />
        ) : isMobileLayout ? (
          /* 모바일: 무한스크롤 + 드래그앤드롭 */
          <>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleMobileDragEnd}
            >
              <SortableContext
                items={orderedInfiniteDashboards.map((d) => d.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="flex flex-col gap-1.5">
                  {orderedInfiniteDashboards.map((dashboard) => {
                    const isActive =
                      pathname === `/dashboard/${dashboard.id}` ||
                      pathname.startsWith(`/dashboard/${dashboard.id}/`);
                    return (
                      <SortableDashboardItem
                        key={dashboard.id}
                        dashboard={dashboard}
                        isActive={isActive}
                        layout="mobile"
                      />
                    );
                  })}
                </ul>
              </SortableContext>
            </DndContext>
            {isFetchingNextPage && (
              <div className="flex justify-center py-3">
                <Skeleton className="w-2 h-2 rounded-full" />
              </div>
            )}
            <div ref={bottomRef} className="h-1" />
          </>
        ) : (
          /* tablet / desktop: 드래그앤드롭 + 페이지네이션 */
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedDashboards.map((d) => d.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul
                className={cn(
                  'flex flex-col',
                  layout === null
                    ? 'gap-1.5 md:gap-0.5 lg:gap-2'
                    : layout === 'tablet'
                      ? 'gap-0.5'
                      : 'gap-2',
                )}
              >
                {orderedDashboards.map((dashboard) => {
                  const isActive =
                    pathname === `/dashboard/${dashboard.id}` ||
                    pathname.startsWith(`/dashboard/${dashboard.id}/`);

                  return (
                    <SortableDashboardItem
                      key={dashboard.id}
                      dashboard={dashboard}
                      isActive={isActive}
                      layout={layout}
                    />
                  );
                })}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* ── 페이지네이션 (tablet / desktop만) ── */}
      {!isMobileLayout && totalPages > 1 && (
        <div
          className={cn(
            'flex items-center gap-3 shrink-0 px-5 pb-4',
            layout === null
              ? 'hidden md:flex pt-6 lg:pt-8'
              : layout === 'tablet'
                ? 'pt-6'
                : 'pt-8',
          )}
        >
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

      {/* ── 드래그 리사이즈 핸들 ── */}
      <div
        className="absolute -right-2 top-0 h-full w-5 touch-none z-20 cursor-col-resize"
        onPointerDown={handleResizeStart}
      >
        <div className="absolute right-2 top-0 h-full w-1 hover:bg-brand-violet/30 active:bg-brand-violet/50 transition-colors" />
      </div>

      <DashboardCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
        }}
        onSuccess={(newId) => {
          const key = 'dashboard-order-page-1';
          try {
            const saved = localStorage.getItem(key);
            const existing: number[] = saved ? JSON.parse(saved) : [];
            const next = [newId, ...existing.filter((id) => id !== newId)];
            localStorage.setItem(key, JSON.stringify(next));
            setLocalOrderMap((prev) => ({
              ...prev,
              [key]: next,
            }));

            setPage(1);
          } catch {
            /* 시크릿 모드 등 */
          }

          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.dashboards(),
            exact: false,
          });
        }}
        dashboards={dashboards}
      />
    </aside>
  );
};

export default SideMenu;
