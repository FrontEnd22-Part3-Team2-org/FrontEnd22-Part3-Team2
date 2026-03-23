/**
 * @file 대시보드 관련 API 함수 모음
 * @description 대시보드, 칼럼, 할 일 카드, 멤버 CRUD API를 모아둔 파일입니다.
 * @author 하늘
 */

import api from './axios';
import type {
  Dashboard,
  ColumnsResponse,
  CardsResponse,
  MembersResponse,
} from '@/types/dashboard';

/** 대시보드 단건 조회 */
export async function getDashboard(dashboardId: number): Promise<Dashboard> {
  const { data } = await api.get<Dashboard>(`/dashboards/${dashboardId}`);
  return data;
}

/** 칼럼 목록 조회 */
export async function getColumns(
  dashboardId: number,
): Promise<ColumnsResponse> {
  const { data } = await api.get<ColumnsResponse>('/columns', {
    params: { dashboardId },
  });
  return data;
}

/** 할 일 카드 목록 조회 (커서 기반 페이지네이션) */
export async function getCards(
  columnId: number,
  size = 10,
  cursorId?: number,
): Promise<CardsResponse> {
  const { data } = await api.get<CardsResponse>('/cards', {
    params: {
      columnId,
      size,
      ...(cursorId !== undefined ? { cursorId } : {}),
    },
  });
  return data;
}

/** 대시보드 멤버 목록 조회 */
export async function getMembers(
  dashboardId: number,
  page = 1,
  size = 20,
): Promise<MembersResponse> {
  const { data } = await api.get<MembersResponse>('/members', {
    params: { dashboardId, page, size },
  });
  return data;
}

/** 칼럼 생성 */
export async function createColumn(title: string, dashboardId: number) {
  const { data } = await api.post('/columns', { title, dashboardId });
  return data;
}

/** 칼럼 수정 */
export async function updateColumn(columnId: number, title: string) {
  const { data } = await api.put(`/columns/${columnId}`, { title });
  return data;
}

/** 칼럼 삭제 */
export async function deleteColumn(columnId: number) {
  await api.delete(`/columns/${columnId}`);
}

/** 할 일 카드 생성 */
export async function createCard(payload: {
  assigneeUserId?: number;
  dashboardId: number;
  columnId: number;
  title: string;
  description: string;
  dueDate?: string;
  tags?: string[];
  imageUrl?: string;
}) {
  const { data } = await api.post('/cards', payload);
  return data;
}

/** 할 일 카드 수정 */
export async function updateCard(
  cardId: number,
  payload: {
    columnId?: number;
    assigneeUserId?: number;
    title?: string;
    description?: string;
    dueDate?: string;
    tags?: string[];
    imageUrl?: string;
  },
) {
  const { data } = await api.put(`/cards/${cardId}`, payload);
  return data;
}

/** 할 일 카드 삭제 */
export async function deleteCard(cardId: number) {
  await api.delete(`/cards/${cardId}`);
}

/** 대시보드 초대하기 */
export async function inviteMember(dashboardId: number, email: string) {
  const { data } = await api.post(`/dashboards/${dashboardId}/invitations`, {
    email,
  });
  return data;
}
