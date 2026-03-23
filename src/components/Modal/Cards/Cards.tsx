'use client';
import StatusChip from '../../common/Chip/StatusChip';
import TagChip from '../../common/Chip/TagChip';
import { Textarea } from '../../common/Input';
import UserProfileImage from '../../common/User/UserProfileImage';
import KebabMenuIcon from '../../common/Icon/KebabMenuIcon';
import XIcon from '../../common/Icon/XIcon';
import DropdownMenu from '../../common/Dropdown/DropdownMenu';
import { useState } from 'react';
import type { Assignee } from '@/types/dashboard';
import AssigneeItem from './AssigneeItem';

// TODO: [수경] API 연동 전 목데이터
const MOCK_TAGS: string[] = ['프로젝트', '일반', '백엔드', '상'];
const MOCK_ASSIGNEE: Assignee = {
  id: 1,
  nickname: '공민수',
  // profileImageUrl: 'https://i.pravatar.cc/150?img=1',
  profileImageUrl: '',
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
    <div className="flex gap-[14px] bg-white text-gray-700 rounded-lg px-[30px] py-[18px] ">
      {/* 카드 컨텐츠 */}
      <div className="flex flex-col">
        {/* 제목 */}
        <p className="mb-6 text-2xl-bold">새로운 일정 관리</p>

        {/* 진행 상태 및 태그 */}
        <div className="flex items-center gap-5 mb-[17px]">
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
        <div className="p-[10px] mb-2 text-md-regular">
          스프린트 12 아젠다 논의
        </div>

        {/* 이미지 - 사이즈 확인을 위해 배경색 임시 작성 */}
        <div className="w-[445px] h-[100px] rounded-md bg-gray-300 mb-4"></div>

        {/* 댓글 */}
        <div className="">
          <p className="mb-1 text-lg-medium">댓글</p>
          {/* 댓글 인풋 */}
          <Textarea placeholder="댓글 작성하기" />
          {/* 댓글 리스트 */}
          <div className="flex items-start mt-6 gap-[10px]">
            <UserProfileImage profile={MOCK_ASSIGNEE} />
            <div className="flex flex-col gap-[6px]">
              {/* 작성자 이름, 작성 날짜 */}
              <div className="flex items-center gap-2">
                <span className="text-md-semibold leading-4">정만철</span>
                <p className="text-gray-400 text-xs-regular">
                  2026.03.23 14:00
                </p>
              </div>

              {/* 댓글 내용 */}
              <div className="text-md-regular leading-4">
                오늘 안에 CCC까지 만들 수 있을까요?
              </div>

              {/* 댓글 수정, 삭제 버튼 */}
              <div className="flex items-center gap-[14px] ">
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
        <AssigneeItem assignee={MOCK_ASSIGNEE} />
      </div>
    </div>
  );
}
