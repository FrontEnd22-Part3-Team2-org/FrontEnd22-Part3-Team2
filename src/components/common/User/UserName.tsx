/**
 * @file UserName.tsx
 * @description 사용자의 프로필 이미지와 이름이 보이는 컴포넌트입니다.
 *
 * @author 수경
 */

/**
 * 임시 타입 정의
 */
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
  console.log(assignee);
  return (
    <div className="flex items-center gap-2 py-1 rounded-2xl">
      <div className="w-[26px] aspect-square rounded-full border-white border-2 overflow-hidden">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt="담당자 프로필"
            width={26}
            height={26}
          />
        ) : (
          <div className="w-full h-full rounded-full bg-brand-violet flex items-center justify-center">
            <span className="text-xs-semibold">K</span>
          </div>
        )}
      </div>
      <p className="text-gray-700 text-lg-regular">{nickname}</p>
    </div>
  );
}
