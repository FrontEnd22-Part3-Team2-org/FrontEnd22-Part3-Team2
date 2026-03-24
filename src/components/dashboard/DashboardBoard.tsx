'use client';

/**
 * @file DashboardBoard.tsx
 * @description 대시보드 상세 페이지의 칸반 보드 영역 클라이언트 컴포넌트입니다.
 * React Query로 데이터를 로드하고, 사용자 상호작용을 처리합니다.
 *
 * @notes
 * - 모달 오픈 콜백(onCardClick, onAddCard 등)은 Column/TaskCard에 연결되어 있습니다.
 * - NOTE: 서버 사이드 인증(쿠키 기반)이 구축되면 page.tsx에서 initialData를 내려줄 수 있습니다.
 *   현재는 localStorage 토큰 방식이라 클라이언트에서 전부 로드합니다.
 */

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Column as ColumnType, Card } from '@/types/dashboard';
import {
  getDashboard,
  getColumns,
  getMembers,
  getCards,
  createColumn,
  updateColumn,
  deleteColumn,
} from '@/api/dashboard';
import Column from './Column';
import Button from '@/components/common/Button';
import CrownIcon from '@/components/common/Icon/CrownIcon';
import SettingIcon from '@/components/common/Icon/SettingIcon';
import AddBoxIcon from '@/components/common/Icon/AddBoxIcon';
import UserProfileImage from '@/components/common/User/UserProfileImage';
import Link from 'next/link';
import { QUERY_KEYS } from '@/constants/queryKeys';
import Cards from '@/components/Modal/Cards/Cards';
import FormModal from '@/components/Modal/FormModal';
import ConfirmModal from '@/components/Modal/ConfirmModal';

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
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const [addColumnModal, setAddColumnModal] = useState({
    isOpen: false,
    title: '',
    error: '',
  });
  const [editColumnModal, setEditColumnModal] = useState<{
    column: ColumnType | null;
    title: string;
    error: string;
  }>({ column: null, title: '', error: '' });
  const [deleteColumnId, setDeleteColumnId] = useState<number | null>(null);

  const queryClient = useQueryClient();

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
    setEditColumnModal({ column, title: column.title, error: '' });
  };

  const handleEditColumnConfirm = async () => {
    const { column, title } = editColumnModal;
    if (!column) return;
    const trimmed = title.trim();
    if (!trimmed) {
      setEditColumnModal((prev) => ({
        ...prev,
        error: '컬럼 이름을 입력해주세요.',
      }));
      return;
    }
    try {
      await updateColumn(column.id, trimmed);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.columns(dashboardId),
      });
      setEditColumnModal({ column: null, title: '', error: '' });
    } catch {
      setEditColumnModal((prev) => ({
        ...prev,
        error: '컬럼 수정에 실패했습니다.',
      }));
    }
  };

  const handleDeleteColumnRequest = () => {
    if (!editColumnModal.column) return;
    setDeleteColumnId(editColumnModal.column.id);
    setEditColumnModal({ column: null, title: '', error: '' });
  };

  const handleDeleteColumnConfirm = async () => {
    if (!deleteColumnId) return;
    try {
      await deleteColumn(deleteColumnId);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.columns(dashboardId),
      });
    } finally {
      setDeleteColumnId(null);
    }
  };

  const handleCardClick = (_card: Card) => {
    setIsCardModalOpen(true);
  };

  const handleCardModalClose = () => {
    setIsCardModalOpen(false);
  };

  const handleAddColumn = () => {
    setAddColumnModal({ isOpen: true, title: '', error: '' });
  };

  const handleAddColumnConfirm = async () => {
    const trimmed = addColumnModal.title.trim();
    if (!trimmed) {
      setAddColumnModal((prev) => ({
        ...prev,
        error: '컬럼 이름을 입력해주세요.',
      }));
      return;
    }
    try {
      await createColumn(trimmed, dashboardId);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.columns(dashboardId),
      });
      setAddColumnModal({ isOpen: false, title: '', error: '' });
    } catch {
      setAddColumnModal((prev) => ({
        ...prev,
        error: '컬럼 생성에 실패했습니다.',
      }));
    }
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
          {dashboard.createdByMe && (
            <Link
              href={`/dashboard/${dashboardId}/edit`}
              className="flex md:hidden w-8 h-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="대시보드 관리"
            >
              <SettingIcon width={16} height={16} />
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
          <button
            type="button"
            onClick={handleInvite}
            className="flex md:hidden w-8 h-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="초대하기"
          >
            <AddBoxIcon width={16} height={16} />
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
                    profile={{
                      id: member.userId,
                      nickname: member.nickname,
                      profileImageUrl: member.profileImageUrl,
                    }}
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

      {/* 카드 상세 모달 */}
      {isCardModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={handleCardModalClose}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Cards onModalClose={handleCardModalClose} />
          </div>
        </div>
      )}

      {/* 칼럼 추가 모달 */}
      {addColumnModal.isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/40"
          onClick={() =>
            setAddColumnModal({ isOpen: false, title: '', error: '' })
          }
        >
          <div
            className="flex min-h-full items-center justify-center px-4 py-8"
            onClick={(e) => e.stopPropagation()}
          >
            <FormModal
              title="새 컬럼 생성"
              label="이름"
              value={addColumnModal.title}
              placeholder="새로운 프로젝트"
              confirmText="생성"
              errorText={addColumnModal.error}
              showCloseButton
              onChange={(v) =>
                setAddColumnModal((prev) => ({ ...prev, title: v, error: '' }))
              }
              onCancel={() =>
                setAddColumnModal({ isOpen: false, title: '', error: '' })
              }
              onConfirm={handleAddColumnConfirm}
              onClose={() =>
                setAddColumnModal({ isOpen: false, title: '', error: '' })
              }
            />
          </div>
        </div>
      )}

      {/* 칼럼 수정 모달 */}
      {editColumnModal.column && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/40"
          onClick={() =>
            setEditColumnModal({ column: null, title: '', error: '' })
          }
        >
          <div
            className="flex min-h-full items-center justify-center px-4 py-8"
            onClick={(e) => e.stopPropagation()}
          >
            <FormModal
              title="컬럼 수정"
              label="이름"
              value={editColumnModal.title}
              confirmText="변경"
              cancelText="삭제하기"
              errorText={editColumnModal.error}
              showCloseButton
              onChange={(v) =>
                setEditColumnModal((prev) => ({ ...prev, title: v, error: '' }))
              }
              onCancel={handleDeleteColumnRequest}
              onConfirm={handleEditColumnConfirm}
              onClose={() =>
                setEditColumnModal({ column: null, title: '', error: '' })
              }
            />
          </div>
        </div>
      )}

      {/* 칼럼 삭제 확인 모달 */}
      {deleteColumnId !== null && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/40"
          onClick={() => setDeleteColumnId(null)}
        >
          <div
            className="flex min-h-full items-center justify-center px-4 py-8"
            onClick={(e) => e.stopPropagation()}
          >
            <ConfirmModal
              message="칼럼의 모든 카드가 삭제됩니다. 정말 삭제하시겠습니까?"
              confirmText="삭제"
              onCancel={() => setDeleteColumnId(null)}
              onConfirm={handleDeleteColumnConfirm}
            />
          </div>
        </div>
      )}

      {/*
       * NOTE: 아래 모달들은 컴포넌트 완성 후 이 위치에 추가합니다.
       *
       * - 할 일 생성 모달   → handleAddCard(columnId)
       * - 초대하기 모달      → handleInvite()
       */}
    </div>
  );
}
