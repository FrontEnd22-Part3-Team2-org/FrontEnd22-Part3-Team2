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
import { useEffect, useState } from 'react';
import { Member } from '@/types/dashboard';
import DateInput from '@/components/common/Input/DateInput';
import ModalOverlay from '@/components/common/ModalBase/ModalOverlay';
import { createCard, getMembers } from '@/api/dashboard';
import { formatDateTime } from '@/utils/formatDate';

interface CreateCardForm {
  title: string;
  description: string;
  tags: string[];
  dueDate: string | null;
  imageUrl?: string;
}

const INITIAL_FORM: CreateCardForm = {
  title: '',
  description: '',
  tags: [],
  dueDate: null,
};

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
  const [formData, setFormData] = useState<CreateCardForm>(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  /** 1️⃣ 멤버 목록 조회 */
  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const data = await getMembers(dashboardId);
        setMembers(data.members);
        console.log('멤버 데이터', data);
      } catch (error) {
        console.error('멤버 조회 실패', error);
        setError('카드를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [dashboardId]);

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) return;

    setIsLoading(true);

    try {
      await createCard({
        dashboardId,
        columnId,
        title: formData.title,
        description: formData.description,
        // 선택 필드들은 값이 있을 때만 객체에 포함
        ...(selectedMemberId && { assigneeUserId: selectedMemberId }),
        ...(formData.tags.length > 0 && { tags: formData.tags }),
        ...(formData.dueDate && { dueDate: formData.dueDate }),
        ...(formData.imageUrl && { imageUrl: formData.imageUrl }),
      });
      console.log('폼 데이터', formData);
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
              members={members}
              onSelect={(id) => {
                setSelectedMemberId(id);
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
            onDateChange={(date) => {
              setFormData((prev) => ({
                ...prev,
                dueDate: date ? formatDateTime(date.toISOString()) : null,
              }));
            }}
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
              onUpload={(url) => {
                setFormData((prev) => ({ ...prev, imageUrl: url }));
                console.log(url);
              }}
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
