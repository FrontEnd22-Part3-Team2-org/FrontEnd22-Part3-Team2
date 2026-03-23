/**
 * @file TaskCard.tsx
 * @description 칸반 보드의 할 일 카드 컴포넌트입니다.
 * 카드를 클릭하면 상세 모달이 열립니다.
 *
 * @notes
 * - 이미지가 있는 경우 카드 상단에 썸네일로 표시됩니다.
 * - 태그는 배경색 랜덤 적용 (TagChip 컴포넌트 사용)
 * - 담당자 프로필 이미지 또는 이니셜 아바타 표시
 */

import Image from 'next/image';
import type { Card } from '@/types/dashboard';
import CalendarIcon from '@/components/common/Icon/CalendarIcon';
import TagChip from '@/components/common/Chip/TagChip';
import UserProfileImage from '@/components/common/User/UserProfileImage';

interface TaskCardProps {
  card: Card;
  /** 카드 클릭 시 상세 모달 오픈 핸들러 */
  onClick: (card: Card) => void;
}

export default function TaskCard({ card, onClick }: TaskCardProps) {
  const { title, tags, dueDate, assignee, imageUrl } = card;

  return (
    <button
      type="button"
      onClick={() => onClick(card)}
      className="w-full text-left bg-white rounded-lg border border-gray-300 p-4 hover:border-brand-violet transition-colors group"
    >
      {/* 썸네일 이미지 */}
      {imageUrl && (
        <div className="relative w-full h-[160px] rounded-md overflow-hidden mb-3">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      {/* 제목 */}
      <p className="text-md-bold md:text-lg-bold text-gray-700 mb-2 truncate">
        {title}
      </p>

      {/* 태그 목록 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.map((tag) => (
            <TagChip key={tag} label={tag} />
          ))}
        </div>
      )}

      {/* 하단: 마감일 + 담당자 */}
      <div className="flex items-center justify-between mt-2">
        {dueDate ? (
          <div className="flex items-center gap-1 text-gray-400">
            <CalendarIcon width={14} height={14} />
            <span className="text-xs-regular">{dueDate}</span>
          </div>
        ) : (
          <span />
        )}

        {assignee && (
          <div className="w-[26px] h-[26px] rounded-full overflow-hidden shrink-0 ring-2 ring-white">
            <UserProfileImage
              src={assignee.profileImageUrl ?? ''}
              name={assignee.nickname}
            />
          </div>
        )}
      </div>
    </button>
  );
}
