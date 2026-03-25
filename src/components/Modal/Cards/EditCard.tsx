'use client';
/**
 * @file EditCard.tsx
 * @description 할 일 카드를 수정하는 모달 컴포넌트입니다.
 *
 * ### 할 일 수정 로직
 * 1. 부모로부터 카드 데이터 가져오기
 *    👉 GET /members API 호출 해서 멤버 리스트 가져오기
 *    👉 GET /columns API 호출해서 컬럼 목록 가져오기
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
import DropdownProgress from '@/components/common/Dropdown/DropdownProgress';
import ModalOverlay from '@/components/common/ModalBase/ModalOverlay';

/** 드롭다운으로 보여줄 전체 멤버 mock 데이터 */
const MOCK_ASSIGNEE: Assignee[] = [
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

interface EditCardProps {
  onModalClose: () => void;
  /** TODO : [수경] 카드의 기존 값 타입 정의 - API 연동 후 ? 지워야함 */
  defaultValues: Pick<
    Card,
    'title' | 'description' | 'tags' | 'dueDate' | 'assignee' | 'imageUrl'
  >;
}

export default function EditCard({
  onModalClose,
  defaultValues,
}: EditCardProps) {
  /**
   * TODO : [수경] 👇 아래 내용 API 호출 테스트로 확인 필요
   * id, teamId, columnId, dashboardId, createdAt, updatedAt은
   * 서버에서 생성되거나 외부에서 주입되는 값이라 폼 상태에 미포함
   */
  const [formData, setFormData] = useState(defaultValues);

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

  const handleProgress = () => {
    console.log('');
  };

  /** 타이틀 공통 CSS */
  const baseFontStyle = 'text-2lg-medium mb-2';

  return (
    <>
      <ModalOverlay onClose={onModalClose}>
        <ModalBase className="max-h-[calc(100vh-110px)] overflow-y-auto w-[584px] h-auto rounded-2xl text-gray-700 p-8 flex flex-col gap-8">
          <header>
            <h2 className="text-2xl-bold break-words">할 일 수정</h2>
          </header>

          <div className="flex flex-col sm:flex-row gap-8">
            {/* 진행 상태 */}
            <div>
              <p className={`${baseFontStyle}`}>상태</p>
              <DropdownProgress value="To Do" onChange={handleProgress} />
            </div>
            {/* 담당자 */}
            <div>
              <p className={`${baseFontStyle}`}>담당자</p>
              <DropdownAssignee
                members={MOCK_ASSIGNEE}
                defaultAssignee={formData.assignee}
                onSelect={(user) => {
                  setFormData((prev) => ({ ...prev, assignee: user }));
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
            defaultValue={formData.tags}
          />

          {/* 이미지 */}
          <div>
            <p className={`${baseFontStyle}`}>이미지</p>
            <ImageUploaderInput
              defaultUrl={formData.imageUrl}
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
            <Button variant="primary" className="flex-1">
              수정
            </Button>
          </div>
        </ModalBase>
      </ModalOverlay>
    </>
  );
}
