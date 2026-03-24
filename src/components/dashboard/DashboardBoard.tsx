'use client';

/**
 * @file DashboardBoard.tsx
 * @description 대시보드 상세 페이지의 칸반 보드 영역 클라이언트 컴포넌트입니다.
 * React Query로 데이터를 로드하고, 사용자 상호작용을 처리합니다.
 *
 * @notes
 * - 카드 상세/생성/수정/삭제 모달은 각 담당자가 이 컴포넌트에 직접 연결합니다.
 *   모달 오픈 콜백(onCardClick, onAddCard 등)은 이미 Column/TaskCard에 연결되어 있습니다.
 * - NOTE: 서버 사이드 인증(쿠키 기반)이 구축되면 page.tsx에서 initialData를 내려줄 수 있습니다.
 *   현재는 localStorage 토큰 방식이라 클라이언트에서 전부 로드합니다.
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Column as ColumnType, Card } from '@/types/dashboard';
import {
  getDashboard,
  getColumns,
  getMembers,
  getCards,
} from '@/api/dashboard';
import Column from './Column';
import Button from '@/components/common/Button';
import { QUERY_KEYS } from '@/constants/queryKeys';

interface DashboardBoardProps {
  dashboardId: number;
}

interface ColumnCardState {
  cards: Card[];
  totalCount: number;
  cursorId: number | null;
}

const MAX_VISIBLE_MEMBERS = 4;

export default function DashboardBoard({ dashboardId }: DashboardBoardProps) {
  const [columnCards, setColumnCards] = useState<
    Record<number, ColumnCardState>
  >({});

  const { data: dashboard, isLoading: isDashboardLoading } = useQuery({
    queryKey: QUERY_KEYS.dashboard(dashboardId),
    queryFn: () => getDashboard(dashboardId),
  });

  const { data: columnsData, isLoading: isColumnsLoading } = useQuery({
    queryKey: QUERY_KEYS.columns(dashboardId),
    queryFn: () => getColumns(dashboardId),
    // 칼럼 로드 완료 후 각 칼럼의 카드를 로드
    select: (data) => data,
  });

  // 칼럼 목록이 로드되면 각 칼럼의 카드를 가져옴
  useQuery({
    queryKey: [...QUERY_KEYS.columns(dashboardId), 'cards'],
    queryFn: async () => {
      const cols = columnsData?.data ?? [];
      const results = await Promise.all(
        cols.map((col) => getCards(col.id, 10)),
      );
      const map: Record<number, ColumnCardState> = {};
      cols.forEach((col, i) => {
        map[col.id] = {
          cards: results[i].cards,
          totalCount: results[i].totalCount,
          cursorId: results[i].cursorId,
        };
      });
      setColumnCards(map);
      return map;
    },
    enabled: !!columnsData?.data?.length,
  });

  const { data: membersData } = useQuery({
    queryKey: QUERY_KEYS.members(dashboardId),
    queryFn: () => getMembers(dashboardId),
  });

  const columns = columnsData?.data ?? [];
  const members = membersData?.members ?? [];
  const visibleMembers = members.slice(0, MAX_VISIBLE_MEMBERS);
  const extraMemberCount = Math.max(0, members.length - MAX_VISIBLE_MEMBERS);

  // ── 이벤트 핸들러 ──

  const handleAddCard = (columnId: number) => {
    // TODO: [담당자] 할 일 생성 모달 오픈 — columnId를 모달에 전달
    console.log('할 일 추가 요청, columnId:', columnId);
  };

  const handleEditColumn = (column: ColumnType) => {
    // TODO: [담당자] 칼럼 수정 모달 오픈 — column 정보를 모달에 전달
    console.log('칼럼 수정 요청:', column);
  };

  const handleCardClick = (card: Card) => {
    // TODO: [담당자] 카드 상세 모달 오픈 — card 정보를 모달에 전달
    console.log('카드 상세 요청:', card);
  };

  const handleAddColumn = () => {
    // TODO: [담당자] 새 칼럼 추가 모달 오픈
    console.log('칼럼 추가 요청');
  };

  const handleInvite = () => {
    // TODO: [담당자] 초대하기 모달 오픈
    console.log('초대하기 요청');
  };

  if (isDashboardLoading || isColumnsLoading) {
    return (
      <div className="flex items-center justify-center flex-1 h-full min-h-[calc(100vh-64px)]">
        <p className="text-gray-400 text-lg-regular">불러오는 중...</p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center flex-1 h-full min-h-[calc(100vh-64px)]">
        <p className="text-gray-400 text-lg-regular">
          대시보드를 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── 칸반 보드 ── */}
      <div className="flex-1 overflow-hidden bg-gray-100">
        <div className="flex flex-col lg:flex-row h-full overflow-y-auto lg:overflow-y-hidden lg:overflow-x-auto">
          {columns.map((column, index) => (
            <Column
              key={column.id}
              column={column}
              cards={columnCards[column.id]?.cards ?? []}
              totalCount={columnCards[column.id]?.totalCount ?? 0}
              cursorId={columnCards[column.id]?.cursorId}
              colorIndex={index}
              onAddCard={handleAddCard}
              onEditColumn={handleEditColumn}
              onCardClick={handleCardClick}
            />
          ))}

          {/* 새로운 컬럼 추가하기 */}
          <div className="flex items-start pt-4 lg:pt-[64px] px-4 md:px-5 pb-8 lg:pb-0 shrink-0">
            <Button
              variant="secondary"
              size="add_column"
              onClick={handleAddColumn}
              className="w-full md:w-full lg:w-[354px]"
            >
              새로운 컬럼 추가하기
              <span className="w-5 h-5 flex items-center justify-center rounded bg-brand-violet-light text-brand-violet text-lg-bold leading-none">
                +
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/*
       * NOTE: 아래 모달들은 각 담당자가 이 위치에 추가합니다.
       * 모달 오픈 트리거(handleCardClick, handleAddCard 등)는 이미 연결되어 있습니다.
       *
       * - 카드 상세 모달     → handleCardClick(card)
       * - 할 일 생성 모달   → handleAddCard(columnId)
       * - 칼럼 수정 모달     → handleEditColumn(column)
       * - 칼럼 추가 모달     → handleAddColumn()
       * - 초대하기 모달      → handleInvite()
       */}
    </div>
  );
}
