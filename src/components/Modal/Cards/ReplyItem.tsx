/**
 * @file ReplyItem.tsx
 * @description 할 일 카드 모달 내 댓글 리스트 컴포넌트입니다.
 *
 *
 * @author 수경
 *
 */

import UserProfileImage from '@/components/common/User/UserProfileImage';
import { Comments } from '@/types/dashboard';

interface Props {
  comment: Comments;
}

export default function ReplyItem({ comment }: Props) {
  if (!comment) return null; // null이면 렌더링 안함

  const { content, author, createdAt } = comment;

  return (
    <>
      <div className="flex items-start mt-4 gap-[10px]">
        <UserProfileImage profile={author} />
        <div className="flex flex-col gap-[6px]">
          {/* 작성자 이름, 작성 날짜 */}
          <div className="flex items-center gap-2">
            <span className="text-md-semibold leading-4">
              {author.nickname}
            </span>
            <p className="text-gray-400 text-xs-regular">{createdAt}</p>
          </div>

          {/* 댓글 내용 */}
          <div className="text-md-regular leading-4">{content}</div>

          {/* 댓글 수정, 삭제 버튼 */}
          <div className="flex items-center gap-2 md:gap-[14px]">
            <button
              type="button"
              className="text-xs text-gray-400 underline underline-offset-2"
            >
              수정
            </button>

            <button
              type="button"
              className="text-xs text-gray-400 underline underline-offset-2"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
