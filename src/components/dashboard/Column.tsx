'use client';

/**
 * @file Column.tsx
 * @description 칸반 보드의 단일 컬럼 컴포넌트입니다.
 *
 * @notes
 * - 컬럼 헤더: 색상 점 + 제목 + 카드 수 chip + 톱니바퀴(수정) 아이콘
 * - '+' 버튼 클릭 → 할 일 생성 모달 오픈 (onAddCard 콜백)
 * - 톱니바퀴 클릭 → 컬럼 수정 모달 오픈 (onEditColumn 콜백)
 * - 카드 클릭 → 카드 상세 모달 오픈 (onCardClick 콜백)
 * - 카드 목록은 세로 스크롤, 무한 스크롤 지원 (cursorId 기반)
 * - 반응형: mobile 284px / tablet(md) 544px / desktop(lg) 354px
 */

import type { Card, Column as ColumnType } from '@/types/dashboard';
import Button from '@/components/common/Button';
import SettingIcon from '@/components/common/Icon/SettingIcon';
import CountCardChip from '@/components/common/Chip/CountCardChip';
import TaskCard from './TaskCard';

/** 컬럼 상단 색상 점에 사용할 색상 팔레트 (컬럼 순서에 따라 순환) */
const COLUMN_COLORS = [
  '#760DDE', // purple
  '#FFA500', // orange
  '#76A5EA', // blue
  '#7AC555', // green
  '#E876EA', // pink
];

interface ColumnProps {
  column: ColumnType;
  cards: Card[];
  totalCount: number;
  colorIndex: number;
  /** 할 일 추가 모달 오픈 */
  onAddCard: (columnId: number) => void;
  /** 컬럼 수정 모달 오픈 */
  onEditColumn: (column: ColumnType) => void;
  /** 카드 상세 모달 오픈 */
  onCardClick: (card: Card) => void;
  /** 추가 카드 로드 (무한 스크롤) */
  onLoadMore?: (columnId: number, cursorId: number) => void;
  cursorId?: number | null;
}

export default function Column({
  column,
  cards,
  totalCount,
  colorIndex,
  onAddCard,
  onEditColumn,
  onCardClick,
}: ColumnProps) {
  const dotColor = COLUMN_COLORS[colorIndex % COLUMN_COLORS.length];

  return (
    <div
      className={[
        'flex flex-col shrink-0',
        'w-full lg:w-[354px]',
        'border-b lg:border-b-0 lg:border-r border-gray-200',
        'pb-4 lg:pb-0',
      ].join(' ')}
    >
      {/* ── 컬럼 헤더 ── */}
      <div className="flex items-center justify-between px-4 md:px-5 h-[64px] shrink-0">
        {/* 왼쪽: 색상 점 + 제목 + 카드 수 */}
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: dotColor }}
          />
          <span className="text-lg-bold md:text-xl-bold text-gray-700">
            {column.title}
          </span>
          <CountCardChip />
        </div>

        {/* 오른쪽: 톱니바퀴 버튼 */}
        <button
          type="button"
          onClick={() => onEditColumn(column)}
          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          aria-label={`${column.title} 컬럼 수정`}
        >
          <SettingIcon width={24} height={24} />
        </button>
      </div>

      {/* ── '+' 할 일 추가 버튼 ── */}
      <div className="px-4 md:px-5 mb-4 shrink-0">
        <Button
          variant="secondary"
          size="add_todo"
          onClick={() => onAddCard(column.id)}
          className="w-full md:w-full lg:w-[314px]"
          aria-label="할 일 추가"
        >
          <span className="w-4 h-4 flex items-center justify-center rounded bg-brand-violet-light text-brand-violet text-lg-bold leading-none">
            +
          </span>
        </Button>
      </div>

      {/* ── 카드 목록 (세로 스크롤) ── */}
      <div className="flex-1 overflow-y-auto px-4 md:px-5 flex flex-col gap-2">
        {cards.map((card) => (
          <TaskCard key={card.id} card={card} onClick={onCardClick} />
        ))}

        {/* 더 불러올 카드가 있을 때 표시 (무한 스크롤 트리거 자리) */}
        {totalCount > cards.length && (
          <p className="text-center text-xs-regular text-gray-400 py-2">
            스크롤하여 더 보기
          </p>
        )}
      </div>
    </div>
  );
}
