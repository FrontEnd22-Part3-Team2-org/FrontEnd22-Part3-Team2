'use client';
/**
 * @file Cards.tsx
 * @description 할 일 카드 모달 컴포넌트입니다.
 *
 * ### 호출 필요한 API
 * 1. 카드 상세 조회 API
 * 2. 댓글 API
 *
 * ### 컴포넌트 흐름
 * - 케밥 드롭다운 버튼
 * 1. 수정하기 버튼 클릭 → 수정 컴포넌트 렌더링, setIsEditing을 true로
 * 2. 삭제하기 버튼 클릭 → ConfirmModal 렌더링, setIsDeleting을 true로
 *
 * - X 닫기 버튼
 * 1. onModalClose로 모달 닫아짐
 *
 * - 댓글 버튼
 * 1. 수정/삭제
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
import { useEffect, useRef, useState } from 'react';
import type { Card } from '@/types/dashboard';
import AssigneeItem from './AssigneeItem';
import ReplyItem from './ReplyItem';
import Image from 'next/image';
import ModalBase from '@/components/common/ModalBase';
import ConfirmModal from '../ConfirmModal';

// TODO: [수경] API 연동 후 목데이터 삭제
const MOCK_CARD: Card = {
  id: 120,
  title: '새로운 일정 관리',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum finibus nibh arcu, quis consequat ante cursus eget. Cras mattis, nulla non laoreet porttitor, diam justo laoreet eros, vel aliquet diam elit at leo.',
  tags: ['프로젝트', '일반', '백엔드', '상'],
  dueDate: '2026.03.23 23:58',
  assignee: {
    id: 1,
    nickname: '공민수',
    profileImageUrl: 'https://i.pravatar.cc/150?img=1',
  },
  imageUrl:
    'https://blog.slido.com/wp-content/uploads/2023/10/slido-blog-cover-1600x1066px-1.jpg',
  teamId: '541',
  columnId: 30,
  dashboardId: 24,
  createdAt: '2026.03.23 23:58',
  updatedAt: '2026.03.23 23:58',
};

interface CardsProps {
  onModalClose: () => void;
}

export default function Cards({ onModalClose }: CardsProps) {
  const { title, description, tags, dueDate, assignee, imageUrl } = MOCK_CARD;
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /** 드롭다운 열림 상태 */
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleCloseMenu = () => setIsMenuOpen(false);
  const handleEditClick = () => {
    setIsEditing(true);
    handleCloseMenu();
  };
  const handleDeleteClick = () => {
    setIsDeleting(true);
  };

  /** 드롭다운 외부 클릭 시 닫기 구현 */
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        handleCloseMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  /** 수정하기 버튼 클릭시 수정 모달 렌더링 */
  // if (isEditing) {
  //   return <EditCard onModalClose={onModalClose} />;
  // }

  return (
    // 오버레이 배경
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <ModalBase className="relative z-10 max-h-[calc(100vh-320px)] overflow-y-auto flex flex-col-reverse md:flex-row gap-[14px] text-gray-700 rounded-lg px-[30px] py-[18px] ">
        {/* 좌측 영역 - 제목, 진행 상태 및 태그, 내용, 댓글 */}
        <div className="flex flex-col max-w-[450px]">
          {/* 제목 */}
          <header className="mb-2 md:mb-6">
            <h2 className="text-2xl-bold break-words">{title}</h2>
          </header>

          {/* 담당자 컴포넌트 - 모바일용 */}
          <div className="md:hidden mb-4">
            <AssigneeItem assignee={assignee} dueDate={dueDate} />
          </div>

          {/* 진행 상태 및 태그 */}
          <div className="flex items-center gap-5 mb-4 md:mb-[17px]">
            {/* 진행 상태 */}
            <StatusChip status="To Do" />
            {/* 구분선 */}
            <div className="w-[1px] h-5 bg-gray-300"></div>
            {/* 태그 */}
            <div className="flex items-center gap-[6px]">
              {tags.map((tag) => {
                return (
                  <div key={tag}>
                    <TagChip label={tag} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 설명 */}
          <p className="p-[10px] mb-8 md:mb-2 text-md-regular">{description}</p>

          {/* 이미지 섹션: 이미지가 있을 때만 렌더링 */}
          {imageUrl && (
            <div className="relative w-auto h-[160px] md:max-w-[445px] md:min-h-[200px] rounded-md bg-gray-300 mb-6 md:mb-4 overflow-hidden">
              <Image
                src={imageUrl}
                alt="미팅 이미지"
                fill
                className="object-cover"
                unoptimized // TODO [수경] 임시 - 도메인 허용 안하고 unoptimized 추가
              />
            </div>
          )}

          {/* 댓글 섹션 */}
          <section className="flex flex-col gap-4">
            <p className="mb-1 text-lg-medium">댓글</p>
            {/* 댓글 인풋 */}
            {/* TODO : [수경] Server Action 연동을 위한 form */}
            <Textarea placeholder="댓글 작성하기" />
            {/* 댓글 리스트 */}
            <div className="max-h-[100px] mt-4 md:mt-6 overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-300 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full">
              <ReplyItem user={assignee} />
              <ReplyItem user={assignee} />
              <ReplyItem user={assignee} />
              <ReplyItem user={assignee} />
            </div>
          </section>
        </div>

        {/* 우측 영역 - 메뉴, 닫기 버튼, 담당자 */}
        <div className="flex flex-col items-end gap-6">
          <div className="flex gap-6 relative">
            {/* 메뉴 */}
            <button onClick={() => setIsMenuOpen((prev) => !prev)}>
              <KebabMenuIcon className="w-7 aspect-square" />
            </button>

            {/* 드롭다운 메뉴 */}
            {isMenuOpen && (
              <div className="absolute top-8 right-[53px]" ref={menuRef}>
                <DropdownMenu
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              </div>
            )}

            {/* 모달 닫기 버튼 */}
            <button onClick={onModalClose}>
              <XIcon className="w-7 aspect-square" />
            </button>
          </div>

          {/* 담당자 컴포넌트 - 데스크탑 */}
          <div className="hidden md:block">
            <AssigneeItem assignee={assignee} dueDate={dueDate} />
          </div>
        </div>
      </ModalBase>

      {/* 삭제하기 버튼 클릭시 수정 모달 렌더링 */}
      {isDeleting && (
        <div className="absolute z-20 flex items-center justify-center shadow-lg">
          <ConfirmModal
            message="정말 카드를 삭제하겠습니까?"
            onCancel={() => setIsDeleting(false)}
            onConfirm={() => {
              // TODO: 카드 삭제 API 호출
              onModalClose();
            }}
          />
        </div>
      )}
    </div>
  );
}
