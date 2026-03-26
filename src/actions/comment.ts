/**
 * @file comments.ts
 * @description 댓글 관련 서버 액션을 정의한 파일입니다.
 *
 * ### 주요 기능
 * 1. 댓글 생성 (createCommentAction)
 * 2. 댓글 수정 (updateCommentAction)
 * 3. 댓글 삭제 (deleteCommentAction)
 *
 * ### 동작 방식
 * - 클라이언트 컴포넌트의 form에서 action으로 호출됨
 * - FormData를 통해 필요한 값 전달받음
 * - API 함수 호출 후 revalidatePath로 데이터 갱신
 *
 * ### 사용 위치
 * - Cards.tsx (댓글 작성)
 * - ReplyItem.tsx (댓글 수정/삭제)
 *
 * @author 수경
 */

'use server';

import { revalidatePath } from 'next/cache';
// import { createComment, updateComment, deleteComment } from '@/api/dashboard';

/**
 * @function createCommentAction
 * @description 댓글 생성 서버 액션
 *
 * @param formData - form에서 전달된 데이터
 * - content: 댓글 내용
 * - cardId: 카드 ID
 */
// export async function createCommentAction(formData: FormData) {
//   const content = formData.get('content') as string;
//   const cardId = Number(formData.get('cardId'));

//   try {
//     await createComment({ content, cardId });
//   } catch (error) {
//     console.error('댓글 생성 실패', error);
//     throw error;
//   }

//   revalidatePath('/dashboard');
// }
