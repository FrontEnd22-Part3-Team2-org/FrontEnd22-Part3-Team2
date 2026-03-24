/**
 * @file ReplyItem.tsx
 * @description 할 일 카드 모달 내 댓글 리스트 컴포넌트입니다.
 *
 *
 * @author 수경
 *
 */

import UserProfileImage from '@/components/common/User/UserProfileImage';
import { ProfileOwner } from '@/types/user';

// TODO: [수경] API 연동 후 하드코딩 삭제
interface Props {
  user: ProfileOwner | null;
}

export default function ReplyItem({ user }: Props) {
  if (!user) return null; // null이면 렌더링 안함

  return (
    <>
      <div className="flex items-start mt-4 gap-[10px]">
        <UserProfileImage profile={user} />
        <div className="flex flex-col gap-[6px]">
          {/* 작성자 이름, 작성 날짜 */}
          <div className="flex items-center gap-2">
            <span className="text-md-semibold leading-4">정만철</span>
            <p className="text-gray-400 text-xs-regular">2026.03.23 14:00</p>
          </div>

          {/* 댓글 내용 */}
          <div className="text-md-regular leading-4">
            오늘 안에 CCC까지 만들 수 있을까요?
          </div>

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
