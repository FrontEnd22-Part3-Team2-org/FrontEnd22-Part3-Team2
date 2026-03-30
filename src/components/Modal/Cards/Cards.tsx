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
import KebabMenuIcon from '../../common/Icon/KebabMenuIcon';
import XIcon from '../../common/Icon/XIcon';
import DropdownMenu from '../../common/Dropdown/DropdownMenu';
import { useCallback, useEffect, useState } from 'react';
import type { Card, Column, CommentsResponse } from '@/types/dashboard';
import AssigneeItem from './AssigneeItem';
import ReplyItem from './ReplyItem';
import Image from 'next/image';
import ModalBase from '@/components/common/ModalBase';
import ConfirmModal from '../ConfirmModal';
import EditCard from './EditCard';
import ModalOverlay from '@/components/common/ModalBase/ModalOverlay';
import {
  deleteCard,
  deleteComments,
  getColumns,
  getComments,
  readCard,
} from '@/api/dashboard';
import { useDropdownClose } from '@/hooks/useToggle';
import CommentsForm from './CommentsForm';
import AlertModal from '../AlertModal';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // API 호출 에러 처리

  /** 댓글 관련 상태 관리 */
  const [commentsList, setCommentsList] = useState<CommentsResponse | null>(
    null,
  );
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(
    null,
  );

  /** 드롭다운 열림 상태 */
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleCloseMenu = () => setIsMenuOpen(false);

  /** 카드 수정하기 버튼 클릭 핸들러 */
  const handleEditClick = () => {
    setIsEditing(true);
    handleCloseMenu();
  };

  /** 카드 삭제하기 버튼 클릭 핸들러 */
  const handleDeleteClick = () => {
    setIsDeleting(true);
  };

  /** 카드 삭제 API 호출 핸들러 */
  const handleDeleteCard = async () => {
    try {
      await deleteCard(cardId);
      onModalClose();
    } catch (error) {
      console.error('카드 삭제 실패', error);
      setErrorMessage('카드 삭제에 실패했습니다.');
    } finally {
    }
  };

  /** 댓글 삭제 API 호출 핸들러 */
  const handleDeleteCommentConfirm = async () => {
    if (!deletingCommentId) return;
    try {
      await deleteComments(deletingCommentId);
      fetchComments();
    } catch (error) {
      console.error('댓글 삭제 실패', error);
    } finally {
      setDeletingCommentId(null);
    }
  };

  /** 수정 완료 핸들러 */
  const handleEditSuccess = () => {
    console.log('수정 완료!');

    setIsEditing(false); // 모달 닫기
    fetchCardData();
  };

  /** 드롭다운 외부 클릭 시 닫기 구현 */
  const menuRef = useDropdownClose(handleCloseMenu);

  /** 1️⃣ 카드 조회 */
  const fetchCardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await readCard(cardId);
      setCard(data);
    } catch (error) {
      console.error(error);
      setErrorMessage('카드 조회에 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [cardId]);

  useEffect(() => {
    fetchCardData();
  }, [fetchCardData]);

  /** 2️⃣ 댓글 목록 조회  */
  const fetchComments = useCallback(async () => {
    if (!cardId) return;

    try {
      const res = await getComments(cardId);
      setCommentsList(res);
    } catch (error) {
      console.error('댓글 조회 실패', error);
      setErrorMessage('댓글 목록 조회에 문제가 발생했습니다.');
    }
  }, [cardId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  /** 2️⃣ 컬럼 조회  */
  useEffect(() => {
    if (!card?.dashboardId) return;

    const fetchColumns = async () => {
      try {
        const res = await getColumns(card.dashboardId);
        setColumns(res.data);
      } catch (error) {
        console.error('컬럼 조회 실패', error);
        setErrorMessage('컬럼 조회에 문제가 발생했습니다.');
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

  if (!card) return;
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
              <div className="relative w-full h-[160px] md:max-w-[445px] overflow-hidden md:h-[260px] rounded-md bg-gray-300 mb-6 md:mb-4">
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
              {/* 댓글 인풋 */}
              <CommentsForm
                cardId={cardId}
                columnId={card.columnId}
                dashboardId={card.dashboardId}
                onSuccess={fetchComments}
              />
              {/* 댓글 리스트 */}
              <div className="max-h-[100px] mb-0 mt-4 md:mb-6 md:mt-6 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-300 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full">
                {commentsList?.comments?.length ? (
                  <>
                    {commentsList?.comments.map((comment) => {
                      return (
                        <ReplyItem
                          key={comment.id}
                          comment={comment}
                          onDeleteClick={(id) => setDeletingCommentId(id)}
                        />
                      );
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
        {/* 카드 삭제하기 버튼 클릭시 확인 모달 렌더링 */}
        {isDeleting && (
          <div className="absolute z-20 flex items-center justify-center shadow-lg">
            <ConfirmModal
              message="정말 카드를 삭제하겠습니까?"
              onCancel={() => setIsDeleting(false)}
              onConfirm={() => {
                handleDeleteCard();
              }}
            />
          </div>
        )}

        {/* 댓글 삭제 버튼 클릭시 확인 모달 렌더링 */}
        {deletingCommentId && (
          <div className="absolute z-20 flex items-center justify-center shadow-lg">
            <ConfirmModal
              message="정말 댓글을 삭제하겠습니까?"
              onCancel={() => setDeletingCommentId(null)}
              onConfirm={handleDeleteCommentConfirm}
            />
          </div>
        )}

        {/* API 호출 에러 처리 */}
        {errorMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <AlertModal
              message={errorMessage}
              onConfirm={() => setErrorMessage(null)}
            />
          </div>
        )}
      </ModalOverlay>
    </>
  );
}
