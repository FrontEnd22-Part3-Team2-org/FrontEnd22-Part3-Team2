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

import UserProfileImage from './UserProfileImage';

/**
 * 임시로 정의한 타입입니다.
 */

// TODO : [수경] API 연동 후 재정의 필요
interface Assignee {
  id: number;
  nickname: string;
  profileImageUrl: string;
}

interface Props {
  assignee: Assignee;
}

export default function UserName({ assignee }: Props) {
  const { id, nickname, profileImageUrl } = assignee;

  return (
    <div className="flex items-center gap-2 py-1 rounded-2xl">
      <div className="w-[26px] aspect-square rounded-full border-white border-2 overflow-hidden">
        <UserProfileImage src={profileImageUrl} name={nickname} />
      </div>
      <p className="text-gray-700 text-lg-regular">{nickname}</p>
    </div>
  );
}
