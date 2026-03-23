/**
 * @file UserName.tsx
 * @description 사용자의 프로필 이미지와 이름이 보이는 컴포넌트입니다.
 *
 * ### 컴포넌트 로직
 * 1. prop으로 담당자의 id, nickname, profileImageUrl 데이터 내려받기
 * 2. UserProfileImage.tsx 로 profileImageUrl를 내려줌
 *
 * @author 수경
 *
 */

import { Assignee } from '@/types/dashboard';
import UserProfileImage from './UserProfileImage';

interface Props {
  assignee: Assignee;
}

export default function UserName({ assignee }: Props) {
  const { nickname } = assignee;

  return (
    <div className="flex items-center gap-2 py-1 rounded-2xl">
      <div className="w-[26px] aspect-square rounded-full border-white border-2 overflow-hidden">
        <UserProfileImage assignee={assignee} />
      </div>
      <p className="text-gray-700 text-lg-regular">{nickname}</p>
    </div>
  );
}
