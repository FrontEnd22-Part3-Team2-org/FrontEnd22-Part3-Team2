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
 * 2. 10개 이상 시 스크롤 바닥 도달 → 자동으로 다음 댓글 로드 (무한 스크롤)
 *
 * @author 수경
 *
 */

import StatusChip from '../../common/Chip/StatusChip';
import TagChip from '../../common/Chip/TagChip';
import KebabMenuIcon from '../../common/Icon/KebabMenuIcon';
import XIcon from '../../common/Icon/XIcon';
import DropdownMenu from '../../common/Dropdown/DropdownMenu';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Card, Column, Comments } from '@/types/dashboard';
import AssigneeItem from './AssigneeItem';
import ReplyItem from './ReplyItem';
import Image from 'next/image';
import ModalBase from '@/components/common/ModalBase';
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
import Skeleton from '@/components/common/Skeleton/Skeleton';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import Button from '@/components/common/Button';

/** 한 번에 불러올 댓글 수 */
const COMMENTS_SIZE = 10;

interface CardsProps {
  onModalClose: () => void;
  cardId: number;
  dashboardId: number;
}

interface ConfirmModalProps {
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

function DeleteConfirmModal({
  message,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <ModalBase className="w-screen mobile:w-[400px] rounded-[16px] p-[24px]">
      <p className="mb-[24px] text-center text-lg-medium text-gray-700">
        {message}
      </p>

      <div className="flex gap-[14px] flex-col mobile:flex-row">
        <Button
          variant="secondary"
          size="modal_sm"
          onClick={onCancel}
          className="w-auto mobile:flex-1"
        >
          취소
        </Button>

        <Button
          variant="primary"
          size="modal_sm"
          onClick={onConfirm}
          className="w-auto mobile:flex-1"
        >
          삭제
        </Button>
      </div>
    </ModalBase>
  );
}

function CardSkeleton({ onModalClose }: { onModalClose: () => void }) {
  return (
    <ModalOverlay onClose={onModalClose}>
      <ModalBase className="relative w-full md:w-fit max-h-[calc(100vh-110px)] overflow-y-auto flex flex-col-reverse md:flex-row md:gap-[14px] gap-4 text-gray-700 rounded-lg px-[30px] py-6 mx-6 md:m-0">
        {/* 좌측 영역 */}
        <div className="flex flex-col md:max-w-[450px] md:min-w-[450px] animate-pulse">
          {/* 제목 */}
          <div className="mb-2 md:mb-6">
            <Skeleton className="h-8 w-3/4 rounded-md" />
          </div>

          {/* 진행 상태 및 태그 */}
          <div className="flex items-center gap-5 mb-4 md:mb-[17px]">
            <Skeleton className="h-6 w-20 rounded-full" />
            <div className="w-[1px] h-5 bg-gray-300" />
            <div className="flex gap-[6px]">
              <Skeleton className="h-6 w-14 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </div>

          {/* 설명 */}
          <div className="flex flex-col gap-2 min-h-[100px] p-[10px] mb-8 md:mb-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-4/6 rounded" />
          </div>

          {/* 이미지 */}
          <Skeleton className="w-full h-[160px] md:h-[260px] rounded-md mb-6 md:mb-4" />

          {/* 댓글 */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-24 w-full rounded-md" />
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex gap-[10px]">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                </div>
              </div>
              <div className="flex gap-[10px]">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 우측 영역 */}
        <div className="flex flex-col items-end gap-6 min-w-[200px] w-full animate-pulse">
          {/* 메뉴, 닫기 버튼 */}
          <div className="flex gap-6">
            <Skeleton className="w-7 h-7 rounded" />
            <Skeleton className="w-7 h-7 rounded" />
          </div>

          {/* 담당자 */}
          <div className="hidden md:flex flex-col gap-3 w-full">
            <Skeleton className="h-4 w-16 rounded" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
            <Skeleton className="h-4 w-16 rounded mt-2" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>
      </ModalBase>
    </ModalOverlay>
  );
}

export default function Cards({
  onModalClose,
  cardId,
  dashboardId,
}: CardsProps) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [columnTitle, setColumnTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // API 호출 에러 처리
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // 드롭다운 열림 상태
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(
    null,
  );

  /** 댓글 무한 스크롤 상태 */
  const [commentsList, setCommentsList] = useState<Comments[]>([]); // 누적된 댓글 배열
  const [cursorId, setCursorId] = useState<number | null>(null); // 다음 페이지 요청에 사용할 커서 ID
  const [hasMore, setHasMore] = useState(true); // 다음 페이지 존재 여부
  const [isFetchingMore, setIsFetchingMore] = useState(false); // 추가 로딩 중 여부 (중복 요청 방지용 guard)

  /** IntersectionObserver가 감시할 댓글 맨 마지막 div */
  const sentinelRef = useRef<HTMLDivElement>(null);

  /**
   * 댓글 스크롤 컨테이너 ref
   * IntersectionObserver의 root로 지정해 뷰포트 대신 이 컨테이너 기준으로 교차를 감지
   */
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleCloseMenu = () => setIsMenuOpen(false);
  const menuRef = useDropdownClose(handleCloseMenu); // 드롭다운 외부 클릭 시 닫기 구현

  /** 카드 삭제 API 호출 핸들러 */
  const handleDeleteCard = async () => {
    try {
      await deleteCard(cardId);
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.columns(dashboardId), 'cards'],
      });
      onModalClose();
    } catch (error) {
      setErrorMessage('카드 삭제에 실패했습니다.');
    }
  };

  /** 댓글 삭제 API 호출 핸들러 */
  const handleDeleteCommentConfirm = async () => {
    if (!deletingCommentId) return;
    try {
      await deleteComments(deletingCommentId);
      // 삭제 후 커서 초기화 → 처음부터 다시 조회
      setCursorId(null);
      setHasMore(true);
      await fetchComments(null, true);
    } catch (error) {
      console.error('댓글 삭제 실패', error);
      setErrorMessage('댓글 삭제에 문제가 발생했습니다.');
    } finally {
      setDeletingCommentId(null);
    }
  };

  /** 수정 완료 핸들러 */
  const handleEditSuccess = () => {
    setIsEditing(false);
    queryClient.invalidateQueries({
      queryKey: [...QUERY_KEYS.columns(dashboardId), 'cards'],
    });
    queryClient.invalidateQueries({
      queryKey: ['card', cardId], // 카드 모달 업데이트
    });
  };

  /** 1️⃣ 카드 조회 */
  const queryClient = useQueryClient();

  const {
    data: card,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['card', cardId],
    queryFn: () => readCard(cardId),
  });

  /** 2️⃣ 댓글 목록 조회 (cursorId 기반 무한 스크롤) */
  /**
   * @param cursor - 요청할 커서 ID. null이면 첫 페이지부터 조회
   * @param reset  - true면 기존 목록을 비우고 처음부터 재조회 (작성/삭제 후 리셋 시 사용)
   */
  const fetchComments = useCallback(
    async (cursor: number | null = null, reset = false) => {
      // reset이 아닌 일반 추가 로딩 중에는 중복 요청 방지
      if (!reset && isFetchingMore) return;

      setIsFetchingMore(true);
      try {
        const res = await getComments(
          cardId,
          COMMENTS_SIZE,
          cursor ?? undefined,
        );

        // reset: 새 배열로 교체 / 일반: 기존 배열에 누적
        setCommentsList((prev) =>
          reset ? res.comments : [...prev, ...res.comments],
        );

        const nextCursor = res.cursorId;
        setCursorId(nextCursor);

        // 더 이상 없으면 false
        setHasMore(
          res.comments.length === COMMENTS_SIZE && nextCursor !== null,
        );

        // 받아온 개수 < COMMENTS_SIZE → 마지막 페이지
        setHasMore(
          res.comments.length === COMMENTS_SIZE && res.cursorId !== null,
        );
      } catch (error) {
        console.error('댓글 조회 실패', error);
        setErrorMessage('댓글 목록 조회에 문제가 발생했습니다.');
      } finally {
        setIsFetchingMore(false);
      }
    },
    // isFetchingMore를 deps에 넣으면 무한 루프 발생 → 의도적으로 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cardId],
  );

  /** 최초 댓글 로드 */
  useEffect(() => {
    fetchComments(null, true);
  }, [fetchComments]);

  /** 3️⃣ IntersectionObserver — sentinel 감지 → 다음 페이지 로드 */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = scrollContainerRef.current;
    if (!sentinel || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // sentinel이 컨테이너 안에 보이고 + 추가 데이터 있고 + 로딩 중 아닐 때만 fetch
        if (entry.isIntersecting && hasMore && !isFetchingMore) {
          fetchComments(cursorId);
        }
      },
      {
        root: container, // 뷰포트 대신 댓글 스크롤 컨테이너를 기준으로 교차 감지
        threshold: 0.1,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isFetchingMore, cursorId, fetchComments]);

  /** 2️⃣ 컬럼 조회 + columnTitle 찾기  */
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

  useEffect(() => {
    if (!card?.columnId || columns.length === 0) return;
    const foundColumn = columns.find((col) => col.id === card.columnId);
    setColumnTitle(foundColumn?.title ?? '');
  }, [card?.columnId, columns]);

  /** 렌더링 분기 */
  if (isLoading || isError) return <CardSkeleton onModalClose={onModalClose} />;
  if (!card) return null;

  const { title, description, tags, dueDate, assignee, imageUrl } =
    card as Card;

  /** 수정 모달 렌더링 */
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
        <ModalBase className="px-4 mobile:px-[30px] py-6 relative w-full md:w-fit max-h-[calc(100vh-110px)] overflow-y-auto flex flex-col-reverse md:flex-row md:gap-[14px] gap-4 text-gray-700 rounded-lg">
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
            <div className="flex items-center mb-4 md:mb-[17px] h-8">
              {/* 진행 상태 */}
              <div className="w-fit max-w-[140px] mr-5">
                <StatusChip status={columnTitle} />
              </div>
              {/* 구분선 */}
              <div className="w-[1px] h-5 bg-gray-300 mr-5"></div>
              {/* 태그 */}
              <div className="flex items-center gap-[6px] overflow-x-auto">
                {tags.map((tag) => {
                  return (
                    <div key={tag}>
                      <TagChip label={tag} className={'w-max'} />
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
              <div className="relative w-full min-h-[160px] md:max-w-[445px] overflow-hidden md:h-[260px] rounded-md bg-gray-300 mb-6 md:mb-4">
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
                onSuccess={() => {
                  // 댓글 작성 후 목록 처음부터 리셋
                  setCursorId(null);
                  setHasMore(true);
                  fetchComments(null, true);
                }}
              />
              {/* ──────────────────────────────────────────
                  댓글 리스트 (무한 스크롤)
                  - scrollContainerRef: IntersectionObserver의 root
                  - sentinelRef 목록 끝에 위치, 화면에 진입하면 다음 페이지 로드
              ────────────────────────────────────────── */}
              <div
                ref={scrollContainerRef}
                className="max-h-[80px] mb-0 mt-4 md:mb-6 md:mt-6 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-300 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full"
              >
                {commentsList.length > 0 ? (
                  <>
                    {commentsList.map((comment) => (
                      <ReplyItem
                        key={comment.id}
                        comment={comment}
                        onDeleteClick={(id) => setDeletingCommentId(id)}
                      />
                    ))}

                    {/* sentinel: 스크롤 끝에 도달하면 다음 페이지 자동 로드 */}
                    <div ref={sentinelRef} className="h-4" />

                    {/* 추가 로딩 인디케이터 */}
                    {isFetchingMore && (
                      <p className="text-md-medium text-gray-400 text-center py-2">
                        불러오는 중...
                      </p>
                    )}

                    {/* 마지막 페이지 안내 (10개 이상일 때만 노출) */}
                    {!hasMore && commentsList.length >= COMMENTS_SIZE && (
                      <p className="text-md-medium text-gray-400 text-center py-2">
                        모든 댓글을 불러왔습니다.
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-md-medium text-gray-400 text-center py-2">
                    댓글이 없습니다.
                  </div>
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
                    onEdit={() => {
                      setIsEditing(true);
                      handleCloseMenu();
                    }}
                    onDelete={() => setIsDeleting(true)}
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
          <ModalOverlay onClose={() => setIsDeleteOpen(false)}>
            <DeleteConfirmModal
              message="정말 카드를 삭제하겠습니까?"
              onCancel={() => setIsDeleting(false)}
              onConfirm={() => {
                handleDeleteCard();
              }}
            />
          </ModalOverlay>
        )}

        {/* 댓글 삭제 버튼 클릭시 확인 모달 렌더링 */}
        {deletingCommentId && (
          <ModalOverlay onClose={() => setIsDeleteOpen(false)}>
            {/* <div className="absolute z-20 flex items-center justify-center shadow-lg"> */}
            <DeleteConfirmModal
              message="정말 댓글을 삭제하겠습니까?"
              onCancel={() => setDeletingCommentId(null)}
              onConfirm={handleDeleteCommentConfirm}
            />
            {/* </div> */}
          </ModalOverlay>
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
