/**
 * @file StatusConfig.tsx
 * @description 진행 상태 정의 관리용 컴포넌트입니다.
 * @author 수경
 */

export type Status = 'todo' | 'in-progress' | 'done';

export const STATUSES: Record<Status, { label: string }> = {
  todo: {
    label: 'To Do',
  },
  'in-progress': {
    label: 'in Progress',
  },
  done: {
    label: 'Done',
  },
};

// id → 상태 객체 빠른 조회용
// export const STATUS_MAP = Object.fromEntries(STATUSES.map((s) => [s.id, s]));
