/**
 * @file StatusConfig.tsx
 * @description 진행 상태 정의 관리용 컴포넌트입니다.
 * 현재는 하드코딩용으로 사용.
 * 추후에 Columus API와 연결 또는 아예 API로 관리해야되는 컴포넌트
 *
 * @author 수경
 */

export const STATUS_LIST = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
} as const;

export type Status = (typeof STATUS_LIST)[keyof typeof STATUS_LIST];
