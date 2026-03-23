/**
 * @file UserProfileImage.tsx
 * @description 사용자의 프로필 이미지를 렌더링하는 컴포넌트입니다.
 *
 * ### 컴포넌트 로직
 * 1. 이미지 URL이 있으면 → 프로필 이미지 표시
 * 2. 없으면 → 이니셜 UI 표시
 * 3. 공통 사이즈 / 스타일 유지
 *
 * @author 수경
 */

import { Assignee } from '@/types/dashboard';
import Image from 'next/image';

interface Props {
  assignee: Assignee;

  /** @default 26px */
  size?: number;
}

export default function UserProfileImage({ assignee, size = 26 }: Props) {
  const { id, nickname, profileImageUrl } = assignee;

  /**
   * 이미지 존재 여부
   * - src 값이 있으면 true, 없으면 false
   */
  const hasImage = !!profileImageUrl;

  /**
   * 이니셜 생성 로직
   * - 이름 첫 글자 추출
   */
  const initial = nickname?.[0] ?? '?';

  return (
    <>
      {hasImage ? (
        <Image
          src={profileImageUrl}
          alt="담당자 프로필"
          width={size}
          height={size}
          className="object-cover"
          unoptimized // 테스트용 - 도메인 허용 안하고 unoptimized 추가
        />
      ) : (
        <div
          style={{ width: size }}
          className={`aspect-square rounded-full bg-brand-violet flex items-center justify-center`}
        >
          <span className="text-white text-xs-semibold">{initial}</span>
        </div>
      )}
    </>
  );
}
