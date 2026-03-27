'use client';
/**
 * @file Cards.tsx
 * @description 할 일 카드 모달 컴포넌트입니다.
 *
 * ### 호출되는 API
 * 1. 카드 상세 조회 API
 * 2. 컬럼 목록 조회 API → 컬럼명 가져오기 위해서
 * 2. 댓글 API
 *
 * ### 컴포넌트 흐름
 * - 케밥 드롭다운 버튼
 * 1. 수정하기 버튼 클릭 → EditCard 컴포넌트 렌더링, setIsEditing을 true로
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
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  Card,
  Column,
  Comments,
  CommentsResponse,
} from '@/types/dashboard';
import AssigneeItem from './AssigneeItem';
import ReplyItem from './ReplyItem';
import Image from 'next/image';
import ModalBase from '@/components/common/ModalBase';
import ConfirmModal from '../ConfirmModal';
import EditCard from './EditCard';
import ModalOverlay from '@/components/common/ModalBase/ModalOverlay';
import { deleteCard, getColumns, getComments, readCard } from '@/api/dashboard';
import { useQuery } from '@tanstack/react-query';

interface CardsProps {
  onModalClose: () => void;
  cardId: number;
}

export default function Cards({ onModalClose, cardId }: CardsProps) {
  const [card, setCard] = useState<Card | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [columnTitle, setColumnTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 카드 상세 조회 로딩
  const [error, setError] = useState<string | null>(null);

  /** 댓글 관련 상태 관리 */
  const [hasComments, setHasComments] = useState(false); // 댓글 유무 확인
  const [commentsList, setCommentsList] = useState<CommentsResponse | null>(
    null,
  );

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

  const handleDeleteCard = async () => {
    try {
      await deleteCard(cardId);
      console.log(cardId, '삭제 완료');
    } catch (error) {
      console.error('카드 삭제 실패', error);
    } finally {
    }
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

  /** 1️⃣ 카드 조회 */
  const fetchCardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await readCard(cardId);
      setCard(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [cardId]);

  useEffect(() => {
    fetchCardData();
  }, [fetchCardData]);

  /** 2️⃣ 댓글 목록 조회  */
  useEffect(() => {
    if (!cardId) return;

    const fetchComments = async () => {
      try {
        const res = await getComments(cardId);
        console.log(res);
        setCommentsList(res);
        setHasComments(res.comments.length > 0);
      } catch (error) {
        console.error('댓글 조회 실패', error);
      }
    };

    fetchComments();
  }, [cardId]);

  /** 2️⃣ 컬럼 조회  */
  useEffect(() => {
    if (!card?.dashboardId) return;

    const fetchColumns = async () => {
      try {
        const res = await getColumns(card.dashboardId);
        setColumns(res.data);
      } catch (error) {
        console.error('컬럼 조회 실패', error);
      }
    };

    fetchColumns();
  }, [card?.dashboardId]);

  /** 3️⃣ columnTitle 찾기 */
  useEffect(() => {
    if (!card?.columnId || columns.length === 0) return;

    const foundColumn = columns.find((col) => col.id === card.columnId);

    setColumnTitle(foundColumn?.title ?? '');
  }, [card?.columnId, columns]);

  /** 수정 완료 핸들러 */
  const handleEditSuccess = () => {
    console.log('수정 완료!');

    setIsEditing(false); // 모달 닫기
    fetchCardData();
  };

  if (isLoading) {
    return (
      <ModalOverlay onClose={onModalClose}>
        <p className="text-gray-400">{isLoading ?? '불러오는 중'}</p>
      </ModalOverlay>
    );
  }
  if (error || !card) {
    return (
      <ModalOverlay onClose={onModalClose}>
        <p className="text-gray-400">{error ?? '카드를 찾을 수 없습니다.'}</p>
      </ModalOverlay>
    );
  }

  const { title, description, tags, dueDate, assignee, imageUrl } = card ?? {};

  /** 수정하기 버튼 클릭시 수정 모달 렌더링 */
  if (isEditing) {
    return (
      <EditCard
        cardData={card}
        columns={columns}
        columnTitle={columnTitle}
        onModalClose={onModalClose}
        onSuccess={handleEditSuccess}
      />
    );
  }

  return (
    <>
      <ModalOverlay onClose={onModalClose}>
        <ModalBase className="relative w-full md:w-fit max-h-[calc(100vh-110px)] overflow-y-auto flex flex-col-reverse md:flex-row md:gap-[14px] gap-4 text-gray-700 rounded-lg px-[30px] py-6 mx-6 md:m-0">
          {/* 좌측 영역 - 제목, 진행 상태 및 태그, 내용, 댓글 */}
          <div className="flex flex-col md:max-w-[450px] md:min-w-[450px]">
            {/* 제목 */}
            <header className="mb-2 md:mb-6">
              <h2 className="text-2xl-bold break-words">{title}</h2>
            </header>

            {/* 담당자 컴포넌트 - 모바일용 */}
            <div className="md:hidden mb-4">
              <AssigneeItem assignee={assignee} dueDate={dueDate} />
            </div>

            {/* 진행 상태 및 태그 */}
            <div className="flex items-center gap-5 mb-4 md:mb-[17px] min-h-8">
              {/* 진행 상태 */}
              <StatusChip status={columnTitle} />
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
            <p className="box-content min-h-[100px] p-[10px] mb-8 md:mb-2 text-md-regular">
              {description}
            </p>

            {/* 이미지 섹션: 이미지가 있을 때만 렌더링 */}
            {imageUrl && (
              <div className="relative w-full h-[160px] md:max-w-[445px] overflow-hidden md:min-h-[260px] rounded-md bg-gray-300 mb-6 md:mb-4 overflow-hidden">
                <Image
                  src={imageUrl}
                  alt="할 일 카드 이미지"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            {/* 댓글 섹션 */}
            <section className="flex flex-col">
              <p className="mb-1 text-lg-medium">댓글</p>
              {/* 댓글 인풋 */}
              {/* TODO : [수경] Server Action 연동을 위한 form, CSS 수정 */}
              <Textarea placeholder="댓글 작성하기" />
              {/* 댓글 리스트 */}
              <div className="max-h-[100px] mb-0 mt-4 md:mb-6 md:mt-6 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-300 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full">
                {hasComments ? (
                  <>
                    {commentsList?.comments.map((comment) => {
                      return <ReplyItem key={comment.id} comment={comment} />;
                    })}
                  </>
                ) : (
                  <div className="text-md-medium">댓글이 없습니다.</div>
                )}
              </div>
            </section>
          </div>

          {/* 우측 영역 - 메뉴, 닫기 버튼, 담당자 */}
          <div className="flex flex-col items-end gap-6 min-w-[200px] w-full">
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
        {/* 삭제하기 버튼 클릭시 확인 모달 렌더링 */}
        {isDeleting && (
          <div className="absolute z-20 flex items-center justify-center shadow-lg">
            <ConfirmModal
              message="정말 카드를 삭제하겠습니까?"
              onCancel={() => setIsDeleting(false)}
              onConfirm={() => {
                // TODO: 카드 삭제 API 호출
                onModalClose();
                handleDeleteCard();
              }}
            />
          </div>
        )}
      </ModalOverlay>
    </>
  );
}
