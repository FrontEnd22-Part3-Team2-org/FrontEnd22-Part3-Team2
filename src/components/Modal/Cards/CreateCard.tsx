'use client';
/**
 * @file CreateCard.tsx
 * @description 할 일 카드를 생성하는 모달 컴포넌트입니다.
 *
 * ### 할 일 생성 로직
 * 1. GET /members API 호출
 * 2. 대시보드 멤버 목록 가져오기
 * 3. 인풋 입력 후 생성 버튼 클릭 시 POST /cards API 호출
 *
 * @author 수경
 *
 */

import ModalBase from '@/components/common/ModalBase';
import DropdownAssignee from '@/components/common/Dropdown/DropdownAssignee';
import { Input, Textarea } from '@/components/common/Input';
import ImageUploaderInput from '@/components/common/Input/ImageUploaderInput';
import Button from '@/components/common/Button';
import { useState } from 'react';
import { Assignee, Card } from '@/types/dashboard';
import DateInput from '@/components/common/Input/DateInput';
import ModalOverlay from '@/components/common/ModalBase/ModalOverlay';
import { createCard } from '@/api/dashboard';

/** 드롭다운으로 보여줄 전체 멤버 mock 데이터 */
const MOCK_MEMBERS: Assignee[] = [
  {
    id: 1,
    nickname: '공민수',
    profileImageUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    nickname: '이지은',
    profileImageUrl: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 3,
    nickname: '김현우',
    profileImageUrl: '',
  },
  {
    id: 4,
    nickname: '이수빈',
    profileImageUrl: '',
  },
  {
    id: 5,
    nickname: '문지훈',
    profileImageUrl: 'https://i.pravatar.cc/150?img=5',
  },
];

interface CreateCardProps {
  dashboardId: number;
  columnId: number;
  onModalClose: () => void;
}

export default function CreateCard({
  dashboardId,
  columnId,
  onModalClose,
}: CreateCardProps) {
  /**
   * id, createdAt, updatedAt은 서버에서 생성되어 폼 상태에 미포함
   * dashboardId, columnId는 props로 받아야 함
   */
  const [formData, setFormData] = useState<
    Pick<
      Card,
      'title' | 'description' | 'tags' | 'dueDate' | 'assignee' | 'imageUrl'
    >
  >({
    title: '',
    description: '',
    tags: [],
    dueDate: null,
    assignee: null,
    imageUrl: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    console.log(formData);
    setIsLoading(true);
    try {
      await createCard({
        dashboardId,
        columnId,
        title: formData.title,
        description: formData.description,
        ...(formData.assignee && { assigneeUserId: formData.assignee.id }),
        ...(formData.dueDate && { dueDate: formData.dueDate }),
        ...(formData.tags?.length && { tags: formData.tags }),
        ...(formData.imageUrl && { imageUrl: formData.imageUrl }),
      });
      onModalClose();
    } catch (error) {
      console.error('카드 생성 실패', error);
      // TODO: 에러 처리
    } finally {
      setIsLoading(false);
    }
  };

  /** 태그 입력 - Enter 키로 추가 */
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (!value) return;
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, value] }));
      e.currentTarget.value = '';
    }
  };

  /** 타이틀 공통 CSS */
  const baseFontStyle = 'text-2lg-medium mb-2';

  return (
    <>
      <ModalOverlay onClose={onModalClose}>
        <ModalBase className="max-h-[calc(100vh-110px)] overflow-y-auto w-[584px] h-auto rounded-2xl text-gray-700 p-8 flex flex-col gap-8 mx-6 md:m-0">
          <header>
            <h2 className="text-2xl-bold break-words">할 일 생성</h2>
          </header>

          {/* 담당자 */}
          <div className="">
            <p className={`${baseFontStyle}`}>담당자</p>
            <DropdownAssignee
              members={MOCK_MEMBERS}
              onSelect={(user) => {
                setFormData((prev) => ({ ...prev, assignee: user }));
              }}
            />
          </div>

          {/* 제목 */}
          <Input
            label="제목"
            // placeholder="제목을 입력해 주세요"
            placeholder="(임시) 필수 입력 값입니다."
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          {/* 설명 */}
          <Textarea
            label="설명"
            // placeholder="설명을 입력해 주세요"
            placeholder="(임시) 필수 입력 값입니다."
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />

          {/* 마감일 */}
          <DateInput
            onDateChange={(date) =>
              setFormData((prev) => ({
                ...prev,
                dueDate: date ? date.toISOString() : null,
              }))
            }
          />

          {/* 태그 */}
          <Input
            label="태그"
            placeholder="입력 후 Enter"
            onKeyDown={handleTagKeyDown}
          />

          {/* 이미지 */}
          {/* TODO: [수경] 이미지 업로드 API 연동 */}
          <div>
            <p className={`${baseFontStyle}`}>이미지</p>
            <ImageUploaderInput
              onUpload={(url) =>
                setFormData((prev) => ({ ...prev, imageUrl: url }))
              }
            />
          </div>

          {/* 생성,취소 버튼 */}
          <div className="relative flex items-stretch gap-2 h-[54px]">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={onModalClose}
            >
              취소
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? '생성 중...' : '생성'}
            </Button>
          </div>
        </ModalBase>
      </ModalOverlay>
    </>
  );
}
