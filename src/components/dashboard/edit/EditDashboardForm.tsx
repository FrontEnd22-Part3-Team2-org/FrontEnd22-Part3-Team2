'use client';

import Button from '@/components/common/Button';
import ColorChip from '@/components/common/Chip/ColorChip';
import { Input } from '@/components/common/Input';
import { Dashboard } from '@/types/dashboard';
import { useState } from 'react';

interface EditDashboardFormProps {
  initialTitle: Dashboard['title'];
  initialColor: Dashboard['color'];
}

export default function EditDashboardForm({
  initialTitle,
  initialColor,
}: EditDashboardFormProps) {
  const [staticTitle] = useState(initialTitle);
  const [title, setTitle] = useState(initialTitle);
  const [selectedColor, setSelectedColor] = useState(initialColor);

  const isUnchanged = title === initialTitle && selectedColor === initialColor;

  return (
    <div className="px-[16px] py-[20px] md:px-[28px] md:py-[32px]">
      <div>
        <span className="text-xl-bold md:text-2xl-bold">{staticTitle}</span>
      </div>
      <div className="pt-[24px]">
        <span className="inline-block mb-[8px] text-lg-medium text-gray-700 md:text-2lg-medium">
          대시보드 이름
        </span>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="수정할 이름을 입력하세요"
        />
        <div className="mt-[16px]">
          <ColorChip
            onSelectedColor={(hex) => setSelectedColor(hex)}
            defaultColor={selectedColor}
          />
        </div>
        <div>
          <Button
            className="w-full h-[54px] mt-[32px] text-lg-semibold md:mt-[40px]"
            variant="primary"
            disabled={isUnchanged || !title.trim()}
          >
            변경
          </Button>
        </div>
      </div>
    </div>
  );
}
