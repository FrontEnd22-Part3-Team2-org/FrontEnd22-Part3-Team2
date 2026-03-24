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
import { Card } from '@/types/dashboard';
import DateInput from '@/components/common/Input/DateInput';

interface CreateCardProps {
  onModalClose: () => void;
}

export default function CreateCard({ onModalClose }: CreateCardProps) {
  /**
   * TODO : [수경] 👇 아래 내용 API 호출 테스트로 확인 필요
   * id, teamId, columnId, dashboardId, createdAt, updatedAt은
   * 서버에서 생성되거나 외부에서 주입되는 값이라 폼 상태에 미포함
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

  console.log('FORMDATA', formData);

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
    // 오버레이 배경
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <ModalBase className="max-h-[calc(100vh-110px)] overflow-y-auto w-[584px] h-auto rounded-2xl text-gray-700 p-8 flex flex-col gap-8">
        <header>
          <h2 className="text-2xl-bold break-words">할 일 생성</h2>
        </header>

        {/* 담당자 */}
        <div className="">
          <p className={`${baseFontStyle}`}>담당자</p>
          <DropdownAssignee
            onSelect={(user) => {
              setFormData((prev) => ({ ...prev, assignee: user }));
            }}
          />
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
          <Button variant="secondary" className="flex-1" onClick={onModalClose}>
            취소
          </Button>
          <Button variant="primary" className="flex-1">
            생성
          </Button>
        </div>
      </ModalBase>
    </div>
  );
}
