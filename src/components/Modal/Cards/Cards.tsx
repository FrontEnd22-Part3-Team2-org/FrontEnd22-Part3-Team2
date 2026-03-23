'use client';
/**
 * @file Cards.tsx
 * @description 할 일 카드 모달 컴포넌트입니다.
 *
 * ### 호출 필요한 API
 * 1. 카드 상세 조회 API
 * 2. 댓글 API
 *
 *
 * @author 수경
 *
 */

import StatusChip from '../../common/Chip/StatusChip';
import TagChip from '../../common/Chip/TagChip';
import { Textarea } from '../../common/Input';
import KebabMenuIcon from '../../common/Icon/KebabMenuIcon';
import XIcon from '../../common/Icon/XIcon';
import DropdownMenu from '../../common/Dropdown/DropdownMenu';
import { useState } from 'react';
import type { Assignee } from '@/types/dashboard';
import AssigneeItem from './AssigneeItem';
import ReplyItem from './ReplyItem';
import Image from 'next/image';

// TODO: [수경] API 연동 후 목데이터 삭제
const MOCK_TAGS: string[] = ['프로젝트', '일반', '백엔드', '상'];
const MOCK_ASSIGNEE: Assignee = {
  id: 1,
  nickname: '공민수',
  profileImageUrl: 'https://i.pravatar.cc/150?img=1',
};

export default function Cards() {
  /** 드롭다운 열림 상태 */
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  /** 수정하기, 삭제하기 드롭다운 메뉴 핸들러 */
  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  /** 수정하기 클릭 */
  const handleEditClick = () => {
    console.log('수정하기 클릭');
    setIsMenuOpen(false); // 메뉴 닫기
  };

  /** 삭제하기 클릭 */
  const handleDeleteClick = () => {
    console.log('삭제하기 클릭');
    setIsMenuOpen(false); // 메뉴 닫기
  };
  return (
    <div className="flex flex-col-reverse md:flex-row gap-[14px] bg-white text-gray-700 rounded-lg px-[30px] py-[18px] ">
      {/* 카드 컨텐츠 */}
      <div className="flex flex-col">
        {/* 제목 */}
        <p className="mb-2 md:mb-6 text-2xl-bold">새로운 일정 관리</p>

        {/* 반응형 - 모바일일 때 */}
        <div className="block md:hidden mb-4">
          <AssigneeItem assignee={MOCK_ASSIGNEE} />
        </div>

        {/* 진행 상태 및 태그 */}
        <div className="flex items-center gap-5 mb-4 md:mb-[17px]">
          {/* 진행 상태 */}
          <StatusChip status="To Do" />
          {/* 구분선 */}
          <div className="w-[1px] h-5 bg-gray-300"></div>
          {/* 태그 */}
          <div className="flex items-center gap-[6px]">
            {MOCK_TAGS.map((tag) => {
              return (
                <div key={tag}>
                  <TagChip label={tag} />
                </div>
              );
            })}
          </div>
        </div>

        {/* 설명 */}
        <div className="p-[10px] mb-8 md:mb-2 text-md-regular">
          스프린트 12 아젠다 논의
        </div>

        {/* 이미지 - 확인을 위해 임시 작성 */}
        <div className="relative w-auto h-[160px] md:max-w-[445px] md:min-h-[200px] rounded-md bg-gray-300 mb-6 md:mb-4 overflow-hidden">
          <Image
            src="https://blog.slido.com/wp-content/uploads/2023/10/slido-blog-cover-1600x1066px-1.jpg"
            alt="미팅 이미지"
            fill
            className="object-cover"
            unoptimized // TODO [수경] 임시 - 도메인 허용 안하고 unoptimized 추가
          />
        </div>

        {/* 댓글 */}
        <div>
          <p className="mb-1 text-lg-medium">댓글</p>
          {/* 댓글 인풋 */}
          <Textarea placeholder="댓글 작성하기" />
          {/* 댓글 리스트 */}
          <div className="max-h-[100px] mt-4 md:mt-6 overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-300 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full">
            <ReplyItem user={MOCK_ASSIGNEE} />
            <ReplyItem user={MOCK_ASSIGNEE} />
            <ReplyItem user={MOCK_ASSIGNEE} />
            <ReplyItem user={MOCK_ASSIGNEE} />
          </div>
        </div>
      </div>

      {/* 메뉴 및 모달 닫기 버튼, 담당자 정보 */}
      <div className="flex flex-col items-end gap-6">
        <div className="flex gap-6 relative">
          {/* 메뉴 */}
          <button onClick={handleMenuToggle}>
            <KebabMenuIcon className="w-7 aspect-square" />
          </button>

          {/* 드롭다운 메뉴 */}
          {isMenuOpen && (
            <div className="absolute top-8 right-[53px]">
              <DropdownMenu
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            </div>
          )}

          {/* 모달 닫기 버튼 */}
          <button>
            <XIcon className="w-7 aspect-square" />
          </button>
        </div>

        {/* 담당자 */}
        <div className="hidden md:block">
          <AssigneeItem assignee={MOCK_ASSIGNEE} />
        </div>
      </div>
    </div>
  );
}
