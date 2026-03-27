'use client';

/**
 * @file DashboardBoard.tsx
 * @description 대시보드 상세 페이지의 칸반 보드 영역 클라이언트 컴포넌트입니다.
 * React Query로 데이터를 로드하고, 사용자 상호작용을 처리합니다.
 * 드래그앤드롭으로 카드를 컬럼 간 이동할 수 있습니다.
 *
 * @notes
 * - 모달 오픈 콜백(onCardClick, onAddCard 등)은 Column/TaskCard에 연결되어 있습니다.
 * - 드래그 시작 시 activeCard 상태 저장 → DragOverlay로 ghost 카드 표시
 * - 드롭 시 optimistic update 후 updateCard API 호출, 실패 시 롤백
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useDashboardStore } from '@/store/useDashboardStore';
import type { Column as ColumnType, Card } from '@/types/dashboard';
import {
  getDashboard,
  getColumns,
  getCards,
  createColumn,
  updateColumn,
  deleteColumn,
  updateCard,
} from '@/api/dashboard';
import Column from './Column';
import TaskCard from './TaskCard';
import Button from '@/components/common/Button';
import { QUERY_KEYS } from '@/constants/queryKeys';
import Cards from '@/components/Modal/Cards/Cards';
import CreateCard from '@/components/Modal/Cards/CreateCard';
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

/** 컬럼의 카드 순서를 localStorage에 저장 */
function saveColumnOrder(columnId: number, cardIds: number[]) {
  try {
    localStorage.setItem(`card-order-col-${columnId}`, JSON.stringify(cardIds));
  } catch {
    // 시크릿 모드 등 localStorage 비활성 환경에서는 무시
  }
}

