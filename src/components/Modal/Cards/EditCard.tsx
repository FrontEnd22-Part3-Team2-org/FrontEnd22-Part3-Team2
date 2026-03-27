'use client';
/**
 * @file EditCard.tsx
 * @description 할 일 카드를 수정하는 모달 컴포넌트입니다.
 *
 * ### 할 일 수정 로직
 * 1. 부모로부터 카드 데이터 가져오기
 *    👉 GET /members API 호출 해서 멤버 리스트 가져오기
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
import { Assignee, Card, Column, Member } from '@/types/dashboard';
import DateInput from '@/components/common/Input/DateInput';
import DropdownProgress from '@/components/common/Dropdown/DropdownProgress';
import ModalOverlay from '@/components/common/ModalBase/ModalOverlay';
import { getMembers, updateCard, uploadCardImage } from '@/api/dashboard';
import { formatDateTime } from '@/utils/formatDate';

interface EditCardProps {
  cardData: Card;
  columns: Column[];
  columnTitle: string;
  onModalClose: () => void;
  onSuccess?: () => void;
}

export default function EditCard({
  cardData,
  columns,
  columnTitle,
  onModalClose,
  onSuccess,
}: EditCardProps) {
  const [formData, setFormData] = useState<Card>(cardData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  /** 멤버 목록 조회 */
  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const data = await getMembers(formData.dashboardId);
        setMembers(data.members);
      } catch (error) {
        console.error('멤버 조회 실패', error);
        setError('카드를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [formData.dashboardId]);

  const handleSubmit = async () => {
    console.log('수정');
    console.log(columns);

    setIsLoading(true);
    try {
      // 1️⃣ 이미지가 있으면 먼저 업로드해서 URL 받기
      const imageUrl = imageFile
        ? (await uploadCardImage(formData.columnId, imageFile)).imageUrl
        : undefined;

      // 2️⃣ 카드 수정
      await updateCard(formData.id, {
        columnId: formData.columnId,
        title: formData.title,
        description: formData.description,
        // 선택 필드들은 값이 있을 때만 객체에 포함
        ...(selectedMemberId && { assigneeUserId: selectedMemberId }),
        ...(formData.tags.length > 0 && { tags: formData.tags }),
        ...(formData.dueDate && { dueDate: formData.dueDate }),
        ...(imageUrl && { imageUrl }),
      });
      console.log('카드 수정 완료');
      onSuccess?.(); // ✅ 부모에게 "수정 완료" 알림
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
            <h2 className="text-2xl-bold break-words">할 일 수정</h2>
          </header>

          <div className="flex flex-col sm:flex-row gap-8">
            {/* 진행 상태 */}
            <div>
              <p className={`${baseFontStyle}`}>상태</p>
              <DropdownProgress
                columns={columns}
                columnTitle={columnTitle}
                onChange={(status) =>
                  setFormData((prev) => ({ ...prev, columnId: status.id }))
                }
              />
            </div>
            {/* 담당자 */}
            <div>
              <p className={`${baseFontStyle}`}>담당자</p>
              <DropdownAssignee
                members={members}
                defaultAssignee={formData.assignee}
                onSelect={(id) => {
                  setSelectedMemberId(id);
                }}
              />
            </div>
          </div>

          {/* 제목 */}
          <Input
            label="제목"
            placeholder="제목을 입력해 주세요"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          {/* 설명 */}
          <Textarea
            label="설명"
            placeholder="설명을 입력해 주세요"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />

          {/* 마감일 */}
          <DateInput
            defaultDate={formData.dueDate}
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
            defaultValue={formData.tags}
          />

          {/* 이미지 */}
          <div>
            <p className={`${baseFontStyle}`}>이미지</p>
            <ImageUploaderInput
              onUpload={(file) => setImageFile(file)}
              defaultUrl={cardData.imageUrl}
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
              {isLoading ? '수정 중...' : '수정'}
            </Button>
          </div>
        </ModalBase>
      </ModalOverlay>
    </>
  );
}
