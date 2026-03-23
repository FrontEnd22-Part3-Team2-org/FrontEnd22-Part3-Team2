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
import CrownIcon from '@/components/common/Icon/CrownIcon';
import SettingIcon from '@/components/common/Icon/SettingIcon';
import AddBoxIcon from '@/components/common/Icon/AddBoxIcon';
import UserProfileImage from '@/components/common/User/UserProfileImage';
import Link from 'next/link';
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
      {/* ── 대시보드 헤더 ── */}
      <header className="flex items-center justify-between shrink-0 h-[64px] px-6 md:px-8 bg-white border-b border-gray-200">
        {/* 대시보드 제목 + 왕관 */}
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="text-xl-bold text-gray-700 truncate">
            {dashboard.title}
          </h1>
          {dashboard.createdByMe && (
            <CrownIcon width={20} height={16} className="shrink-0" />
          )}
        </div>

        {/* 관리 / 초대하기 / 멤버 아바타 / 프로필 */}
        <div className="flex items-center gap-4 shrink-0">
          {dashboard.createdByMe && (
            <Link
              href={`/dashboard/${dashboardId}/edit`}
              className="hidden md:flex items-center gap-1.5 px-4 h-8 rounded-md border border-gray-300 text-md-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <SettingIcon width={16} height={16} />
              관리
            </Link>
          )}

          <button
            type="button"
            onClick={handleInvite}
            className="hidden md:flex items-center gap-1.5 px-4 h-8 rounded-md border border-gray-300 text-md-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <AddBoxIcon width={16} height={16} />
            초대하기
          </button>

          {/* 멤버 아바타 (최대 4명 + 초과 수) */}
          {visibleMembers.length > 0 && (
            <div className="flex items-center">
              {visibleMembers.map((member, i) => (
                <div
                  key={member.id}
                  className="w-[34px] h-[34px] rounded-full overflow-hidden ring-2 ring-white shrink-0"
                  style={{
                    marginLeft: i === 0 ? 0 : '-8px',
                    zIndex: visibleMembers.length - i,
                  }}
                  title={member.nickname}
                >
                  <UserProfileImage
                    src={member.profileImageUrl ?? ''}
                    name={member.nickname}
                  />
                </div>
              ))}
              {extraMemberCount > 0 && (
                <div
                  className="w-[34px] h-[34px] -ml-2 rounded-full ring-2 ring-white bg-brand-violet-light flex items-center justify-center shrink-0"
                  style={{ zIndex: 0 }}
                >
                  <span className="text-xs-medium text-brand-violet">
                    +{extraMemberCount}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="hidden md:block w-px h-8 bg-gray-200" />

          {/* TODO: [담당자] 로그인 유저 정보로 교체 */}
          <div className="flex items-center gap-2">
            <div className="w-[34px] h-[34px] rounded-full bg-brand-violet flex items-center justify-center">
              <span className="text-white text-xs-semibold">나</span>
            </div>
            <span className="hidden md:block text-md-medium text-gray-700">
              프로필
            </span>
          </div>
        </div>
      </header>

      {/* ── 칸반 보드 ── */}
      <div className="flex-1 overflow-hidden bg-gray-100">
        <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-y-hidden md:overflow-x-auto">
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
          <div className="flex items-start pt-[64px] px-4 md:px-5 shrink-0">
            <Button
              variant="secondary"
              size="add_column"
              onClick={handleAddColumn}
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