/** localStorage에 저장된 순서대로 카드 배열을 정렬 */
function applySavedOrder(columnId: number, cards: Card[]): Card[] {
  try {
    const saved = localStorage.getItem(`card-order-col-${columnId}`);
    if (!saved) return cards;
    const savedIds: number[] = JSON.parse(saved);
    return [...cards].sort((a, b) => {
      const ai = savedIds.indexOf(a.id);
      const bi = savedIds.indexOf(b.id);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  } catch {
    return cards;
  }
}

export default function DashboardBoard({ dashboardId }: DashboardBoardProps) {
  const [columnCards, setColumnCards] = useState<
    Record<number, ColumnCardState>
  >({});
  const [loadingColumnIds, setLoadingColumnIds] = useState<Set<number>>(
    new Set(),
  );

  /** 드래그 중인 카드 정보 (DragOverlay 렌더링용) */
  const [activeCard, setActiveCard] = useState<{
    card: Card;
    columnId: number;
  } | null>(null);

  /**
   * columnCardsRef: columnCards state의 최신 값을 항상 참조.
   * onDragOver / onDragEnd 핸들러에서 stale closure 없이 읽기 위해 사용.
   */
  const columnCardsRef = useRef(columnCards);
  useEffect(() => {
    columnCardsRef.current = columnCards;
  }, [columnCards]);

  /**
   * clonedCardsRef: 드래그 시작 시 columnCards 스냅샷 저장.
   * API 실패 시 이 값으로 롤백.
   */
  const clonedCardsRef = useRef<Record<number, ColumnCardState> | null>(null);

  /** 카드 ID로 현재 속한 컬럼 ID를 탐색 */
  const findColumnId = (cardId: number): number | null => {
    for (const [colId, state] of Object.entries(columnCardsRef.current)) {
      if (state.cards.some((c) => c.id === cardId)) return Number(colId);
    }
    return null;
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [createCardColumnId, setCreateCardColumnId] = useState<number | null>(
    null,
  );

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
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const setActiveDashboardId = useDashboardStore((s) => s.setActiveDashboardId);

  useEffect(() => {
    setActiveDashboardId(dashboardId);
  }, [dashboardId, setActiveDashboardId]);

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
  const { data: columnCardsData } = useQuery({
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
      return map;
    },
    enabled: !!columnsData?.data?.length,
  });

  useEffect(() => {
    if (!columnCardsData) return;

    // localStorage에 저장된 순서가 있으면 복원, 없으면 API 기본 순서 사용
    const ordered: Record<number, ColumnCardState> = {};
    for (const [colId, state] of Object.entries(columnCardsData)) {
      const id = Number(colId);
      ordered[id] = {
        ...state,
        cards: applySavedOrder(id, state.cards),
      };
    }
    setColumnCards(ordered);
  }, [columnCardsData]);

  const columns = columnsData?.data ?? [];

  // ── 이벤트 핸들러 ──

  const handleLoadMore = useCallback(
    async (columnId: number, cursorId: number) => {
      setLoadingColumnIds((prev) => new Set(prev).add(columnId));
      try {
        const result = await getCards(columnId, 10, cursorId);
        setColumnCards((prev) => ({
          ...prev,
          [columnId]: {
            cards: [...(prev[columnId]?.cards ?? []), ...result.cards],
            totalCount: result.totalCount,
            cursorId: result.cursorId,
          },
        }));
      } finally {
        setLoadingColumnIds((prev) => {
          const next = new Set(prev);
          next.delete(columnId);
          return next;
        });
      }
    },
    [],
  );

  const handleAddCard = (columnId: number) => {
    setCreateCardColumnId(columnId);
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

  const handleCardClick = (card: Card) => {
    setSelectedCardId(card.id);
    setIsCardModalOpen(true);
  };

  const handleCardModalClose = () => {
    setIsCardModalOpen(false);
    setSelectedCardId(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current as {
      card: Card;
      columnId: number;
    };
    setActiveCard({ card: data.card, columnId: data.columnId });
    // 드래그 시작 시 현재 상태 스냅샷 저장 (API 실패 시 롤백용)
    clonedCardsRef.current = JSON.parse(JSON.stringify(columnCardsRef.current));
  };

  /**
   * 드래그 중 카드가 다른 컬럼 위에 올라왔을 때 즉시 이동(optimistic).
   * - 같은 컬럼 내 이동: useSortable 애니메이션이 처리하므로 state 변경 없음
   * - 다른 컬럼으로 이동: 카드가 올라간 카드 바로 위에 삽입
   */
  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as number;
    const sourceColumnId = findColumnId(activeId);
    if (sourceColumnId === null) return;

    const overData = over.data.current as
      | { type?: string; columnId?: number }
      | undefined;

    let targetColumnId: number | null = null;
    let overCardId: number | null = null;

    if (overData?.type === 'card') {
      targetColumnId = overData.columnId ?? null;
      overCardId = over.id as number;
    } else if (overData?.type === 'column') {
      targetColumnId = overData.columnId ?? null;
    }

    if (!targetColumnId || sourceColumnId === targetColumnId) return;

    setColumnCards((prev) => {
      const sourceCards = [...(prev[sourceColumnId]?.cards ?? [])];
      const movingCard = sourceCards.find((c) => c.id === activeId);
      if (!movingCard) return prev;

      const newSource = sourceCards.filter((c) => c.id !== activeId);
      const newTarget = [...(prev[targetColumnId!]?.cards ?? [])];

      if (overCardId !== null) {
        const overIndex = newTarget.findIndex((c) => c.id === overCardId);
        if (overIndex >= 0) {
          newTarget.splice(overIndex, 0, {
            ...movingCard,
            columnId: targetColumnId!,
          });
        } else {
          newTarget.push({ ...movingCard, columnId: targetColumnId! });
        }
      } else {
        newTarget.push({ ...movingCard, columnId: targetColumnId! });
      }

      return {
        ...prev,
        [sourceColumnId]: {
          ...prev[sourceColumnId],
          cards: newSource,
          totalCount: Math.max(0, (prev[sourceColumnId]?.totalCount ?? 1) - 1),
        },
        [targetColumnId!]: {
          ...prev[targetColumnId!],
          cards: newTarget,
          totalCount: (prev[targetColumnId!]?.totalCount ?? 0) + 1,
        },
      };
    });
  }, []);

  /**
   * 드롭 완료 처리.
   * - 같은 컬럼 내: arrayMove로 최종 순서 확정 (state 업데이트)
   * - 다른 컬럼: handleDragOver에서 이미 이동됨 → API만 호출
   * - API 실패 시 clonedCardsRef로 롤백
   */
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    const activeId = active.id as number;
    const currentColumnId = findColumnId(activeId);

    if (!over || currentColumnId === null) {
      if (clonedCardsRef.current) setColumnCards(clonedCardsRef.current);
      clonedCardsRef.current = null;
      return;
    }

    const overData = over.data.current as
      | { type?: string; columnId?: number }
      | undefined;
    const overCardId = over.id as number;

    // 같은 컬럼 내 순서 변경: arrayMove로 최종 위치 확정
    if (
      overData?.type === 'card' &&
      overData.columnId === currentColumnId &&
      activeId !== overCardId
    ) {
      const cards = columnCardsRef.current[currentColumnId]?.cards ?? [];
      const oldIdx = cards.findIndex((c) => c.id === activeId);
      const newIdx = cards.findIndex((c) => c.id === overCardId);

      if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
        setColumnCards((prev) => ({
          ...prev,
          [currentColumnId]: {
            ...prev[currentColumnId],
            cards: arrayMove(prev[currentColumnId].cards, oldIdx, newIdx),
          },
        }));
      }
    }

    // 원래 컬럼 찾기 (API 호출 여부 판단)
    const savedClone = clonedCardsRef.current;
    clonedCardsRef.current = null;

    if (!savedClone) return;

    let originalColumnId: number | null = null;
    for (const [colId, state] of Object.entries(savedClone)) {
      if (state.cards.some((c) => c.id === activeId)) {
        originalColumnId = Number(colId);
        break;
      }
    }

    /**
     * 드래그 완료 후 영향받은 컬럼의 최종 순서를 localStorage에 저장.
     * setColumnCards 콜백 안에서 prev를 읽어야 arrayMove 적용 후의
     * 최신 state를 기준으로 저장할 수 있음.
     */
    const colsToSave = new Set<number>();
    colsToSave.add(currentColumnId);
    if (originalColumnId !== null) colsToSave.add(originalColumnId);

    setColumnCards((prev) => {
      for (const colId of colsToSave) {
        saveColumnOrder(
          colId,
          (prev[colId]?.cards ?? []).map((c) => c.id),
        );
      }
      return prev; // state 변경 없이 최신 값만 읽음
    });

    // 컬럼이 바뀐 경우에만 API 호출
    if (originalColumnId !== null && originalColumnId !== currentColumnId) {
      try {
        await updateCard(activeId, { columnId: currentColumnId });
      } catch {
        // API 실패 시 state와 localStorage 모두 롤백
        setColumnCards(savedClone);
        for (const [colId, state] of Object.entries(savedClone)) {
          saveColumnOrder(
            Number(colId),
            state.cards.map((c) => c.id),
          );
        }
      }
    }
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
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
                onLoadMore={handleLoadMore}
                isLoadingMore={loadingColumnIds.has(column.id)}
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

          {/* 드래그 중 ghost 카드 */}
          <DragOverlay>
            {activeCard && (
              <div className="rotate-2 shadow-xl opacity-95">
                <TaskCard
                  card={activeCard.card}
                  columnId={activeCard.columnId}
                  onClick={() => {}}
                  isDragOverlay
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* 카드 상세 모달 (오버레이는 Cards.tsx 내부에서 처리) */}
      {isCardModalOpen && (
        <Cards onModalClose={handleCardModalClose} cardId={selectedCardId!} />
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

      {/* 할 일 생성 모달 */}
      {createCardColumnId !== null && (
        <CreateCard
          onModalClose={() => setCreateCardColumnId(null)}
          dashboardId={dashboardId}
          columnId={createCardColumnId}
        />
      )}
    </div>
  );
}
